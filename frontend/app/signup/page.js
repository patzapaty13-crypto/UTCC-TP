"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="card" style={{ maxWidth: 640, margin: "0 auto", padding: 28 }}>
      <p className="page-eyebrow">Create account</p>
      <h1 className="page-title" style={{ fontSize: 30 }}>สมัครใช้งานระบบ</h1>
      <p className="page-subtitle">สร้างบัญชีเพื่อใช้งานตาม Role ที่ถูกต้อง</p>

      {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

      <form onSubmit={submit} style={{ display: "grid", gap: 14, marginTop: 20 }}>
        <input className="field-input" placeholder="ชื่อ-นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="field-input" placeholder="อีเมล" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="field-input" placeholder="ชื่อผู้ใช้" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        <input className="field-input" placeholder="รหัสผ่าน" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select className="field-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          {ROLE_OPTIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
        <button className="btn btn-primary" disabled={loading}>{loading ? "กำลังสมัคร..." : "ส่งรหัส OTP"}</button>
      </form>

      <div style={{ marginTop: 16, fontSize: 13, color: "var(--text-muted)" }}>
        มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
      </div>
    </div>
  );
}
