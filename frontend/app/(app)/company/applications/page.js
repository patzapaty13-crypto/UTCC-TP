"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CompanyApplicationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleData, setScheduleData] = useState({ date: "", time: "", location: "" });

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await api.getApplications();
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId) => {
    try {
      await api.decideApplication(appId, { decision: "REVIEWING", note: "บริษัทรับเข้าพิจารณา" });
      loadApplications();
    } catch (err) {
      alert("ไม่สามารถอนุมัติได้: " + (err.message || ""));
    }
  };

  const handleReject = async (appId) => {
    try {
      await api.decideApplication(appId, { decision: "REJECT", note: "บริษัทปฏิเสธ" });
      loadApplications();
    } catch (err) {
      alert("ไม่สามารถปฏิเสธได้: " + (err.message || ""));
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;

    try {
      // If application is ADVISOR_APPROVED, approve it first
      if (selectedApplication.status === "ADVISOR_APPROVED") {
        await api.decideApplication(selectedApplication.id, { decision: "REVIEWING", note: "บริษัทรับเข้าพิจารณาและนัดสัมภาษณ์" });
      }

      // Then schedule interview
      const scheduledAt = `${scheduleData.date}T${scheduleData.time}:00.000Z`;
      await api.createInterview({
        applicationId: selectedApplication.id,
        scheduledAt: scheduledAt,
        location: scheduleData.location
      });
      alert("อนุมัติและนัดสัมภาษณ์สำเร็จ");
      setShowScheduleModal(false);
      setScheduleData({ date: "", time: "", location: "" });
      loadApplications();
    } catch (err) {
      alert("ไม่สามารถอนุมัติและนัดสัมภาษณ์ได้: " + (err.message || ""));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ADVISOR_APPROVED":
        return <span className="badge badge-green">อนุมัติโดยอาจารย์</span>;
      case "REVIEWING":
        return <span className="badge badge-blue">กำลังพิจารณา</span>;
      case "SHORTLISTED":
        return <span className="badge badge-purple">ผ่านรอบแรก</span>;
      case "INTERVIEW_SCHEDULED":
        return <span className="badge badge-orange">นัดสัมภาษณ์แล้ว</span>;
      case "ACCEPTED":
        return <span className="badge badge-green">ตอบรับแล้ว</span>;
      case "REJECTED":
        return <span className="badge badge-red">ปฏิเสธ</span>;
      default:
        return <span className="badge badge-gray">{status}</span>;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ADVISOR_APPROVED": return "อนุมัติโดยอาจารย์";
      case "REVIEWING": return "กำลังพิจารณาบริษัท";
      case "SHORTLISTED": return "ผ่านรอบแรก";
      case "INTERVIEW_SCHEDULED": return "นัดสัมภาษณ์";
      case "INTERVIEW_COMPLETED": return "สัมภาษณ์เสร็จ";
      case "OFFER_EXTENDED": return "ได้รับข้อเสนอ";
      case "ACCEPTED": return "อนุมัติ";
      case "REJECTED": return "ปฏิเสธ";
      default: return status;
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="ใบสมัคร" subtitle="ตรวจสอบใบสมัครจากนักศึกษา">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="COMPANY" title="ใบสมัคร" subtitle="ตรวจสอบใบสมัครจากนักศึกษา">
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {applications.length === 0 ? (
            <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>
              ยังไม่มีใบสมัคร
            </p>
          ) : (
            applications.map((app) => (
              <div key={app.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, borderBottom: "1px solid #E2E8F0", padding: "16px 0" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>{app.studentName || app.fullName}</p>
                  <p className="text-muted" style={{ marginTop: 4, fontSize: 14 }}>
                    {app.internshipTitle || app.tripTitle}
                  </p>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" style={{ padding: "8px 16px" }} onClick={() => { setSelectedApplication(app); setShowDetailModal(true); }}>
                    ดูรายละเอียด
                  </button>
                  {app.status === "ADVISOR_APPROVED" && (
                    <>
                      <button className="btn btn-primary" style={{ padding: "8px 16px", background: "#7C3AED", color: "white", border: "none" }} onClick={() => { setSelectedApplication(app); setShowScheduleModal(true); }}>
                        <i className="fas fa-calendar-check" style={{ marginRight: 6 }}></i> อนุมัติและนัดสัมภาษณ์
                      </button>
                      <button className="btn btn-danger" style={{ padding: "8px 16px" }} onClick={() => handleReject(app.id)}>
                        ปฏิเสธ
                      </button>
                    </>
                  )}
                  {(app.status === "REVIEWING" || app.status === "SHORTLISTED") && (
                    <button className="btn btn-purple" style={{ padding: "8px 16px", background: "#7C3AED", color: "white", border: "none" }} onClick={() => { setSelectedApplication(app); setShowScheduleModal(true); }}>
                      <i className="fas fa-calendar-plus" style={{ marginRight: 6 }}></i> นัดสัมภาษณ์
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>เรซูเม่:</p>
                <a href={selectedApplication.resume} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <i className="fas fa-file-pdf"></i> ดูเรซูเม่
                </a>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn btn-ghost"
                style={{ padding: "10px 20px" }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedApplication && (
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
            maxWidth: 500
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#1e293b" }}>
              {selectedApplication?.status === "ADVISOR_APPROVED" ? "อนุมัติและนัดสัมภาษณ์" : "นัดสัมภาษณ์"}
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
              นักศึกษา: {selectedApplication.studentName || selectedApplication.fullName}
            </p>

            <form onSubmit={handleScheduleInterview}>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                    วันที่นัด <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    required
                    style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                    เวลา <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="time"
                    value={scheduleData.time}
                    onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                    required
                    style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                    สถานที่ <span style={{ color: "#EF4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={scheduleData.location}
                    onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                    required
                    placeholder="เช่น ห้องประชุมชั้น 3, หรือ Online (Zoom/Google Meet)"
                    style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    style={{ padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, background: "transparent", border: "1px solid #E2E8F0", cursor: "pointer" }}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    style={{ padding: "12px 32px", borderRadius: 8, fontWeight: 600, fontSize: 14, background: "#7C3AED", color: "white", border: "none", cursor: "pointer" }}
                  >
                    <i className="fas fa-calendar-check" style={{ marginRight: 8 }}></i> ยืนยันนัดสัมภาษณ์
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
