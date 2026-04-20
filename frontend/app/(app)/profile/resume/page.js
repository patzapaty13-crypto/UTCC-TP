"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function StudentResumePage() {
  const [resume, setResume] = useState({
    summary: "",
    skills: "",
    education: "",
    experience: "",
    portfolioUrl: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.getMyResume()
      .then(setResume)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.updateMyResume(resume);
      setMessage({ type: "success", text: "บันทึกประวัติส่วนตัวเรียบร้อยแล้ว" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-muted">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 840, margin: "0 auto" }}>
      <div className="page-header" style={{ marginBottom: 32 }}>
        <div>
          <p className="page-eyebrow">Professional Profile</p>
          <h1 className="page-title">จัดการ Resume</h1>
          <p className="page-subtitle">กรอกข้อมูลเพื่อแสดงทักษะและประสบการณ์ของคุณให้บริษัทพิจารณา</p>
        </div>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`} style={{ marginBottom: 24 }}>
          <i className={`fas fa-circle-${message.type === 'success' ? 'check' : 'exclamation'}`}></i>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="card" style={{ padding: 40, display: "flex", flexDirection: "column", gap: 32 }}>
        <div className="field-group">
          <label className="field-label">แนะนำตัวย่อ (Summary)</label>
          <textarea 
            className="field-input" 
            style={{ minHeight: 120, lineHeight: 1.6 }}
            placeholder="สรุปความสนใจ เป้าหมาย และความเป็นตัวคุณ..."
            value={resume.summary || ""}
            onChange={e => setResume({...resume, summary: e.target.value})}
          />
        </div>

        <div className="field-group">
          <label className="field-label">ทักษะและความสามารถ (Skills)</label>
          <textarea 
            className="field-input" 
            style={{ minHeight: 80 }}
            placeholder="เช่น Java, React, SQL, Project Management..."
            value={resume.skills || ""}
            onChange={e => setResume({...resume, skills: e.target.value})}
          />
        </div>

        <div className="field-group">
          <label className="field-label">ประวัติการศึกษา (Education)</label>
          <textarea 
            className="field-input" 
            style={{ minHeight: 100 }}
            placeholder="มหาวิทยาลัยหอการค้าไทย, คณะวิทยาศาสตร์และเทคโนโลยี..."
            value={resume.education || ""}
            onChange={e => setResume({...resume, education: e.target.value})}
          />
        </div>

        <div className="field-group">
          <label className="field-label">ประสบการณ์การทำงาน / กิจกรรม (Experience)</label>
          <textarea 
            className="field-input" 
            style={{ minHeight: 120 }}
            placeholder="ระบุประสบการณ์ที่ผ่านมา หรือผลงานที่เคยทำ..."
            value={resume.experience || ""}
            onChange={e => setResume({...resume, experience: e.target.value})}
          />
        </div>

        <div className="field-group">
          <label className="field-label">ลิงก์ Portfolio / LinkedIn</label>
          <div style={{ position: "relative" }}>
            <i className="fas fa-link" style={{ position: "absolute", left: 14, top: 15, color: "var(--n-400)" }}></i>
            <input 
              className="field-input" 
              style={{ paddingLeft: 40 }}
              type="url"
              placeholder="https://your-portfolio.com"
              value={resume.portfolioUrl || ""}
              onChange={e => setResume({...resume, portfolioUrl: e.target.value})}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--n-100)", paddingTop: 32 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
            บันทึก Resume
          </button>
        </div>
      </form>
    </div>
  );
}
