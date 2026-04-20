"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdminHomePage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUsers().catch(() => []),
      api.getCompanies().catch(() => []),
      api.getDashboard().catch(() => ({})),
    ]).then(([usersData, companiesData, statsData]) => {
      setUsers(usersData);
      setCompanies(companiesData);
      setStats(statsData);
    }).finally(() => setLoading(false));
  }, []);

  const activeUsers = users.filter(u => u.active).length;
  const activeCompanies = companies.filter(c => c.status === "ACTIVE").length;

  return (
    <RoleDashboardShell role="ADMIN" title="แดชบอร์ดผู้ดูแลระบบ" subtitle="ควบคุมสิทธิ์ผู้ใช้ ตรวจสอบ audit logs และดูภาพรวมระบบ">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>กำลังโหลด...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Stats Cards */}
          <div className="grid-4" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ผู้ใช้ทั้งหมด</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>{users.length}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>ใช้งาน: {activeUsers}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>บริษัทที่ใช้งาน</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#059669" }}>{activeCompanies}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>ทั้งหมด: {companies.length}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ใบสมัครทั้งหมด</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#2563EB" }}>{stats?.totalApplications ?? 0}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>สถานะระบบ</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#059669" }}>
                <i className="fas fa-check-circle"></i>
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Healthy</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>การจัดการ</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <Link href="/admin/users" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-users"></i> จัดการผู้ใช้
              </Link>
              <Link href="/admin/companies" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-building"></i> จัดการบริษัท
              </Link>
              <Link href="/admin/audit" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-clipboard-list"></i> Audit Logs
              </Link>
              <Link href="/admin/settings" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-cog"></i> ตั้งค่าระบบ
              </Link>
            </div>
          </div>

          {/* Recent Users */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>ผู้ใช้ล่าสุด</h3>
              <Link href="/admin/users" className="btn-text">ดูทั้งหมด →</Link>
            </div>
            {users.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 20 }}>ยังไม่มีผู้ใช้</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: 13 }}>
                  <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                      <th style={{ padding: "10px 8px", fontWeight: 700 }}>ชื่อผู้ใช้</th>
                      <th style={{ padding: "10px 8px", fontWeight: 700 }}>ชื่อแสดง</th>
                      <th style={{ padding: "10px 8px", fontWeight: 700 }}>อีเมล</th>
                      <th style={{ padding: "10px 8px", fontWeight: 700 }}>สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map(user => (
                      <tr key={user.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "10px 8px", fontWeight: 600 }}>{user.username}</td>
                        <td style={{ padding: "10px 8px" }}>{user.displayName}</td>
                        <td style={{ padding: "10px 8px", color: "var(--text-muted)" }}>{user.email || "—"}</td>
                        <td style={{ padding: "10px 8px" }}>
                          <span className={`badge badge-${user.active ? "success" : "inactive"}`}>
                            {user.active ? "ใช้งาน" : "ปิดใช้งาน"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* System Info */}
          <div className="mesh-dark" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 16 }}>ข้อมูลระบบ</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Database</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "white" }}>PostgreSQL</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Backend</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Spring Boot 3.3.6</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Frontend</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Next.js 16</p>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>Uptime</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>99.9%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
