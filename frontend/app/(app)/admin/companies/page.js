"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    industry: "",
    location: "",
    contactName: "",
    contactEmail: "",
    status: "ACTIVE",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = () => {
    api.getCompanies()
      .then(setCompanies)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const filteredCompanies = companies.filter(company => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      company.name?.toLowerCase().includes(searchLower) ||
      company.industry?.toLowerCase().includes(searchLower) ||
      company.location?.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "ALL" || company.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createCompany(form);
      setShowModal(false);
      setForm({ name: "", industry: "", location: "", contactName: "", contactEmail: "", status: "ACTIVE" });
      loadCompanies();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (companyId, currentStatus) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (!confirm(`ต้องการเปลี่ยนสถานะเป็น ${newStatus}?`)) return;

    try {
      await api.updateCompany(companyId, { status: newStatus });
      setCompanies(companies.map(c => c.id === companyId ? { ...c, status: newStatus } : c));
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    }
  };

  return (
    <RoleDashboardShell role="ADMIN" title="จัดการบริษัท" subtitle="ดู แก้ไข และจัดการบริษัทพันธมิตรในระบบ">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div></div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> เพิ่มบริษัท
          </button>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12 }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <i className="fas fa-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}></i>
              <input
                type="text"
                placeholder="ค้นหาชื่อบริษัท, อุตสาหกรรม, สถานที่..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: "100%", padding: "10px 14px 10px 40px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
              />
            </div>

            {/* Status Filter */}
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8 }}>
              <option value="ALL">ทุกสถานะ</option>
              <option value="ACTIVE">ใช้งาน</option>
              <option value="INACTIVE">ปิดใช้งาน</option>
            </select>
          </div>

          <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
            แสดง {filteredCompanies.length} จาก {companies.length} บริษัท
          </div>
        </div>

        {/* Companies Table */}
        <div className="data-table-wrap">
          {loading ? (
            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 60, borderRadius: 10 }}></div>)}
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="fas fa-building"></i></div>
              <h3>ไม่พบบริษัท</h3>
              <p>ลองเปลี่ยนเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ชื่อบริษัท</th>
                  <th>อุตสาหกรรม</th>
                  <th>สถานที่</th>
                  <th>ผู้ติดต่อ</th>
                  <th>อีเมล</th>
                  <th>สถานะ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map(company => (
                  <tr key={company.id}>
                    <td style={{ fontWeight: 700 }}>{company.name}</td>
                    <td>{company.industry || "—"}</td>
                    <td style={{ fontSize: 13 }}>{company.location || "—"}</td>
                    <td style={{ fontSize: 13 }}>{company.contactName || "—"}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{company.contactEmail || "—"}</td>
                    <td>
                      <span className={`badge ${company.status === "ACTIVE" ? "badge-success" : "badge-gray"}`}>
                        {company.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(company.id, company.status)}
                        className="btn-text"
                        style={{ fontSize: 13, padding: "4px 8px" }}
                      >
                        <i className={`fas fa-${company.status === "ACTIVE" ? "ban" : "check"}`}></i>
                        {company.status === "ACTIVE" ? "ปิดใช้งาน" : "เปิดใช้งาน"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 500, padding: 32, position: "relative" }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 18, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>เพิ่มบริษัทใหม่</h2>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">ชื่อบริษัท *</label>
                <input
                  className="field-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="field-group">
                <label className="field-label">อุตสาหกรรม</label>
                <input
                  className="field-input"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div className="field-group">
                <label className="field-label">สถานที่</label>
                <input
                  className="field-input"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  disabled={submitting}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field-group">
                  <label className="field-label">ชื่อผู้ติดต่อ</label>
                  <input
                    className="field-input"
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    disabled={submitting}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">อีเมลผู้ติดต่อ</label>
                  <input
                    className="field-input"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? "กำลังบันทึก..." : "เพิ่มบริษัท"}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)} disabled={submitting}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
