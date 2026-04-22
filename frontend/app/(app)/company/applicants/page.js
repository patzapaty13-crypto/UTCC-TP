"use client";

import { useEffect, useState, useCallback } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import ActionButton from "@/components/ActionButton";
import StatusBadge, { StatusBadgeWithCount } from "@/components/StatusBadge";
import NextStepGuidance, { CompanyGuidance, InlineNextStepGuidance, ProgressTimeline, StatusSummary } from "@/components/NextStepGuidance";
import { StatusLegendButton } from "@/components/StatusLegend";
import { LoadingSpinner, LoadingButton, SkeletonTable } from "@/components/Loading";
import { useToast } from "@/components/Toast";
import BackButton from "@/components/BackButton";
import { ResponsiveView, ApplicationCard, CardGrid } from "@/components/CardView";
import { ApplicationFilters } from "@/components/SmartFilters";
import { ApplicationTable } from "@/components/ExpandableTable";
import { NoApplications, NoSearchResults } from "@/components/EmptyState";
import { api } from "@/lib/api";
import { getStatusConfig, STATUS_CONFIG } from "@/lib/statusConfig";

export default function CompanyApplicantsPage() {
  const [applications, setApplications] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selected application for detail view
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, pos] = await Promise.all([
        api.getApplications(),
        api.getInternships()
      ]);
      setApplications(apps || []);
      setPositions(pos || []);
      setFilteredApplications(apps || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle smart filter changes
  const handleFilterChange = useCallback((filtered, filterState) => {
    setFilteredApplications(filtered);
    setSearchTerm(filterState.searchTerm || "");
  }, []);

  const handleStatusChange = async (actionData) => {
    const loadingToast = toast.loading("กำลังอัปเดตสถานะ...");
    
    try {
      const { applicationId, action, reason, data } = actionData;
      
      // If it's a status change
      if (action && action !== action.toUpperCase()) {
        // Non-status actions (like VIEW_INTERVIEW, etc.) are handled by their respective pages
        // (/company/interviews, etc.) via navigation links in the ActionButton component
        console.log("Non-status action:", action, data);
        toast.dismiss(loadingToast);
        return;
      }
      
      // Status change
      const payload = { 
        status: action,
        ...(reason && { reason }),
        ...(data && { ...data })
      };
      
      await api.updateApplicationStatus(applicationId, payload);
      await loadData();
      
      toast.dismiss(loadingToast);
      toast.success("อัปเดตสถานะสำเร็จ");
    } catch (e) {
      console.error("Status change failed:", e);
      toast.dismiss(loadingToast);
      toast.error(e.message || "ไม่สามารถอัปเดตสถานะได้");
      throw e;
    }
  };

  const openResume = async (app) => {
    const userId = app.studentId || app.student_id || app.userId;
    if (!userId) {
      toast.error("ไม่พบข้อมูลผู้สมัครสำหรับเปิด Resume");
      return;
    }

    setSelectedApp(app);
    setShowResume(true);
    setResumeLoading(true);
    setResumeData(null);
    
    try {
      const data = await api.getUserResume(userId);
      setResumeData(data || null);
    } catch (e) {
      setResumeData(null);
      let message = "ไม่สามารถดึงข้อมูล Resume ได้";
      if (e.message.includes("Access Denied") || e.message.includes("403") || e.message.includes("Forbidden")) {
        message = "คุณไม่มีสิทธิ์ดู Resume นี้ กรุณาติดต่อผู้ดูแลระบบ";
      } else if (e.message.includes("404") || e.message.includes("not found")) {
        message = "นักศึกษายังไม่ได้กรอกข้อมูล Resume";
      } else if (e.message.includes("401")) {
        message = "กรุณาเข้าสู่ระบบใหม่";
      } else {
        message = `ไม่สามารถโหลด Resume ได้: ${e.message}`;
      }
      toast.error(message);
    } finally {
      setResumeLoading(false);
    }
  };

  const filteredApps = filteredApplications.filter(app => {
    const normalizedStatus = app.status === "APPROVED" ? "ACCEPTED" : app.status;
    return true; // Smart filters handle all filtering now
  });

  // Group by status for kanban view
  const groupedByStatus = {
    PENDING: filteredApps.filter(a => (a.status === "APPROVED" ? "ACCEPTED" : a.status) === "PENDING"),
    REVIEWING: filteredApps.filter(a => (a.status === "APPROVED" ? "ACCEPTED" : a.status) === "REVIEWING"),
    INTERVIEW_SCHEDULED: filteredApps.filter(a => (a.status === "APPROVED" ? "ACCEPTED" : a.status) === "INTERVIEW_SCHEDULED"),
    OFFER_EXTENDED: filteredApps.filter(a => (a.status === "APPROVED" ? "ACCEPTED" : a.status) === "OFFER_EXTENDED"),
    ACCEPTED: filteredApps.filter(a => (a.status === "APPROVED" ? "ACCEPTED" : a.status) === "ACCEPTED"),
    REJECTED: filteredApps.filter(a => (a.status === "APPROVED" ? "ACCEPTED" : a.status) === "REJECTED"),
  };

  return (
    <RoleDashboardShell 
      role="COMPANY" 
      title="ผู้สมัครงาน" 
      subtitle="จัดการและติดตามสถานะผู้สมัครทั้งหมด"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Smart Filters */}
      <ApplicationFilters 
        applications={applications}
        onFilter={handleFilterChange}
      />

      {loading ? (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <SkeletonTable rows={5} columns={6} />
        </div>
      ) : filteredApps.length === 0 ? (
        searchTerm ? (
          <NoSearchResults 
            searchTerm={searchTerm}
            onClearSearch={() => {
              setSearchTerm("");
              setFilteredApplications(applications);
            }}
          />
        ) : (
          <NoApplications userRole="COMPANY" />
        )
      ) : (
        <>
          {/* Next Step Guidance */}
          <CompanyGuidance application={{ status: "PENDING" }} />

          {/* Expandable Table View */}
          <ApplicationTable
            applications={filteredApps}
            onStatusChange={handleStatusChange}
            userRole="COMPANY"
          />
        </>
      )}

      {/* Resume Modal */}
      {showResume && selectedApp && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(8px)",
          padding: 24,
        }} onClick={() => { setShowResume(false); setResumeData(null); }}>
          <div
            className="card"
            style={{
              width: "min(1100px, calc(100vw - 48px))",
              maxHeight: "calc(100vh - 48px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              borderRadius: 24,
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.25)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back Button */}
            <BackButton 
              onClick={() => { setShowResume(false); setResumeData(null); }}
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                zIndex: 10,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 16px rgba(15, 23, 42, 0.1)"
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, padding: "32px 32px 24px", borderBottom: "1px solid var(--n-200)", flexShrink: 0 }}>
              <div style={{ minWidth: 0, paddingRight: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Applicant Resume</p>
                <h2 style={{ fontSize: 24, fontWeight: 900, marginTop: 8, marginBottom: 0, lineHeight: 1.2, wordBreak: "break-word" }}>{selectedApp.studentName || selectedApp.fullName || "Resume"}</h2>
              </div>
              <button
                onClick={() => { setShowResume(false); setResumeData(null); }}
                style={{
                  background: "white",
                  border: "1px solid var(--n-200)",
                  borderRadius: 12,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: "var(--n-500)",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
                }}
              >
                <i className="fas fa-xmark"></i>
              </button>
            </div>

            <div style={{ padding: 28, overflowY: "auto", background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)", flex: 1 }}>
              {resumeLoading ? (
                <div style={{ display: "grid", gap: 16 }}>
                  <div className="skeleton" style={{ height: 120, borderRadius: 18 }} />
                  <div className="skeleton" style={{ height: 160, borderRadius: 18 }} />
                  <div className="skeleton" style={{ height: 100, borderRadius: 18 }} />
                </div>
              ) : resumeData ? (
                <div style={{ display: "grid", gap: 20 }}>
                  <div style={{ padding: 20, borderRadius: 18, background: "white", border: "1px solid var(--n-200)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 800 }}>Summary</p>
                        <p style={{ fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>{resumeData.summary || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
                    <ResumeSection title="Skills" icon="screwdriver-wrench" value={resumeData.skills} color="#2563EB" />
                    <ResumeSection title="Education" icon="graduation-cap" value={resumeData.education} color="#7C3AED" />
                  </div>

                  <ResumeSection title="Experience" icon="briefcase" value={resumeData.experience} color="#059669" multiline />

                  {resumeData.portfolioUrl && (
                    <div style={{ padding: 20, borderRadius: 18, background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                      <p style={{ fontSize: 12, fontWeight: 800, color: "#B45309", marginBottom: 8 }}>Portfolio / LinkedIn</p>
                      <a href={resumeData.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#92400E", fontWeight: 700, wordBreak: "break-all" }}>
                        {resumeData.portfolioUrl}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: 40 }}>
                  <div className="empty-state-icon"><i className="fas fa-file-lines"></i></div>
                  <h3>ไม่พบ Resume</h3>
                  <p>ผู้สมัครรายนี้ยังไม่มีข้อมูล Resume หรือระบบไม่สามารถโหลดได้</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetail && selectedApp && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowDetail(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 700, padding: 40, position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            {/* Back Button */}
            <BackButton 
              onClick={() => setShowDetail(false)}
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                zIndex: 10
              }}
            />
            
            <button
              onClick={() => setShowDetail(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 20, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>
              รายละเอียดผู้สมัคร
            </h2>

            {/* Status */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                สถานะปัจจุบัน
              </label>
              <StatusSummary 
                application={{ ...selectedApp, status: selectedApp.status === "APPROVED" ? "ACCEPTED" : selectedApp.status }} 
                userRole="COMPANY"
                showProgress={true}
              />
            </div>

            {/* Next Step Guidance */}
            <InlineNextStepGuidance 
              application={{ ...selectedApp, status: selectedApp.status === "APPROVED" ? "ACCEPTED" : selectedApp.status }} 
              userRole="COMPANY" 
            />

            {/* Personal Info */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>ข้อมูลส่วนตัว</h3>
              <div style={{ display: "grid", gap: 12 }}>
                <InfoRow label="ชื่อ-นามสกุล" value={selectedApp.studentName || selectedApp.fullName} icon="user" />
                <InfoRow label="อีเมล" value={selectedApp.email} icon="envelope" />
                <InfoRow label="เบอร์โทร" value={selectedApp.phone} icon="phone" />
                {selectedApp.address && <InfoRow label="ที่อยู่" value={selectedApp.address} icon="location-dot" />}
              </div>
            </div>

            {/* Academic Info */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>ข้อมูลการศึกษา</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {selectedApp.gpa && <InfoRow label="GPA" value={selectedApp.gpa} icon="graduation-cap" />}
                {selectedApp.major && <InfoRow label="สาขา" value={selectedApp.major} icon="book" />}
                {selectedApp.year && <InfoRow label="ชั้นปี" value={`ปี ${selectedApp.year}`} icon="calendar" />}
              </div>
            </div>

            {/* Cover Letter */}
            {selectedApp.coverLetter && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>จดหมายสมัครงาน</h3>
                <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, border: "1px solid var(--n-200)" }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {selectedApp.coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Portfolio */}
            {selectedApp.portfolioUrl && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Portfolio</h3>
                <a 
                  href={selectedApp.portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: "100%" }}
                >
                  <i className="fas fa-external-link" style={{ marginRight: 8 }}></i>
                  ดู Portfolio
                </a>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
              <ActionButton
                application={{ ...selectedApp, status: selectedApp.status === "APPROVED" ? "ACCEPTED" : selectedApp.status }}
                userRole="COMPANY"
                onAction={handleStatusChange}
                layout="horizontal"
              />
            </div>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}

function ResumeSection({ title, icon, value, color, multiline = false }) {
  return (
    <div style={{ padding: 20, borderRadius: 18, background: "white", border: "1px solid var(--n-200)" }}>
      <p style={{ fontSize: 12, fontWeight: 800, color, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
        <i className={`fas fa-${icon}`}></i>
        {title}
      </p>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-primary)", whiteSpace: multiline ? "pre-wrap" : "normal" }}>
        {value || "-"}
      </p>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  if (!value) return null;
  return (
    <div style={{ padding: 12, background: "var(--n-50)", borderRadius: 10, border: "1px solid var(--n-200)" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
        <i className={`fas fa-${icon}`} style={{ color: "var(--primary)" }}></i>
        {label}
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
        {value}
      </p>
    </div>
  );
}
