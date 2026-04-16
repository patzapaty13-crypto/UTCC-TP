"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [user,  setUser]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getMe()])
      .then(([s, u]) => { setStats(s); setUser(u); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const role = user?.roles?.[0] || stats?.role || "STUDENT";

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

      {/* ── Welcome Banner ───────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1D4ED8 100%)",
        borderRadius: 24, padding: "36px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 20, overflow: "hidden", position: "relative",
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", right:-60, top:-60, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}></div>
        <div style={{ position:"absolute", right:80, bottom:-80, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.03)" }}></div>

        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:8 }}>
            {roleMeta.label}
          </p>
          <h1 style={{ fontSize:26, fontWeight:900, color:"white", letterSpacing:"-0.8px", lineHeight:1.1, marginBottom:8 }}>
            สวัสดี, {user?.displayName || user?.username} 👋
          </h1>
          <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.55)", fontWeight:500 }}>
            {user?.major && `สาขา${user.major}`}{user?.academicYear && ` • ชั้นปีที่ ${user.academicYear}`}
            {!user?.major && "ยินดีต้อนรับสู่แพลตฟอร์มจัดการทริปและฝึกงาน"}
          </p>
        </div>

        <div style={{
          position:"relative", zIndex:1,
          width:56, height:56, borderRadius:16,
          background: "rgba(255,255,255,0.12)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24, color:"rgba(255,255,255,0.8)",
          border:"1px solid rgba(255,255,255,0.12)",
        }}>
          <i className={`fas ${roleMeta.icon}`}></i>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <div className="grid-4 stagger" style={{ gap: 16 }}>
        <StatCard
          icon="fa-route" iconColor="#2563EB" iconBg="#EFF6FF"
          label="ทริปที่ดำเนินการ" value={stats?.activeTrips ?? "—"}
          sub="Academic field trips"
        />
        <StatCard
          icon="fa-clock" iconColor="#D97706" iconBg="#FFFBEB"
          label="รอการอนุมัติ" value={stats?.pendingApps ?? "—"}
          sub="Pending applications"
        />
        <StatCard
          icon="fa-file-circle-check" iconColor="#7C3AED" iconBg="#F5F3FF"
          label="รายงานรอตรวจ" value={stats?.reportsDue ?? "—"}
          sub="Awaiting review"
        />
        <StatCard
          icon="fa-briefcase" iconColor="#059669" iconBg="#ECFDF5"
          label="ตำแหน่งว่าง" value={stats?.unmatchedSlots ?? "—"}
          sub={`จาก ${stats?.internshipSlots ?? 0} ที่ทั้งหมด`}
        />
      </div>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <div>
        <h2 style={{ fontSize:15, fontWeight:800, color:"var(--text-primary)", marginBottom:16, letterSpacing:"-0.3px" }}>
          ทางลัด
        </h2>
        <div className="grid-4 stagger" style={{ gap: 12 }}>
          {[
            { href:"/trips",        icon:"fa-route",      label:"ดูทริปทั้งหมด",    sub:"Field Trips",         color:"#2563EB" },
            { href:"/internships",  icon:"fa-briefcase",  label:"ค้นหาฝึกงาน",     sub:"Internship Slots",    color:"#059669" },
            { href:"/reports",      icon:"fa-file-lines", label:"รายงานของฉัน",    sub:"Submissions",          color:"#7C3AED" },
            { href:"/analytics",    icon:"fa-chart-line", label:"ข้อมูลสถิติ",      sub:"Platform Analytics",  color:"#0891B2" },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="animate-fade-in"
              style={{
                display:"flex", alignItems:"center", gap:14,
                background:"white", border:"1px solid var(--border)",
                borderRadius:16, padding:"16px 18px",
                boxShadow:"var(--shadow-sm)",
                transition:"all var(--transition)",
                textDecoration:"none",
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow="var(--shadow-md)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow="var(--shadow-sm)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <div style={{
                width:40, height:40, borderRadius:12, flexShrink:0,
                background: action.color + "15",
                display:"flex", alignItems:"center", justifyContent:"center",
                color: action.color, fontSize:16,
              }}>
                <i className={`fas ${action.icon}`}></i>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:"var(--text-primary)" }}>{action.label}</p>
                <p style={{ fontSize:11, color:"var(--text-muted)", fontWeight:600 }}>{action.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

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
            { icon:"fa-briefcase", color:"#2563EB", title:"ตำแหน่งฝึกงานใหม่: Google Thailand", time:"2 ชั่วโมงที่แล้ว", tag:"ฝึกงาน" },
            { icon:"fa-route",     color:"#059669", title:"อนุมัติแผนทริป: Eastern Seaboard Tour", time:"5 ชั่วโมงที่แล้ว", tag:"ทริป" },
            { icon:"fa-file-lines",color:"#7C3AED", title:"รายงานสัปดาห์ที่ 3 ถูกตรวจแล้ว", time:"เมื่อวาน", tag:"รายงาน" },
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

function StatCard({ icon, iconColor, iconBg, label, value, sub }) {
  return (
    <div className="stat-card">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{
          width:44, height:44, borderRadius:12,
          background: iconBg,
          display:"flex", alignItems:"center", justifyContent:"center",
          color: iconColor, fontSize:18,
        }}>
          <i className={`fas ${icon}`}></i>
        </div>
      </div>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value" style={{ fontSize:34 }}>{value}</p>
        <p className="stat-card-sub">{sub}</p>
      </div>
    </div>
  );
}
