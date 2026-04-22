"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function AdvisorApprovalsPage() {
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

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

  useEffect(() => {
    const applicationId = searchParams.get("applicationId");
    if (applicationId && applications.length > 0) {
      const app = applications.find(a => a.id === applicationId);
      if (app) {
        setSelectedApplication(app);
        setShowDetailModal(true);
      }
    }
  }, [searchParams, applications]);

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

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailModal(true);
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
        return <span className="badge badge-green">อนุมัติ</span>;
      case "REJECTED":
        return <span className="badge badge-red">ปฏิเสธ</span>;
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
                          className="btn btn-ghost"
                          style={{ padding: "10px 16px", fontWeight: 600, borderRadius: 8 }}
                          onClick={() => handleViewDetails(app)}
                        >
                          <i className="fas fa-eye" style={{ marginRight: 8 }}></i>
                          ดูรายละเอียด
                        </button>
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
                        <button
                          className="btn btn-ghost"
                          style={{ padding: "10px 16px", fontWeight: 600, borderRadius: 8 }}
                          onClick={() => handleViewDetails(app)}
                        >
                          <i className="fas fa-eye" style={{ marginRight: 8 }}></i>
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Application Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 24,
            width: "90%",
            maxWidth: 700,
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#1e293b" }}>
              รายละเอียดใบสมัคร
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ชื่อ-นามสกุล:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.studentName || selectedApplication.fullName || "-"}</p>
              </div>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>เบอร์โทรศัพท์:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.phone || "-"}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>อีเมล:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.email || "-"}</p>
              </div>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ที่อยู่:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.address || "-"}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>สาขา:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.studentMajor || selectedApplication.major || "-"}</p>
              </div>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ชั้นปี:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.studentYear || selectedApplication.year ? `${selectedApplication.studentYear || selectedApplication.year}/4` : "-"}</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>เกรดเฉลี่ย:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.gpa ? selectedApplication.gpa.toFixed(2) : "-"}</p>
              </div>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>สถานะ:</p>
                {getStatusBadge(selectedApplication.status)}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ตำแหน่ง/โปรแกรม:</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.internshipTitle || selectedApplication.tripTitle || "ใบสมัคร"}</p>
            </div>

            {selectedApplication.companyName && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>บริษัท:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{selectedApplication.companyName}</p>
              </div>
            )}

            {selectedApplication.portfolioUrl && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>Portfolio:</p>
                <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                  {selectedApplication.portfolioUrl}
                </a>
              </div>
            )}

            {selectedApplication.coverLetter && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>จดหมายแนะนำตัวเอง:</p>
                <p style={{ fontSize: 14, color: "#1e293b", background: "#f8fafc", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>{selectedApplication.coverLetter}</p>
              </div>
            )}

            {selectedApplication.resume && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>Resume:</p>
                <a href={selectedApplication.resume} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                  ดู Resume
                </a>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>วันที่สมัคร:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                  {selectedApplication.createdAt ? new Date(selectedApplication.createdAt).toLocaleDateString("th-TH") : "-"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>วันที่อัปเดตล่าสุด:</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>
                  {selectedApplication.updatedAt ? new Date(selectedApplication.updatedAt).toLocaleDateString("th-TH") : "-"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
                style={{ padding: "10px 20px", fontWeight: 600, borderRadius: 8 }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
