"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

// Mock data for feature details
const FEATURE_DB = {
  "1": {
    title: "ทริปศึกษาดูงานแบบครบวงจร",
    desc: "บริหารจัดการแผนทริปภาคสนาม ตารางเวลา งบประมาณ และเอกสารที่เกี่ยวข้องอย่างครบวงจร ให้นักศึกษาและอาจารย์วางแผนและติดตามได้ง่ายขึ้น",
    icon: "fa-route",
    color: "#2563EB",
    bg: "#EFF6FF",
    imageUrl: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80",
    details: "ระบบออกแบบมาเพื่อแก้ปัญหาความวุ่นวายในการจัดทริปศึกษาดูงานของสาขาต่างๆ ตั้งแต่การรวบรวมรายชื่อนักศึกษา การขออนุมัติเอกสารจากทางคณะ จนถึงการจัดการค่าใช้จ่ายและการประเมินผลหลังจบการเดินทาง",
    highlights: [
      "ระบบลงทะเบียนนักศึกษาเข้าร่วมทริปอัตโนมัติ ไม่ต้องใช้ Google Form",
      "ตรวจสอบสถานะการอนุมัติเอกสารของทริปได้แบบ Real-time",
      "ระบบแจ้งเตือน (Notifications) กำหนดการสำคัญให้นักศึกษาทราบ",
      "การสรุปงบประมาณและส่งรีพอร์ตหลังจบทริปแบบ Paperless"
    ]
  },
  "2": {
    title: "ฝึกงานกับพันธมิตร",
    desc: "เชื่อมนักศึกษากับบริษัทชั้นนำ บริหารใบสมัครและกระบวนการฝึกงาน",
    icon: "fa-briefcase",
    color: "#059669",
    bg: "#ECFDF5",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    details: "UTCC เชื่อมโยงกับเครือข่ายบริษัทชั้นนำระดับประเทศ ให้นักศึกษาสามารถค้นหาและสมัครตำแหน่งฝึกงานที่สนใจได้โดยตรงผ่านแพลตฟอร์ม พร้อมระบบที่ช่วยเหลือตั้งแต่วันแรกจนถึงวันสุดท้ายของการฝึกงาน",
    highlights: [
      "ฐานข้อมูลบริษัทพันธมิตรมากกว่า 50 แห่ง พร้อมตำแหน่งว่างอัพเดทตลอดเวลา",
      "ส่ง Resume และ Portfolio ได้โดยตรงผ่านระบบ",
      "ติดตามสถานะการพิจารณาใบสมัครได้จาก Dashboard ของนักศึกษา",
      "ระบบให้คะแนนและคำติชมจากบริษัท (Feedback Loop) หลังจบการฝึกงาน"
    ]
  },
  "3": {
    title: "รายงานผลดิจิทัล",
    desc: "ส่งและตรวจสอบรายงานการฝึกงาน ลดการใช้กระดาษและประหยัดเวลา",
    icon: "fa-file-lines",
    color: "#7C3AED",
    bg: "#F5F3FF",
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80",
    details: "บอกลาการปรินต์รายงานเล่มหนา! แพลตฟอร์มของเราให้นักศึกษาส่งรายงานการฝึกงาน สรุปผลรายสัปดาห์ และเอกสารนำเสนอผ่านระบบออนไลน์ได้ทั้งหมด อาจารย์สามารถเข้าตรวจและให้คะแนนได้จากทุกที่",
    highlights: [
      "ส่ง Daily/Weekly Report ผ่านระบบออนไลน์ ไม่ต้องใช้สมุดจด",
      "อาจารย์ที่ปรึกษาสามารถ Comment และให้ Feedback ได้แบบเรียลไทม์",
      "เก็บประวัติผลงาน (Digital Portfolio) ไว้ใช้สมัครงานในอนาคต",
      "ลดการใช้ทรัพยากรกระดาษ สนับสนุนนโยบาย Green University"
    ]
  },
  "4": {
    title: "Analytics Dashboard",
    desc: "วิเคราะห์ข้อมูลสถิติของโปรแกรมต่างๆ ในมหาวิทยาลัยอย่างครอบคลุม",
    icon: "fa-chart-pie",
    color: "#0891B2",
    bg: "#ECFEFF",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    details: "สำหรับผู้บริหารและอาจารย์ที่ปรึกษา ระบบ Analytics จะช่วยสรุปข้อมูลและแสดงผลเป็นกราฟที่เข้าใจง่าย เพื่อนำไปใช้วางแผนและพัฒนาหลักสูตรให้ตอบโจทย์ตลาดแรงงานในอนาคต",
    highlights: [
      "รายงานสถิติอัตราการได้งานของนักศึกษาหลังจบหลักสูตร",
      "วิเคราะห์แนวโน้ม (Trends) ของสายงานที่บริษัทต่างๆ ต้องการตัวมากที่สุด",
      "ดูสรุปความพึงพอใจของสถานประกอบการต่อคุณภาพของนักศึกษา",
      "Export ข้อมูลเป็นรายงาน Excel หรือ PDF สำหรับนำเสนอผู้บริหาร"
    ]
  }
};

export default function FeatureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (params.id && FEATURE_DB[params.id]) {
      setData(FEATURE_DB[params.id]);
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
        <img src={data.imageUrl} alt="Feature Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.85), transparent)" }}></div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 32px 40px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "flex-end", gap: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: 18, background: data.bg, color: data.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}>
              <i className={`fas ${data.icon}`}></i>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "white", marginBottom: 8, letterSpacing: "-0.5px" }}>{data.title}</h1>
              <p style={{ fontSize: 18, color: "#94A3B8", fontWeight: 600 }}>{data.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "40px auto 0", padding: "0 32px" }}>
        <div style={{ background: "white", borderRadius: 24, padding: 40, border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>รายละเอียดฟีเจอร์</h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, marginBottom: 40 }}>{data.details}</p>
          
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <i className="fas fa-star" style={{ color: "#F59E0B" }}></i> จุดเด่นของฟีเจอร์นี้
          </h3>
          
          <div style={{ display: "grid", gap: 16 }}>
            {data.highlights.map((highlight, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, background: "#F8FAFC", padding: 20, borderRadius: 16, border: "1px solid #F1F5F9" }}>
                <div style={{ background: data.bg, color: data.color, width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 15, color: "#334155", fontWeight: 600, lineHeight: 1.6, margin: 0, marginTop: 4 }}>
                  {highlight}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 48, textAlign: "center" }}>
            <button style={{ padding: "16px 40px", background: data.color, color: "white", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", transition: "all 0.2s", boxShadow: `0 8px 20px ${data.color}40` }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              onClick={() => router.push("/login")}>
              เริ่มต้นใช้งานระบบ <i className="fas fa-arrow-right" style={{ marginLeft: 8 }}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
