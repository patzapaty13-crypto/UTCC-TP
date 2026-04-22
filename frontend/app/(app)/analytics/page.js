"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const STATUS_COLORS = {
  PENDING: "#F59E0B",
  REVIEWING: "#2563EB",
  INTERVIEW_SCHEDULED: "#0891B2",
  OFFER_EXTENDED: "#7C3AED",
  ACCEPTED: "#059669",
  REJECTED: "#DC2626",
  DRAFT: "#64748B",
};

const MAJOR_PALETTE = ["#2563EB", "#7C3AED", "#059669", "#0891B2", "#D97706", "#DC2626", "#94A3B8"];

function BarChart({ data, valueKey = "count", labelKey = "month", accentLast = true }) {
  const values = data.map(d => Number(d[valueKey] || 0));
  const max = Math.max(1, ...values);
  if (!data.length) return <EmptyState label="ยังไม่มีข้อมูล" />;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180 }}>
      {data.map((d, i) => {
        const v = Number(d[valueKey] || 0);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)" }}>{v}</span>
            <div style={{
              width: "100%", borderRadius: "6px 6px 0 0",
              height: `${(v / max) * 100}%`,
              background: accentLast && i === data.length - 1
                ? "linear-gradient(180deg, #2563EB, #60A5FA)"
                : "linear-gradient(180deg, #60A5FA, #DBEAFE)",
              minHeight: 8, transition: "height 0.5s ease",
            }} />
            <span style={{ fontSize: 10.5, color: "var(--text-muted)", fontWeight: 600, textAlign: "center" }}>
              {d[labelKey]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalBars({ data, valueKey = "count", labelKey = "major" }) {
  const total = data.reduce((s, d) => s + Number(d[valueKey] || 0), 0) || 1;
  if (!data.length) return <EmptyState label="ยังไม่มีข้อมูล" />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.slice(0, 7).map((d, i) => {
        const v = Number(d[valueKey] || 0);
        const pct = Math.round((v / total) * 1000) / 10;
        const color = MAJOR_PALETTE[i % MAJOR_PALETTE.length];
        return (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color }}></span>
                {d[labelKey] || "Unknown"}
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "var(--text-primary)" }}>
                {v} ({pct}%)
              </span>
            </div>
            <div style={{ height: 6, background: "var(--n-100)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 1s ease" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusFunnel({ byStatus }) {
  const order = ["PENDING", "REVIEWING", "INTERVIEW_SCHEDULED", "OFFER_EXTENDED", "ACCEPTED", "REJECTED"];
  const labels = {
    PENDING: "รอพิจารณา", REVIEWING: "กำลังพิจารณา",
    INTERVIEW_SCHEDULED: "นัดสัมภาษณ์", OFFER_EXTENDED: "ยื่นข้อเสนอ",
    ACCEPTED: "รับเข้า", REJECTED: "ปฏิเสธ",
  };
  const max = Math.max(1, ...order.map(k => byStatus[k] || 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {order.map(k => {
        const v = byStatus[k] || 0;
        const pct = (v / max) * 100;
        return (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 120, fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>{labels[k]}</div>
            <div style={{ flex: 1, height: 24, background: "var(--n-100)", borderRadius: 8, overflow: "hidden", position: "relative" }}>
              <div style={{
                height: "100%", width: `${pct}%`, background: STATUS_COLORS[k] || "#64748B",
                transition: "width 0.6s ease", display: "flex", alignItems: "center", paddingLeft: 10,
                color: "white", fontSize: 11, fontWeight: 800,
              }}>
                {v > 0 ? v : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlacementTable({ rows }) {
  if (!rows.length) return <EmptyState label="ยังไม่มีข้อมูล" />;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "var(--text-muted)", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase" }}>
            <th style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)" }}>สาขา</th>
            <th style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>ได้งาน</th>
            <th style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>ใบสมัคร</th>
            <th style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>อัตรา</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 8).map((r, i) => (
            <tr key={i}>
              <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", fontWeight: 600 }}>{r.major}</td>
              <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>{r.placed}</td>
              <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right" }}>{r.total}</td>
              <td style={{ padding: "10px 8px", borderBottom: "1px solid var(--border)", textAlign: "right", fontWeight: 800, color: "#059669" }}>{r.rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
      <i className="fas fa-chart-line" style={{ fontSize: 24, opacity: .4, marginBottom: 8 }}></i>
      <p>{label}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check user role and redirect if student
    api.getMe()
      .then(user => {
        setUser(user);
        const roles = user?.roles || [];
        if (roles.includes("STUDENT")) {
          router.replace("/student/dashboard");
          return;
        }
        // Load analytics for non-student roles
        return api.getAnalyticsDashboard();
      })
      .then(setData)
      .catch(err => {
        if (err.message?.includes("403") || err.message?.includes("401")) {
          setError("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        } else {
          setError(err.message || "โหลดข้อมูลไม่สำเร็จ");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>กำลังโหลด...</div>;
  }
  if (error) {
    return (
      <div className="alert alert-error" style={{ marginTop: 24 }}>
        <i className="fas fa-circle-exclamation"></i> {error}
      </div>
    );
  }
  if (!data) return null;

  const accepted = data.applicationsByStatus?.ACCEPTED || 0;
  const total = data.totalApplications || 0;
  const successRate = total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0;

  const stats = [
    { label: "ใบสมัครทั้งหมด", value: total.toLocaleString(), icon: "fa-file-signature", color: "#2563EB", bg: "#EFF6FF" },
    { label: "ตำแหน่งงาน", value: (data.totalInternships || 0).toLocaleString(), icon: "fa-briefcase", color: "#7C3AED", bg: "#F5F3FF" },
    { label: "ทริป", value: (data.totalTrips || 0).toLocaleString(), icon: "fa-bus", color: "#0891B2", bg: "#ECFEFF" },
    { label: "อัตราสำเร็จ", value: `${successRate}%`, icon: "fa-check-double", color: "#059669", bg: "#ECFDF5" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Premium Header */}
      <div className="mesh-dark" style={{ borderRadius: 24, padding: "36px 40px", position: "relative" }}>
        <div style={{ position:"relative", zIndex:1 }}>
          <span className="pill-premium"><i className="fas fa-chart-line"></i> Platform Intelligence</span>
          <h1 style={{ fontSize:30, fontWeight:900, color:"white", letterSpacing:"-0.8px", margin:"14px 0 8px" }}>
            วิเคราะห์<span className="gradient-text-blue"> ข้อมูล</span>
          </h1>
          <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.55)" }}>
            สถิติสด (Real-time) ของแพลตฟอร์มฝึกงานและทริปศึกษาดูงาน
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4 stagger" style={{ gap: 16 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-premium" style={{ "--accent": s.color, display:"flex", flexDirection:"column", gap:18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: s.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: s.color, fontSize: 18,
              }}>
                <i className={`fas ${s.icon}`}></i>
              </div>
            </div>
            <div>
              <p className="stat-card-label">{s.label}</p>
              <p className="stat-card-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Row 1: Monthly + Status funnel */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        <div className="premium-card" style={{ padding: 28 }}>
          <div className="section-head"><h2>ใบสมัครรายเดือน (6 เดือนล่าสุด)</h2></div>
          <BarChart data={data.monthlyApplications || []} valueKey="count" labelKey="month" />
        </div>

        <div className="premium-card" style={{ padding: 28 }}>
          <div className="section-head"><h2>Pipeline / สถานะใบสมัคร</h2></div>
          <StatusFunnel byStatus={data.applicationsByStatus || {}} />
        </div>
      </div>

      {/* Row 2: Major breakdown + Placement */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="premium-card" style={{ padding: 28 }}>
          <div className="section-head"><h2>สัดส่วนใบสมัครแยกตามสาขา</h2></div>
          <HorizontalBars data={data.applicationsByMajor || []} valueKey="count" labelKey="major" />
        </div>

        <div className="premium-card" style={{ padding: 28 }}>
          <div className="section-head"><h2>อัตราการได้งานแยกตามสาขา</h2></div>
          <PlacementTable rows={data.placementRateByMajor || []} />
        </div>
      </div>
    </div>
  );
}

// Legacy mockup implementation kept below for reference — unused.
/* eslint-disable */
function _legacy_unused() {
  const stats = [
    { label:"ผู้เข้าฝึกงานทั้งหมด", value:"142", icon:"fa-users",        color:"#2563EB", bg:"#EFF6FF", change:"+12%" },
    { label:"บริษัทพันธมิตร",         value:"28",  icon:"fa-building",     color:"#059669", bg:"#ECFDF5", change:"+3"    },
    { label:"อัตราสำเร็จ",           value:"94%", icon:"fa-check-double", color:"#7C3AED", bg:"#F5F3FF", change:"+2%"   },
    { label:"ความพึงพอใจ",            value:"4.8", icon:"fa-star",         color:"#D97706", bg:"#FFFBEB", change:"/ 5.0" },
  ];

  const industries = [
    { label:"เทคโนโลยีสารสนเทศ",   pct:45, color:"#2563EB" },
    { label:"การตลาดดิจิทัล",       pct:25, color:"#7C3AED" },
    { label:"การเงินและธนาคาร",      pct:15, color:"#059669" },
    { label:"โลจิสติกส์",           pct:10, color:"#0891B2" },
    { label:"อื่นๆ",                pct:5,  color:"#94A3B8" },
  ];

  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."];
  const values = [28, 45, 38, 60, 52, 72];
  const maxVal = Math.max(...values);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Header */}
      <div>
        <p className="page-eyebrow">Platform Intelligence</p>
        <h1 className="page-title">วิเคราะห์ข้อมูล</h1>
        <p className="page-subtitle">สรุปภาพรวมสถิติและประสิทธิภาพของแพลตฟอร์มฝึกงานและทริปศึกษาดูงาน</p>
      </div>

      {/* KPI Cards */}
      <div className="grid-4 stagger" style={{ gap:16 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{
                width:44, height:44, borderRadius:12,
                background: s.bg,
                display:"flex", alignItems:"center", justifyContent:"center",
                color: s.color, fontSize:18,
              }}>
                <i className={`fas ${s.icon}`}></i>
              </div>
              <span style={{
                fontSize:11, fontWeight:700, padding:"3px 8px",
                background: s.bg, color: s.color, borderRadius:99,
              }}>
                {s.change}
              </span>
            </div>
            <div>
              <p className="stat-card-label">{s.label}</p>
              <p className="stat-card-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Bar Chart */}
        <div className="card" style={{ padding:28 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:"var(--text-primary)", marginBottom:24 }}>
            จำนวนผู้เข้าฝึกงาน (รายเดือน)
          </h3>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:160 }}>
            {values.map((v, i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)" }}>{v}</span>
                <div style={{
                  width:"100%", borderRadius:"6px 6px 0 0",
                  height: `${(v / maxVal) * 100}%`,
                  background: i === values.length - 1
                    ? "linear-gradient(180deg, #2563EB, #60A5FA)"
                    : "var(--n-100)",
                  minHeight:8, transition:"height 0.5s ease",
                }}></div>
                <span style={{ fontSize:10.5, color:"var(--text-muted)", fontWeight:600 }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="card" style={{ padding:28 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:"var(--text-primary)", marginBottom:24 }}>
            สัดส่วนอุตสาหกรรม
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {industries.map((ind, i) => (
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"var(--text-secondary)", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:8, height:8, borderRadius:2, background:ind.color, display:"inline-block" }}></span>
                    {ind.label}
                  </span>
                  <span style={{ fontSize:12, fontWeight:800, color:"var(--text-primary)" }}>{ind.pct}%</span>
                </div>
                <div style={{ height:6, background:"var(--n-100)", borderRadius:99, overflow:"hidden" }}>
                  <div style={{
                    height:"100%", width:`${ind.pct}%`,
                    background:ind.color, borderRadius:99,
                    transition:"width 1s ease",
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark summary card */}
      <div style={{
        background:"var(--n-900)", borderRadius:24, padding:"36px 40px",
        display:"grid", gridTemplateColumns:"repeat(3, 1fr)",
        gap:40, position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-40, bottom:-60, width:200, height:200, borderRadius:"50%", background:"rgba(37,99,235,0.1)" }}></div>
        {[
          { val:"3.2s",  label:"เวลาตอบสนองเฉลี่ย",     sub:"Response time" },
          { val:"99.8%", label:"ความพร้อมใช้งาน",       sub:"System uptime" },
          { val:"1,204", label:"คำขอต่อวัน",            sub:"Daily API requests" },
        ].map((m, i) => (
          <div key={i} style={{ position:"relative" }}>
            <p style={{ fontSize:30, fontWeight:900, color:"white", letterSpacing:"-1px" }}>{m.val}</p>
            <p style={{ fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.7)", marginTop:4 }}>{m.label}</p>
            <p style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600, marginTop:2 }}>{m.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
