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
      // In real app, this would fetch students assigned to this advisor
      const [users, apps, currentUser] = await Promise.all([
        api.getUsers().catch(() => []), // Fallback if not implemented
        api.getApplications(),
        api.getMe()
      ]);
      
      // Filter only students assigned to this advisor
      const allStudents = users.filter(u => u.roles?.includes("STUDENT")) || [];
      const assignedStudents = allStudents.filter(s => s.advisorId === currentUser.id);
      
      setStudents(assignedStudents);
      setApplications(apps || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

      {/* Students List */}
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
        <div style={{ display: "grid", gap: 16 }}>
          {filteredStudents.map(student => {
            const stats = getStudentStats(student.id);
            const apps = getStudentApplications(student.id);
            const hasActivePlacement = apps.some(a => a.status === "ACCEPTED");
            const needsAttention = apps.length === 0 || apps.some(a => a.status === "REJECTED");

            return (
              <div 
                key={student.id}
                onClick={() => { setSelectedStudent(student); setShowDetail(true); }}
                className="card"
                style={{ 
                  padding: 20,
                  cursor: "pointer",
                  transition: "all var(--transition)",
                  border: needsAttention ? "2px solid var(--warning)" : "1px solid var(--border)"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 16, flex: 1 }}>
                    <div style={{ 
                      width: 56, 
                      height: 56, 
                      borderRadius: 16, 
                      background: hasActivePlacement ? "var(--success-50)" : "var(--primary-50)",
                      color: hasActivePlacement ? "var(--success)" : "var(--primary)",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 900,
                      flexShrink: 0
                    }}>
                      {(student.displayName || student.username || "?").charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>
                          {student.displayName || student.username}
                        </h3>
                        {hasActivePlacement && (
                          <span className="badge badge-success" style={{ fontSize: 11 }}>
                            <i className="fas fa-check-circle" style={{ marginRight: 4 }}></i>
                            ได้ที่แล้ว
                          </span>
                        )}
                        {needsAttention && (
                          <span className="badge badge-warning" style={{ fontSize: 11 }}>
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: 4 }}></i>
                            ต้องติดตาม
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                        {student.email && (
                          <span>
                            <i className="fas fa-envelope" style={{ marginRight: 6 }}></i>
                            {student.email}
                          </span>
                        )}
                        {student.major && (
                          <span>
                            <i className="fas fa-book" style={{ marginRight: 6 }}></i>
                            {student.major}
                          </span>
                        )}
                        {student.academicYear && (
                          <span>
                            <i className="fas fa-calendar" style={{ marginRight: 6 }}></i>
                            ปี {student.academicYear}
                          </span>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>ใบสมัครทั้งหมด: </span>
                          <strong style={{ color: "var(--primary)" }}>{stats.total}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>รอพิจารณา: </span>
                          <strong style={{ color: "var(--warning)" }}>{stats.pending}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>ตอบรับ: </span>
                          <strong style={{ color: "var(--success)" }}>{stats.accepted}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>ปฏิเสธ: </span>
                          <strong style={{ color: "var(--error)" }}>{stats.rejected}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-ghost btn-sm">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            );
          })}
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
