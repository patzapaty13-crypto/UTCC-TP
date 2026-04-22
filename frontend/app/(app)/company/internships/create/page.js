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
    description: "",
    requirements: "",
    location: "",
    mode: "ON_SITE",
    slots: 1,
    salaryMin: "",
    salaryMax: "",
    startDate: "",
    endDate: "",
    applicationDeadline: "",
    benefits: "",
    internshipType: "FULL_TIME",
    contactEmail: "",
    contactPhone: "",
    contactLine: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setError("กรุณากรอกชื่อตำแหน่งและคำอธิบาย");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.createInternship(formData);
      alert("ประกาศฝึกงานสำเร็จ");
      router.push("/company/internships");
    } catch (err) {
      setError("เกิดข้อผิดพลาด: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleDashboardShell role="COMPANY" title="ประกาศฝึกงานใหม่" subtitle="สร้างตำแหน่งฝึกงานสำหรับนักศึกษา">
      <div className="card" style={{ padding: 32 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><i className="fas fa-circle-exclamation"></i>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              ชื่อตำแหน่ง *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              คำอธิบายงาน *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14,
                resize: "vertical"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              คุณสมบัติ *
            </label>
            <textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              required
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14,
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                ที่ตั้ง
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                รูปแบบ
              </label>
              <select
                value={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                <option value="ON_SITE">On-site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                เงินเดือนขั้นต่ำ
              </label>
              <input
                type="number"
                value={formData.salaryMin}
                onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                เงินเดือนสูงสุด
              </label>
              <input
                type="number"
                value={formData.salaryMax}
                onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                จำนวนที่รับ
              </label>
              <input
                type="number"
                min="1"
                value={formData.slots}
                onChange={(e) => setFormData({ ...formData, slots: parseInt(e.target.value) || 1 })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                วันเริ่มต้น
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                วันสิ้นสุด
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              วันปิดรับสมัคร
            </label>
            <input
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              สวัสดิการ
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              rows={2}
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14,
                resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                อีเมลติดต่อ
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                เบอร์โทร
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                LINE
              </label>
              <input
                type="text"
                value={formData.contactLine}
                onChange={(e) => setFormData({ ...formData, contactLine: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
            <button
              type="button"
              onClick={() => router.push("/company/internships")}
              className="btn btn-ghost"
            >
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "กำลังบันทึก..." : "ประกาศฝึกงาน"}
            </button>
          </div>
        </form>
      </div>
    </RoleDashboardShell>
  );
}
