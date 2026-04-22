"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { useToast } from "@/components/Toast";

export default function StaffDocumentsPage() {
  const { addToast } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.listFiles?.("staff-shared");
      setFiles(data || []);
    } catch (e) {
      console.error(e);
      setFiles([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await api.uploadFile(file, "staff-shared", "document");
      addToast("อัปโหลดสำเร็จ", "success");
      load();
    } catch (err) {
      addToast("อัปโหลดไม่สำเร็จ: " + err.message, "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <RoleDashboardShell role="STAFF" title="เอกสาร" subtitle="เอกสารแบบฟอร์ม, ประกาศ, คู่มือการฝึกงาน">
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 8 }}>
          <i className="fas fa-upload" style={{ color: "#2563EB", marginRight: 8 }}></i>อัปโหลดเอกสาร
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>
          รองรับไฟล์ PDF, DOCX, รูปภาพ ขนาดไม่เกิน 20MB
        </p>
        <label className="btn btn-primary" style={{ cursor: "pointer", display: "inline-flex" }}>
          <i className="fas fa-cloud-arrow-up" style={{ marginRight: 8 }}></i>
          {uploading ? "กำลังอัปโหลด..." : "เลือกไฟล์"}
          <input type="file" onChange={onUpload} style={{ display: "none" }} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 200, borderRadius: 14 }}></div>
      ) : files.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <i className="fas fa-folder-open" style={{ fontSize: 40, color: "var(--n-300)" }}></i>
          <h3 style={{ marginTop: 16 }}>ยังไม่มีเอกสาร</h3>
          <p style={{ color: "var(--text-muted)", marginTop: 6 }}>อัปโหลดเอกสารแรกของคุณเพื่อเริ่มต้น</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {files.map(f => (
            <div key={f.id || f.url} className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                <i className="fas fa-file"></i>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700 }}>{f.originalName || f.filename || "-"}</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {f.docType || "document"} {f.uploadedAt ? `· ${new Date(f.uploadedAt).toLocaleString("th-TH")}` : ""}
                </p>
              </div>
              {f.url && (
                <a href={f.url} target="_blank" rel="noopener" className="btn btn-ghost">
                  <i className="fas fa-download"></i>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </RoleDashboardShell>
  );
}
