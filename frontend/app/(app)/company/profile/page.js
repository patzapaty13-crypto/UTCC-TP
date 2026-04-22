"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyProfilePage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    contactName: "",
    contactEmail: "",
    logoUrl: ""
  });

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const user = await api.getMe();
      if (user.companyId) {
        const companyData = await api.get(`/companies/${user.companyId}`);
        setCompany(companyData);
        setFormData({
          name: companyData.name || "",
          industry: companyData.industry || "",
          location: companyData.location || "",
          contactName: companyData.contactName || "",
          contactEmail: companyData.contactEmail || "",
          logoUrl: companyData.logoUrl || ""
        });
      }
    } catch (err) {
      console.error("Failed to load company profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put("/companies/my-profile", formData);
      alert("บันทึกข้อมูลสำเร็จ");
      setEditing(false);
      loadCompanyProfile();
    } catch (err) {
      alert("ไม่สามารถบันทึกข้อมูลได้: " + (err.message || ""));
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="ข้อมูลบริษัท" subtitle="จัดการข้อมูลบริษัทของคุณ">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="COMPANY" title="ข้อมูลบริษัท" subtitle="จัดการข้อมูลบริษัทของคุณ">
      <div className="card" style={{ padding: 32 }}>
        {/* Logo Section */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: 16,
            background: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16",
            overflow: "hidden",
            border: "2px solid #E5E7EB"
          }}>
            {formData.logoUrl ? (
              <img src={formData.logoUrl} alt="Company Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <i className="fas fa-building" style={{ fontSize: 48, color: "#9CA3AF" }}></i>
            )}
          </div>
          {editing && (
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                URL โลโก้บริษัท
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                  ชื่อบริษัท *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                  อุตสาหกรรม
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                  ที่ตั้ง
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                  ชื่อผู้ติดต่อ
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                  อีเมลผู้ติดต่อ
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #E5E7EB",
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    loadCompanyProfile();
                  }}
                  className="btn btn-ghost"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-save" style={{ marginRight: 8 }}></i>
                  บันทึก
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>ชื่อบริษัท</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>{company?.name || "-"}</p>
              </div>

              <div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>อุตสาหกรรม</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>{company?.industry || "-"}</p>
              </div>

              <div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>ที่ตั้ง</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>{company?.location || "-"}</p>
              </div>

              <div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>ชื่อผู้ติดต่อ</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>{company?.contactName || "-"}</p>
              </div>

              <div>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>อีเมลผู้ติดต่อ</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: "#1E293B" }}>{company?.contactEmail || "-"}</p>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary"
              >
                <i className="fas fa-edit" style={{ marginRight: 8 }}></i>
                แก้ไขข้อมูล
              </button>
            </div>
          </div>
        )}
      </div>
    </RoleDashboardShell>
  );
}
