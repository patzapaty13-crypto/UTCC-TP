"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      const data = await api.getCompanyInterviews();
      setInterviews(data || []);
    } catch (err) {
      console.error("Failed to load interviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (interviewId) => {
    try {
      await api.confirmInterview(interviewId);
      loadInterviews();
    } catch (err) {
      alert("ไม่สามารถยืนยันได้: " + (err.message || ""));
    }
  };

  const handleReschedule = async (interviewId) => {
    const reason = prompt("เหตุผลในการเลื่อน:");
    if (!reason) return;
    try {
      await api.rescheduleInterview(interviewId, reason);
      loadInterviews();
    } catch (err) {
      alert("ไม่สามารถเลื่อนได้: " + (err.message || ""));
    }
  };

  const handleSetResult = async (interviewId, result) => {
    if (!confirm(`ยืนยันว่านักศึกษา${result === "PASSED" ? "ผ่าน" : "ไม่ผ่าน"}การสัมภาษณ์?`)) return;
    try {
      await api.setInterviewResult(interviewId, result);
      loadInterviews();
    } catch (err) {
      alert("ไม่สามารถบันทึกผลได้: " + (err.message || ""));
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="นัดสัมภาษณ์" subtitle="จัดการนัดสัมภาษณ์กับนักศึกษา">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="COMPANY" title="นัดสัมภาษณ์" subtitle="จัดการนัดสัมภาษณ์กับนักศึกษา">
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {interviews.length === 0 ? (
            <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>
              ยังไม่มีนัดสัมภาษณ์
            </p>
          ) : (
            interviews.map((interview) => (
              <div key={interview.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, borderBottom: "1px solid #E2E8F0", padding: "16px 0" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>
                    {interview.studentName || "นักศึกษา"}
                  </p>
                  <p className="text-muted" style={{ marginTop: 4, fontSize: 14 }}>
                    {interview.interviewDate} • {interview.interviewType}
                  </p>
                  {interview.scheduledTime && (
                    <p className="text-muted" style={{ marginTop: 2, fontSize: 13 }}>
                      <i className="fas fa-clock" style={{ marginRight: 4 }}></i>
                      เวลา: {interview.scheduledTime}
                    </p>
                  )}
                  {interview.location && (
                    <p className="text-muted" style={{ marginTop: 2, fontSize: 13 }}>
                      <i className="fas fa-map-marker-alt" style={{ marginRight: 4 }}></i>
                      สถานที่: {interview.location}
                    </p>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <span className={`badge ${interview.status === "SCHEDULED" ? "badge-blue" : interview.status === "CONFIRMED" ? "badge-green" : "badge-gray"}`}>
                      {interview.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {interview.status === "SCHEDULED" && (
                    <button className="btn btn-primary" style={{ padding: "8px 16px" }} onClick={() => handleConfirm(interview.id)}>
                      ยืนยัน
                    </button>
                  )}
                  {interview.status === "CONFIRMED" && !interview.result && (
                    <>
                      <button className="btn btn-success" style={{ padding: "8px 16px", background: "#10B981", color: "white", border: "none" }} onClick={() => handleSetResult(interview.id, "PASSED")}>
                        ผ่าน
                      </button>
                      <button className="btn btn-danger" style={{ padding: "8px 16px", background: "#EF4444", color: "white", border: "none" }} onClick={() => handleSetResult(interview.id, "FAILED")}>
                        ไม่ผ่าน
                      </button>
                    </>
                  )}
                  {interview.result && (
                    <span className={`badge ${interview.result === "PASSED" ? "badge-green" : "badge-red"}`}>
                      {interview.result === "PASSED" ? "ผ่าน" : "ไม่ผ่าน"}
                    </span>
                  )}
                  <button className="btn btn-ghost" style={{ padding: "8px 16px" }} onClick={() => handleReschedule(interview.id)}>
                    เลื่อน
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </RoleDashboardShell>
  );
}
