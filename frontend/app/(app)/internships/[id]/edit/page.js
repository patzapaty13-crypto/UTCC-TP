"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function EditInternshipPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [pos, setPos] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("COMPANY");

  useEffect(() => {
    loadInternship();
    loadUserRole();
  }, [id]);

  const loadUserRole = async () => {
    try {
      const user = await api.getMe();
      if (user.roles && user.roles.length > 0) {
        setUserRole(user.roles[0]);
      }
    } catch (e) {
      console.error("Failed to load user role:", e);
    }
  };

  const loadInternship = async () => {
    setLoading(true);
    try {
      const data = await api.getInternship(id);
      setPos(data);
    } catch (e) {
      setError(e.message || "ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateInternship(id, pos);
      alert("บันทึกสำเร็จ");
      router.push(`/internships/${id}`);
    } catch (e) {
      alert("ไม่สามารถบันทึกได้: " + (e.message || ""));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role={userRole} title="แก้ไขประกาศฝึกงาน">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  if (error) {
    return (
      <RoleDashboardShell role={userRole} title="แก้ไขประกาศฝึกงาน">
        <div className="card" style={{ padding: 24 }}>
          <div className="alert alert-error">
            <i className="fas fa-circle-exclamation"></i> {error}
          </div>
          <button className="btn btn-ghost" onClick={() => router.back()} style={{ marginTop: 16 }}>
            <i className="fas fa-arrow-left"></i> กลับ
          </button>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role={userRole} title="แก้ไขประกาศฝึกงาน">
      <div style={{ marginBottom: 24 }}>
        <button 
          className="btn btn-ghost" 
          onClick={() => router.back()}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <i className="fas fa-arrow-left"></i> กลับ
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: 24 }}>
          {/* ข้อมูลพื้นฐาน */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-briefcase" style={{ color: "#2563EB", fontSize: 18 }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>ข้อมูลพื้นฐาน</h3>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  ตำแหน่งงาน <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  className="input-style"
                  type="text"
                  value={pos.title || ""}
                  onChange={(e) => setPos({ ...pos, title: e.target.value })}
                  required
                  placeholder="เช่น พนักงานฝ่าย IT, Marketing Intern"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  รายละเอียดงาน <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <textarea
                  className="input-style"
                  rows={5}
                  value={pos.description || ""}
                  onChange={(e) => setPos({ ...pos, description: e.target.value })}
                  required
                  placeholder="อธิบายหน้าที่และความรับผิดชอบของตำแหน่งงาน"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  คุณสมบัติที่ต้องการ <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <textarea
                  className="input-style"
                  rows={3}
                  value={pos.requirements || ""}
                  onChange={(e) => setPos({ ...pos, requirements: e.target.value })}
                  required
                  placeholder="เช่น กำลังศึกษาปีที่ 3-4, ทักษะใช้คอมพิวเตอร์"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%", resize: "vertical" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  สถานที่ทำงาน <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  className="input-style"
                  type="text"
                  value={pos.location || ""}
                  onChange={(e) => setPos({ ...pos, location: e.target.value })}
                  required
                  placeholder="เช่น กรุงเทพฯ, ทำงานที่บ้าน"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* รายละเอียดการทำงาน */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-clock" style={{ color: "#059669", fontSize: 18 }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>รายละเอียดการทำงาน</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  รูปแบบงาน <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  className="input-style"
                  value={pos.mode || "ONSITE"}
                  onChange={(e) => setPos({ ...pos, mode: e.target.value })}
                  required
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                >
                  <option value="ONSITE">On-site (ที่สำนักงาน)</option>
                  <option value="REMOTE">Remote (ทำงานที่บ้าน)</option>
                  <option value="HYBRID">Hybrid (ผสม)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  ประเภทฝึกงาน
                </label>
                <select
                  className="input-style"
                  value={pos.internshipType || "FULL_TIME"}
                  onChange={(e) => setPos({ ...pos, internshipType: e.target.value })}
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                >
                  <option value="FULL_TIME">Full-time (เต็มเวลา)</option>
                  <option value="PART_TIME">Part-time (ไม่เต็มเวลา)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  จำนวนรับ <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  className="input-style"
                  type="number"
                  value={pos.slots || ""}
                  onChange={(e) => setPos({ ...pos, slots: parseInt(e.target.value) })}
                  required
                  min="1"
                  placeholder="เช่น 2"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  สวัสดิการ
                </label>
                <input
                  className="input-style"
                  type="text"
                  value={pos.benefits || ""}
                  onChange={(e) => setPos({ ...pos, benefits: e.target.value })}
                  placeholder="คั่นด้วยจุลภาค เช่น ค่าเดินทาง, ประกันอุบัติเหตุ"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* ค่าตอบแทนและวันที่ */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-coins" style={{ color: "#F59E0B", fontSize: 18 }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>ค่าตอบแทนและวันที่</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  เงินเดือนขั้นต่ำ (บาท)
                </label>
                <input
                  className="input-style"
                  type="number"
                  value={pos.salaryMin || ""}
                  onChange={(e) => setPos({ ...pos, salaryMin: parseFloat(e.target.value) })}
                  min="0"
                  placeholder="เช่น 15000"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  เงินเดือนสูงสุด (บาท)
                </label>
                <input
                  className="input-style"
                  type="number"
                  value={pos.salaryMax || ""}
                  onChange={(e) => setPos({ ...pos, salaryMax: parseFloat(e.target.value) })}
                  min="0"
                  placeholder="เช่น 25000"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  วันเริ่มต้น
                </label>
                <input
                  className="input-style"
                  type="date"
                  value={pos.startDate || ""}
                  onChange={(e) => setPos({ ...pos, startDate: e.target.value })}
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  วันสิ้นสุด
                </label>
                <input
                  className="input-style"
                  type="date"
                  value={pos.endDate || ""}
                  onChange={(e) => setPos({ ...pos, endDate: e.target.value })}
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  วันสุดท้ายรับสมัคร <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <input
                  className="input-style"
                  type="date"
                  value={pos.applicationDeadline || ""}
                  onChange={(e) => setPos({ ...pos, applicationDeadline: e.target.value })}
                  required
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* ข้อมูลติดต่อ */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="fas fa-address-card" style={{ color: "#7C3AED", fontSize: 18 }}></i>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>ข้อมูลติดต่อ</h3>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  อีเมลติดต่อ
                </label>
                <input
                  className="input-style"
                  type="email"
                  value={pos.contactEmail || ""}
                  onChange={(e) => setPos({ ...pos, contactEmail: e.target.value })}
                  placeholder="example@company.com"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  เบอร์โทรติดต่อ
                </label>
                <input
                  className="input-style"
                  type="text"
                  value={pos.contactPhone || ""}
                  onChange={(e) => setPos({ ...pos, contactPhone: e.target.value })}
                  placeholder="เช่น 081-234-5678"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#475569", fontSize: 14 }}>
                  LINE ID
                </label>
                <input
                  className="input-style"
                  type="text"
                  value={pos.contactLine || ""}
                  onChange={(e) => setPos({ ...pos, contactLine: e.target.value })}
                  placeholder="เช่น @companyhr"
                  style={{ padding: "12px 16px", borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 14, width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* ปุ่มดำเนินการ */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, padding: 16 }}>
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={() => router.back()}
              style={{ padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14 }}
            >
              <i className="fas fa-times" style={{ marginRight: 8 }}></i> ยกเลิก
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={saving}
              style={{ 
                padding: "12px 32px", 
                borderRadius: 8, 
                fontWeight: 600, 
                fontSize: 14,
                background: "#2563EB",
                color: "white",
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? <><i className="fas fa-spinner fa-spin" style={{ marginRight: 8 }}></i> กำลังบันทึก...</> : <><i className="fas fa-save" style={{ marginRight: 8 }}></i> บันทึกการแก้ไข</>}
            </button>
          </div>
        </div>
      </form>
    </RoleDashboardShell>
  );
}
