"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyDashboardPage() {
  const [stats, setStats] = useState({
    internships: 0,
    applications: 0,
    interviews: 0,
    offers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load company-specific statistics
      const user = await api.getMe();
      // For now, use placeholder stats - will need to implement actual API calls
      setStats({
        internships: 0,
        applications: 0,
        interviews: 0,
        offers: 0,
      });
    } catch (e) {
      console.error("Failed to load stats:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="ภาพรวม" subtitle="สรุปข้อมูลบริษัท">
        <div className="card" style={{ padding: 24 }}>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="COMPANY" title="ภาพรวม" subtitle="สรุปข้อมูลบริษัท">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, background: "#DBEAFE", borderLeft: "4px solid #3B82F6" }}>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>ประกาศฝึกงาน</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{stats.internships}</p>
        </div>
        <div className="card" style={{ padding: 20, background: "#FEF3C7", borderLeft: "4px solid #F59E0B" }}>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>ใบสมัคร</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{stats.applications}</p>
        </div>
        <div className="card" style={{ padding: 20, background: "#D1FAE5", borderLeft: "4px solid #10B981" }}>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>นัดสัมภาษณ์</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{stats.interviews}</p>
        </div>
        <div className="card" style={{ padding: 20, background: "#F3E8FF", borderLeft: "4px solid #8B5CF6" }}>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>ข้อเสนอ</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{stats.offers}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>ยินดีต้อนรับสู่ระบบฝึกงาน</h3>
        <p style={{ fontSize: 14, color: "#64748B" }}>
          จัดการประกาศฝึกงาน, ตรวจสอบใบสมัคร, นัดสัมภาษณ์, และส่งข้อเสนอให้นักศึกษา
        </p>
      </div>
    </RoleDashboardShell>
  );
}
