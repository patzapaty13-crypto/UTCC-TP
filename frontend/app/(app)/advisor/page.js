"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function AdvisorHomePage() {
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUsers().catch(() => []),
      api.getReports().catch(() => []),
      api.getApplications().catch(() => []),
    ]).then(([usersData, reportsData, applicationsData]) => {
      // Filter only students assigned to this advisor
      const studentUsers = usersData.filter(u => u.role === "STUDENT");
      setStudents(studentUsers);
      setReports(reportsData);
      setApplications(applicationsData);
    }).finally(() => setLoading(false));
  }, []);

  const pendingReports = reports.filter(r => r.status === "SUBMITTED" && !r.grade).length;
  const studentsWithInternships = applications.filter(a => a.status === "ACCEPTED").length;
  const atRiskStudents = reports.filter(r => r.grade && r.grade < 60).length;

  return (
    <RoleDashboardShell role="ADVISOR" title="แดชบอร์ดอาจารย์ที่ปรึกษา" subtitle="ตรวจรายงาน ติดตามนักศึกษา และให้ feedback ได้ครบในหน้าจอเดียว">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>กำลังโหลด...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Stats Cards */}
          <div className="grid-4" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>นักศึกษาในความดูแล</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>{students.length}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>กำลังฝึกงาน: {studentsWithInternships}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>รายงานรอตรวจ</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#F59E0B" }}>{pendingReports}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>รายงานทั้งหมด</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#2563EB" }}>{reports.length}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>เสี่ยงล่าช้า</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: atRiskStudents > 0 ? "#EF4444" : "#059669" }}>{atRiskStudents}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>การจัดการ</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <Link href="/advisor/students" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-users"></i> นักศึกษาของฉัน
              </Link>
              <Link href="/advisor/reports" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-file-lines"></i> ตรวจรายงาน
              </Link>
            </div>
          </div>

          {/* Pending Reports Alert */}
          {pendingReports > 0 && (
            <div className="card" style={{ padding: 24, background: "var(--warning-50)", border: "1px solid var(--warning-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--warning)", marginBottom: 4 }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: 8 }}></i>
                    มีรายงานรอตรวจ {pendingReports} ฉบับ
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>กรุณาตรวจและให้คะแนนรายงานของนักศึกษา</p>
                </div>
                <Link href="/advisor/reports" className="btn btn-warning">
                  ตรวจรายงาน
                </Link>
              </div>
            </div>
          )}

          {/* Recent Reports */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>รายงานล่าสุด</h3>
              <Link href="/advisor/reports" className="btn-text">ดูทั้งหมด →</Link>
            </div>
            {reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
                  <i className="fas fa-file-lines"></i>
                </div>
                <p style={{ color: "var(--text-muted)" }}>ยังไม่มีรายงาน</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reports.slice(0, 5).map(report => (
                  <div key={report.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{report.studentName || "นักศึกษา"}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{report.title || "รายงานฝึกงาน"}</p>
                    </div>
                    {report.grade ? (
                      <span className="badge badge-success">ตรวจแล้ว ({report.grade})</span>
                    ) : (
                      <span className="badge badge-warning">รอตรวจ</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Students Overview */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>นักศึกษาในความดูแล</h3>
              <Link href="/advisor/students" className="btn-text">ดูทั้งหมด →</Link>
            </div>
            {students.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
                  <i className="fas fa-users"></i>
                </div>
                <p style={{ color: "var(--text-muted)" }}>ยังไม่มีนักศึกษาในความดูแล</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {students.slice(0, 5).map(student => (
                  <div key={student.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{student.displayName || student.username}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{student.email || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
