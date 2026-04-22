"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Mock data (expanded from the landing page)
const INTERNSHIP_DB = {
  "1": {
    company: "Agoda",
    position: "Software Engineer Intern (Summer 2026)",
    date: "15 พ.ค. 2026",
    tags: ["React", "Node.js", "Full-time", "Hybrid"],
    logoBg: "#059669",
    logoChar: "A",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    location: "Central World, Bangkok",
    allowance: "15,000 - 20,000 THB/month",
    description: "เข้าร่วมทีม Core Engineering ของ Agoda เพื่อพัฒนาและปรับปรุงระบบการจองที่พักระดับโลก คุณจะได้ทำงานจริงร่วมกับ Senior Engineer และเรียนรู้ Tech Stack สมัยใหม่ที่ใช้รองรับผู้ใช้งานนับล้านคนต่อวัน",
    requirements: [
      "กำลังศึกษาอยู่ชั้นปีที่ 3 หรือ 4 ในสาขาวิศวกรรมคอมพิวเตอร์, วิทยาการคอมพิวเตอร์ หรือที่เกี่ยวข้อง",
      "มีพื้นฐานและเข้าใจการทำงานของ React.js หรือ Node.js",
      "มีทักษะในการแก้ปัญหาและอัลกอริทึมที่ดี",
      "สามารถสื่อสารภาษาอังกฤษได้ในระดับที่ทำงานได้ (Working Proficiency)"
    ],
    responsibilities: [
      "พัฒนาฟีเจอร์ใหม่สำหรับฝั่ง Frontend หรือ Backend ตามทีมที่ได้รับมอบหมาย",
      "เขียน Unit Test และมีส่วนร่วมในกระบวนการ Code Review",
      "ทำงานร่วมกับ Product Manager และ Designer ในรูปแบบ Agile"
    ]
  },
  "2": {
    company: "SCB TechX",
    position: "Data Analyst / Data Scientist Intern",
    date: "20 พ.ค. 2026",
    tags: ["Python", "SQL", "Data", "On-site"],
    logoBg: "#7C3AED",
    logoChar: "S",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    location: "SCB Park Plaza, Bangkok",
    allowance: "12,000 THB/month",
    description: "โครงการฝึกงาน SCB TechXplore เปิดรับสมัครนักศึกษาที่มีความสนใจด้าน Data มาร่วมวิเคราะห์และสร้างโมเดล Machine Learning จากข้อมูลธุรกรรมจริง (Anonymized) เพื่อค้นหา Insight และเพิ่มประสิทธิภาพของผลิตภัณฑ์ทางการเงิน",
    requirements: [
      "กำลังศึกษาอยู่ชั้นปีที่ 3-4 สาขาสถิติ, วิทยาการข้อมูล, วิศวกรรมศาสตร์ หรือที่เกี่ยวข้อง",
      "เชี่ยวชาญการใช้ Python (Pandas, Scikit-learn) และ SQL",
      "มีความเข้าใจในพื้นฐานสถิติและ Machine Learning",
      "มีความคิดริเริ่มสร้างสรรค์ในการนำข้อมูลมาใช้ให้เกิดประโยชน์"
    ],
    responsibilities: [
      "ทำ Data Cleaning และ Exploratory Data Analysis (EDA)",
      "สร้าง Data Dashboard เพื่อนำเสนอ Insight แก่ทีม Business",
      "ช่วยพัฒนาระบบ Recommendation หรือ Predictive Model เบื้องต้น"
    ]
  },
  "3": {
    company: "LINE MAN Wongnai",
    position: "UX/UI Designer Intern",
    date: "25 พ.ค. 2026",
    tags: ["Figma", "Design", "Hybrid"],
    logoBg: "#2563EB",
    logoChar: "L",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    location: "T-One Building, Bangkok",
    allowance: "10,000 - 15,000 THB/month",
    description: "มาร่วมเป็นส่วนหนึ่งของการออกแบบประสบการณ์ผู้ใช้ (UX) ที่ดีที่สุดให้กับแอปพลิเคชันที่มีผู้ใช้หลายล้านคนในไทย คุณจะได้ลงมือทำตั้งแต่การรีเสิร์ช ออกแบบ Wireframe ไปจนถึง High-fidelity Prototype ภายใต้การดูแลของพี่ๆ Designer ตัวจริง",
    requirements: [
      "ส่ง Portfolio ที่แสดงกระบวนการคิดและผลงานการออกแบบ UX/UI (จำเป็น)",
      "ใช้เครื่องมือออกแบบเช่น Figma ได้อย่างคล่องแคล่ว",
      "มีความเข้าใจในหลักการ User-Centered Design",
      "เปิดรับฟังความคิดเห็นและพร้อมปรับปรุงผลงานเสมอ"
    ],
    responsibilities: [
      "ร่วมระดมสมองและออกแบบ User Flow สำหรับฟีเจอร์ใหม่ๆ",
      "ทำ Usability Testing กับผู้ใช้จริงและนำผลมาปรับปรุงการออกแบบ",
      "จัดเตรียม Design Asset ให้กับทีม Developer"
    ]
  }
};

export default function InternshipDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);
    if (params.id && INTERNSHIP_DB[params.id]) {
      setData(INTERNSHIP_DB[params.id]);
    }
  }, [params.id]);

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#F8FAFC" }}>
        <div style={{ textAlign: "center" }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: "#2563EB", marginBottom: 16 }}></i>
          <p style={{ color: "#64748B", fontWeight: 600 }}>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif", background: "#F8FAFC", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Navbar Minimal */}
      <nav style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "16px 32px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", textDecoration: "none", letterSpacing: "-0.5px" }}>UTCC</Link>
          <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "#64748B", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            <i className="fas fa-arrow-left"></i> กลับไปหน้าหลัก
          </button>
        </div>
      </nav>

      {/* Banner */}
      <div style={{ width: "100%", height: 320, position: "relative" }}>
        <img src={data.imageUrl} alt="Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.9), transparent)" }}></div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 32px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "flex-end", gap: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: data.logoBg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 800, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}>
              {data.logoChar}
            </div>
            <div style={{ paddingBottom: 4 }}>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "white", marginBottom: 8, letterSpacing: "-0.5px" }}>{data.position}</h1>
              <p style={{ fontSize: 18, color: "#94A3B8", fontWeight: 600 }}>{data.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "40px auto 0", padding: "0 32px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40, alignItems: "start" }}>
        
        {/* Left Col */}
        <div>
          <div style={{ background: "white", borderRadius: 24, padding: 40, border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>เกี่ยวกับตำแหน่งนี้</h2>
            <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 32 }}>{data.description}</p>
            
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-check-circle" style={{ color: "#10B981" }}></i> คุณสมบัติผู้สมัคร
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px 0" }}>
              {data.requirements.map((req, i) => (
                <li key={i} style={{ fontSize: 15, color: "#475569", marginBottom: 12, paddingLeft: 24, position: "relative", lineHeight: 1.6 }}>
                  <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 6, borderRadius: "50%", background: "#CBD5E1" }}></span>
                  {req}
                </li>
              ))}
            </ul>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-briefcase" style={{ color: "#2563EB" }}></i> หน้าที่ความรับผิดชอบ
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {data.responsibilities.map((res, i) => (
                <li key={i} style={{ fontSize: 15, color: "#475569", marginBottom: 12, paddingLeft: 24, position: "relative", lineHeight: 1.6 }}>
                  <span style={{ position: "absolute", left: 0, top: 8, width: 6, height: 6, borderRadius: "50%", background: "#CBD5E1" }}></span>
                  {res}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col */}
        <div style={{ position: "sticky", top: 96 }}>
          <div style={{ background: "white", borderRadius: 24, padding: 32, border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {data.tags.map((tag, i) => (
                <span key={i} style={{ background: "#F1F5F9", color: "#475569", padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 700 }}>
                  {tag}
                </span>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>สถานที่ปฏิบัติงาน</p>
              <p style={{ fontSize: 15, color: "#0F172A", fontWeight: 600 }}><i className="fas fa-map-marker-alt" style={{ width: 20, color: "#EF4444" }}></i> {data.location}</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>เบี้ยเลี้ยง</p>
              <p style={{ fontSize: 15, color: "#0F172A", fontWeight: 600 }}><i className="fas fa-money-bill-wave" style={{ width: 20, color: "#10B981" }}></i> {data.allowance}</p>
            </div>

            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 13, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>ปิดรับสมัคร</p>
              <p style={{ fontSize: 15, color: "#EF4444", fontWeight: 700 }}><i className="far fa-clock" style={{ width: 20 }}></i> {data.date}</p>
            </div>

            <button style={{ width: "100%", padding: "16px", background: "#2563EB", color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1D4ED8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#2563EB"; e.currentTarget.style.transform = "translateY(0)"; }}
              onClick={() => router.push("/login")}>
              เข้าสู่ระบบเพื่อสมัคร <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
