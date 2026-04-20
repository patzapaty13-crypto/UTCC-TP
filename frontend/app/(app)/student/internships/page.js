"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StudentInternshipsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.getInternships().then(setItems); }, []);

  return (
    <RoleDashboardShell role="STUDENT" title="ค้นหาฝึกงาน" subtitle="ค้นหาและสมัครตำแหน่งฝึกงานที่ตรงกับสาขาและทักษะ">
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((i) => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--border)", padding: "12px 0" }}>
              <div>
                <p style={{ fontWeight: 800 }}>{i.title}</p>
                <p className="text-muted" style={{ marginTop: 4 }}>{i.companyName} • {i.location} • {i.status}</p>
              </div>
              <Link href={`/internships/${i.id}`} className="btn btn-primary btn-sm">ดูรายละเอียด</Link>
            </div>
          ))}
        </div>
      </div>
    </RoleDashboardShell>
  );
}
