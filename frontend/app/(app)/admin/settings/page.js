"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch("/admin/settings"); // Custom fetch since not in 'api' yet
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenance = async (active) => {
    setSaving(true);
    try {
      await apiFetch("/admin/settings/maintenance", {
        method: "POST",
        body: JSON.stringify({ active })
      });
      setMessage({ type: 'success', text: active ? "Locked down system" : "Unlocked system" });
      fetchSettings();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Temporary fetch wrapper if not updated in lib/api
  async function apiFetch(path, options = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("utcctp_token") : null;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1"}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
    if (!res.ok) throw new Error("Request failed");
    if (res.status === 204) return null;
    return res.json();
  }

  if (loading) return <div>กำลังโหลดการตั้งค่า...</div>;

  const isMaint = settings.maintenance_mode === "true";

  return (
    <div className="animate-fade-in" style={{ maxWidth: "800px" }}>
      <div className="section-head">
        <h1>ตั้งค่าระบบ (System Settings)</h1>
        <p>จัดการการตั้งค่าความปลอดภัยและระบบส่วนกลาง</p>
      </div>

      {message && (
        <div style={{
          padding: "16px",
          borderRadius: "12px",
          background: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
          color: message.type === 'success' ? '#059669' : '#DC2626',
          marginBottom: "24px",
          fontWeight: "600",
          fontSize: "14px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          {message.text}
          <button onClick={() => setMessage(null)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}>✕</button>
        </div>
      )}

      <div className="glass-card" style={{ 
        padding: "32px", 
        display: "flex", 
        flexDirection: "column", 
        gap: "24px",
        background: "white",
        border: "1px solid var(--n-100)",
        boxShadow: "var(--shadow-md)"
      }}>
        
        {/* Maintenance Mode */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "4px", color: "#1e293b" }}>
              Administrative Lockdown Mode
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
              ปิดกั้นการเข้าถึงระบบสำหรับนักศึกษาและเจ้าหน้าที่ทั่วไป (เฉพาะ Admin เท่านั้นที่เข้าได้)
            </p>
          </div>
          <button 
            onClick={() => toggleMaintenance(!isMaint)}
            disabled={saving}
            style={{
              padding: "10px 24px",
              background: isMaint ? "#EF4444" : "#f1f5f9",
              color: isMaint ? "white" : "#1e293b",
              border: "1px solid " + (isMaint ? "#EF4444" : "#e2e8f0"),
              borderRadius: "12px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {saving ? "กำลังดำเนินการ..." : (isMaint ? "ปิดโหมดปิดกั้น" : "เปิดโหมดปิดกั้น")}
          </button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #f1f5f9" }} />

        {/* Other settings mockup */}
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "800", marginBottom: "20px", color: "#1e293b" }}>
            Integration Keys
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
             <div className="premium-field">
                <label className="premium-label" style={{ color: "#475569", fontWeight: "700", fontSize: "12px", marginBottom: "8px", display: "block" }}>Resend API Key</label>
                <input 
                  className="premium-input" 
                  type="password" 
                  value="re_XXXXXXXXXXXXXX" 
                  readOnly 
                  style={{ 
                    width: "100%", 
                    padding: "12px 16px", 
                    borderRadius: "12px", 
                    border: "1px solid #e2e8f0", 
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontSize: "14px"
                  }} 
                />
             </div>
             <div className="premium-field">
                <label className="premium-label" style={{ color: "#475569", fontWeight: "700", fontSize: "12px", marginBottom: "8px", display: "block" }}>Cloudinary URL</label>
                <input 
                  className="premium-input" 
                  type="text" 
                  value="cloudinary://XXXXXXXXXXXXXXXX" 
                  readOnly 
                  style={{ 
                    width: "100%", 
                    padding: "12px 16px", 
                    borderRadius: "12px", 
                    border: "1px solid #e2e8f0", 
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontSize: "14px"
                  }} 
                />
             </div>
          </div>
        </div>

      </div>

      <div style={{ marginTop: "32px", color: "#64748b", fontSize: "13px", fontWeight: "500" }}>
        * การเปิดโหมดปิดกั้นจะมีผลทันทีต่อผู้ใช้เกือบทั้งหมดในระบบ โปรดตรวจสอบก่อนทำรายการ
      </div>
    </div>
  );
}
