"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

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

  const loadApps = () => {
    setLoading(true);
    api.getApplications()
      .then(setApps)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadApps, []);

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
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ประเภท</th>
                <th>รายละเอียด</th>
                <th>วันที่สมัคร</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(a => {
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
                      {appliedDate 
                        ? new Date(appliedDate).toLocaleDateString("th-TH", { day:"numeric", month:"short", year:"numeric" })
                        : "—"
                      }
                    </td>
                    <td><span className={`badge ${cfg.cls}`}>{cfg.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
