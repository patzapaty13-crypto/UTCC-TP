"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="การแจ้งเตือน" subtitle="การแจ้งเตือนของคุณ">
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#3B82F6", marginBottom: 16 }}></i>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return (
    <RoleDashboardShell role="COMPANY" title="การแจ้งเตือน" subtitle="การแจ้งเตือนของคุณ">
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "grid", gap: 12 }}>
          {notifications.length === 0 ? (
            <p className="text-muted" style={{ textAlign: "center", padding: 40 }}>
              ยังไม่มีการแจ้งเตือน
            </p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} style={{ borderBottom: "1px solid #E2E8F0", padding: "16px 0" }}>
                <p style={{ fontWeight: 600, fontSize: 16, color: "#0F172A" }}>{notif.title}</p>
                <p className="text-muted" style={{ marginTop: 4, fontSize: 14 }}>{notif.message}</p>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 8 }}>
                  {new Date(notif.createdAt).toLocaleString("th-TH")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </RoleDashboardShell>
  );
}
