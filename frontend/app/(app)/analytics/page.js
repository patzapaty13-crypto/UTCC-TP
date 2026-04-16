"use client";

export default function AnalyticsPage() {
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
