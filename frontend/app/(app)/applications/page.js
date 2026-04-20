"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import ApplicationTimeline from "@/components/ApplicationTimeline";

const STATUS_CFG = {
  PENDING:             { label: "รอตรวจสอบ",   cls: "badge-yellow" },
  REVIEWING:           { label: "กำลังคัดกรอง",   cls: "badge-blue" },
  INTERVIEW_SCHEDULED: { label: "นัดสัมภาษณ์",   cls: "badge-purple" },
  OFFER_EXTENDED:      { label: "เสนอสัญญา",   cls: "badge-indigo" },
  ACCEPTED:            { label: "สำเร็จแล้ว",   cls: "badge-green" },
  APPROVED:            { label: "อนุมัติแล้ว",   cls: "badge-green" },
  REJECTED:            { label: "ไม่อนุมัติ",    cls: "badge-red" },
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const loadApps = () => {
    setLoading(true);
    api.getApplications()
      .then(setApps)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadApps, []);

  // Filter logic
  const filteredApps = apps.filter(app => {
    const title = (app.positionTitle || app.internshipTitle || app.tripTitle || "").toLowerCase();
    const company = (app.company || "").toLowerCase();
    const student = (app.studentName || "").toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = !searchTerm || title.includes(searchLower) || company.includes(searchLower) || student.includes(searchLower);
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesType = typeFilter === "ALL" || 
      (typeFilter === "INTERNSHIP" && !app.tripTitle) ||
      (typeFilter === "TRIP" && app.tripTitle);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Application Tracking</p>
          <h1 className="page-title">ใบสมัครของฉัน</h1>
          <p className="page-subtitle">ติดตามสถานะการสมัครเข้าร่วมกิจกรรมทริปศึกษาดูงานและฝึกงาน</p>
        </div>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Filters */}
      {!loading && apps.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <i className="fas fa-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}></i>
              <input
                type="text"
                placeholder="ค้นหาตำแหน่ง, บริษัท, นักศึกษา..."
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
              <option value="INTERNSHIP">ฝึกงาน</option>
              <option value="TRIP">ทริป</option>
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
            แสดง {filteredApps.length} จาก {apps.length} รายการ
          </div>
        </div>
      )}

      <div className="data-table-wrap">
        {loading ? (
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:56, borderRadius:10 }}></div>)}
          </div>
        ) : apps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-clipboard-list"></i></div>
            <h3>ยังไม่มีใบสมัคร</h3>
            <p>คุณยังไม่ได้สมัครเข้าร่วมกิจกรรมใดๆ ในระบบ</p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:16 }}>
              <Link href="/trips" className="btn btn-primary">ดูทริปที่เปิดรับ</Link>
              <Link href="/internships" className="btn btn-secondary">ค้นหาที่ฝึกงาน</Link>
            </div>
          </div>
        ) : filteredApps.length === 0 ? (
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
          <table className="data-table">
            <thead>
              <tr>
                <th>ประเภท</th>
                <th>รายละเอียด</th>
                <th>ข้อมูลผู้สมัคร</th>
                <th>วันที่สมัคร</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map(a => {
                const cfg = STATUS_CFG[a.status] || { label: a.status, cls: "badge-gray" };
                const title = a.positionTitle || a.internshipTitle || a.tripTitle || "Unknown Activity";
                const appliedDate = a.appliedAt || a.createdAt;
                return (
                  <tr key={a.id}>
                    <td>
                      <span className={`badge ${a.tripTitle ? 'badge-blue' : 'badge-purple'}`}>
                        <i className={`fas ${a.tripTitle ? 'fa-route' : 'fa-briefcase'}`} style={{ marginRight:5 }}></i>
                        {a.tripTitle ? "ทริปศึกษาดูงาน" : "ตำแหน่งฝึกงาน"}
                      </span>
                    </td>
                    <td>
                      <p className="fw" style={{ fontSize:14 }}>{title}</p>
                      <p style={{ fontSize:11.5, color:"var(--text-muted)", marginTop:4 }}>
                        {a.company && <span><i className="fas fa-building" style={{marginRight:5}}></i>{a.company}</span>}
                        {!a.company && `โดย ${a.studentName || '—'}`}
                      </p>
                    </td>
                    <td>
                      <div style={{ fontSize:12, color:"var(--text-secondary)" }}>
                        {a.gpa && (
                          <div style={{ marginBottom:4 }}>
                            <i className="fas fa-graduation-cap" style={{marginRight:6, color:"var(--primary)"}}></i>
                            GPA: <strong>{a.gpa}</strong>
                          </div>
                        )}
                        {a.email && (
                          <div style={{ marginBottom:4 }}>
                            <i className="fas fa-envelope" style={{marginRight:6, color:"var(--text-muted)"}}></i>
                            {a.email}
                          </div>
                        )}
                        {a.phone && (
                          <div>
                            <i className="fas fa-phone" style={{marginRight:6, color:"var(--text-muted)"}}></i>
                            {a.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {appliedDate 
                        ? new Date(appliedDate).toLocaleDateString("th-TH", { day:"numeric", month:"short", year:"numeric" })
                        : "—"
                      }
                    </td>
                    <td><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button 
                          className="btn btn-ghost btn-sm"
                          onClick={() => setSelectedApp(a)}
                          title="ดูขั้นตอน"
                        >
                          <i className="fas fa-route"></i>
                        </button>
                        {a.portfolioUrl && (
                          <a 
                            href={a.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-sm"
                            title="ดู Portfolio"
                          >
                            <i className="fas fa-external-link"></i>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Timeline Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>ขั้นตอนการสมัคร</h3>
              <button className="modal-close" onClick={() => setSelectedApp(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                  {selectedApp.positionTitle || selectedApp.internshipTitle || selectedApp.tripTitle}
                </h4>
                {selectedApp.company && (
                  <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    <i className="fas fa-building" style={{ marginRight: 8 }}></i>
                    {selectedApp.company}
                  </p>
                )}
              </div>
              <ApplicationTimeline application={selectedApp} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
