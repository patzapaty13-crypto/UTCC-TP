"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function StudentProfilePage() {
  const [me, setMe] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    loadProfile();
    loadDocuments();
  }, []);

  const loadProfile = async () => {
    const user = await api.getMe();
    setMe(user);
    setFormData({
      displayName: user.displayName || "",
      email: user.email || "",
      major: user.major || "",
      faculty: user.faculty || "",
      academicYear: user.academicYear || "",
      studentId: user.studentId || "",
    });
  };

  const loadDocuments = async () => {
    try {
      const docs = await api.get("/files?category=profile");
      setDocuments(docs || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.put("/users/me", formData);
      setMessage("บันทึกข้อมูลสำเร็จ");
      setEditing(false);
      loadProfile();
    } catch (err) {
      setMessage("เกิดข้อผิดพลาด: " + (err.message || "ไม่สามารถบันทึกได้"));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("ไฟล์ใหญ่เกิน 5MB");
      return;
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("รองรับเฉพาะไฟล์ PDF, JPG, PNG เท่านั้น");
      return;
    }

    setUploadingDoc(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "profile");
      formData.append("docType", docType);

      const result = await api.upload("/files", formData);
      setMessage(`อัปโหลด${docType === "resume" ? "Resume" : docType === "transcript" ? "Transcript" : "เอกสาร"}สำเร็จ`);
      loadDocuments();
    } catch (err) {
      alert("อัปโหลดไฟล์ไม่สำเร็จ: " + (err.message || ""));
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("รูปภาพใหญ่เกิน 2MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("รองรับเฉพาะไฟล์ JPG, PNG เท่านั้น");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "profile-picture");

      const result = await api.upload("/files", formData);
      await api.put("/users/me", { profilePictureUrl: result.url });
      setMessage("อัปโหลดรูปโปรไฟล์สำเร็จ");
      loadProfile();
    } catch (err) {
      alert("อัปโหลดรูปไม่สำเร็จ: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const getDocumentByType = (type) => {
    return documents.find(doc => doc.docType === type);
  };

  if (!me) {
    return (
      <RoleDashboardShell role="STUDENT" title="โปรไฟล์นักศึกษา">
        <div className="card" style={{ padding: 24 }}>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="STUDENT" title="โปรไฟล์นักศึกษา" subtitle="จัดการข้อมูลส่วนตัว ทักษะ และเอกสารสำหรับฝึกงาน">
      {message && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          {message}
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>รูปโปรไฟล์</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            fontSize: 48,
            fontWeight: 700,
            color: "#666"
          }}>
            {me.profilePictureUrl ? (
              <img src={me.profilePictureUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              me.displayName?.charAt(0) || me.username?.charAt(0) || "?"
            )}
          </div>
          <div>
            <label className="btn btn-outline" style={{ cursor: "pointer" }}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleProfilePictureUpload}
                style={{ display: "none" }}
                disabled={loading}
              />
              {loading ? "กำลังอัปโหลด..." : "เปลี่ยนรูปโปรไฟล์"}
            </label>
            <p className="text-muted" style={{ marginTop: 8, fontSize: 14 }}>
              รองรับ JPG, PNG (สูงสุด 2MB)
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3>ข้อมูลส่วนตัว</h3>
          {!editing && (
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              แก้ไขข้อมูล
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="form-label">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  name="displayName"
                  className="form-control"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">รหัสนักศึกษา *</label>
                <input
                  type="text"
                  name="studentId"
                  className="form-control"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">อีเมล *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">คณะ</label>
                <input
                  type="text"
                  name="faculty"
                  className="form-control"
                  value={formData.faculty}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label">สาขาวิชา</label>
                <input
                  type="text"
                  name="major"
                  className="form-control"
                  value={formData.major}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="form-label">ชั้นปี</label>
                <select
                  name="academicYear"
                  className="form-control"
                  value={formData.academicYear}
                  onChange={handleChange}
                >
                  <option value="">เลือกชั้นปี</option>
                  <option value="1">ปี 1</option>
                  <option value="2">ปี 2</option>
                  <option value="3">ปี 3</option>
                  <option value="4">ปี 4</option>
                  <option value="5">ปี 5</option>
                  <option value="6">ปี 6</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    displayName: me.displayName || "",
                    email: me.email || "",
                    major: me.major || "",
                    faculty: me.faculty || "",
                    academicYear: me.academicYear || "",
                    studentId: me.studentId || "",
                  });
                }}
                disabled={loading}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <p className="text-muted" style={{ fontSize: 14 }}>ชื่อ-นามสกุล</p>
              <p style={{ fontWeight: 600 }}>{me.displayName || "-"}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: 14 }}>รหัสนักศึกษา</p>
              <p style={{ fontWeight: 600 }}>{me.studentId || "-"}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: 14 }}>อีเมล</p>
              <p style={{ fontWeight: 600 }}>{me.email || "-"}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: 14 }}>คณะ</p>
              <p style={{ fontWeight: 600 }}>{me.faculty || "-"}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: 14 }}>สาขาวิชา</p>
              <p style={{ fontWeight: 600 }}>{me.major || "-"}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: 14 }}>ชั้นปี</p>
              <p style={{ fontWeight: 600 }}>ปี {me.academicYear || "-"}</p>
            </div>
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>เอกสารประกอบ</h3>
        <p className="text-muted" style={{ marginBottom: 24, fontSize: 14 }}>
          อัปโหลดเอกสารที่จำเป็นสำหรับการสมัครฝึกงาน
        </p>

        <div style={{ display: "grid", gap: 16 }}>
          {/* Resume */}
          <div className="card" style={{ padding: 16, backgroundColor: "#f8f9fa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ marginBottom: 4 }}>📄 Resume / CV</h4>
                <p className="text-muted" style={{ fontSize: 14 }}>
                  {getDocumentByType("resume") ? (
                    <>
                      <span style={{ color: "#28a745", fontWeight: 600 }}>✓ อัปโหลดแล้ว</span>
                      {" • "}
                      <a href={getDocumentByType("resume").url} target="_blank" rel="noopener noreferrer">
                        ดูเอกสาร
                      </a>
                    </>
                  ) : (
                    "ยังไม่ได้อัปโหลด"
                  )}
                </p>
              </div>
              <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={(e) => handleFileUpload(e, "resume")}
                  style={{ display: "none" }}
                  disabled={uploadingDoc}
                />
                {uploadingDoc ? "กำลังอัปโหลด..." : getDocumentByType("resume") ? "เปลี่ยนไฟล์" : "อัปโหลด"}
              </label>
            </div>
          </div>

          {/* Transcript */}
          <div className="card" style={{ padding: 16, backgroundColor: "#f8f9fa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ marginBottom: 4 }}>📊 Transcript (ใบแสดงผลการเรียน)</h4>
                <p className="text-muted" style={{ fontSize: 14 }}>
                  {getDocumentByType("transcript") ? (
                    <>
                      <span style={{ color: "#28a745", fontWeight: 600 }}>✓ อัปโหลดแล้ว</span>
                      {" • "}
                      <a href={getDocumentByType("transcript").url} target="_blank" rel="noopener noreferrer">
                        ดูเอกสาร
                      </a>
                    </>
                  ) : (
                    "ยังไม่ได้อัปโหลด"
                  )}
                </p>
              </div>
              <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={(e) => handleFileUpload(e, "transcript")}
                  style={{ display: "none" }}
                  disabled={uploadingDoc}
                />
                {uploadingDoc ? "กำลังอัปโหลด..." : getDocumentByType("transcript") ? "เปลี่ยนไฟล์" : "อัปโหลด"}
              </label>
            </div>
          </div>

          {/* ID Card */}
          <div className="card" style={{ padding: 16, backgroundColor: "#f8f9fa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ marginBottom: 4 }}>🎓 บัตรนักศึกษา</h4>
                <p className="text-muted" style={{ fontSize: 14 }}>
                  {getDocumentByType("student-id") ? (
                    <>
                      <span style={{ color: "#28a745", fontWeight: 600 }}>✓ อัปโหลดแล้ว</span>
                      {" • "}
                      <a href={getDocumentByType("student-id").url} target="_blank" rel="noopener noreferrer">
                        ดูเอกสาร
                      </a>
                    </>
                  ) : (
                    "ยังไม่ได้อัปโหลด"
                  )}
                </p>
              </div>
              <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png"
                  onChange={(e) => handleFileUpload(e, "student-id")}
                  style={{ display: "none" }}
                  disabled={uploadingDoc}
                />
                {uploadingDoc ? "กำลังอัปโหลด..." : getDocumentByType("student-id") ? "เปลี่ยนไฟล์" : "อัปโหลด"}
              </label>
            </div>
          </div>
        </div>

        <div className="alert alert-info" style={{ marginTop: 16 }}>
          <strong>💡 คำแนะนำ:</strong>
          <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
            <li>รองรับไฟล์ PDF, JPG, PNG เท่านั้น</li>
            <li>ขนาดไฟล์ไม่เกิน 5MB</li>
            <li>ควรอัปโหลดเอกสารให้ครบก่อนสมัครฝึกงาน</li>
          </ul>
        </div>
      </div>
    </RoleDashboardShell>
  );
}
