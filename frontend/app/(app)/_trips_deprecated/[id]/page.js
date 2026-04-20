"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const STATUS = {
  PUBLISHED: { label: "เปิดรับสมัคร", cls: "badge-green" },
  DRAFT:     { label: "ร่าง",         cls: "badge-yellow" },
  COMPLETED: { label: "เสร็จสิ้น",    cls: "badge-gray" },
  CANCELLED: { label: "ยกเลิก",       cls: "badge-red" },
};

export default function TripDetailsPage({ params }) {
  // Extract id from params Promise
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    api.getTrip(id)
      .then(setTrip)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.applyForTrip({ tripId: id });
      setApplySuccess(true);
    } catch (e) {
      alert("ไม่สามารถสมัครได้: " + e.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <Link href="/trips" className="btn btn-ghost" style={{ width:"fit-content", padding:0 }}><i className="fas fa-arrow-left"></i> กลับไปหน้ารวมทริป</Link>
      <div className="skeleton" style={{ height:300, borderRadius:24 }}></div>
    </div>
  );

  if (error) return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <Link href="/trips" className="btn btn-ghost" style={{ width:"fit-content", padding:0 }}><i className="fas fa-arrow-left"></i> กลับ</Link>
      <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i> ไม่พบข้อมูลทริป: {error}</div>
    </div>
  );

  if (!trip) return null;

  const statusInfo = STATUS[trip.status] || { label: trip.status, cls: "badge-gray" };

  return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Back Link */}
      <Link href="/trips" className="btn btn-ghost" style={{ width:"fit-content", padding:0, color:"var(--n-500)" }}>
        <i className="fas fa-arrow-left"></i> กลับไปหน้าระบบทริปศึกษาดูงาน
      </Link>

      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(135deg, #020617 0%, #1E3A8A 100%)",
        borderRadius: 24, padding: "48px 40px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize:"24px 24px",
        }}></div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative", zIndex:1 }}>
          <div style={{ maxWidth: 800 }}>
            <span className={`badge ${statusInfo.cls}`} style={{ marginBottom:16 }}>{statusInfo.label}</span>
            <h1 style={{ fontSize:32, fontWeight:900, color:"white", letterSpacing:"-1px", lineHeight:1.2, marginBottom:16 }}>
              {trip.title}
            </h1>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.7)", lineHeight:1.6, fontWeight:500 }}>
              {trip.objective || "ไม่มีรายละเอียดระบุไว้"}
            </p>
          </div>
          <div style={{ textAlign:"right" }}>
            {applySuccess ? (
              <div className="alert alert-success" style={{ padding:"12px 20px" }}>
                <i className="fas fa-check-circle"></i> สมัครสำเร็จแล้ว
              </div>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={applying || trip.status !== "PUBLISHED"} style={{ boxShadow:"0 8px 24px rgba(37,99,235,0.4)" }}>
                {applying ? "กำลังดำเนินการ..." : "สมัครเข้าร่วมทริปนี้"}
              </button>
            )}
            {trip.status !== "PUBLISHED" && !applySuccess && (
               <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:12 }}>ยังไม่เปิดรับสมัคร</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid-3" style={{ gap:20 }}>
        <div className="card" style={{ padding:28 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:"var(--n-50)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"var(--primary)", marginBottom:20 }}>
            <i className="fas fa-location-dot"></i>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>สถานที่</p>
          <p style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)" }}>{trip.location || "ไม่ระบุ"}</p>
          {trip.mapUrl && (
            <a href={trip.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display:"inline-block", marginTop:12, fontSize:13, fontWeight:600, color:"var(--primary)" }}>
              ดูแผนที่ <i className="fas fa-external-link-alt" style={{ fontSize:11 }}></i>
            </a>
          )}
        </div>

        <div className="card" style={{ padding:28 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:"var(--n-50)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#D97706", marginBottom:20 }}>
            <i className="fas fa-calendar"></i>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>กำหนดการ</p>
          <p style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)" }}>
            {trip.startDate ? new Date(trip.startDate).toLocaleDateString("th-TH", { day:"numeric", month:"long", year:"numeric" }) : "ไม่ระบุ"}
          </p>
          <p style={{ fontSize:13, color:"var(--text-muted)", marginTop:6, fontWeight:500 }}>
            ถึง {trip.endDate ? new Date(trip.endDate).toLocaleDateString("th-TH", { day:"numeric", month:"long", year:"numeric" }) : "ไม่ระบุ"}
          </p>
        </div>

        <div className="card" style={{ padding:28 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:"var(--n-50)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"#059669", marginBottom:20 }}>
            <i className="fas fa-users"></i>
          </div>
          <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>จำนวนที่รับ</p>
          <p style={{ fontSize:32, fontWeight:900, color:"var(--text-primary)", lineHeight:1, marginBottom:6 }}>{trip.capacity || 0}</p>
          <p style={{ fontSize:13, color:"var(--text-muted)", fontWeight:500 }}>นักศึกษาที่สามารถเข้าร่วมได้</p>
        </div>
      </div>
    </div>
  );
}
