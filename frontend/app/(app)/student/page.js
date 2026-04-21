"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StudentHomePage() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboard().catch(() => ({})),
      api.getApplications().catch(() => []),
      api.getReports().catch(() => []),
      api.getNotifications().catch(() => []),
    ]).then(([dashData, appsData, reportsData, notifData]) => {
      setStats(dashData);
      setApplications(appsData.slice(0, 3));
      setReports(reportsData.slice(0, 3));
      setNotifications(notifData.filter(n => !n.read).slice(0, 3));
    }).finally(() => setLoading(false));
  }, []);

  const pendingReports = reports.filter(r => !r.submitted).length;
  const unreadNotifs = notifications.length;

  return (
    <RoleDashboardShell role="STUDENT" title="แดชบอร์ดนักศึกษา" subtitle="ติดตามการสมัครฝึกงาน รายงาน และการแจ้งเตือนทั้งหมดในที่เดียว">
      {loading ? (
        <div className="grid-4 stagger" style={{ gap: 16 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 20 }}></div>)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Stats Cards */}
          <div className="grid-4 stagger" style={{ gap: 16 }}>
            <div className="stat-premium" style={{ "--accent": "#2563EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#EFF6FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#2563EB", fontSize: 18,
                }}>
                  <i className="fas fa-user-circle"></i>
                </div>
              </div>
              <div>
                <p className="stat-card-label">โปรไฟล์ครบแล้ว</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>85%</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Profile Completion</p>
              </div>
            </div>

            <div className="stat-premium" style={{ "--accent": "#D97706" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#FFFBEB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#D97706", fontSize: 18,
                }}>
                  <i className="fas fa-clipboard-list"></i>
                </div>
                {applications.length > 0 && <span className="stat-trend up"><i className="fas fa-arrow-trend-up" style={{fontSize:10}}></i> +{applications.length}</span>}
              </div>
              <div>
                <p className="stat-card-label">ใบสมัคร</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{applications.length}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Active Applications</p>
              </div>
            </div>

            <div className="stat-premium" style={{ "--accent": "#7C3AED" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#F5F3FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#7C3AED", fontSize: 18,
                }}>
                  <i className="fas fa-calendar-check"></i>
                </div>
              </div>
              <div>
                <p className="stat-card-label">นัดสัมภาษณ์</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{stats?.pendingInterviews ?? 0}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Scheduled Interviews</p>
              </div>
            </div>

            <div className="stat-premium" style={{ "--accent": pendingReports > 0 ? "#DC2626" : "#059669" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: pendingReports > 0 ? "#FEF2F2" : "#ECFDF5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: pendingReports > 0 ? "#DC2626" : "#059669", fontSize: 18,
                }}>
                  <i className="fas fa-file-alt"></i>
                </div>
                {pendingReports > 0 && <span className="stat-trend down"><i className="fas fa-exclamation-circle" style={{fontSize:10}}></i></span>}
              </div>
              <div>
                <p className="stat-card-label">รายงานค้างส่ง</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{pendingReports}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Pending Reports</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="section-head">
              <h2>ทางลัด</h2>
            </div>
            <div className="grid-4 stagger" style={{ gap: 12 }}>
              <Link href="/internships" className="shortcut-card animate-fade-in" style={shortcutStyle("#2563EB")}>
                <div style={iconStyle("#2563EB")}><i className="fas fa-search"></i></div>
                <div><p style={labelStyle}>ค้นหาตำแหน่งงาน</p><p style={subStyle}>Browse Internships</p></div>
              </Link>
              <Link href="/student/applications" className="shortcut-card animate-fade-in" style={shortcutStyle("#059669")}>
                <div style={iconStyle("#059669")}><i className="fas fa-clipboard-user"></i></div>
                <div><p style={labelStyle}>ติดตามสถานะ</p><p style={subStyle}>My Applications</p></div>
              </Link>
              <Link href="/student/reports/submit" className="shortcut-card animate-fade-in" style={shortcutStyle("#7C3AED")}>
                <div style={iconStyle("#7C3AED")}><i className="fas fa-file-upload"></i></div>
                <div><p style={labelStyle}>ส่งรายงาน</p><p style={subStyle}>Submit Report</p></div>
              </Link>
              <Link href="/student/profile" className="shortcut-card animate-fade-in" style={shortcutStyle("#D97706")}>
                <div style={iconStyle("#D97706")}><i className="fas fa-user-edit"></i></div>
                <div><p style={labelStyle}>แก้ไขโปรไฟล์</p><p style={subStyle}>Edit Profile</p></div>
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          {applications.length > 0 && (
            <div className="card animate-fade-in" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>ใบสมัครล่าสุด</h3>
                <Link href="/student/applications" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {applications.map(app => (
                  <div key={app.id} style={{ 
                    padding: 16, background: "var(--n-50)", borderRadius: 12, 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--n-100)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--n-50)"}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{app.positionTitle || "ตำแหน่ง"}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{app.companyName || "บริษัท"}</p>
                    </div>
                    <span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications */}
          {unreadNotifs > 0 && (
            <div className="card animate-fade-in" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>
                  <i className="fas fa-bell" style={{ color: "#F59E0B", marginRight: 8 }}></i>
                  การแจ้งเตือนใหม่
                </h3>
                <Link href="/notifications" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {notifications.map(notif => (
                  <div key={notif.id} style={{ 
                    padding: 16, background: "#FFFBEB", borderRadius: 12, borderLeft: "4px solid #F59E0B",
                    transition: "all 0.2s ease",
                  }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{notif.title}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </RoleDashboardShell>
  );
}

// Shortcut Styles
const shortcutStyle = (color) => ({
  display:"flex", alignItems:"center", gap:14,
  background:"white", border:"1px solid var(--border)",
  borderRadius:16, padding:"16px 18px",
  boxShadow:"var(--shadow-sm)",
  transition:"all var(--transition)",
  textDecoration:"none",
});
const iconStyle = (color) => ({
  width:40, height:40, borderRadius:12, flexShrink:0,
  background: color + "15",
  display:"flex", alignItems:"center", justifyContent:"center",
  color: color, fontSize:16,
});
const labelStyle = { fontSize:13, fontWeight:800, color:"var(--text-primary)" };
const subStyle = { fontSize:11, color:"var(--text-muted)", fontWeight:600 };
