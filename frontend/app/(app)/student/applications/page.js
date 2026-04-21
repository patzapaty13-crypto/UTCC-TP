"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

const STATUS_CONFIG = {
  PENDING: { label: "รอพิจารณา", color: "#F59E0B", bg: "#FFFBEB", icon: "clock" },
  REVIEWING: { label: "กำลังพิจารณา", color: "#3B82F6", bg: "#EFF6FF", icon: "eye" },
  SHORTLISTED: { label: "ผ่านรอบแรก", color: "#8B5CF6", bg: "#F5F3FF", icon: "star" },
  INTERVIEW: { label: "นัดสัมภาษณ์", color: "#06B6D4", bg: "#ECFEFF", icon: "calendar-check" },
  OFFERED: { label: "ได้รับ Offer", color: "#10B981", bg: "#ECFDF5", icon: "check-circle" },
  ACCEPTED: { label: "ตอบรับแล้ว", color: "#059669", bg: "#D1FAE5", icon: "check-double" },
  REJECTED: { label: "ไม่ผ่าน", color: "#EF4444", bg: "#FEF2F2", icon: "times-circle" },
  WITHDRAWN: { label: "ถอนใบสมัคร", color: "#6B7280", bg: "#F9FAFB", icon: "ban" },
};

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");

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

  const handleWithdraw = async () => {
    if (!selectedApp || !withdrawReason.trim()) {
      alert("กรุณาระบุเหตุผลในการถอนใบสมัคร");
      return;
    }

    try {
      await api.put(`/applications/${selectedApp.id}/withdraw`, { reason: withdrawReason });
      alert("ถอนใบสมัครสำเร็จ");
      setShowWithdrawModal(false);
      setWithdrawReason("");
      setSelectedApp(null);
      loadApplications();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.message || ""));
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === "ALL") return true;
    if (filter === "ACTIVE") return !["REJECTED", "WITHDRAWN", "ACCEPTED"].includes(app.status);
    if (filter === "COMPLETED") return ["ACCEPTED", "REJECTED", "WITHDRAWN"].includes(app.status);
    return app.status === filter;
  });

  const activeCount = applications.filter(a => !["REJECTED", "WITHDRAWN", "ACCEPTED"].includes(a.status)).length;
  const completedCount = applications.filter(a => ["ACCEPTED", "REJECTED", "WITHDRAWN"].includes(a.status)).length;

  return (
    <RoleDashboardShell role="STUDENT" title="ใบสมัครของฉัน" subtitle="ติดตามสถานะการสมัครและขั้นตอนการคัดเลือก">
      {/* Filter Tabs */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <FilterButton
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            icon="list"
            label="ทั้งหมด"
            count={applications.length}
          />
          <FilterButton
            active={filter === "ACTIVE"}
            onClick={() => setFilter("ACTIVE")}
            icon="spinner"
            label="กำลังดำเนินการ"
            count={activeCount}
            color="#3B82F6"
          />
          <FilterButton
            active={filter === "COMPLETED"}
            onClick={() => setFilter("COMPLETED")}
            icon="check"
            label="เสร็จสิ้น"
            count={completedCount}
            color="#059669"
          />
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลดใบสมัคร...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: 36,
            color: "#9CA3AF"
          }}>
            <i className="fas fa-inbox"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>ไม่มีใบสมัคร</h3>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            {filter === "ALL" ? "คุณยังไม่ได้สมัครตำแหน่งใดๆ" : `ไม่มีใบสมัครในหมวด "${filter}"`}
          </p>
          {filter === "ALL" && (
            <Link href="/internships" className="btn btn-primary">
              <i className="fas fa-search" style={{ marginRight: 8 }}></i>
              ค้นหาตำแหน่งฝึกงาน
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onViewDetails={() => setSelectedApp(app)}
              onWithdraw={() => {
                setSelectedApp(app);
                setShowWithdrawModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && !showWithdrawModal && (
        <Modal onClose={() => setSelectedApp(null)}>
          <ApplicationDetailModal
            application={selectedApp}
            onClose={() => setSelectedApp(null)}
            onWithdraw={() => setShowWithdrawModal(true)}
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
function ApplicationCard({ application, onViewDetails, onWithdraw }) {
  const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.PENDING;
  const canWithdraw = ["PENDING", "REVIEWING"].includes(application.status);

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
            <span
              style={{
                padding: "4px 12px",
                background: statusConfig.bg,
                color: statusConfig.color,
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <i className={`fas fa-${statusConfig.icon}`}></i>
              {statusConfig.label}
            </span>
          </div>

          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 12 }}>
            <i className="fas fa-building" style={{ marginRight: 8, color: "#6B7280" }}></i>
            {application.companyName || "บริษัท"}
          </p>

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

        <div style={{ display: "flex", gap: 8 }}>
          {canWithdraw && (
            <button
              className="btn btn-outline"
              onClick={(e) => {
                e.stopPropagation();
                onWithdraw();
              }}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                color: "#EF4444",
                borderColor: "#FEE2E2"
              }}
            >
              <i className="fas fa-ban" style={{ marginRight: 6 }}></i>
              ถอนใบสมัคร
            </button>
          )}
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
        </div>
      </div>
    </div>
  );
}

// Application Detail Modal Component
function ApplicationDetailModal({ application, onClose, onWithdraw }) {
  const statusConfig = STATUS_CONFIG[application.status] || STATUS_CONFIG.PENDING;
  const canWithdraw = ["PENDING", "REVIEWING"].includes(application.status);

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

      {/* Status Timeline */}
      <div style={{
        padding: 24,
        background: statusConfig.bg,
        border: `2px solid ${statusConfig.color}30`,
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

        {/* Timeline */}
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${statusConfig.color}20` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>ประวัติการดำเนินการ</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <TimelineItem
              icon="paper-plane"
              label="ส่งใบสมัคร"
              date={application.appliedAt}
              active
            />
            {application.status !== "PENDING" && (
              <TimelineItem
                icon="eye"
                label="บริษัทเปิดดูใบสมัคร"
                date={application.reviewedAt}
                active
              />
            )}
            {["SHORTLISTED", "INTERVIEW", "OFFERED", "ACCEPTED"].includes(application.status) && (
              <TimelineItem
                icon="star"
                label="ผ่านรอบแรก"
                date={application.shortlistedAt}
                active
              />
            )}
            {["INTERVIEW", "OFFERED", "ACCEPTED"].includes(application.status) && (
              <TimelineItem
                icon="calendar-check"
                label="นัดสัมภาษณ์"
                date={application.interviewAt}
                active
              />
            )}
            {["OFFERED", "ACCEPTED"].includes(application.status) && (
              <TimelineItem
                icon="check-circle"
                label="ได้รับ Offer"
                date={application.offeredAt}
                active
              />
            )}
            {application.status === "ACCEPTED" && (
              <TimelineItem
                icon="check-double"
                label="ตอบรับ Offer"
                date={application.acceptedAt}
                active
              />
            )}
          </div>
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
        {canWithdraw && (
          <button
            className="btn btn-outline"
            onClick={onWithdraw}
            style={{ color: "#EF4444", borderColor: "#FEE2E2" }}
          >
            <i className="fas fa-ban" style={{ marginRight: 8 }}></i>
            ถอนใบสมัคร
          </button>
        )}
        <button className="btn btn-primary" onClick={onClose}>
          ปิด
        </button>
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({ icon, label, date, active }) {
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
