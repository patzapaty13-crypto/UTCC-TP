"use client";

import { normalizeStatus } from "@/lib/statusUtils";

// Main NextStepGuidance component
export function NextStepGuidance({ application, userRole }) {
  const status = normalizeStatus(application.status);
  const guidance = getGuidance(status, userRole);

  if (!guidance) return null;

  return (
    <div style={{
      padding: 16,
      background: "#F0F9FF",
      border: "1px solid #BAE6FD",
      borderRadius: 12,
      marginBottom: 16
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#3B82F6",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          flexShrink: 0
        }}>
          <i className={`fas ${guidance.icon}`}></i>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: "#1E40AF", marginBottom: 4 }}>
            {guidance.title}
          </h4>
          <p style={{ fontSize: 13, color: "#1E3A8A", lineHeight: 1.5 }}>
            {guidance.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Student-specific guidance
export function StudentGuidance({ application }) {
  const status = normalizeStatus(application.status);
  const guidance = getStudentGuidance(status);

  if (!guidance) return null;

  return (
    <div style={{
      padding: 20,
      background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
      border: "1px solid #BAE6FD",
      borderRadius: 16,
      marginBottom: 20
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "#3B82F6",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0
        }}>
          <i className={`fas ${guidance.icon}`}></i>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: 16, fontWeight: 900, color: "#1E40AF", marginBottom: 8 }}>
            {guidance.title}
          </h4>
          <p style={{ fontSize: 14, color: "#1E3A8A", lineHeight: 1.6, marginBottom: 12 }}>
            {guidance.description}
          </p>
          {guidance.actions && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {guidance.actions.map((action, index) => (
                <button
                  key={index}
                  style={{
                    padding: "8px 16px",
                    background: "#3B82F6",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline version for cards
export function InlineNextStepGuidance({ application, userRole }) {
  const status = normalizeStatus(application.status);
  const guidance = getInlineGuidance(status, userRole);

  if (!guidance) return null;

  return (
    <div style={{
      padding: 12,
      background: guidance.background || "#F8FAFC",
      border: `1px solid ${guidance.borderColor || "#E2E8F0"}`,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      gap: 10
    }}>
      <i
        className={`fas ${guidance.icon}`}
        style={{
          color: guidance.color || "#64748B",
          fontSize: 14
        }}
      ></i>
      <span style={{
        fontSize: 12,
        fontWeight: 600,
        color: guidance.textColor || "#475569"
      }}>
        {guidance.text}
      </span>
    </div>
  );
}

// Helper functions
function getGuidance(status, userRole) {
  const guidanceMap = {
    PENDING: {
      icon: "fa-clock",
      title: "รอการตรวจสอบ 5 - 7 วัน",
      description: "บริษัทกำลังตรวจสอบใบสมัครของคุณ โปรดรอการติดต่อกลับ"
    },
    UNDER_REVIEW: {
      icon: "fa-magnifying-glass",
      title: "กำลังตรวจสอบ",
      description: "บริษัทกำลังพิจารณาใบสมัครของคุณ"
    },
    INTERVIEW_SCHEDULED: {
      icon: "fa-calendar-check",
      title: "นัดสัมภาษณ์",
      description: "คุณมีนัดสัมภาษณ์แล้ว โปรดตรวจสอบรายละเอียดและเตรียมตัว"
    },
    INTERVIEW_COMPLETED: {
      icon: "fa-check-circle",
      title: "สัมภาษณ์เสร็จสิ้น",
      description: "บริษัทกำลังพิจารณาผลการสัมภาษณ์"
    },
    OFFER_RECEIVED: {
      icon: "fa-file-contract",
      title: "ได้รับข้อเสนอ",
      description: "คุณได้รับข้อเสนองาน โปรดตรวจสอบและตัดสินใจ"
    },
    ACCEPTED: {
      icon: "fa-handshake",
      title: "รับข้อเสนอแล้ว",
      description: "คุณได้รับข้อเสนอแล้ว รอการดำเนินการต่อ"
    },
    REJECTED: {
      icon: "fa-times-circle",
      title: "ไม่ผ่านการคัดเลือก",
      description: "ขอบคุณที่สนใจ"
    },
    WITHDRAWN: {
      icon: "fa-ban",
      title: "ถอนใบสมัคร",
      description: "คุณได้ถอนใบสมัครนี้แล้ว"
    }
  };

  return guidanceMap[status] || null;
}

function getStudentGuidance(status) {
  const guidanceMap = {
    PENDING: {
      icon: "fa-clock",
      title: "รอการตรวจสอบ 5 - 7 วัน",
      description: "รอการตรวจสอบ",
      actions: []
    },
    UNDER_REVIEW: {
      icon: "fa-magnifying-glass",
      title: "กำลังตรวจสอบ",
      description: "บริษัทกำลังพิจารณาใบสมัครของคุณอย่างละเอียด โปรดเตรียมตัวสำหรับการสัมภาษณ์",
      actions: ["เตรียมตัวสัมภาษณ์"]
    },
    INTERVIEW_SCHEDULED: {
      icon: "fa-calendar-check",
      title: "นัดสัมภาษณ์",
      description: "คุณมีนัดสัมภาษณ์แล้ว โปรดตรวจสอบรายละเอียดวันเวลาและสถานที่ และเตรียมตัวให้พร้อม",
      actions: ["ดูรายละเอียดนัด", "เตรียมตัวสัมภาษณ์"]
    },
    INTERVIEW_COMPLETED: {
      icon: "fa-check-circle",
      title: "สัมภาษณ์เสร็จสิ้น",
      description: "บริษัทกำลังพิจารณาผลการสัมภาษณ์ โปรดรอการติดต่อกลับ",
      actions: []
    },
    OFFER_RECEIVED: {
      icon: "fa-file-contract",
      title: "ได้รับข้อเสนอ",
      description: "ยินดีด้วย! คุณได้รับข้อเสนองาน โปรดตรวจสอบรายละเอียดและตัดสินใจภายในเวลาที่กำหนด",
      actions: ["รับข้อเสนอ", "ปฏิเสธข้อเสนอ"]
    },
    ACCEPTED: {
      icon: "fa-handshake",
      title: "รับข้อเสนอแล้ว",
      description: "คุณได้รับข้อเสนอแล้ว รอการดำเนินการเอกสารและเริ่มงาน",
      actions: ["ดูสัญญา", "เตรียมเอกสาร"]
    },
    REJECTED: {
      icon: "fa-times-circle",
      title: "ไม่ผ่านการคัดเลือก",
      description: "ขอบคุณที่สนใจ อย่าท้อแท้ ลองปรับปรุงโปรไฟล์และสมัครตำแหน่งอื่น",
      actions: ["ปรับปรุงโปรไฟล์"]
    },
    WITHDRAWN: {
      icon: "fa-ban",
      title: "ถอนใบสมัคร",
      description: "คุณได้ถอนใบสมัครนี้แล้ว คุณสามารถสมัครตำแหน่งอื่นได้",
      actions: []
    }
  };

  return guidanceMap[status] || null;
}

function getInlineGuidance(status, userRole) {
  const guidanceMap = {
    PENDING: {
      icon: "fa-clock",
      text: "รอการตรวจสอบ",
      color: "#F59E0B",
      background: "#FEF3C7",
      borderColor: "#FCD34D",
      textColor: "#92400E"
    },
    UNDER_REVIEW: {
      icon: "fa-magnifying-glass",
      text: "กำลังตรวจสอบ",
      color: "#3B82F6",
      background: "#DBEAFE",
      borderColor: "#93C5FD",
      textColor: "#1E40AF"
    },
    INTERVIEW_SCHEDULED: {
      icon: "fa-calendar-check",
      text: "นัดสัมภาษณ์แล้ว",
      color: "#7C3AED",
      background: "#EDE9FE",
      borderColor: "#C4B5FD",
      textColor: "#5B21B6"
    },
    INTERVIEW_COMPLETED: {
      icon: "fa-check-circle",
      text: "สัมภาษณ์เสร็จสิ้น",
      color: "#10B981",
      background: "#D1FAE5",
      borderColor: "#6EE7B7",
      textColor: "#065F46"
    },
    OFFER_RECEIVED: {
      icon: "fa-file-contract",
      text: "ได้รับข้อเสนอ",
      color: "#10B981",
      background: "#D1FAE5",
      borderColor: "#6EE7B7",
      textColor: "#065F46"
    },
    ACCEPTED: {
      icon: "fa-handshake",
      text: "รับข้อเสนอแล้ว",
      color: "#10B981",
      background: "#D1FAE5",
      borderColor: "#6EE7B7",
      textColor: "#065F46"
    },
    REJECTED: {
      icon: "fa-times-circle",
      text: "ไม่ผ่านการคัดเลือก",
      color: "#EF4444",
      background: "#FEE2E2",
      borderColor: "#FCA5A5",
      textColor: "#991B1B"
    },
    WITHDRAWN: {
      icon: "fa-ban",
      text: "ถอนใบสมัคร",
      color: "#64748B",
      background: "#F1F5F9",
      borderColor: "#CBD5E1",
      textColor: "#475569"
    }
  };

  return guidanceMap[status] || null;
}
