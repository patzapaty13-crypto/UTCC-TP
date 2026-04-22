"use client";

const TESTIMONIALS = [
  { name: "สมชาย วิทยาเลิศ", role: "นักศึกษาชั้นปีที่ 4", dept: "คณะบริหารธุรกิจ", color: "#2563EB", quote: "ระบบช่วยให้การสมัครฝึกงานง่ายขึ้นมาก ไม่ต้องเดินยื่นเอกสารเอง ติดตามสถานะได้ตลอดเวลา ประทับใจมากครับ", rating: 5 },
  { name: "ดร.วิไล สุขสมบูรณ์", role: "อาจารย์ที่ปรึกษา", dept: "คณะวิศวกรรมศาสตร์", color: "#10B981", quote: "ในฐานะอาจารย์ที่ปรึกษา ระบบนี้ช่วยให้ดูแลนักศึกษาได้ทั่วถึงมากขึ้น ตรวจรายงานและอนุมัติเอกสารได้จากทุกที่", rating: 5 },
  { name: "พิมพ์ใจ รุ่งเรืองกิจ", role: "นักศึกษาชั้นปีที่ 3", dept: "คณะบัญชี", color: "#7C3AED", quote: "ชอบฟีเจอร์ทริปศึกษาดูงานมาก ดูรายละเอียด ลงทะเบียน และเตรียมตัวได้ครบในที่เดียว ไม่ต้องถามเพื่อนว่าต้องทำอะไร", rating: 5 },
];

export default function TestimonialsSection() {
  return (
    <section style={{ padding: "100px 32px", background: "white" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>TESTIMONIALS</p>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", marginBottom: 16 }}>เสียงจากผู้ใช้งานจริง</h2>
          <p style={{ fontSize: 15, color: "#64748B", maxWidth: 480, margin: "0 auto", fontWeight: 500 }}>ความคิดเห็นจากนักศึกษาและอาจารย์ที่ใช้งานแพลตฟอร์มนี้</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
              <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                {Array.from({ length: t.rating }, (_, j) => (
                  <i key={j} className="fas fa-star" style={{ color: "#F59E0B", fontSize: 13 }} />
                ))}
              </div>
              <div className="testimonial-quote">{t.quote}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="testimonial-avatar" style={{ background: t.color }}>{t.name[0]}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>{t.role} · {t.dept}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
