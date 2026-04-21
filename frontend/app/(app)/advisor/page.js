"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdvisorHomePage() {
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/v1/advisor/students").catch(() => []),
      api.getReports().catch(() => []),
    ]).then(([studentsData, reportsData]) => {
      setStudents(studentsData);
      setReports(reportsData);
    }).finally(() => setLoading(false));
  }, []);

  const pendingReports = reports.filter(r => !r.grade).length;
  const atRiskStudents = students.filter(s => s.reportStatus === "AT_RISK").length;

  return (
    <RoleDashboardShell role="ADVISOR" title="แดชบอร์ดอาจารย์ที่ปรึกษา" subtitle="ตรวจรายงาน ติดตามนักศึกษา และให้ feedback ได้ครบในหน้าจอเดียว">
      {loading ? (
        <div className="grid-4 stagger" style={{ gap: 16 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 20 }}></div>)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Stats Cards */}
          <div className="grid-4 stagger" style={{ gap: 16 }}>
            <div className="stat-premium" style={{ "--accent": "#0891B2" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#ECFEFF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#0891B2", fontSize: 18,
                }}>
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div>
                <p className="stat-card-label">นักศึกษาในความดูแล</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{students.length}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Assigned Students</p>
              </div>
            </div>

            <div className="stat-premium" style={{ "--accent": "#D97706" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#FFFBEB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#D97706", fontSize: 18,
                }}>
                  <i className="fas fa-file-circle-check"></i>
                </div>
                {pendingReports > 0 && <span className="stat-trend down"><i className="fas fa-clock" style={{fontSize:10}}></i></span>}
              </div>
              <div>
                <p className="stat-card-label">รายงานรอตรวจ</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{pendingReports}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Pending Reviews</p>
              </div>
            </div>

            <div className="stat-premium" style={{ "--accent": "#7C3AED" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#F5F3FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#7C3AED", fontSize: 18,
                }}>
                  <i className="fas fa-clipboard-check"></i>
                </div>
              </div>
              <div>
                <p className="stat-card-label">คำขออนุมัติ</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>0</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Approval Requests</p>
              </div>
            </div>

            <div className="stat-premium" style={{ "--accent": atRiskStudents > 0 ? "#DC2626" : "#059669" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: atRiskStudents > 0 ? "#FEF2F2" : "#ECFDF5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: atRiskStudents > 0 ? "#DC2626" : "#059669", fontSize: 18,
                }}>
                  <i className="fas fa-triangle-exclamation"></i>
                </div>
                {atRiskStudents > 0 && <span className="stat-trend down"><i className="fas fa-exclamation-circle" style={{fontSize:10}}></i></span>}
              </div>
              <div>
                <p className="stat-card-label">เสี่ยงล่าช้า</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{atRiskStudents}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>At Risk Students</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="section-head">
              <h2>ทางลัด</h2>
            </div>
            <div className="grid-4 stagger" style={{ gap: 12 }}>
              <Link href="/advisor/reports" className="shortcut-card animate-fade-in" style={shortcutStyle("#D97706")}>
                <div style={iconStyle("#D97706")}><i className="fas fa-file-pen"></i></div>
                <div><p style={labelStyle}>ตรวจรายงาน</p><p style={subStyle}>Review Reports</p></div>
              </Link>
              <Link href="/advisor/students" className="shortcut-card animate-fade-in" style={shortcutStyle("#0891B2")}>
                <div style={iconStyle("#0891B2")}><i className="fas fa-user-group"></i></div>
                <div><p style={labelStyle}>ดูนักศึกษา</p><p style={subStyle}>View Students</p></div>
              </Link>
              <Link href="/reports" className="shortcut-card animate-fade-in" style={shortcutStyle("#7C3AED")}>
                <div style={iconStyle("#7C3AED")}><i className="fas fa-chart-line"></i></div>
                <div><p style={labelStyle}>สถิติและรายงาน</p><p style={subStyle}>Analytics</p></div>
              </Link>
              <Link href="/notifications" className="shortcut-card animate-fade-in" style={shortcutStyle("#059669")}>
                <div style={iconStyle("#059669")}><i className="fas fa-bell"></i></div>
                <div><p style={labelStyle}>การแจ้งเตือน</p><p style={subStyle}>Notifications</p></div>
              </Link>
            </div>
          </div>

          {/* Pending Reports */}
          {pendingReports > 0 && (
            <div className="card animate-fade-in" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>
                  <i className="fas fa-hourglass-half" style={{ color: "#D97706", marginRight: 8 }}></i>
                  รายงานรอตรวจ
                </h3>
                <Link href="/advisor/reports" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reports.filter(r => !r.grade).slice(0, 5).map(report => (
                  <div key={report.id} style={{ 
                    padding: 16, background: "var(--n-50)", borderRadius: 12, 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--n-100)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--n-50)"}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{report.title || `รายงานสัปดาห์ที่ ${report.weekNumber}`}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{report.studentName || "นักศึกษา"}</p>
                    </div>
                    <span className="badge badge-pending">รอตรวจ</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students List */}
          {students.length > 0 && (
            <div className="card animate-fade-in" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>นักศึกษาในความดูแล</h3>
                <Link href="/advisor/students" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {students.slice(0, 5).map(student => (
                  <div key={student.id} style={{ 
                    padding: 16, background: "var(--n-50)", borderRadius: 12, 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--n-100)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--n-50)"}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{student.displayName || student.username}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{student.major || "สาขา"} • ชั้นปีที่ {student.academicYear || "N/A"}</p>
                    </div>
                    <span className={`badge badge-${student.reportStatus?.toLowerCase() || "active"}`}>
                      {student.reportStatus || "ACTIVE"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </RoleDashboardShell>
  );
}

// Shortcut Styles
const shortcutStyle = (color) => ({
  display:"flex", alignItems:"center", gap:14,
  background:"white", border:"1px solid var(--border)",
  borderRadius:16, padding:"16px 18px",
  boxShadow:"var(--shadow-sm)",
  transition:"all var(--transition)",
  textDecoration:"none",
});
const iconStyle = (color) => ({
  width:40, height:40, borderRadius:12, flexShrink:0,
  background: color + "15",
  display:"flex", alignItems:"center", justifyContent:"center",
  color: color, fontSize:16,
});
const labelStyle = { fontSize:13, fontWeight:800, color:"var(--text-primary)" };
const subStyle = { fontSize:11, color:"var(--text-muted)", fontWeight:600 };
