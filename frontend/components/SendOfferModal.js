"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function SendOfferModal({ application, onClose, onSuccess }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: application.positionTitle || "",
    allowanceAmount: "",
    allowanceCurrency: "THB",
    startsOn: "",
    endsOn: "",
    termsText: "",
    responseDeadline: "",
    responseDeadlineTime: "",
  });

  const calculateDuration = () => {
    if (formData.startsOn && formData.endsOn) {
      const start = new Date(formData.startsOn);
      const end = new Date(formData.endsOn);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      return months > 0 ? `${months} เดือน ${days} วัน` : `${days} วัน`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine deadline date and time
      const deadlineDateTime = new Date(`${formData.responseDeadline}T${formData.responseDeadlineTime}`);
      
      const offerData = {
        applicationId: application.id,
        title: formData.title,
        allowanceAmount: parseFloat(formData.allowanceAmount),
        allowanceCurrency: formData.allowanceCurrency,
        startsOn: formData.startsOn,
        endsOn: formData.endsOn,
        termsText: formData.termsText,
        responseDeadline: deadlineDateTime.toISOString(),
        status: "PENDING",
      };

      await api.createOffer(offerData);
      addToast("ส่งข้อเสนองานสำเร็จ!", "success");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error sending offer:", error);
      addToast("เกิดข้อผิดพลาดในการส่งข้อเสนองาน", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("th-TH").format(value);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-file-contract" style={{ marginRight: 12, color: "#10B981" }}></i>
            ส่งข้อเสนองาน (Job Offer)
          </h2>
          <button onClick={onClose} className="modal-close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* Student Info */}
            <div className="info-card" style={{ marginBottom: 24, padding: 16, background: "#F0FDF4", borderRadius: 12, border: "1px solid #BBF7D0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar-sm" style={{ background: "#10B981", color: "white", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                  {application.studentName?.charAt(0) || "S"}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{application.studentName}</div>
                  <div style={{ fontSize: 13, color: "#059669" }}>ส่งข้อเสนองานตำแหน่ง: {application.positionTitle}</div>
                </div>
              </div>
            </div>

            {/* Position Title */}
            <div className="form-group">
              <label>ตำแหน่งงาน *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="เช่น: นักพัฒนาซอฟต์แวร์ฝึกงาน"
                required
              />
            </div>

            {/* Allowance */}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>
                <i className="fas fa-money-bill-wave" style={{ marginRight: 8, color: "#10B981" }}></i>
                ค่าตอบแทน
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>จำนวนเงิน *</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    value={formData.allowanceAmount}
                    onChange={(e) => setFormData({ ...formData, allowanceAmount: e.target.value })}
                    placeholder="15000"
                    min="0"
                    step="100"
                    required
                  />
                  {formData.allowanceAmount && (
                    <div style={{ marginTop: 8, fontSize: 13, color: "#10B981", fontWeight: 600 }}>
                      {formatCurrency(formData.allowanceAmount)} บาท/เดือน
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>สกุลเงิน</label>
                <select
                  value={formData.allowanceCurrency}
                  onChange={(e) => setFormData({ ...formData, allowanceCurrency: e.target.value })}
                >
                  <option value="THB">THB (บาท)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: 8, color: "#10B981" }}></i>
                ระยะเวลาฝึกงาน
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>วันเริ่มต้น *</label>
                <input
                  type="date"
                  value={formData.startsOn}
                  onChange={(e) => setFormData({ ...formData, startsOn: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>วันสิ้นสุด *</label>
                <input
                  type="date"
                  value={formData.endsOn}
                  onChange={(e) => setFormData({ ...formData, endsOn: e.target.value })}
                  min={formData.startsOn || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            {calculateDuration() && (
              <div style={{ padding: 12, background: "#F0FDF4", borderRadius: 8, marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#059669" }}>
                  <i className="fas fa-clock" style={{ marginRight: 8 }}></i>
                  ระยะเวลารวม: <strong>{calculateDuration()}</strong>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="form-group">
              <label>เงื่อนไขและรายละเอียด *</label>
              <textarea
                value={formData.termsText}
                onChange={(e) => setFormData({ ...formData, termsText: e.target.value })}
                placeholder="ระบุรายละเอียดเพิ่มเติม เช่น:&#10;- เวลาทำงาน: จันทร์-ศุกร์ 9:00-18:00&#10;- สวัสดิการ: ประกันอุบัติเหตุ, ค่าอาหารกลางวัน&#10;- หน้าที่รับผิดชอบ: พัฒนาระบบ, ทดสอบ, เขียนเอกสาร&#10;- สิ่งที่ได้รับ: ประสบการณ์จริง, พี่เลี้ยง, ใบรับรอง"
                rows={8}
                required
              />
            </div>

            {/* Response Deadline */}
            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>
                <i className="fas fa-hourglass-half" style={{ marginRight: 8, color: "#F59E0B" }}></i>
                กำหนดเวลาตอบรับ
              </h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>วันที่ *</label>
                <input
                  type="date"
                  value={formData.responseDeadline}
                  onChange={(e) => setFormData({ ...formData, responseDeadline: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>เวลา *</label>
                <input
                  type="time"
                  value={formData.responseDeadlineTime}
                  onChange={(e) => setFormData({ ...formData, responseDeadlineTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ padding: 12, background: "#FEF3C7", borderRadius: 8, marginTop: 12 }}>
              <div style={{ fontSize: 13, color: "#92400E" }}>
                <i className="fas fa-info-circle" style={{ marginRight: 8 }}></i>
                นักศึกษาจะต้องตอบรับภายในเวลาที่กำหนด มิฉะนั้นข้อเสนอจะหมดอายุ
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-success" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" style={{ marginRight: 8 }}></i>
                  ส่งข้อเสนองาน
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #0F172A;
          display: flex;
          align-items: center;
        }
        .modal-close {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #F8FAFC;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
        }
        .modal-close:hover {
          background: #F1F5F9;
          color: #0F172A;
        }
        .modal-body {
          padding: 24px;
          flex: 1;
          overflow-y: auto;
        }
        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #0F172A;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }
        .btn-success {
          background: #10B981;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-success:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-1px);
        }
        .btn-success:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
