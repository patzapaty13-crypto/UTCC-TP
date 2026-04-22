"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { InternshipFilters } from "@/components/SmartFilters";
import { InternshipTable } from "@/components/ExpandableTable";
import { NoInternships, NoSearchResults } from "@/components/EmptyState";

const MODE = {
  ON_SITE: { label:"On-site", cls:"badge-blue"   },
  REMOTE:  { label:"Remote",  cls:"badge-purple"  },
  HYBRID:  { label:"Hybrid",  cls:"badge-green"   },
};

export default function InternshipsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
      setFilteredItems(its);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Handle smart filter changes
  const handleFilterChange = useCallback((filtered, filterState) => {
    setFilteredItems(filtered);
    setSearchTerm(filterState.searchTerm || "");
  }, []);

  const handleApply = (internship) => {
    // Redirect to internship detail page where user can apply with full form
    window.location.href = `/internships/${internship.id}`;
  };

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

      {/* Smart Filters */}
      <InternshipFilters 
        internships={items}
        onFilter={handleFilterChange}
      />

      {/* Error */}
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Loading */}
      {loading && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:90, borderRadius:16 }}></div>)}
        </div>
      )}

      {/* Empty States */}
      {!loading && filteredItems.length === 0 && !error && (
        searchTerm ? (
          <NoSearchResults 
            searchTerm={searchTerm}
            onClearSearch={() => {
              setSearchTerm("");
              setFilteredItems(items);
            }}
          />
        ) : (
          <NoInternships userRole={isStudent ? "STUDENT" : "COMPANY"} />
        )
      )}

      {/* Expandable Table */}
      {!loading && filteredItems.length > 0 && (
        <InternshipTable
          internships={filteredItems}
          onApply={handleApply}
          userRole={isStudent ? "STUDENT" : "COMPANY"}
        />
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
