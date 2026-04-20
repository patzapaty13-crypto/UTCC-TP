"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function StaffAssignAdvisorPage() {
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const users = await api.getUsers();
      const studentUsers = users.filter(u => u.roles?.includes("STUDENT")) || [];
      const advisorUsers = users.filter(u => u.roles?.includes("ADVISOR")) || [];
      
      setStudents(studentUsers);
      setAdvisors(advisorUsers);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (studentId, advisorId) => {
    try {
      await api.updateUser(studentId, { advisorId });
      await loadData();
      alert("Assign Advisor สำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      (student.displayName || student.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.major || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (advisorFilter === "ALL") return matchesSearch;
    if (advisorFilter === "ASSIGNED") return matchesSearch && student.advisorId;
    if (advisorFilter === "UNASSIGNED") return matchesSearch && !student.advisorId;
    
    return matchesSearch && student.advisorId === advisorFilter;
  });

  const getAdvisorName = (advisorId) => {
    const advisor = advisors.find(a => a.id === advisorId);
    return advisor ? advisor.displayName || advisor.username : "ไม่ระบุ";
  };

  return (
    <RoleDashboardShell 
      role="STAFF" 
      title="Assign Advisor" 
      subtitle="กำหนดอาจารย์ที่ปรึกษาให้กับนักศึกษา"
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
            <i className="fas fa-chalkboard-user" style={{ marginRight: 6 }}></i>
            อาจารย์ที่ปรึกษา
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--purple)" }}>{advisors.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }}></i>
            Assign แล้ว
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--success)" }}>
            {students.filter(s => s.advisorId).length}
          </p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: 6 }}></i>
            ยังไม่ Assign
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--warning)" }}>
            {students.filter(s => !s.advisorId).length}
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
            value={advisorFilter} 
            onChange={(e) => setAdvisorFilter(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
          >
            <option value="ALL">ทุกสถานะ</option>
            <option value="ASSIGNED">Assign แล้ว</option>
            <option value="UNASSIGNED">ยังไม่ Assign</option>
            {advisors.map(advisor => (
              <option key={advisor.id} value={advisor.id}>
                {advisor.displayName || advisor.username}
              </option>
            ))}
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
            {searchTerm || advisorFilter !== "ALL" ? "ไม่พบนักศึกษา" : "ยังไม่มีนักศึกษา"}
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            {searchTerm || advisorFilter !== "ALL" 
              ? "ลองเปลี่ยนเงื่อนไขการค้นหา" 
              : "ยังไม่มีนักศึกษาในระบบ"}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredStudents.map(student => (
            <div key={student.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 16, flex: 1 }}>
                  <div style={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 16, 
                    background: student.advisorId ? "var(--success-50)" : "var(--warning-50)",
                    color: student.advisorId ? "var(--success)" : "var(--warning)",
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
                      {student.advisorId ? (
                        <span className="badge badge-success" style={{ fontSize: 11 }}>
                          <i className="fas fa-check-circle" style={{ marginRight: 4 }}></i>
                          Assign แล้ว
                        </span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: 11 }}>
                          <i className="fas fa-exclamation-triangle" style={{ marginRight: 4 }}></i>
                          ยังไม่ Assign
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

                    {student.advisorId && (
                      <div style={{ fontSize: 12, color: "var(--success)" }}>
                        <i className="fas fa-chalkboard-user" style={{ marginRight: 6 }}></i>
                        อาจารย์ที่ปรึกษา: <strong>{getAdvisorName(student.advisorId)}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <select 
                    value={student.advisorId || ""} 
                    onChange={(e) => handleAssign(student.id, e.target.value || null)}
                    style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
                  >
                    <option value="">-- เลือกอาจารย์ --</option>
                    {advisors.map(advisor => (
                      <option key={advisor.id} value={advisor.id}>
                        {advisor.displayName || advisor.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </RoleDashboardShell>
  );
}