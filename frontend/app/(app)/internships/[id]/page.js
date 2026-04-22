"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import ApplicationForm from "@/components/ApplicationForm";

const MODE = {
  ONSITE: { label:"On-site", cls:"badge-blue"   },
  REMOTE:  { label:"Remote",  cls:"badge-purple"  },
  HYBRID:  { label:"Hybrid",  cls:"badge-green"   },
};

export default function InternshipDetailsPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [pos, setPos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadInternship();
    loadUser();
  }, [id]);

  const loadInternship = () => {
    api.getInternship(id)
      .then(setPos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  const loadUser = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch (e) {
      console.error("Failed to load user:", e);
    }
  };

  const handleDelete = async () => {
    if (!confirm("คุณต้องการลบประกาศฝึกงานนี้ใช่ไหม?")) return;
    try {
      await api.deleteInternship(id);
      alert("ลบประกาศฝึกงานสำเร็จ");
      window.location.href = "/company/internships";
    } catch (e) {
      alert("ไม่สามารถลบได้: " + (e.message || ""));
    }
  };

  if (loading) return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <Link href="/internships" className="btn btn-ghost" style={{ width:"fit-content", padding:0 }}>
        <i className="fas fa-arrow-left"></i> กลับหน้ารวมตำแหน่งว่าง
      </Link>
      <div className="skeleton" style={{ height:300, borderRadius:24 }}></div>
    </div>
  );

  if (error) return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <Link href="/internships" className="btn btn-ghost" style={{ width:"fit-content", padding:0 }}>
        <i className="fas fa-arrow-left"></i> กลับ
      </Link>
      <div className="alert alert-error">
        <i className="fas fa-circle-exclamation"></i> ไม่พบข้อมูล: {error}
      </div>
    </div>
  );

  if (!pos) return null;

  const modeInfo = MODE[pos.mode] || { label: pos.mode, cls: "badge-gray" };
  const isDeadlinePassed = pos.applicationDeadline && new Date(pos.applicationDeadline) < new Date();
  const canApply = pos.slots > 0 && !isDeadlinePassed;

  return (
    <div className="animate-fade-in" style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/internships" className="btn btn-ghost" style={{ width:"fit-content", padding:0, color:"var(--n-500)" }}>
          <i className="fas fa-arrow-left"></i> กลับหน้ารวมตำแหน่งว่าง
        </Link>
        {currentUser && currentUser.roles?.includes("COMPANY") && (
          <div style={{ display: "flex", gap: 8 }}>
            <Link href={`/internships/${id}/edit`} className="btn btn-primary">
              <i className="fas fa-edit" style={{ marginRight: 8 }}></i>
              แก้ไข
            </Link>
            <button className="btn btn-danger" onClick={handleDelete}>
              <i className="fas fa-trash" style={{ marginRight: 8 }}></i>
              ลบ
            </button>
          </div>
        )}
      </div>

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

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative", zIndex:1, flexWrap:"wrap", gap:24 }}>
          <div style={{ display:"flex", gap:24, alignItems:"center", flex:1, minWidth:300 }}>
            <div style={{
                width:80, height:80, borderRadius:20, flexShrink:0,
                background:"var(--n-800)", border:"1px solid var(--n-700)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:32, fontWeight:900, color:"white",
              }}>
                {(pos.company || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:8, flexWrap:"wrap" }}>
                <span className={`badge ${modeInfo.cls}`} style={{ fontSize:12, padding:"4px 10px" }}>
                  {modeInfo.label}
                </span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pos.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge badge-gray" 
                  style={{ fontSize:12, padding:"4px 10px", cursor:"pointer", textDecoration:"none", border:"1px solid var(--n-700)" }}
                  title="เปิดใน Google Maps"
                >
                  <i className="fas fa-location-dot" style={{marginRight:5}}></i>
                  {pos.location || "ไม่ได้ระบุสถานที่"}
                </a>
                {pos.internshipType && (
                  <span className="badge badge-purple" style={{ fontSize:12, padding:"4px 10px" }}>
                    {pos.internshipType === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
                  </span>
                )}
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
            {showApplicationForm ? (
              <div className="alert alert-info" style={{ padding:"12px 20px" }}>
                <i className="fas fa-info-circle"></i> กรอกแบบฟอร์มด้านล่าง
              </div>
            ) : (
              <>
                <button 
                  className="btn btn-primary btn-lg" 
                  onClick={() => setShowApplicationForm(true)} 
                  disabled={!canApply}
                  style={{ boxShadow:"0 8px 24px rgba(37,99,235,0.4)" }}
                >
                  <i className="fas fa-paper-plane" style={{marginRight:8}}></i>
                  ยื่นใบสมัคร
                </button>
                {!canApply && (
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.4)", marginTop:12 }}>
                    {isDeadlinePassed ? "หมดเขตรับสมัครแล้ว" : "ตำแหน่งเต็มแล้ว"}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Application Form */}
      {showApplicationForm && (
        <ApplicationForm
          internshipId={id}
          onSuccess={() => {
            setShowApplicationForm(false);
            alert("ส่งใบสมัครสำเร็จ!");
            window.location.href = "/applications";
          }}
          onCancel={() => setShowApplicationForm(false)}
        />
      )}

      {/* Details Area */}
      <div className="grid-3" style={{ gap:20 }}>
        {/* Left Col (2 span) */}
        <div style={{ gridColumn:"span 2", display:"flex", flexDirection:"column", gap:20 }}>
          {/* Job Description */}
          <div className="card" style={{ padding:32 }}>
            <h3 style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)", marginBottom:20 }}>
              <i className="fas fa-briefcase" style={{marginRight:10, color:"var(--primary)"}}></i>
              รายละเอียดตำแหน่ง
            </h3>
            <p style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.8, marginBottom:24, whiteSpace:"pre-wrap" }}>
              {pos.description || "ตำแหน่งนี้ยังไม่ได้ใส่รายละเอียดงาน"}
            </p>

            {pos.requirements && (
              <>
                <h3 style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)", marginBottom:16, marginTop:32 }}>
                  <i className="fas fa-list-check" style={{marginRight:10, color:"var(--primary)"}}></i>
                  คุณสมบัติที่ต้องการ
                </h3>
                <div style={{ fontSize:14, color:"var(--text-secondary)", lineHeight:1.8 }}>
                  {pos.requirements.split('\n').map((line, i) => (
                    <p key={i} style={{ marginBottom:8 }}>• {line}</p>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Benefits */}
          {pos.benefits && (
            <div className="card" style={{ padding:32 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)", marginBottom:20 }}>
                <i className="fas fa-gift" style={{marginRight:10, color:"var(--success)"}}></i>
                สวัสดิการ
              </h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                {pos.benefits.split(',').map((benefit, i) => (
                  <span key={i} className="badge badge-success" style={{ fontSize:13, padding:"8px 16px" }}>
                    <i className="fas fa-check" style={{marginRight:6}}></i>
                    {benefit.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {pos.location && (
            <div className="card" style={{ padding:32 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)", marginBottom:20 }}>
                <i className="fas fa-map-location-dot" style={{marginRight:10, color:"var(--primary)"}}></i>
                ที่ตั้งบริษัท
              </h3>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pos.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration:"none" }}
              >
                <div 
                  className="location-card-hover"
                  style={{ 
                    padding:24, 
                    borderRadius:16, 
                    background:"var(--n-50)",
                    border:"1px solid var(--n-200)",
                    display:"flex",
                    alignItems:"flex-start",
                    gap:16,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                >
                  <div style={{ 
                    width:48, 
                    height:48, 
                    borderRadius:12, 
                    background:"var(--primary-50)", 
                    display:"flex", 
                    alignItems:"center", 
                    justifyContent:"center",
                    color:"var(--primary)",
                    fontSize:20,
                    flexShrink:0
                  }}>
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>
                      ที่อยู่ (คลิกเพื่อเปิดแผนที่)
                    </p>
                    <p style={{ fontSize:15, fontWeight:600, color:"var(--text-primary)", lineHeight:1.6 }}>
                      {pos.location}
                    </p>
                  </div>
                  <div style={{ color:"var(--primary)", opacity:0.5 }}>
                    <i className="fas fa-up-right-from-square"></i>
                  </div>
                </div>
              </a>
              <style jsx>{`
                .location-card-hover:hover {
                  background: white !important;
                  border-color: var(--primary) !important;
                  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
                  transform: translateY(-2px);
                }
              `}</style>
            </div>
          )}

          {/* Contact Information */}
          {(pos.contactEmail || pos.contactPhone || pos.contactLine) && (
            <div className="card" style={{ padding:32 }}>
              <h3 style={{ fontSize:18, fontWeight:800, color:"var(--text-primary)", marginBottom:20 }}>
                <i className="fas fa-address-card" style={{marginRight:10, color:"var(--primary)"}}></i>
                ข้อมูลติดต่อ
              </h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {pos.contactEmail && (
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ 
                      width:40, height:40, borderRadius:10, 
                      background:"var(--primary-50)", 
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"var(--primary)"
                    }}>
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:2 }}>อีเมล</p>
                      <a href={`mailto:${pos.contactEmail}`} style={{ fontSize:14, fontWeight:600, color:"var(--primary)" }}>
                        {pos.contactEmail}
                      </a>
                    </div>
                  </div>
                )}
                {pos.contactPhone && (
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ 
                      width:40, height:40, borderRadius:10, 
                      background:"var(--success-50)", 
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"var(--success)"
                    }}>
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:2 }}>โทรศัพท์</p>
                      <a href={`tel:${pos.contactPhone}`} style={{ fontSize:14, fontWeight:600, color:"var(--text-primary)" }}>
                        {pos.contactPhone}
                      </a>
                    </div>
                  </div>
                )}
                {pos.contactLine && (
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ 
                      width:40, height:40, borderRadius:10, 
                      background:"#06C755", 
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:"white"
                    }}>
                      <i className="fab fa-line"></i>
                    </div>
                    <div>
                      <p style={{ fontSize:12, color:"var(--text-muted)", marginBottom:2 }}>LINE</p>
                      <p style={{ fontSize:14, fontWeight:600, color:"var(--text-primary)" }}>
                        {pos.contactLine}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col */}
        <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
          {/* Salary */}
          {(pos.salaryMin || pos.salaryMax) && (
            <div className="card" style={{ padding:28 }}>
              <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>
                <i className="fas fa-money-bill-wave" style={{marginRight:6}}></i>
                ค่าตอบแทน
              </p>
              <p style={{ fontSize:28, fontWeight:900, color:"var(--success)", lineHeight:1, marginBottom:4 }}>
                {pos.salaryMin && pos.salaryMax 
                  ? `${pos.salaryMin.toLocaleString()} - ${pos.salaryMax.toLocaleString()}`
                  : pos.salaryMin 
                    ? `${pos.salaryMin.toLocaleString()}+`
                    : `${pos.salaryMax.toLocaleString()}`
                }
              </p>
              <p style={{ fontSize:13, color:"var(--text-muted)", fontWeight:500 }}>บาท/เดือน</p>
            </div>
          )}

          {/* Slots */}
          <div className="card" style={{ padding:28 }}>
            <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>
              <i className="fas fa-users" style={{marginRight:6}}></i>
              ช่องว่างที่เปิดรับ
            </p>
            <p style={{ fontSize:40, fontWeight:900, color: pos.slots > 0 ? "var(--success)" : "var(--error)", lineHeight:1, marginBottom:4 }}>
              {pos.slots || 0}
            </p>
            <p style={{ fontSize:13, color:"var(--text-muted)", fontWeight:500 }}>ตำแหน่ง</p>
          </div>

          {/* Duration */}
          {(pos.startDate || pos.endDate) && (
            <div className="card" style={{ padding:28 }}>
              <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:12 }}>
                <i className="fas fa-calendar-days" style={{marginRight:6}}></i>
                ระยะเวลาฝึกงาน
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {pos.startDate && (
                  <div>
                    <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:2 }}>เริ่ม</p>
                    <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>
                      {new Date(pos.startDate).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}
                {pos.endDate && (
                  <div>
                    <p style={{ fontSize:11, color:"var(--text-muted)", marginBottom:2 }}>สิ้นสุด</p>
                    <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>
                      {new Date(pos.endDate).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Application Deadline */}
          {pos.applicationDeadline && (
            <div className="card" style={{ padding:28, border: isDeadlinePassed ? "2px solid var(--error)" : "1px solid var(--n-200)" }}>
              <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:8 }}>
                <i className="fas fa-clock" style={{marginRight:6}}></i>
                ปิดรับสมัคร
              </p>
              <p style={{ fontSize:20, fontWeight:900, color: isDeadlinePassed ? "var(--error)" : "var(--warning)", lineHeight:1.2, marginBottom:4 }}>
                {new Date(pos.applicationDeadline).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              {isDeadlinePassed && (
                <p style={{ fontSize:12, color:"var(--error)", fontWeight:600, marginTop:8 }}>
                  <i className="fas fa-exclamation-triangle" style={{marginRight:4}}></i>
                  หมดเขตแล้ว
                </p>
              )}
            </div>
          )}

          {/* Other Info */}
          <div className="card" style={{ padding:28 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>
                  <i className="fas fa-building" style={{marginRight:6}}></i>
                  วิธีการทำงาน
                </p>
                <p style={{ fontSize:14, fontWeight:700, color:"var(--text-primary)" }}>{modeInfo.label}</p>
              </div>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>
                  <i className="fas fa-calendar-plus" style={{marginRight:6}}></i>
                  วันที่เปิดรับ
                </p>
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
