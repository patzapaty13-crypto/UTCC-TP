"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

const DEMO_USERS = [
  { username:"student1", password:"pass123", role:"STUDENT",  label:"นักศึกษา",          icon:"fa-user-graduate", color:"#2563EB", bg:"#EFF6FF" },
  { username:"advisor1", password:"pass123", role:"ADVISOR",  label:"อาจารย์",            icon:"fa-chalkboard-user",color:"#0891B2", bg:"#ECFEFF" },
  { username:"staff1",   password:"pass123", role:"STAFF",    label:"เจ้าหน้าที่",        icon:"fa-id-badge",       color:"#059669", bg:"#ECFDF5" },
  { username:"admin1",   password:"pass123", role:"ADMIN",    label:"ผู้ดูแลระบบ",        icon:"fa-user-shield",    color:"#7C3AED", bg:"#F5F3FF" },
];

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const doLogin = async (u, p) => {
    setError(""); setLoading(true);
    try {
      const data = await api.login({ username: u, password: p });
      localStorage.setItem("utcctp_token", data.token);
      router.push("/dashboard");
    } catch(err) {
      setError(err.message === "Failed to fetch"
        ? "ไม่สามารถเชื่อมต่อ Backend ได้ (port 8080)"
        : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => { e.preventDefault(); if (username && password) doLogin(username, password); };
  const loginDemo = d => { setUsername(d.username); setPassword(d.password); doLogin(d.username, d.password); };

  return (
    <div style={{
      display:"flex", minHeight:"100vh",
      background:"#F1F5F9",
      fontFamily:"'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif",
    }}>
      {/* ── Left Panel (dark) ─────────────────────────────────── */}
      <div style={{
        flex:"0 0 420px", background:"#0B0F1A",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
        padding:"48px 52px", position:"relative", overflow:"hidden",
      }}>
        {/* Decorative elements */}
        <div style={{ position:"absolute", top:-120, right:-120, width:360, height:360, borderRadius:"50%", background:"rgba(37,99,235,0.08)", pointerEvents:"none" }}></div>
        <div style={{ position:"absolute", bottom:-80, left:-80, width:240, height:240, borderRadius:"50%", background:"rgba(99,102,241,0.06)", pointerEvents:"none" }}></div>

        {/* Logo and Back Button */}
        <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <img src="/utcc-logo.png" alt="UTCC" style={{ height:32, filter:"brightness(0) invert(1)", opacity:0.9 }} />
          <Link href="/" style={{
            fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.5)",
            textDecoration:"none", display:"flex", alignItems:"center", gap:6,
            transition:"color 0.2s", padding:"6px 12px", borderRadius:99,
             background:"rgba(255,255,255,0.05)"
          }}
          onMouseEnter={e => { e.currentTarget.style.color="white"; e.currentTarget.style.background="rgba(255,255,255,0.1)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.5)"; e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
          >
            <i className="fas fa-arrow-left"></i> กลับหน้าแรก
          </Link>
        </div>

        {/* Center text */}
        <div style={{ position:"relative" }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:20 }}>
            University of the Thai Chamber of Commerce
          </p>
          <h1 style={{ fontSize:34, fontWeight:900, color:"white", letterSpacing:"-1px", lineHeight:1.15, marginBottom:20 }}>
            แพลตฟอร์มบริหาร<br/>ทริปและฝึกงาน
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", lineHeight:1.7, fontWeight:500 }}>
            ระบบจัดการทริปศึกษาดูงาน การสมัครฝึกงาน และการติดตามรายงานสำหรับนักศึกษาและอาจารย์คณาจารย์
          </p>

          {/* Feature pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:32 }}>
            {["ทริปศึกษาดูงาน", "ฝึกงาน", "รายงานผล", "วิเคราะห์ข้อมูล"].map(f => (
              <span key={f} style={{
                padding:"6px 16px", borderRadius:99,
                background:"rgba(255,255,255,0.07)",
                border:"1px solid rgba(255,255,255,0.10)",
                color:"rgba(255,255,255,0.55)",
                fontSize:12, fontWeight:600,
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Version */}
        <p style={{ position:"relative", fontSize:11, color:"rgba(255,255,255,0.20)", fontWeight:600 }}>
          UTCC-TP v3.0 · 2025/2026
        </p>
      </div>

      {/* ── Right Panel (form) ────────────────────────────────── */}
      <div style={{
        flex:1, display:"flex", alignItems:"center", justifyContent:"center",
        padding:"48px 40px", overflowY:"auto",
      }}>
        <div style={{ width:"100%", maxWidth:400 }}>
          {/* Form Header */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ fontSize:24, fontWeight:900, color:"var(--n-900)", letterSpacing:"-0.6px", marginBottom:8 }}>
              เข้าสู่ระบบ
            </h2>
            <p style={{ fontSize:13.5, color:"var(--n-500)", fontWeight:500 }}>
              กรุณากรอกชื่อผู้ใช้และรหัสผ่านของคุณ
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error animate-scale-in" style={{ marginBottom:20, fontSize:13 }}>
              <i className="fas fa-circle-exclamation"></i> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:28 }}>
            <div className="field-group">
              <label className="field-label" htmlFor="username">ชื่อผู้ใช้</label>
              <input
                id="username"
                className="field-input"
                placeholder="กรอก Username..."
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>

            <div className="field-group">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <label className="field-label" htmlFor="password">รหัสผ่าน</label>
                <button type="button" style={{ fontSize:11, fontWeight:700, color:"var(--primary)", background:"none", border:"none", cursor:"pointer" }}>
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div style={{ position:"relative" }}>
                <input
                  id="password"
                  className="field-input"
                  type={showPass ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                  required
                  style={{ paddingRight:44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", color:"var(--n-400)", cursor:"pointer", fontSize:13,
                  }}
                >
                  <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !username || !password}
              style={{ marginTop:4, padding:"13px 24px", fontSize:14, borderRadius:12 }}
            >
              {loading
                ? <><i className="fas fa-circle-notch fa-spin"></i> กำลังเข้าสู่ระบบ...</>
                : <><i className="fas fa-right-to-bracket"></i> เข้าสู่ระบบ</>
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <div style={{ flex:1, height:1, background:"var(--border)" }}></div>
            <span style={{ fontSize:11, fontWeight:700, color:"var(--n-400)", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>
              ทดสอบระบบ
            </span>
            <div style={{ flex:1, height:1, background:"var(--border)" }}></div>
          </div>

          {/* Demo accounts */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
            {DEMO_USERS.map(d => (
              <button
                key={d.username}
                onClick={() => loginDemo(d)}
                disabled={loading}
                style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"12px 14px",
                  background: d.bg,
                  border:`1.5px solid ${d.color}25`,
                  borderRadius:12, cursor:"pointer",
                  transition:"all var(--transition)", textAlign:"left",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + "60"; e.currentTarget.style.transform="translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = d.color + "25"; e.currentTarget.style.transform="translateY(0)"; }}
              >
                <div style={{
                  width:32, height:32, borderRadius:10, flexShrink:0,
                  background:"white",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:d.color, fontSize:14,
                  boxShadow:"0 1px 3px rgba(0,0,0,0.1)",
                }}>
                  <i className={`fas ${d.icon}`}></i>
                </div>
                <div>
                  <p style={{ fontSize:12.5, fontWeight:800, color:d.color }}>{d.username}</p>
                  <p style={{ fontSize:10.5, fontWeight:600, color:"var(--n-400)" }}>{d.label}</p>
                </div>
              </button>
            ))}
          </div>

          <p style={{ fontSize:11.5, fontWeight:600, color:"var(--n-400)", textAlign:"center" }}>
            รหัสผ่านทดสอบทุกบัญชี: <code style={{ background:"var(--n-100)", padding:"2px 6px", borderRadius:4, fontWeight:800, color:"var(--n-700)", fontSize:11 }}>pass123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
