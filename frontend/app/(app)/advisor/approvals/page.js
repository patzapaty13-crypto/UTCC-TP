"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function AdvisorApprovalsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleApprove = async (applicationId) => {
    try {
      await api.decideForInternship(applicationId, { decision: "ADVISOR_APPROVED", note: "" });
      loadApplications();
    } catch (err) {
      alert("อนุมัติไม่สำเร็จ: " + (err.message || ""));
    }
  };

  const handleReject = async (applicationId) => {
    const reason = prompt("กรุณาระบุเหตุผลในการปฏิเสธ:");
    if (reason) {
      try {
        await api.decideForInternship(applicationId, { decision: "REJECTED", note: reason });
        loadApplications();
      } catch (err) {
        alert("ปฏิเสธไม่สำเร็จ: " + (err.message || ""));
      }
    }
  };

  const pendingApplications = applications.filter((app) => app.status === "PENDING" || app.status === "REVIEWING");
  const approvedApplications = applications.filter((app) => app.status === "ADVISOR_APPROVED");

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <span className="badge badge-yellow">รออนุมัติ</span>;
      case "REVIEWING":
        return <span className="badge badge-blue">กำลังพิจารณา</span>;
      case "ADVISOR_APPROVED":
        return <span className="badge badge-green">อนุมัติแล้ว</span>;
      case "REJECTED":
        return <span className="badge badge-red">ปฏิเสธแล้ว</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  return (
    <RoleDashboardShell role="ADVISOR" title="อนุมัติเอกสาร" subtitle="ตรวจสอบและอนุมัติใบสมัครฝึกงาน">
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }}></div>
          ))}
        </div>
      ) : pendingApplications.length === 0 && approvedApplications.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: "#1e293b" }}>
            ไม่มีใบสมัคร
          </h3>
          <p style={{ fontSize: 14 }}>ไม่มีใบสมัครในระบบในขณะนี้</p>
        </div>
      ) : (
        <>
          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1e293b" }}>
                รออนุมัติ ({pendingApplications.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                {pendingApplications.map((app) => (
                  <div key={app.id} className="card" style={{ padding: 20, borderLeft: "4px solid #f59e0b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#1e293b" }}>
                          {app.internshipTitle || app.tripTitle || "ใบสมัคร"}
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                          ผู้สมัคร: {app.studentName}
                        </p>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                          สาขา: {app.studentMajor}
                        </p>
                        {getStatusBadge(app.status)}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-success"
                          style={{ padding: "10px 20px", fontWeight: 600, borderRadius: 8 }}
                          onClick={() => handleApprove(app.id)}
                        >
                          <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                          อนุมัติ
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: "10px 20px", fontWeight: 600, borderRadius: 8 }}
                          onClick={() => handleReject(app.id)}
                        >
                          <i className="fas fa-times" style={{ marginRight: 8 }}></i>
                          ปฏิเสธ
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Approved Applications */}
          {approvedApplications.length > 0 && (
            <>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1e293b" }}>
                อนุมัติแล้ว ({approvedApplications.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {approvedApplications.map((app) => (
                  <div key={app.id} className="card" style={{ padding: 20, borderLeft: "4px solid #10b981", backgroundColor: "#f0fdf4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#1e293b" }}>
                          {app.internshipTitle || app.tripTitle || "ใบสมัคร"}
                        </h3>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                          ผู้สมัคร: {app.studentName}
                        </p>
                        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                          สาขา: {app.studentMajor}
                        </p>
                        {getStatusBadge(app.status)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <i className="fas fa-check-circle" style={{ fontSize: 32, color: "#10b981" }}></i>
                      </div>
                    </div>
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
