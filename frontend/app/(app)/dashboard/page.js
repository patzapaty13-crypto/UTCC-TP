"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [user,  setUser]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const u = await api.getMe();
        setUser(u);
        const s = await api.getDashboard();
        setStats(s);

        const role = u.roles?.[0];
        if (role === "ADMIN" || role === "STAFF" || role === "ADVISOR") {
          const a = await api.getAnalyticsDashboard();
          setAnalytics(a);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const role = user?.roles?.[0] || stats?.role || "STUDENT";
  const isStaff = role === "STAFF" || role === "ADMIN" || role === "EMPLOYER";

  const ROLE_META = {
    ADMIN:   { label: "ผู้ดูแลระบบ",   icon: "fa-user-shield",        color: "#7C3AED", bg: "#F5F3FF" },
    ADVISOR: { label: "อาจารย์ที่ปรึกษา", icon: "fa-chalkboard-user",    color: "#0891B2", bg: "#ECFEFF" },
    STAFF:   { label: "เจ้าหน้าที่",    icon: "fa-id-badge",           color: "#059669", bg: "#ECFDF5" },
    STUDENT: { label: "นักศึกษา",       icon: "fa-user-graduate",      color: "#2563EB", bg: "#EFF6FF" },
  };

  const roleMeta = ROLE_META[role] || ROLE_META.STUDENT;

  if (loading) return (
    <div className="grid-4 stagger" style={{ gap: 20 }}>
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 20 }}></div>)}
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* ── Welcome Banner (premium mesh) ───────────────── */}
      <div className="mesh-dark" style={{
        borderRadius: 28, padding: "44px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 20, position: "relative",
      }}>
        <div style={{ position:"relative", zIndex:1 }}>
          <span className="pill-premium" style={{ marginBottom:16 }}>
            <span className="dot dot-green dot-pulse"></span>
            {roleMeta.label} • Active Session
          </span>
          <h1 style={{ fontSize:32, fontWeight:900, color:"white", letterSpacing:"-1px", lineHeight:1.1, margin:"14px 0 10px" }}>
            สวัสดี, <span className="gradient-text-blue">{user?.displayName || user?.username}</span>
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.6)", fontWeight:500 }}>
            {user?.major && `สาขา${user.major}`}{user?.academicYear && ` • ชั้นปีที่ ${user.academicYear}`}
            {!user?.major && "ยินดีต้อนรับสู่แพลตฟอร์มจัดการทริปและฝึกงาน"}
          </p>
        </div>

        <div className="glass-dark" style={{
          position:"relative", zIndex:1,
          width:64, height:64, borderRadius:18,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:26, color:"#60A5FA",
        }}>
          <i className={`fas ${roleMeta.icon}`}></i>
        </div>
      </div>

      {/* ── Stats Grid (ATS Focus) ───────────────────────────────────────── */}
      <div className="grid-4 stagger" style={{ gap: 16 }}>
        <StatCard
          icon="fa-briefcase" iconColor="#2563EB" iconBg="#EFF6FF" accent="#2563EB"
          label={isStaff ? "ตำแหน่งที่เปิดรับ" : "ตำแหน่งงานทั้งหมด"} value={stats?.activeJobs ?? "—"}
          sub="Active Internship Posts" trend="+12%"
        />
        <StatCard
          icon="fa-clipboard-list" iconColor="#D97706" iconBg="#FFFBEB" accent="#D97706"
          label={isStaff ? "ใบสมัครรอตรวจ" : "ใบสมัครทั้งหมด"} value={stats?.totalApplications ?? "—"}
          sub="Total Applications" trend="+8%"
        />
        <StatCard
          icon="fa-calendar-check" iconColor="#7C3AED" iconBg="#F5F3FF" accent="#7C3AED"
          label={isStaff ? "รอสัมภาษณ์" : "นัดสัมภาษณ์แล้ว"} value={stats?.pendingInterviews ?? "—"}
          sub="Scheduled Interviews" trend="+4%"
        />
        <StatCard
          icon="fa-file-signature" iconColor="#059669" iconBg="#ECFDF5" accent="#059669"
          label="รับเข้าทำงาน" value={stats?.offersAccepted ?? 0}
          sub="Offers Accepted" trend="+22%"
        />
      </div>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div>
        <div className="section-head">
          <h2>ทางลัด</h2>
        </div>
        <div className="grid-4 stagger" style={{ gap: 12 }}>
          {/* Render conditionally based on Role */}
          {(!isStaff) && (
            <>
              <Link href="/internships" className="shortcut-card animate-fade-in" style={shortcutStyle("#2563EB")}>
                <div style={iconStyle("#2563EB")}><i className="fas fa-search"></i></div>
                <div><p style={labelStyle}>ค้นหาตำแหน่งงาน</p><p style={subStyle}>Browse Jobs</p></div>
              </Link>
              <Link href="/applications" className="shortcut-card animate-fade-in" style={shortcutStyle("#059669")}>
                <div style={iconStyle("#059669")}><i className="fas fa-clipboard-user"></i></div>
                <div><p style={labelStyle}>ติดตามสถานะ</p><p style={subStyle}>My Applications</p></div>
              </Link>
            </>
          )}

          {(isStaff) && (
            <>
              <Link href="/recruitment" className="shortcut-card animate-fade-in" style={shortcutStyle("#7C3AED")}>
                <div style={iconStyle("#7C3AED")}><i className="fas fa-users-gear"></i></div>
                <div><p style={labelStyle}>จัดการผู้สมัคร</p><p style={subStyle}>Applicant Tracking</p></div>
              </Link>
              <Link href="/internships" className="shortcut-card animate-fade-in" style={shortcutStyle("#D97706")}>
                <div style={iconStyle("#D97706")}><i className="fas fa-folder-plus"></i></div>
                <div><p style={labelStyle}>จัดการตำแหน่งงาน</p><p style={subStyle}>Manage Postings</p></div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Analytics Visuals (Admin/Staff) ────────────────────────── */}
      {analytics && (
        <div>
          <div className="section-head">
            <h2>ภาพรวมสถิติ</h2>
          </div>
          <AnalyticsCharts stats={analytics} />
        </div>
      )}

      {/* ── Activity Feed ─────────────────────────────────────── */}
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h2 style={{ fontSize:15, fontWeight:800, color:"var(--text-primary)", letterSpacing:"-0.3px" }}>
            กิจกรรมล่าสุด
          </h2>
          <button className="btn btn-ghost btn-sm">ดูทั้งหมด</button>
        </div>
        <div className="data-table-wrap">
          {[
            { icon:"fa-briefcase", color:"#2563EB", title:"ตำแหน่งฝึกงานใหม่: Google Thailand", time:"2 ชั่วโมงที่แล้ว", tag:"งานใหม่" },
            { icon:"fa-calendar-day", color:"#059669", title:"กำหนดวันสัมภาษณ์: Software Engineer Intern", time:"5 ชั่วโมงที่แล้ว", tag:"นัดหมาย" },
            { icon:"fa-user-check",color:"#7C3AED", title:"รับเข้าทำงานแล้ว: Data Science ที่ Agoda", time:"เมื่อวาน", tag:"ผ่านคัดเลือก" },
          ].map((act, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:16,
              padding:"16px 24px",
              borderBottom: i < 2 ? "1px solid var(--n-50)" : "none",
            }}>
              <div style={{
                width:38, height:38, borderRadius:10, flexShrink:0,
                background: act.color + "15",
                display:"flex", alignItems:"center", justifyContent:"center",
                color: act.color, fontSize:14,
              }}>
                <i className={`fas ${act.icon}`}></i>
              </div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13.5, fontWeight:600, color:"var(--text-primary)" }}>{act.title}</p>
                <p style={{ fontSize:11.5, color:"var(--text-muted)", marginTop:2 }}>{act.time}</p>
              </div>
              <span className="badge badge-blue" style={{ whiteSpace:"nowrap" }}>{act.tag}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon, iconColor, iconBg, label, value, sub, trend, accent }) {
  return (
    <div className="stat-premium" style={{ "--accent": accent || iconColor, display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{
          width:44, height:44, borderRadius:12,
          background: iconBg,
          display:"flex", alignItems:"center", justifyContent:"center",
          color: iconColor, fontSize:18,
        }}>
          <i className={`fas ${icon}`}></i>
        </div>
        {trend && <span className="stat-trend up"><i className="fas fa-arrow-trend-up" style={{fontSize:10}}></i> {trend}</span>}
      </div>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value" style={{ fontSize:34, marginTop:6 }}>{value}</p>
        <p className="stat-card-sub" style={{ marginTop:4 }}>{sub}</p>
      </div>
    </div>
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
