"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StudentHomePage() {
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getApplications().catch(() => []),
      api.getReports().catch(() => []),
      api.getBookmarks().catch(() => []),
    ]).then(([appsData, reportsData, bookmarksData]) => {
      setApplications(appsData);
      setReports(reportsData);
      setBookmarks(bookmarksData);
    }).finally(() => setLoading(false));
  }, []);

  const pendingReports = reports.filter(r => r.status === "DRAFT" || !r.submittedAt).length;
  const acceptedApps = applications.filter(a => a.status === "ACCEPTED").length;
  const pendingApps = applications.filter(a => a.status === "PENDING").length;

  return (
    <RoleDashboardShell role="STUDENT" title="แดชบอร์ดนักศึกษา" subtitle="ติดตามการสมัครฝึกงาน รายงาน และการแจ้งเตือนทั้งหมดในที่เดียว">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>กำลังโหลด...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Stats Cards */}
          <div className="grid-4" style={{ gap: 16 }}>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ใบสมัครทั้งหมด</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)" }}>{applications.length}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>รอพิจารณา: {pendingApps}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>ได้รับการตอบรับ</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#059669" }}>{acceptedApps}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>รายงานค้างส่ง</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: pendingReports > 0 ? "#F59E0B" : "#059669" }}>{pendingReports}</p>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>งานที่บันทึก</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#2563EB" }}>{bookmarks.length}</p>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>ใบสมัครล่าสุด</h3>
              <Link href="/applications" className="btn-text">ดูทั้งหมด →</Link>
            </div>
            {applications.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
                  <i className="fas fa-file-lines"></i>
                </div>
                <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>คุณยังไม่มีใบสมัคร</p>
                <Link href="/internships" className="btn btn-primary">
                  <i className="fas fa-search" style={{ marginRight: 8 }}></i>
                  ค้นหาตำแหน่งฝึกงาน
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {applications.slice(0, 5).map(app => (
                  <div key={app.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{app.positionTitle || "ตำแหน่ง"}</p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{app.companyName || "บริษัท"}</p>
                    </div>
                    <span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Reports */}
          {pendingReports > 0 && (
            <div className="card" style={{ padding: 24, background: "var(--warning-50)", border: "1px solid var(--warning-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--warning)", marginBottom: 4 }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: 8 }}></i>
                    คุณมีรายงานค้างส่ง {pendingReports} ฉบับ
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)" }}>กรุณาส่งรายงานให้ครบถ้วนตามกำหนด</p>
                </div>
                <Link href="/student/reports" className="btn btn-warning">
                  ส่งรายงาน
                </Link>
              </div>
            </div>
          )}

          {/* Bookmarked Jobs */}
          {bookmarks.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>งานที่บันทึกไว้</h3>
                <Link href="/internships" className="btn-text">ดูทั้งหมด →</Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {bookmarks.slice(0, 3).map(bookmark => (
                  <div key={bookmark.id} style={{ padding: 16, background: "var(--n-50)", borderRadius: 12 }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{bookmark.internshipTitle || "ตำแหน่ง"}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{bookmark.companyName || "บริษัท"}</p>
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
