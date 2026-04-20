"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = form, 2 = otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    email: "",
    studentId: "",
    faculty: "",
    major: "",
    academicYear: "",
  });
  const [code, setCode] = useState("");

  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        studentId: form.studentId.trim() || null,
        faculty: form.faculty.trim() || null,
        major: form.major.trim() || null,
        academicYear: form.academicYear ? Number(form.academicYear) : null,
      };
      const res = await api.signupRequestOtp(payload);
      setInfo(res?.message || "ส่งรหัสยืนยันไปยังอีเมลของคุณแล้ว");
      setStep(2);
    } catch (err) {
      setError(err.message || "ไม่สามารถส่งรหัส OTP ได้");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.signupVerifyOtp({ email: form.email.trim(), code: code.trim() });
      localStorage.setItem("utcctp_token", res.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "รหัส OTP ไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh", background: "#F1F5F9",
      fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif",
    }}>
      {/* Left panel */}
      <div className="login-left-panel mesh-dark" style={{
        flex: "0 0 460px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "52px 56px", position: "relative",
      }}>

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <img src="/utcc-logo.png" alt="UTCC" style={{ height: 32, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
          <Link href="/login" style={{
            fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)",
            textDecoration: "none", padding: "6px 12px", borderRadius: 99,
            background: "rgba(255,255,255,0.05)",
          }}>
            <i className="fas fa-arrow-left"></i> กลับหน้าเข้าสู่ระบบ
          </Link>
        </div>

        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
            Create your account
          </p>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "white", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 20 }}>
            สมัครสมาชิก<br />UTCC-TP
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 500 }}>
            เปิดใช้งานเพื่อสมัครฝึกงาน ติดตามสถานะใบสมัคร และร่วมกิจกรรมศึกษาดูงาน
          </p>
        </div>

        <p style={{ position: "relative", fontSize: 11, color: "rgba(255,255,255,0.20)", fontWeight: 600 }}>
          UTCC-TP v3.0 · 2025/2026
        </p>
      </div>

      {/* Right panel */}
      <div className="login-right-panel" style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px", overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--n-400)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>
              ขั้นตอนที่ {step} จาก 2
            </p>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--n-900)", letterSpacing: "-0.6px", marginBottom: 6 }}>
              {step === 1 ? "กรอกข้อมูลบัญชี" : "ยืนยันรหัส OTP"}
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--n-500)", fontWeight: 500 }}>
              {step === 1
                ? "เราจะส่งรหัสยืนยัน 6 หลักไปยังอีเมลของคุณ"
                : `กรอกรหัสที่ส่งไปยัง ${form.email}`}
            </p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 16, fontSize: 13 }}>
              <i className="fas fa-circle-exclamation"></i> {error}
            </div>
          )}
          {info && step === 2 && (
            <div className="alert alert-info" style={{ marginBottom: 16, fontSize: 13, background: "#EFF6FF", color: "#1E40AF", borderRadius: 10, padding: "10px 12px" }}>
              <i className="fas fa-envelope-circle-check"></i> {info}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={submitForm} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Row>
                <Field label="ชื่อผู้ใช้" required>
                  <input className="field-input" required minLength={3} maxLength={50} value={form.username} onChange={setField("username")} placeholder="username" />
                </Field>
                <Field label="ชื่อที่แสดง" required>
                  <input className="field-input" required value={form.displayName} onChange={setField("displayName")} placeholder="ชื่อ-นามสกุล" />
                </Field>
              </Row>

              <Field label="อีเมล" required>
                <input className="field-input" required type="email" value={form.email} onChange={setField("email")} placeholder="name@utcc.ac.th" />
              </Field>

              <Row>
                <Field label="รหัสผ่าน" required>
                  <input className="field-input" required type="password" minLength={8} value={form.password} onChange={setField("password")} placeholder="อย่างน้อย 8 ตัวอักษร" />
                </Field>
                <Field label="ยืนยันรหัสผ่าน" required>
                  <input className="field-input" required type="password" value={form.confirmPassword} onChange={setField("confirmPassword")} placeholder="พิมพ์อีกครั้ง" />
                </Field>
              </Row>

              <Row>
                <Field label="รหัสนักศึกษา">
                  <input className="field-input" value={form.studentId} onChange={setField("studentId")} placeholder="65xxxxxxxx" />
                </Field>
                <Field label="ชั้นปี">
                  <input className="field-input" type="number" min={1} max={8} value={form.academicYear} onChange={setField("academicYear")} placeholder="3" />
                </Field>
              </Row>

              <Row>
                <Field label="คณะ">
                  <input className="field-input" value={form.faculty} onChange={setField("faculty")} placeholder="วิศวกรรมศาสตร์" />
                </Field>
                <Field label="สาขา">
                  <input className="field-input" value={form.major} onChange={setField("major")} placeholder="Computer Engineering" />
                </Field>
              </Row>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 6, padding: "13px 24px", fontSize: 14, borderRadius: 12 }}>
                {loading
                  ? <><i className="fas fa-circle-notch fa-spin"></i> กำลังส่งรหัส...</>
                  : <><i className="fas fa-paper-plane"></i> ส่งรหัสยืนยัน</>}
              </button>
            </form>
          ) : (
            <form onSubmit={submitOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field label="รหัส OTP 6 หลัก" required>
                <input
                  className="field-input"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  pattern="\d{6}"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  style={{ fontSize: 22, letterSpacing: 8, textAlign: "center", fontWeight: 800 }}
                />
              </Field>

              <button type="submit" className="btn btn-primary" disabled={loading || code.length !== 6} style={{ padding: "13px 24px", fontSize: 14, borderRadius: 12 }}>
                {loading
                  ? <><i className="fas fa-circle-notch fa-spin"></i> กำลังยืนยัน...</>
                  : <><i className="fas fa-circle-check"></i> ยืนยันและเข้าสู่ระบบ</>}
              </button>

              <button type="button" onClick={() => { setStep(1); setError(""); setInfo(""); }}
                style={{ background: "none", border: "none", color: "var(--n-500)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginTop: 4 }}>
                <i className="fas fa-arrow-left"></i> แก้ไขข้อมูล / ส่งรหัสใหม่
              </button>
            </form>
          )}

          <p style={{ fontSize: 12.5, color: "var(--n-500)", textAlign: "center", marginTop: 22 }}>
            มีบัญชีแล้ว? <Link href="/login" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>;
}

function Field({ label, required, children }) {
  return (
    <div className="field-group">
      <label className="field-label">{label} {required && <span style={{ color: "#DC2626" }}>*</span>}</label>
      {children}
    </div>
  );
}
