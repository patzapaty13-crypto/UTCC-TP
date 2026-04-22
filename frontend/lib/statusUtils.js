// Normalize status to ensure consistent status values
export function normalizeStatus(status) {
  if (!status) return "PENDING";
  
  // Map various status formats to standard format
  const statusMap = {
    "PENDING": "PENDING",
    "UNDER_REVIEW": "UNDER_REVIEW",
    "REVIEWING": "UNDER_REVIEW",
    "INTERVIEW_SCHEDULED": "INTERVIEW_SCHEDULED",
    "INTERVIEW": "INTERVIEW_SCHEDULED",
    "INTERVIEW_COMPLETED": "INTERVIEW_COMPLETED",
    "INTERVIEWED": "INTERVIEW_COMPLETED",
    "OFFER_RECEIVED": "OFFER_RECEIVED",
    "OFFER": "OFFER_RECEIVED",
    "ACCEPTED": "ACCEPTED",
    "HIRED": "ACCEPTED",
    "REJECTED": "REJECTED",
    "DECLINED": "REJECTED",
    "WITHDRAWN": "WITHDRAWN",
    "CANCELLED": "WITHDRAWN"
  };

  return statusMap[status?.toUpperCase()] || status.toUpperCase();
}

// Get status configuration for display
export function getStatusConfig(status) {
  const normalized = normalizeStatus(status);
  
  const configMap = {
    PENDING: {
      label: "รอการตรวจสอบ 5 - 7 วัน",
      color: "#F59E0B",
      background: "#FEF3C7",
      borderColor: "#FCD34D",
      textColor: "#92400E",
      icon: "fa-clock"
    },
    UNDER_REVIEW: {
      label: "กำลังตรวจสอบ",
      color: "#3B82F6",
      background: "#DBEAFE",
      borderColor: "#93C5FD",
      textColor: "#1E40AF",
      icon: "fa-magnifying-glass"
    },
    INTERVIEW_SCHEDULED: {
      label: "นัดสัมภาษณ์",
      color: "#7C3AED",
      background: "#EDE9FE",
      borderColor: "#C4B5FD",
      textColor: "#5B21B6",
      icon: "fa-calendar-check"
    },
    INTERVIEW_COMPLETED: {
      label: "สัมภาษณ์เสร็จสิ้น",
      color: "#10B981",
      background: "#D1FAE5",
      borderColor: "#6EE7B7",
      textColor: "#065F46",
      icon: "fa-check-circle"
    },
    OFFER_RECEIVED: {
      label: "ได้รับข้อเสนอ",
      color: "#10B981",
      background: "#D1FAE5",
      borderColor: "#6EE7B7",
      textColor: "#065F46",
      icon: "fa-file-contract"
    },
    ACCEPTED: {
      label: "รับข้อเสนอแล้ว",
      color: "#10B981",
      background: "#D1FAE5",
      borderColor: "#6EE7B7",
      textColor: "#065F46",
      icon: "fa-handshake"
    },
    REJECTED: {
      label: "ไม่ผ่านการคัดเลือก",
      color: "#EF4444",
      background: "#FEE2E2",
      borderColor: "#FCA5A5",
      textColor: "#991B1B",
      icon: "fa-times-circle"
    },
    WITHDRAWN: {
      label: "ถอนใบสมัคร",
      color: "#64748B",
      background: "#F1F5F9",
      borderColor: "#CBD5E1",
      textColor: "#475569",
      icon: "fa-ban"
    }
  };

  return configMap[normalized] || configMap.PENDING;
}
