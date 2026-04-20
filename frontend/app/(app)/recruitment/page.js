"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const STATUS_OPTIONS = ["PENDING", "REVIEWING", "INTERVIEW_SCHEDULED", "OFFER_EXTENDED", "ACCEPTED", "REJECTED"];

export default function RecruitmentPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState([]);

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
                    <div className="avatar-sm">{(a.studentName || "S").charAt(0)}</div>
                    <div>
                      <p className="fw-700">{a.studentName}</p>
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
    </div>
  );
}
