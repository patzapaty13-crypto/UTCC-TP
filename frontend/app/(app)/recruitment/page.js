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
      // Manual fetch call for now since api.js might not have bulkDecide yet
      const token = localStorage.getItem("utcctp_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1"}/applications/bulk-decision`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ ids: selected, decision, note: "Bulk processed by staff" })
      });
      if (!res.ok) throw new Error("Bulk update failed");
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
        <div className="glass-card animate-slide-up" style={{
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
              <th>สถานะปัจจุบัน</th>
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
                    <div className="progress-bar-small" style={{ width: 60, height: 6, background: "var(--n-200)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${a.matchScore || 85}%`, height: "100%", background: "var(--success)" }}></div>
                    </div>
                    <span className="text-success fw-700">{a.matchScore || 85}%</span>
                  </div>
                </td>
                <td>
                  <span className={`badge badge-gray`}>{a.status}</span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <select 
                      className="select-sm"
                      value={a.status}
                      disabled={updating === a.id}
                      onChange={(e) => handleStatusChange(a.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <a 
                      href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1"}/applications/${a.id}/download-letter`}
                      className="icon-btn-sm"
                      title="Download PDF Letter"
                      style={{ background: "#EFF6FF", color: "#2563EB", padding: "4px 8px", borderRadius: "6px" }}
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
