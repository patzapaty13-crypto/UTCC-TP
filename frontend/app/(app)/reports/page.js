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
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form,       setForm]       = useState({ title:"", content:"" });
  const [formError,  setFormError]  = useState("");
  const [success,    setSuccess]    = useState("");

  const load = () => {
    setLoading(true);
    api.getReports()
      .then(setReports)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

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

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Academic Compliance</p>
          <h1 className="page-title">รายงาน</h1>
          <p className="page-subtitle">ติดตามการส่งรายงานและผลการประเมินจากอาจารย์ที่ปรึกษา</p>
        </div>
        <button
          className={showForm ? "btn btn-secondary" : "btn btn-primary"}
          onClick={() => setShowForm(!showForm)}
        >
          <i className={`fas ${showForm ? "fa-xmark" : "fa-file-arrow-up"}`}></i>
          {showForm ? "ยกเลิก" : "ส่งรายงานใหม่"}
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="alert alert-success animate-fade-in">
          <i className="fas fa-circle-check"></i> {success}
        </div>
      )}

      {/* Submit Form */}
      {showForm && (
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
                placeholder="เช่น รายงานสัปดาห์ที่ 1, รายงานฝึกงานรอบสุดท้าย..."
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
                placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)..."
                rows={5}
                value={form.content}
                onChange={e => setForm({...form, content:e.target.value})}
                disabled={submitting}
              />
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? <><i className="fas fa-circle-notch fa-spin"></i> กำลังส่ง...</>
                  : <><i className="fas fa-paper-plane"></i> ส่งรายงาน</>
                }
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error */}
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

      {/* Stats summary */}
      {!loading && reports.length > 0 && (
        <div className="grid-4 stagger" style={{ gap: 12 }}>
          <MiniStat icon="fa-file-signature" color="#2563EB" bg="#EFF6FF" label="ทั้งหมด" value={reports.length} />
          <MiniStat icon="fa-clock" color="#D97706" bg="#FFFBEB" label="รอตรวจ" value={reports.filter(r => r.status === "AWAITING_REVIEW" || r.status === "SUBMITTED").length} />
          <MiniStat icon="fa-check-double" color="#059669" bg="#ECFDF5" label="ตรวจแล้ว" value={reports.filter(r => r.status === "GRADED" || r.status === "APPROVED").length} />
          <MiniStat icon="fa-xmark" color="#DC2626" bg="#FEF2F2" label="ไม่ผ่าน" value={reports.filter(r => r.status === "REJECTED").length} />
        </div>
      )}

      {/* Table */}
      <div className="data-table-wrap">
        {loading ? (
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:56, borderRadius:10 }}></div>)}
          </div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-file-invoice"></i></div>
            <h3>ยังไม่มีรายงาน</h3>
            <p>คุณยังไม่มีรายงานในระบบ กดปุ่ม "ส่งรายงานใหม่" เพื่อเริ่มต้น</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <i className="fas fa-file-arrow-up"></i> ส่งรายงานแรก
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>รายงาน</th>
                <th>เนื้อหา</th>
                <th>วันที่ส่ง</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => {
                const cfg = STATUS_CFG[r.status] || { label: r.status, cls:"badge-gray" };
                return (
                  <tr key={r.id}>
                    <td>
                      <p className="fw">{r.title}</p>
                      <p style={{ fontSize:11, fontFamily:"monospace", color:"var(--n-300)", marginTop:2 }}>
                        {String(r.id).slice(0,8).toUpperCase()}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontSize: 12.5, color: "var(--text-muted)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.content || "—"}
                      </p>
                    </td>
                    <td>
                      {r.submittedAt
                        ? new Date(r.submittedAt).toLocaleDateString("th-TH", { day:"numeric", month:"short", year:"numeric" })
                        : "—"
                      }
                    </td>
                    <td><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
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
