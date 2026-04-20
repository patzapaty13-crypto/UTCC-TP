"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: "fa-route",
    color: "#2563EB",
    bg: "#EFF6FF",
    title: "ทริปศึกษาดูงาน",
    desc: "บริหารจัดการแผนทริปภาคสนาม ตารางเวลา งบประมาณ และเอกสารที่เกี่ยวข้องอย่างครบวงจร",
    link: "ดูทริปทั้งหมด",
  },
  {
    icon: "fa-briefcase",
    color: "#059669",
    bg: "#ECFDF5",
    title: "ฝึกงาน",
    desc: "เชื่อมนักศึกษากับบริษัทชั้นนำ บริหารใบสมัคร และติดตามสถานะการฝึกงานแบบ real-time",
    link: "ดูตำแหน่งว่าง",
  },
  {
    icon: "fa-file-lines",
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "รายงานผล",
    desc: "ส่งและตรวจสอบรายงานการฝึกงานผ่านระบบดิจิทัล ลดขั้นตอนและกระดาษที่ไม่จำเป็น",
    link: "ดูข้อมูลเพิ่มเติม",
  },
  {
    icon: "fa-chart-line",
    color: "#0891B2",
    bg: "#ECFEFF",
    title: "วิเคราะห์ข้อมูล",
    desc: "Dashboard แสดงสถิติและ KPI ของโปรแกรมฝึกงานและทริปศึกษาดูงานในเชิงลึก",
    link: "ดู Analytics",
  },
];

const STATS = [
  { value: "50+",  label: "บริษัทพันธมิตร",      icon: "fa-building" },
  { value: "120+", label: "ทริปสำเร็จแล้ว",      icon: "fa-route" },
  { value: "94%",  label: "อัตราความสำเร็จ",      icon: "fa-check-double" },
  { value: "2,000+",label:"นักศึกษาที่ผ่านระบบ", icon: "fa-users" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif", background: "#F1F5F9", color: "#0F172A" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        height: 64,
        background: scrolled ? "rgba(11,15,26,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.3s ease",
        display: "flex", alignItems: "center",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", width: "100%",
          padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>
              UTCC
            </span>
          </Link>

          <div className="landing-nav-links" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="#features" className="nav-item" style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 10, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>ฟีเจอร์</a>
            <a href="#about" className="nav-item" style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 10, transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>เกี่ยวกับ</a>
            <Link href="/login" style={{
              fontSize: 13.5, fontWeight: 700, color: "white",
              background: "#2563EB",
              padding: "9px 22px", borderRadius: 10,
              transition: "all 0.2s",
              boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background="#1D4ED8"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#2563EB"; e.currentTarget.style.transform="translateY(0)"; }}>
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #020617 0%, #0F172A 40%, #1E3A8A 80%, #1D4ED8 100%)",
        overflow: "hidden",
      }}>
        {/* YouTube Background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.20 }}>
          <iframe
            src="https://www.youtube.com/embed/gu4zf2yK6oI?autoplay=1&mute=1&loop=1&playlist=gu4zf2yK6oI&controls=0&showinfo=0&rel=0&disablekb=1"
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: "120vw", height: "120vh",
              border: "none", pointerEvents: "none",
            }}
            allow="autoplay; encrypted-media"
          />
        </div>

        {/* Decorative blobs */}
        <div style={{ position:"absolute", top: "10%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(37,99,235,0.12)", filter: "blur(80px)", pointerEvents: "none" }}></div>
        <div style={{ position:"absolute", bottom: "15%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,0.10)", filter: "blur(60px)", pointerEvents: "none" }}></div>

        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}></div>

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 760, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)",
            borderRadius: 99, padding: "6px 18px", marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }}></span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#93C5FD", letterSpacing: "0.06em" }}>
              Academic Year 2025 – 2026
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 60px)",
            fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            แพลตฟอร์มบริหาร<br />
            <span style={{ background: "linear-gradient(90deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ทริปและฝึกงาน
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.75, marginBottom: 44,
            fontWeight: 500, maxWidth: 560, margin: "0 auto 44px",
          }}>
            ระบบบริหารจัดการทริปศึกษาดูงาน การสมัครฝึกงาน และการติดตามรายงาน
            สำหรับมหาวิทยาลัยหอการค้าไทยแบบครบวงจร
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#2563EB", color: "white",
              padding: "14px 32px", borderRadius: 14,
              fontSize: 15, fontWeight: 800, letterSpacing: "-0.2px",
              boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(37,99,235,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(37,99,235,0.4)"; }}>
              เริ่มต้นใช้งาน <i className="fas fa-arrow-right" style={{ fontSize: 13 }}></i>
            </Link>
            <a href="#features" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "14px 32px", borderRadius: 14,
              fontSize: 15, fontWeight: 700,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}>
              <i className="fas fa-play-circle" style={{ fontSize: 13 }}></i> ดูฟีเจอร์
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
          animation: "bounce 2.5s ease-in-out infinite",
        }}>
          <span>SCROLL</span>
          <i className="fas fa-chevron-down" style={{ fontSize: 10 }}></i>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section style={{
        background: "#0B0F1A",
        padding: "40px 32px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          gap: 40,
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <i className={`fas ${s.icon}`} style={{ color: "rgba(37,99,235,0.7)", fontSize: 18, marginBottom: 12, display: "block" }}></i>
              <span style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: "-1.5px", display: "block", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 8, display: "block" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
              ฟีเจอร์หลัก
            </p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", marginBottom: 16, lineHeight: 1.1 }}>
              ทุกสิ่งที่คุณต้องการในที่เดียว
            </h2>
            <p style={{ fontSize: 16, color: "#64748B", maxWidth: 480, margin: "0 auto", lineHeight: 1.7, fontWeight: 500 }}>
              ครบครันด้วยเครื่องมือที่ออกแบบมาเพื่อการพัฒนาอาชีพนักศึกษาโดยเฉพาะ
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                borderRadius: 24, padding: 36,
                transition: "all 0.3s ease",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow="0 12px 40px rgba(0,0,0,0.1)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.background="white"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.background="#F8FAFC"; }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: f.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color, fontSize: 22, marginBottom: 24,
                }}>
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 10, letterSpacing: "-0.3px" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 20, fontWeight: 500 }}>{f.desc}</p>
                <Link href="/login" style={{ fontSize: 13, fontWeight: 800, color: f.color, display: "inline-flex", alignItems: "center", gap: 6, transition: "gap 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.gap="10px"}
                  onMouseLeave={e => e.currentTarget.style.gap="6px"}>
                  {f.link} <i className="fas fa-arrow-right" style={{ fontSize: 10 }}></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ──────────────────────────────────────────────── */}
      <section id="about" style={{ padding: "100px 32px", background: "#F1F5F9" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 64, alignItems: "center",
        }}>
          {/* Video */}
          <div style={{ position: "relative" }}>
            <div style={{
              borderRadius: 24, overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
              background: "#0F172A",
              aspectRatio: "16/9",
            }}>
              <iframe
                src="https://www.youtube.com/embed/1aXaSzhdPus?autoplay=0&mute=1&controls=1"
                style={{ width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            {/* Badge overlay */}
            <div style={{
              position: "absolute", bottom: -20, right: -20,
              background: "#2563EB", color: "white",
              borderRadius: 18, padding: "16px 24px",
              boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
            }}>
              <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>120+</p>
              <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, marginTop: 2 }}>ทริปสำเร็จแล้ว</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>เกี่ยวกับเรา</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 20 }}>
              มหาวิทยาลัยหอการค้าไทย
            </h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, marginBottom: 16, fontWeight: 500 }}>
              ในฐานะมหาวิทยาลัยแห่งผู้ประกอบการ เราเชื่อมโยงความรู้ในห้องเรียนกับประสบการณ์จริงในโลกธุรกิจผ่านแพลตฟอร์มนี้
            </p>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, marginBottom: 36, fontWeight: 500 }}>
              ระบบ UTCC ช่วยให้อาจารย์ เจ้าหน้าที่ และนักศึกษาบริหารจัดการกิจกรรมเสริมหลักสูตรได้อย่างมีประสิทธิภาพและสะดวกสบาย
            </p>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "#0F172A", color: "white",
              padding: "14px 28px", borderRadius: 14,
              fontSize: 14, fontWeight: 800,
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background="#1E293B"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#0F172A"; e.currentTarget.style.transform="translateY(0)"; }}>
              เริ่มใช้งาน <i className="fas fa-arrow-right" style={{ fontSize: 12 }}></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #0B0F1A, #1E3A8A)",
        padding: "80px 32px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", top:-100, right:-100, width:360, height:360, borderRadius:"50%", background:"rgba(37,99,235,0.1)", pointerEvents:"none" }}></div>
        <div style={{ position:"relative", zIndex:1, maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "white", letterSpacing: "-1px", marginBottom: 16 }}>
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 36, fontWeight: 500, lineHeight: 1.7 }}>
            เข้าร่วมกับนักศึกษาและอาจารย์มากกว่า 2,000 คน ที่ใช้แพลตฟอร์มนี้บริหารกิจกรรมเสริมหลักสูตร
          </p>
          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "#2563EB", color: "white",
            padding: "14px 36px", borderRadius: 14,
            fontSize: 15, fontWeight: 800,
            boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(37,99,235,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(37,99,235,0.4)"; }}>
            เข้าสู่ระบบตอนนี้ <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "#020617", padding: "48px 32px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
            gap: 48, marginBottom: 48,
            paddingBottom: 40,
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div>
              <img src="/utcc-logo.png" alt="UTCC" style={{ height: 28, filter: "brightness(0) invert(1)", opacity: 0.7, marginBottom: 20 }} />
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, fontWeight: 500, maxWidth: 300 }}>
                แพลตฟอร์มบริหารจัดการทริปและฝึกงานสำหรับมหาวิทยาลัยหอการค้าไทย
              </p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>นำทาง</p>
              {["เข้าสู่ระบบ", "Dashboard", "ทริป", "ฝึกงาน"].map(item => (
                <a key={item} href="/login" style={{ display: "block", fontSize: 13.5, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 12, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
                  {item}
                </a>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>ข้อมูล</p>
              {["นักศึกษา", "อาจารย์", "เจ้าหน้าที่", "พันธมิตร"].map(item => (
                <a key={item} href="/#" style={{ display: "block", fontSize: 13.5, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 12, transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.8)"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>
              © 2026 UTCC Trip & Internship Management Platform
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.15)", fontWeight: 600 }}>
              v3.0 · Built with Next.js · Spring Boot
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
