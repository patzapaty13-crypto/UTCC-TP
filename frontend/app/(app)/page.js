"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const ROLE_ACTIONS = {
  STUDENT: [
    { href: "/internships", label: "ค้นหาฝึกงาน", icon: "fa-briefcase" },
    { href: "/applications", label: "ติดตามใบสมัคร", icon: "fa-clipboard-list" },
    { href: "/profile/resume", label: "อัปเดต Resume", icon: "fa-file-user" },
  ],
  COMPANY: [
    { href: "/company/internships", label: "ประกาศฝึกงาน", icon: "fa-bullhorn" },
    { href: "/company/applicants", label: "ดูผู้สมัคร", icon: "fa-users" },
    { href: "/company/profile", label: "ข้อมูลบริษัท", icon: "fa-building" },
  ],
  ADVISOR: [
    { href: "/advisor/students", label: "นักศึกษาในความดูแล", icon: "fa-user-graduate" },
    { href: "/advisor/reports", label: "ตรวจรายงาน", icon: "fa-file-lines" },
    { href: "/advisor/approvals", label: "คำขออนุมัติ", icon: "fa-circle-check" },
  ],
  STAFF: [
    { href: "/staff/documents", label: "อนุมัติเอกสาร", icon: "fa-folder-open" },
    { href: "/staff/applications", label: "งานคัดกรอง", icon: "fa-clipboard-list" },
    { href: "/staff/analytics", label: "สถิติระบบ", icon: "fa-chart-line" },
  ],
  ADMIN: [
    { href: "/admin/users", label: "จัดการผู้ใช้", icon: "fa-users" },
    { href: "/admin/roles", label: "กำหนดสิทธิ์", icon: "fa-user-shield" },
    { href: "/admin/audit", label: "Audit Logs", icon: "fa-clipboard-check" },
  ],
};

export default function RoleLandingPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.getMe().then(setUser).catch(() => {});
  }, []);

  const role = user?.roles?.[0] || "STUDENT";
  const actions = ROLE_ACTIONS[role] || ROLE_ACTIONS.STUDENT;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Platform Overview</p>
          <h1 className="page-title">ยินดีต้อนรับสู่ UTCC</h1>
          <p className="page-subtitle">ระบบบริหารฝึกงานและบริษัทที่แยกประสบการณ์ใช้งานตาม Role อย่างชัดเจน</p>
        </div>
      </div>

      <div className="grid-4" style={{ gap: 16 }}>
        {actions.map((item) => (
          <Link key={item.href} href={item.href} className="card" style={{ textDecoration: "none", padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14 }}>{item.label}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>เปิดหน้าการทำงานหลัก</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>สิ่งที่ระบบพร้อมต่อยอด</h2>
        <ul style={{ marginLeft: 18, color: "var(--text-muted)", lineHeight: 1.9 }}>
          <li>แยกเส้นทางตาม Student / Company / Advisor / Staff / Admin</li>
          <li>รองรับ workflow สมัครฝึกงานและติดตามสถานะ</li>
          <li>พร้อมต่อยอดระบบเอกสาร รายงาน การอนุมัติ และ audit logs</li>
          <li>วางพื้นฐานสำหรับ production readiness และ role-based navigation</li>
        </ul>
      </div>
    </div>
  );
}
