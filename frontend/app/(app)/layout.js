"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

const NAV = [
  { path: "/dashboard",   label: "ภาพรวม",     icon: "fa-house",        section: "main" },
  { path: "/trips",       label: "ทริปศึกษาดูงาน",  icon: "fa-route",    section: "main" },
  { path: "/internships", label: "ฝึกงาน",      icon: "fa-briefcase",    section: "main" },
  { path: "/reports",     label: "รายงาน",      icon: "fa-file-lines",   section: "main" },
  { path: "/analytics",   label: "วิเคราะห์",   icon: "fa-chart-line",   section: "data" },
];

export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);

  useEffect(() => {
    api.getMe()
      .then(setUser)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const initials = (user?.displayName || user?.username || "U")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    localStorage.removeItem("utcctp_token");
    router.push("/login");
  };

  const pageLabel = NAV.find(n => n.path === pathname)?.label || "Dashboard";

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p className="loading-text">UTCC Platform</p>
    </div>
  );

  const mainNav  = NAV.filter(n => n.section === "main");
  const dataNav  = NAV.filter(n => n.section === "data");

  return (
    <div className="app-shell">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* Brand */}
        <div className="sidebar-header">
          <Link href="/" className="sidebar-brand" onClick={() => setOpen(false)}>
            <img src="/utcc-logo.png" alt="UTCC" style={{ height: 26, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
            <div>
              <div className="sidebar-brand-name">UTCC</div>
              <div className="sidebar-brand-sub">Trip & Internship</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-section-label">เมนูหลัก</span>
          {mainNav.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${pathname === item.path ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <i className={`fas ${item.icon} nav-link-icon`}></i>
              {item.label}
            </Link>
          ))}

          <span className="nav-section-label" style={{ marginTop: 8 }}>ข้อมูล</span>
          {dataNav.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-link ${pathname === item.path ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <i className={`fas ${item.icon} nav-link-icon`}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <Link href="/profile" className="user-card" style={{ textDecoration:"none", textAlign:"left", display:"flex", alignItems:"center", gap:12 }}>
            <div className="user-avatar avatar">{initials}</div>
            <div className="user-info" style={{ flex:1 }}>
              <div className="user-name">{user?.displayName || user?.username}</div>
              <div className="user-role">{user?.roles?.[0] || "USER"}</div>
            </div>
            <i className="fas fa-ellipsis" style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}></i>
          </Link>
          <button className="btn-signout" onClick={handleLogout}>
            <i className="fas fa-arrow-right-from-bracket"></i>
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {open && <div className="sidebar-overlay open" onClick={() => setOpen(false)}></div>}

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="main-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <button className="topbar-hamburger" onClick={() => setOpen(!open)} aria-label="เปิดเมนู">
            <span></span><span></span><span></span>
          </button>
          <span className="topbar-title">{pageLabel}</span>
          <div className="topbar-actions">
            <button className="icon-btn" title="การแจ้งเตือน">
              <i className="fas fa-bell"></i>
            </button>
            <Link href="/profile" style={{ textDecoration:"none" }}>
              <div className="avatar avatar-sm" style={{ marginLeft: 4, cursor:"pointer" }}>{initials}</div>
            </Link>
          </div>
        </header>

        {/* Page */}
        <main className={`page-content animate-fade-in ${pathname === '/profile' ? 'full-bleed' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
