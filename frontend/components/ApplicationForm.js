"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function ApplicationForm({ internshipId, onSuccess, onCancel }) {
  const [step, setStep] = useState(1); // 1: Form, 2: Preview, 3: Success
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    gpa: "",
    major: "",
    year: "",
    coverLetter: "",
    portfolioUrl: "",
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!formData.phone.trim()) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก เริ่มต้นด้วย 0";
    }
    if (!formData.email.trim()) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!formData.gpa) {
      newErrors.gpa = "กรุณากรอกเกรดเฉลี่ย";
    } else if (formData.gpa < 0 || formData.gpa > 4) {
      newErrors.gpa = "เกรดเฉลี่ยต้องอยู่ระหว่าง 0.00 - 4.00";
    }
    if (!formData.major.trim()) newErrors.major = "กรุณากรอกสาขาวิชา";
    if (!formData.year) newErrors.year = "กรุณาเลือกชั้นปี";
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "กรุณากรอกจดหมายสมัครงาน";
    } else if (formData.coverLetter.length < 50) {
      newErrors.coverLetter = "จดหมายสมัครงานควรมีความยาวอย่างน้อย 50 ตัวอักษร";
    }
    if (formData.portfolioUrl && !/^https?:\/\/.+/.test(formData.portfolioUrl)) {
      newErrors.portfolioUrl = "URL ต้องเริ่มต้นด้วย http:// หรือ https://";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    if (validateForm()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.applyForInternship({
        internshipId,
        ...formData,
        gpa: parseFloat(formData.gpa),
        year: parseInt(formData.year),
      });
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="premium-card animate-fade-in" style={{ padding: 64, textAlign: "center", border: "2px solid #10B981" }}>
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          background: "#ECFDF5",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 32px",
          fontSize: 48, color: "#10B981",
          boxShadow: "0 0 40px rgba(16, 185, 129, 0.2)"
        }}>
          <i className="fas fa-check"></i>
        </div>
        <h2 className="gradient-text-blue" style={{ fontSize: 32, fontWeight: 900, marginBottom: 16 }}>
          ส่งใบสมัครสำเร็จ!
        </h2>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
          ใบสมัครของคุณถูกส่งไปยังฝ่ายบุคคลของบริษัทเรียบร้อยแล้ว
        </p>
        <div style={{ padding: "20px 32px", background: "#F0F9FF", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 12, border: "1px solid #BAE6FD" }}>
          <i className="fas fa-magic" style={{ color: "#0284C7" }}></i>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#0369A1" }}>ระบบกำลังพาคุณกลับไปยังข้อมูลตำแหน่งงาน...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 900, margin: "0 auto", width: "100%" }}>
      {/* Progress Header */}
      <div className="premium-card" style={{ padding: "24px 40px", borderTop: "4px solid var(--primary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-1px" }}>
              <i className="fas fa-edit" style={{ marginRight: 12, color: "var(--primary)" }}></i>
              {step === 1 ? "ยื่นใบสมัครฝึกงาน" : "ตรวจสอบข้อมูล"}
            </h2>
            <p className="text-muted" style={{ fontSize: 14 }}>
              {step === 1 ? "กรุณากรอกข้อมูลส่วนตัวและจดหมายแนะนำตัว" : "ตรวจสอบความถูกต้องของข้อมูลก่อนยืนยัน"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>1</div>
            <div style={{ width: 60, height: 2, background: step === 2 ? "var(--primary)" : "var(--n-200)" }}></div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: step === 2 ? "var(--primary)" : "var(--n-100)", color: step === 2 ? "white" : "var(--n-400)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>2</div>
          </div>
        </div>
      </div>

      {step === 2 ? (
        /* PREVIEW STEP */
        <div className="premium-card" style={{ padding: 40 }}>
          <div className="section-head">
            <h2><i className="fas fa-clipboard-check"></i> ข้อมูลสรุป</h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grid-2" style={{ gap: 16 }}>
              <PreviewField label="ชื่อ-นามสกุล" value={formData.fullName} icon="user" color="#2563EB" />
              <PreviewField label="เบอร์โทรศัพท์" value={formData.phone} icon="phone" color="#2563EB" />
            </div>
            <PreviewField label="อีเมลสำหรับติดต่อ" value={formData.email} icon="envelope" color="#2563EB" />
            <PreviewField label="ที่อยู่ปัจจุบัน" value={formData.address || "-"} icon="location-dot" color="#2563EB" />
            
            <div style={{ padding: 24, background: "#F5F3FF", borderRadius: 20, border: "1px solid #DDD6FE", marginTop: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: "#6D28D9", textTransform: "uppercase", marginBottom: 16, letterSpacing: "0.05em" }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: 8 }}></i>
                ประวัติการศึกษา
              </p>
              <div className="grid-3" style={{ gap: 16 }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700 }}>GPA</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: "#5B21B6" }}>{formData.gpa}</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700 }}>สาขาวิชา</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#5B21B6" }}>{formData.major}</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 11, color: "#7C3AED", fontWeight: 700 }}>ชั้นปี</p>
                  <p style={{ fontSize: 24, fontWeight: 900, color: "#5B21B6" }}>ปี {formData.year}</p>
                </div>
              </div>
            </div>

            <PreviewField 
              label="จดหมายสมัครงาน" 
              value={formData.coverLetter} 
              icon="file-lines"
              multiline 
              color="#059669"
            />

            {formData.portfolioUrl && (
              <PreviewField 
                label="Portfolio / Website" 
                value={formData.portfolioUrl} 
                icon="link"
                isLink 
                color="#D97706"
              />
            )}
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--n-200)" }}>
            <button className="btn btn-outline btn-lg" onClick={() => setStep(1)} disabled={loading} style={{ minWidth: 140 }}>
              <i className="fas fa-arrow-left" style={{ marginRight: 8 }}></i>
              แก้ไขข้อมูล
            </button>
            <button className="btn-premium" onClick={handleSubmit} disabled={loading} style={{ minWidth: 240, padding: "16px 32px" }}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin" style={{ marginRight: 10 }}></i> กำลังส่งใบสมัคร...</>
              ) : (
                <><i className="fas fa-paper-plane" style={{ marginRight: 10 }}></i> ยืนยันและส่งใบสมัคร</>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* FORM STEP */
        <form onSubmit={(e) => { e.preventDefault(); handlePreview(); }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Section: Personal Info */}
          <SectionCard 
            title="ข้อมูลส่วนตัว" 
            icon="user-circle" 
            color="#2563EB" 
            bg="linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
          >
            <div className="grid-2" style={{ gap: 20 }}>
              <InputGroup
                label="ชื่อ-นามสกุล"
                icon="user"
                required
                error={errors.fullName}
                value={formData.fullName}
                onChange={(v) => handleChange("fullName", v)}
                placeholder="เช่น สมชาย ใจดี"
              />
              <InputGroup
                label="เบอร์โทรศัพท์"
                icon="phone"
                required
                error={errors.phone}
                value={formData.phone}
                onChange={(v) => handleChange("phone", v)}
                placeholder="0812345678"
                maxLength={10}
              />
            </div>
            <InputGroup
              label="อีเมล"
              icon="envelope"
              required
              error={errors.email}
              value={formData.email}
              onChange={(v) => handleChange("email", v)}
              placeholder="example@email.com"
              type="email"
              style={{ marginTop: 20 }}
            />
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-map-location-dot" style={{ color: "#2563EB" }}></i>
                ที่อยู่ปัจจุบัน
              </label>
              <textarea
                className="input"
                placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                style={{ borderRadius: 16, padding: 16, fontSize: 14, border: "2px solid #BFDBFE" }}
              />
            </div>
          </SectionCard>

          {/* Section: Education */}
          <SectionCard 
            title="ข้อมูลการศึกษา" 
            icon="graduation-cap" 
            color="#7C3AED" 
            bg="linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)"
          >
            <div className="grid-3" style={{ gap: 20 }}>
              <InputGroup
                label="เกรดเฉลี่ย (GPA)"
                icon="chart-line"
                required
                error={errors.gpa}
                value={formData.gpa}
                onChange={(v) => handleChange("gpa", v)}
                placeholder="3.50"
                type="number"
                step="0.01"
              />
              <InputGroup
                label="สาขาวิชา"
                icon="book-open"
                required
                error={errors.major}
                value={formData.major}
                onChange={(v) => handleChange("major", v)}
                placeholder="เช่น วิทยาการคอมพิวเตอร์"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fas fa-calendar-days" style={{ color: "#7C3AED" }}></i>
                  ชั้นปี *
                </label>
                <select
                  className="input"
                  value={formData.year}
                  onChange={(e) => handleChange("year", e.target.value)}
                  style={{ borderRadius: 16, padding: "14px 16px", border: "2px solid #DDD6FE", height: "auto" }}
                >
                  <option value="">เลือกชั้นปี</option>
                  {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>ปี {y}</option>)}
                </select>
                {errors.year && <p style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>{errors.year}</p>}
              </div>
            </div>
          </SectionCard>

          {/* Section: Cover Letter */}
          <SectionCard 
            title="จดหมายสมัครงาน" 
            icon="file-lines" 
            color="#059669" 
            bg="linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-pen-nib" style={{ color: "#059669" }}></i>
                เขียนจดหมายแนะนำตัวและเหตุผลที่สนใจตำแหน่งนี้ *
              </label>
              <textarea
                className="input"
                placeholder="แนะนำตัวสั้นๆ และอธิบายว่าทำไมคุณถึงเป็นผู้สมัครที่เหมาะสม..."
                value={formData.coverLetter}
                onChange={(e) => handleChange("coverLetter", e.target.value)}
                rows={8}
                maxLength={2000}
                style={{ borderRadius: 20, padding: 20, fontSize: 14, lineHeight: 1.6, border: "2px solid #A7F3D0" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                {errors.coverLetter ? (
                  <p style={{ fontSize: 11, color: "#DC2626" }}><i className="fas fa-exclamation-circle"></i> {errors.coverLetter}</p>
                ) : (
                  <div></div>
                )}
                <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>
                  {formData.coverLetter.length} / 2000 ตัวอักษร
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Section: Portfolio */}
          <SectionCard 
            title="Portfolio (ถ้ามี)" 
            icon="link" 
            color="#D97706" 
            bg="linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)"
          >
            <InputGroup
              label="ลิงก์ Portfolio, GitHub, LinkedIn หรือเว็บไซต์ส่วนตัว"
              icon="share-nodes"
              error={errors.portfolioUrl}
              value={formData.portfolioUrl}
              onChange={(v) => handleChange("portfolioUrl", v)}
              placeholder="https://example.com/portfolio"
              type="url"
            />
          </SectionCard>

          {/* Footer Actions */}
          <div className="premium-card" style={{ padding: "32px 40px", display: "flex", justifyContent: "flex-end", gap: 16 }}>
            <button type="button" className="btn btn-outline btn-lg" onClick={onCancel} style={{ minWidth: 120 }}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-premium" style={{ minWidth: 200 }}>
              <i className="fas fa-eye" style={{ marginRight: 8 }}></i>
              ตรวจสอบข้อมูลใบสมัคร
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Internal Helper Components ──────────────────────────────────────────

function SectionCard({ title, icon, color, bg, children }) {
  return (
    <div className="premium-card" style={{ 
      padding: 0, 
      overflow: "hidden", 
      border: `1px solid ${color}30`,
      background: "white"
    }}>
      <div style={{ 
        padding: "20px 32px", 
        background: bg, 
        borderBottom: `1px solid ${color}20`,
        display: "flex",
        alignItems: "center",
        gap: 16
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: color, color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, boxShadow: `0 8px 16px -4px ${color}40`
        }}>
          <i className={`fas fa-${icon}`}></i>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: color }}>{title}</h3>
      </div>
      <div style={{ padding: 32 }}>
        {children}
      </div>
    </div>
  );
}

function InputGroup({ label, icon, required, error, value, onChange, placeholder, type = "text", maxLength, style, step }) {
  const [focused, setFocused] = useState(false);
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, ...style }}>
      <label style={{ 
        fontSize: 13, 
        fontWeight: 700, 
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        {icon && <i className={`fas fa-${icon}`} style={{ color: focused ? "var(--primary)" : "var(--n-400)", transition: "color 0.2s" }}></i>}
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      <input
        type={type}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={maxLength}
        step={step}
        style={{
          borderRadius: 14,
          padding: "14px 18px",
          fontSize: 14,
          fontWeight: 500,
          border: `2px solid ${error ? "#FECACA" : (focused ? "var(--primary)" : "var(--n-200)")}`,
          background: focused ? "white" : "var(--n-50)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: focused ? "0 0 0 4px rgba(37, 99, 235, 0.1)" : "none"
        }}
      />
      {error && (
        <p style={{ fontSize: 11, color: "#DC2626", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
          <i className="fas fa-exclamation-circle"></i> {error}
        </p>
      )}
    </div>
  );
}

function PreviewField({ label, value, icon, multiline, isLink, color = "var(--primary)" }) {
  return (
    <div className="glass" style={{ 
      padding: 24, 
      borderRadius: 16,
      border: `1px solid ${color}15`,
      background: "rgba(255,255,255,0.4)"
    }}>
      <p style={{ 
        fontSize: 11, 
        fontWeight: 800, 
        color: color, 
        textTransform: "uppercase", 
        letterSpacing: "0.05em",
        marginBottom: 10,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <i className={`fas fa-${icon}`}></i>
        {label}
      </p>
      {isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            fontSize: 15, 
            fontWeight: 700, 
            color: "var(--primary)",
            wordBreak: "break-all",
            display: "inline-flex",
            alignItems: "center",
            gap: 8
          }}
        >
          {value}
          <i className="fas fa-external-link" style={{ fontSize: 12 }}></i>
        </a>
      ) : (
        <p style={{ 
          fontSize: 15, 
          fontWeight: 600, 
          color: "var(--text-primary)",
          whiteSpace: multiline ? "pre-wrap" : "normal",
          lineHeight: multiline ? 1.7 : 1.4
        }}>
          {value || "-"}
        </p>
      )}
    </div>
  );
}
