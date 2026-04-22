"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getRoleMeta } from "@/lib/roles";
import { api } from "@/lib/api";
import Breadcrumbs from "./Breadcrumbs";
import MobileNav, { HamburgerButton } from "./MobileNav";

const NAV_ITEMS = {
  STUDENT: [
    { href: "/student/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { href: "/student/profile", label: "โปรไฟล์", icon: "fa-user" },
    { href: "/student/internships", label: "ค้นหาฝึกงาน", icon: "fa-briefcase" },
    { href: "/student/applications", label: "ใบสมัครของฉัน", icon: "fa-clipboard-list" },
    { href: "/student/interviews", label: "นัดสัมภาษณ์", icon: "fa-calendar-check" },
    { href: "/student/reports", label: "รายงานฝึกงาน", icon: "fa-file-lines" },
    { href: "/student/notifications", label: "การแจ้งเตือน", icon: "fa-bell" },
    { href: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { href: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  COMPANY: [
    { href: "/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { href: "/company/profile", label: "ข้อมูลบริษัท", icon: "fa-building" },
    { href: "/company/internships", label: "ประกาศฝึกงาน", icon: "fa-briefcase" },
    { href: "/company/applicants", label: "ผู้สมัคร", icon: "fa-users" },
    { href: "/company/interviews", label: "สัมภาษณ์", icon: "fa-calendar-check" },
    { href: "/company/offers", label: "ข้อเสนอ", icon: "fa-file-signature" },
    { href: "/company/interns", label: "พนักงานฝึกงาน", icon: "fa-user-tie" },
    { href: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { href: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  ADVISOR: [
    { href: "/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { href: "/advisor/students", label: "นักศึกษาในความดูแล", icon: "fa-user-graduate" },
    { href: "/advisor/reports", label: "ตรวจรายงาน", icon: "fa-file-lines" },
    { href: "/advisor/approvals", label: "อนุมัติเอกสาร", icon: "fa-circle-check" },
    { href: "/advisor/notifications", label: "การแจ้งเตือน", icon: "fa-bell" },
    { href: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { href: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  STAFF: [
    { href: "/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { href: "/staff/documents", label: "เอกสาร", icon: "fa-folder-open" },
    { href: "/staff/companies", label: "บริษัท", icon: "fa-building" },
    { href: "/staff/assign-advisor", label: "กำหนดอาจารย์ที่ปรึกษา", icon: "fa-user-plus" },
    { href: "/staff/applications", label: "การสมัคร", icon: "fa-clipboard-list" },
    { href: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { href: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  ADMIN: [
    { href: "/dashboard", label: "ภาพรวมระบบ", icon: "fa-house" },
    { href: "/admin/users", label: "ผู้ใช้", icon: "fa-users" },
    { href: "/admin/roles", label: "สิทธิ์การใช้งาน", icon: "fa-user-shield" },
    { href: "/admin/audit", label: "Audit Logs", icon: "fa-clipboard-check" },
    { href: "/admin/settings", label: "ตั้งค่าระบบ", icon: "fa-gears" },
    { href: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
};

export default function RoleDashboardShell({ role, title, subtitle, children, breadcrumbs = null }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const meta = getRoleMeta(role);
  const nav = NAV_ITEMS[role] || NAV_ITEMS.STUDENT;

  useEffect(() => {
    // Initial load
    api.getNotifications()
      .then(notifications => {
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      })
      .catch(err => console.error("Failed to load notifications:", err));

    // SSE connection for real-time updates
    const token = localStorage.getItem("utcctp_token");
    if (token) {
      const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/notifications/stream?token=${token}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "notification") {
          setUnreadCount(prev => prev + 1);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, []);

  return (
    <>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "260px minmax(0, 1fr)", 
        gap: 24,
        position: "relative"
      }}>
        {/* Desktop Sidebar */}
        <aside 
          className="desktop-sidebar card" 
          style={{ 
            padding: 20, 
            position: "sticky", 
            top: 24, 
            height: "fit-content"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: meta.color + "18", color: meta.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
              <i className={`fas ${meta.icon}`}></i>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, margin: 0 }}>{meta.label}</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{meta.description}</p>
            </div>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {nav.map((item) => {
              const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
              const isNotification = item.href.includes("notifications");
              const hasUnread = isNotification && unreadCount > 0;
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="btn btn-ghost" 
                  style={{ 
                    justifyContent: "flex-start",
                    background: isActive ? `${meta.color}15` : "transparent",
                    color: isActive ? meta.color : "var(--text-secondary)",
                    fontWeight: isActive ? "600" : "500",
                    borderLeft: isActive ? `3px solid ${meta.color}` : "3px solid transparent",
                    borderRadius: isActive ? "0 8px 8px 0" : "8px",
                    position: "relative"
                  }}
                >
                  <i className={`fas ${item.icon}`} style={{ width: 18 }}></i>
                  {item.label}
                  {hasUnread && (
                    <span style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "#DC2626",
                      color: "white",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: 99,
                      minWidth: 18,
                      textAlign: "center"
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mobile Header */}
          <div className="mobile-header" style={{ 
            display: "none",
            alignItems: "center", 
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid var(--border)",
            marginBottom: "8px"
          }}>
            <HamburgerButton onClick={() => setMobileNavOpen(true)} />
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "8px", 
                background: meta.color + "18", 
                color: meta.color, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                fontSize: "14px" 
              }}>
                <i className={`fas ${meta.icon}`}></i>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--text-primary)" }}>
                {meta.label}
              </span>
            </div>
          </div>

          {/* Breadcrumbs */}
          <Breadcrumbs items={breadcrumbs} />
          
          <div className="page-header">
            <div>
              <p className="page-eyebrow">{meta.label}</p>
              <h1 className="page-title">{title}</h1>
              {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
          </div>
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        navItems={nav}
        currentPath={pathname}
        unreadCount={unreadCount}
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          
          .mobile-header {
            display: flex !important;
          }
          
          div[style*="grid-template-columns"] {
            display: block !important;
          }
          
          main {
            padding: 0 !important;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-header {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
