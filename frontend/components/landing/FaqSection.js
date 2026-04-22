"use client";
import { useState } from "react";

const FAQS = [
  { q: "ระบบนี้ใช้สำหรับใคร?", a: "ระบบนี้ออกแบบมาสำหรับนักศึกษา อาจารย์ที่ปรึกษา เจ้าหน้าที่ของมหาวิทยาลัย และบริษัทพันธมิตรที่ร่วมโครงการฝึกงานกับ UTCC" },
  { q: "ต้องเสียค่าใช้จ่ายไหม?", a: "ไม่มีค่าใช้จ่ายใดๆ ระบบนี้ให้บริการฟรีสำหรับนักศึกษาและบุคลากรของมหาวิทยาลัยหอการค้าไทยทุกคน" },
  { q: "สามารถใช้บนมือถือได้ไหม?", a: "ได้ครับ ระบบถูกออกแบบเป็น Responsive Design รองรับทุกอุปกรณ์ทั้งคอมพิวเตอร์ แท็บเล็ต และสมาร์ทโฟน" },
  { q: "ข้อมูลปลอดภัยหรือไม่?", a: "ข้อมูลทุกอย่างถูกเข้ารหัสด้วยมาตรฐาน SSL/TLS และจัดเก็บบนเซิร์ฟเวอร์ที่ปลอดภัยตามมาตรฐานสากล" },
  { q: "ติดต่อขอความช่วยเหลือได้อย่างไร?", a: "สามารถติดต่อฝ่ายสนับสนุนผ่านอีเมล support@utcc.ac.th หรือโทร 02-697-6000 ในวันและเวลาทำการ" },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section style={{ padding: "100px 32px", background: "#F8FAFC" }}>
      <div className="reveal" style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>FAQ</p>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", marginBottom: 16 }}>คำถามที่พบบ่อย</h2>
          <p style={{ fontSize: 15, color: "#64748B", fontWeight: 500 }}>หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อเราได้ตลอดเวลา</p>
        </div>
        {FAQS.map((f, i) => (
          <div key={i} className={`faq-item ${openIdx === i ? "open" : ""}`}>
            <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
              {f.q}
              <i className="fas fa-chevron-down" />
            </button>
            <div className="faq-answer"><p>{f.a}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
