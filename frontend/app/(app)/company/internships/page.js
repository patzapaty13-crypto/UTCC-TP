"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyInternshipsPage() {
  const [items, setItems] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    companyId: "",
    title: "",
    description: "",
    requirements: "",
    location: "",
    mode: "ON_SITE",
    slots: 1,
    status: "OPEN",
    // Phase 1 Enhancement Fields
    salaryMin: "",
    salaryMax: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    benefits: "",
    internshipType: "FULL_TIME",
    contactEmail: "",
    contactPhone: "",
    contactLine: "",
  });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [internships, cs, user] = await Promise.all([
        api.getInternships(), 
        api.getCompanies(),
        api.getMe()
      ]);
      setItems(internships || []);
      setCompanies(cs || []);
      setCurrentUser(user);
      
      // Use companyId from logged-in user
      if (user?.companyId) {
        setForm((f) => ({ ...f, companyId: user.companyId }));
      } else if (!form.companyId && cs?.length) {
        // Fallback: use first company if user doesn't have companyId
        setForm((f) => ({ ...f, companyId: cs[0].id }));
      }
    } catch (e) {
      setError(e.message || "โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    
    // Validate companyId
    if (!form.companyId) {
      setError("กรุณาเลือกบริษัท หรือสร้างบริษัทก่อน");
      setSaving(false);
      return;
    }
    
    setSaving(true);
    setError("");
    try {
      await api.createInternship({ 
        ...form, 
        slots: Number(form.slots) || 1,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      });
      setForm((f) => ({ 
        ...f, 
        title: "", 
        description: "", 
        requirements: "", 
        location: "", 
        slots: 1,
        salaryMin: "",
        salaryMax: "",
        startDate: "",
        endDate: "",
        applicationDeadline: "",
        benefits: "",
        contactEmail: "",
        contactPhone: "",
        contactLine: "",
      }));
      await load();
    } catch (e) {
      setError(e.message || "สร้างประกาศไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <RoleDashboardShell role="COMPANY" title="ประกาศฝึกงาน" subtitle="สร้าง แก้ไข และจัดการตำแหน่งฝึกงานของบริษัท">
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Warning if user has no companyId - redirect to setup */}
      {!loading && currentUser && !currentUser.companyId && (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 64, color: "var(--primary)", marginBottom: 24 }}>
            <i className="fas fa-building"></i>
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>
            ยินดีต้อนรับสู่ระบบ! 🎉
          </h3>
          <p style={{ fontSize: 16, color: "var(--text-muted)", marginBottom: 32 }}>
            กรุณาสร้าง Company Profile ก่อนเริ่มใช้งาน
          </p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => window.location.href = "/company/profile/setup"}
          >
            <i className="fas fa-plus-circle" style={{ marginRight: 8 }}></i>
            สร้าง Company Profile
          </button>
        </div>
      )}

      <div className="card" style={{ padding: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>
          <i className="fas fa-plus-circle" style={{ marginRight: 10, color: "var(--primary)" }}></i>
          สร้างประกาศใหม่
        </h3>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Basic Information */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              <i className="fas fa-info-circle" style={{ marginRight: 8, color: "var(--primary)" }}></i>
              ข้อมูลพื้นฐาน
            </h4>
            <div style={{ display: "grid", gap: 16 }}>
              {/* Show company name (read-only) */}
              <div style={{ padding: 16, background: "var(--primary-50)", borderRadius: 12, border: "1px solid var(--primary-200)" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
                  <i className="fas fa-building" style={{ marginRight: 6 }}></i>
                  บริษัท
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>
                  {companies.find(c => c.id === form.companyId)?.name || "กำลังโหลด..."}
                </p>
              </div>
              
              <div className="field-group">
                <label className="field-label">ชื่อตำแหน่ง *</label>
                <input className="field-input" placeholder="เช่น Software Engineer Intern" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="field-group">
                <label className="field-label">รายละเอียดงาน</label>
                <textarea className="field-input" placeholder="อธิบายรายละเอียดงานและความรับผิดชอบ" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
              <div className="field-group">
                <label className="field-label">คุณสมบัติที่ต้องการ</label>
                <textarea className="field-input" placeholder="ระบุคุณสมบัติที่ต้องการ (แยกแต่ละข้อด้วย Enter)" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={3} />
              </div>
            </div>
          </div>
          {/* Work Details */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              <i className="fas fa-briefcase" style={{ marginRight: 8, color: "var(--primary)" }}></i>
              รายละเอียดการทำงาน
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">สถานที่</label>
                <input className="field-input" placeholder="เช่น กรุงเทพมหานคร" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">รูปแบบการทำงาน</label>
                <select className="field-input" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                  <option value="ON_SITE">On-site</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">ประเภทฝึกงาน</label>
                <select className="field-input" value={form.internshipType} onChange={(e) => setForm({ ...form, internshipType: e.target.value })}>
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                </select>
              </div>
              <div className="field-group">
                <label className="field-label">จำนวนที่รับ</label>
                <input className="field-input" type="number" min="1" placeholder="1" value={form.slots} onChange={(e) => setForm({ ...form, slots: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Compensation & Benefits */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              <i className="fas fa-money-bill-wave" style={{ marginRight: 8, color: "var(--success)" }}></i>
              ค่าตอบแทนและสวัสดิการ
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">เงินเดือนขั้นต่ำ (บาท)</label>
                <input className="field-input" type="number" min="0" placeholder="15000" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">เงินเดือนสูงสุด (บาท)</label>
                <input className="field-input" type="number" min="0" placeholder="20000" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
              </div>
            </div>
            <div className="field-group" style={{ marginTop: 16 }}>
              <label className="field-label">สวัสดิการ</label>
              <input className="field-input" placeholder="เช่น ประกันสุขภาพ, ค่าเดินทาง, ค่าอาหาร (คั่นด้วยเครื่องหมายจุลภาค)" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              <i className="fas fa-calendar-days" style={{ marginRight: 8, color: "var(--primary)" }}></i>
              ระยะเวลา
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">วันเริ่มฝึกงาน</label>
                <input className="field-input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">วันสิ้นสุดฝึกงาน</label>
                <input className="field-input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">วันปิดรับสมัคร</label>
                <input className="field-input" type="date" value={form.applicationDeadline} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", marginBottom: 16 }}>
              <i className="fas fa-address-card" style={{ marginRight: 8, color: "var(--primary)" }}></i>
              ข้อมูลติดต่อ
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">อีเมล</label>
                <input className="field-input" type="email" placeholder="hr@company.com" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">เบอร์โทรศัพท์</label>
                <input className="field-input" type="tel" placeholder="0812345678" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
              </div>
              <div className="field-group">
                <label className="field-label">LINE ID</label>
                <input className="field-input" placeholder="@company" value={form.contactLine} onChange={(e) => setForm({ ...form, contactLine: e.target.value })} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }} disabled={saving}>
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                  สร้างประกาศ
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>
          <i className="fas fa-list" style={{ marginRight: 10, color: "var(--primary)" }}></i>
          ประกาศทั้งหมด ({items.length})
        </h3>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }}></div>)}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-briefcase"></i></div>
            <h3>ยังไม่มีประกาศ</h3>
            <p>สร้างประกาศฝึกงานแรกของคุณด้านบน</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {items.map((i) => {
              const isDeadlinePassed = i.applicationDeadline && new Date(i.applicationDeadline) < new Date();
              return (
                <div key={i.id} style={{ 
                  border: "1px solid var(--border)", 
                  borderRadius: 16, 
                  padding: 20,
                  background: "var(--n-50)",
                  transition: "all var(--transition)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <h4 style={{ fontWeight: 800, fontSize: 16, color: "var(--text-primary)" }}>{i.title}</h4>
                        <span className={`badge badge-${i.mode === "REMOTE" ? "purple" : i.mode === "HYBRID" ? "green" : "blue"}`}>
                          {i.mode}
                        </span>
                        {i.internshipType && (
                          <span className="badge badge-purple">
                            {i.internshipType === 'FULL_TIME' ? 'Full-time' : 'Part-time'}
                          </span>
                        )}
                        <span className={`badge badge-${i.status === "OPEN" ? "success" : "gray"}`}>
                          {i.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span>
                          <i className="fas fa-building" style={{ marginRight: 6 }}></i>
                          {i.company}
                        </span>
                        {i.location && (
                          <span>
                            <i className="fas fa-location-dot" style={{ marginRight: 6 }}></i>
                            {i.location}
                          </span>
                        )}
                        {(i.salaryMin || i.salaryMax) && (
                          <span style={{ color: "var(--success)", fontWeight: 600 }}>
                            <i className="fas fa-money-bill-wave" style={{ marginRight: 6 }}></i>
                            {i.salaryMin && i.salaryMax 
                              ? `${i.salaryMin.toLocaleString()}-${i.salaryMax.toLocaleString()}`
                              : i.salaryMin 
                                ? `${i.salaryMin.toLocaleString()}+`
                                : `${i.salaryMax.toLocaleString()}`
                            } ฿
                          </span>
                        )}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", marginLeft: 20 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>ที่ว่าง</p>
                      <p style={{ fontSize: 24, fontWeight: 900, color: i.slots > 0 ? "var(--success)" : "var(--error)", lineHeight: 1 }}>{i.slots}</p>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div style={{ display: "flex", gap: 20, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
                    {i.startDate && (
                      <span>
                        <i className="fas fa-calendar-check" style={{ marginRight: 6, color: "var(--primary)" }}></i>
                        เริ่ม: {new Date(i.startDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    {i.endDate && (
                      <span>
                        <i className="fas fa-calendar-xmark" style={{ marginRight: 6, color: "var(--text-muted)" }}></i>
                        สิ้นสุด: {new Date(i.endDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    {i.applicationDeadline && (
                      <span style={{ color: isDeadlinePassed ? "var(--error)" : "var(--warning)", fontWeight: 600 }}>
                        <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
                        ปิดรับ: {new Date(i.applicationDeadline).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                        {isDeadlinePassed && " (หมดเขต)"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </RoleDashboardShell>
  );
}
