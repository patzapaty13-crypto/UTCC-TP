"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function AdvisorReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeForm, setGradeForm] = useState({
    grade: "",
    feedback: "",
  });
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const reps = await api.getReports();
      setReports(reps || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGrade = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      await api.gradeReport(selectedReport.id, gradeForm);
      setShowGradeModal(false);
      setSelectedReport(null);
      setGradeForm({ grade: "", feedback: "" });
      await loadData();
      alert("ให้คะแนนสำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const pendingReports = reports.filter(r => !r.grade);
  const gradedReports = reports.filter(r => r.grade);

  const filteredReports = statusFilter === "ALL" ? reports :
    statusFilter === "PENDING" ? pendingReports : gradedReports;

  return (
    <RoleDashboardShell 
      role="ADVISOR" 
      title="ตรวจรายงาน" 
      subtitle="ตรวจสอบและให้คะแนนรายงานฝึกงานของนักศึกษา"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-file-lines" style={{ marginRight: 6 }}></i>
            รายงานทั้งหมด
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>{reports.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            รอตรวจ
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--warning)" }}>{pendingReports.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }}></i>
            ตรวจแล้ว
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--success)" }}>{gradedReports.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-star" style={{ marginRight: 6 }}></i>
            คะแนนเฉลี่ย
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--success)" }}>
            {gradedReports.length > 0 
              ? (gradedReports.reduce((sum, r) => sum + (parseFloat(r.grade) || 0), 0) / gradedReports.length).toFixed(2)
              : "-"}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="card" style={{ padding: 20 }}>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, width: 200 }}
        >
          <option value="ALL">ทุกสถานะ</option>
          <option value="PENDING">รอตรวจ</option>
          <option value="GRADED">ตรวจแล้ว</option>
        </select>
      </div>

      {/* Pending Reports */}
      {pendingReports.length > 0 && (statusFilter === "ALL" || statusFilter === "PENDING") && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-clock" style={{ marginRight: 10, color: "var(--warning)" }}></i>
            รอตรวจ ({pendingReports.length})
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            {pendingReports.map(report => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onGrade={() => { setSelectedReport(report); setShowGradeModal(true); }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Graded Reports */}
      {gradedReports.length > 0 && (statusFilter === "ALL" || statusFilter === "GRADED") && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 10, color: "var(--success)" }}></i>
            ตรวจแล้ว ({gradedReports.length})
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            {gradedReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }}></div>)}
        </div>
      )}

      {!loading && filteredReports.length === 0 && (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-file-lines"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            {statusFilter === "PENDING" ? "ไม่มีรายงานรอตรวจ" : "ยังไม่มีรายงาน"}
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            {statusFilter === "PENDING" 
              ? "รายงานทั้งหมดได้รับการตรวจแล้ว" 
              : "เมื่อนักศึกษาส่งรายงาน จะแสดงที่นี่"}
          </p>
        </div>
      )}

      {/* Grade Modal */}
      {showGradeModal && selectedReport && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowGradeModal(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 600, padding: 32, position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowGradeModal(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 18, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>
              <i className="fas fa-star" style={{ marginRight: 10, color: "var(--warning)" }}></i>
              ให้คะแนนรายงาน
            </h2>

            <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {selectedReport.studentName || "ไม่ระบุชื่อ"}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {selectedReport.title || "รายงานฝึกงาน"}
              </p>
            </div>

            {/* Report Content Preview */}
            {selectedReport.content && (
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>เนื้อหารายงาน</h4>
                <div style={{ 
                  padding: 16, 
                  background: "var(--n-50)", 
                  borderRadius: 12, 
                  maxHeight: 200, 
                  overflowY: "auto",
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap"
                }}>
                  {selectedReport.content}
                </div>
              </div>
            )}

            <form onSubmit={handleGrade} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">คะแนน (0-100) *</label>
                <input 
                  className="field-input" 
                  type="number" 
                  min="0"
                  max="100"
                  placeholder="85" 
                  value={gradeForm.grade} 
                  onChange={(e) => setGradeForm({...gradeForm, grade: e.target.value})} 
                  required 
                />
              </div>

              <div className="field-group">
                <label className="field-label">ความคิดเห็น *</label>
                <textarea 
                  className="field-input" 
                  placeholder="ให้ข้อเสนอแนะและคำแนะนำแก่นักศึกษา" 
                  value={gradeForm.feedback} 
                  onChange={(e) => setGradeForm({...gradeForm, feedback: e.target.value})} 
                  rows={5}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                  บันทึกคะแนน
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowGradeModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}

function ReportCard({ report, onGrade }) {
  const hasGrade = report.grade !== null && report.grade !== undefined;
  const gradeColor = report.grade >= 80 ? "var(--success)" : 
                     report.grade >= 70 ? "var(--primary)" :
                     report.grade >= 60 ? "var(--warning)" : "var(--error)";

  return (
    <div style={{ 
      padding: 20, 
      background: hasGrade ? "var(--n-50)" : "var(--warning-50)", 
      borderRadius: 16,
      border: `1px solid ${hasGrade ? "var(--n-200)" : "var(--warning-200)"}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
            {report.studentName || "ไม่ระบุชื่อ"}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-file-lines" style={{ marginRight: 6 }}></i>
            {report.title || "รายงานฝึกงาน"}
          </p>
          {report.submittedAt && (
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
              ส่งเมื่อ: {new Date(report.submittedAt).toLocaleDateString("th-TH", { 
                day: "numeric", 
                month: "short", 
                year: "numeric" 
              })}
            </p>
          )}
        </div>

        {hasGrade ? (
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
              คะแนน
            </p>
            <p style={{ fontSize: 32, fontWeight: 900, color: gradeColor, lineHeight: 1 }}>
              {report.grade}
            </p>
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onGrade}>
            <i className="fas fa-star" style={{ marginRight: 6 }}></i>
            ให้คะแนน
          </button>
        )}
      </div>

      {report.feedback && (
        <div style={{ marginTop: 16, padding: 12, background: "white", borderRadius: 8 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-comment" style={{ marginRight: 6 }}></i>
            ความคิดเห็น
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {report.feedback}
          </p>
        </div>
      )}

      {report.content && !hasGrade && (
        <div style={{ marginTop: 12, padding: 12, background: "white", borderRadius: 8, maxHeight: 100, overflowY: "auto" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {report.content.substring(0, 200)}...
          </p>
        </div>
      )}
    </div>
  );
}
