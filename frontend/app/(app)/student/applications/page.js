"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function StudentApplicationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getApplications().then(setItems).finally(() => setLoading(false)); }, []);

  return (
    <RoleDashboardShell role="STUDENT" title="ใบสมัครของฉัน" subtitle="ติดตามสถานะการสมัครและขั้นตอนการคัดเลือก">
      <div className="card" style={{ padding: 24 }}>
        {loading ? <p className="text-muted">กำลังโหลด...</p> : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((a) => (
              <div key={a.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12 }}>
                <p style={{ fontWeight: 700 }}>{a.internshipTitle || a.tripTitle || "-"}</p>
                <p className="text-muted" style={{ marginTop: 4 }}>{a.type} • {a.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleDashboardShell>
  );
}
