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
  
  // Skills state
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", level: "INTERMEDIATE" });
  const [editingSkills, setEditingSkills] = useState(false);
  
  // Experience state
  const [experiences, setExperiences] = useState([]);
  const [editingExperience, setEditingExperience] = useState(false);
  const [newExperience, setNewExperience] = useState({
    title: "", company: "", startDate: "", endDate: "", description: "", current: false
  });
  
  // Social Links state
  const [socialLinks, setSocialLinks] = useState({
    linkedin: "", github: "", portfolio: "", website: ""
  });
  const [editingSocial, setEditingSocial] = useState(false);

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
    
    // Load skills, experiences, social links from user profile
    setSkills(user.skills || []);
    setExperiences(user.experiences || []);
    setSocialLinks({
      linkedin: user.linkedin || "",
      github: user.github || "",
      portfolio: user.portfolio || "",
      website: user.website || ""
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
  
  // Skills Management
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setSkills([...skills, { ...newSkill, id: Date.now() }]);
    setNewSkill({ name: "", level: "INTERMEDIATE" });
  };
  
  const handleRemoveSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id));
  };
  
  const handleSaveSkills = async () => {
    setLoading(true);
    try {
      await api.put("/users/me", { skills });
      setMessage("บันทึกทักษะสำเร็จ");
      setEditingSkills(false);
      loadProfile();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };
  
  // Experience Management
  const handleAddExperience = () => {
    if (!newExperience.title.trim() || !newExperience.company.trim()) return;
    setExperiences([...experiences, { ...newExperience, id: Date.now() }]);
    setNewExperience({
      title: "", company: "", startDate: "", endDate: "", description: "", current: false
    });
  };
  
  const handleRemoveExperience = (id) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };
  
  const handleSaveExperiences = async () => {
    setLoading(true);
    try {
      await api.put("/users/me", { experiences });
      setMessage("บันทึกประสบการณ์สำเร็จ");
      setEditingExperience(false);
      loadProfile();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };
  
  // Social Links Management
  const handleSaveSocialLinks = async () => {
    setLoading(true);
    try {
      await api.put("/users/me", socialLinks);
      setMessage("บันทึก Social Links สำเร็จ");
      setEditingSocial(false);
      loadProfile();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
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

      {/* Skills Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3>
            <i className="fas fa-code" style={{ marginRight: 8, color: "#7C3AED" }}></i>
            ทักษะ (Skills)
          </h3>
          {!editingSkills && (
            <button className="btn btn-primary" onClick={() => setEditingSkills(true)}>
              <i className="fas fa-edit" style={{ marginRight: 6 }}></i>
              จัดการทักษะ
            </button>
          )}
        </div>

        {editingSkills ? (
          <div>
            {/* Add New Skill */}
            <div style={{ 
              padding: 20, 
              background: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
              borderRadius: 12,
              marginBottom: 16
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>เพิ่มทักษะใหม่</h4>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12, alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>ชื่อทักษะ</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="เช่น JavaScript, Python, React"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>ระดับ</label>
                  <select
                    className="form-control"
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                  >
                    <option value="BEGINNER">เริ่มต้น</option>
                    <option value="INTERMEDIATE">ปานกลาง</option>
                    <option value="ADVANCED">ขั้นสูง</option>
                    <option value="EXPERT">ผู้เชี่ยวชาญ</option>
                  </select>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddSkill}
                  style={{ height: 42 }}
                >
                  <i className="fas fa-plus"></i> เพิ่ม
                </button>
              </div>
            </div>

            {/* Skills List */}
            {skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      padding: "10px 16px",
                      background: "#F5F3FF",
                      border: "2px solid #7C3AED",
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, color: "#6D28D9" }}>{skill.name}</span>
                      <span style={{ 
                        marginLeft: 8, 
                        fontSize: 11, 
                        padding: "2px 8px",
                        background: "#7C3AED",
                        color: "white",
                        borderRadius: 99,
                        fontWeight: 600
                      }}>
                        {skill.level === "BEGINNER" && "เริ่มต้น"}
                        {skill.level === "INTERMEDIATE" && "ปานกลาง"}
                        {skill.level === "ADVANCED" && "ขั้นสูง"}
                        {skill.level === "EXPERT" && "ผู้เชี่ยวชาญ"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#DC2626",
                        cursor: "pointer",
                        padding: 4,
                        fontSize: 14
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ textAlign: "center", padding: 20 }}>
                ยังไม่มีทักษะ กรุณาเพิ่มทักษะของคุณ
              </p>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSaveSkills} disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึกทักษะ"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setEditingSkills(false);
                  loadProfile();
                }}
                disabled={loading}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <div>
            {skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    style={{
                      padding: "10px 16px",
                      background: "#F5F3FF",
                      border: "1px solid #DDD6FE",
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "#6D28D9" }}>{skill.name}</span>
                    <span style={{ 
                      fontSize: 11, 
                      padding: "2px 8px",
                      background: "#7C3AED",
                      color: "white",
                      borderRadius: 99,
                      fontWeight: 600
                    }}>
                      {skill.level === "BEGINNER" && "เริ่มต้น"}
                      {skill.level === "INTERMEDIATE" && "ปานกลาง"}
                      {skill.level === "ADVANCED" && "ขั้นสูง"}
                      {skill.level === "EXPERT" && "ผู้เชี่ยวชาญ"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ textAlign: "center", padding: 20 }}>
                ยังไม่มีทักษะ คลิก "จัดการทักษะ" เพื่อเพิ่มทักษะของคุณ
              </p>
            )}
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3>
            <i className="fas fa-briefcase" style={{ marginRight: 8, color: "#059669" }}></i>
            ประสบการณ์ (Experience)
          </h3>
          {!editingExperience && (
            <button className="btn btn-primary" onClick={() => setEditingExperience(true)}>
              <i className="fas fa-edit" style={{ marginRight: 6 }}></i>
              จัดการประสบการณ์
            </button>
          )}
        </div>

        {editingExperience ? (
          <div>
            {/* Add New Experience */}
            <div style={{ 
              padding: 20, 
              background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
              borderRadius: 12,
              marginBottom: 16
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>เพิ่มประสบการณ์ใหม่</h4>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>ตำแหน่ง *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="เช่น Web Developer Intern"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>บริษัท/องค์กร *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="เช่น Google Thailand"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>วันที่เริ่ม</label>
                    <input
                      type="month"
                      className="form-control"
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>วันที่สิ้นสุด</label>
                    <input
                      type="month"
                      className="form-control"
                      value={newExperience.endDate}
                      onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                      disabled={newExperience.current}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", paddingTop: 28 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={newExperience.current}
                        onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked, endDate: "" })}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>ปัจจุบัน</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>รายละเอียด</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="อธิบายงานที่ทำ ความรับผิดชอบ และผลงาน"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  />
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddExperience}
                  style={{ width: "fit-content" }}
                >
                  <i className="fas fa-plus"></i> เพิ่มประสบการณ์
                </button>
              </div>
            </div>

            {/* Experience List */}
            {experiences.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      padding: 16,
                      background: "#ECFDF5",
                      border: "1px solid #A7F3D0",
                      borderRadius: 12,
                      position: "relative"
                    }}
                  >
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "none",
                        border: "none",
                        color: "#DC2626",
                        cursor: "pointer",
                        fontSize: 16
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: "#047857", marginBottom: 4 }}>
                      {exp.title}
                    </h4>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#059669", marginBottom: 8 }}>
                      {exp.company}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                      {exp.startDate} - {exp.current ? "ปัจจุบัน" : exp.endDate || "N/A"}
                    </p>
                    {exp.description && (
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ textAlign: "center", padding: 20 }}>
                ยังไม่มีประสบการณ์ กรุณาเพิ่มประสบการณ์ของคุณ
              </p>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSaveExperiences} disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึกประสบการณ์"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setEditingExperience(false);
                  loadProfile();
                }}
                disabled={loading}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <div>
            {experiences.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    style={{
                      padding: 16,
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      borderRadius: 12
                    }}
                  >
                    <h4 style={{ fontSize: 16, fontWeight: 800, color: "#047857", marginBottom: 4 }}>
                      {exp.title}
                    </h4>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#059669", marginBottom: 8 }}>
                      {exp.company}
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
                      {exp.startDate} - {exp.current ? "ปัจจุบัน" : exp.endDate || "N/A"}
                    </p>
                    {exp.description && (
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted" style={{ textAlign: "center", padding: 20 }}>
                ยังไม่มีประสบการณ์ คลิก "จัดการประสบการณ์" เพื่อเพิ่มประสบการณ์ของคุณ
              </p>
            )}
          </div>
        )}
      </div>

      {/* Social Links Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3>
            <i className="fas fa-link" style={{ marginRight: 8, color: "#2563EB" }}></i>
            Social Links
          </h3>
          {!editingSocial && (
            <button className="btn btn-primary" onClick={() => setEditingSocial(true)}>
              <i className="fas fa-edit" style={{ marginRight: 6 }}></i>
              แก้ไข Links
            </button>
          )}
        </div>

        {editingSocial ? (
          <div>
            <div style={{ display: "grid", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fab fa-linkedin" style={{ color: "#0A66C2", fontSize: 18 }}></i>
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fab fa-github" style={{ color: "#181717", fontSize: 18 }}></i>
                  GitHub Profile
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://github.com/yourusername"
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fas fa-briefcase" style={{ color: "#7C3AED", fontSize: 18 }}></i>
                  Portfolio Website
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://yourportfolio.com"
                  value={socialLinks.portfolio}
                  onChange={(e) => setSocialLinks({ ...socialLinks, portfolio: e.target.value })}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fas fa-globe" style={{ color: "#059669", fontSize: 18 }}></i>
                  Personal Website
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://yourwebsite.com"
                  value={socialLinks.website}
                  onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSaveSocialLinks} disabled={loading}>
                {loading ? "กำลังบันทึก..." : "บันทึก Links"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setEditingSocial(false);
                  loadProfile();
                }}
                disabled={loading}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: 16,
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#DBEAFE"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#EFF6FF"}
              >
                <i className="fab fa-linkedin" style={{ color: "#0A66C2", fontSize: 24 }}></i>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF", marginBottom: 2 }}>LinkedIn</p>
                  <p style={{ fontSize: 12, color: "#3B82F6" }}>{socialLinks.linkedin}</p>
                </div>
                <i className="fas fa-external-link-alt" style={{ marginLeft: "auto", color: "#3B82F6", fontSize: 14 }}></i>
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: 16,
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F3F4F6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#F9FAFB"}
              >
                <i className="fab fa-github" style={{ color: "#181717", fontSize: 24 }}></i>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 2 }}>GitHub</p>
                  <p style={{ fontSize: 12, color: "#6B7280" }}>{socialLinks.github}</p>
                </div>
                <i className="fas fa-external-link-alt" style={{ marginLeft: "auto", color: "#6B7280", fontSize: 14 }}></i>
              </a>
            )}
            {socialLinks.portfolio && (
              <a
                href={socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: 16,
                  background: "#F5F3FF",
                  border: "1px solid #DDD6FE",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#EDE9FE"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#F5F3FF"}
              >
                <i className="fas fa-briefcase" style={{ color: "#7C3AED", fontSize: 24 }}></i>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#6D28D9", marginBottom: 2 }}>Portfolio</p>
                  <p style={{ fontSize: 12, color: "#7C3AED" }}>{socialLinks.portfolio}</p>
                </div>
                <i className="fas fa-external-link-alt" style={{ marginLeft: "auto", color: "#7C3AED", fontSize: 14 }}></i>
              </a>
            )}
            {socialLinks.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: 16,
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#D1FAE5"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#ECFDF5"}
              >
                <i className="fas fa-globe" style={{ color: "#059669", fontSize: 24 }}></i>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#047857", marginBottom: 2 }}>Website</p>
                  <p style={{ fontSize: 12, color: "#059669" }}>{socialLinks.website}</p>
                </div>
                <i className="fas fa-external-link-alt" style={{ marginLeft: "auto", color: "#059669", fontSize: 14 }}></i>
              </a>
            )}
            {!socialLinks.linkedin && !socialLinks.github && !socialLinks.portfolio && !socialLinks.website && (
              <p className="text-muted" style={{ textAlign: "center", padding: 20 }}>
                ยังไม่มี Social Links คลิก "แก้ไข Links" เพื่อเพิ่มลิงก์ของคุณ
              </p>
            )}
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
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
