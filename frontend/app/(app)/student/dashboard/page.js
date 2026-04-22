"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getDashboard();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="STUDENT" title="ภาพรวม" subtitle="Dashboard นักศึกษา">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="STUDENT" title="ภาพรวม" subtitle="Dashboard นักศึกษา">
      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20, marginBottom: 24 }}>
        <StatCard
          title="ใบสมัคร"
          value={stats?.totalApplications || 0}
          icon="fa-paper-plane"
          color="#10B981"
          link="/student/applications"
        />
        <StatCard
          title="นัดสัมภาษณ์"
          value={stats?.pendingInterviews || 0}
          icon="fa-calendar-check"
          color="#7C3AED"
          link="/student/interviews"
        />
        <StatCard
          title="ข้อเสนองาน"
          value={stats?.totalOffers || 0}
          icon="fa-file-contract"
          color="#F59E0B"
          link="/student/offers"
        />
        <StatCard
          title="รายงาน"
          value={stats?.totalReports || 0}
          icon="fa-file-lines"
          color="#2563EB"
          link="/student/reports"
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
            href="/student/internships"
            icon="fa-search"
            label="ค้นหาฝึกงาน"
            color="#2563EB"
          />
          <QuickAction
            href="/student/applications"
            icon="fa-clipboard-list"
            label="ใบสมัครของฉัน"
            color="#10B981"
          />
          <QuickAction
            href="/student/interviews"
            icon="fa-calendar-check"
            label="นัดสัมภาษณ์"
            color="#7C3AED"
          />
          <QuickAction
            href="/student/reports"
            icon="fa-file-lines"
            label="รายงานฝึกงาน"
            color="#F59E0B"
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
