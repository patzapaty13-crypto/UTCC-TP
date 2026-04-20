"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "REVIEWING", "INTERVIEW_SCHEDULED", "OFFER_EXTENDED", "ACCEPTED", "REJECTED"];

export default function RecruitmentPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState([]);
  
  // Resume View State
  const [viewResume, setViewResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    api.getApplications()
      .then(data => setApps(data.filter(a => a.type === "INTERNSHIP")))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdating(appId);
    try {
      await api.decideForInternship(appId, { decision: newStatus === "REJECTED" ? "REJECT" : "APPROVE", note: `Changed to ${newStatus}` });
      await loadData();
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setUpdating(null);
    }
  };

  const openResume = async (studentId) => {
    if (!studentId) {
      alert("ไม่พบรหัสนักศึกษา");
      return;
    }
    setResumeLoading(true);
    try {
      const res = await api.getUserResume(studentId);
      setViewResume(res);
    } catch (e) {
      alert("ไม่สามารถดึงข้อมูล Resume ได้: " + e.message);
    } finally {
      setResumeLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkAction = async (decision) => {
    setLoading(true);
    try {
      await api.bulkDecideForInternships({ ids: selected, decision, note: "Bulk processed by staff" });
      setSelected([]);
      await loadData();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Employer Hub</p>
          <h1 className="page-title">ระบบจัดการผู้สมัคร (ATS)</h1>
          <p className="page-subtitle">คัดกรองนักศึกษาและติดตามสถานะการสัมภาษณ์งาน</p>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="card animate-slide-up" style={{
          position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          padding: "16px 32px", background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px", display: "flex", alignItems: "center", gap: "24px", zIndex: 100,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
        }}>
          <span style={{ color: "white", fontWeight: "700" }}>{selected.length} รายการที่เลือก</span>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => handleBulkAction("APPROVE")} className="btn btn-primary" style={{ background: "#059669", border: "none" }}>อนุมัติทั้งหมด</button>
            <button onClick={() => handleBulkAction("REJECT")} className="btn btn-error">ปฏิเสธทั้งหมด</button>
            <button onClick={() => setSelected([])} className="btn btn-ghost" style={{ color: "white" }}>ยกเลิก</button>
          </div>
        </div>
      )}

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" onChange={(e) => setSelected(e.target.checked ? apps.map(a => a.id) : [])} />
              </th>
              <th>ชื่อนักศึกษา</th>
              <th>ตำแหน่งที่สมัคร</th>
              <th>AI Screening</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(a => (
              <tr key={a.id} className={selected.includes(a.id) ? "selected-row" : ""}>
                <td>
                  <input type="checkbox" checked={selected.includes(a.id)} onChange={() => toggleSelect(a.id)} />
                </td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar-sm" style={{ cursor: "pointer" }} onClick={() => openResume(a.studentId)}>
                        {(a.studentName || "S").charAt(0)}
                    </div>
                    <div>
                      <p className="fw-700" style={{ cursor: "pointer" }} onClick={() => openResume(a.studentId)}>
                        {a.studentName}
                      </p>
                      <p className="text-xs text-muted">{a.studentMajor}</p>
                    </div>
                  </div>
                </td>
                <td>{a.positionTitle || a.internshipTitle}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="progress-bar-small" style={{ width: 60, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${a.matchScore || 85}%`, height: "100%", background: "var(--success)" }}></div>
                    </div>
                    <span className="text-success fw-700">{a.matchScore || 85}%</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px", alignItems:"center" }}>
                    <select 
                      className="field-input sm"
                      style={{ padding: "4px 8px", width: "auto" }}
                      value={a.status}
                      disabled={updating === a.id}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    
                    <button 
                      onClick={() => openResume(a.studentId)}
                      className="btn btn-ghost btn-sm"
                      title="View Resume"
                      style={{ color: "var(--primary)" }}
                    >
                      <i className="fas fa-id-card"></i>
                    </button>

                    <a 
                      href={api.downloadLetterUrl(a.id)}
                      className="btn btn-ghost btn-sm"
                      title="Download PDF Letter"
                      style={{ color: "var(--primary)" }}
                      target="_blank"
                    >
                      <i className="fas fa-file-pdf"></i>
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resume Modal */}
      {viewResume && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          padding: 20
        }}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 700, maxHeight: "90vh", overflow: "auto", position: "relative", padding: 0 }}>
            <button 
              onClick={() => setViewResume(null)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--n-400)", zIndex: 10 }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            {/* Resume Header */}
            <div style={{ padding: "40px 40px 32px", background: "var(--n-900)", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900 }}>
                  {viewResume.displayName.charAt(0)}
                </div>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>{viewResume.displayName}</h2>
                  <p style={{ opacity: 0.7, fontSize: 14 }}>{viewResume.email}</p>
                </div>
              </div>
            </div>

            {/* Resume Body */}
            <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 32 }}>
              <section>
                <h4 style={{ color: "var(--primary)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Summary</h4>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-primary)", whiteSpace: "pre-wrap" }}>
                  {viewResume.summary || "ไม่มีข้อมูลสรุป"}
                </p>
              </section>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                <section>
                  <h4 style={{ color: "var(--primary)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Skills</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{viewResume.skills || "-"}</p>
                </section>
                <section>
                  <h4 style={{ color: "var(--primary)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Education</h4>
                  <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{viewResume.education || "-"}</p>
                </section>
              </div>

              <section>
                <h4 style={{ color: "var(--primary)", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Experience</h4>
                <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{viewResume.experience || "ไม่มีข้อมูลประสบการณ์"}</p>
              </section>

              {viewResume.portfolioUrl && (
                <a 
                  href={viewResume.portfolioUrl} 
                  target="_blank" 
                  className="btn btn-secondary" 
                  style={{ width: "fit-content" }}
                >
                  <i className="fas fa-external-link-alt mr-2"></i> ดู Portfolio / ผลงานเพิ่มเติม
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
