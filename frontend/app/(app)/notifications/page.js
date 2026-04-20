"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TYPE_CFG = {
  APPLICATION: { icon: "fa-clipboard-list", color: "#2563EB", bg: "#EFF6FF" },
  REPORT:      { icon: "fa-file-lines",     color: "#7C3AED", bg: "#F5F3FF" },
  SYSTEM:      { icon: "fa-gear",           color: "#059669", bg: "#ECFDF5" },
  TRIP:        { icon: "fa-bus",            color: "#0891B2", bg: "#ECFEFF" },
  INTERVIEW:   { icon: "fa-calendar-check", color: "#D97706", bg: "#FFFBEB" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.getNotifications()
      .then(setNotifications)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: "READ" } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => n.status !== "READ").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Communication Center</p>
          <h1 className="page-title">การแจ้งเตือน</h1>
          <p className="page-subtitle">
            {unreadCount > 0 ? `คุณมี ${unreadCount} รายการที่ยังไม่ได้อ่าน` : "ไม่มีรายการใหม่"}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

      <div className="data-table-wrap">
        {loading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 10 }}></div>)}
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-bell-slash"></i></div>
            <h3>ไม่มีการแจ้งเตือน</h3>
            <p>เมื่อมีกิจกรรมใหม่ในระบบ คุณจะได้รับการแจ้งเตือนที่นี่</p>
          </div>
        ) : (
          <div>
            {notifications.map((n, idx) => {
              const cfg = TYPE_CFG[n.type] || TYPE_CFG.SYSTEM;
              const isUnread = n.status !== "READ";
              return (
                <div
                  key={n.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "18px 24px",
                    borderBottom: idx < notifications.length - 1 ? "1px solid var(--n-50)" : "none",
                    background: isUnread ? "rgba(37,99,235,0.03)" : "transparent",
                    transition: "background var(--transition)",
                    cursor: isUnread ? "pointer" : "default",
                  }}
                  onClick={() => isUnread && handleMarkRead(n.id)}
                >
                  {/* Icon */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: cfg.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: cfg.color, fontSize: 16,
                  }}>
                    <i className={`fas ${cfg.icon}`}></i>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontSize: 13.5, fontWeight: isUnread ? 700 : 500, color: "var(--text-primary)" }}>{n.title}</p>
                      {isUnread && <span className="dot dot-blue dot-pulse" style={{ width: 6, height: 6, flexShrink: 0 }}></span>}
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 3 }}>{n.message}</p>
                  </div>

                  {/* Time */}
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: "var(--n-300)", fontWeight: 600 }}>
                      {n.createdAt ? formatRelativeTime(n.createdAt) : "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "เมื่อสักครู่";
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} วันที่แล้ว`;
  return d.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}
