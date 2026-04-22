package org.example.utcctp.model;

public enum ApplicationStatus {
    DRAFT,              // ร่าง (ยังไม่ส่ง)
    PENDING,            // รอ Advisor อนุมัติ
    ADVISOR_APPROVED,   // Advisor อนุมัติแล้ว
    REVIEWING,          // Company กำลังพิจารณา
    SHORTLISTED,        // ผ่านรอบแรก
    INTERVIEW_SCHEDULED,// นัดสัมภาษณ์แล้ว
    INTERVIEW_COMPLETED,// สัมภาษณ์เสร็จแล้ว
    OFFER_EXTENDED,     // ส่ง Offer แล้ว
    ACCEPTED,           // ตอบรับแล้ว
    REJECTED,           // ปฏิเสธ
    WITHDRAWN           // ถอนใบสมัคร
}
