"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

const MODE = {
  ON_SITE: { label:"On-site", cls:"badge-blue"   },
  REMOTE:  { label:"Remote",  cls:"badge-purple"  },
  HYBRID:  { label:"Hybrid",  cls:"badge-green"   },
};

export default function InternshipDetailsPage({ params }) {
  // Extract id from params
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    // There is no specific getInternship(id) by default in our api.js
    // I will fetch all and find the one matching id, or standard getInternships logic
    api.getInternships()
      .then(items => {
        const found = items.find(i => i.id === id);
        if (found) setPos(found);
        else setError("ไม่พบตำแหน่งนี้ในระบบ");
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.applyForInternship({ internshipId: id });
      setApplySuccess(true);
    } catch (e) {
      alert("ไม่สามารถสมัครได้: " + e.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <Link href="/internships" className="btn btn-ghost" style={{ width:"fit-content", padding:0 }}><i className="fas fa-arrow-left"></i> กลับหน้ารวมตำแหน่งว่าง</Link>
      <div className="skeleton" style={{ height:300, borderRadius:24 }}></div>
    </div>
  );

  if (error) return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <Link href="/internships" className="btn btn-ghost" style={{ width:"fit-content", padding:0 }}><i className="fas fa-arrow-left"></i> กลับ</Link>
      <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i> ไม่พบข้อมูล: {error}</div>
    </div>
  );

  if (!pos) return null;

  const modeInfo = MODE[pos.mode] || { label: pos.mode, cls: "badge-gray" };

  return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      {/* Back Link */}
      <Link href="/internships" className="btn btn-ghost" style={{ width:"fit-content", padding:0, color:"var(--n-500)" }}>
        <i className="fas fa-arrow-left"></i> กลับหน้ารวมตำแหน่งว่าง
      </Link>

      {/* Hero Header */}
      <div style={{
        background: "linear-gradient(135deg, #020617 0%, #0F172A 100%)",
        borderRadius: 24, padding: "48px 40px",
        position: "relative", overflow: "hidden", border: "1px solid var(--n-800)"
      }}>
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize:"24px 24px",
        }}></div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", gap:24, alignItems:"center" }}>
            <div style={{
                width:80, height:80, borderRadius:20, flexShrink:0,
                background:"var(--n-800)", border:"1px solid var(--n-700)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:32, fontWeight:900, color:"white",
              }}>
                {(pos.company || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8 }}>
                <span className={`badge ${modeInfo.cls}`} style={{ fontSize:12, padding:"4px 10px" }}>{modeInfo.label}</span>
                <span className="badge badge-gray" style={{ fontSize:12, padding:"4px 10px" }}><i className="fas fa-location-dot" style={{marginRight:5}}></i>{pos.location || "ไม่ได้ระบุสถานที่"}</span>
              </div>
              <h1 style={{ fontSize:32, fontWeight:900, color:"white", letterSpacing:"-1px", lineHeight:1.2, marginBottom:10 }}>
                {pos.title}
              </h1>
              <p style={{ fontSize:16, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>
                {pos.company}
              </p>
            </div>
          </div>

          <div style={{ textAlign:"right" }}>
            {applySuccess ? (
              <div className="alert alert-success" style={{ padding:"12px 20px" }}>
                <i className="fas fa-check-circle"></i> ส่งใบสมัครสำเร็จ
              </div>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={applying || pos.slots <= 0} style={{ boxShadow:"0 8px 24px rgba(37,99,235,0.4)" }}>
                {applying ? "กำลังดำเนินการ..." : "ยื่นใบสมัคร"}
              </button>
            )}
            {pos.slots <= 0 && !applySuccess && (
               <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:12 }}>ตำแหน่งเต็มแล้ว</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Area */}
      <div className="grid-3" style={{ gap:20 }}>
        {/* Left Col (2 span) */}
        <div className="card" style={{ padding:32, gridColumn:"span 2" }}>
            <h3 style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)", marginBottom:20 }}>รายละเอียดตำแหน่ง</h3>
            <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.8 }}>
              {pos.description || "ตำแหน่งนี้ยังไม่ได้ใส่รายละเอียดงาน กรุณาติดต่ออาจารย์ที่ปรึกษาเพื่อรับข้อมูลเพิ่มเติมเกี่ยวกับคุณสมบัติและหน้าที่รับผิดชอบของตำแหน่งนักศึกษาฝึกงาน"}
            </p>
        </div>

        {/* Right Col */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          <div className="card" style={{ padding:28 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>ช่องว่างที่เปิดรับ</p>
            <p style={{ fontSize:40, fontWeight:900, color:"var(--success)", lineHeight:1, marginBottom:4 }}>{pos.slots || 0}</p>
            <p style={{ fontSize:13, color:"var(--text-muted)", fontWeight:500 }}>ตำแหน่ง</p>
          </div>

          <div className="card" style={{ padding:28 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>วิธีการทำงาน</p>
                <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>{pos.mode}</p>
              </div>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>วันที่เปิดรับ</p>
                <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>
                  {pos.createdAt ? new Date(pos.createdAt).toLocaleDateString("th-TH") : "ไม่ระบุ"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
