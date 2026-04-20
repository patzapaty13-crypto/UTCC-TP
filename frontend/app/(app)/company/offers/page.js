"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

const OFFER_STATUS = {
  PENDING: { label: "รอตอบรับ", cls: "badge-yellow", icon: "clock" },
  ACCEPTED: { label: "ตอบรับแล้ว", cls: "badge-green", icon: "check-circle" },
  REJECTED: { label: "ปฏิเสธ", cls: "badge-red", icon: "times-circle" },
  EXPIRED: { label: "หมดอายุ", cls: "badge-gray", icon: "calendar-xmark" },
};

export default function CompanyOffersPage() {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [form, setForm] = useState({
    salary: "",
    startDate: "",
    endDate: "",
    benefits: "",
    conditions: "",
    expiresAt: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [offs, apps] = await Promise.all([
        api.getOffers(),
        api.getApplications()
      ]);
      setOffers(offs || []);
      // Only show applications that passed interview
      setApplications(apps.filter(a => a.status === "INTERVIEW_SCHEDULED" || a.status === "OFFER_EXTENDED") || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSendOffer = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await api.createOffer({
        applicationId: selectedApp.id,
        ...form,
        salary: parseFloat(form.salary),
      });
      
      // Update application status
      await api.updateApplicationStatus(selectedApp.id, { status: "OFFER_EXTENDED" });
      
      setShowModal(false);
      setSelectedApp(null);
      setForm({ salary: "", startDate: "", endDate: "", benefits: "", conditions: "", expiresAt: "" });
      await loadData();
      alert("ส่ง Offer สำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  const pendingOffers = offers.filter(o => o.status === "PENDING");
  const acceptedOffers = offers.filter(o => o.status === "ACCEPTED");
  const rejectedOffers = offers.filter(o => o.status === "REJECTED");

  return (
    <RoleDashboardShell 
      role="COMPANY" 
      title="ข้อเสนองาน" 
      subtitle="จัดการและติดตามข้อเสนองานที่ส่งให้ผู้สมัคร"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            รอตอบรับ
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--warning)" }}>{pendingOffers.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }}></i>
            ตอบรับแล้ว
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--success)" }}>{acceptedOffers.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-times-circle" style={{ marginRight: 6 }}></i>
            ปฏิเสธ
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--error)" }}>{rejectedOffers.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-users" style={{ marginRight: 6 }}></i>
            พร้อมส่ง Offer
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>
            {applications.filter(a => !offers.find(o => o.applicationId === a.id)).length}
          </p>
        </div>
      </div>

      {/* Ready to Send Offers */}
      {applications.filter(a => !offers.find(o => o.applicationId === a.id)).length > 0 && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-paper-plane" style={{ marginRight: 10, color: "var(--primary)" }}></i>
            พร้อมส่ง Offer
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            {applications
              .filter(a => !offers.find(o => o.applicationId === a.id))
              .map(app => (
                <div key={app.id} style={{ 
                  padding: 16, 
                  background: "var(--n-50)", 
                  borderRadius: 12,
                  border: "1px solid var(--n-200)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                      {app.studentName || app.fullName || "ไม่ระบุชื่อ"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      <i className="fas fa-briefcase" style={{ marginRight: 6 }}></i>
                      {app.positionTitle || "ไม่ระบุตำแหน่ง"}
                    </p>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => { setSelectedApp(app); setShowModal(true); }}
                  >
                    <i className="fas fa-file-signature" style={{ marginRight: 6 }}></i>
                    ส่ง Offer
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Pending Offers */}
      {pendingOffers.length > 0 && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-clock" style={{ marginRight: 10, color: "var(--warning)" }}></i>
            รอตอบรับ ({pendingOffers.length})
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            {pendingOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      {/* Accepted Offers */}
      {acceptedOffers.length > 0 && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 10, color: "var(--success)" }}></i>
            ตอบรับแล้ว ({acceptedOffers.length})
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            {acceptedOffers.map(offer => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 16 }}></div>)}
        </div>
      )}

      {!loading && offers.length === 0 && applications.length === 0 && (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-file-signature"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>ยังไม่มีข้อเสนองาน</h3>
          <p style={{ color: "var(--text-muted)" }}>
            เมื่อมีผู้สมัครที่ผ่านการสัมภาษณ์ คุณสามารถส่ง Offer ได้ที่นี่
          </p>
        </div>
      )}

      {/* Send Offer Modal */}
      {showModal && selectedApp && (
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
              <i className="fas fa-file-signature" style={{ marginRight: 10, color: "var(--primary)" }}></i>
              ส่งข้อเสนองาน
            </h2>

            <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {selectedApp.studentName || selectedApp.fullName}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {selectedApp.positionTitle}
              </p>
            </div>

            <form onSubmit={handleSendOffer} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">เงินเดือน (บาท/เดือน) *</label>
                <input 
                  className="field-input" 
                  type="number" 
                  min="0"
                  placeholder="15000" 
                  value={form.salary} 
                  onChange={(e) => setForm({...form, salary: e.target.value})} 
                  required 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="field-group">
                  <label className="field-label">วันเริ่มงาน *</label>
                  <input 
                    className="field-input" 
                    type="date" 
                    value={form.startDate} 
                    onChange={(e) => setForm({...form, startDate: e.target.value})} 
                    required 
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">วันสิ้นสุด *</label>
                  <input 
                    className="field-input" 
                    type="date" 
                    value={form.endDate} 
                    onChange={(e) => setForm({...form, endDate: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">สวัสดิการ</label>
                <textarea 
                  className="field-input" 
                  placeholder="เช่น ประกันสุขภาพ, ค่าเดินทาง, ค่าอาหาร" 
                  value={form.benefits} 
                  onChange={(e) => setForm({...form, benefits: e.target.value})} 
                  rows={3}
                />
              </div>

              <div className="field-group">
                <label className="field-label">เงื่อนไขและข้อตกลง</label>
                <textarea 
                  className="field-input" 
                  placeholder="เงื่อนไขการทำงาน, ข้อตกลงพิเศษ" 
                  value={form.conditions} 
                  onChange={(e) => setForm({...form, conditions: e.target.value})} 
                  rows={3}
                />
              </div>

              <div className="field-group">
                <label className="field-label">วันหมดอายุ Offer *</label>
                <input 
                  className="field-input" 
                  type="date" 
                  value={form.expiresAt} 
                  onChange={(e) => setForm({...form, expiresAt: e.target.value})} 
                  required 
                />
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                  ผู้สมัครต้องตอบรับภายในวันที่กำหนด
                </p>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fas fa-paper-plane" style={{ marginRight: 8 }}></i>
                  ส่ง Offer
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

function OfferCard({ offer }) {
  const cfg = OFFER_STATUS[offer.status] || OFFER_STATUS.PENDING;
  const expiresAt = new Date(offer.expiresAt);
  const isExpiringSoon = expiresAt - new Date() < 3 * 24 * 60 * 60 * 1000; // 3 days
  
  return (
    <div style={{ 
      padding: 20, 
      background: offer.status === "ACCEPTED" ? "var(--success-50)" : "var(--n-50)", 
      borderRadius: 16,
      border: `1px solid ${offer.status === "ACCEPTED" ? "var(--success-200)" : "var(--n-200)"}`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
            {offer.studentName || "ไม่ระบุชื่อ"}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            <i className="fas fa-briefcase" style={{ marginRight: 6 }}></i>
            {offer.positionTitle || "ไม่ระบุตำแหน่ง"}
          </p>
        </div>
        <span className={`badge ${cfg.cls}`}>
          <i className={`fas fa-${cfg.icon}`} style={{ marginRight: 6 }}></i>
          {cfg.label}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
            <i className="fas fa-money-bill-wave" style={{ marginRight: 6 }}></i>
            เงินเดือน
          </p>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--success)" }}>
            {offer.salary?.toLocaleString()} ฿/เดือน
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
            <i className="fas fa-calendar" style={{ marginRight: 6 }}></i>
            ระยะเวลา
          </p>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {offer.startDate && new Date(offer.startDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
            {" - "}
            {offer.endDate && new Date(offer.endDate).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            หมดอายุ
          </p>
          <p style={{ fontSize: 13, fontWeight: 600, color: isExpiringSoon && offer.status === "PENDING" ? "var(--error)" : "inherit" }}>
            {expiresAt.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
            {isExpiringSoon && offer.status === "PENDING" && (
              <i className="fas fa-exclamation-triangle" style={{ marginLeft: 6, color: "var(--error)" }}></i>
            )}
          </p>
        </div>
      </div>

      {offer.benefits && (
        <div style={{ padding: 12, background: "white", borderRadius: 8, marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 6 }}>
            <i className="fas fa-gift" style={{ marginRight: 6 }}></i>
            สวัสดิการ
          </p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>
            {offer.benefits}
          </p>
        </div>
      )}

      {offer.respondedAt && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            ตอบรับเมื่อ: {new Date(offer.respondedAt).toLocaleDateString("th-TH", { 
              day: "numeric", 
              month: "short", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
      )}
    </div>
  );
}
