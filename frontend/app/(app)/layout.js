"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import NexusChat from "@/components/NexusChat";
import { ToastProvider } from "@/components/Toast";

// Navigation items by role
const NAV_BY_ROLE = {
  STUDENT: [
    { path: "/student/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { path: "/student/profile", label: "โปรไฟล์", icon: "fa-user" },
    { path: "/student/internships", label: "ค้นหาฝึกงาน", icon: "fa-briefcase" },
    { path: "/student/applications", label: "ใบสมัครของฉัน", icon: "fa-clipboard-list" },
    { path: "/student/interviews", label: "นัดสัมภาษณ์", icon: "fa-calendar-check" },
    { path: "/student/reports", label: "รายงานฝึกงาน", icon: "fa-file-lines" },
    { path: "/student/notifications", label: "การแจ้งเตือน", icon: "fa-bell" },
    { path: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { path: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  COMPANY: [
    { path: "/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { path: "/company/profile", label: "ข้อมูลบริษัท", icon: "fa-building" },
    { path: "/company/internships", label: "ประกาศฝึกงาน", icon: "fa-briefcase" },
    { path: "/company/applicants", label: "ผู้สมัคร", icon: "fa-users" },
    { path: "/company/interviews", label: "สัมภาษณ์", icon: "fa-calendar-check" },
    { path: "/company/offers", label: "ข้อเสนอ", icon: "fa-file-signature" },
    { path: "/company/interns", label: "พนักงานฝึกงาน", icon: "fa-user-tie" },
    { path: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { path: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  ADVISOR: [
    { path: "/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { path: "/advisor/students", label: "นักศึกษาในความดูแล", icon: "fa-user-graduate" },
    { path: "/advisor/reports", label: "ตรวจรายงาน", icon: "fa-file-lines" },
    { path: "/advisor/approvals", label: "อนุมัติเอกสาร", icon: "fa-circle-check" },
    { path: "/advisor/notifications", label: "การแจ้งเตือน", icon: "fa-bell" },
    { path: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { path: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  STAFF: [
    { path: "/dashboard", label: "ภาพรวม", icon: "fa-house" },
    { path: "/staff/documents", label: "เอกสาร", icon: "fa-folder-open" },
    { path: "/staff/companies", label: "บริษัท", icon: "fa-building" },
    { path: "/staff/assign-advisor", label: "กำหนดอาจารย์ที่ปรึกษา", icon: "fa-user-plus" },
    { path: "/staff/applications", label: "การสมัคร", icon: "fa-clipboard-list" },
    { path: "/analytics", label: "สถิติแพลตฟอร์ม", icon: "fa-chart-line" },
    { path: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
  ADMIN: [
    { path: "/dashboard", label: "ภาพรวมระบบ", icon: "fa-house" },
    { path: "/admin/users", label: "ผู้ใช้", icon: "fa-users" },
    { path: "/admin/roles", label: "สิทธิ์การใช้งาน", icon: "fa-user-shield" },
    { path: "/admin/audit", label: "Audit Logs", icon: "fa-clipboard-check" },
    { path: "/admin/settings", label: "ตั้งค่าระบบ", icon: "fa-gears" },
    { path: "/messages", label: "ข้อความ", icon: "fa-comments" },
  ],
};

// Get navigation items based on user role
const getNavForUser = (user) => {
  if (!user || !user.roles || user.roles.length === 0) {
    return NAV_BY_ROLE.STUDENT; // Default to student
  }
  
  // Priority order: ADMIN > STAFF > ADVISOR > COMPANY > STUDENT
  if (user.roles.includes("ADMIN")) return NAV_BY_ROLE.ADMIN;
  if (user.roles.includes("STAFF")) return NAV_BY_ROLE.STAFF;
  if (user.roles.includes("ADVISOR")) return NAV_BY_ROLE.ADVISOR;
  if (user.roles.includes("COMPANY")) return NAV_BY_ROLE.COMPANY;
  return NAV_BY_ROLE.STUDENT;
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

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

    // Listen to profile updates
    window.addEventListener('profile_updated', initSession);
    return () => {
      window.removeEventListener('profile_updated', initSession);
    };
  }, [router, pathname]);

  useEffect(() => {
    // Load unread count
    api.getNotifications()
      .then(notifications => {
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      })
      .catch(err => {
        // Silently fail if notifications endpoint doesn't exist
        console.warn("Notifications not available");
      });

    // SSE connection for real-time updates - disabled until backend endpoint is available
    // const token = localStorage.getItem("utcctp_token");
    // if (token) {
    //   try {
    //     const eventSource = new EventSource(
    //       `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/v1/notifications/stream?token=${token}`
    //     );

    //     eventSource.onmessage = (event) => {
    //       const data = JSON.parse(event.data);
    //       if (data.type === "notification") {
    //         setUnreadCount(prev => prev + 1);
    //       }
    //     };

    //     eventSource.onerror = (error) => {
    //       eventSource.close();
    //     };

    //     return () => {
    //       eventSource.close();
    //     };
    //   } catch (err) {
    //     // Silently fail if SSE is not available
    //   }
    // }
  }, []);

  const initials = (user?.displayName || user?.username || "U")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const NAV = getNavForUser(user);
  const pageLabel = NAV.find(n => n.path === pathname)?.label || "Dashboard";

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p className="loading-text">UTCC Platform</p>
    </div>
  );

  return (
    <ToastProvider>
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
          overflow: hidden;
        }
        .avatar-sm img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
            <Link href="/notifications" className="icon-btn" title="การแจ้งเตือน" style={{ textDecoration: "none", position: "relative" }}>
              <i className="fas fa-bell"></i>
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  background: "#DC2626",
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 99,
                  minWidth: 16,
                  textAlign: "center",
                  lineHeight: 1
                }}>
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link href="/student/profile" style={{ textDecoration:"none" }}>
              <div className="avatar-sm" style={{ marginLeft: 4, cursor:"pointer" }}>
                {user?.profilePictureUrl ? (
                  <img src={ (url => {
                    if (!url) return null;
                    if (url.startsWith("http")) return url;
                    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
                    const origin = backendUrl.replace("/api/v1", "");
                    return `${origin}${url}`;
                  })(user.profilePictureUrl) } alt="Avatar" />
                ) : initials}
              </div>
            </Link>
          </div>
        </header>

        <main className="page-content animate-fade-in">{children}</main>
      </div>

      {/* Global AI Assistant Widget */}
      <NexusChat />
    </div>
    </ToastProvider>
  );
}
