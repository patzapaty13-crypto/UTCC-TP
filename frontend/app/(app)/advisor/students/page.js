"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function AdvisorStudentsPage() {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsData, apps] = await Promise.all([
        api.getAdvisorStudents().catch(() => []),
        api.getApplications()
      ]);

      setStudents(studentsData || []);
      setApplications(apps || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStudentApplications = (studentId) => {
    return applications.filter(app => app.userId === studentId || app.studentId === studentId);
  };

  const getStudentStats = (studentId) => {
    const apps = getStudentApplications(studentId);
    return {
      total: apps.length,
      pending: apps.filter(a => a.status === "PENDING").length,
      accepted: apps.filter(a => a.status === "ACCEPTED").length,
      rejected: apps.filter(a => a.status === "REJECTED").length,
    };
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      (student.displayName || student.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.major || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "ALL") return matchesSearch;
    
    const apps = getStudentApplications(student.id);
    if (statusFilter === "ACTIVE") return matchesSearch && apps.some(a => ["PENDING", "REVIEWING", "INTERVIEW_SCHEDULED"].includes(a.status));
    if (statusFilter === "PLACED") return matchesSearch && apps.some(a => a.status === "ACCEPTED");
    if (statusFilter === "NO_APPLICATIONS") return matchesSearch && apps.length === 0;
    
    return matchesSearch;
  });

  return (
    <RoleDashboardShell 
      role="ADVISOR" 
      title="นักศึกษาในความดูแล" 
      subtitle="ติดตามและให้คำปรึกษานักศึกษาในการหาที่ฝึกงาน"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-users" style={{ marginRight: 6 }}></i>
            นักศึกษาทั้งหมด
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>{students.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            กำลังสมัคร
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--warning)" }}>
            {students.filter(s => getStudentApplications(s.id).some(a => ["PENDING", "REVIEWING"].includes(a.status))).length}
          </p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }}></i>
            ได้ที่ฝึกงานแล้ว
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--success)" }}>
            {students.filter(s => getStudentApplications(s.id).some(a => a.status === "ACCEPTED")).length}
          </p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: 6 }}></i>
            ยังไม่สมัคร
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--error)" }}>
            {students.filter(s => getStudentApplications(s.id).length === 0).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
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
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
          >
            <option value="ALL">ทุกสถานะ</option>
            <option value="ACTIVE">กำลังสมัคร</option>
            <option value="PLACED">ได้ที่แล้ว</option>
            <option value="NO_APPLICATIONS">ยังไม่สมัคร</option>
          </select>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
          แสดง {filteredStudents.length} จาก {students.length} คน
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }}></div>)}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-user-graduate"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            {searchTerm || statusFilter !== "ALL" ? "ไม่พบนักศึกษา" : "ยังไม่มีนักศึกษา"}
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            {searchTerm || statusFilter !== "ALL" 
              ? "ลองเปลี่ยนเงื่อนไขการค้นหา" 
              : "ยังไม่มีนักศึกษาในความดูแลของคุณ"}
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
              <thead>
                <tr style={{ background: "var(--n-50)", borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    นักศึกษา
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    สาขา/ชั้นปี
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    ใบสมัครทั้งหมด
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    รอพิจารณา
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    ตอบรับ
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    สถานะ
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const stats = getStudentStats(student.id);
                  const apps = getStudentApplications(student.id);
                  const hasActivePlacement = apps.some(a => a.status === "ACCEPTED");
                  const needsAttention = apps.length === 0 || apps.some(a => a.status === "REJECTED");

                  return (
                    <tr 
                      key={student.id}
                      style={{ 
                        borderBottom: "1px solid var(--border)",
                        transition: "background 0.2s",
                        cursor: "pointer",
                        borderLeft: needsAttention ? "4px solid var(--warning)" : "4px solid transparent"
                      }}
                      onClick={() => { setSelectedStudent(student); setShowDetail(true); }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--n-50)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {/* Student Info */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: hasActivePlacement ? "var(--success-50)" : "var(--primary-50)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            fontWeight: 700,
                            color: hasActivePlacement ? "var(--success)" : "var(--primary)",
                            flexShrink: 0
                          }}>
                            {(student.displayName || student.username || "?").charAt(0).toUpperCase()}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {student.displayName || student.username}
                            </div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {student.email || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Major/Year */}
                      <td style={{ padding: "16px" }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                          {student.major || "-"}
                        </div>
                        {student.academicYear && (
                          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                            ปี {student.academicYear}
                          </div>
                        )}
                      </td>

                      {/* Total Applications */}
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "var(--primary-50)",
                          color: "var(--primary)",
                          fontSize: 14,
                          fontWeight: 700
                        }}>
                          {stats.total}
                        </div>
                      </td>

                      {/* Pending */}
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: stats.pending > 0 ? "var(--warning-50)" : "var(--n-100)",
                          color: stats.pending > 0 ? "var(--warning)" : "var(--text-muted)",
                          fontSize: 14,
                          fontWeight: 700
                        }}>
                          {stats.pending}
                        </div>
                      </td>

                      {/* Accepted */}
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <div style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: stats.accepted > 0 ? "var(--success-50)" : "var(--n-100)",
                          color: stats.accepted > 0 ? "var(--success)" : "var(--text-muted)",
                          fontSize: 14,
                          fontWeight: 700
                        }}>
                          {stats.accepted}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        {hasActivePlacement ? (
                          <span className="badge badge-success" style={{ fontSize: 11 }}>
                            <i className="fas fa-check-circle" style={{ marginRight: 4 }}></i>
                            ได้ที่แล้ว
                          </span>
                        ) : needsAttention ? (
                          <span className="badge badge-warning" style={{ fontSize: 11 }}>
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: 4 }}></i>
                            ต้องติดตาม
                          </span>
                        ) : (
                          <span className="badge badge-blue" style={{ fontSize: 11 }}>
                            <i className="fas fa-clock" style={{ marginRight: 4 }}></i>
                            กำลังสมัคร
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "16px", textAlign: "center" }}>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(student);
                            setShowDetail(true);
                          }}
                        >
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {showDetail && selectedStudent && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowDetail(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 800, padding: 40, position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowDetail(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 20, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>
              ข้อมูลนักศึกษา
            </h2>

            {/* Student Info */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 20, 
                  background: "var(--primary-50)",
                  color: "var(--primary)",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 900
                }}>
                  {(selectedStudent.displayName || selectedStudent.username || "?").charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                    {selectedStudent.displayName || selectedStudent.username}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, color: "var(--text-muted)" }}>
                    {selectedStudent.email && (
                      <div>
                        <i className="fas fa-envelope" style={{ marginRight: 8, width: 16 }}></i>
                        {selectedStudent.email}
                      </div>
                    )}
                    {selectedStudent.major && (
                      <div>
                        <i className="fas fa-book" style={{ marginRight: 8, width: 16 }}></i>
                        {selectedStudent.major}
                      </div>
                    )}
                    {selectedStudent.academicYear && (
                      <div>
                        <i className="fas fa-calendar" style={{ marginRight: 8, width: 16 }}></i>
                        ปี {selectedStudent.academicYear}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Applications */}
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
                ประวัติการสมัคร ({getStudentApplications(selectedStudent.id).length})
              </h3>
              
              {getStudentApplications(selectedStudent.id).length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", background: "var(--n-50)", borderRadius: 12 }}>
                  <div style={{ fontSize: 32, color: "var(--n-300)", marginBottom: 12 }}>
                    <i className="fas fa-inbox"></i>
                  </div>
                  <p style={{ color: "var(--text-muted)" }}>ยังไม่มีการสมัครงาน</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {getStudentApplications(selectedStudent.id).map(app => (
                    <div key={app.id} style={{ 
                      padding: 16, 
                      background: "var(--n-50)", 
                      borderRadius: 12,
                      border: "1px solid var(--n-200)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                            {app.positionTitle || "ไม่ระบุตำแหน่ง"}
                          </p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            <i className="fas fa-building" style={{ marginRight: 6 }}></i>
                            {app.company || "ไม่ระบุบริษัท"}
                          </p>
                        </div>
                        <span className={`badge badge-${
                          app.status === "ACCEPTED" ? "green" :
                          app.status === "REJECTED" ? "red" :
                          app.status === "PENDING" ? "yellow" : "blue"
                        }`} style={{ fontSize: 11 }}>
                          {app.status}
                        </span>
                      </div>
                      {app.appliedAt && (
                        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                          <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
                          สมัครเมื่อ: {new Date(app.appliedAt).toLocaleDateString("th-TH")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
