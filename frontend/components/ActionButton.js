"use client";

import { useState } from "react";

export default function ActionButton({ application, userRole, onAction, size = "md", layout = "horizontal" }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    console.log("ActionButton handleAction called with:", action);
    setLoading(true);
    try {
      await onAction({
        action: action,
        applicationId: application.id,
        data: application
      });
    } finally {
      setLoading(false);
    }
  };

  const status = application.status;
  const isStudent = userRole === "STUDENT";

  // Define available actions based on status and role
  const getAvailableActions = () => {
    if (isStudent) {
      switch (status) {
        case "PENDING":
          return [
            { id: "withdraw", label: "ถอนใบสมัคร", variant: "danger" }
          ];
        case "INTERVIEW_SCHEDULED":
          return [
            { id: "confirm_interview", label: "ยืนยันนัดสัมภาษณ์", variant: "primary" },
            { id: "reschedule", label: "ขอเลื่อนนัด", variant: "secondary" }
          ];
        case "OFFER_RECEIVED":
          return [
            { id: "accept_offer", label: "รับข้อเสนอ", variant: "success" },
            { id: "decline_offer", label: "ปฏิเสธข้อเสนอ", variant: "danger" }
          ];
        case "ACCEPTED":
          return [
            { id: "view_contract", label: "ดูสัญญา", variant: "secondary" }
          ];
        default:
          return [];
      }
    }
    return [];
  };

  const actions = getAvailableActions();

  if (actions.length === 0) {
    return null;
  }

  const buttonStyle = {
    padding: size === "sm" ? "6px 12px" : size === "lg" ? "12px 24px" : "8px 16px",
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
    fontWeight: 700,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    disabled: loading
  };

  const getVariantStyle = (variant) => {
    switch (variant) {
      case "primary":
        return { background: "#2563EB", color: "white" };
      case "success":
        return { background: "#10B981", color: "white" };
      case "danger":
        return { background: "#EF4444", color: "white" };
      case "secondary":
        return { background: "#64748B", color: "white" };
      default:
        return { background: "#E2E8F0", color: "#475569" };
    }
  };

  if (layout === "horizontal") {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleAction(action.id)}
            style={{ ...buttonStyle, ...getVariantStyle(action.variant) }}
            disabled={loading}
          >
            {loading ? "กำลังดำเนินการ..." : action.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleAction(action.id)}
          style={{ ...buttonStyle, ...getVariantStyle(action.variant), width: "100%" }}
          disabled={loading}
        >
          {loading ? "กำลังดำเนินการ..." : action.label}
        </button>
      ))}
    </div>
  );
}
