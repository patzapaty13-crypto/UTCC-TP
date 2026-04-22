"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";

const STATUS_LABEL = {
  PENDING: "รออนุมัติอาจารย์",
  ADVISOR_APPROVED: "อนุมัติโดยอาจารย์",
  REVIEWING: "บริษัทพิจารณา",
  SHORTLISTED: "ผ่านรอบแรก",
  INTERVIEW_SCHEDULED: "นัดสัมภาษณ์",
  INTERVIEW_COMPLETED: "สัมภาษณ์เสร็จ",
  OFFER_EXTENDED: "ได้รับข้อเสนอ",
  ACCEPTED: "ได้รับงาน",
  REJECTED: "ปฏิเสธ",
  WITHDRAWN: "ถอนใบสมัคร",
};

const STATUS_COLOR = {
  PENDING: "yellow", ADVISOR_APPROVED: "blue", REVIEWING: "blue",
  SHORTLISTED: "blue", INTERVIEW_SCHEDULED: "blue", INTERVIEW_COMPLETED: "blue",
  OFFER_EXTENDED: "purple", ACCEPTED: "green", REJECTED: "red", WITHDRAWN: "gray",
};

export default function StaffApplicationsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getApplications();
        setItems(data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = filter === "ALL" ? items : items.filter(a => a.status === filter);

  return (
    <RoleDashboardShell role="STAFF" title="การสมัครทั้งหมด" subtitle="ตรวจสอบและติดตามใบสมัครทั้งแพลตฟอร์ม">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {["ALL", ...Object.keys(STATUS_LABEL)].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={filter === s ? "btn btn-primary" : "btn btn-ghost"}
            style={{ padding: "6px 12px", fontSize: 13 }}
          >
            {s === "ALL" ? "ทั้งหมด" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 14 }}></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <i className="fas fa-clipboard-list" style={{ fontSize: 40, color: "var(--n-300)" }}></i>
          <h3 style={{ marginTop: 16 }}>ไม่มีใบสมัครในสถานะนี้</h3>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>นักศึกษา</th>
                <th>ตำแหน่ง</th>
                <th>บริษัท</th>
                <th>สถานะ</th>
                <th>วันที่</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 700 }}>{a.studentName || a.applicantName || "-"}</td>
                  <td>{a.internshipTitle || a.tripTitle || "-"}</td>
                  <td>{a.companyName || "-"}</td>
                  <td><span className={`badge badge-${STATUS_COLOR[a.status] || "gray"}`}>{STATUS_LABEL[a.status] || a.status}</span></td>
                  <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{a.createdAt ? new Date(a.createdAt).toLocaleDateString("th-TH") : "-"}</td>
                  <td><Link href={`/applications/${a.id}`} className="btn btn-ghost" style={{ padding: "6px 10px", fontSize: 12 }}>ดู</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RoleDashboardShell>
  );
}
