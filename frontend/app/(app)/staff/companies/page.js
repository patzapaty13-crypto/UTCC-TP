"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { useToast } from "@/components/Toast";

export default function StaffCompaniesPage() {
  const { addToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "", industry: "", location: "", contactName: "", contactEmail: "", status: "ACTIVE",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getCompanies();
      setItems(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", industry: "", location: "", contactName: "", contactEmail: "", status: "ACTIVE" });
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name || "",
      industry: c.industry || "",
      location: c.location || "",
      contactName: c.contactName || "",
      contactEmail: c.contactEmail || "",
      status: c.status || "ACTIVE",
    });
    setShowModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await api.updateCompany(editing.id, form);
      else await api.createCompany(form);
      addToast(editing ? "อัปเดตบริษัทแล้ว" : "สร้างบริษัทแล้ว", "success");
      setShowModal(false);
      load();
    } catch (err) {
      addToast("ผิดพลาด: " + err.message, "error");
    } finally { setSaving(false); }
  };

  const remove = async (c) => {
    if (!confirm(`ลบบริษัท "${c.name}"?`)) return;
    try {
      await api.deleteCompany(c.id);
      addToast("ลบแล้ว", "success");
      load();
    } catch (err) { addToast("ลบไม่สำเร็จ: " + err.message, "error"); }
  };

  const filtered = items.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleDashboardShell role="STAFF" title="จัดการบริษัท" subtitle="ลงทะเบียนและปรับปรุงข้อมูลบริษัทพันธมิตร">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <input
          type="search"
          placeholder="ค้นหาชื่อ/อุตสาหกรรม..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="field-input"
          style={{ maxWidth: 320 }}
        />
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fas fa-plus"></i> เพิ่มบริษัท
        </button>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 14, marginTop: 16 }}></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center", marginTop: 16 }}>
          <i className="fas fa-building" style={{ fontSize: 40, color: "var(--n-300)" }}></i>
          <h3 style={{ marginTop: 16 }}>ไม่มีบริษัท</h3>
        </div>
      ) : (
        <div className="data-table-wrap" style={{ marginTop: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ชื่อบริษัท</th>
                <th>อุตสาหกรรม</th>
                <th>ที่ตั้ง</th>
                <th>ผู้ติดต่อ</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td>{c.industry || "-"}</td>
                  <td>{c.location || "-"}</td>
                  <td>{c.contactName ? `${c.contactName} (${c.contactEmail || "-"})` : "-"}</td>
                  <td><span className={`badge badge-${c.status === "ACTIVE" ? "green" : "gray"}`}>{c.status}</span></td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => openEdit(c)} style={{ padding: "6px 10px", fontSize: 12 }}>
                      <i className="fas fa-pen"></i>
                    </button>
                    <button className="btn btn-ghost" onClick={() => remove(c)} style={{ padding: "6px 10px", fontSize: 12, color: "#DC2626" }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editing ? "แก้ไขบริษัท" : "เพิ่มบริษัท"}>
          <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <F label="ชื่อบริษัท *" val={form.name} set={v => setForm({ ...form, name: v })} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <F label="อุตสาหกรรม" val={form.industry} set={v => setForm({ ...form, industry: v })} />
              <F label="ที่ตั้ง" val={form.location} set={v => setForm({ ...form, location: v })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <F label="ชื่อผู้ติดต่อ" val={form.contactName} set={v => setForm({ ...form, contactName: v })} />
              <F label="อีเมลติดต่อ" type="email" val={form.contactEmail} set={v => setForm({ ...form, contactEmail: v })} />
            </div>
            <div className="field-group">
              <label className="field-label">สถานะ</label>
              <select className="field-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึก"}</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>ยกเลิก</button>
            </div>
          </form>
        </Modal>
      )}
    </RoleDashboardShell>
  );
}

function F({ label, val, set, type = "text", required }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      <input className="field-input" type={type} value={val} required={required} onChange={e => set(e.target.value)} />
    </div>
  );
}

function Modal({ children, title, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: 20 }}>
      <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 560, padding: 28, position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 20, background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--n-400)" }}>
          <i className="fas fa-xmark"></i>
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
