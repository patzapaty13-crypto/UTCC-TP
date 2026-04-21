"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Change Password State
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  useEffect(() => {
    api.getMe()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwdError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    setPwdLoading(true);
    setPwdError("");
    setPwdSuccess("");
    try {
      await api.changePassword({ oldPassword, newPassword });
      setPwdSuccess("เปลี่ยนรหัสผ่านสำเร็จ!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      setPwdError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#2563EB", animation: "pulse 1.5s infinite" }}></div>
        <p style={{ fontWeight: 800, color: "#64748B", letterSpacing: 1 }}>FETCHING PROFILE...</p>
        <style jsx>{` 
          @keyframes pulse { 
            0% { transform: scale(0.95); opacity: 0.5; } 
            70% { transform: scale(1); opacity: 1; } 
            100% { transform: scale(0.95); opacity: 0.5; } 
          } 
        `}</style>
      </div>
    );
  }

  if (!user) return <div style={{ padding: 40, textAlign: "center", color: "#EF4444", fontWeight: 700 }}>ไม่สามารถดึงข้อมูลโปรไฟล์ได้</div>;

  const initials = (user.displayName || user.username || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const primaryRole = user.roles?.[0] || "USER";
  const displayRole = { STUDENT: "นักศึกษา", ADVISOR: "อาจารย์ที่ปรึกษา", STAFF: "เจ้าหน้าที่โครงการ", ADMIN: "ผู้ดูแลระบบ" }[primaryRole] || primaryRole;

  const theme = {
    primary: "#2563EB",
    secondary: "#7C3AED",
    textDeep: "#0F172A",
    textSoft: "#64748B",
    bg: "#F8FAFC",
    glass: "rgba(255, 255, 255, 0.9)",
    border: "rgba(0,0,0,0.06)",
    radius: "24px"
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 0 40px", display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.5s ease-out" }}>
      <style jsx global>{` 
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes slideUp { 
          from { transform: translateY(20px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
      `}</style>

      {/* ── Header Section ── */}
      <div style={{ background: "white", borderRadius: "32px", overflow: "hidden", border: `1px solid ${theme.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ height: 180, background: "linear-gradient(135deg, #2563EB, #7C3AED, #F43F5E)", position: "relative" }}>
           <div style={{ position: "absolute", inset: 0, background: "url('https://www.transparenttextures.com/patterns/cubes.png')", opacity: 0.1 }}></div>
        </div>
        <div style={{ padding: "0 40px 40px", display: "flex", alignItems: "flex-end", gap: 24, marginTop: -60, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 140, height: 140, borderRadius: 40, background: "white", border: "6px solid white", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 900, color: theme.primary }}>
              {initials}
            </div>
            <div style={{ position: "absolute", bottom: 10, right: 10, width: 24, height: 24, background: "#10B981", border: "4px solid white", borderRadius: "50%" }}></div>
          </div>
          <div style={{ flex: 1, minWidth: 250, paddingBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontSize: 32, fontWeight: 900, color: theme.textDeep, margin: 0, letterSpacing: "-1px" }}>{user.displayName || user.username}</h1>
              <i className="fas fa-circle-check" style={{ color: theme.primary, fontSize: 20 }}></i>
            </div>
            <p style={{ color: theme.textSoft, fontWeight: 600, marginBottom: 12 }}>{user.email || `${user.username}@live.utcc.ac.th`}</p>
            <div style={{ display: "inline-flex", padding: "4px 12px", background: "#EFF6FF", color: theme.primary, borderRadius: 99, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>{displayRole}</div>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <button style={{ padding: "12px 28px", background: theme.textDeep, color: "white", border: "none", borderRadius: "16px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              แก้ไขโปรไฟล์
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 32, borderBottom: `1px solid #E2E8F0`, padding: "0 10px" }}>
        {['overview', 'academic', 'security'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "16px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", position: "relative", color: activeTab === tab ? theme.primary : theme.textSoft, transition: "all 0.2s" }}>
            {tab === 'overview' ? 'ภาพรวม' : tab === 'academic' ? 'การศึกษา' : 'ความปลอดภัย'}
            {activeTab === tab && <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 3, background: theme.primary, borderRadius: 3 }}></div>}
          </div>
        ))}
      </div>

      {/* ── Content Grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, gridColumn: "span 2" }}>
          {activeTab === 'overview' && (
            <>
              <div style={{ background: "white", padding: 32, borderRadius: theme.radius, border: `1px solid ${theme.border}`, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: theme.textDeep, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                  <i className="fas fa-user-tie" style={{ color: theme.primary }}></i> ข้อมูลส่วนตัว
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
                  {[
                    { label: "ชื่อที่แสดง", value: user.displayName || "ยังไม่ได้ตั้งชื่อ" },
                    { label: "ชื่อผู้ใช้งาน", value: user.username },
                    { label: "อีเมลติดต่อ", value: user.email || "-" },
                    { label: "สถานะบัญชี", value: "ยืนยันตัวตนแล้ว", color: "#10B981" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase" }}>{item.label}</span>
                      <span style={{ fontSize: 16, fontWeight: 600, color: item.color || "#334155" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "white", padding: 32, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: theme.textDeep, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                  <i className="fas fa-star" style={{ color: "#F59E0B" }}></i> ทักษะและความสามารถ
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {["UI/UX Design", "JavaScript", "React.js", "Java Spring Boot", "SQL", "Teamwork"].map(skill => (
                    <span key={skill} style={{ padding: "8px 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "12px", fontSize: 14, fontWeight: 700, color: "#475569" }}>{skill}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'academic' && (
            <div style={{ background: "white", padding: 32, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: theme.textDeep, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <i className="fas fa-graduation-cap" style={{ color: "#8B5CF6" }}></i> ข้อมูลการศึกษา
              </h2>
              <div style={{ padding: 24, background: "#F8FAFC", borderRadius: 20, border: "1px solid #E2E8F0", marginBottom: 20 }}>
                <span style={{ display: "block", fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", marginBottom: 8 }}>คณะ / สาขาวิชา</span>
                <span style={{ display: "block", fontSize: 20, fontWeight: 800, color: theme.textDeep }}>คณะวิทยาศาสตร์และเทคโนโลยี</span>
                <span style={{ fontSize: 16, fontWeight: 600, color: theme.textSoft }}>สาขาวิชาเทคโนโลยีสารสนเทศ (IT)</span>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ background: "white", padding: 32, borderRadius: theme.radius, border: `1px solid ${theme.border}` }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: theme.textDeep, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <i className="fas fa-shield-check" style={{ color: "#10B981" }}></i> การตั้งค่าความปลอดภัย
              </h2>
              <button 
                onClick={() => setShowModal(true)}
                style={{ padding: "20px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <i className="fas fa-key" style={{ color: theme.textSoft }}></i>
                  <span style={{ fontWeight: 700, color: theme.textDeep }}>เปลี่ยนรหัสผ่าน</span>
                </div>
                <i className="fas fa-chevron-right" style={{ color: "#CBD5E1" }}></i>
              </button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "white", padding: 32, borderRadius: theme.radius, border: `1px solid ${theme.border}`, textAlign: "center" }}>
            <h3 style={{ fontSize: 12, fontWeight: 800, color: theme.textSoft, textTransform: "uppercase", marginBottom: 20 }}>ความคืบหน้าโปรไฟล์</h3>
            <div style={{ width: 100, height: 100, borderRadius: "50%", border: "8px solid #F1F5F9", borderTopColor: theme.primary, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: theme.primary }}>85%</div>
          </div>
        </div>
      </div>

      {/* ── Change Password Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
          <div style={{ background: "white", width: "100%", maxWidth: 450, borderRadius: 24, overflow: "hidden", animation: "slideUp 0.3s ease-out" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: theme.textDeep, margin: 0 }}>เปลี่ยนรหัสผ่าน</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: 20, color: theme.textSoft, cursor: "pointer" }}>&times;</button>
            </div>
            <form onSubmit={handleChangePassword} style={{ padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
              {pwdError && <div style={{ background: "#FEF2F2", color: "#EF4444", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{pwdError}</div>}
              {pwdSuccess && <div style={{ background: "#F0FDF4", color: "#10B981", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600 }}>{pwdSuccess}</div>}
              
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: theme.textSoft, textTransform: "uppercase", marginBottom: 8 }}>รหัสผ่านเดิม</label>
                <input type="password" required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} style={{ width: "100%", padding: "12px 16px", background: "#F1F5F9", border: "2px solid transparent", borderRadius: 12, outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: theme.textSoft, textTransform: "uppercase", marginBottom: 8 }}>รหัสผ่านใหม่</label>
                <input type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ width: "100%", padding: "12px 16px", background: "#F1F5F9", border: "2px solid transparent", borderRadius: 12, outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: theme.textSoft, textTransform: "uppercase", marginBottom: 8 }}>ยืนยันรหัสผ่านใหม่</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ width: "100%", padding: "12px 16px", background: "#F1F5F9", border: "2px solid transparent", borderRadius: 12, outline: "none" }} />
              </div>

              <button type="submit" disabled={pwdLoading} style={{ width: "100%", padding: "14px", background: theme.primary, color: "white", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 10 }}>
                {pwdLoading ? "กำลังดำเนินการ..." : "ยืนยันการเปลี่ยนรหัสผ่าน"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
