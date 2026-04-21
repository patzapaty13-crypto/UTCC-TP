"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import "../login/login.css";

export default function ForgotPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Request, 2: Reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setStep(2);
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.resetPassword({ email, code, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "รหัสยืนยันไม่ถูกต้องหรือหมดอายุ");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="login-page-wrapper">
      <div className="login-visual-side">
        <div className="visual-content">
          <img src="/utcc-logo.png" alt="UTCC" className="visual-logo" />
          <h1 className="visual-title">Security &<br/>Account.<br/>Restored.</h1>
          <p className="visual-subtitle">กู้คืนการเข้าถึงบัญชีของคุณด้วยขั้นตอนที่ง่ายและปลอดภัย เพื่อความต่อเนื่องในการใช้งานระบบ</p>
        </div>
        <div className="visual-footer">UTCC Administrative Portal · v4.0.0</div>
      </div>

      <div className="login-form-side">
        <div className="form-container">
          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 700, color: "var(--text-sub)",
            textDecoration: "none", marginBottom: 24, transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
          onMouseLeave={(e) => e.target.style.color = "var(--text-sub)"}>
            <i className="fas fa-arrow-left"></i> กลับไปยังหน้าเข้าสู่ระบบ
          </Link>

          <div className="form-header">
            <h2 className="form-title">
              {success ? "สำเร็จ!" : step === 1 ? "ลืมรหัสผ่าน?" : "ตั้งรหัสผ่านใหม่"}
            </h2>
            <p className="form-subtitle">
              {success 
                ? "รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว" 
                : step === 1 
                  ? "ระบุอีเมลที่คุณใช้สมัครสมาชิกเพื่อกู้คืนรหัสผ่าน" 
                  : `เราได้ส่งรหัสยืนยันไปยัง ${email} แล้ว`}
            </p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "12px", padding: "16px", color: "#991B1B", fontSize: "14px", fontWeight: "600", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fas fa-circle-exclamation"></i>{error}
            </div>
          )}

          {success ? (
            <div style={{ textAlign: "center", animation: "slide-up 0.4s ease-out" }}>
              <div style={{ width: "64px", height: "64px", background: "#D1FAE5", color: "#059669", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 24px" }}>
                <i className="fas fa-check"></i>
              </div>
              <p style={{ color: "var(--text-sub)", lineHeight: "1.6", marginBottom: "32px" }}>
                คุณสามารถใช้รหัสผ่านใหม่ในการเข้าสู่ระบบได้ทันที
              </p>
              <Link href="/login" className="btn-submit" style={{ textDecoration: "none" }}>
                เข้าสู่ระบบเลย <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          ) : step === 1 ? (
            <form onSubmit={handleRequestReset}>
              <div className="field-group">
                <label className="field-label">อีเมลมหาวิทยาลัย (UTCC Email)</label>
                <input className="input-style" type="email" placeholder="example@live4.utcc.ac.th" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </div>
              <button type="submit" className="btn-submit" disabled={loading || !email}>
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <>ส่งรหัสยืนยัน <i className="fas fa-paper-plane"></i></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset}>
              <div className="field-group">
                <label className="field-label">รหัสยืนยัน 6 หลัก (OTP)</label>
                <input className="input-style" type="text" maxLength={6} placeholder="••••••" style={{ letterSpacing: "8px", textAlign: "center", fontSize: "20px" }} value={code} onChange={(e) => setCode(e.target.value)} disabled={loading} required />
              </div>
              <div className="field-group">
                <label className="field-label">รหัสผ่านใหม่ (New Password)</label>
                <div style={{ position: "relative" }}>
                  <input className="input-style" type={showPass ? "text" : "password"} placeholder="รหัสผ่านใหม่" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} required />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-sub)", cursor: "pointer" }}>
                    <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              <div className="field-group">
                <label className="field-label">ยืนยันรหัสผ่านใหม่ (Confirm Password)</label>
                <input className="input-style" type={showPass ? "text" : "password"} placeholder="ยืนยันรหัสผ่านใหม่" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} required />
              </div>
              <button type="submit" className="btn-submit" disabled={loading || !code || !newPassword || !confirmPassword}>
                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <>เปลี่ยนรหัสผ่าน <i className="fas fa-key"></i></>}
              </button>
              <button type="button" onClick={() => setStep(1)} style={{ width: "100%", background: "none", border: "none", color: "var(--text-sub)", fontSize: "13px", fontWeight: "700", marginTop: "16px", cursor: "pointer" }}>
                ใช้อีเมลอื่น?
              </button>
            </form>
          )}

          {step === 1 && !success && (
            <div style={{ marginTop: "32px", textAlign: "center", fontSize: "14px", color: "var(--text-sub)" }}>
              จำรหัสผ่านได้แล้ว? <Link href="/login" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>เข้าสู่ระบบ</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
