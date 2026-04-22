"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CreateInternshipPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    type: "FULL_TIME",
    duration: "",
    stipend: "",
    description: "",
    requirements: "",
    status: "ACTIVE"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.createInternship(formData);
      alert("ประกาศฝึกงานสำเร็จ");
      router.push("/advisor/internships");
    } catch (err) {
      setError("เกิดข้อผิดพลาด: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <RoleDashboardShell role="ADVISOR" title="ประกาศฝึกงานใหม่" subtitle="สร้างตำแหน่งฝึกงานใหม่สำหรับนักศึกษา">
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      <div className="card" style={{ padding: 24, maxWidth: 800 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                ชื่อตำแหน่งงาน *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #E2E8F0",
                  borderRadius: 8
                }}
                placeholder="เช่น UX/UI Design Intern"
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                บริษัท/องค์กร *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #E2E8F0",
                  borderRadius: 8
                }}
                placeholder="เช่น บริษัท ABC จำกัด"
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                สถานที่ *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #E2E8F0",
                  borderRadius: 8
                }}
                placeholder="เช่น กรุงเทพฯ"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                  ประเภทงาน *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: 12,
                    border: "1px solid #E2E8F0",
                    borderRadius: 8
                  }}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                  ระยะเวลา *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: 12,
                    border: "1px solid #E2E8F0",
                    borderRadius: 8
                  }}
                  placeholder="เช่น 3 เดือน"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                ค่าตอบแทน
              </label>
              <input
                type="text"
                value={formData.stipend}
                onChange={(e) => handleChange("stipend", e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #E2E8F0",
                  borderRadius: 8
                }}
                placeholder="เช่น 15,000 บาท/เดือน (ไม่บังคับ)"
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                รายละเอียดงาน *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                required
                rows={5}
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  resize: "vertical"
                }}
                placeholder="อธิบายหน้าที่และความรับผิดชอบของตำแหน่งงาน"
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                คุณสมบัติ *
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                required
                rows={4}
                style={{
                  width: "100%",
                  padding: 12,
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                  resize: "vertical"
                }}
                placeholder="ระบุคุณสมบัติที่ต้องการ เช่น สาขา, ทักษะ, ปีการศึกษา"
              />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 20, borderTop: "1px solid #E2E8F0" }}>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost"
                style={{ padding: "10px 20px", fontWeight: 600, borderRadius: 8 }}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: "10px 20px", fontWeight: 600, borderRadius: 8 }}
              >
                {loading ? "กำลังบันทึก..." : "ประกาศฝึกงาน"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </RoleDashboardShell>
  );
}
