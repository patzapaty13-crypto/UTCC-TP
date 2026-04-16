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
    ADMIN: "ผู้ดูแลระบบ",
  };

  const primaryRole = user.roles?.[0] || "USER";
  const displayRole = roleLabels[primaryRole] || primaryRole;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 800 }}>
      {/* Header Profile Card */}
      <div className="card animate-scale-in" style={{ padding: 40, display: "flex", gap: 32, alignItems: "center", background: "linear-gradient(135deg, white, var(--n-50))" }}>
        <div style={{
          width: 120, height: 120, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--brand-500), var(--info))",
          color: "white", fontSize: 40, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 12px 36px rgba(37,99,235,0.2)"
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-block", padding: "4px 12px", background: "var(--brand-50)", color: "var(--brand-700)", fontSize: 12, fontWeight: 700, borderRadius: 99, marginBottom: 12 }}>
            <i className="fas fa-id-badge" style={{ marginRight: 6 }}></i>
            {displayRole}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--n-900)", letterSpacing: "-0.5px", marginBottom: 6 }}>
            {user.displayName || user.username}
          </h1>
          <p style={{ color: "var(--n-500)", fontSize: 15, fontWeight: 500 }}>
            {user.email || `${user.username}@utcc.ac.th`}
          </p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="card animate-fade-in" style={{ padding: 32 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 4, height: 18, background: "var(--primary)", borderRadius: 2, display: "inline-block" }}></span>
          ข้อมูลบัญชี
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--n-400)", marginBottom: 6 }}>ชื่อผู้ใช้ (Username)</label>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--n-800)", padding: "10px 16px", background: "var(--n-50)", borderRadius: 10, border: "1px solid var(--n-200)" }}>
              {user.username}
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--n-400)", marginBottom: 6 }}>สถานะบัญชี</label>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--success)", padding: "10px 16px", background: "var(--success)10", borderRadius: 10, border: "1px solid var(--success)30", display:"flex", alignItems:"center", gap:8 }}>
              <i className="fas fa-circle-check"></i> ปกติ (Active)
            </div>
          </div>
        </div>

        <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--n-200)" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>การตั้งค่าความปลอดภัย</h3>
          <p style={{ fontSize: 14, color: "var(--n-500)", marginBottom: 20 }}>
            รหัสผ่านของคุณถูกจัดการโดยระบบส่วนกลาง สำหรับบัญชีทดสอบไม่สามารถเปลี่ยนรหัสผ่านได้
          </p>
          <button className="btn btn-secondary" disabled>
            <i className="fas fa-lock"></i> เปลี่ยนรหัสผ่าน (เร็วๆ นี้)
          </button>
        </div>
      </div>
    </div>
  );
}
