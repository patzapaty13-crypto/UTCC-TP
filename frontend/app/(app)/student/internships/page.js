"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StudentInternshipsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInternships()
      .then(setItems)
      .catch(err => console.error("Failed to load internships:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <RoleDashboardShell role="STUDENT" title="ค้นหาฝึกงาน" subtitle="ค้นหาและสมัครตำแหน่งฝึกงานที่ตรงกับสาขาและทักษะ">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="STUDENT" title="ค้นหาฝึกงาน" subtitle="ค้นหาและสมัครตำแหน่งฝึกงานที่ตรงกับสาขาและทักษะ">
      <div style={{ display: "grid", gap: 16 }}>
        {items.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: "center" }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 36,
              color: "#9CA3AF"
            }}>
              <i className="fas fa-briefcase"></i>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>ไม่มีตำแหน่งฝึกงาน</h3>
            <p className="text-muted">ยังไม่มีตำแหน่งฝึกงานที่เปิดรับสมัครในขณะนี้</p>
          </div>
        ) : (
          items.map((i) => (
            <div
              key={i.id}
              className="card"
              style={{
                padding: 24,
                transition: "all 0.2s ease",
                cursor: "pointer",
                borderLeft: "4px solid #3B82F6"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
              }}
            >
              <div style={{ display: "flex", gap: 20 }}>
                {/* Company Logo */}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  background: "#F3F4F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  overflow: "hidden",
                  border: "2px solid #E5E7EB"
                }}>
                  {i.companyLogoUrl ? (
                    <img src={i.companyLogoUrl} alt={i.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <i className="fas fa-building" style={{ fontSize: 32, color: "#9CA3AF" }}></i>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1E293B", marginBottom: 4 }}>
                        {i.title}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{
                          padding: "4px 12px",
                          background: "#EFF6FF",
                          color: "#3B82F6",
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          {i.company}
                        </span>
                        {i.industry && (
                          <span style={{
                            padding: "4px 12px",
                            background: "#F3F4F6",
                            color: "#64748B",
                            borderRadius: 99,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {i.industry}
                          </span>
                        )}
                        <span style={{
                          padding: "4px 12px",
                          background: i.status === "OPEN" ? "#ECFDF5" : "#FEF2F2",
                          color: i.status === "OPEN" ? "#10B981" : "#EF4444",
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 600
                        }}>
                          {i.status === "OPEN" ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: 14, color: "#64748B", marginBottom: 12, lineHeight: 1.6 }}>
                    {i.description?.substring(0, 150)}
                    {i.description?.length > 150 ? "..." : ""}
                  </p>

                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748B" }}>
                      <i className="fas fa-map-marker-alt" style={{ color: "#3B82F6" }}></i>
                      {i.location}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748B" }}>
                      <i className="fas fa-clock" style={{ color: "#3B82F6" }}></i>
                      {i.mode}
                    </div>
                    {i.salaryMin && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748B" }}>
                        <i className="fas fa-money-bill-wave" style={{ color: "#3B82F6" }}></i>
                        {i.salaryMin.toLocaleString()} - {i.salaryMax?.toLocaleString()} บาท
                      </div>
                    )}
                    {i.slots > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748B" }}>
                        <i className="fas fa-users" style={{ color: "#3B82F6" }}></i>
                        {i.slots} ตำแหน่ง
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Link
                      href={`/student/internships/${i.id}`}
                      className="btn btn-primary"
                      style={{ padding: "8px 20px", fontSize: 14 }}
                    >
                      <i className="fas fa-eye" style={{ marginRight: 8 }}></i>
                      ดูรายละเอียด
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </RoleDashboardShell>
  );
}
