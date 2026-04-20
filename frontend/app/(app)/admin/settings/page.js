"use client";

import { useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "UTCC Internship System",
    siteDescription: "ระบบจัดการฝึกงานและทริปศึกษาดูงาน",
    contactEmail: "admin@utcc.ac.th",
    allowRegistration: true,
    requireEmailVerification: false,
    maintenanceMode: false,
    maxApplicationsPerStudent: 5,
    applicationDeadlineDays: 30,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // In real app, this would call API
    console.log("Saving settings:", settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    alert("บันทึกการตั้งค่าสำเร็จ");
  };

  return (
    <RoleDashboardShell 
      role="ADMIN" 
      title="ตั้งค่าระบบ" 
      subtitle="กำหนดค่าและปรับแต่งการทำงานของระบบ"
    >
      {saved && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          บันทึกการตั้งค่าสำเร็จ
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* General Settings */}
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-cog" style={{ marginRight: 10, color: "var(--primary)" }}></i>
            ตั้งค่าทั่วไป
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field-group">
              <label className="field-label">ชื่อเว็บไซต์</label>
              <input 
                className="field-input" 
                value={settings.siteName} 
                onChange={(e) => setSettings({...settings, siteName: e.target.value})} 
              />
            </div>

            <div className="field-group">
              <label className="field-label">คำอธิบาย</label>
              <textarea 
                className="field-input" 
                value={settings.siteDescription} 
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})} 
                rows={3}
              />
            </div>

            <div className="field-group">
              <label className="field-label">อีเมลติดต่อ</label>
              <input 
                className="field-input" 
                type="email"
                value={settings.contactEmail} 
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})} 
              />
            </div>
          </div>
        </div>

        {/* User Settings */}
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-users" style={{ marginRight: 10, color: "var(--primary)" }}></i>
            ตั้งค่าผู้ใช้
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: "var(--n-50)", borderRadius: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  เปิดให้ลงทะเบียนใหม่
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  อนุญาตให้ผู้ใช้ใหม่สร้างบัญชีได้
                </p>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: 50, height: 28 }}>
                <input 
                  type="checkbox" 
                  checked={settings.allowRegistration}
                  onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: settings.allowRegistration ? "var(--success)" : "var(--n-300)",
                  transition: "0.4s",
                  borderRadius: 28,
                }}>
                  <span style={{
                    position: "absolute",
                    content: "",
                    height: 20,
                    width: 20,
                    left: settings.allowRegistration ? 26 : 4,
                    bottom: 4,
                    background: "white",
                    transition: "0.4s",
                    borderRadius: "50%",
                  }}></span>
                </span>
              </label>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: "var(--n-50)", borderRadius: 12 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  ต้องยืนยันอีเมล
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  ผู้ใช้ต้องยืนยันอีเมลก่อนใช้งาน
                </p>
              </div>
              <label style={{ position: "relative", display: "inline-block", width: 50, height: 28 }}>
                <input 
                  type="checkbox" 
                  checked={settings.requireEmailVerification}
                  onChange={(e) => setSettings({...settings, requireEmailVerification: e.target.checked})}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: settings.requireEmailVerification ? "var(--success)" : "var(--n-300)",
                  transition: "0.4s",
                  borderRadius: 28,
                }}>
                  <span style={{
                    position: "absolute",
                    content: "",
                    height: 20,
                    width: 20,
                    left: settings.requireEmailVerification ? 26 : 4,
                    bottom: 4,
                    background: "white",
                    transition: "0.4s",
                    borderRadius: "50%",
                  }}></span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-clipboard-list" style={{ marginRight: 10, color: "var(--primary)" }}></i>
            ตั้งค่าการสมัคร
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field-group">
              <label className="field-label">จำนวนการสมัครสูงสุดต่อนักศึกษา</label>
              <input 
                className="field-input" 
                type="number"
                min="1"
                max="20"
                value={settings.maxApplicationsPerStudent} 
                onChange={(e) => setSettings({...settings, maxApplicationsPerStudent: parseInt(e.target.value)})} 
              />
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                นักศึกษาสามารถสมัครได้สูงสุดกี่ตำแหน่ง
              </p>
            </div>

            <div className="field-group">
              <label className="field-label">ระยะเวลาปิดรับสมัครอัตโนมัติ (วัน)</label>
              <input 
                className="field-input" 
                type="number"
                min="1"
                max="365"
                value={settings.applicationDeadlineDays} 
                onChange={(e) => setSettings({...settings, applicationDeadlineDays: parseInt(e.target.value)})} 
              />
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                ตำแหน่งจะปิดรับสมัครอัตโนมัติหลังจากเปิดรับกี่วัน
              </p>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-server" style={{ marginRight: 10, color: "var(--error)" }}></i>
            ตั้งค่าระบบ
          </h3>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: settings.maintenanceMode ? "var(--error-50)" : "var(--n-50)", borderRadius: 12, border: settings.maintenanceMode ? "2px solid var(--error)" : "1px solid var(--n-200)" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: settings.maintenanceMode ? "var(--error)" : "inherit" }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: 8 }}></i>
                โหมดปิดปรับปรุง
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                ปิดระบบชั่วคราวเพื่อปรับปรุง (เฉพาะ Admin เข้าได้)
              </p>
            </div>
            <label style={{ position: "relative", display: "inline-block", width: 50, height: 28 }}>
              <input 
                type="checkbox" 
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: settings.maintenanceMode ? "var(--error)" : "var(--n-300)",
                transition: "0.4s",
                borderRadius: 28,
              }}>
                <span style={{
                  position: "absolute",
                  content: "",
                  height: 20,
                  width: 20,
                  left: settings.maintenanceMode ? 26 : 4,
                  bottom: 4,
                  background: "white",
                  transition: "0.4s",
                  borderRadius: "50%",
                }}></span>
              </span>
            </label>
          </div>

          {settings.maintenanceMode && (
            <div className="alert alert-error" style={{ marginTop: 16 }}>
              <i className="fas fa-exclamation-triangle"></i>
              <strong>คำเตือน:</strong> เมื่อเปิดโหมดปิดปรับปรุง ผู้ใช้ทั่วไปจะไม่สามารถเข้าใช้งานระบบได้
            </div>
          )}
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button type="button" className="btn btn-ghost">
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-primary btn-lg">
            <i className="fas fa-save" style={{ marginRight: 8 }}></i>
            บันทึกการตั้งค่า
          </button>
        </div>
      </form>

      {/* System Info */}
      <div className="card" style={{ padding: 32, marginTop: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
          <i className="fas fa-info-circle" style={{ marginRight: 10, color: "var(--primary)" }}></i>
          ข้อมูลระบบ
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
              เวอร์ชัน
            </p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>1.2.0</p>
          </div>

          <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
              Database
            </p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>PostgreSQL (Supabase)</p>
          </div>

          <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
              Backend
            </p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>Spring Boot 3.4.3</p>
          </div>

          <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
              Frontend
            </p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>Next.js 14</p>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: "var(--primary-50)", borderRadius: 12, border: "1px solid var(--primary-200)" }}>
          <p style={{ fontSize: 13, color: "var(--primary)", lineHeight: 1.6 }}>
            <i className="fas fa-lightbulb" style={{ marginRight: 8 }}></i>
            <strong>เคล็ดลับ:</strong> สำรองข้อมูลเป็นประจำและตรวจสอบ Audit Logs เพื่อความปลอดภัย
          </p>
        </div>
      </div>
    </RoleDashboardShell>
  );
}
