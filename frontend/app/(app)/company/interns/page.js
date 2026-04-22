"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function CompanyInternsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [me, apps] = await Promise.all([
          api.getMe(),
          api.getApplications().catch(() => []),
        ]);
        const accepted = (apps || []).filter(a =>
          a.status === "ACCEPTED" &&
          (!me.companyId || a.companyId === me.companyId)
        );
        setItems(accepted);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <RoleDashboardShell role="COMPANY" title="พนักงานฝึกงาน" subtitle="นักศึกษาที่ตอบรับข้อเสนอและกำลังจะเริ่มฝึกงาน">
      {loading ? (
        <div className="skeleton" style={{ height: 260, borderRadius: 14 }}></div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <i className="fas fa-user-tie" style={{ fontSize: 40, color: "var(--n-300)" }}></i>
          <h3 style={{ marginTop: 16 }}>ยังไม่มีพนักงานฝึกงาน</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 6 }}>
            นักศึกษาที่ตอบรับข้อเสนอจะปรากฏที่นี่
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {items.map(app => (
            <div key={app.id} className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h3 style={{ fontWeight: 800, fontSize: 16 }}>{app.studentName || app.fullName || "-"}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 4 }}>
                  <i className="fas fa-briefcase" style={{ marginRight: 6 }}></i>
                  {app.internshipTitle || "-"}
                </p>
                {app.studentMajor && (
                  <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
                    <i className="fas fa-graduation-cap" style={{ marginRight: 6 }}></i>
                    {app.studentMajor}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="badge badge-green">ACCEPTED</span>
                <Link href={`/applications/${app.id}`} className="btn btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>
                  <i className="fas fa-eye" style={{ marginRight: 6 }}></i>ดูรายละเอียด
                </Link>
                <Link href={`/messages?to=${app.studentUsername || ""}`} className="btn btn-primary" style={{ padding: "8px 14px", fontSize: 13 }}>
                  <i className="fas fa-comments" style={{ marginRight: 6 }}></i>ส่งข้อความ
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </RoleDashboardShell>
  );
}
