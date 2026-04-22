"use client";

const STEPS = [
  { num: "01", title: "สมัครสมาชิก", desc: "สร้างบัญชีผู้ใช้และกรอกข้อมูลส่วนตัวเบื้องต้นให้ครบถ้วน" },
  { num: "02", title: "เลือกโครงการ", desc: "ค้นหาและเลือกทริปศึกษาดูงาน หรือตำแหน่งฝึกงานที่สนใจ" },
  { num: "03", title: "ดำเนินการ", desc: "ยื่นเอกสาร สัมภาษณ์ หรือเข้าร่วมกิจกรรมตามที่กำหนดไว้" },
  { num: "04", title: "รับผลลัพธ์", desc: "ส่งรายงาน ติดตามผลการประเมิน และรับใบรับรองเมื่อสำเร็จ" }
];

export default function StepsSection() {
  return (
    <section style={{ padding: "100px 32px", background: "white" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>HOW IT WORKS</p>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", marginBottom: 16 }}>ขั้นตอนการใช้งานง่ายๆ</h2>
          <p style={{ fontSize: 15, color: "#64748B", fontWeight: 500 }}>เริ่มต้นใช้งานแพลตฟอร์มได้ใน 4 ขั้นตอน</p>
        </div>
        <div className="steps-container reveal reveal-delay-1">
          <div className="step-connector"></div>
          {STEPS.map((s, i) => (
            <div key={i} className="step-item">
              <div className="step-number">{s.num}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6, fontWeight: 500 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
