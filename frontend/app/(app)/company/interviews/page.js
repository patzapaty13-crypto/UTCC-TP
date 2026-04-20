"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [form, setForm] = useState({
    scheduledAt: "",
    location: "",
    interviewerName: "",
    notes: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [ints, apps] = await Promise.all([
        api.getInterviews(),
        api.getApplications()
      ]);
      setInterviews(ints || []);
      setApplications(apps.filter(a => a.status === "INTERVIEW_SCHEDULED") || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await api.createInterview({
        applicationId: selectedApp.id,
        ...form,
      });
      setShowModal(false);
      setSelectedApp(null);
      setForm({ scheduledAt: "", location: "", interviewerName: "", notes: "" });
      await loadData();
      alert("นัดสัมภาษณ์สำเร็จ");
    } catch (e) {
      alert("เกิดข้อผิดพลาด: " + e.message);
    }
  };

  // Group interviews by date
  const upcomingInterviews = interviews.filter(i => new Date(i.scheduledAt) >= new Date());
  const pastInterviews = interviews.filter(i => new Date(i.scheduledAt) < new Date());

  return (
    <RoleDashboardShell 
      role="COMPANY" 
      title="การสัมภาษณ์" 
      subtitle="จัดการและติดตามการสัมภาษณ์ผู้สมัคร"
    >
      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i>{error}</div>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-calendar-check" style={{ marginRight: 6 }}></i>
            สัมภาษณ์ที่กำลังจะมาถึง
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--primary)" }}>{upcomingInterviews.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-users" style={{ marginRight: 6 }}></i>
            รอนัดสัมภาษณ์
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--warning)" }}>{applications.length}</p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginBottom: 8 }}>
            <i className="fas fa-check-circle" style={{ marginRight: 6 }}></i>
            สัมภาษณ์แล้ว
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "var(--success)" }}>{pastInterviews.length}</p>
        </div>
      </div>

      {/* Pending Interviews */}
      {applications.length > 0 && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-clock" style={{ marginRight: 10, color: "var(--warning)" }}></i>
            รอนัดสัมภาษณ์ ({applications.length})
          </h3>
          <div style={{ display: "grid", gap: 12 }}>
            {applications.map(app => (
              <div key={app.id} style={{ 
                padding: 16, 
                background: "var(--n-50)", 
                borderRadius: 12,
                border: "1px solid var(--n-200)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                    {app.studentName || app.fullName || "ไม่ระบุชื่อ"}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    <i className="fas fa-briefcase" style={{ marginRight: 6 }}></i>
                    {app.positionTitle || "ไม่ระบุตำแหน่ง"}
                  </p>
                  {app.gpa && (
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                      <i className="fas fa-graduation-cap" style={{ marginRight: 6 }}></i>
                      GPA: {app.gpa}
                    </p>
                  )}
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => { setSelectedApp(app); setShowModal(true); }}
                >
                  <i className="fas fa-calendar-plus" style={{ marginRight: 6 }}></i>
                  นัดสัมภาษณ์
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-calendar-check" style={{ marginRight: 10, color: "var(--primary)" }}></i>
            สัมภาษณ์ที่กำลังจะมาถึง ({upcomingInterviews.length})
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            {upcomingInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </div>
        </div>
      )}

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div className="card" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 20 }}>
            <i className="fas fa-history" style={{ marginRight: 10, color: "var(--text-muted)" }}></i>
            สัมภาษณ์ที่ผ่านมา ({pastInterviews.length})
          </h3>
          <div style={{ display: "grid", gap: 16 }}>
            {pastInterviews.map(interview => (
              <InterviewCard key={interview.id} interview={interview} isPast />
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }}></div>)}
        </div>
      )}

      {!loading && interviews.length === 0 && applications.length === 0 && (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: 48, color: "var(--n-300)", marginBottom: 16 }}>
            <i className="fas fa-calendar-xmark"></i>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>ยังไม่มีการสัมภาษณ์</h3>
          <p style={{ color: "var(--text-muted)" }}>
            เมื่อมีผู้สมัครที่ผ่านการพิจารณา คุณสามารถนัดสัมภาษณ์ได้ที่นี่
          </p>
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && selectedApp && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} onClick={() => setShowModal(false)}>
          <div className="card animate-scale-in" style={{ width: "100%", maxWidth: 500, padding: 32, position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 18, color: "var(--n-400)", cursor: "pointer" }}
            >
              <i className="fas fa-xmark"></i>
            </button>

            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 24 }}>
              <i className="fas fa-calendar-plus" style={{ marginRight: 10, color: "var(--primary)" }}></i>
              นัดสัมภาษณ์
            </h2>

            <div style={{ padding: 16, background: "var(--n-50)", borderRadius: 12, marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                {selectedApp.studentName || selectedApp.fullName}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {selectedApp.positionTitle}
              </p>
            </div>

            <form onSubmit={handleSchedule} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-group">
                <label className="field-label">วันและเวลา *</label>
                <input 
                  className="field-input" 
                  type="datetime-local" 
                  value={form.scheduledAt} 
                  onChange={(e) => setForm({...form, scheduledAt: e.target.value})} 
                  required 
                />
              </div>

              <div className="field-group">
                <label className="field-label">สถานที่ *</label>
                <input 
                  className="field-input" 
                  placeholder="เช่น ห้องประชุม A, Zoom Meeting" 
                  value={form.location} 
                  onChange={(e) => setForm({...form, location: e.target.value})} 
                  required 
                />
              </div>

              <div className="field-group">
                <label className="field-label">ผู้สัมภาษณ์</label>
                <input 
                  className="field-input" 
                  placeholder="ชื่อผู้สัมภาษณ์" 
                  value={form.interviewerName} 
                  onChange={(e) => setForm({...form, interviewerName: e.target.value})} 
                />
              </div>

              <div className="field-group">
                <label className="field-label">หมายเหตุ</label>
                <textarea 
                  className="field-input" 
                  placeholder="ข้อมูลเพิ่มเติมสำหรับการสัมภาษณ์" 
                  value={form.notes} 
                  onChange={(e) => setForm({...form, notes: e.target.value})} 
                  rows={3}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  <i className="fas fa-check" style={{ marginRight: 8 }}></i>
                  ยืนยันนัดหมาย
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </RoleDashboardShell>
  );
}

function InterviewCard({ interview, isPast }) {
  const date = new Date(interview.scheduledAt);
  const isToday = date.toDateString() === new Date().toDateString();
  
  return (
    <div style={{ 
      padding: 20, 
      background: isPast ? "var(--n-50)" : "var(--primary-50)", 
      borderRadius: 16,
      border: `1px solid ${isPast ? "var(--n-200)" : "var(--primary-200)"}`,
      opacity: isPast ? 0.7 : 1
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>
            {interview.studentName || "ไม่ระบุชื่อ"}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            <i className="fas fa-briefcase" style={{ marginRight: 6 }}></i>
            {interview.positionTitle || "ไม่ระบุตำแหน่ง"}
          </p>
        </div>
        {isToday && !isPast && (
          <span className="badge badge-error" style={{ fontSize: 11 }}>
            <i className="fas fa-exclamation-circle" style={{ marginRight: 4 }}></i>
            วันนี้
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
            <i className="fas fa-calendar" style={{ marginRight: 6 }}></i>
            วันที่
          </p>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
            <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
            เวลา
          </p>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.
          </p>
        </div>
      </div>

      {interview.location && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
            <i className="fas fa-location-dot" style={{ marginRight: 6 }}></i>
            สถานที่
          </p>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {interview.location}
          </p>
        </div>
      )}

      {interview.interviewerName && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", marginBottom: 4 }}>
            <i className="fas fa-user-tie" style={{ marginRight: 6 }}></i>
            ผู้สัมภาษณ์
          </p>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {interview.interviewerName}
          </p>
        </div>
      )}

      {interview.notes && (
        <div style={{ marginTop: 12, padding: 12, background: "white", borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            {interview.notes}
          </p>
        </div>
      )}
    </div>
  );
}
