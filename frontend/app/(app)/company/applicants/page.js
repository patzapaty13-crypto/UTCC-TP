"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

const STATUS_CFG = {
  PENDING: { label: "รอตรวจสอบ", cls: "badge-yellow", icon: "clock" },
  REVIEWING: { label: "กำลังพิจารณา", cls: "badge-blue", icon: "eye" },
  INTERVIEW_SCHEDULED: { label: "นัดสัมภาษณ์", cls: "badge-purple", icon: "calendar-check" },
  OFFER_EXTENDED: { label: "เสนอสัญญา", cls: "badge-indigo", icon: "file-signature" },
  ACCEPTED: { label: "ตอบรับแล้ว", cls: "badge-green", icon: "check-circle" },
  REJECTED: { label: "ปฏิเสธ", cls: "badge-red", icon: "times-circle" },
};

export default function CompanyApplicantsPage() {
  const [applications, setApplications] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Selected application for detail view
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apps, pos] = await Promise.all([
        api.getApplications(),
        api.getInternships()
      ]);
      setApplications(apps || []);
      setPositions(pos || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.updateApplicationStatus(appId, { status: newStatus });
      await loadData();
      alert("อัปเดตสถานะสำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesPosition = positionFilter === "ALL" || app.internshipPositionId === parseInt(positionFilter);
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesSearch = !searchTerm || 
      (app.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.major || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPosition && matchesStatus && matchesSearch;
  });

  // Group by status for kanban view
  const groupedByStatus = {
    PENDING: filteredApps.filter(a => a.status === "PENDING"),
    REVIEWING: filteredApps.filter(a => a.status === "REVIEWING"),
    INTERVIEW_SCHEDULED: filteredApps.filter(a => a.status === "INTERVIEW_SCHEDULED"),
    OFFER_EXTENDED: filteredApps.filter(a => a.status === "OFFER_EXTENDED"),
    ACCEPTED: filteredApps.filter(a => a.status === "ACCEPTED"),
    REJECTED: filteredApps.filter(a => a.status === "REJECTED"),
  };

  return (
    <RoleDashboardShell 
      role="COMPANY" 
      title="ผู้สมัครงาน" 
      subtitle="จัดการและติดตามสถานะผู้สมัครทั้งหมด"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <i className="fas fa-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}></i>
            <input
              type="text"
              placeholder="ค้นหาชื่อ, อีเมล, สาขา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px 14px 10px 40px", 
                border: "1px solid var(--border)", 
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>

          <select 
            value={positionFilter} 
            onChange={(e) => setPositionFilter(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
          >
            <option value="ALL">ทุกตำแหน่ง</option>
            {positions.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
          >
            <option value="ALL">ทุกสถานะ</option>
            {Object.entries(STATUS_CFG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
          แสดง {filteredApps.length} จาก {applications.length} รายการ
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }}></div>)}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-inbox"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>ยังไม่มีผู้สมัคร</h3>
          <p style={{ color: "var(--text-muted)" }}>
            {searchTerm || positionFilter !== "ALL" || statusFilter !== "ALL" 
              ? "ไม่พบผู้สมัครที่ตรงกับเงื่อนไข" 
              : "ยังไม่มีใครสมัครงานของคุณ"}
          </p>
        </div>
      ) : (
        <>
          {/* Kanban View */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, overflowX: "auto" }}>
            {Object.entries(groupedByStatus).map(([status, apps]) => {
              const cfg = STATUS_CFG[status];
              return (
                <div key={status} className="card" style={{ padding: 16, minHeight: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <i className={`fas fa-${cfg.icon}`} style={{ color: `var(--${cfg.cls.replace('badge-', '')})` }}></i>
                      <h3 style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>{cfg.label}</h3>
                    </div>
                    <span className={`badge ${cfg.cls}`} style={{ fontSize: 12 }}>{apps.length}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {apps.map(app => (
                      <div 
                        key={app.id}
                        onClick={() => { setSelectedApp(app); setShowDetail(true); }}
                        style={{ 
                          padding: 12, 
                          background: "var(--n-50)", 
                          borderRadius: 10,
                          border: "1px solid var(--n-200)",
                          cursor: "pointer",
                          transition: "all var(--transition)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                      >
                        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                          {app.studentName || app.fullName || "ไม่ระบุชื่อ"}
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4 }}>
                          <i className="fas fa-briefcase" style={{ marginRight: 5 }}></i>
                          {app.positionTitle || "ไม่ระบุตำแหน่ง"}
                        </p>
                        {app.gpa && (
                          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            <i className="fas fa-graduation-cap" style={{ marginRight: 5 }}></i>
                            GPA: {app.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Detail Modal */}
      {showDetail && selectedApp && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowDetail(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 700, padding: 40, position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
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
              <span className={`badge ${STATUS_CFG[selectedApp.status]?.cls || 'badge-gray'}`} style={{ fontSize: 14, padding: "8px 16px" }}>
                <i className={`fas fa-${STATUS_CFG[selectedApp.status]?.icon || 'circle'}`} style={{ marginRight: 8 }}></i>
                {STATUS_CFG[selectedApp.status]?.label || selectedApp.status}
              </span>
            </div>

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
              {selectedApp.status === "PENDING" && (
                <>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => handleStatusChange(selectedApp.id, "REVIEWING")}
                  >
                    <i className="fas fa-eye" style={{ marginRight: 8 }}></i>
                    เริ่มพิจารณา
                  </button>
                  <button 
                    className="btn btn-error" 
                    style={{ flex: 1 }}
                    onClick={() => handleStatusChange(selectedApp.id, "REJECTED")}
                  >
                    <i className="fas fa-times" style={{ marginRight: 8 }}></i>
                    ปฏิเสธ
                  </button>
                </>
              )}
              {selectedApp.status === "REVIEWING" && (
                <>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1 }}
                    onClick={() => handleStatusChange(selectedApp.id, "INTERVIEW_SCHEDULED")}
                  >
                    <i className="fas fa-calendar-check" style={{ marginRight: 8 }}></i>
                    นัดสัมภาษณ์
                  </button>
                  <button 
                    className="btn btn-error" 
                    style={{ flex: 1 }}
                    onClick={() => handleStatusChange(selectedApp.id, "REJECTED")}
                  >
                    <i className="fas fa-times" style={{ marginRight: 8 }}></i>
                    ปฏิเสธ
                  </button>
                </>
              )}
              {selectedApp.status === "INTERVIEW_SCHEDULED" && (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={() => handleStatusChange(selectedApp.id, "OFFER_EXTENDED")}
                >
                  <i className="fas fa-file-signature" style={{ marginRight: 8 }}></i>
                  ส่ง Offer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </RoleDashboardShell>
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
