"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function AdvisorProfilePage() {
  const [me, setMe] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = await api.getMe();
    setMe(user);
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      major: user.major || "",
      faculty: user.faculty || "",
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const updatedUser = await api.put("/auth/me", formData);
      setMe(updatedUser);
      setFormData({
        displayName: updatedUser.displayName || "",
        email: updatedUser.email || "",
        major: updatedUser.major || "",
        faculty: updatedUser.faculty || "",
      });
      setMessage("บันทึกข้อมูลสำเร็จ");
      setEditing(false);
      window.dispatchEvent(new CustomEvent('profile_updated'));
    } catch (err) {
      setMessage("เกิดข้อผิดพลาด: " + (err.message || "ไม่สามารถบันทึกได้"));
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("รูปภาพใหญ่เกิน 2MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("รองรับเฉพาะไฟล์ JPG, PNG เท่านั้น");
      return;
    }

    setLoading(true);
    try {
      const result = await api.uploadFile(file, "profile-picture");
      const updatedUser = await api.put("/auth/me", { profilePictureUrl: result.url });
      setMe(updatedUser);
      setFormData(prev => ({ ...prev, profilePictureUrl: updatedUser.profilePictureUrl }));
      setMessage("อัปโหลดรูปโปรไฟล์สำเร็จ");
      window.dispatchEvent(new CustomEvent('profile_updated'));
    } catch (err) {
      alert("อัปโหลดรูปไม่สำเร็จ: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    // Remove duplicate /api/v1 if it exists in the URL from backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
    const origin = backendUrl.replace("/api/v1", "");
    return `${origin}${url}`;
  };

  if (!me) {
    return (
      <RoleDashboardShell role="ADVISOR" title="โปรไฟล์อาจารย์">
        <div className="card" style={{ padding: 24 }}>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="ADVISOR" title="โปรไฟล์อาจารย์" subtitle="จัดการข้อมูลส่วนตัวของคุณ">
      {message && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          {message}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>รูปโปรไฟล์</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            fontSize: 48,
            fontWeight: 700,
            color: "#666"
          }}>
            {me.profilePictureUrl ? (
              <img src={getFullImageUrl(me.profilePictureUrl)} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              me.displayName?.charAt(0) || me.username?.charAt(0) || "?"
            )}
          </div>
          <div>
            <label className="btn btn-outline" style={{ cursor: "pointer" }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleProfilePictureUpload}
                style={{ display: "none" }}
                disabled={loading}
              />
              {loading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
            </label>
            <p className="text-muted" style={{ marginTop: 8, fontSize: 14 }}>
              รองรับ JPG, PNG (สูงสุด 2MB)
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <i className="fas fa-user" style={{ color: "#7C3AED" }}></i>
              ข้อมูลส่วนตัว
            </h3>
            <p className="text-muted" style={{ fontSize: 13, marginTop: 4, margin: 0 }}>จัดการข้อมูลส่วนตัวของคุณ</p>
          </div>
          {!editing && (
            <button 
              className="btn btn-outline" 
              onClick={() => setEditing(true)}
              style={{ 
                padding: "10px 20px", 
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <i className="fas fa-edit"></i>
              แก้ไขข้อมูล
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} style={{ 
            background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
            padding: 24,
            borderRadius: 16,
            border: "2px solid #7C3AED"
          }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#5B21B6", marginBottom: 12 }}>
                <i className="fas fa-pen" style={{ marginRight: 6 }}></i>
                แก้ไขข้อมูลส่วนตัว
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "block", color: "#5B21B6" }}>
                  ชื่อ-นามสกุล *
                </label>
                <input
                  type="text"
                  name="displayName"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #DDD6FE",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7C3AED"}
                  onBlur={(e) => e.target.style.borderColor = "#DDD6FE"}
                  placeholder="เช่น ผศ.ดร. มานะ อุตสาหะ"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "block", color: "#5B21B6" }}>
                  อีเมล *
                </label>
                <input
                  type="email"
                  name="email"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #DDD6FE",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7C3AED"}
                  onBlur={(e) => e.target.style.borderColor = "#DDD6FE"}
                  placeholder="advisor@utcctp.ac.th"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "block", color: "#5B21B6" }}>
                  คณะ
                </label>
                <input
                  type="text"
                  name="faculty"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #DDD6FE",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7C3AED"}
                  onBlur={(e) => e.target.style.borderColor = "#DDD6FE"}
                  placeholder="เช่น วิทยาลัยดนตรี"
                  value={formData.faculty}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "block", color: "#5B21B6" }}>
                  สาขาวิชา
                </label>
                <input
                  type="text"
                  name="major"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #DDD6FE",
                    borderRadius: 8,
                    fontSize: 14,
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#7C3AED"}
                  onBlur={(e) => e.target.style.borderColor = "#DDD6FE"}
                  value={formData.major}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                type="button"
                style={{
                  padding: "12px 24px",
                  background: "white",
                  color: "#64748B",
                  border: "2px solid #E5E7EB",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    displayName: me.displayName || "",
                    email: me.email || "",
                    major: me.major || "",
                    faculty: me.faculty || "",
                  });
                }}
                disabled={loading}
                onMouseOver={(e) => e.target.style.borderColor = "#9CA3AF"}
                onMouseOut={(e) => e.target.style.borderColor = "#E5E7EB"}
              >
                ยกเลิก
              </button>
              <button 
                type="submit" 
                style={{
                  padding: "12px 32px",
                  background: "#7C3AED",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(124, 58, 237, 0.2)"
                }}
                disabled={loading}
                onMouseOver={(e) => e.target.style.background = "#6D28D9"}
                onMouseOut={(e) => e.target.style.background = "#7C3AED"}
              >
                {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ padding: 16, background: "#F8FAFC", borderRadius: 12 }}>
              <p className="text-muted" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>ชื่อ-นามสกุล</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>{me.displayName || "-"}</p>
            </div>
            <div style={{ padding: 16, background: "#F8FAFC", borderRadius: 12 }}>
              <p className="text-muted" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>อีเมล</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>{me.email || "-"}</p>
            </div>
            <div style={{ padding: 16, background: "#F8FAFC", borderRadius: 12 }}>
              <p className="text-muted" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>คณะ</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>{me.faculty || "-"}</p>
            </div>
            <div style={{ padding: 16, background: "#F8FAFC", borderRadius: 12 }}>
              <p className="text-muted" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>สาขาวิชา</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1E293B" }}>{me.major || "-"}</p>
            </div>
          </div>
        )}
      </div>
    </RoleDashboardShell>
  );
}
