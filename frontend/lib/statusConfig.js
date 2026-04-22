// Status configuration for applications
export const STATUS_CONFIG = {
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
  ADVISOR_APPROVED: {
    label: "อนุมัติ",
    color: "#10B981",
    background: "#D1FAE5",
    borderColor: "#6EE7B7",
    textColor: "#065F46",
    icon: "fa-check-circle"
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
    label: "ปฏิเสธ",
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

export function getStatusConfig(status) {
  if (!status) return STATUS_CONFIG.PENDING;
  return STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
}
