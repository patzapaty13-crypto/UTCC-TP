"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

const ROLES = {
  STUDENT: { label: "นักศึกษา", color: "var(--primary)", icon: "user-graduate" },
  COMPANY: { label: "บริษัท", color: "var(--success)", icon: "building" },
  ADVISOR: { label: "อาจารย์ที่ปรึกษา", color: "var(--purple)", icon: "chalkboard-user" },
  STAFF: { label: "เจ้าหน้าที่", color: "var(--warning)", icon: "user-tie" },
  ADMIN: { label: "ผู้ดูแลระบบ", color: "var(--error)", icon: "user-shield" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    displayName: "",
    email: "",
    roles: [],
    major: "",
    academicYear: "",
    companyId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const [usrs, comps] = await Promise.all([
        api.getUsers(),
        api.getCompanies()
      ]);
      setUsers(usrs || []);
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
      if (editingUser) {
        await api.updateUser(editingUser.id, form);
      } else {
        await api.createUser(form);
      }
      setShowModal(false);
      setEditingUser(null);
      setForm({ username: "", password: "", displayName: "", email: "", roles: [], major: "", academicYear: "", companyId: "" });
      await loadData();
      alert(editingUser ? "อัปเดตผู้ใช้สำเร็จ" : "เพิ่มผู้ใช้สำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username || "",
      password: "", // Don't show password
      displayName: user.displayName || "",
      email: user.email || "",
      roles: user.roles || [],
      major: user.major || "",
      academicYear: user.academicYear || "",
      companyId: user.companyId || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) return;
    try {
      await api.deleteUser(id);
      await loadData();
      alert("ลบผู้ใช้สำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const toggleRole = (role) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role) 
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = !searchTerm || 
      (u.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.displayName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || u.roles?.includes(roleFilter);
    
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users.length,
    students: users.filter(u => u.roles?.includes("STUDENT")).length,
    companies: users.filter(u => u.roles?.includes("COMPANY")).length,
    advisors: users.filter(u => u.roles?.includes("ADVISOR")).length,
    staff: users.filter(u => u.roles?.includes("STAFF")).length,
    admins: users.filter(u => u.roles?.includes("ADMIN")).length,
  };

  return (
    <RoleDashboardShell 
      role="ADMIN" 
      title="จัดการผู้ใช้" 
      subtitle="เพิ่ม แก้ไข และจัดการบัญชีผู้ใช้ในระบบ"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-users" style={{ marginRight: 6 }}></i>
            ทั้งหมด
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: "var(--primary)" }}>{stats.total}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-user-graduate" style={{ marginRight: 6 }}></i>
            นักศึกษา
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: ROLES.STUDENT.color }}>{stats.students}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-building" style={{ marginRight: 6 }}></i>
            บริษัท
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: ROLES.COMPANY.color }}>{stats.companies}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-chalkboard-user" style={{ marginRight: 6 }}></i>
            อาจารย์
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: ROLES.ADVISOR.color }}>{stats.advisors}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-user-tie" style={{ marginRight: 6 }}></i>
            เจ้าหน้าที่
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: ROLES.STAFF.color }}>{stats.staff}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-user-shield" style={{ marginRight: 6 }}></i>
            ผู้ดูแล
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: ROLES.ADMIN.color }}>{stats.admins}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, flex: 1 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
              <i className="fas fa-search" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14 }}></i>
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้ใช้, ชื่อ, อีเมล..."
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

            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
            >
              <option value="ALL">ทุกบทบาท</option>
              {Object.entries(ROLES).map(([key, role]) => (
                <option key={key} value={key}>{role.label}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingUser(null);
              setForm({ username: "", password: "", displayName: "", email: "", roles: [], major: "", academicYear: "" });
              setShowModal(true);
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
            เพิ่มผู้ใช้
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 13, color: "var(--text-muted)" }}>
          แสดง {filteredUsers.length} จาก {users.length} ผู้ใช้
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }}></div>)}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-users"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
            {searchTerm || roleFilter !== "ALL" ? "ไม่พบผู้ใช้" : "ยังไม่มีผู้ใช้"}
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            {searchTerm || roleFilter !== "ALL" ? "ลองเปลี่ยนเงื่อนไขการค้นหา" : "เริ่มต้นโดยการเพิ่มผู้ใช้"}
          </p>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ผู้ใช้</th>
                <th>อีเมล</th>
                <th>บทบาท</th>
                <th>ข้อมูลเพิ่มเติม</th>
                <th style={{ width: 120 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: 12, 
                        background: "var(--primary-50)",
                        color: "var(--primary)",
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 900
                      }}>
                        {(user.displayName || user.username || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700 }}>
                          {user.displayName || user.username}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p style={{ fontSize: 13 }}>{user.email || "-"}</p>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {user.roles?.map(role => {
                        const roleInfo = ROLES[role] || { label: role, color: "var(--n-500)", icon: "user" };
                        return (
                          <span 
                            key={role} 
                            className="badge"
                            style={{ 
                              background: roleInfo.color + "18",
                              color: roleInfo.color,
                              border: `1px solid ${roleInfo.color}40`,
                              fontSize: 11
                            }}
                          >
                            <i className={`fas fa-${roleInfo.icon}`} style={{ marginRight: 4 }}></i>
                            {roleInfo.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {user.major && <div><i className="fas fa-book" style={{ marginRight: 6 }}></i>{user.major}</div>}
                      {user.academicYear && <div><i className="fas fa-calendar" style={{ marginRight: 6 }}></i>ปี {user.academicYear}</div>}
                      {!user.major && !user.academicYear && "-"}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEdit(user)}
                        title="แก้ไข"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(user.id)}
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
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowModal(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 600, padding: 32, position: "relative", maxHeight: "90vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 18, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>
              <i className="fas fa-user-plus" style={{ marginRight: 10, color: "var(--primary)" }}></i>
              {editingUser ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field-group">
                  <label className="field-label">ชื่อผู้ใช้ *</label>
                  <input 
                    className="field-input" 
                    placeholder="username" 
                    value={form.username} 
                    onChange={(e) => setForm({...form, username: e.target.value})} 
                    required 
                    disabled={!!editingUser}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">รหัสผ่าน {!editingUser && "*"}</label>
                  <input 
                    className="field-input" 
                    type="password"
                    placeholder={editingUser ? "เว้นว่างถ้าไม่เปลี่ยน" : "password"} 
                    value={form.password} 
                    onChange={(e) => setForm({...form, password: e.target.value})} 
                    required={!editingUser}
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">ชื่อแสดง</label>
                <input 
                  className="field-input" 
                  placeholder="ชื่อ-นามสกุล" 
                  value={form.displayName} 
                  onChange={(e) => setForm({...form, displayName: e.target.value})} 
                />
              </div>

              <div className="field-group">
                <label className="field-label">อีเมล</label>
                <input 
                  className="field-input" 
                  type="email"
                  placeholder="user@example.com" 
                  value={form.email} 
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                />
              </div>

              <div className="field-group">
                <label className="field-label">บทบาท *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {Object.entries(ROLES).map(([key, role]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleRole(key)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: `2px solid ${form.roles.includes(key) ? role.color : "var(--border)"}`,
                        background: form.roles.includes(key) ? role.color + "18" : "transparent",
                        color: form.roles.includes(key) ? role.color : "var(--text-secondary)",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all var(--transition)"
                      }}
                    >
                      <i className={`fas fa-${role.icon}`} style={{ marginRight: 6 }}></i>
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.roles.includes("STUDENT") && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  <div className="field-group">
                    <label className="field-label">สาขาวิชา</label>
                    <input 
                      className="field-input" 
                      placeholder="เช่น วิทยาการคอมพิวเตอร์" 
                      value={form.major} 
                      onChange={(e) => setForm({...form, major: e.target.value})} 
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">ชั้นปี</label>
                    <input 
                      className="field-input" 
                      type="number"
                      min="1"
                      max="6"
                      placeholder="1-6" 
                      value={form.academicYear} 
                      onChange={(e) => setForm({...form, academicYear: e.target.value})} 
                    />
                  </div>
                </div>
              )}

              {form.roles.includes("COMPANY") && (
                <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                  <div className="field-group">
                    <label className="field-label">บริษัท</label>
                    <select 
                      className="field-input"
                      value={form.companyId} 
                      onChange={(e) => setForm({...form, companyId: e.target.value})}
                    >
                      <option value="">-- เลือกบริษัท --</option>
                      {companies.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                      เลือกบริษัทที่ user นี้จะจัดการ (ถ้าไม่เลือก user จะต้องสร้าง company profile เอง)
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                  {editingUser ? "บันทึกการแก้ไข" : "เพิ่มผู้ใช้"}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
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
