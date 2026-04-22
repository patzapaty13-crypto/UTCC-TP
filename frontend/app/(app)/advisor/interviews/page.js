"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function AdvisorInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const data = await api.get("/interviews/advisor");
      setInterviews(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (interview) => {
    if (interview.status === "RESCHEDULED") {
      return <span className="badge badge-orange">ขอเลื่อน</span>;
    }
    if (interview.studentConfirmed && interview.companyConfirmed) {
      return <span className="badge badge-green">ยืนยันแล้วทั้งสองฝ่าย</span>;
    }
    if (interview.studentConfirmed) {
      return <span className="badge badge-blue">นักศึกษายืนยันแล้ว</span>;
    }
    if (interview.companyConfirmed) {
      return <span className="badge badge-purple">อาจารย์ยืนยันแล้ว</span>;
    }
    return <span className="badge badge-yellow">รอยืนยัน</span>;
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "VIDEO":
        return <span className="badge badge-purple">สัมภาษณ์ออนไลน์</span>;
      case "IN_PERSON":
        return <span className="badge badge-blue">สัมภาษณ์ที่บริษัท</span>;
      case "PHONE":
        return <span className="badge badge-green">สัมภาษณ์ทางโทรศัพท์</span>;
      default:
        return <span className="badge badge-gray">{type}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " " + date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <RoleDashboardShell role="ADVISOR" title="นัดสัมภาษณ์">
        <div className="card" style={{ padding: 24 }}>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  if (error) {
    return (
      <RoleDashboardShell role="ADVISOR" title="นัดสัมภาษณ์">
        <div className="card" style={{ padding: 24 }}>
          <div className="alert alert-error">
            <i className="fas fa-circle-exclamation"></i> เกิดข้อผิดพลาด: {error}
          </div>
        </div>
      </RoleDashboardShell>
    );
  }

  const confirmedInterviews = interviews.filter(i => i.studentConfirmed);
  const pendingInterviews = interviews.filter(i => !i.studentConfirmed);

  return (
    <RoleDashboardShell role="ADVISOR" title="นัดสัมภาษณ์" subtitle="ตรวจสอบการยืนยันนัดสัมภาษณ์ของนักศึกษา">
      {/* Statistics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, background: "#F0FDF4", borderLeft: "4px solid #10B981" }}>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>นักศึกษายืนยันแล้ว</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{confirmedInterviews.length}</p>
        </div>
        <div className="card" style={{ padding: 20, background: "#FEF3C7", borderLeft: "4px solid #F59E0B" }}>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>รอยืนยัน</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{pendingInterviews.length}</p>
        </div>
        <div className="card" style={{ padding: 20, background: "#DBEAFE", borderLeft: "4px solid #3B82F6" }}>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 4 }}>ทั้งหมด</p>
          <p style={{ fontSize: 32, fontWeight: 700, color: "#1E293B" }}>{interviews.length}</p>
        </div>
      </div>

      {interviews.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
            ยังไม่มีนัดสัมภาษณ์
          </h3>
          <p style={{ fontSize: 14, color: "#64748b" }}>
            นัดสัมภาษณ์จะแสดงที่นี่เมื่อนักศึกษายื่นสมัครและอนุมัติแล้ว
          </p>
        </div>
      ) : (
        <>
          {/* Pending Confirmation */}
          {pendingInterviews.length > 0 && (
            <>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1e293b" }}>
                รอการยืนยัน ({pendingInterviews.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                {pendingInterviews.map((interview) => (
                  <div key={interview.id} className="card" style={{ padding: 20, borderLeft: "4px solid #F59E0B", backgroundColor: "#FFFBEB" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#1e293b" }}>
                          {interview.studentName || "นักศึกษา"}
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                          ตำแหน่ง: {interview.positionTitle || "ไม่ระบุ"}
                        </p>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                          {getStatusBadge(interview)}
                          {getTypeBadge(interview.interviewType)}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>วันที่นัด</p>
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{formatDate(interview.interviewDate)}</p>
                      </div>
                    </div>
                    {interview.location && (
                      <div style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>สถานที่/ลิงก์:</p>
                        <p style={{ fontSize: 14, color: "#1e293b" }}>{interview.location}</p>
                      </div>
                    )}
                    {interview.instructions && (
                      <div style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>คำแนะนำ:</p>
                        <p style={{ fontSize: 14, color: "#1e293b", background: "#F8FAFC", padding: 8, borderRadius: 8 }}>{interview.instructions}</p>
                      </div>
                    )}
                    {interview.rescheduleReason && (
                      <div style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 14, color: "#DC2626", marginBottom: 4 }}>เหตุผลขอเลื่อน:</p>
                        <p style={{ fontSize: 14, color: "#DC2626", background: "#FEF2F2", padding: 8, borderRadius: 8 }}>{interview.rescheduleReason}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Confirmed */}
          {confirmedInterviews.length > 0 && (
            <>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1e293b" }}>
                ยืนยันแล้ว ({confirmedInterviews.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {confirmedInterviews.map((interview) => (
                  <div key={interview.id} className="card" style={{ padding: 20, borderLeft: "4px solid #10B981", backgroundColor: "#F0FDF4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#1e293b" }}>
                          {interview.studentName || "นักศึกษา"}
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                          ตำแหน่ง: {interview.positionTitle || "ไม่ระบุ"}
                        </p>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                          {getStatusBadge(interview)}
                          {getTypeBadge(interview.interviewType)}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>วันที่นัด</p>
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{formatDate(interview.interviewDate)}</p>
                      </div>
                    </div>
                    {interview.location && (
                      <div style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>สถานที่/ลิงก์:</p>
                        <p style={{ fontSize: 14, color: "#1e293b" }}>{interview.location}</p>
                      </div>
                    )}
                    {interview.instructions && (
                      <div style={{ marginBottom: 8 }}>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>คำแนะนำ:</p>
                        <p style={{ fontSize: 14, color: "#1e293b", background: "#F8FAFC", padding: 8, borderRadius: 8 }}>{interview.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </RoleDashboardShell>
  );
}
