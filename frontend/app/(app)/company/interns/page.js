"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

const INTERN_STATUS = {
  STARTING_SOON: { label: "เริ่มงานเร็วๆ นี้", color: "var(--warning)", icon: "clock" },
  ACTIVE: { label: "กำลังฝึกงาน", color: "var(--success)", icon: "briefcase" },
  COMPLETED: { label: "เสร็จสิ้นแล้ว", color: "var(--primary)", icon: "check-circle" },
  TERMINATED: { label: "ยกเลิก", color: "var(--error)", icon: "times-circle" }
};

export default function CompanyInternsPage() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadInterns = async () => {
    setLoading(true);
    try {
      // Get all applications for this company where status = ACCEPTED
      const allApplications = await api.getApplications();
      const acceptedInterns = allApplications.filter(app => app.status === "ACCEPTED");
      setInterns(acceptedInterns);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterns();
  }, []);

  const updateInternStatus = async (internId, newStatus) => {
    try {
      // Mock API call
      setInterns(prev => prev.map(intern => 
        intern.id === internId ? { ...intern, status: newStatus } : intern
      ));
      alert("อัปเดตสถานะสำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = !searchTerm || 
      intern.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || intern.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: interns.length,
    active: interns.filter(i => i.status === "ACTIVE").length,
    startingSoon: interns.filter(i => i.status === "STARTING_SOON").length,
    completed: interns.filter(i => i.status === "COMPLETED").length,
    avgPerformance: interns.filter(i => i.performance !== "ยังไม่ประเมิน").length
  };

  const getProgressPercentage = (intern) => {
    if (intern.totalDays === 0) return 0;
    return Math.round((intern.workingDays / intern.totalDays) * 100);
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <RoleDashboardShell 
      role="COMPANY" 
      title="จัดการพนักงานฝึกงาน" 
      subtitle="ติดตามและจัดการนักศึกษาที่เข้ามาฝึกงาน"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-users" style={{ marginRight: 6 }}></i>
            พนักงานฝึกงานทั้งหมด
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>{stats.total}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-briefcase" style={{ marginRight: 6 }}></i>
            กำลังฝึกงาน
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--success)" }}>{stats.active}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            เริ่มงานเร็วๆ นี้
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--warning)" }}>{stats.startingSoon}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }}></i>
            เสร็จสิ้นแล้ว
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>{stats.completed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <i className="fas fa-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}></i>
            <input
              type="text"
              placeholder="ค้นหาชื่อ, ตำแหน่ง, แผนก..."
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
            {Object.entries(INTERN_STATUS).map(([key, status]) => (
              <option key={key} value={key}>{status.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
          แสดง {filteredInterns.length} จาก {interns.length} คน
        </div>
      </div>

      {/* Interns List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }}></div>)}
        </div>
      ) : filteredInterns.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-user-tie"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            {searchTerm || statusFilter !== "ALL" ? "ไม่พบพนักงานฝึกงาน" : "ยังไม่มีพนักงานฝึกงาน"}
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            {searchTerm || statusFilter !== "ALL" 
              ? "ลองเปลี่ยนเงื่อนไขการค้นหา" 
              : "เมื่อมีนักศึกษาตอบรับข้อเสนองานจะแสดงที่นี่"}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filteredInterns.map(intern => {
            const statusInfo = INTERN_STATUS[intern.status];
            const progress = getProgressPercentage(intern);
            const daysRemaining = getDaysRemaining(intern.endDate);

            return (
              <div key={intern.id} className="card" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 16, flex: 1 }}>
                    <div style={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: 16, 
                      background: statusInfo.color + "20",
                      color: statusInfo.color,
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 900,
                      flexShrink: 0
                    }}>
                      {intern.studentName.charAt(0)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                          {intern.studentName}
                        </h3>
                        <span 
                          className="badge"
                          style={{ 
                            background: statusInfo.color + "20",
                            color: statusInfo.color,
                            border: `1px solid ${statusInfo.color}40`,
                            fontSize: 11
                          }}
                        >
                          <i className={`fas fa-${statusInfo.icon}`} style={{ marginRight: 4 }}></i>
                          {statusInfo.label}
                        </span>
                      </div>

                      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
                        {intern.position}
                      </p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                        <div>
                          <i className="fas fa-building" style={{ marginRight: 6 }}></i>
                          {intern.department}
                        </div>
                        <div>
                          <i className="fas fa-user-tie" style={{ marginRight: 6 }}></i>
                          {intern.supervisor}
                        </div>
                        <div>
                          <i className="fas fa-envelope" style={{ marginRight: 6 }}></i>
                          {intern.studentEmail}
                        </div>
                        <div>
                          <i className="fas fa-phone" style={{ marginRight: 6 }}></i>
                          {intern.studentPhone}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, fontSize: 12 }}>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>สาขา: </span>
                          <strong>{intern.major}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>ชั้นปี: </span>
                          <strong>{intern.academicYear}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>GPA: </span>
                          <strong style={{ color: intern.gpa >= 3.5 ? "var(--success)" : intern.gpa >= 3.0 ? "var(--warning)" : "var(--error)" }}>
                            {intern.gpa}
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--text-muted)" }}>ผลงาน: </span>
                          <strong>{intern.performance}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setSelectedIntern(intern); setShowDetail(true); }}
                    >
                      <i className="fas fa-eye" style={{ marginRight: 6 }}></i>
                      ดูรายละเอียด
                    </button>
                    
                    <select 
                      value={intern.status} 
                      onChange={(e) => updateInternStatus(intern.id, e.target.value)}
                      style={{ padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12 }}
                    >
                      {Object.entries(INTERN_STATUS).map(([key, status]) => (
                        <option key={key} value={key}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Progress Bar */}
                {intern.status === "ACTIVE" && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>ความคืบหน้า</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {intern.workingDays}/{intern.totalDays} วัน ({progress}%)
                      </span>
                    </div>
                    <div style={{ 
                      width: "100%", 
                      height: 8, 
                      background: "var(--n-200)", 
                      borderRadius: 4,
                      overflow: "hidden"
                    }}>
                      <div style={{ 
                        width: `${progress}%`, 
                        height: "100%", 
                        background: progress >= 80 ? "var(--success)" : progress >= 50 ? "var(--warning)" : "var(--primary)",
                        transition: "width 0.3s ease"
                      }}></div>
                    </div>
                    {daysRemaining > 0 && (
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                        เหลืออีก {daysRemaining} วัน
                      </p>
                    )}
                  </div>
                )}

                {/* Skills */}
                {intern.skills.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {intern.skills.map((skill, index) => (
                        <span 
                          key={index}
                          style={{ 
                            padding: "4px 8px", 
                            background: "var(--primary-50)", 
                            color: "var(--primary)",
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 600
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Intern Detail Modal */}
      {showDetail && selectedIntern && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowDetail(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 900, padding: 40, position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowDetail(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 20, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>
              รายละเอียดพนักงานฝึกงาน
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {/* Left Column */}
              <div>
                {/* Basic Info */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>ข้อมูลพื้นฐาน</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                    <div><strong>ชื่อ:</strong> {selectedIntern.studentName}</div>
                    <div><strong>อีเมล:</strong> {selectedIntern.studentEmail}</div>
                    <div><strong>โทรศัพท์:</strong> {selectedIntern.studentPhone}</div>
                    <div><strong>สาขา:</strong> {selectedIntern.major}</div>
                    <div><strong>ชั้นปี:</strong> {selectedIntern.academicYear}</div>
                    <div><strong>GPA:</strong> {selectedIntern.gpa}</div>
                  </div>
                </div>

                {/* Work Info */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>ข้อมูลการทำงาน</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                    <div><strong>ตำแหน่ง:</strong> {selectedIntern.position}</div>
                    <div><strong>แผนก:</strong> {selectedIntern.department}</div>
                    <div><strong>ผู้ดูแล:</strong> {selectedIntern.supervisor}</div>
                    <div><strong>วันเริ่มงาน:</strong> {new Date(selectedIntern.startDate).toLocaleDateString("th-TH")}</div>
                    <div><strong>วันสิ้นสุด:</strong> {new Date(selectedIntern.endDate).toLocaleDateString("th-TH")}</div>
                    <div><strong>สถานะ:</strong> 
                      <span style={{ 
                        marginLeft: 8,
                        padding: "2px 8px",
                        background: INTERN_STATUS[selectedIntern.status].color + "20",
                        color: INTERN_STATUS[selectedIntern.status].color,
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600
                      }}>
                        {INTERN_STATUS[selectedIntern.status].label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>ทักษะ</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedIntern.skills.map((skill, index) => (
                      <span 
                        key={index}
                        style={{ 
                          padding: "6px 12px", 
                          background: "var(--primary-50)", 
                          color: "var(--primary)",
                          borderRadius: 16,
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Progress */}
                {selectedIntern.status === "ACTIVE" && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>ความคืบหน้า</h3>
                    <div style={{ 
                      padding: 20, 
                      background: "var(--success-50)", 
                      borderRadius: 12,
                      border: "1px solid var(--success-200)"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>วันทำงาน</span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>
                          {selectedIntern.workingDays}/{selectedIntern.totalDays} วัน
                        </span>
                      </div>
                      <div style={{ 
                        width: "100%", 
                        height: 12, 
                        background: "var(--success-200)", 
                        borderRadius: 6,
                        overflow: "hidden",
                        marginBottom: 8
                      }}>
                        <div style={{ 
                          width: `${getProgressPercentage(selectedIntern)}%`, 
                          height: "100%", 
                          background: "var(--success)",
                          transition: "width 0.3s ease"
                        }}></div>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--success)", margin: 0 }}>
                        {getProgressPercentage(selectedIntern)}% เสร็จสิ้น
                      </p>
                    </div>
                  </div>
                )}

                {/* Projects */}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>โปรเจค</h3>
                  {selectedIntern.projects.length === 0 ? (
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>ยังไม่มีโปรเจค</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {selectedIntern.projects.map((project, index) => (
                        <div key={index} style={{ 
                          padding: 16, 
                          background: "var(--n-50)", 
                          borderRadius: 8,
                          border: "1px solid var(--n-200)"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>{project.name}</span>
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{project.progress}%</span>
                          </div>
                          <div style={{ 
                            width: "100%", 
                            height: 6, 
                            background: "var(--n-200)", 
                            borderRadius: 3,
                            overflow: "hidden"
                          }}>
                            <div style={{ 
                              width: `${project.progress}%`, 
                              height: "100%", 
                              background: project.progress === 100 ? "var(--success)" : "var(--primary)",
                              transition: "width 0.3s ease"
                            }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>หมายเหตุ</h3>
                  <div style={{ 
                    padding: 16, 
                    background: "var(--n-50)", 
                    borderRadius: 8,
                    border: "1px solid var(--n-200)"
                  }}>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>
                      {selectedIntern.notes}
                    </p>
                  </div>
                  
                  {selectedIntern.lastReportDate && (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                      <i className="fas fa-file-alt" style={{ marginRight: 6 }}></i>
                      รายงานล่าสุด: {new Date(selectedIntern.lastReportDate).toLocaleDateString("th-TH")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}