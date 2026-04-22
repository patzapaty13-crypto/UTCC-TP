"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import Link from "next/link";

export default function AdvisorDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Use mock data for now
      await new Promise(resolve => setTimeout(resolve, 500));
      setStats({
        totalStudents: 12,
        pendingReports: 5,
        pendingApprovals: 3,
        unreadNotifications: 2,
        recentActivities: [
          { title: "นักศึกษาส่งรายงานใหม่", description: "สมชาย ใจดี ส่งรายงานสัปดาห์ที่ 4", icon: "fa-file-lines", color: "#F59E0B", time: "2 ชั่วโมงที่แล้ว" },
          { title: "คำขออนุมัติใหม่", description: "วิภา สุขใจ ขออนุมัติเอกสาร", icon: "fa-circle-check", color: "#10B981", time: "5 ชั่วโมงที่แล้ว" },
          { title: "การแจ้งเตือนใหม่", description: "มีการแจ้งเตือนจากระบบ", icon: "fa-bell", color: "#2563EB", time: "1 วันที่แล้ว" },
        ]
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="ADVISOR" title="ภาพรวม" subtitle="Dashboard อาจารย์ที่ปรึกษา">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="ADVISOR" title="ภาพรวม" subtitle="Dashboard อาจารย์ที่ปรึกษา">
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 24 }}>
        <StatCard
          title="นักศึกษาในความดูแล"
          value={stats?.totalStudents || 0}
          icon="fa-user-graduate"
          color="#7C3AED"
          link="/advisor/students"
        />
        <StatCard
          title="รายงานที่ต้องตรวจ"
          value={stats?.pendingReports || 0}
          icon="fa-file-lines"
          color="#F59E0B"
          link="/advisor/reports"
        />
        <StatCard
          title="คำขออนุมัติ"
          value={stats?.pendingApprovals || 0}
          icon="fa-circle-check"
          color="#10B981"
          link="/advisor/approvals"
        />
        <StatCard
          title="การแจ้งเตือน"
          value={stats?.unreadNotifications || 0}
          icon="fa-bell"
          color="#2563EB"
          link="/advisor/notifications"
        />
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
          <i className="fas fa-bolt" style={{ color: "#F59E0B", marginRight: 8 }}></i>
          การกระทำด่วน
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <QuickAction
            href="/advisor/students"
            icon="fa-user-graduate"
            label="นักศึกษาในความดูแล"
            color="#7C3AED"
          />
          <QuickAction
            href="/advisor/reports"
            icon="fa-file-lines"
            label="ตรวจรายงาน"
            color="#F59E0B"
          />
          <QuickAction
            href="/advisor/approvals"
            icon="fa-circle-check"
            label="อนุมัติเอกสาร"
            color="#10B981"
          />
          <QuickAction
            href="/advisor/notifications"
            icon="fa-bell"
            label="การแจ้งเตือน"
            color="#2563EB"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
          <i className="fas fa-history" style={{ color: "#64748B", marginRight: 8 }}></i>
          กิจกรรมล่าสุด
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {!stats || stats.recentActivities?.length === 0 ? (
            <p className="text-muted" style={{ textAlign: "center", padding: 20 }}>
              ยังไม่มีกิจกรรม
            </p>
          ) : (
            stats?.recentActivities?.map((activity, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  background: "#F8FAFC",
                  borderRadius: 12
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: activity.color + "15",
                    color: activity.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14
                  }}
                >
                  <i className={`fas ${activity.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>
                    {activity.title}
                  </p>
                  <p style={{ fontSize: 12, color: "#64748B" }}>
                    {activity.description}
                  </p>
                </div>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>
                  {activity.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </RoleDashboardShell>
  );
}

function StatCard({ title, value, icon, color, link }) {
  return (
    <Link
      href={link}
      className="card"
      style={{
        textDecoration: "none",
        padding: 24,
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderTop: `4px solid ${color}`,
        transition: "all 0.2s",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: color + "15",
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20
        }}
      >
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>
          {title}
        </p>
        <p style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>{value}</p>
      </div>
    </Link>
  );
}

function QuickAction({ href, icon, label, color }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        padding: 16,
        background: "#F8FAFC",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "all 0.2s",
        border: "1px solid #E2E8F0"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = color + "10";
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#F8FAFC";
        e.currentTarget.style.borderColor = "#E2E8F0";
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: color + "15",
          color: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16
        }}
      >
        <i className={`fas ${icon}`}></i>
      </div>
      <span style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{label}</span>
    </Link>
  );
}
