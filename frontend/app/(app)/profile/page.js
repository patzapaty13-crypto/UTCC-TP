"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div className="skeleton" style={{ height: 160, borderRadius: 20 }}></div>
      </div>
    );
  }

  if (!user) {
    return <div className="alert alert-error">ไม่สามารถดึงข้อมูลโปรไฟล์ได้</div>;
  }

  const initials = (user.displayName || user.username || "U")
    .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const roleLabels = {
    STUDENT: "นักศึกษา",
    ADVISOR: "อาจารย์ที่ปรึกษา",
    STAFF: "เจ้าหน้าที่โครงการ",
    ADMIN: "ผู้ดูแลระบบปฏิบัติการจัดเก็บแพลตฟอร์ม",
  };

  const primaryRole = user.roles?.[0] || "USER";
  const displayRole = roleLabels[primaryRole] || primaryRole;

  return (
    <div style={{ 
      position: "relative",
      minHeight: "calc(100vh - 60px)",
      overflow: "hidden",
      fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif",
      color: "white"
    }}>
      {/* Background Decorative Elements */}
      <div style={{ position: "absolute", top: -150, right: -150, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(11,15,26,0) 70%)", filter: "blur(40px)" }}></div>
      <div style={{ position: "absolute", bottom: -200, left: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(11,15,26,0) 70%)", filter: "blur(60px)" }}></div>
      
      <div style={{ position: "relative", zIndex: 10, padding: "48px", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* ── Glass Header Profile Card ── */}
        <div className="animate-scale-in" style={{ 
          display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 24,
          padding: "48px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}>
          {/* Avatar Ring */}
          <div style={{ position: "relative" }}>
            <div style={{
              position:"absolute", inset:-8, borderRadius:"50%",
              background:"linear-gradient(135deg, var(--brand-500), #8B5CF6)", opacity:0.5, filter:"blur(12px)"
            }}></div>
            <div style={{
              position:"relative",
              width: 140, height: 140, borderRadius: "50%",
              background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
              color: "white", fontSize: 48, fontWeight: 900,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              border: "2px solid rgba(255,255,255,0.15)"
            }}>
              {initials}
            </div>
            {/* Online Status Badge */}
            <div style={{
              position: "absolute", bottom: 4, right: 12, width: 20, height: 20,
              background: "#10B981", borderRadius: "50%",
              border: "3px solid #0B0F1A", boxShadow: "0 0 10px rgba(16,185,129,0.5)"
            }}></div>
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ 
                padding: "6px 14px", background: "rgba(37,99,235,0.15)", color: "#93C5FD",
                fontSize: 12, fontWeight: 700, borderRadius: 99, border: "1px solid rgba(59,130,246,0.3)",
                display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.05em"
              }}>
                <i className="fas fa-shield-halved"></i>
                {displayRole}
              </div>
              <div style={{ padding: "6px 14px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, borderRadius: 99 }}>
                ID: {user.id ? user.id.slice(0, 8).toUpperCase() : "UTCC-2026"}
              </div>
            </div>
            
            <h1 style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: "-0.5px", marginBottom: 8, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}>
              {user.displayName || user.username}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-envelope" style={{ color: "rgba(255,255,255,0.3)" }}></i>
              {user.email || `${user.username}@live.utcc.ac.th`}
            </p>
          </div>

          {/* Quick Stats side */}
          <div style={{ display:"flex", gap:16 }}>
            <div style={{ padding: "16px 24px", background: "rgba(0,0,0,0.3)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#93C5FD" }}>12</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, marginTop: 4, textTransform:"uppercase" }}>Total Trips</div>
            </div>
            <div style={{ padding: "16px 24px", background: "rgba(0,0,0,0.3)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#A7F3D0" }}>3</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 700, marginTop: 4, textTransform:"uppercase" }}>Internships</div>
            </div>
          </div>
        </div>

        {/* ── Info Grid ── */}
        <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          
          {/* Card 1: Account Info */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 20, padding: 32,
            transition: "all 0.3s ease",
            cursor: "default"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"}
          >
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-fingerprint" style={{ color: "#60A5FA" }}></i> ข้อมูลยืนยันตัวตน
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>Username</label>
                <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.85)", padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 12 }}>
                  {user.username}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>Account Status</label>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#10B981", padding: "12px 16px", background: "rgba(16,185,129,0.05)", borderRadius: 12, display:"flex", alignItems:"center", gap:10 }}>
                  <i className="fas fa-circle-check"></i> ยืนยันตัวตนแล้ว (Verified)
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Academic Info */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 20, padding: 32,
            transition: "all 0.3s ease",
            cursor: "default"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"}
          >
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-graduation-cap" style={{ color: "#A78BFA" }}></i> ข้อมูลสังกัดวิชาการ
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>คณะ / สาขา</label>
                <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)", padding: "12px 16px", background: "rgba(0,0,0,0.2)", borderRadius: 12, lineHeight: 1.6 }}>
                  คณะวิทยาศาสตร์และเทคโนโลยี<br/>สาขาวิชาเทคโนโลยีสารสนเทศ
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 8, fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                  ชั้นปีที่ 3 (Junior)
                </div>
                <div style={{ padding: "8px 16px", background: "rgba(255,255,255,0.05)", borderRadius: 8, fontSize: 12, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                  รหัสหลักสูตร: IT-2023
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Security & Actions */}
          <div style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: 20, padding: 32,
            transition: "all 0.3s ease",
            cursor: "default"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)"}
          >
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "white", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-shield-keyhole" style={{ color: "#FBBF24" }}></i> ความปลอดภัย
            </h3>
            
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 24 }}>
              ระบบถูกป้องกันด้วยมาตรฐาน OAuth2 และรหัสผ่านของคุณถูกเข้ารหัสทางฝ่ายผู้ดูแลระบบส่วนกลาง
            </p>

            <button style={{
              width: "100%", padding: "14px 20px",
              background: "rgba(255,255,255,0.05)", color: "white",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
              fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              cursor: "not-allowed", transition: "all 0.2s"
            }}>
              <i className="fas fa-lock"></i> เปลี่ยนรหัสผ่าน (Locked)
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
