"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function StaffDashboard() {
  const [stats, setStats] = useState({ apps: 0, companies: 0, students: 0, advisors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [apps, companies, users] = await Promise.all([
          api.getApplications().catch(() => []),
          api.getCompanies().catch(() => []),
          api.getUsers().catch(() => []),
        ]);
        setStats({
          apps: (apps || []).length,
          companies: (companies || []).length,
          students: (users || []).filter(u => u.roles?.includes("STUDENT")).length,
          advisors: (users || []).filter(u => u.roles?.includes("ADVISOR")).length,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <RoleDashboardShell role="STAFF" title="ภาพรวมเจ้าหน้าที่" subtitle="Dashboard สำหรับเจ้าหน้าที่โครงการ">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        <StatCard title="ใบสมัครทั้งหมด" value={stats.apps} icon="fa-clipboard-list" color="#F59E0B" link="/staff/applications" loading={loading} />
        <StatCard title="บริษัทพันธมิตร" value={stats.companies} icon="fa-building" color="#2563EB" link="/staff/companies" loading={loading} />
        <StatCard title="นักศึกษา" value={stats.students} icon="fa-user-graduate" color="#7C3AED" link="/staff/assign-advisor" loading={loading} />
        <StatCard title="อาจารย์ที่ปรึกษา" value={stats.advisors} icon="fa-user-tie" color="#059669" link="/staff/assign-advisor" loading={loading} />
      </div>

      <div className="card" style={{ padding: 24, marginTop: 20 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 14 }}>
          <i className="fas fa-bolt" style={{ color: "#F59E0B", marginRight: 8 }}></i>การกระทำด่วน
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <QA href="/staff/applications" icon="fa-clipboard-list" label="ตรวจใบสมัคร" color="#F59E0B" />
          <QA href="/staff/companies" icon="fa-building" label="จัดการบริษัท" color="#2563EB" />
          <QA href="/staff/assign-advisor" icon="fa-user-plus" label="กำหนดอาจารย์ที่ปรึกษา" color="#7C3AED" />
          <QA href="/staff/documents" icon="fa-folder-open" label="เอกสาร" color="#059669" />
          <QA href="/analytics" icon="fa-chart-line" label="สถิติแพลตฟอร์ม" color="#0891B2" />
        </div>
      </div>
    </RoleDashboardShell>
  );
}

function StatCard({ title, value, icon, color, link, loading }) {
  return (
    <Link href={link} className="card" style={{ textDecoration: "none", padding: 20, display: "flex", alignItems: "center", gap: 14, borderTop: `4px solid ${color}` }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "15", color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>{loading ? "…" : value}</p>
      </div>
    </Link>
  );
}

function QA({ href, icon, label, color }) {
  return (
    <Link href={href} style={{ textDecoration: "none", padding: 14, background: "#F8FAFC", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, border: "1px solid #E2E8F0" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + "15", color, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <span style={{ fontWeight: 700, fontSize: 14 }}>{label}</span>
    </Link>
  );
}
