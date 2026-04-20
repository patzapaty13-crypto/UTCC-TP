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
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1000, margin: "0 auto" }}>
      {/* ── Light & Minimal Header Profile Card ── */}
      <div className="animate-scale-in" style={{ 
        display: "flex", flexWrap: "wrap", gap: 40, alignItems: "center",
        background: "var(--bg-surface)",
        borderRadius: 24,
        padding: "48px",
        boxShadow: "var(--shadow-md)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle decorative background blur inside card */}
        <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, rgba(255,255,255,0) 70%)", filter: "blur(30px)", pointerEvents: "none" }}></div>

        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <div style={{
            width: 130, height: 130, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--brand-50), var(--brand-100))",
            color: "var(--brand-700)", fontSize: 44, fontWeight: 900,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(37,99,235,0.15)",
            border: "4px solid white"
          }}>
            {initials}
          </div>
          {/* Online Status Badge */}
          <div style={{
            position: "absolute", bottom: 6, right: 6, width: 22, height: 22,
            background: "var(--success)", borderRadius: "50%",
            border: "4px solid white"
          }}></div>
        </div>

        <div style={{ flex: 1, minWidth: 280, zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ 
              padding: "6px 14px", background: "var(--brand-50)", color: "var(--brand-700)",
              fontSize: 12, fontWeight: 700, borderRadius: 99,
              display: "inline-flex", alignItems: "center", gap: 6, letterSpacing: "0.02em"
            }}>
              <i className="fas fa-shield-halved"></i>
              {displayRole}
            </div>
            <div style={{ padding: "6px 14px", background: "var(--n-50)", color: "var(--n-500)", fontSize: 12, fontWeight: 600, borderRadius: 99, border: "1px solid var(--n-200)" }}>
              ID: {user.id ? String(user.id).slice(0, 8).toUpperCase() : "UTCC-2026"}
            </div>
          </div>
          
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "var(--n-900)", letterSpacing: "-1px", marginBottom: 8 }}>
            {user.displayName || user.username}
          </h1>
          <p style={{ color: "var(--n-500)", fontSize: 16, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
            <i className="fas fa-envelope" style={{ color: "var(--n-400)" }}></i>
            {user.email || `${user.username}@live.utcc.ac.th`}
          </p>
        </div>

        {/* Quick Stats side */}
        <div style={{ display:"flex", gap:16, zIndex: 1 }}>
          <div style={{ padding: "16px 24px", background: "var(--n-50)", borderRadius: 16, border: "1px solid var(--n-100)", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--brand-600)" }}>12</div>
            <div style={{ fontSize: 11, color: "var(--n-500)", fontWeight: 700, marginTop: 4, textTransform:"uppercase" }}>Total Trips</div>
          </div>
          <div style={{ padding: "16px 24px", background: "var(--n-50)", borderRadius: 16, border: "1px solid var(--n-100)", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--success)" }}>3</div>
            <div style={{ fontSize: 11, color: "var(--n-500)", fontWeight: 700, marginTop: 4, textTransform:"uppercase" }}>Internships</div>
          </div>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        
        {/* Card 1: Account Info */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--n-200)",
          boxShadow: "var(--shadow-sm)",
          borderRadius: 20, padding: 32,
          transition: "all 0.3s ease",
          cursor: "default"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--n-900)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <i className="fas fa-fingerprint" style={{ color: "var(--brand-500)", fontSize: 18 }}></i> ข้อมูลยืนยันตัวตน
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", marginBottom: 6 }}>Username</label>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--n-800)", padding: "12px 16px", background: "var(--n-50)", borderRadius: 12, border: "1px solid var(--n-100)" }}>
                {user.username}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", marginBottom: 6 }}>Account Status</label>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--success)", padding: "12px 16px", background: "var(--success)10", backgroundColor: "#ECFDF5", borderRadius: 12, border: "1px solid #A7F3D0", display:"flex", alignItems:"center", gap:10 }}>
                <i className="fas fa-circle-check"></i> ยืนยันตัวตนแล้ว (Verified)
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Academic Info */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--n-200)",
          boxShadow: "var(--shadow-sm)",
          borderRadius: 20, padding: 32,
          transition: "all 0.3s ease",
          cursor: "default"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--n-900)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <i className="fas fa-graduation-cap" style={{ color: "#8B5CF6", fontSize: 18 }}></i> ข้อมูลสังกัดวิชาการ
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--n-400)", textTransform: "uppercase", marginBottom: 6 }}>คณะ / สาขา</label>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--n-700)", padding: "12px 16px", background: "var(--n-50)", borderRadius: 12, border: "1px solid var(--n-100)", lineHeight: 1.6 }}>
                คณะวิทยาศาสตร์และเทคโนโลยี<br/>สาขาวิชาเทคโนโลยีสารสนเทศ
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <div style={{ padding: "8px 16px", background: "var(--n-50)", border: "1px solid var(--n-200)", borderRadius: 8, fontSize: 12, color: "var(--n-600)", fontWeight: 700 }}>
                ชั้นปีที่ 3 (Junior)
              </div>
              <div style={{ padding: "8px 16px", background: "var(--n-50)", border: "1px solid var(--n-200)", borderRadius: 8, fontSize: 12, color: "var(--n-600)", fontWeight: 700 }}>
                รหัสหลักสูตร: IT-2023
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Actions */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--n-200)",
          boxShadow: "var(--shadow-sm)",
          borderRadius: 20, padding: 32,
          transition: "all 0.3s ease",
          cursor: "default"
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--n-900)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <i className="fas fa-shield-keyhole" style={{ color: "#F59E0B", fontSize: 18 }}></i> ความปลอดภัย
          </h3>
          
          <p style={{ fontSize: 13, color: "var(--n-500)", lineHeight: 1.6, marginBottom: 24, fontWeight: 500 }}>
            ระบบถูกป้องกันด้วยมาตรฐาน OAuth2 และรหัสผ่านของคุณถูกเข้ารหัสทางฝ่ายผู้ดูแลระบบส่วนกลาง
          </p>

          <button style={{
            width: "100%", padding: "14px 20px",
            background: "var(--n-100)", color: "var(--n-400)",
            border: "1px dashed var(--n-300)", borderRadius: 12,
            fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            cursor: "not-allowed", transition: "all 0.2s"
          }}>
            <i className="fas fa-lock"></i> เปลี่ยนรหัสผ่าน (Locked)
          </button>
        </div>
        
      </div>
    </div>
  );
}
