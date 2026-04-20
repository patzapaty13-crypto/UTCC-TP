"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StaffHomePage() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboard().catch(() => ({})),
      api.getApplications().catch(() => []),
      api.getCompanies().catch(() => []),
    ]).then(([dashData, appsData, companiesData]) => {
      setStats(dashData);
      setApplications(appsData.slice(0, 5));
      setCompanies(companiesData.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const pendingApps = applications.filter(a => a.status === "PENDING").length;
  const activeCompanies = companies.filter(c => c.status === "ACTIVE").length;

  return (
    <RoleDashboardShell role="STAFF" title="แดชบอร์ดเจ้าหน้าที่" subtitle="งานอนุมัติเอกสาร ตรวจสอบบริษัท และดูสถิติการฝึกงานระดับหน่วยงาน">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>กำลังโหลด...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Stats Cards */}
          <div className="grid-4" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ตำแหน่งเปิดรับ</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>{stats?.activeJobs ?? 0}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ใบสมัครทั้งหมด</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>{stats?.totalApplications ?? 0}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>รอพิจารณา</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#F59E0B" }}>{pendingApps}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>บริษัทใช้งาน</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#059669" }}>{activeCompanies}</p>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>ใบสมัครล่าสุด</h3>
              <Link href="/applications" className="btn-text">ดูทั้งหมด →</Link>
            </div>
            {applications.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 20 }}>ยังไม่มีใบสมัคร</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {applications.map(app => (
                  <div key={app.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{app.studentName || "นักศึกษา"}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{app.positionTitle || "ตำแหน่ง"}</p>
                    </div>
                    <span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Companies */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>บริษัทพันธมิตร</h3>
              <Link href="/admin/companies" className="btn-text">จัดการ →</Link>
            </div>
            {companies.length === 0 ? (
              <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 20 }}>ยังไม่มีบริษัท</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {companies.map(company => (
                  <div key={company.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{company.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{company.industry || "อุตสาหกรรม"}</p>
                    </div>
                    <span className={`badge badge-${company.status?.toLowerCase()}`}>{company.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
