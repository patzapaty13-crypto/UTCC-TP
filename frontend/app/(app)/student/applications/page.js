"use client";

import { useEffect, useState, useCallback } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import ActionButton from "@/components/ActionButton";
import StatusBadge, { StatusBadgeWithCount } from "@/components/StatusBadge";
import NextStepGuidance, { StudentGuidance, InlineNextStepGuidance } from "@/components/NextStepGuidance";
import { ApplicationFilters } from "@/components/SmartFilters";
import { ApplicationTable } from "@/components/ExpandableTable";
import { NoApplications, NoSearchResults } from "@/components/EmptyState";
import { api } from "@/lib/api";
import Link from "next/link";
import { getStatusConfig, STATUS_CONFIG } from "@/lib/statusConfig";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await api.getApplications();
      setApplications(data || []);
      setFilteredApplications(data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle smart filter changes
  const handleFilterChange = useCallback((filtered, filterState) => {
    setFilteredApplications(filtered);
    setSearchTerm(filterState.searchTerm || "");
  }, []);

  const loadTimeline = async (applicationId) => {
    setTimelineLoading(true);
    try {
      const data = await api.getApplicationTimeline(applicationId);
      setSelectedTimeline(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load timeline:", err);
      setSelectedTimeline([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  const handleWithdraw = async (actionData) => {
    try {
      const { applicationId, reason } = actionData;
      await api.withdrawApplication(applicationId, reason);
      alert("ถอนใบสมัครสำเร็จ");
      setShowWithdrawModal(false);
      setWithdrawReason("");
      setSelectedApp(null);
      loadApplications();
    } catch (err) {
      throw new Error(err.message || "ไม่สามารถถอนใบสมัครได้");
    }
  };

  const handleApplicationAction = async (actionData) => {
    try {
      const { applicationId, action, reason, data } = actionData;
      
      if (action === "WITHDRAWN") {
        return handleWithdraw(actionData);
      }

      // Other actions (VIEW_OFFER, VIEW_INTERVIEW, etc.) are handled by their respective pages
      // (/student/offers, /student/interviews) via navigation links in the ActionButton component
      console.log("Application action:", action, data);

    } catch (err) {
      console.error("Application action failed:", err);
      throw err;
    }
  };

  const normalizeStatus = (status) => {
    if (status === "APPROVED") return "ACCEPTED";
    if (status === "INTERVIEW") return "INTERVIEW_SCHEDULED";
    if (status === "OFFERED") return "OFFER_EXTENDED";
    return status;
  };

  return (
    <RoleDashboardShell role="STUDENT" title="ใบสมัครของฉัน" subtitle="ติดตามสถานะการสมัครและขั้นตอนการคัดเลือก">
      {/* Next Step Guidance */}
      {applications.length > 0 && (
        <StudentGuidance application={{ status: "PENDING" }} />
      )}

      {/* Smart Filters */}
      <ApplicationFilters 
        applications={applications}
        onFilter={handleFilterChange}
      />

      {/* Applications Table */}
      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลดใบสมัคร...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        searchTerm ? (
          <NoSearchResults 
            searchTerm={searchTerm}
            onClearSearch={() => {
              setSearchTerm("");
              setFilteredApplications(applications);
            }}
          />
        ) : (
          <NoApplications userRole="STUDENT" />
        )
      ) : (
        <ApplicationTable
          applications={filteredApplications}
          onStatusChange={handleApplicationAction}
          userRole="STUDENT"
        />
      )}

      {/* Application Detail Modal */}
      {selectedApp && !showWithdrawModal && (
        <Modal onClose={() => setSelectedApp(null)}>
          <ApplicationDetailModal
            application={selectedApp}
            timeline={selectedTimeline}
            timelineLoading={timelineLoading}
            onClose={() => setSelectedApp(null)}
            onAction={handleApplicationAction}
          />
        </Modal>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && selectedApp && (
        <Modal onClose={() => {
          setShowWithdrawModal(false);
          setWithdrawReason("");
        }}>
          <div style={{ padding: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
              <i className="fas fa-exclamation-triangle" style={{ color: "#F59E0B", marginRight: 12 }}></i>
              ยืนยันการถอนใบสมัคร
            </h2>
            <p className="text-muted" style={{ marginBottom: 24 }}>
              คุณแน่ใจหรือไม่ว่าต้องการถอนใบสมัครตำแหน่ง "{selectedApp.positionTitle}"
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: "block" }}>
                เหตุผลในการถอนใบสมัคร *
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="กรุณาระบุเหตุผล..."
                value={withdrawReason}
                onChange={(e) => setWithdrawReason(e.target.value)}
                style={{
                  padding: 14,
                  fontSize: 14,
                  border: "2px solid var(--n-200)",
                  borderRadius: 12
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawReason("");
                }}
              >
                ยกเลิก
              </button>
              <button
                className="btn"
                onClick={handleWithdraw}
                style={{
                  background: "#EF4444",
                  color: "white",
                  border: "none"
                }}
              >
                <i className="fas fa-ban" style={{ marginRight: 8 }}></i>
                ยืนยันถอนใบสมัคร
              </button>
            </div>
          </div>
        </Modal>
      )}
    </RoleDashboardShell>
  );
}

// Filter Button Component
function FilterButton({ active, onClick, icon, label, count, color = "#2563EB" }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        background: active ? color : "transparent",
        color: active ? "white" : "var(--text-secondary)",
        border: active ? "none" : "1px solid var(--border)",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--n-50)";
          e.currentTarget.style.borderColor = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = "var(--border)";
        }
      }}
    >
      <i className={`fas fa-${icon}`}></i>
      {label}
      <span style={{
        padding: "2px 8px",
        background: active ? "rgba(255,255,255,0.2)" : color + "20",
        color: active ? "white" : color,
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 800
      }}>
        {count}
      </span>
    </button>
  );
}

// Application Card Component
function ApplicationCard({ application, onViewDetails, onAction }) {
  const status = normalizeStatus(application.status);
  const statusConfig = getStatusConfig(status);
  const canWithdraw = ["PENDING", "REVIEWING"].includes(status);

  return (
    <div
      className="card"
      style={{
        padding: 24,
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative"
      }}
      onClick={onViewDetails}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
              {application.positionTitle || "ตำแหน่งงาน"}
            </h3>
            <StatusBadge status={status} size="md" />
          </div>

          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
            <i className="fas fa-building" style={{ marginRight: 8, color: "#6B7280" }}></i>
            {application.companyName || "บริษัท"}
          </p>

          {/* Next Step Guidance */}
          <div style={{ marginBottom: 12 }}>
            <InlineNextStepGuidance 
              application={{ ...application, status }} 
              userRole="STUDENT" 
            />
          </div>

          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)" }}>
            <span>
              <i className="fas fa-calendar" style={{ marginRight: 6 }}></i>
              สมัครเมื่อ {new Date(application.appliedAt || Date.now()).toLocaleDateString("th-TH")}
            </span>
            {application.updatedAt && (
              <span>
                <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
                อัปเดตล่าสุด {new Date(application.updatedAt).toLocaleDateString("th-TH")}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            <i className="fas fa-eye" style={{ marginRight: 6 }}></i>
            ดูรายละเอียด
          </button>
          
          <ActionButton
            application={{ ...application, status }}
            userRole="STUDENT"
            onAction={onAction}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

// Application Detail Modal Component
function ApplicationDetailModal({ application, timeline, timelineLoading, onClose, onAction }) {
  const status = normalizeStatus(application.status);
  const statusConfig = getStatusConfig(status);

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>
            {application.positionTitle}
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
            <i className="fas fa-building" style={{ marginRight: 8 }}></i>
            {application.companyName}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            fontSize: 24,
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: 8
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Status and Next Step Guidance */}
      <div style={{
        padding: 24,
        backgroundColor: statusConfig.bgColor,
        border: `2px solid ${statusConfig.borderColor}`,
        borderRadius: 16,
        marginBottom: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: statusConfig.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 20
          }}>
            <i className={`fas fa-${statusConfig.icon}`}></i>
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: statusConfig.color, marginBottom: 4 }}>
              {statusConfig.label}
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              สถานะปัจจุบัน
            </p>
          </div>
        </div>

        {/* Next Step Guidance */}
        <InlineNextStepGuidance 
          application={{ ...application, status }} 
          userRole="STUDENT" 
        />

        {/* Timeline */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${statusConfig.color}20` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>ประวัติการดำเนินการ</h4>
          {timelineLoading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ height: 44, borderRadius: 12 }} />
              ))}
            </div>
          ) : timeline.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {timeline.map((item) => (
                <TimelineItem
                  key={item.id}
                  icon="circle-check"
                  label={item.statusLabel || `${item.oldStatus || "START"} → ${item.newStatus || "UNKNOWN"}`}
                  date={item.createdAt}
                  active
                  note={item.note}
                  changedBy={item.changedBy}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <TimelineItem icon="paper-plane" label="ส่งใบสมัคร" date={application.appliedAt} active />
              {status !== "PENDING" && (
                <TimelineItem icon="eye" label="บริษัทเปิดดูใบสมัคร" date={application.reviewedAt} active />
              )}
              {["SHORTLISTED", "INTERVIEW", "INTERVIEW_SCHEDULED", "OFFERED", "OFFER_EXTENDED", "ACCEPTED"].includes(status) && (
                <TimelineItem icon="star" label="ผ่านรอบแรก" date={application.shortlistedAt} active />
              )}
              {["INTERVIEW", "INTERVIEW_SCHEDULED", "OFFERED", "OFFER_EXTENDED", "ACCEPTED"].includes(status) && (
                <TimelineItem icon="calendar-check" label="นัดสัมภาษณ์" date={application.interviewAt} active />
              )}
              {["OFFERED", "OFFER_EXTENDED", "ACCEPTED"].includes(status) && (
                <TimelineItem icon="check-circle" label="ได้รับ Offer" date={application.offeredAt} active />
              )}
              {status === "ACCEPTED" && (
                <TimelineItem icon="check-double" label="ตอบรับ Offer" date={application.acceptedAt} active />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Details */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>ข้อมูลใบสมัคร</h3>
        <div style={{ display: "grid", gap: 16 }}>
          <InfoRow label="วันที่สมัคร" value={new Date(application.appliedAt || Date.now()).toLocaleString("th-TH")} />
          <InfoRow label="GPA" value={application.gpa || "-"} />
          <InfoRow label="สาขาวิชา" value={application.major || "-"} />
          <InfoRow label="ชั้นปี" value={application.year ? `ปี ${application.year}` : "-"} />
          <InfoRow label="ขั้นตอนถัดไป" value={application.nextStepTitle || "ตรวจสอบสถานะ"} />
          <div style={{ padding: 16, borderRadius: 12, background: "var(--n-50)", border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>คำแนะนำขั้นถัดไป</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-primary)" }}>
              {application.nextStepDescription || "ระบบจะแสดงคำแนะนำเมื่อมีการอัปเดตสถานะ"}
            </p>
          </div>
          {application.coverLetter && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
                จดหมายสมัครงาน
              </p>
              <div style={{
                padding: 16,
                background: "var(--n-50)",
                borderRadius: 12,
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: "pre-wrap"
              }}>
                {application.coverLetter}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        {status === "INTERVIEW_SCHEDULED" && (
          <Link
            href="/student/interviews"
            style={{
              padding: "10px 20px",
              background: "#7C3AED",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <i className="fas fa-calendar-check"></i>
            ดูรายละเอียดนัดสัมภาษณ์
          </Link>
        )}
        <ActionButton
          application={{ ...application, status }}
          userRole="STUDENT"
          onAction={onAction}
          layout="horizontal"
        />
        <button className="btn btn-primary" onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ icon, label, date, active, note, changedBy }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: active ? 1 : 0.4 }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: active ? "#10B981" : "#E5E7EB",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: 14,
        flexShrink: 0
      }}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{label}</p>
        {date && (
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {new Date(date).toLocaleString("th-TH")}
          </p>
        )}
        {(changedBy || note) && (
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
            {changedBy ? `โดย ${changedBy}` : ""}{changedBy && note ? " · " : ""}{note || ""}
          </p>
        )}
      </div>
    </div>
  );
}

// Info Row Component
function InfoRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}

// Modal Component
function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "90vw",
          maxHeight: "90vh",
          overflow: "auto",
          animation: "scaleIn 0.2s ease"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
