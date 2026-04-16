"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const STATUS = {
  PUBLISHED: { label: "เปิดรับสมัคร", cls: "badge-green" },
  DRAFT:     { label: "ร่าง",         cls: "badge-yellow" },
  COMPLETED: { label: "เสร็จสิ้น",    cls: "badge-gray" },
  CANCELLED: { label: "ยกเลิก",       cls: "badge-red" },
};

export default function TripsPage() {
  const [trips,   setTrips]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("ALL");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", location: "", objective: "", capacity: 0 });
  const [formError, setFormError] = useState("");

  const loadTrips = () => {
    setLoading(true);
    api.getTrips()
      .then(setTrips)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadTrips, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.location) {
      setFormError("กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อทริป, สถานที่)");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      await api.createTrip(form);
      setShowModal(false);
      setForm({ title: "", location: "", objective: "", capacity: 0 });
      loadTrips();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filters = ["ALL", "PUBLISHED", "DRAFT", "COMPLETED"];
  const shown = filter === "ALL" ? trips : trips.filter(t => t.status === filter);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Academic Programme</p>
          <h1 className="page-title">ทริปศึกษาดูงาน</h1>
          <p className="page-subtitle">บริหารจัดการแผนทริปศึกษาดูงานและกิจกรรมภาคสนามของมหาวิทยาลัย</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i> เสนอทริปใหม่
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display:"flex", gap:6, padding:"6px", background:"white", borderRadius:14, border:"1px solid var(--border)", width:"fit-content", boxShadow:"var(--shadow-sm)" }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding:"7px 16px", borderRadius:10, border:"none", cursor:"pointer",
              fontSize:12.5, fontWeight:700, transition:"all var(--transition)",
              background: filter === f ? "var(--n-900)" : "transparent",
              color: filter === f ? "white" : "var(--text-muted)",
            }}
          >
            {f === "ALL" ? "ทั้งหมด" : STATUS[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="grid-3" style={{ gap:16 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:280, borderRadius:20 }}></div>)}
        </div>
      )}

      {/* Empty */}
      {!loading && shown.length === 0 && !error && (
        <div className="data-table-wrap">
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-route"></i></div>
            <h3>ยังไม่มีทริปที่กำหนด</h3>
            <p>ยังไม่มีทริปศึกษาดูงานในระบบ ติดต่ออาจารย์ที่ปรึกษาเพื่อเสนอทริปใหม่</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>เสนอทริปแรก</button>
          </div>
        </div>
      )}

      {/* Trip Grid */}
      {!loading && shown.length > 0 && (
        <div className="grid-3" style={{ gap:16 }}>
          {shown.map(trip => {
            const statusInfo = STATUS[trip.status] || { label: trip.status, cls: "badge-gray" };
            return (
              <div
                key={trip.id}
                className="card card-hover"
                style={{ overflow:"hidden", display:"flex", flexDirection:"column" }}
              >
                {/* Card Image Area */}
                <div style={{
                  height:160,
                  background:"linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #2563EB 100%)",
                  position:"relative", display:"flex", flexDirection:"column",
                  justifyContent:"flex-end", padding:"20px 24px",
                }}>
                  {/* Grid pattern overlay */}
                  <div style={{
                    position:"absolute", inset:0,
                    backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize:"24px 24px",
                  }}></div>

                  <span className={`badge ${statusInfo.cls}`} style={{ alignSelf:"flex-start", position:"relative" }}>
                    {statusInfo.label}
                  </span>
                  <h3 style={{
                    fontSize:16.5, fontWeight:800, color:"white",
                    marginTop:10, lineHeight:1.25,
                    position:"relative", letterSpacing:"-0.3px",
                  }}>
                    {trip.title}
                  </h3>
                </div>

                {/* Card Body */}
                <div style={{ padding:"20px 24px", flex:1, display:"flex", flexDirection:"column", gap:16 }}>
                  {trip.objective && (
                    <p style={{ fontSize:13, color:"var(--text-muted)", lineHeight:1.5,
                      overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {trip.objective}
                    </p>
                  )}

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    <InfoChip icon="fa-location-dot" color="#2563EB" label={trip.location || "—"} />
                    <InfoChip icon="fa-users"         color="#059669" label={`${trip.capacity || 0} คน`} />
                    {trip.startDate && (
                      <InfoChip
                        icon="fa-calendar" color="#D97706" span={2}
                        label={formatDate(trip.startDate) + (trip.endDate ? ` — ${formatDate(trip.endDate)}` : "")}
                      />
                    )}
                  </div>

                  <div style={{ marginTop:"auto", paddingTop:16, borderTop:"1px solid var(--n-50)",
                    display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:10.5, fontFamily:"monospace", color:"var(--n-300)" }}>
                      {trip.id.slice(0,8).toUpperCase()}
                    </span>
                    <Link href={`/trips/${trip.id}`} className="btn btn-secondary btn-sm">
                      ดูรายละเอียด <i className="fas fa-arrow-right" style={{ fontSize:10 }}></i>
                    </Link>
                  </div>
                </div>
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
            <h2 style={{ fontSize:20, fontWeight:900, marginBottom:24, color:"var(--text-primary)" }}>เสนอทริปใหม่</h2>
            
            {formError && <div className="alert alert-error" style={{ marginBottom:16 }}><i className="fas fa-circle-exclamation"></i>{formError}</div>}
            
            <form onSubmit={handleCreate} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div className="field-group">
                <label className="field-label">ชื่อทริป *</label>
                <input className="field-input" value={form.title} onChange={e => setForm({...form, title:e.target.value})} required disabled={submitting} />
              </div>
              <div className="field-group">
                <label className="field-label">สถานที่ *</label>
                <input className="field-input" value={form.location} onChange={e => setForm({...form, location:e.target.value})} required disabled={submitting} />
              </div>
              <div className="field-group">
                <label className="field-label">จำนวนที่รับ (คน)</label>
                <input className="field-input" type="number" min="0" value={form.capacity} onChange={e => setForm({...form, capacity:parseInt(e.target.value) || 0})} disabled={submitting} />
              </div>
              <div className="field-group">
                <label className="field-label">วัตถุประสงค์</label>
                <textarea className="field-input field-textarea" value={form.objective} onChange={e => setForm({...form, objective:e.target.value})} disabled={submitting}></textarea>
              </div>
              <div style={{ display:"flex", gap:12, marginTop:8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex:1 }} disabled={submitting}>
                  {submitting ? "กำลังบันทึก..." : "ยืนยันการสร้างทริป"}
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

function InfoChip({ icon, color, label, span = 1 }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:7,
      background:"var(--n-50)", borderRadius:10, padding:"8px 10px",
      gridColumn: span === 2 ? "1 / -1" : undefined,
    }}>
      <i className={`fas ${icon}`} style={{ color, fontSize:12, width:14, textAlign:"center", flexShrink:0 }}></i>
      <span style={{ fontSize:12.5, fontWeight:600, color:"var(--text-secondary)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {label}
      </span>
    </div>
  );
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("th-TH", { day:"numeric", month:"short", year:"numeric" });
}
