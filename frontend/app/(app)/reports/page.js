"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const STATUS_CFG = {
  SUBMITTED:       { label:"ส่งแล้ว",     cls:"badge-blue" },
  AWAITING_REVIEW: { label:"รอตรวจ",      cls:"badge-yellow" },
  UNDER_REVIEW:    { label:"กำลังตรวจ",   cls:"badge-blue" },
  GRADED:          { label:"ตรวจแล้ว",    cls:"badge-green" },
  APPROVED:        { label:"ผ่านแล้ว",    cls:"badge-green" },
  REJECTED:        { label:"ไม่ผ่าน",     cls:"badge-red" },
};

export default function ReportsPage() {
  const [reports,    setReports]    = useState([]);
  const [user,       setUser]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form,       setForm]       = useState({ title:"", content:"" });
  const [formError,  setFormError]  = useState("");
  const [success,    setSuccess]    = useState("");
  const [grading,    setGrading]    = useState(null); // Report ID being graded
  const [gradeForm,  setGradeForm]  = useState({ score: 0, comment: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [u, rps] = await Promise.all([api.getMe(), api.getReports()]);
      setUser(u);
      setReports(rps);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const isAdminView = user?.roles?.some(r => ["ADMIN", "STAFF", "ADVISOR"].includes(r));
  const isStudent = user?.roles?.includes("STUDENT");

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError("กรุณาระบุชื่อรายงาน"); return; }
    setSubmitting(true); setFormError("");
    try {
      await api.submitReport({ title: form.title, content: form.content });
      setForm({ title:"", content:"" });
      setShowForm(false);
      setSuccess("ส่งรายงานสำเร็จแล้ว");
      setTimeout(() => setSuccess(""), 4000);
      load();
    } catch(err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrade = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.gradeReport(grading, gradeForm);
      setGrading(null);
      setGradeForm({ score: 0, comment: "" });
      setSuccess("บันทึกเกรดสำเร็จแล้ว");
      setTimeout(() => setSuccess(""), 4000);
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ padding:24, display:"flex", flexDirection:"column", gap:10 }}>
       {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height:64, borderRadius:12 }}></div>)}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Academic Compliance</p>
          <h1 className="page-title">รายงาน {isAdminView && "(สำหรับเจ้าหน้าที่)"}</h1>
          <p className="page-subtitle">
            {isStudent 
              ? "ติดตามการส่งรายงานและผลการประเมินจากอาจารย์ที่ปรึกษา" 
              : "พิจารณาและประเมินผลรายงานของนักศึกษาในความดูแล"}
          </p>
        </div>
        
        {isStudent && (
          <button
            className={showForm ? "btn btn-secondary" : "btn btn-primary"}
            onClick={() => setShowForm(!showForm)}
          >
            <i className={`fas ${showForm ? "fa-xmark" : "fa-file-arrow-up"}`}></i>
            {showForm ? "ยกเลิก" : "ส่งรายงานใหม่"}
          </button>
        )}
      </div>

      {/* Success */}
      {success && (
        <div className="alert alert-success animate-fade-in">
          <i className="fas fa-circle-check"></i> {success}
        </div>
      )}

      {/* Student: Submit Form */}
      {isStudent && showForm && (
        <div className="card animate-scale-in" style={{ padding:28 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:"var(--text-primary)", marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:3, height:18, background:"var(--primary)", borderRadius:2, display:"inline-block" }}></span>
            ส่งรายงานใหม่
          </h3>
          {formError && <div className="alert alert-error" style={{ marginBottom:16 }}><i className="fas fa-circle-exclamation"></i> {formError}</div>}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="field-group">
              <label className="field-label">ชื่อรายงาน *</label>
              <input
                className="field-input"
                placeholder="เช่น รายงานสัปดาห์ที่ 1..."
                value={form.title}
                onChange={e => setForm({...form, title:e.target.value})}
                disabled={submitting}
                required
              />
            </div>
            <div className="field-group">
              <label className="field-label">เนื้อหา / หมายเหตุ</label>
              <textarea
                className="field-input field-textarea"
                placeholder="รายละเอียดเพิ่มเติม..."
                rows={5}
                value={form.content}
                onChange={e => setForm({...form, content:e.target.value})}
                disabled={submitting}
              />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                <i className={`fas ${submitting ? "fa-circle-notch fa-spin" : "fa-paper-plane"}`}></i>
                {submitting ? "กำลังส่ง..." : "ส่งรายงาน"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>ยกเลิก</button>
            </div>
          </form>
        </div>
      )}

      {/* Admin/Advisor: Grade Modal (Overlay mockup) */}
      {grading && (
        <div className="card animate-scale-in" style={{ padding:28, border:"2px solid var(--primary)" }}>
          <h3 style={{ fontSize:16, fontWeight:800, marginBottom:20 }}>ประเมินรายงาน</h3>
          <form onSubmit={handleGrade} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div className="field-group">
              <label className="field-label">คะแนน (0-100)</label>
              <input 
                type="number" className="field-input" min="0" max="100"
                value={gradeForm.score} onChange={e => setGradeForm({...gradeForm, score: parseInt(e.target.value)})}
              />
            </div>
            <div className="field-group">
              <label className="field-label">ความเห็นอาจารย์</label>
              <textarea 
                className="field-input" rows={3}
                value={gradeForm.comment} onChange={e => setGradeForm({...gradeForm, comment: e.target.value})}
              />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>บันทึกผล</button>
              <button type="button" className="btn btn-ghost" onClick={() => setGrading(null)}>ยกเลิก</button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

      {/* Table */}
      <div className="data-table-wrap">
        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-file-invoice"></i></div>
            <h3>ยังไม่มีข้อมูล</h3>
            <p>{isStudent ? "คุณยังไม่ได้ส่งรายงาน" : "ยังไม่มีนักศึกษาส่งรายงานเข้ามา"}</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {isAdminView && <th>นักศึกษา</th>}
                <th>รายงาน</th>
                <th>วันที่ส่ง</th>
                <th>สถานะ</th>
                {isAdminView && <th>จัดการ</th>}
              </tr>
            </thead>
            <tbody>
              {reports.map(r => {
                const cfg = STATUS_CFG[r.status] || { label: r.status, cls:"badge-gray" };
                return (
                  <tr key={r.id}>
                    {isAdminView && (
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div className="avatar avatar-sm">{r.studentName?.charAt(0) || "S"}</div>
                          <p className="fw">{r.studentName || "นักศึกษา"}</p>
                        </div>
                      </td>
                    )}
                    <td>
                      <p className="fw">{r.title}</p>
                      <p style={{ fontSize:11, color:"var(--n-300)" }}>{r.content?.slice(0,30)}...</p>
                    </td>
                    <td>{r.submittedAt ? new Date(r.submittedAt).toLocaleDateString("th-TH") : "—"}</td>
                    <td><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
                    {isAdminView && (
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setGrading(r.id); setGradeForm({ score: r.score||0, comment: r.comment||"" }); }}>
                          <i className="fas fa-pen-to-square"></i> ตรวจ
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function MiniStat({ icon, color, bg, label, value }) {
  return (
    <div className="stat-premium" style={{ "--accent": color, display: "flex", alignItems: "center", gap: 14, padding: "16px 20px" }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 15 }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <p className="stat-card-label" style={{ fontSize: 11 }}>{label}</p>
        <p className="stat-card-value" style={{ fontSize: 22 }}>{value}</p>
      </div>
    </div>
  );
}
