"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadApplication();
    loadUser();
  }, [params.id]);

  const loadApplication = async () => {
    setLoading(true);
    try {
      const data = await api.getApplication(params.id);
      setApplication(data);
    } catch (e) {
      setError(e.message || "ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const user = await api.getMe();
      setCurrentUser(user);
    } catch (e) {
      console.error("Failed to load user:", e);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role={currentUser?.roles?.[0]} title="รายละเอียดใบสมัคร">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  if (error) {
    return (
      <RoleDashboardShell role={currentUser?.roles?.[0]} title="รายละเอียดใบสมัคร">
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
    <RoleDashboardShell role={currentUser?.roles?.[0]} title="รายละเอียดใบสมัคร">
      <div style={{ marginBottom: 16 }}>
        <button className="btn btn-ghost" onClick={() => router.back()}>
          <i className="fas fa-arrow-left"></i> กลับ
        </button>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ชื่อ-นามสกุล:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.studentName || application.fullName || "-"}</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>เบอร์โทรศัพท์:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.phone || "-"}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>อีเมล:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.email || "-"}</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ที่อยู่:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.address || "-"}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>สาขา:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.studentMajor || application.major || "-"}</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ชั้นปี:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.studentYear || application.year ? `${application.studentYear || application.year}/4` : "-"}</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>เกรดเฉลี่ย:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.gpa ? application.gpa.toFixed(2) : "-"}</p>
          </div>
          <div>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>สถานะ:</p>
            <span className={`badge badge-${application.status === "ADVISOR_APPROVED" ? "green" : application.status === "REJECTED" ? "red" : "blue"}`}>
              {application.status}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>ตำแหน่ง/โปรแกรม:</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.internshipTitle || application.tripTitle || "ใบสมัคร"}</p>
        </div>

        {application.companyName && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>บริษัท:</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#1e293b" }}>{application.companyName}</p>
          </div>
        )}

        {application.portfolioUrl && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>Portfolio:</p>
            <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
              {application.portfolioUrl}
            </a>
          </div>
        )}

        {application.coverLetter && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>จดหมายแนะนำตัวเอง:</p>
            <p style={{ fontSize: 14, color: "#1e293b", background: "#f8fafc", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>{application.coverLetter}</p>
          </div>
        )}

        {application.resume && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 4 }}>เรซูเม่:</p>
            <a href={application.resume} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-file-pdf"></i> ดูเรซูเม่
            </a>
          </div>
        )}
      </div>
    </RoleDashboardShell>
  );
}
