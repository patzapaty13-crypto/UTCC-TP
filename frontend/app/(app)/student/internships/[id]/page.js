"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";
import Link from "next/link";

export default function StudentInternshipDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadData();
    }
  }, [params.id]);

  const loadData = async () => {
    try {
      const [internshipData, userData] = await Promise.all([
        api.getInternship(params.id),
        api.getMe()
      ]);
      setInternship(internshipData);
      setCurrentUser(userData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!confirm("คุณต้องการสมัครตำแหน่งนี้ใช่หรือไม่?")) return;

    setApplying(true);
    try {
      await api.applyForInternship({
        internshipId: params.id
      });
      alert("สมัครสำเร็จ");
      router.push("/student/applications");
    } catch (e) {
      alert("ไม่สามารถสมัครได้: " + (e.message || ""));
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="STUDENT" title="รายละเอียดตำแหน่งฝึกงาน">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  if (error) {
    return (
      <RoleDashboardShell role="STUDENT" title="รายละเอียดตำแหน่งฝึกงาน">
        <div className="card" style={{ padding: 40 }}>
          <div className="alert alert-error">
            <i className="fas fa-circle-exclamation"></i>
            {error}
          </div>
          <Link href="/student/internships" className="btn btn-ghost" style={{ marginTop: 16 }}>
            <i className="fas fa-arrow-left"></i> กลับ
          </Link>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="STUDENT" title="รายละเอียดตำแหน่งฝึกงาน">
      <div style={{ marginBottom: 24 }}>
        <Link href="/student/internships" className="btn btn-ghost" style={{ width: "fit-content", padding: 0, color: "var(--text-secondary)" }}>
          <i className="fas fa-arrow-left"></i> กลับหน้าค้นหาฝึกงาน
        </Link>
      </div>

      <div className="card" style={{ padding: 32 }}>
        {/* Company Header */}
        <div style={{ display: "flex", gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #E5E7EB" }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 12,
            background: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            border: "2px solid #E5E7EB"
          }}>
            {internship.companyLogoUrl ? (
              <img src={internship.companyLogoUrl} alt={internship.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <i className="fas fa-building" style={{ fontSize: 32, color: "#9CA3AF" }}></i>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, color: "var(--text-primary)" }}>
              {internship.title}
            </h1>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{
                padding: "6px 14px",
                background: "#EFF6FF",
                color: "#3B82F6",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700
              }}>
                {internship.company}
              </span>
              {internship.industry && (
                <span style={{
                  padding: "6px 14px",
                  background: "#F3F4F6",
                  color: "#64748B",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700
                }}>
                  {internship.industry}
                </span>
              )}
              <span style={{
                padding: "6px 14px",
                background: internship.status === "OPEN" ? "#ECFDF5" : "#FEF2F2",
                color: internship.status === "OPEN" ? "#10B981" : "#EF4444",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700
              }}>
                {internship.status === "OPEN" ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
              </span>
              <span style={{
                padding: "6px 14px",
                background: "#F3F4F6",
                color: "#64748B",
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 700
              }}>
                {internship.mode}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--text-primary)" }}>
              คำอธิบายงาน
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              {internship.description}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--text-primary)" }}>
              คุณสมบัติ
            </h3>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              {internship.requirements}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>ที่ตั้ง</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: 6, color: "#3B82F6" }}></i>
                {internship.location}
              </p>
            </div>

            <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>จำนวนที่รับ</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                <i className="fas fa-users" style={{ marginRight: 6, color: "#3B82F6" }}></i>
                {internship.slots} ตำแหน่ง
              </p>
            </div>

            {internship.salaryMin && (
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>เงินเดือน</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  <i className="fas fa-money-bill-wave" style={{ marginRight: 6, color: "#10B981" }}></i>
                  {internship.salaryMin.toLocaleString()} - {internship.salaryMax?.toLocaleString()} บาท
                </p>
              </div>
            )}

            {internship.startDate && (
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>ระยะเวลา</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  <i className="fas fa-calendar" style={{ marginRight: 6, color: "#3B82F6" }}></i>
                  {new Date(internship.startDate).toLocaleDateString("th-TH")} - {new Date(internship.endDate).toLocaleDateString("th-TH")}
                </p>
              </div>
            )}

            {internship.applicationDeadline && (
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>ปิดรับสมัคร</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  <i className="fas fa-clock" style={{ marginRight: 6, color: "#F59E0B" }}></i>
                  {new Date(internship.applicationDeadline).toLocaleDateString("th-TH")}
                </p>
              </div>
            )}
          </div>

          {internship.benefits && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: "var(--text-primary)" }}>
                สวัสดิการ
              </h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-secondary)" }}>
                {internship.benefits}
              </p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {internship.contactEmail && (
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>อีเมลติดต่อ</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  <i className="fas fa-envelope" style={{ marginRight: 6, color: "#3B82F6" }}></i>
                  {internship.contactEmail}
                </p>
              </div>
            )}

            {internship.contactPhone && (
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>เบอร์โทร</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  <i className="fas fa-phone" style={{ marginRight: 6, color: "#3B82F6" }}></i>
                  {internship.contactPhone}
                </p>
              </div>
            )}

            {internship.contactLine && (
              <div style={{ padding: 16, background: "#F9FAFB", borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>LINE</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  <i className="fab fa-line" style={{ marginRight: 6, color: "#06C755" }}></i>
                  {internship.contactLine}
                </p>
              </div>
            )}
          </div>

          {internship.status === "OPEN" && (
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24, paddingTop: 24, borderTop: "1px solid #E5E7EB" }}>
              <Link
                href={`/student/internships/${params.id}/apply`}
                className="btn btn-primary"
                style={{ padding: "12px 32px", fontSize: 16 }}
              >
                สมัครตำแหน่งนี้
              </Link>
            </div>
          )}
        </div>
      </div>
    </RoleDashboardShell>
  );
}
