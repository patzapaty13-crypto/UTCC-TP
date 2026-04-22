"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ApplyForInternshipPage() {
  const router = useRouter();
  const params = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    gpa: "",
    major: "",
    year: "",
    coverLetter: "",
    portfolioUrl: ""
  });

  useEffect(() => {
    if (params.id) {
      loadInternship();
    }
  }, [params.id]);

  const loadInternship = async () => {
    try {
      const data = await api.getInternship(params.id);
      setInternship(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.email) {
      setError("กรุณากรอกเบอร์โทรและอีเมล");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await api.applyForInternship({
        internshipId: params.id,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        gpa: formData.gpa,
        major: formData.major,
        year: formData.year,
        coverLetter: formData.coverLetter,
        portfolioUrl: formData.portfolioUrl
      });
      alert("สมัครสำเร็จ");
      router.push("/student/applications");
    } catch (e) {
      setError("ไม่สามารถสมัครได้: " + (e.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="STUDENT" title="สมัครตำแหน่งฝึกงาน">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="STUDENT" title="สมัครตำแหน่งฝึกงาน" subtitle="กรอกข้อมูลเพื่อสมัครตำแหน่ง">
      <div className="card" style={{ padding: 32 }}>
        {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><i className="fas fa-circle-exclamation"></i>{error}</div>}

        {/* Internship Info */}
        {internship && (
          <div style={{
            padding: 16,
            background: "#EFF6FF",
            borderRadius: 12,
            marginBottom: 24,
            border: "1px solid #DBEAFE"
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8, color: "#1E40AF" }}>
              {internship.title}
            </h3>
            <p style={{ fontSize: 14, color: "#1E40AF" }}>
              <i className="fas fa-building" style={{ marginRight: 6 }}></i>
              {internship.company}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                เบอร์โทร *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) setFormData({ ...formData, phone: val });
                }}
                placeholder="0xx-xxx-xxxx"
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
                อีเมล *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
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
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              ที่อยู่
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
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
                GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="X.XX"
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
                สาขา
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="ชื่อสาขาวิชาของคุณ"
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
                ชั้นปี
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14
                }}
              >
                <option value="">เลือกชั้นปี</option>
                <option value="1">ปีที่ 1</option>
                <option value="2">ปีที่ 2</option>
                <option value="3">ปีที่ 3</option>
                <option value="4">ปีที่ 4</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              Cover Letter
            </label>
            <textarea
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              rows={4}
              placeholder="บอกเล่าเกี่ยวกับตัวคุณและทำไมคุณถึงเหมาะกับตำแหน่งนี้"
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
              Portfolio URL
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://..."
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
            <Link
              href={`/student/internships/${params.id}`}
              className="btn btn-ghost"
            >
              ยกเลิก
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "กำลังสมัคร..." : "ส่งใบสมัคร"}
            </button>
          </div>
        </form>
      </div>
    </RoleDashboardShell>
  );
}
