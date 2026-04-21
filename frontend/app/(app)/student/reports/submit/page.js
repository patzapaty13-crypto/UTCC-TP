"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SubmitReportPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form data
  const [formData, setFormData] = useState({
    title: "",
    internshipCompany: "",
    internshipPosition: "",
    internshipPeriod: "",
    supervisor: "",
    reportType: "WEEKLY", // WEEKLY, MONTHLY, FINAL
    weekNumber: "",
    content: "",
    achievements: "",
    challenges: "",
    learnings: "",
    nextWeekPlan: "",
    attachments: []
  });

  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Load user's accepted internships
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      // Get user's applications that are accepted
      const applications = await api.getApplications();
      const acceptedApps = applications.filter(app => 
        app.status === "ACCEPTED" || app.status === "OFFER_ACCEPTED"
      );
      
      // Transform to internship format
      const internshipsData = acceptedApps.map(app => ({
        id: app.id,
        company: app.companyName || "บริษัท",
        position: app.positionTitle || "ตำแหน่ง",
        startDate: app.startDate || new Date().toISOString(),
        endDate: app.endDate || new Date().toISOString(),
        supervisor: app.supervisor || "ไม่ระบุ"
      }));
      
      setInternships(internshipsData);
    } catch (err) {
      console.error("Failed to load internships:", err);
      // Fallback to empty array
      setInternships([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-fill company details when internship is selected
    if (field === "internshipCompany") {
      const selectedInternship = internships.find(i => i.company === value);
      if (selectedInternship) {
        setFormData(prev => ({
          ...prev,
          internshipPosition: selectedInternship.position,
          internshipPeriod: `${new Date(selectedInternship.startDate).toLocaleDateString("th-TH")} - ${new Date(selectedInternship.endDate).toLocaleDateString("th-TH")}`,
          supervisor: selectedInternship.supervisor
        }));
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(extension)) {
        setError(`ไฟล์ ${file.name} ไม่ใช่ประเภทที่รองรับ`);
        return false;
      }
      if (file.size > maxSize) {
        setError(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 10MB`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError("กรุณาระบุหัวข้อรายงาน");
      return;
    }
    if (!formData.internshipCompany) {
      setError("กรุณาเลือกบริษัทที่ฝึกงาน");
      return;
    }
    if (!formData.content.trim()) {
      setError("กรุณาเขียนเนื้อหารายงาน");
      return;
    }
    if (formData.reportType === "WEEKLY" && !formData.weekNumber) {
      setError("กรุณาระบุสัปดาห์ที่");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Upload attachments first
      const uploadedFileIds = [];
      for (const file of formData.attachments) {
        const formDataFile = new FormData();
        formDataFile.append("file", file);
        formDataFile.append("category", "report");
        formDataFile.append("docType", "report-attachment");
        
        const result = await api.upload("/files", formDataFile);
        uploadedFileIds.push(result.id);
      }

      // Submit report
      const reportData = {
        title: formData.title,
        content: formData.content,
        type: formData.reportType,
        weekNumber: formData.reportType === "WEEKLY" ? parseInt(formData.weekNumber) : null,
        internshipPositionId: internships.find(i => i.company === formData.internshipCompany)?.id,
        fileIds: uploadedFileIds,
        // Additional fields
        achievements: formData.achievements,
        challenges: formData.challenges,
        learnings: formData.learnings,
        nextWeekPlan: formData.nextWeekPlan
      };

      await api.submitReport(reportData);
      
      setSuccess("ส่งรายงานเรียบร้อยแล้ว");
      
      // Redirect after success
      setTimeout(() => {
        router.push("/student/reports");
      }, 1500);
      
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Report Submission</p>
          <h1 className="page-title">ส่งรายงานฝึกงาน</h1>
          <p className="page-subtitle">ส่งรายงานความคืบหน้าการฝึกงานให้อาจารย์ที่ปรึกษา</p>
        </div>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}
      {success && <div className="alert alert-success"><i className="fas fa-check-circle"></i>{success}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 28 }}>
          {/* Main Form */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>
              <i className="fas fa-file-alt" style={{ marginRight: 12 }}></i>
              ข้อมูลรายงาน
            </h3>

            {/* Report Type */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                ประเภทรายงาน *
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { value: "WEEKLY", label: "รายงานรายสัปดาห์", icon: "calendar-week" },
                  { value: "MONTHLY", label: "รายงานรายเดือน", icon: "calendar-alt" },
                  { value: "FINAL", label: "รายงานสรุปผล", icon: "flag-checkered" }
                ].map(type => (
                  <label key={type.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: 12, border: "2px solid var(--border)", borderRadius: 8, background: formData.reportType === type.value ? "var(--primary-50)" : "transparent", borderColor: formData.reportType === type.value ? "var(--primary)" : "var(--border)", flex: 1 }}>
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={formData.reportType === type.value}
                      onChange={(e) => handleInputChange("reportType", e.target.value)}
                      disabled={submitting}
                    />
                    <i className={`fas fa-${type.icon}`} style={{ color: formData.reportType === type.value ? "var(--primary)" : "var(--text-muted)" }}></i>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Week Number (for weekly reports) */}
            {formData.reportType === "WEEKLY" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                  สัปดาห์ที่ *
                </label>
                <select
                  value={formData.weekNumber}
                  onChange={(e) => handleInputChange("weekNumber", e.target.value)}
                  style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
                  disabled={submitting}
                >
                  <option value="">เลือกสัปดาห์</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>สัปดาห์ที่ {i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                หัวข้อรายงาน *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="เช่น รายงานการฝึกงานสัปดาห์ที่ 1"
                style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
                disabled={submitting}
              />
            </div>

            {/* Internship Company */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                บริษัทที่ฝึกงาน *
              </label>
              <select
                value={formData.internshipCompany}
                onChange={(e) => handleInputChange("internshipCompany", e.target.value)}
                style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 }}
                disabled={submitting}
              >
                <option value="">เลือกบริษัท</option>
                {internships.map(internship => (
                  <option key={internship.id} value={internship.company}>
                    {internship.company} - {internship.position}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-filled fields */}
            {formData.internshipCompany && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                    ตำแหน่ง
                  </label>
                  <input
                    type="text"
                    value={formData.internshipPosition}
                    readOnly
                    style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, background: "var(--n-50)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                    ระยะเวลา
                  </label>
                  <input
                    type="text"
                    value={formData.internshipPeriod}
                    readOnly
                    style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, background: "var(--n-50)" }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                เนื้อหารายงาน *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="เขียนรายละเอียดการทำงาน กิจกรรมที่ทำ และสิ่งที่ได้เรียนรู้..."
                rows={8}
                style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                disabled={submitting}
              />
            </div>

            {/* Achievements */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                ผลงานที่สำเร็จ
              </label>
              <textarea
                value={formData.achievements}
                onChange={(e) => handleInputChange("achievements", e.target.value)}
                placeholder="งานหรือโปรเจคที่ทำเสร็จ..."
                rows={4}
                style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                disabled={submitting}
              />
            </div>

            {/* Challenges */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                ปัญหาและอุปสรรค
              </label>
              <textarea
                value={formData.challenges}
                onChange={(e) => handleInputChange("challenges", e.target.value)}
                placeholder="ปัญหาที่พบและวิธีการแก้ไข..."
                rows={4}
                style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                disabled={submitting}
              />
            </div>

            {/* Learnings */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                สิ่งที่ได้เรียนรู้
              </label>
              <textarea
                value={formData.learnings}
                onChange={(e) => handleInputChange("learnings", e.target.value)}
                placeholder="ทักษะใหม่ ความรู้ หรือประสบการณ์ที่ได้รับ..."
                rows={4}
                style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                disabled={submitting}
              />
            </div>

            {/* Next Week Plan (for weekly reports) */}
            {formData.reportType === "WEEKLY" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: "block" }}>
                  แผนสัปดาห์หน้า
                </label>
                <textarea
                  value={formData.nextWeekPlan}
                  onChange={(e) => handleInputChange("nextWeekPlan", e.target.value)}
                  placeholder="งานที่วางแผนจะทำในสัปดาห์หน้า..."
                  rows={3}
                  style={{ width: "100%", padding: 12, border: "1px solid var(--border)", borderRadius: 8, fontSize: 14, resize: "vertical" }}
                  disabled={submitting}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* File Upload */}
            <div className="card" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                <i className="fas fa-paperclip" style={{ marginRight: 8 }}></i>
                ไฟล์แนบ
              </h4>

              <div style={{ marginBottom: 16 }}>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="file-upload"
                  disabled={submitting}
                />
                <label
                  htmlFor="file-upload"
                  className="btn btn-ghost"
                  style={{ width: "100%", cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  <i className="fas fa-upload" style={{ marginRight: 8 }}></i>
                  เลือกไฟล์
                </label>
              </div>

              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16 }}>
                รองรับ: PDF, DOC, DOCX, JPG, PNG<br />
                ขนาดสูงสุด: 10MB ต่อไฟล์
              </div>

              {/* Attachment List */}
              {formData.attachments.length > 0 && (
                <div>
                  <h5 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>ไฟล์ที่เลือก:</h5>
                  {formData.attachments.map((file, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 8, background: "var(--n-50)", borderRadius: 6, marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                        <i className="fas fa-file" style={{ color: "var(--text-muted)", fontSize: 12 }}></i>
                        <span style={{ fontSize: 12, truncate: true }}>{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        style={{ background: "none", border: "none", color: "var(--error)", cursor: "pointer", padding: 4 }}
                        disabled={submitting}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="card" style={{ padding: 20 }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={submitting}
                style={{ width: "100%", marginBottom: 12 }}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i>
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" style={{ marginRight: 8 }}></i>
                    ส่งรายงาน
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.push("/student/reports")}
                disabled={submitting}
                style={{ width: "100%" }}
              >
                <i className="fas fa-arrow-left" style={{ marginRight: 8 }}></i>
                ยกเลิก
              </button>
            </div>

            {/* Supervisor Info */}
            {formData.supervisor && (
              <div className="card" style={{ padding: 20 }}>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                  <i className="fas fa-user-tie" style={{ marginRight: 8 }}></i>
                  ผู้ดูแล
                </h4>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                  {formData.supervisor}
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}