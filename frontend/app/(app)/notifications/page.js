"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TYPE_CONFIG = {
  INFO: { icon: "fa-circle-info", color: "#2563EB", bg: "#EFF6FF" },
  SUCCESS: { icon: "fa-circle-check", color: "#059669", bg: "#ECFDF5" },
  WARNING: { icon: "fa-triangle-exclamation", color: "#F59E0B", bg: "#FFFBEB" },
  ERROR: { icon: "fa-circle-exclamation", color: "#DC2626", bg: "#FEF2F2" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    api.getNotifications()
      .then(setNotifications)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: "READ" } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => n.status !== "READ").map(n => n.id);
    await Promise.all(unreadIds.map(id => api.markNotificationRead(id)));
    setNotifications(prev => prev.map(n => ({ ...n, status: "READ" })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return n.status !== "READ";
    if (filter === "READ") return n.status === "READ";
    return true;
  });

  const unreadCount = notifications.filter(n => n.status !== "READ").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Notifications Center</p>
          <h1 className="page-title">การแจ้งเตือน</h1>
          <p className="page-subtitle">ติดตามกิจกรรมและอัปเดตล่าสุดจากระบบ</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-secondary" onClick={handleMarkAllRead}>
            <i className="fas fa-check-double"></i> อ่านทั้งหมด
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            className={`btn ${filter === "ALL" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("ALL")}
            style={{ fontSize: 13 }}
          >
            ทั้งหมด ({notifications.length})
          </button>
          <button
            className={`btn ${filter === "UNREAD" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("UNREAD")}
            style={{ fontSize: 13 }}
          >
            ยังไม่อ่าน ({unreadCount})
          </button>
          <button
            className={`btn ${filter === "READ" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setFilter("READ")}
            style={{ fontSize: 13 }}
          >
            อ่านแล้ว ({notifications.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card">
        {loading ? (
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 10 }}></div>)}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><i className="fas fa-bell"></i></div>
            <h3>ไม่มีการแจ้งเตือน</h3>
            <p>{filter === "UNREAD" ? "คุณอ่านการแจ้งเตือนทั้งหมดแล้ว" : "ยังไม่มีการแจ้งเตือนในระบบ"}</p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((n, idx) => {
              const typeConfig = TYPE_CONFIG[n.type] || TYPE_CONFIG.INFO;
              const isUnread = n.status !== "READ";
              
              return (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 20,
                    borderBottom: idx < filteredNotifications.length - 1 ? "1px solid var(--border)" : "none",
                    background: isUnread ? "var(--n-50)" : "transparent",
                    transition: "background var(--transition)",
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: typeConfig.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: typeConfig.color,
                    fontSize: 18,
                    flexShrink: 0,
                  }}>
                    <i className={`fas ${typeConfig.icon}`}></i>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>
                        {n.title}
                      </h3>
                      {isUnread && (
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#2563EB",
                          flexShrink: 0,
                        }}></span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                      {n.message}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                      <i className="fas fa-clock" style={{ marginRight: 5 }}></i>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString("th-TH") : "เมื่อสักครู่"}
                    </p>
                  </div>

                  {/* Action */}
                  {isUnread && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="btn-text"
                      style={{ fontSize: 13, flexShrink: 0 }}
                    >
                      <i className="fas fa-check"></i> อ่านแล้ว
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
