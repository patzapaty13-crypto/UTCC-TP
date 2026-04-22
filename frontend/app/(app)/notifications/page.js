"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const TYPE_CONFIG = {
  INFO: { icon: "fa-circle-info", color: "#2563EB", bg: "#EFF6FF" },
  SUCCESS: { icon: "fa-circle-check", color: "#059669", bg: "#ECFDF5" },
  WARNING: { icon: "fa-triangle-exclamation", color: "#F59E0B", bg: "#FFFBEB" },
  ERROR: { icon: "fa-circle-exclamation", color: "#DC2626", bg: "#FEF2F2" },
  INTERVIEW_SCHEDULED: { icon: "fa-calendar-check", color: "#7C3AED", bg: "#F5F3FF" },
  APPLICATION_STATUS_CHANGED: { icon: "fa-file-alt", color: "#2563EB", bg: "#EFF6FF" },
  OFFER_RECEIVED: { icon: "fa-gift", color: "#059669", bg: "#ECFDF5" },
  OFFER_RESPONSE: { icon: "fa-reply", color: "#F59E0B", bg: "#FFFBEB" },
  REPORT_GRADED: { icon: "fa-star", color: "#7C3AED", bg: "#F5F3FF" },
  REPORT_SUBMITTED: { icon: "fa-paper-plane", color: "#2563EB", bg: "#EFF6FF" },
  NEW_APPLICANT: { icon: "fa-user-plus", color: "#059669", bg: "#ECFDF5" },
  SYSTEM_ANNOUNCEMENT: { icon: "fa-bullhorn", color: "#F59E0B", bg: "#FFFBEB" },
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
      // Reload notifications to get updated state from server
      const updated = await api.getNotifications();
      setNotifications(updated);
      window.dispatchEvent(new CustomEvent('notifications_updated'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      window.dispatchEvent(new CustomEvent('notifications_updated'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    await Promise.all(unreadIds.map(id => api.markNotificationRead(id)));
    // Reload notifications to get updated state from server
    const updated = await api.getNotifications();
    setNotifications(updated);
    window.dispatchEvent(new CustomEvent('notifications_updated'));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "READ") return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
          <button 
            onClick={handleMarkAllRead}
            style={{
              padding: "12px 24px",
              background: "#059669",
              color: "white",
              border: "none",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(5, 150, 105, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#047857";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(5, 150, 105, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#059669";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(5, 150, 105, 0.2)";
            }}
          >
            <i className="fas fa-check-double"></i> อ่านทั้งหมด
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setFilter("ALL")}
              style={{
                padding: "10px 20px",
                background: filter === "ALL" ? "#2563EB" : "transparent",
                color: filter === "ALL" ? "white" : "var(--text-secondary)",
                border: filter === "ALL" ? "none" : "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (filter !== "ALL") {
                  e.currentTarget.style.background = "var(--n-50)";
                  e.currentTarget.style.borderColor = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== "ALL") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--border)";
                }
              }}
            >
              <i className="fas fa-list"></i> ทั้งหมด ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              style={{
                padding: "10px 20px",
                background: filter === "UNREAD" ? "#2563EB" : "transparent",
                color: filter === "UNREAD" ? "white" : "var(--text-secondary)",
                border: filter === "UNREAD" ? "none" : "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (filter !== "UNREAD") {
                  e.currentTarget.style.background = "var(--n-50)";
                  e.currentTarget.style.borderColor = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== "UNREAD") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--border)";
                }
              }}
            >
              <i className="fas fa-bell"></i> ยังไม่อ่าน 
              {unreadCount > 0 && (
                <span style={{
                  padding: "2px 8px",
                  background: filter === "UNREAD" ? "rgba(255,255,255,0.2)" : "#DC2626",
                  color: filter === "UNREAD" ? "white" : "white",
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 800,
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter("READ")}
              style={{
                padding: "10px 20px",
                background: filter === "READ" ? "#2563EB" : "transparent",
                color: filter === "READ" ? "white" : "var(--text-secondary)",
                border: filter === "READ" ? "none" : "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (filter !== "READ") {
                  e.currentTarget.style.background = "var(--n-50)";
                  e.currentTarget.style.borderColor = "#2563EB";
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== "READ") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--border)";
                }
              }}
            >
              <i className="fas fa-check-circle"></i> อ่านแล้ว ({notifications.length - unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              style={{
                padding: "10px 20px",
                background: "#059669",
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#047857";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#059669";
              }}
            >
              <i className="fas fa-check-double"></i> อ่านทั้งหมด
            </button>
          )}
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
              const isUnread = !n.read;
              
              return (
                <div
                  key={n.id}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: 20,
                    borderBottom: idx < filteredNotifications.length - 1 ? "1px solid var(--border)" : "none",
                    background: isUnread ? "#EFF6FF" : "transparent",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isUnread ? "#DBEAFE" : "var(--n-50)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isUnread ? "#EFF6FF" : "transparent";
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
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {n.message}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
                      <i className="fas fa-clock" style={{ marginRight: 5 }}></i>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString("th-TH") : "เมื่อสักครู่"}
                    </p>
                  </div>

                  {/* Action */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    {n.link && (
                      <button
                        onClick={() => {
                          window.location.href = n.link;
                        }}
                        style={{
                          padding: "8px 16px",
                          background: "#7C3AED",
                          color: "white",
                          border: "none",
                          borderRadius: 10,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                          boxShadow: "0 2px 8px rgba(124, 58, 237, 0.2)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#6D28D9";
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#7C3AED";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(124, 58, 237, 0.2)";
                        }}
                      >
                        <i className="fas fa-eye"></i> ดูรายละเอียด
                      </button>
                    )}
                    {isUnread && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(n.id);
                        }}
                        style={{
                          padding: "6px 12px",
                          background: "#2563EB",
                          color: "white",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1D4ED8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#2563EB";
                        }}
                      >
                        <i className="fas fa-check"></i> อ่านแล้ว
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n.id);
                      }}
                      style={{
                        padding: "6px 12px",
                        background: "#DC2626",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#B91C1C";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#DC2626";
                      }}
                    >
                      <i className="fas fa-trash"></i> ลบ
                    </button>
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
