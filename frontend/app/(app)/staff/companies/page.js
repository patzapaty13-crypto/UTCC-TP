"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function StaffCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    industry: "",
    website: "",
    address: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    displayName: "",
    email: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const comps = await api.getCompanies();
      setCompanies(comps || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await api.updateCompany(editingCompany.id, form);
      } else {
        await api.createCompany(form);
      }
      setShowModal(false);
      setEditingCompany(null);
      setForm({ name: "", description: "", industry: "", website: "", address: "", contactPerson: "", contactEmail: "", contactPhone: "" });
      await loadData();
      alert(editingCompany ? "อัปเดตบริษัทสำเร็จ" : "เพิ่มบริษัทสำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setForm({
      name: company.name || "",
      description: company.description || "",
      industry: company.industry || "",
      website: company.website || "",
      address: company.address || "",
      contactPerson: company.contactPerson || "",
      contactEmail: company.contactEmail || "",
      contactPhone: company.contactPhone || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบบริษัทนี้หรือไม่?")) return;
    try {
      await api.deleteCompany(id);
      await loadData();
      alert("ลบบริษัทสำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const handleCreateUser = (company) => {
    setSelectedCompany(company);
    setUserForm({
      username: company.name.toLowerCase().replace(/\s+/g, '') + '_user',
      password: 'company123',
      displayName: company.name + ' User',
      email: company.contactEmail || '',
    });
    setShowUserModal(true);
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser({
        ...userForm,
        roles: ['COMPANY'],
        companyId: selectedCompany.id,
      });
      setShowUserModal(false);
      setSelectedCompany(null);
      setUserForm({ username: "", password: "", displayName: "", email: "" });
      alert(`สร้าง User สำเร็จ!\nUsername: ${userForm.username}\nPassword: ${userForm.password}`);
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const filteredCompanies = companies.filter(c => 
    !searchTerm || 
    (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.industry || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <RoleDashboardShell 
      role="STAFF" 
      title="จัดการบริษัท" 
      subtitle="เพิ่ม แก้ไข และจัดการข้อมูลบริษัทพันธมิตร"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Header Actions */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <i className="fas fa-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}></i>
            <input
              type="text"
              placeholder="ค้นหาบริษัท, อุตสาหกรรม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: "100%", 
                padding: "10px 14px 10px 40px", 
                border: "1px solid var(--border)", 
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingCompany(null);
              setForm({ name: "", description: "", industry: "", website: "", address: "", contactPerson: "", contactEmail: "", contactPhone: "" });
              setShowModal(true);
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
            เพิ่มบริษัท
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
          แสดง {filteredCompanies.length} จาก {companies.length} บริษัท
        </div>
      </div>

      {/* Companies Table */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 16 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }}></div>)}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-building"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            {searchTerm ? "ไม่พบบริษัท" : "ยังไม่มีบริษัท"}
          </h3>
          <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
            {searchTerm ? `ไม่พบบริษัทที่ตรงกับ "${searchTerm}"` : "เริ่มต้นโดยการเพิ่มบริษัทพันธมิตร"}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
              เพิ่มบริษัทแรก
            </button>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1000 }}>
              <thead>
                <tr style={{ background: "var(--n-50)", borderBottom: "2px solid var(--border)" }}>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    บริษัท
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    อุตสาหกรรม
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    ผู้ติดต่อ
                  </th>
                  <th style={{ padding: "16px", textAlign: "left", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    ช่องทางติดต่อ
                  </th>
                  <th style={{ padding: "16px", textAlign: "center", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map(company => (
                  <tr 
                    key={company.id}
                    style={{ 
                      borderBottom: "1px solid var(--border)",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--n-50)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Company Info */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "var(--primary-50)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--primary)",
                          flexShrink: 0
                        }}>
                          {(company.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {company.name}
                          </div>
                          {company.description && (
                            <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {company.description.substring(0, 50)}{company.description.length > 50 ? "..." : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Industry */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                        {company.industry || "-"}
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                        {company.contactPerson || "-"}
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {company.contactEmail && (
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            <i className="fas fa-envelope" style={{ marginRight: 6, width: 14 }}></i>
                            {company.contactEmail}
                          </div>
                        )}
                        {company.contactPhone && (
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                            <i className="fas fa-phone" style={{ marginRight: 6, width: 14 }}></i>
                            {company.contactPhone}
                          </div>
                        )}
                        {company.website && (
                          <div style={{ fontSize: 12 }}>
                            <i className="fas fa-globe" style={{ marginRight: 6, width: 14, color: "var(--text-muted)" }}></i>
                            <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
                              เว็บไซต์
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "nowrap" }}>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => handleCreateUser(company)}
                          title="สร้าง User"
                          style={{ color: "var(--success)" }}
                        >
                          <i className="fas fa-user-plus"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => handleEdit(company)}
                          title="แก้ไข"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost"
                          onClick={() => handleDelete(company.id)}
                          title="ลบ"
                          style={{ color: "var(--error)" }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowModal(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 700, padding: 32, position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 18, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>
              <i className="fas fa-building" style={{ marginRight: 10, color: "var(--primary)" }}></i>
              {editingCompany ? "แก้ไขข้อมูลบริษัท" : "เพิ่มบริษัทใหม่"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">ชื่อบริษัท *</label>
                <input 
                  className="field-input" 
                  placeholder="เช่น บริษัท ABC จำกัด" 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>

              <div className="field-group">
                <label className="field-label">รายละเอียด</label>
                <textarea 
                  className="field-input" 
                  placeholder="รายละเอียดเกี่ยวกับบริษัท" 
                  value={form.description} 
                  onChange={(e) => setForm({...form, description: e.target.value})} 
                  rows={3}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field-group">
                  <label className="field-label">อุตสาหกรรม</label>
                  <input 
                    className="field-input" 
                    placeholder="เช่น เทคโนโลยี" 
                    value={form.industry} 
                    onChange={(e) => setForm({...form, industry: e.target.value})} 
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">เว็บไซต์</label>
                  <input 
                    className="field-input" 
                    type="url"
                    placeholder="https://example.com" 
                    value={form.website} 
                    onChange={(e) => setForm({...form, website: e.target.value})} 
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">ที่อยู่</label>
                <textarea 
                  className="field-input" 
                  placeholder="ที่อยู่บริษัท" 
                  value={form.address} 
                  onChange={(e) => setForm({...form, address: e.target.value})} 
                  rows={2}
                />
              </div>

              <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>ข้อมูลติดต่อ</h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="field-group">
                    <label className="field-label">ชื่อผู้ติดต่อ</label>
                    <input 
                      className="field-input" 
                      placeholder="ชื่อ-นามสกุล" 
                      value={form.contactPerson} 
                      onChange={(e) => setForm({...form, contactPerson: e.target.value})} 
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="field-group">
                      <label className="field-label">อีเมล</label>
                      <input 
                        className="field-input" 
                        type="email"
                        placeholder="contact@company.com" 
                        value={form.contactEmail} 
                        onChange={(e) => setForm({...form, contactEmail: e.target.value})} 
                      />
                    </div>

                    <div className="field-group">
                      <label className="field-label">เบอร์โทร</label>
                      <input 
                        className="field-input" 
                        type="tel"
                        placeholder="0812345678" 
                        value={form.contactPhone} 
                        onChange={(e) => setForm({...form, contactPhone: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                  {editingCompany ? "บันทึกการแก้ไข" : "เพิ่มบริษัท"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showUserModal && selectedCompany && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowUserModal(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 500, padding: 32, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowUserModal(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 18, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>
              <i className="fas fa-user-plus" style={{ marginRight: 10, color: "var(--success)" }}></i>
              สร้าง User สำหรับบริษัท
            </h2>

            <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {selectedCompany.name}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                สร้าง User ที่สามารถจัดการบริษัทนี้ได้
              </p>
            </div>

            <form onSubmit={handleSubmitUser} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">Username *</label>
                <input 
                  className="field-input" 
                  value={userForm.username} 
                  onChange={(e) => setUserForm({...userForm, username: e.target.value})} 
                  required 
                />
              </div>

              <div className="field-group">
                <label className="field-label">Password *</label>
                <input 
                  className="field-input" 
                  type="password"
                  value={userForm.password} 
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})} 
                  required 
                />
              </div>

              <div className="field-group">
                <label className="field-label">Display Name *</label>
                <input 
                  className="field-input" 
                  value={userForm.displayName} 
                  onChange={(e) => setUserForm({...userForm, displayName: e.target.value})} 
                  required 
                />
              </div>

              <div className="field-group">
                <label className="field-label">Email</label>
                <input 
                  className="field-input" 
                  type="email"
                  value={userForm.email} 
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})} 
                />
              </div>

              <div style={{ padding: 12, background: "var(--success-50)", borderRadius: 8, border: "1px solid var(--success-200)" }}>
                <p style={{ fontSize: 12, color: "var(--success)", margin: 0 }}>
                  <i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>
                  User นี้จะได้รับ Role "COMPANY" และเชื่อมโยงกับบริษัทนี้อัตโนมัติ
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                  <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                  สร้าง User
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowUserModal(false)}>
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
