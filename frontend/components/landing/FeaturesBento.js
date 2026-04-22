"use client";
import Link from "next/link";

const FEATURES = [
  {
    icon: "fa-route", color: "#2563EB", bg: "#EFF6FF",
    title: "ทริปศึกษาดูงานแบบครบวงจร",
    desc: "บริหารจัดการแผนทริปภาคสนาม ตารางเวลา งบประมาณ และเอกสารที่เกี่ยวข้องอย่างครบวงจร ให้นักศึกษาและอาจารย์วางแผนและติดตามได้ง่ายขึ้น",
    link: "ดูทริปทั้งหมด",
    bullets: ["ลงทะเบียนออนไลน์", "ตรวจสอบตารางเวลา", "อนุมัติเอกสารอัตโนมัติ"]
  },
  {
    icon: "fa-briefcase", color: "#059669", bg: "#ECFDF5",
    title: "ฝึกงานกับพันธมิตร",
    desc: "เชื่อมนักศึกษากับบริษัทชั้นนำ บริหารใบสมัคร",
    link: "ดูตำแหน่งว่าง"
  },
  {
    icon: "fa-file-lines", color: "#7C3AED", bg: "#F5F3FF",
    title: "รายงานผลดิจิทัล",
    desc: "ส่งและตรวจสอบรายงานการฝึกงาน ลดการใช้กระดาษ",
    link: "ดูข้อมูลเพิ่มเติม"
  },
  {
    icon: "fa-chart-pie", color: "#0891B2", bg: "#ECFEFF",
    title: "Analytics Dashboard",
    desc: "วิเคราะห์ข้อมูลสถิติของโปรแกรมต่างๆ",
    link: "ดูสถิติ"
  }
];

export default function FeaturesBento() {
  return (
    <section id="features" style={{ padding: "100px 32px", background: "#F1F5F9" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>ฟีเจอร์หลัก</p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", marginBottom: 16 }}>ทุกสิ่งที่คุณต้องการในที่เดียว</h2>
          <p style={{ fontSize: 16, color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>ครบครันด้วยเครื่องมือที่ออกแบบมาเพื่อการพัฒนาอาชีพนักศึกษาโดยเฉพาะ</p>
        </div>

        <div className="bento-grid reveal reveal-delay-1">
          {FEATURES.map((f, i) => (
            <div key={i} className="bento-card">
              <div className="bento-icon" style={{ background: f.bg, color: f.color }}>
                <i className={`fas ${f.icon}`} />
              </div>
              <h3 style={{ fontSize: i === 0 ? 22 : 18, fontWeight: 800, color: "#0F172A", marginBottom: 12, letterSpacing: "-0.5px" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 20, fontWeight: 500 }}>{f.desc}</p>
              
              {f.bullets && (
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0" }}>
                  {f.bullets.map((b, bi) => (
                    <li key={bi} style={{ fontSize: 14, color: "#475569", fontWeight: 600, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                      <i className="fas fa-check-circle" style={{ color: "#10B981" }} /> {b}
                    </li>
                  ))}
                </ul>
              )}
              
              <Link href={`/preview-feature/${i + 1}`} style={{ fontSize: 13, fontWeight: 800, color: f.color, display: "inline-flex", alignItems: "center", gap: 6, transition: "gap 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.gap="10px"}
                onMouseLeave={e => e.currentTarget.style.gap="6px"}>
                {f.link} <i className="fas fa-arrow-right" style={{ fontSize: 10 }}></i>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
