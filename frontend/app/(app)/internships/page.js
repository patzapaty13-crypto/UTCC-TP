"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const MODE = {
  ON_SITE: { label:"On-site", cls:"badge-blue"   },
  REMOTE:  { label:"Remote",  cls:"badge-purple"  },
  HYBRID:  { label:"Hybrid",  cls:"badge-green"   },
};

export default function InternshipsPage() {
  const [items,   setItems]   = useState([]);
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [modeFilter, setModeFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", location: "", mode: "ON_SITE", slots: 1 });
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [u, its] = await Promise.all([api.getMe(), api.getInternships()]);
      setUser(u);
      setItems(its);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const isAdmin = user?.roles?.some(r => ["ADMIN", "STAFF"].includes(r));
  const isStudent = user?.roles?.includes("STUDENT");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company) {
      setFormError("กรุณากรอกข้อมูลให้ครบถ้วน (ตำแหน่ง, บริษัท)");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await api.createInternship(form);
      setShowModal(false);
      setForm({ title: "", company: "", location: "", mode: "ON_SITE", slots: 1 });
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const shown = items
    .filter(i => {
      const matchesSearch = !search ||
        i.title?.toLowerCase().includes(search.toLowerCase()) ||
        i.company?.toLowerCase().includes(search.toLowerCase());
      const matchesMode = modeFilter === "ALL" || i.mode === modeFilter;
      return matchesSearch && matchesMode;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "slots") return (b.slots || 0) - (a.slots || 0);
      return 0;
    });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Career Development</p>
          <h1 className="page-title">ตำแหน่งฝึกงาน</h1>
          <p className="page-subtitle">โอกาสในการฝึกงานระดับมืออาชีพกับองค์กรชั้นนำทั้งในและต่างประเทศ</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {isStudent && (
            <Link href="/applications" className="btn btn-secondary">
              <i className="fas fa-list-check"></i> ใบสมัครของฉัน
            </Link>
          )}
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus"></i> เพิ่มตำแหน่ง
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12 }}>
          <div style={{ position:"relative" }}>
            <i className="fas fa-search" style={{
              position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
              color:"var(--n-400)", fontSize:13, pointerEvents:"none",
            }}></i>
            <input
              className="field-input"
              style={{ paddingLeft:40, width: "100%" }}
              placeholder="ค้นหาตำแหน่งหรือบริษัท..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select 
            value={modeFilter} 
            onChange={(e) => setModeFilter(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8 }}
          >
            <option value="ALL">ทุกรูปแบบ</option>
            <option value="ON_SITE">On-site</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8 }}
          >
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="slots">ที่ว่างมากสุด</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Loading */}
      {loading && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:90, borderRadius:16 }}></div>)}
        </div>
      )}

      {/* Empty */}
      {!loading && shown.length === 0 && !error && (
        <div className="data-table-wrap">
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-briefcase"></i></div>
            <h3>{search ? "ไม่พบผลลัพธ์" : "ยังไม่มีตำแหน่งว่าง"}</h3>
            <p>{search ? `ไม่พบตำแหน่งที่ตรงกับ "${search}"` : "ยังไม่มีตำแหน่งฝึกงานในระบบ กรุณาตรวจสอบใหม่ในภายหลัง"}</p>
            {search ? (
               <button className="btn btn-secondary" onClick={() => setSearch("")}>ล้างการค้นหา</button>
            ) : (
               <button className="btn btn-primary" onClick={() => setShowModal(true)}>เพิ่มตำแหน่ง</button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && shown.length > 0 && (
        <div className="data-table-wrap">
          {/* Summary bar */}
          <div style={{ padding:"14px 24px", borderBottom:"1px solid var(--border)",
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:"var(--text-muted)" }}>
              {shown.length} ตำแหน่ง{search && ` • ค้นหา "${search}"`}
            </span>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--success)", display:"flex", alignItems:"center", gap:6 }}>
              <span className="dot dot-green dot-pulse"></span>
              {shown.reduce((acc, i) => acc + (i.slots || 0), 0)} ตำแหน่งว่างทั้งหมด
            </span>
          </div>

          {shown.map((pos, idx) => {
            const mode = MODE[pos.mode] || { label: pos.mode || "—", cls: "badge-gray" };
            const isDeadlinePassed = pos.applicationDeadline && new Date(pos.applicationDeadline) < new Date();
            const canApply = pos.slots > 0 && !isDeadlinePassed;
            
            return (
              <div
                key={pos.id}
                style={{
                  display:"flex", alignItems:"center", gap:20,
                  padding:"20px 24px",
                  borderBottom: idx < shown.length - 1 ? "1px solid var(--n-50)" : "none",
                  transition:"background var(--transition)",
                }}
                onMouseEnter={e => e.currentTarget.style.background="var(--n-50)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                {/* Logo placeholder */}
                <div style={{
                  width:48, height:48, borderRadius:14, flexShrink:0,
                  background:"var(--n-900)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:18, fontWeight:900, color:"white",
                }}>
                  {(pos.company || "?").charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:6 }}>
                    <h3 style={{ fontSize:14, fontWeight:800, color:"var(--text-primary)" }}>{pos.title}</h3>
                    <span className={`badge ${mode.cls}`}>{mode.label}</span>
                    {pos.internshipType && (
                      <span className="badge badge-purple" style={{ fontSize:11 }}>
                        {pos.internshipType === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize:13, color:"var(--text-muted)", display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
                    <span><i className="fas fa-building" style={{ marginRight:5, color:"var(--n-300)" }}></i>{pos.company}</span>
                    {pos.location && <span><i className="fas fa-location-dot" style={{ marginRight:5, color:"var(--n-300)" }}></i>{pos.location}</span>}
                    {(pos.salaryMin || pos.salaryMax) && (
                      <span style={{ color:"var(--success)", fontWeight:600 }}>
                        <i className="fas fa-money-bill-wave" style={{ marginRight:5 }}></i>
                        {pos.salaryMin && pos.salaryMax 
                          ? `${pos.salaryMin.toLocaleString()}-${pos.salaryMax.toLocaleString()}`
                          : pos.salaryMin 
                            ? `${pos.salaryMin.toLocaleString()}+`
                            : `${pos.salaryMax.toLocaleString()}`
                        } ฿
                      </span>
                    )}
                    {pos.applicationDeadline && (
                      <span style={{ color: isDeadlinePassed ? "var(--error)" : "var(--warning)", fontWeight:600 }}>
                        <i className="fas fa-clock" style={{ marginRight:5 }}></i>
                        ปิดรับ: {new Date(pos.applicationDeadline).toLocaleDateString("th-TH", { day:"numeric", month:"short" })}
                      </span>
                    )}
                  </p>
                </div>

                {/* Slots */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"var(--text-muted)", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:3 }}>ที่ว่าง</p>
                  <p style={{ fontSize:20, fontWeight:900, color: pos.slots > 0 ? "var(--success)" : "var(--error)", lineHeight:1 }}>{pos.slots}</p>
                </div>

                <Link 
                  href={`/internships/${pos.id}`} 
                  className={`btn ${canApply ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                  style={{ flexShrink:0 }}
                >
                  {canApply ? "สมัคร →" : "ดูรายละเอียด"}
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Overlay */}
      {showModal && (
        <div style={{
          position:"fixed", inset:0, zIndex:999,
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)",
        }}>
          <div className="card animate-scale-in" style={{ width:"100%", maxWidth:480, padding:32, position:"relative" }}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position:"absolute", top:20, right:24, background:"none", border:"none", fontSize:18, color:"var(--n-400)", cursor:"pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>
            <h2 style={{ fontSize:20, fontWeight:900, marginBottom:24, color:"var(--text-primary)" }}>เพิ่มตำแหน่งฝึกงานใหม่</h2>
            
            {formError && <div className="alert alert-error" style={{ marginBottom:16 }}><i className="fas fa-circle-exclamation"></i>{formError}</div>}
            
            <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="field-group">
                <label className="field-label">บริษัท *</label>
                <input className="field-input" value={form.company} onChange={e => setForm({...form, company:e.target.value})} required disabled={submitting} />
              </div>
              <div className="field-group">
                <label className="field-label">ตำแหน่ง *</label>
                <input className="field-input" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required disabled={submitting} />
              </div>
              <div className="field-group">
                <label className="field-label">สถานที่</label>
                <input className="field-input" value={form.location} onChange={e => setForm({...form, location:e.target.value})} disabled={submitting} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div className="field-group">
                  <label className="field-label">รูปแบบ</label>
                  <select className="field-input" value={form.mode} onChange={e => setForm({...form, mode:e.target.value})} disabled={submitting}>
                    <option value="ON_SITE">On-site</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>
                <div className="field-group">
                  <label className="field-label">จำนวนที่รับ</label>
                  <input className="field-input" type="number" min="1" value={form.slots} onChange={e => setForm({...form, slots:parseInt(e.target.value) || 1})} disabled={submitting} />
                </div>
              </div>
              <div style={{ display:"flex", gap:12, marginTop:8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={submitting}>
                  {submitting ? "กำลังบันทึก..." : "ยืนยันการเพิ่มตำแหน่ง"}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex:1 }} onClick={() => setShowModal(false)} disabled={submitting}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
