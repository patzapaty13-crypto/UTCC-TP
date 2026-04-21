"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import NexusChat from "@/components/NexusChat";

const NAV = [
  { path: "/dashboard", label: "ภาพรวม", icon: "fa-chart-pie" },
  { path: "/internships", label: "ค้นหาตำแหน่งงาน", icon: "fa-briefcase" },
  { path: "/applications", label: "ติดตามสถานะสมัคร", icon: "fa-clipboard-list" },
  { path: "/recruitment", label: "จัดการผู้สมัคร (ATS)", icon: "fa-users-gear" },
  { path: "/reports", label: "รายงาน", icon: "fa-file-lines" },
  { path: "/analytics", label: "วิเคราะห์ข้อมูล", icon: "fa-chart-line" },
  { path: "/notifications", label: "การแจ้งเตือน", icon: "fa-bell" },
  { path: "/admin/settings", label: "ตั้งค่าระบบ", icon: "fa-gears" },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initSession = async () => {
      try {
        const u = await api.getMe();
        setUser(u);
        if (pathname === "/") {
          router.replace("/dashboard");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, [router, pathname]);

  const initials = (user?.displayName || user?.username || "U")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const pageLabel = NAV.find(n => n.path === pathname)?.label || "Dashboard";

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p className="loading-text">UTCC Platform</p>
    </div>
  );

  return (
    <div className="app-shell full-page">
      <style jsx global>{`
        .full-page .main-wrapper {
          margin-left: 0 !important;
          width: 100% !important;
          padding: 0 !important;
        }
        .full-page .topbar {
          left: 0 !important;
          width: 100% !important;
          max-width: none !important;
          padding: 0 40px;
          height: 80px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .full-page .page-content {
          padding: 40px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .hub-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #0F172A;
          font-weight: 800;
          font-size: 15px;
          transition: transform 0.2s;
        }
        .hub-link:hover { transform: translateX(-4px); }
        .gradient-text {
          background: linear-gradient(135deg, #2563EB, #7C3AED);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          background: #f8fafc;
          transition: all 0.2s;
        }
        .icon-btn:hover { background: #f1f5f9; color: #2563EB; }
        .avatar-sm {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #2563EB;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 800;
        }
      `}</style>

      <div className="main-wrapper">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <Link href="/dashboard" className="hub-link" title="กลับหน้าหลัก">
              <i className="fas fa-grid-2" style={{ color: "#2563EB", fontSize: 20 }}></i>
              <span style={{ fontSize: 20, letterSpacing: "-1px" }}>Dashboard <span className="gradient-text" style={{ fontWeight: 900 }}>Portal</span></span>
            </Link>
          </div>

          <div style={{ fontWeight: 700, color: "#64748B", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>
            {pageLabel}
          </div>
          
          <div className="topbar-actions">
            <Link href="/notifications" className="icon-btn" title="การแจ้งเตือน" style={{ textDecoration: "none" }}><i className="fas fa-bell"></i></Link>
            <Link href="/profile" style={{ textDecoration:"none" }}><div className="avatar-sm" style={{ marginLeft: 4, cursor:"pointer" }}>{initials}</div></Link>
          </div>
        </header>

        <main className="page-content animate-fade-in">{children}</main>
      </div>

      {/* Global AI Assistant Widget */}
      <NexusChat />
    </div>
  );
}
