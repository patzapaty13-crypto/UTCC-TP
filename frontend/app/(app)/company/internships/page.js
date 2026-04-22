"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CompanyInternshipsPage() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      const data = await api.getMyInternships();
      setInternships(data || []);
    } catch (err) {
      console.error("Failed to load internships:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="ประกาศฝึกงาน" subtitle="จัดการตำแหน่งฝึกงานสำหรับนักศึกษา">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="COMPANY" title="ประกาศฝึกงาน" subtitle="จัดการตำแหน่งฝึกงานสำหรับนักศึกษา">
      <div style={{ marginBottom: 24 }}>
        <Link href="/company/internships/create" className="btn btn-primary">
          <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
          ประกาศฝึกงานใหม่
        </Link>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {internships.length === 0 ? (
            <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>
              ยังไม่มีตำแหน่งฝึกงาน
            </p>
          ) : (
            internships.map((internship) => (
              <div key={internship.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid #E2E8F0", padding: "16px 0" }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>{internship.title}</p>
                  <p className="text-muted" style={{ marginTop: 4, fontSize: 14 }}>
                    {internship.companyName} • {internship.location} • {internship.status}
                  </p>
                </div>
                <Link href={`/company/internships/${internship.id}`} className="btn btn-ghost" style={{ padding: "8px 16px" }}>
                  จัดการ
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </RoleDashboardShell>
  );
}
