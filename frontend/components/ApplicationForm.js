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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    }

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

    if (!formData.major.trim()) {
      newErrors.major = "กรุณากรอกสาขาวิชา";
    }

    if (!formData.year) {
      newErrors.year = "กรุณาเลือกชั้นปี";
    }

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
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      alert("เกิดข้อผิดพลาด: " + error.message);
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="card" style={{ padding:60, textAlign:"center" }}>
        <div style={{ 
          width:80, height:80, borderRadius:"50%", 
          background:"var(--success-50)", 
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 24px",
          fontSize:40, color:"var(--success)"
        }}>
          <i className="fas fa-check"></i>
        </div>
        <h2 style={{ fontSize:28, fontWeight:900, marginBottom:12, color:"var(--success)" }}>
          ส่งใบสมัครสำเร็จ!
        </h2>
        <p style={{ fontSize:16, color:"var(--text-secondary)", marginBottom:24 }}>
          ใบสมัครของคุณถูกส่งไปยังบริษัทเรียบร้อยแล้ว
        </p>
        <div className="alert alert-success" style={{ maxWidth:400, margin:"0 auto" }}>
          <i className="fas fa-info-circle"></i>
          บริษัทจะติดต่อกลับภายใน 3-5 วันทำการ
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="card" style={{ padding:40 }}>
        <h2 style={{ fontSize:24, fontWeight:900, marginBottom:8 }}>
          <i className="fas fa-eye" style={{marginRight:12, color:"var(--primary)"}}></i>
          ตรวจสอบข้อมูลก่อนส่ง
        </h2>
        <p style={{ color:"var(--text-secondary)", marginBottom:32 }}>
          กรุณาตรวจสอบความถูกต้องของข้อมูลก่อนยืนยันการส่งใบสมัคร
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
          <PreviewField label="ชื่อ-นามสกุล" value={formData.fullName} icon="user" />
          <PreviewField label="เบอร์โทรศัพท์" value={formData.phone} icon="phone" />
          <PreviewField label="อีเมล" value={formData.email} icon="envelope" />
          <PreviewField label="ที่อยู่" value={formData.address || "-"} icon="location-dot" />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
            <PreviewField label="เกรดเฉลี่ย" value={formData.gpa} icon="graduation-cap" />
            <PreviewField label="สาขาวิชา" value={formData.major} icon="book" />
            <PreviewField label="ชั้นปี" value={`ปี ${formData.year}`} icon="calendar" />
          </div>
          <PreviewField 
            label="จดหมายสมัครงาน" 
            value={formData.coverLetter} 
            icon="file-lines"
            multiline 
          />
          {formData.portfolioUrl && (
            <PreviewField 
              label="Portfolio" 
              value={formData.portfolioUrl} 
              icon="link"
              isLink 
            />
          )}
        </div>

        <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:32, paddingTop:32, borderTop:"1px solid var(--n-200)" }}>
          <button className="btn btn-ghost" onClick={() => setStep(1)} disabled={loading}>
            <i className="fas fa-arrow-left" style={{marginRight:8}}></i>
            แก้ไข
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{marginRight:8}}></i>
                กำลังส่ง...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane" style={{marginRight:8}}></i>
                ยืนยันส่งใบสมัคร
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding:40 }}>
      <h2 style={{ fontSize:24, fontWeight:900, marginBottom:8 }}>
        <i className="fas fa-file-alt" style={{marginRight:12, color:"var(--primary)"}}></i>
        แบบฟอร์มสมัครงาน
      </h2>
      <p style={{ color:"var(--text-secondary)", marginBottom:32 }}>
        กรุณากรอกข้อมูลให้ครบถ้วนเพื่อยื่นใบสมัคร
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handlePreview(); }}>
        {/* Personal Information */}
        <div style={{ 
          marginBottom:40,
          padding:24,
          background:"linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
          borderRadius:16,
          border:"1px solid #BFDBFE"
        }}>
          <h3 style={{ 
            fontSize:18, 
            fontWeight:800, 
            color:"#1E40AF", 
            marginBottom:24,
            display:"flex",
            alignItems:"center",
            gap:12
          }}>
            <div style={{
              width:40,
              height:40,
              borderRadius:10,
              background:"#2563EB",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:"white",
              fontSize:18
            }}>
              <i className="fas fa-user-circle"></i>
            </div>
            ข้อมูลส่วนตัว
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <FormField
              label="ชื่อ-นามสกุล"
              icon="user"
              required
              error={errors.fullName}
            >
              <input
                type="text"
                className="input"
                placeholder="เช่น สมชาย ใจดี"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                style={{
                  padding:"14px 16px",
                  fontSize:14,
                  border:"2px solid var(--n-200)",
                  borderRadius:12,
                  transition:"all 0.2s ease",
                  background:"white",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--n-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </FormField>

            <FormField
              label="เบอร์โทรศัพท์"
              icon="phone"
              required
              error={errors.phone}
            >
              <input
                type="tel"
                className="input"
                placeholder="0812345678"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                maxLength={10}
                style={{
                  padding:"14px 16px",
                  fontSize:14,
                  border:"2px solid var(--n-200)",
                  borderRadius:12,
                  transition:"all 0.2s ease",
                  background:"white",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--n-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </FormField>
          </div>

          <div style={{ marginTop:20 }}>
            <FormField
              label="อีเมล"
              icon="envelope"
              required
              error={errors.email}
            >
              <input
                type="email"
                className="input"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                  padding:"14px 16px",
                  fontSize:14,
                  border:"2px solid var(--n-200)",
                  borderRadius:12,
                  transition:"all 0.2s ease",
                  background:"white",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--n-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </FormField>
          </div>

          <div style={{ marginTop:20 }}>
            <FormField
              label="ที่อยู่"
              icon="location-dot"
              error={errors.address}
            >
              <textarea
                className="input"
                placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={3}
                style={{
                  resize:"vertical",
                  padding:"14px 16px",
                  fontSize:14,
                  border:"2px solid var(--n-200)",
                  borderRadius:12,
                  transition:"all 0.2s ease",
                  background:"white",
                  lineHeight:1.6
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--n-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </FormField>
          </div>
        </div>

        {/* Academic Information */}
        <div style={{ 
          marginBottom:40,
          padding:24,
          background:"linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
          borderRadius:16,
          border:"1px solid #DDD6FE"
        }}>
          <h3 style={{ 
            fontSize:18, 
            fontWeight:800, 
            color:"#6D28D9", 
            marginBottom:24,
            display:"flex",
            alignItems:"center",
            gap:12
          }}>
            <div style={{
              width:40,
              height:40,
              borderRadius:10,
              background:"#7C3AED",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:"white",
              fontSize:18
            }}>
              <i className="fas fa-graduation-cap"></i>
            </div>
            ข้อมูลการศึกษา
          </h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
            <FormField
              label="เกรดเฉลี่ย (GPA)"
              icon="chart-line"
              required
              error={errors.gpa}
            >
              <input
                type="number"
                className="input"
                placeholder="3.50"
                value={formData.gpa}
                onChange={(e) => handleChange("gpa", e.target.value)}
                step="0.01"
                min="0"
                max="4"
                style={{
                  padding:"14px 16px",
                  fontSize:14,
                  border:"2px solid var(--n-200)",
                  borderRadius:12,
                  transition:"all 0.2s ease",
                  background:"white",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--n-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </FormField>

            <FormField
              label="สาขาวิชา"
              icon="book-open"
              required
              error={errors.major}
            >
              <input
                type="text"
                className="input"
                placeholder="เช่น วิทยาการคอมพิวเตอร์"
                value={formData.major}
                onChange={(e) => handleChange("major", e.target.value)}
                style={{
                  padding:"14px 16px",
                  fontSize:14,
                  border:"2px solid var(--n-200)",
                  borderRadius:12,
                  transition:"all 0.2s ease",
                  background:"white",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--n-200)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </FormField>

            <FormField
              label="ชั้นปี"
              icon="calendar-days"
              required
              error={errors.year}
            >
              <select
                className="input"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                style={{
                  padding:"14px 16px",
                  fontSize:14,
                  border:"2px solid var(--n-200)",
                  borderRadius:12,
                  transition:"all 0.2s ease",
                  background:"white",
                  cursor:"pointer"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563EB";
                  e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--n-200)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">เลือกชั้นปี</option>
                <option value="1">ปี 1</option>
                <option value="2">ปี 2</option>
                <option value="3">ปี 3</option>
                <option value="4">ปี 4</option>
                <option value="5">ปี 5</option>
                <option value="6">ปี 6</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Cover Letter */}
        <div style={{ 
          marginBottom:40,
          padding:24,
          background:"linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
          borderRadius:16,
          border:"1px solid #A7F3D0"
        }}>
          <h3 style={{ 
            fontSize:18, 
            fontWeight:800, 
            color:"#047857", 
            marginBottom:24,
            display:"flex",
            alignItems:"center",
            gap:12
          }}>
            <div style={{
              width:40,
              height:40,
              borderRadius:10,
              background:"#059669",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:"white",
              fontSize:18
            }}>
              <i className="fas fa-file-lines"></i>
            </div>
            จดหมายสมัครงาน
          </h3>
          <FormField
            label="เขียนจดหมายแนะนำตัวและเหตุผลที่สนใจตำแหน่งนี้"
            icon="pen-to-square"
            required
            error={errors.coverLetter}
            hint={`${formData.coverLetter.length}/2000 ตัวอักษร (ขั้นต่ำ 50 ตัวอักษร)`}
          >
            <textarea
              className="input"
              placeholder="เช่น ผม/ดิฉันสนใจตำแหน่งนี้เพราะ..."
              value={formData.coverLetter}
              onChange={(e) => handleChange("coverLetter", e.target.value)}
              rows={8}
              maxLength={2000}
              style={{
                resize:"vertical",
                padding:"14px 16px",
                fontSize:14,
                border:"2px solid var(--n-200)",
                borderRadius:12,
                transition:"all 0.2s ease",
                background:"white",
                lineHeight:1.6
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563EB";
                e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--n-200)";
                e.target.style.boxShadow = "none";
              }}
            />
          </FormField>
        </div>

        {/* Portfolio (Optional) */}
        <div style={{ 
          marginBottom:32,
          padding:24,
          background:"linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          borderRadius:16,
          border:"1px solid #FDE68A"
        }}>
          <h3 style={{ 
            fontSize:18, 
            fontWeight:800, 
            color:"#B45309", 
            marginBottom:24,
            display:"flex",
            alignItems:"center",
            gap:12
          }}>
            <div style={{
              width:40,
              height:40,
              borderRadius:10,
              background:"#D97706",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              color:"white",
              fontSize:18
            }}>
              <i className="fas fa-link"></i>
            </div>
            Portfolio (ถ้ามี)
          </h3>
          <FormField
            label="ลิงก์ Portfolio, GitHub, LinkedIn หรือเว็บไซต์ส่วนตัว"
            icon="link"
            error={errors.portfolioUrl}
          >
            <input
              type="url"
              className="input"
              placeholder="https://example.com/portfolio"
              value={formData.portfolioUrl}
              onChange={(e) => handleChange("portfolioUrl", e.target.value)}
              style={{
                padding:"14px 16px",
                fontSize:14,
                border:"2px solid var(--n-200)",
                borderRadius:12,
                transition:"all 0.2s ease",
                background:"white",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563EB";
                e.target.style.boxShadow = "0 0 0 4px rgba(37, 99, 235, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--n-200)";
                e.target.style.boxShadow = "none";
              }}
            />
          </FormField>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:12, justifyContent:"flex-end", paddingTop:32, borderTop:"1px solid var(--n-200)" }}>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            <i className="fas fa-times" style={{marginRight:8}}></i>
            ยกเลิก
          </button>
          <button type="submit" className="btn btn-primary btn-lg">
            <i className="fas fa-eye" style={{marginRight:8}}></i>
            ตรวจสอบข้อมูล
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper Components
function FormField({ label, required, error, hint, children, icon }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <label style={{ 
        fontSize:13, 
        fontWeight:700, 
        color:"var(--text-primary)",
        letterSpacing:"0.01em",
        display:"flex",
        alignItems:"center",
        gap:8
      }}>
        {icon && <i className={`fas fa-${icon}`} style={{color:"#2563EB", fontSize:14}}></i>}
        {label}
        {required && (
          <span style={{ 
            color:"#DC2626", 
            marginLeft:2,
            fontSize:16,
            lineHeight:1
          }}>*</span>
        )}
      </label>
      <div style={{ position:"relative" }}>
        {children}
      </div>
      {error && (
        <p style={{ 
          fontSize:12, 
          color:"#DC2626", 
          display:"flex", 
          alignItems:"center", 
          gap:6,
          padding:"8px 12px",
          background:"#FEF2F2",
          borderRadius:8,
          border:"1px solid #FEE2E2"
        }}>
          <i className="fas fa-circle-exclamation"></i>
          {error}
        </p>
      )}
      {hint && !error && (
        <p style={{ 
          fontSize:11, 
          color:"var(--text-muted)",
          display:"flex",
          alignItems:"center",
          gap:6
        }}>
          <i className="fas fa-info-circle" style={{fontSize:10}}></i>
          {hint}
        </p>
      )}
    </div>
  );
}

function PreviewField({ label, value, icon, multiline, isLink }) {
  return (
    <div style={{ 
      padding:20, 
      background:"var(--n-50)", 
      borderRadius:12,
      border:"1px solid var(--n-200)"
    }}>
      <p style={{ 
        fontSize:12, 
        fontWeight:700, 
        color:"var(--text-muted)", 
        textTransform:"uppercase", 
        letterSpacing:"0.05em",
        marginBottom:8,
        display:"flex",
        alignItems:"center",
        gap:8
      }}>
        <i className={`fas fa-${icon}`} style={{color:"var(--primary)"}}></i>
        {label}
      </p>
      {isLink ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            fontSize:14, 
            fontWeight:600, 
            color:"var(--primary)",
            wordBreak:"break-all"
          }}
        >
          {value}
          <i className="fas fa-external-link" style={{marginLeft:6, fontSize:12}}></i>
        </a>
      ) : (
        <p style={{ 
          fontSize:14, 
          fontWeight:600, 
          color:"var(--text-primary)",
          whiteSpace: multiline ? "pre-wrap" : "normal",
          lineHeight: multiline ? 1.6 : 1.4
        }}>
          {value}
        </p>
      )}
    </div>
  );
}
