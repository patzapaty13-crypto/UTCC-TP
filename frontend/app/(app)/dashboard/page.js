"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { id: "intern", path: "/internships", label: "ค้นหางาน", sub: "Browse Internships", icon: "fa-magnifying-glass", color: "#3B82F6", forStudent: true },
  { id: "apps", path: "/applications", label: "ใบสมัคร", sub: "My Applications", icon: "fa-clipboard-user", color: "#10B981", forStudent: true },
  { id: "ats", path: "/recruitment", label: "ระบบ ATS", sub: "Candidate Tracking", icon: "fa-users-gear", color: "#8B5CF6", forStaff: true },
  { id: "stu", path: "/advisor/students", label: "นักศึกษา", sub: "Manage Students", icon: "fa-user-group", color: "#0ea5e9", forAdvisor: true },
  { id: "rep", path: "/advisor/reports", label: "ตรวจงาน", sub: "Review Reports", icon: "fa-file-pen", color: "#f59e0b", forAdvisor: true },
  { id: "submit", path: "/student/reports", label: "ส่งรายงาน", sub: "Submit Work", icon: "fa-file-signature", color: "#f59e0b", forStudent: true },
  { id: "chat", path: "/messages", label: "แชท", sub: "Peer Messages", icon: "fa-comments", color: "#2563EB" },
  { id: "analytics", path: "/analytics", label: "วิเคราะห์", sub: "System Analytics", icon: "fa-chart-mixed", color: "#ec4899", forStaff: true, forAdvisor: true },
  { id: "admin", path: "/admin/settings", label: "ตั้งค่าระบบ", sub: "Control Panel", icon: "fa-shield-halved", color: "#64748b", forAdmin: true },
];

export default function NexusDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const initialize = async () => {
      try {
        const u = await api.getMe();
        setUser(u);
        const s = await api.getDashboard();
        setStats(s);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    initialize();
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = async () => {
    try { await api.logout(); } catch (e) {}
    localStorage.removeItem("utcctp_token");
    router.push("/login");
  };

  const roles = user?.roles || ["STUDENT"];
  const role = roles[0];
  const initials = (user?.displayName || user?.username || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const accessibleNav = NAV_ITEMS.filter(n => {
    if (n.forStudent && !roles.includes("STUDENT")) return false;
    if (n.forAdvisor && !roles.includes("ADVISOR")) return false;
    if (n.forStaff && !roles.includes("STAFF") && !roles.includes("ADMIN")) return false;
    if (n.forAdmin && !roles.includes("ADMIN")) return false;
    return true;
  });

  if (loading) return (
    <div className="nexus-loading">
      <div className="pulse-loader"></div>
      <p>NEXUS ENGINE BOOTING...</p>
    </div>
  );

  return (
    <div className="nexus-shell">
      <style jsx global>{`
        :root {
          --glass: rgba(255, 255, 255, 0.7);
          --glass-border: rgba(255, 255, 255, 0.4);
          --nexus-blue: #2563EB;
          --nexus-purple: #7C3AED;
          --text-deep: #0F172A;
          --text-soft: #64748B;
        }

        body {
          background: radial-gradient(circle at top right, #f0f9ff, #fdf4ff);
          min-height: 100vh;
        }

        .nexus-shell {
          display: grid;
          grid-template-columns: 320px 1fr 340px;
          gap: 24px;
          padding: 24px;
          max-width: 1800px;
          margin: 0 auto;
        }

        .glass-card {
          background: var(--glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(37, 99, 235, 0.06);
        }

        .role-badge {
          display: inline-flex;
          padding: 5px 12px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, var(--nexus-blue), var(--nexus-purple));
          color: white;
        }

        .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .nexus-nav-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        .btn-nexus-logout {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          width: 100%; padding: 14px; border-radius: 16px; border: none;
          background: #fee2e2; color: #dc2626; font-weight: 800; cursor: pointer; transition: all 0.2s;
        }
        .btn-nexus-logout:hover { background: #fecaca; }

        /* Responsive */
        @media (max-width: 1500px) {
          .nexus-shell { grid-template-columns: 300px 1fr; }
          .nexus-side-feed { display: none; }
        }
        @media (max-width: 1100px) {
          .nexus-shell { grid-template-columns: 1fr; }
          .nexus-side-control { position: relative !important; top: 0 !important; height: auto !important; }
          .metric-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .metric-grid { grid-template-columns: 1fr; }
          .nexus-nav-grid { grid-template-columns: 1fr; }
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(37, 99, 235, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        .nexus-loading { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; }
        .pulse-loader { width: 40px; height: 40px; border-radius: 50%; background: var(--nexus-blue); animation: pulse 1.5s infinite; }
      `}</style>

      {/* ── Left Sidebar ── */}
      <div className="nexus-side-control animate-fade-in" style={{ position: "sticky", top: 24, height: "calc(100vh - 48px)", display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="glass-card" style={{ padding: "32px 24px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: "white", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "var(--nexus-blue)", fontWeight: 900, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.05)" }}>{initials}</div>
          <div className="role-badge" style={{ marginBottom: 12 }}>{role}</div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-deep)", marginBottom: 4 }}>{user?.displayName || user?.username}</h2>
          <p style={{ fontSize: 12, color: "var(--text-soft)", marginBottom: 24 }}>NEXUS ID: {user?.id?.slice(0,8) || "GUEST"}</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "left" }}>
            <Link href="/dashboard" style={sideNavLink(true)}><i className="fas fa-grid-horizontal" style={{width: 20}}></i> แดชบอร์ด</Link>
            <Link href="/messages" style={sideNavLink(false)}><i className="fas fa-comments" style={{width: 20}}></i> แชทข้อความ</Link>
            <Link href="/profile" style={sideNavLink(false)}><i className="fas fa-user-gear" style={{width: 20}}></i> โปรไฟล์</Link>
          </div>
        </div>

        <div className="glass-card" style={{ flex: 1, padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: 10, fontWeight: 900, color: "var(--text-soft)", marginBottom: 16, letterSpacing: 1.5 }}>SYSTEM STATUS</p>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--text-deep)", letterSpacing: -0.5 }}>{time.toLocaleTimeString([], { hour12: false })}</div>
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#10B981", fontWeight: 700 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }}></div>
                  ACTIVE NODE
                </div>
            </div>
            <button className="btn-nexus-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              ออกจากระบบ
            </button>
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <div className="nexus-main-workspace animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <i className="fas fa-stars" style={{ color: "#F59E0B", fontSize: 24 }}></i>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-deep)", letterSpacing: "-1.5px" }}>ยินดีต้อนรับ, {user?.displayName?.split(" ")[0]}</h1>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-soft)" }}>Dashboard Update • {time.toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>
        </div>

        <div className="metric-grid">
            <MetricCard label="โปรไฟล์" value="85%" icon="fa-id-card-clip" color="#2563EB" tag="Ready" />
            <MetricCard label="ใบสมัคร" value={stats?.totalApplications || 0} icon="fa-paper-plane" color="#10B981" tag="Active" />
            <MetricCard label="นัดหมาย" value={stats?.pendingInterviews || 0} icon="fa-calendar-star" color="#7C3AED" tag="Soon" />
            <MetricCard label="รายงาน" value="0" icon="fa-file-shield" color="#F59E0B" tag="Safe" />
        </div>

        <div>
            <div className="section-head"><h2><i className="fas fa-layer-group" style={{ color: "var(--nexus-blue)" }}></i> บริการสำหรับคุณ</h2></div>
            <div className="nexus-nav-grid">
               {accessibleNav.map((item) => (
                 <Link key={item.id} href={item.path} className="glass-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: item.color + "10", color: item.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      <i className={`fas ${item.icon}`}></i>
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 900, color: "var(--text-deep)" }}>{item.label}</p>
                      <p style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 1 }}>{item.sub}</p>
                    </div>
                    <i className="fas fa-arrow-right" style={{ marginLeft: "auto", color: "#CBD5E1", fontSize: 12 }}></i>
                 </Link>
               ))}
            </div>
        </div>

        <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}><i className="fas fa-wave-pulse" style={{ color: "var(--nexus-blue)", marginRight: 8 }}></i> กิจกรรมล่าสุด</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
               {[
                 { title: "สมัครงาน UX Designer", cmp: "Agoda Thailand", time: "2 ชม. ที่แล้ว", color: "#3B82F6" },
                 { title: "นัดสัมภาษณ์งาน", cmp: "SCB TechX", time: "5 ชม. ที่แล้ว", color: "#7C3AED" },
               ].map((act, i) => (
                 <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: 14, background: "rgba(241, 245, 249, 0.4)", borderRadius: 16 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: act.color+"15", color: act.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      <i className="fas fa-history"></i>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text-deep)" }}>{act.title}</p>
                        <p style={{ fontSize: 11, color: "var(--text-soft)" }}>{act.cmp} • {act.time}</p>
                    </div>
                 </div>
               ))}
            </div>
        </div>
      </div>

      {/* ── Side Feed ── */}
      <div className="nexus-side-feed animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, marginBottom: 16 }}><i className="fas fa-rss" style={{ color: "var(--nexus-purple)" }}></i> ข่าวประกาศ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "var(--text-deep)" }}>อัปเดตระบบความปลอดภัย</p>
                    <p style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 4 }}>End-to-end encryption active</p>
                </div>
            </div>
        </div>

        <div className="glass-card" style={{ 
          padding: 32, flex: 1, 
          background: "linear-gradient(135deg, #2563EB, #7C3AED)", 
          border: "none", color: "white", textAlign: "center", 
          display: "flex", flexDirection: "column", justifyContent: "center",
          position: "relative", overflow: "hidden"
        }}>
           {/* Decorative Sparkles */}
           <i className="fas fa-sparkles" style={{ position: "absolute", top: 15, right: 15, opacity: 0.3, fontSize: 24 }}></i>
           <i className="fas fa-star" style={{ position: "absolute", bottom: 20, left: 20, opacity: 0.2, fontSize: 14 }}></i>
           
           <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24 }}>
             <i className="fas fa-wand-magic-sparkles"></i>
           </div>
           
           <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, letterSpacing: "-0.5px" }}>Nexus AI</h3>
           <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 24, lineHeight: 1.5 }}>
             ให้ผู้ช่วย AI อัจฉริยะช่วยคุณ<br/>ค้นหางานและตอบข้อสงสัย
           </p>
           
           <Link href="/chat" style={{ 
             width: "100%", height: 44, borderRadius: 12, 
             background: "white", color: "#2563EB", 
             fontWeight: 800, fontSize: 13, border: "none",
             display: "flex", alignItems: "center", justifyContent: "center",
             textDecoration: "none", boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
             transition: "transform 0.2s"
           }}
           onMouseEnter={(e) => e.target.style.transform = "scale(1.03)"}
           onMouseLeave={(e) => e.target.style.transform = "scale(1)"}>
             พูดคุยกับ Nexus AI
           </Link>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, icon, color, tag }) {
  return (
    <div className="glass-card" style={{ padding: 20, borderTop: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: color + "10", color: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          <i className={`fas ${icon}`}></i>
        </div>
        <span style={{ fontSize: 9, fontWeight: 900, color: color, background: color+"10", padding: "3px 8px", borderRadius: 4 }}>{tag}</span>
      </div>
      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-soft)" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-deep)", marginTop: 2 }}>{value}</p>
    </div>
  );
}

const sideNavLink = (active) => ({
  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px",
  borderRadius: "12px", textDecoration: "none",
  color: active ? "var(--nexus-blue)" : "var(--text-soft)",
  background: active ? "#eff6ff" : "transparent",
  fontWeight: active ? 800 : 600,
  fontSize: "14px",
  transition: "all 0.2s"
});
