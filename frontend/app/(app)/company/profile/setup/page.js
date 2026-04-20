"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CompanyProfileSetupPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    industry: "",
    description: "",
    location: "",
    website: "",
    address: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // 1. สร้าง company
      const company = await api.createCompany(form);
      
      // 2. Update user's companyId
      await api.updateProfile({ companyId: company.id });
      
      // 3. Redirect to internships page
      alert("สร้าง Company Profile สำเร็จ! ตอนนี้คุณสามารถสร้างตำแหน่งงานได้แล้ว");
      router.push("/company/internships");
    } catch (e) {
      setError(e.message || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--n-50)", padding: "40px 20px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 20, 
            background: "var(--primary)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 900,
            margin: "0 auto 20px"
          }}>
            <i className="fas fa-building"></i>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>
            ยินดีต้อนรับ! 🎉
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)" }}>
            กรุณากรอกข้อมูลบริษัทของคุณเพื่อเริ่มใช้งาน
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 24 }}>
            <i className="fas fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        {/* Form */}
        <div className="card" style={{ padding: 40 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Basic Info */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                <i className="fas fa-info-circle" style={{ marginRight: 8, color: "var(--primary)" }}></i>
                ข้อมูลพื้นฐาน
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="field-group">
                  <label className="field-label">ชื่อบริษัท *</label>
                  <input 
                    className="field-input" 
                    placeholder="เช่น บริษัท ABC จำกัด" 
                    value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} 
                    required 
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="field-group">
                    <label className="field-label">อุตสาหกรรม *</label>
                    <input 
                      className="field-input" 
                      placeholder="เช่น เทคโนโลยี" 
                      value={form.industry} 
                      onChange={(e) => setForm({...form, industry: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">สถานที่ตั้ง *</label>
                    <input 
                      className="field-input" 
                      placeholder="เช่น กรุงเทพมหานคร" 
                      value={form.location} 
                      onChange={(e) => setForm({...form, location: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">รายละเอียดบริษัท</label>
                  <textarea 
                    className="field-input" 
                    placeholder="บอกเล่าเกี่ยวกับบริษัทของคุณ" 
                    value={form.description} 
                    onChange={(e) => setForm({...form, description: e.target.value})} 
                    rows={4}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">เว็บไซต์</label>
                  <input 
                    className="field-input" 
                    type="url"
                    placeholder="https://example.com" 
                    value={form.website} 
                    onChange={(e) => setForm({...form, website: e.target.value})} 
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">ที่อยู่</label>
                  <textarea 
                    className="field-input" 
                    placeholder="ที่อยู่บริษัท" 
                    value={form.address} 
                    onChange={(e) => setForm({...form, address: e.target.value})} 
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                <i className="fas fa-address-book" style={{ marginRight: 8, color: "var(--primary)" }}></i>
                ข้อมูลติดต่อ
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="field-group">
                  <label className="field-label">ชื่อผู้ติดต่อ *</label>
                  <input 
                    className="field-input" 
                    placeholder="ชื่อ-นามสกุล" 
                    value={form.contactPerson} 
                    onChange={(e) => setForm({...form, contactPerson: e.target.value})} 
                    required 
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="field-group">
                    <label className="field-label">อีเมล *</label>
                    <input 
                      className="field-input" 
                      type="email"
                      placeholder="contact@company.com" 
                      value={form.contactEmail} 
                      onChange={(e) => setForm({...form, contactEmail: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">เบอร์โทร *</label>
                    <input 
                      className="field-input" 
                      type="tel"
                      placeholder="0812345678" 
                      value={form.contactPhone} 
                      onChange={(e) => setForm({...form, contactPhone: e.target.value})} 
                      required 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                    กำลังสร้าง...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                    สร้าง Company Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div style={{ marginTop: 24, padding: 20, background: "var(--primary-50)", borderRadius: 12, border: "1px solid var(--primary-200)" }}>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            <i className="fas fa-lightbulb" style={{ marginRight: 8, color: "var(--primary)" }}></i>
            <strong>หมายเหตุ:</strong> หลังจากสร้าง Company Profile แล้ว คุณจะสามารถสร้างตำแหน่งงานและจัดการผู้สมัครได้ทันที
          </p>
        </div>
      </div>
    </div>
  );
}
