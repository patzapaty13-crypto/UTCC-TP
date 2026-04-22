"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const STATUS_CFG = {
  DRAFT: { label: "ร่าง", cls: "badge-gray", icon: "edit" },
  SUBMITTED: { label: "ส่งแล้ว", cls: "badge-blue", icon: "paper-plane" },
  UNDER_REVIEW: { label: "กำลังตรวจ", cls: "badge-yellow", icon: "eye" },
  GRADED: { label: "ตรวจแล้ว", cls: "badge-green", icon: "check-circle" },
  NEEDS_REVISION: { label: "ต้องแก้ไข", cls: "badge-orange", icon: "exclamation-triangle" }
};

const REPORT_TYPES = {
  WEEKLY: { label: "รายสัปดาห์", icon: "calendar-week", color: "var(--primary)" },
  MONTHLY: { label: "รายเดือน", icon: "calendar-alt", color: "var(--purple)" },
  FINAL: { label: "สรุปผล", icon: "flag-checkered", color: "var(--success)" }
};

export default function StudentReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  
  // Modal
  const [selectedReport, setSelectedReport] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getReports();
      setReports(data || []);
    } catch (err) {
      setError("ไม่สามารถโหลดรายงานได้: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const token = localStorage.getItem("utcctp_token");
      const response = await fetch(api.downloadReportFile(reportId), {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      if (!response.ok) {
        throw new Error("ไม่สามารถดาวน์โหลดไฟล์ได้");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // Extract filename from header if possible, else default
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `report-${reportId}.pdf`;
      if (contentDisposition && contentDisposition.indexOf("filename=") !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลด: " + err.message);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Filter logic
  const filteredReports = reports.filter(report => {
    const title = report.title.toLowerCase();
    const company = report.company.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = !searchTerm || title.includes(searchLower) || company.includes(searchLower);
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    const matchesType = typeFilter === "ALL" || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Stats
  const stats = {
    total: reports.length,
    submitted: reports.filter(r => r.status === "SUBMITTED" || r.status === "UNDER_REVIEW" || r.status === "GRADED").length,
    graded: reports.filter(r => r.status === "GRADED").length,
    draft: reports.filter(r => r.status === "DRAFT").length,
    avgScore: reports.filter(r => r.score).reduce((sum, r) => sum + r.score, 0) / reports.filter(r => r.score).length || 0
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Internship Reports</p>
          <h1 className="page-title">รายงานฝึกงาน</h1>
          <p className="page-subtitle">จัดการและติดตามรายงานการฝึกงานของคุณ</p>
        </div>
        <div>
          <Link href="/student/reports/submit" className="btn btn-primary">
            <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
            ส่งรายงานใหม่
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Stats Cards */}
      {!loading && reports.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--primary-100)", color: "var(--primary)" }}>
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">รายงานทั้งหมด</p>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--blue-100)", color: "var(--blue)" }}>
              <i className="fas fa-paper-plane"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">ส่งแล้ว</p>
              <p className="stat-value">{stats.submitted}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--success-100)", color: "var(--success)" }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">ตรวจแล้ว</p>
              <p className="stat-value">{stats.graded}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: "var(--warning-100)", color: "var(--warning)" }}>
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <p className="stat-label">คะแนนเฉลี่ย</p>
              <p className="stat-value">{stats.avgScore > 0 ? stats.avgScore.toFixed(1) : "—"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && reports.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <i className="fas fa-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}></i>
              <input
                type="text"
                placeholder="ค้นหารายงาน, บริษัท..."
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

            {/* Type Filter */}
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
            >
              <option value="ALL">ทุกประเภท</option>
              {Object.entries(REPORT_TYPES).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>

            {/* Status Filter */}
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

          {/* Results count */}
          <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
            แสดง {filteredReports.length} จาก {reports.length} รายการ
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="data-table-wrap">
        {loading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }}></div>)}
          </div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-file-alt"></i></div>
            <h3>ยังไม่มีรายงาน</h3>
            <p>คุณยังไม่ได้ส่งรายงานฝึกงานใดๆ เริ่มต้นส่งรายงานแรกของคุณตอนนี้</p>
            <Link href="/student/reports/submit" className="btn btn-primary btn-lg" style={{ marginTop: 24, fontSize: 16, padding: "14px 28px" }}>
              <i className="fas fa-plus" style={{ marginRight: 10 }}></i>
              ส่งรายงานใหม่
            </Link>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-filter"></i></div>
            <h3>ไม่พบรายการที่ตรงกับเงื่อนไข</h3>
            <p>ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
            <button 
              className="btn btn-secondary" 
              onClick={() => { setSearchTerm(""); setStatusFilter("ALL"); setTypeFilter("ALL"); }}
              style={{ marginTop: 16 }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {filteredReports.map(report => {
              const statusCfg = STATUS_CFG[report.status] || { label: report.status, cls: "badge-gray", icon: "question" };
              const typeCfg = REPORT_TYPES[report.type] || { label: report.type, icon: "file", color: "var(--text-muted)" };
              
              return (
                <div key={report.id} className="card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                    {/* Type Icon */}
                    <div style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 12, 
                      background: typeCfg.color + "20", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <i className={`fas fa-${typeCfg.icon}`} style={{ color: typeCfg.color, fontSize: 18 }}></i>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                            {report.title}
                            {report.type === "WEEKLY" && (
                              <span style={{ 
                                marginLeft: 8, 
                                fontSize: 12, 
                                padding: "2px 8px", 
                                background: "var(--primary-100)", 
                                color: "var(--primary)",
                                borderRadius: 12,
                                fontWeight: 600
                              }}>
                                สัปดาห์ {report.weekNumber}
                              </span>
                            )}
                          </h4>
                          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>
                            <i className="fas fa-building" style={{ marginRight: 6 }}></i>
                            {report.company} - {report.position}
                          </p>
                        </div>
                        <span className={`badge ${statusCfg.cls}`}>
                          <i className={`fas fa-${statusCfg.icon}`} style={{ marginRight: 6 }}></i>
                          {statusCfg.label}
                        </span>
                      </div>

                      {/* Dates and Score */}
                      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 12 }}>
                        {report.submittedAt && (
                          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                            <i className="fas fa-paper-plane" style={{ marginRight: 6, color: "var(--text-muted)" }}></i>
                            ส่งเมื่อ: {new Date(report.submittedAt).toLocaleDateString("th-TH", { 
                              day: "numeric", 
                              month: "short", 
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </div>
                        )}
                        
                        {report.gradedAt && (
                          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                            <i className="fas fa-check-circle" style={{ marginRight: 6, color: "var(--success)" }}></i>
                            ตรวจเมื่อ: {new Date(report.gradedAt).toLocaleDateString("th-TH", { 
                              day: "numeric", 
                              month: "short", 
                              year: "numeric"
                            })}
                          </div>
                        )}

                        {report.score !== null && report.score !== undefined && (
                          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                            <i className="fas fa-star" style={{ marginRight: 6, color: "var(--warning)" }}></i>
                            คะแนน: <strong style={{ color: report.score >= 80 ? "var(--success)" : report.score >= 70 ? "var(--warning)" : "var(--error)" }}>
                              {report.score}/100
                            </strong>
                          </div>
                        )}
                      </div>

                      {/* Feedback */}
                      {report.feedback && (
                        <div style={{ 
                          padding: 12, 
                          background: "var(--success-50)", 
                          borderRadius: 8, 
                          border: "1px solid var(--success-200)",
                          marginBottom: 12
                        }}>
                          <p style={{ fontSize: 13, color: "var(--success)", fontWeight: 600, marginBottom: 4 }}>
                            <i className="fas fa-comment" style={{ marginRight: 6 }}></i>
                            ความคิดเห็นจากอาจารย์
                          </p>
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                            {report.feedback}
                          </p>
                        </div>
                      )}

                      {/* Attachments and Actions */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {report.attachments.length > 0 && (
                            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                              <i className="fas fa-paperclip" style={{ marginRight: 6 }}></i>
                              {report.attachments.length} ไฟล์แนบ
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 8 }}>
                          {report.status === "DRAFT" && (
                            <Link 
                              href={`/student/reports/edit/${report.id}`}
                              className="btn btn-ghost btn-sm"
                            >
                              <i className="fas fa-edit" style={{ marginRight: 6 }}></i>
                            แก้ไข
                          </Link>
                          )}
                          
                          <button className="btn btn-ghost btn-sm" onClick={() => setSelectedReport(report)}>
                            <i className="fas fa-eye" style={{ marginRight: 6 }}></i>
                            ดูรายละเอียด
                          </button>

                          {report.attachments.length > 0 && (
                            <button className="btn btn-ghost btn-sm" onClick={() => handleDownload(report.id)}>
                              <i className="fas fa-download" style={{ marginRight: 6 }}></i>
                              ดาวน์โหลด
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedReport && (
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e293b" }}>
                รายละเอียดรายงาน
              </h2>
              <button onClick={() => setSelectedReport(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{selectedReport.title}</h4>
              <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                {REPORT_TYPES[selectedReport.type]?.label} {selectedReport.type === "WEEKLY" && `สัปดาห์ที่ ${selectedReport.weekNumber}`}
              </p>
            </div>

            <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 16, border: "1px solid var(--border)" }}>
              <h5 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>เนื้อหารายงาน</h5>
              <p style={{ fontSize: 14, whiteSpace: "pre-wrap", color: "#334155", margin: 0 }}>{selectedReport.content || "ไม่มีเนื้อหา"}</p>
            </div>

            {selectedReport.achievements && (
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 16, border: "1px solid var(--border)" }}>
                <h5 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>ผลงานที่สำเร็จ</h5>
                <p style={{ fontSize: 14, whiteSpace: "pre-wrap", color: "#334155", margin: 0 }}>{selectedReport.achievements}</p>
              </div>
            )}

            {selectedReport.challenges && (
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 16, border: "1px solid var(--border)" }}>
                <h5 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>ปัญหาและอุปสรรค</h5>
                <p style={{ fontSize: 14, whiteSpace: "pre-wrap", color: "#334155", margin: 0 }}>{selectedReport.challenges}</p>
              </div>
            )}

            {selectedReport.learnings && (
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 16, border: "1px solid var(--border)" }}>
                <h5 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>สิ่งที่ได้เรียนรู้</h5>
                <p style={{ fontSize: 14, whiteSpace: "pre-wrap", color: "#334155", margin: 0 }}>{selectedReport.learnings}</p>
              </div>
            )}

            {selectedReport.type === "WEEKLY" && selectedReport.nextWeekPlan && (
              <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, marginBottom: 16, border: "1px solid var(--border)" }}>
                <h5 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>แผนสัปดาห์หน้า</h5>
                <p style={{ fontSize: 14, whiteSpace: "pre-wrap", color: "#334155", margin: 0 }}>{selectedReport.nextWeekPlan}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              {selectedReport.attachments?.length > 0 && (
                <button
                  onClick={() => handleDownload(selectedReport.id)}
                  className="btn btn-primary"
                  style={{ padding: "10px 20px" }}
                >
                  <i className="fas fa-download" style={{ marginRight: 8 }}></i> ดาวน์โหลดไฟล์
                </button>
              )}
              <button
                onClick={() => setSelectedReport(null)}
                className="btn btn-ghost"
                style={{ padding: "10px 20px" }}
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}