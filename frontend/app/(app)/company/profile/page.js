"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyProfilePage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompanies().then(setCompanies).finally(() => setLoading(false));
  }, []);

  return (
    <RoleDashboardShell role="COMPANY" title="ข้อมูลบริษัท" subtitle="จัดการข้อมูลบริษัทและสถานะการยืนยันบัญชี">
      <div className="card" style={{ padding: 24 }}>
        {loading ? <p className="text-muted">กำลังโหลด...</p> : companies.map((c) => (
          <div key={c.id} style={{ borderBottom: "1px solid var(--border)", padding: "12px 0" }}>
            <p style={{ fontWeight: 800 }}>{c.name}</p>
            <p className="text-muted" style={{ marginTop: 4 }}>{c.industry} • {c.location} • {c.status}</p>
          </div>
        ))}
      </div>
    </RoleDashboardShell>
  );
}
