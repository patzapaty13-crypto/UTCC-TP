"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { useToast } from "@/components/Toast";

export default function AssignAdvisorPage() {
  const { addToast } = useToast();
  const [students, setStudents] = useState([]);
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const users = await api.getUsers();
      setStudents((users || []).filter(u => u.roles?.includes("STUDENT")));
      setAdvisors((users || []).filter(u => u.roles?.includes("ADVISOR")));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const assign = async (student, advisorId) => {
    setSavingId(student.id);
    try {
      await api.updateUser(student.id, { advisorId: advisorId || null });
      addToast("บันทึกการกำหนดอาจารย์แล้ว", "success");
      load();
    } catch (err) {
      addToast("ผิดพลาด: " + err.message, "error");
    } finally { setSavingId(null); }
  };

  const filtered = students.filter(s =>
    !search ||
    s.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RoleDashboardShell role="STAFF" title="กำหนดอาจารย์ที่ปรึกษา" subtitle="จับคู่นักศึกษากับอาจารย์ที่ปรึกษา">
      <input
        type="search"
        placeholder="ค้นหาชื่อ/รหัสนักศึกษา..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="field-input"
        style={{ maxWidth: 360, marginBottom: 16 }}
      />

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 14 }}></div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: "center" }}>
          <i className="fas fa-user-graduate" style={{ fontSize: 40, color: "var(--n-300)" }}></i>
          <h3 style={{ marginTop: 16 }}>ไม่มีนักศึกษา</h3>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ</th>
                <th>สาขา/คณะ</th>
                <th>อาจารย์ที่ปรึกษา</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700 }}>{s.studentId || "-"}</td>
                  <td>{s.displayName || s.username}</td>
                  <td style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {s.major || "-"}{s.faculty ? ` / ${s.faculty}` : ""}
                  </td>
                  <td>
                    <select
                      className="field-input"
                      value={s.advisorId || ""}
                      disabled={savingId === s.id}
                      onChange={e => assign(s, e.target.value)}
                      style={{ minWidth: 220 }}
                    >
                      <option value="">— ยังไม่กำหนด —</option>
                      {advisors.map(a => (
                        <option key={a.id} value={a.id}>{a.displayName || a.username}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    {savingId === s.id && <i className="fas fa-spinner fa-spin"></i>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </RoleDashboardShell>
  );
}
