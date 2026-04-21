"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CompanyHomePage() {
  const [positions, setPositions] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getInternships().catch(() => []),
      api.get("/api/v1/company/applicants").catch(() => []),
      api.get("/api/v1/company/interviews").catch(() => []),
    ]).then(([positionsData, applicantsData, interviewsData]) => {
      setPositions(positionsData);
      setApplicants(applicantsData);
      setInterviews(interviewsData);
    }).finally(() => setLoading(false));
  }, []);

  const activePositions = positions.filter(p => p.status === "OPEN").length;
  const newApplicants = applicants.filter(a => a.status === "PENDING").length;
  const pendingOffers = applicants.filter(a => a.status === "OFFERED").length;

  return (
    <RoleDashboardShell role="COMPANY" title="แดชบอร์ดบริษัท" subtitle="จัดการประกาศฝึกงาน ผู้สมัคร และขั้นตอนการคัดเลือก">
      {loading ? (
        <div className="grid-4 stagger" style={{ gap: 16 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 140, borderRadius: 20 }}></div>)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Stats Cards */}
          <div className="grid-4 stagger" style={{ gap: 16 }}>
            <div className="stat-premium" style={{ "--accent": "#2563EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#EFF6FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#2563EB", fontSize: 18,
                }}>
                  <i className="fas fa-briefcase"></i>
                </div>
                {activePositions > 0 && <span className="stat-trend up"><i className="fas fa-arrow-trend-up" style={{fontSize:10}}></i> +{activePositions}</span>}
              </div>
              <div>
                <p className="stat-card-label">ประกาศที่เปิดอยู่</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{activePositions}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Active Positions</p>
              </div>
            </div>

            <div className="stat-premium" style={{ "--accent": "#059669" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#ECFDF5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#059669", fontSize: 18,
                }}>
                  <i className="fas fa-user-plus"></i>
                </div>
                {newApplicants > 0 && <span className="stat-trend up"><i className="fas fa-arrow-trend-up" style={{fontSize:10}}></i> +{newApplicants}</span>}
              </div>
              <div>
                <p className="stat-card-label">ผู้สมัครใหม่</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{newApplicants}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>New Applicants</p>
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
                  <i className="fas fa-calendar-days"></i>
                </div>
              </div>
              <div>
                <p className="stat-card-label">นัดสัมภาษณ์</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{interviews.length}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Scheduled Interviews</p>
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
                  <i className="fas fa-file-contract"></i>
                </div>
                {pendingOffers > 0 && <span className="stat-trend down"><i className="fas fa-clock" style={{fontSize:10}}></i></span>}
              </div>
              <div>
                <p className="stat-card-label">Offer ค้างตอบ</p>
                <p className="stat-card-value" style={{ fontSize: 34, marginTop: 6 }}>{pendingOffers}</p>
                <p className="stat-card-sub" style={{ marginTop: 4 }}>Pending Offers</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="section-head">
              <h2>ทางลัด</h2>
            </div>
            <div className="grid-4 stagger" style={{ gap: 12 }}>
              <Link href="/company/internships" className="shortcut-card animate-fade-in" style={shortcutStyle("#2563EB")}>
                <div style={iconStyle("#2563EB")}><i className="fas fa-plus-circle"></i></div>
                <div><p style={labelStyle}>จัดการประกาศ</p><p style={subStyle}>Manage Positions</p></div>
              </Link>
              <Link href="/company/applicants" className="shortcut-card animate-fade-in" style={shortcutStyle("#059669")}>
                <div style={iconStyle("#059669")}><i className="fas fa-users"></i></div>
                <div><p style={labelStyle}>ดูผู้สมัคร</p><p style={subStyle}>View Applicants</p></div>
              </Link>
              <Link href="/company/interviews" className="shortcut-card animate-fade-in" style={shortcutStyle("#7C3AED")}>
                <div style={iconStyle("#7C3AED")}><i className="fas fa-calendar-check"></i></div>
                <div><p style={labelStyle}>จัดการสัมภาษณ์</p><p style={subStyle}>Manage Interviews</p></div>
              </Link>
              <Link href="/company/profile" className="shortcut-card animate-fade-in" style={shortcutStyle("#D97706")}>
                <div style={iconStyle("#D97706")}><i className="fas fa-building"></i></div>
                <div><p style={labelStyle}>โปรไฟล์บริษัท</p><p style={subStyle}>Company Profile</p></div>
              </Link>
            </div>
          </div>

          {/* Active Positions */}
          {positions.length > 0 && (
            <div className="card animate-fade-in" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>ประกาศฝึกงาน</h3>
                <Link href="/company/internships" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {positions.slice(0, 5).map(position => (
                  <div key={position.id} style={{ 
                    padding: 16, background: "var(--n-50)", borderRadius: 12, 
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--n-100)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--n-50)"}
                  >
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{position.title}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {position.applicantCount || 0} ผู้สมัคร • {position.department || "แผนก"}
                      </p>
                    </div>
                    <span className={`badge badge-${position.status?.toLowerCase()}`}>{position.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Applicants */}
          {newApplicants > 0 && (
            <div className="card animate-fade-in" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>
                  <i className="fas fa-user-clock" style={{ color: "#059669", marginRight: 8 }}></i>
                  ผู้สมัครใหม่
                </h3>
                <Link href="/company/applicants" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {applicants.filter(a => a.status === "PENDING").slice(0, 5).map(applicant => (
                  <div key={applicant.id} style={{ 
                    padding: 16, background: "#ECFDF5", borderRadius: 12, borderLeft: "4px solid #059669",
                    transition: "all 0.2s ease",
                  }}>
                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{applicant.studentName || "นักศึกษา"}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {applicant.positionTitle || "ตำแหน่ง"} • สมัครเมื่อ {new Date(applicant.appliedAt).toLocaleDateString('th-TH')}
                    </p>
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
