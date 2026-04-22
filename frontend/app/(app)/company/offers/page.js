"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    allowanceAmount: "",
    allowanceCurrency: "THB",
    startsOn: "",
    endsOn: "",
    termsText: "",
    responseDeadline: ""
  });

  useEffect(() => {
    loadOffers();
    loadApplications();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await api.getOffers();
      setOffers(data || []);
    } catch (err) {
      console.error("Failed to load offers:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const data = await api.getApplications();
      setApplications(data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    if (!selectedApplication) {
      alert("กรุณาเลือกใบสมัคร");
      return;
    }
    try {
      await api.createOffer({
        applicationId: selectedApplication,
        title: formData.title,
        allowanceAmount: formData.allowanceAmount,
        allowanceCurrency: formData.allowanceCurrency,
        startsOn: formData.startsOn,
        endsOn: formData.endsOn,
        termsText: formData.termsText,
        responseDeadline: formData.responseDeadline
      });
      alert("สร้างข้อเสนอสำเร็จ");
      setShowCreateModal(false);
      loadOffers();
    } catch (err) {
      alert("ไม่สามารถสร้างข้อเสนอได้: " + (err.message || ""));
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="ข้อเสนอ" subtitle="จัดการข้อเสนอที่ส่งให้นักศึกษา">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="COMPANY" title="ข้อเสนอ" subtitle="จัดการข้อเสนอที่ส่งให้นักศึกษา">
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <i className="fas fa-plus" style={{ marginRight: 8 }}></i>
          สร้างข้อเสนอ
        </button>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {offers.length === 0 ? (
            <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>
              ยังไม่มีข้อเสนอ
            </p>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, borderBottom: "1px solid #E2E8F0", padding: "16px 0" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: 16, color: "#0F172A" }}>
                    {offer.title}
                  </p>
                  <p className="text-muted" style={{ marginTop: 4, fontSize: 14 }}>
                    เงินเดือน: {offer.allowanceAmount} {offer.allowanceCurrency}
                  </p>
                  <div style={{ marginTop: 8 }}>
                    <span className={`badge ${offer.status === "ACCEPTED" ? "badge-green" : offer.status === "REJECTED" ? "badge-red" : "badge-blue"}`}>
                      {offer.status}
                    </span>
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ padding: "8px 16px" }}>
                  ดูรายละเอียด
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ padding: 24, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>สร้างข้อเสนอใหม่</h3>
            <form onSubmit={handleCreateOffer}>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>เลือกใบสมัคร</label>
                  <select
                    className="input-style"
                    value={selectedApplication || ""}
                    onChange={(e) => setSelectedApplication(e.target.value)}
                    required
                  >
                    <option value="">-- เลือกใบสมัคร --</option>
                    {applications.filter(app => app.status === "REVIEWING" || app.status === "INTERVIEW_COMPLETED").map(app => (
                      <option key={app.id} value={app.id}>
                        {app.studentName || app.fullName} - {app.internshipTitle || app.tripTitle}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>ตำแหน่ง</label>
                  <input
                    className="input-style"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>เงินเดือน</label>
                  <input
                    className="input-style"
                    value={formData.allowanceAmount}
                    onChange={(e) => setFormData({ ...formData, allowanceAmount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>วันเริ่มต้น</label>
                  <input
                    className="input-style"
                    type="date"
                    value={formData.startsOn}
                    onChange={(e) => setFormData({ ...formData, startsOn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>วันสิ้นสุด</label>
                  <input
                    className="input-style"
                    type="date"
                    value={formData.endsOn}
                    onChange={(e) => setFormData({ ...formData, endsOn: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>วันสุดท้ายตอบรับ</label>
                  <input
                    className="input-style"
                    type="datetime-local"
                    value={formData.responseDeadline}
                    onChange={(e) => setFormData({ ...formData, responseDeadline: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>เงื่อนไข</label>
                  <textarea
                    className="input-style"
                    rows={3}
                    value={formData.termsText}
                    onChange={(e) => setFormData({ ...formData, termsText: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                  <button type="submit" className="btn btn-primary">
                    สร้างข้อเสนอ
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>
                    ยกเลิก
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}
