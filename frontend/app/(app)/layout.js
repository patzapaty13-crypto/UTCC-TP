"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

const NAV = [
  { path: "/dashboard", label: "ภาพรวม", icon: "fa-chart-pie", section: "main" },
  { path: "/internships", label: "ค้นหาตำแหน่งงาน", icon: "fa-briefcase", section: "main", forStudent: true },
  { path: "/applications", label: "ติดตามสถานะสมัคร", icon: "fa-clipboard-list", section: "main", forStudent: true },
  { path: "/recruitment", label: "จัดการผู้สมัคร (ATS)", icon: "fa-users-gear", section: "main", forStaff: true },
  { path: "/reports", label: "รายงาน", icon: "fa-file-lines", section: "data" },
  { path: "/analytics", label: "วิเคราะห์ข้อมูล", icon: "fa-chart-line", section: "data" },
  { path: "/notifications", label: "การแจ้งเตือน", icon: "fa-bell", section: "data" },
  { path: "/admin/settings", label: "ตั้งค่าระบบ", icon: "fa-gears", section: "admin", forAdmin: true },
];

const ROLE_PREFIX = {
  STUDENT: "/student",
  COMPANY: "/company",
  ADVISOR: "/advisor",
  STAFF: "/staff",
  ADMIN: "/admin",
};

function routeForRole(role) {
  return ROLE_PREFIX[role] || "/student";
}

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api.getMe()
      .then((u) => {
        setUser(u);
        const role = u?.roles?.[0] || "STUDENT";
        const allowedPrefixes = Object.values(ROLE_PREFIX);
        const isRoleRoot = allowedPrefixes.some((prefix) => pathname.startsWith(prefix));
        if (!pathname.startsWith(routeForRole(role)) && isRoleRoot) {
          router.replace(routeForRole(role));
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router, pathname]);

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

  const primaryRole = user?.roles?.[0] || "USER";
  const isStaff = primaryRole === "STAFF" || primaryRole === "ADMIN" || primaryRole === "ADVISOR" || primaryRole === "COMPANY";
  const isAdmin = primaryRole === "ADMIN";

  const accessibleNav = NAV.filter(n => {
    if (n.forStudent && isStaff) return false;
    if (n.forStaff && !isStaff) return false;
    if (n.forAdmin && !isAdmin) return false;
    return true;
  });

  const mainNav = accessibleNav.filter(n => n.section === "main");
  const dataNav = accessibleNav.filter(n => n.section === "data");
  const adminNav = accessibleNav.filter(n => n.section === "admin");

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-brand" onClick={() => setOpen(false)}>
            <img src="/utcc-logo.png" alt="UTCC" style={{ height: 26, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
            <div>
              <div className="sidebar-brand-name">UTCC</div>
              <div className="sidebar-brand-sub">Trip & Internship</div>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">เมนูหลัก</span>
          {mainNav.map(item => (
            <Link key={item.path} href={item.path} className={`nav-link ${pathname === item.path ? "active" : ""}`} onClick={() => setOpen(false)}>
              <i className={`fas ${item.icon} nav-link-icon`}></i>{item.label}
            </Link>
          ))}

          <span className="nav-section-label" style={{ marginTop: 8 }}>ข้อมูล</span>
          {dataNav.map(item => (
            <Link key={item.path} href={item.path} className={`nav-link ${pathname === item.path ? "active" : ""}`} onClick={() => setOpen(false)}>
              <i className={`fas ${item.icon} nav-link-icon`}></i>{item.label}
            </Link>
          ))}

          {adminNav.length > 0 && <span className="nav-section-label" style={{ marginTop: 8 }}>ผู้ดูแลระบบ</span>}
          {adminNav.map(item => (
            <Link key={item.path} href={item.path} className={`nav-link ${pathname === item.path ? "active" : ""}`} onClick={() => setOpen(false)}>
              <i className={`fas ${item.icon} nav-link-icon`}></i>{item.label}
            </Link>
          ))}
        </nav>

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

      {open && <div className="sidebar-overlay open" onClick={() => setOpen(false)}></div>}

      <div className="main-wrapper">
        <header className="topbar">
          <button className="topbar-hamburger" onClick={() => setOpen(!open)} aria-label="เปิดเมนู"><span></span><span></span><span></span></button>
          <span className="topbar-title">{pageLabel}</span>
          <div className="topbar-actions">
            <Link href="/notifications" className="icon-btn" title="การแจ้งเตือน" style={{ textDecoration: "none" }}><i className="fas fa-bell"></i></Link>
            <Link href="/profile" style={{ textDecoration:"none" }}><div className="avatar avatar-sm" style={{ marginLeft: 4, cursor:"pointer" }}>{initials}</div></Link>
          </div>
        </header>

        <main className="page-content animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
