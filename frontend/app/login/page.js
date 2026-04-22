"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import "./login.css";

const DEMO_USERS = [
  { username: "student1", password: "pass123", role: "STUDENT", label: "นักศึกษา", icon: "fa-user-graduate", color: "#3B82F6" },
  { username: "advisor1", password: "pass123", role: "ADVISOR", label: "อาจารย์", icon: "fa-chalkboard-user", color: "#10B981" },
  { username: "staff1", password: "pass123", role: "STAFF", label: "เจ้าหน้าที่", icon: "fa-id-badge", color: "#F59E0B" },
  { username: "admin1", password: "pass123", role: "ADMIN", label: "ผู้ดูแลระบบ", icon: "fa-user-shield", color: "#8B5CF6" },
  { username: "department1", password: "pass123", role: "DEPARTMENT", label: "หน่วยงาน", icon: "fa-building", color: "#EC4899" },
  { username: "company1", password: "pass123", role: "COMPANY", label: "บริษัท", icon: "fa-briefcase", color: "#14B8A6" },
];

function routeForRole(role) {
  return {
    STUDENT: "/student",
    COMPANY: "/company",
    ADVISOR: "/advisor",
    STAFF: "/staff",
    ADMIN: "/admin",
    DEPARTMENT: "/department",
  }[role] || "/student";
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const doLogin = async (u, p) => {
    setError("");
    setLoading(true);
    try {
      const data = await api.login({ username: u, password: p });
      localStorage.setItem("utcctp_token", data.token);
      const me = await api.getMe();
      const role = me?.roles?.[0] || "STUDENT";
      router.push(routeForRole(role));
    } catch (err) {
      setError(err.message === "Failed to fetch"
        ? "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง"
        : err.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) doLogin(username, password);
  };

  if (!mounted) return null;

  return (
    <div className="login-page-wrapper">
      <div className="login-visual-side">
        <div className="visual-content">
          <img src="/utcc-logo.png" alt="UTCC" className="visual-logo" />
          <h1 className="visual-title">Next-Gen<br/>Career Path.<br/>Redefined.</h1>
          <p className="visual-subtitle">แพลตฟอร์มบริหารจัดการทริปศึกษาดูงานและฝึกงาน ก้าวสู่ความเป็นมืออาชีพด้วยระบบที่ชาญฉลาดและทันสมัยที่สุด</p>
        </div>
        <div className="visual-footer">UTCC Administrative Portal · v4.0.0</div>
      </div>

      <div className="login-form-side">
        <div className="form-container">
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 700, color: "var(--text-sub)",
            textDecoration: "none", marginBottom: 24, transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
          onMouseLeave={(e) => e.target.style.color = "var(--text-sub)"}>
            <i className="fas fa-arrow-left"></i> กลับไปยังหน้าหลัก
          </Link>

          <div className="form-header">
            <h2 className="form-title">ยินดีต้อนรับ</h2>
            <p className="form-subtitle">เข้าสู่ระบบเพื่อจัดการข้อมูลการฝึกงานของคุณ</p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "12px", padding: "16px", color: "#991B1B", fontSize: "14px", fontWeight: "600", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fas fa-circle-exclamation"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">ชื่อผู้ใช้ (Username)</label>
              <input className="input-style" type="text" placeholder="ชื่อผู้ใช้ของคุณ" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} required />
            </div>
            <div className="field-group">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <label className="field-label" style={{ marginBottom: 0 }}>รหัสผ่าน (Password)</label>
                <Link href="/forgot" style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>ลืมรหัสผ่าน?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input className="input-style" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-sub)", cursor: "pointer" }}>
                  <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading || !username || !password}>
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <>เข้าสู่ระบบ <i className="fas fa-arrow-right"></i></>}
            </button>
          </form>

          <div className="demo-box">
            <h3 className="demo-title">ทดสอบระบบ (Demo Accounts)</h3>
            <div className="demo-grid-new">
              {DEMO_USERS.map((u) => (
                <button key={u.username} className="demo-btn" onClick={() => doLogin(u.username, u.password)}>
                  <div className="demo-btn-icon" style={{ background: `${u.color}15`, color: u.color }}><i className={`fas ${u.icon}`}></i></div>
                  <div>
                    <p className="demo-btn-name">{u.username}</p>
                    <p className="demo-btn-role">{u.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "14px", color: "var(--text-sub)" }}>
            ไม่มีบัญชีผู้ใช้? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>สมัครใหม่</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
