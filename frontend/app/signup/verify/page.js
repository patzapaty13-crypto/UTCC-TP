"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "../../login/login.css";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds cooldown
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      router.push("/signup");
      return;
    }
    inputRefs.current[0]?.focus();
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length !== 6) {
      setError("กรุณาใส่รหัส OTP ให้ครบ 6 หลัก");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.signupVerifyOtp({ email, code: otpCode });
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res));
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "รหัส OTP ไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Resending OTP for:", { email });
      
      await api.signupResendOtp({ email });
      
      setResendTimer(60);
      setCountdown(600);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      alert("ส่งรหัสใหม่เรียบร้อยแล้ว!");
    } catch (err) {
      console.error("Resend failed:", err);
      setError(err.message || "ไม่สามารถส่งรหัสใหม่ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const maskedEmail = email
    ? email.replace(/(.{3})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(b.length) + c)
    : "";

  return (
    <div className="login-page-wrapper">
      <div className="login-visual-side">
        <div className="visual-content">
          <img src="/utcc-logo.png" alt="UTCC" className="visual-logo" />
          <h1 className="visual-title">Verify<br/>Your<br/>Identity.</h1>
          <p className="visual-subtitle">ยืนยันตัวตนเพื่อรักษาความปลอดภัยบัญชีของคุณ กรุณากรอกรหัส OTP ที่ได้รับทางอีเมล</p>
        </div>
        <div className="visual-footer">UTCC Administrative Portal · v4.0.0</div>
      </div>

      <div className="login-form-side">
        <div className="form-container">
          <Link href="/signup" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 14, fontWeight: 700, color: "var(--text-sub)",
            textDecoration: "none", marginBottom: 24, transition: "color 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
          onMouseLeave={(e) => e.target.style.color = "var(--text-sub)"}>
            <i className="fas fa-arrow-left"></i> กลับไปหน้าสมัคร
          </Link>

          <div className="form-header">
            <h2 className="form-title">ยืนยันรหัส OTP</h2>
            <p className="form-subtitle">
              เราได้ส่งรหัสยืนยัน 6 หลักไปที่<br/>
              <strong style={{ color: "var(--primary)" }}>{maskedEmail}</strong>
            </p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "12px", padding: "16px", color: "#991B1B", fontSize: "14px", fontWeight: "600", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <i className="fas fa-circle-exclamation"></i>{error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{
              display: "flex", justifyContent: "center", gap: "12px", marginBottom: "32px"
            }}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? handlePaste : undefined}
                  disabled={loading}
                  style={{
                    width: "56px", height: "64px",
                    textAlign: "center", fontSize: "28px", fontWeight: "800",
                    borderRadius: "16px",
                    border: digit ? "2px solid var(--primary)" : "2px solid var(--border)",
                    background: digit ? "rgba(99, 102, 241, 0.05)" : "var(--surface)",
                    color: "var(--text-main)",
                    outline: "none",
                    transition: "all 0.2s ease",
                    caretColor: "var(--primary)"
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 4px rgba(99, 102, 241, 0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = digit ? "var(--primary)" : "var(--border)"; e.target.style.boxShadow = "none"; }}
                />
              ))}
            </div>

            <div style={{ textAlign: "center", marginBottom: "24px", fontSize: "14px", color: "var(--text-sub)" }}>
              {countdown > 0 ? (
                <span>รหัสจะหมดอายุใน <strong style={{ color: "var(--primary)" }}>{formatTime(countdown)}</strong></span>
              ) : (
                <span style={{ color: "#EF4444", fontWeight: 600 }}>รหัสหมดอายุแล้ว กรุณาขอรหัสใหม่</span>
              )}
            </div>

            <button type="submit" className="btn-submit" disabled={loading || code.join("").length !== 6 || countdown <= 0}>
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <>ยืนยันและสร้างบัญชี <i className="fas fa-check"></i></>}
            </button>
          </form>

          <div style={{ marginTop: "32px", textAlign: "center", fontSize: "14px", color: "var(--text-sub)" }}>
            ไม่ได้รับรหัส? {" "}
            {resendTimer > 0 ? (
              <span style={{ color: "var(--text-sub)", fontWeight: "600" }}>
                ส่งอีกครั้งใน {resendTimer}ว.
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary)",
                  fontWeight: "700",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "14px",
                  textDecoration: "none"
                }}
              >
                ส่งรหัสอีกครั้ง
              </button>
            )}
            {" หรือ "}
            <Link href="/signup" style={{ color: "var(--primary)", fontWeight: "700", textDecoration: "none" }}>ลองสมัครใหม่</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <i className="fas fa-circle-notch fa-spin" style={{ fontSize: 32, color: "var(--primary)" }}></i>
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
