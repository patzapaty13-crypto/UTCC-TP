"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";

export default function ScheduleInterviewModal({ application, onClose, onSuccess }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interviewType: "IN_PERSON",
    interviewDate: "",
    interviewTime: "",
    interviewDuration: 60,
    location: "",
    videoLink: "",
    meetingId: "",
    interviewerName: "",
    interviewerEmail: "",
    interviewerPhone: "",
    instructions: "",
    preparationNotes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.interviewDate}T${formData.interviewTime}`);
      
      const interviewData = {
        applicationId: application.id,
        studentId: application.studentId,
        companyId: application.companyId,
        positionId: application.positionId,
        interviewType: formData.interviewType,
        interviewDate: dateTime.toISOString(),
        interviewDuration: parseInt(formData.interviewDuration),
        location: formData.location,
        videoLink: formData.videoLink,
        meetingId: formData.meetingId,
        interviewerName: formData.interviewerName,
        interviewerEmail: formData.interviewerEmail,
        interviewerPhone: formData.interviewerPhone,
        instructions: formData.instructions,
        preparationNotes: formData.preparationNotes,
        status: "SCHEDULED",
      };

      await api.createInterview(interviewData);
      addToast("นัดสัมภาษณ์สำเร็จ!", "success");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error scheduling interview:", error);
      addToast("เกิดข้อผิดพลาดในการนัดสัมภาษณ์", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-calendar-check" style={{ marginRight: 12, color: "#2563EB" }}></i>
            นัดสัมภาษณ์
          </h2>
          <button onClick={onClose} className="modal-close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            {/* Student Info */}
            <div className="info-card" style={{ marginBottom: 24, padding: 16, background: "#F8FAFC", borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar-sm" style={{ background: "#2563EB", color: "white", width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                  {application.studentName?.charAt(0) || "S"}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{application.studentName}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{application.positionTitle}</div>
                </div>
              </div>
            </div>

            {/* Interview Type */}
            <div className="form-group">
              <label>รูปแบบการสัมภาษณ์ *</label>
              <select
                value={formData.interviewType}
                onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                required
              >
                <option value="IN_PERSON">สัมภาษณ์ที่บริษัท (In-Person)</option>
                <option value="VIDEO">สัมภาษณ์ออนไลน์ (Video Call)</option>
                <option value="PHONE">สัมภาษณ์ทางโทรศัพท์</option>
              </select>
            </div>

            {/* Date and Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>วันที่สัมภาษณ์ *</label>
                <input
                  type="date"
                  value={formData.interviewDate}
                  onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>เวลา *</label>
                <input
                  type="time"
                  value={formData.interviewTime}
                  onChange={(e) => setFormData({ ...formData, interviewTime: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Duration */}
            <div className="form-group">
              <label>ระยะเวลา (นาที) *</label>
              <select
                value={formData.interviewDuration}
                onChange={(e) => setFormData({ ...formData, interviewDuration: e.target.value })}
                required
              >
                <option value="30">30 นาที</option>
                <option value="45">45 นาที</option>
                <option value="60">1 ชั่วโมง</option>
                <option value="90">1.5 ชั่วโมง</option>
                <option value="120">2 ชั่วโมง</option>
              </select>
            </div>

            {/* Location or Video Link */}
            {formData.interviewType === "IN_PERSON" && (
              <div className="form-group">
                <label>สถานที่ *</label>
                <textarea
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="ระบุที่อยู่บริษัท, ชั้น, ห้อง"
                  rows={3}
                  required
                />
              </div>
            )}

            {formData.interviewType === "VIDEO" && (
              <>
                <div className="form-group">
                  <label>ลิงก์ Video Call *</label>
                  <input
                    type="url"
                    value={formData.videoLink}
                    onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                    placeholder="https://zoom.us/j/... หรือ Google Meet link"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Meeting ID / รหัสห้อง</label>
                  <input
                    type="text"
                    value={formData.meetingId}
                    onChange={(e) => setFormData({ ...formData, meetingId: e.target.value })}
                    placeholder="123-456-789"
                  />
                </div>
              </>
            )}

            {/* Interviewer Info */}
            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", marginBottom: 16 }}>
                <i className="fas fa-user-tie" style={{ marginRight: 8, color: "#2563EB" }}></i>
                ข้อมูลผู้สัมภาษณ์
              </h3>
            </div>

            <div className="form-group">
              <label>ชื่อผู้สัมภาษณ์ *</label>
              <input
                type="text"
                value={formData.interviewerName}
                onChange={(e) => setFormData({ ...formData, interviewerName: e.target.value })}
                placeholder="คุณสมชาย ใจดี"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>อีเมล</label>
                <input
                  type="email"
                  value={formData.interviewerEmail}
                  onChange={(e) => setFormData({ ...formData, interviewerEmail: e.target.value })}
                  placeholder="interviewer@company.com"
                />
              </div>
              <div className="form-group">
                <label>เบอร์โทร</label>
                <input
                  type="tel"
                  value={formData.interviewerPhone}
                  onChange={(e) => setFormData({ ...formData, interviewerPhone: e.target.value })}
                  placeholder="02-xxx-xxxx"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="form-group">
              <label>คำแนะนำสำหรับนักศึกษา</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="เช่น: กรุณามาถึงก่อนเวลา 15 นาที, แต่งกายสุภาพ, นำเอกสารประวัติมาด้วย"
                rows={3}
              />
            </div>

            {/* Preparation Notes */}
            <div className="form-group">
              <label>สิ่งที่ควรเตรียมตัว</label>
              <textarea
                value={formData.preparationNotes}
                onChange={(e) => setFormData({ ...formData, preparationNotes: e.target.value })}
                placeholder="เช่น: ศึกษาข้อมูลบริษัท, เตรียม Portfolio, ทบทวนทักษะที่เกี่ยวข้อง"
                rows={3}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" style={{ marginRight: 8 }}></i>
                  ส่งนัดสัมภาษณ์
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
          border-color: #2563EB;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
