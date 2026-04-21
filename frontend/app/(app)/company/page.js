"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CompanyHomePage() {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getInternships().catch(() => []),
      api.getApplications().catch(() => []),
    ]).then(([internshipsData, applicationsData]) => {
      setInternships(internshipsData);
      setApplications(applicationsData);
    }).finally(() => setLoading(false));
  }, []);

  const activePositions = internships.filter(i => i.status === "ACTIVE" || i.status === "OPEN").length;
  const newApplicants = applications.filter(a => a.status === "PENDING").length;
  const scheduledInterviews = applications.filter(a => a.status === "INTERVIEW_SCHEDULED").length;
  const pendingOffers = applications.filter(a => a.status === "OFFER_EXTENDED").length;

  return (
    <RoleDashboardShell role="COMPANY" title="แดชบอร์ดบริษัท" subtitle="จัดการประกาศฝึกงาน ผู้สมัคร และขั้นตอนการคัดเลือก">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>กำลังโหลด...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Stats Cards */}
          <div className="grid-4" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ประกาศที่เปิดอยู่</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>{activePositions}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>ทั้งหมด: {internships.length}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ผู้สมัครใหม่</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#2563EB" }}>{newApplicants}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>นัดสัมภาษณ์</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#059669" }}>{scheduledInterviews}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Offer ค้างตอบ</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#F59E0B" }}>{pendingOffers}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>การจัดการ</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <Link href="/company/internships" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-briefcase"></i> จัดการตำแหน่ง
              </Link>
              <Link href="/company/applicants" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-users"></i> ดูผู้สมัคร
              </Link>
              <Link href="/company/interviews" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-calendar"></i> นัดสัมภาษณ์
              </Link>
              <Link href="/company/offers" className="btn-secondary" style={{ textAlign: "center" }}>
                <i className="fas fa-file-signature"></i> จัดการ Offer
              </Link>
            </div>
          </div>

          {/* Recent Applications */}
          {newApplicants > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>ผู้สมัครใหม่</h3>
                <Link href="/company/applicants" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {applications.filter(a => a.status === "PENDING").slice(0, 5).map(app => (
                  <div key={app.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{app.studentName || "นักศึกษา"}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{app.positionTitle || "ตำแหน่ง"}</p>
                    </div>
                    <span className="badge badge-pending">รอพิจารณา</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Positions */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>ตำแหน่งที่เปิดรับ</h3>
              <Link href="/company/internships" className="btn-text">จัดการ →</Link>
            </div>
            {activePositions === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
                  <i className="fas fa-briefcase"></i>
                </div>
                <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>ยังไม่มีตำแหน่งเปิดรับ</p>
                <Link href="/company/internships" className="btn btn-primary">
                  <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
                  เพิ่มตำแหน่งใหม่
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {internships.filter(i => i.status === "ACTIVE" || i.status === "OPEN").slice(0, 5).map(position => (
                  <div key={position.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{position.title}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {position.location || "สถานที่"} • {position.type || "ประเภท"}
                      </p>
                    </div>
                    <span className="badge badge-success">เปิดรับ</span>
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
