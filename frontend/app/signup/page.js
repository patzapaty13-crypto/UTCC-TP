"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../login/login.css";

const ROLE_OPTIONS = [
  { id: "STUDENT", label: "นักศึกษา" },
  { id: "COMPANY", label: "บริษัท" },
  { id: "ADVISOR", label: "อาจารย์ที่ปรึกษา" },
  { id: "STAFF", label: "เจ้าหน้าที่" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", role: "STUDENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.signupRequestOtp(form);
      router.push(`/signup/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.message || "ไม่สามารถสมัครสมาชิกได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-visual-side">
        <div className="visual-content">
          <img src="/utcc-logo.png" alt="UTCC" className="visual-logo" />
          <h1 className="visual-title">Begin Your<br/>Journey<br/>With Us.</h1>
          <p className="visual-subtitle">เปิดประตูสู่โอกาสทางอาชีพที่เหนือกว่า พร้อมระบบการจัดการใบสมัครและแฟ้มสะสมผลงานอัจฉริยะ</p>
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
            <h2 className="form-title">สมัครใช้งานระบบ</h2>
            <p className="form-subtitle">สร้างบัญชีเพื่อเริ่มต้นใช้งานแพลตฟอร์ม</p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "12px", padding: "16px", color: "#991B1B", fontSize: "14px", fontWeight: "600", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fas fa-circle-exclamation"></i>{error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div className="field-group" style={{ marginBottom: 0 }}>
                <label className="field-label">รหัสนักศึกษา / ชื่อผู้ใช้</label>
                <input className="input-style" type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} disabled={loading} required />
              </div>
              <div className="field-group" style={{ marginBottom: 0 }}>
                <label className="field-label">สถานะ (Role)</label>
                <select className="input-style" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} disabled={loading} required>
                  {ROLE_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">ชื่อ-นามสกุล (Full Name)</label>
              <input className="input-style" type="text" placeholder="ชื่อ-นามสกุลของคุณ" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} required />
            </div>

            <div className="field-group">
              <label className="field-label">อีเมลมหาวิทยาลัย (Email)</label>
              <input className="input-style" type="email" placeholder="example@live4.utcc.ac.th" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={loading} required />
            </div>

            <div className="field-group">
              <label className="field-label">รหัสผ่าน (Password)</label>
              <div style={{ position: "relative" }}>
                <input className="input-style" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} disabled={loading} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-sub)", cursor: "pointer" }}>
                  <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-submit" disabled={loading || !form.username || !form.password || !form.email || !form.name}>
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <>ส่งรหัส OTP ป้องกันบัญชี <i className="fas fa-arrow-right"></i></>}
            </button>
          </form>

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "14px", color: "var(--text-sub)" }}>
            มีบัญชีใช้งานอยู่แล้ว? <Link href="/login" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>เข้าสู่ระบบ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
