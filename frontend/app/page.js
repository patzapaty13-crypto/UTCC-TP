"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatItem from "@/components/landing/StatItem";
import StepsSection from "@/components/landing/StepsSection";
import FeaturesBento from "@/components/landing/FeaturesBento";
import InternshipNews from "@/components/landing/InternshipNews";
import FaqSection from "@/components/landing/FaqSection";
import RoleCards from "@/components/landing/RoleCards";
import { useScrollReveal } from "@/components/landing/useScrollReveal";

const STATS = [
  { value: "50+", label: "บริษัทพันธมิตร", icon: "fa-building" },
  { value: "120+", label: "ทริปสำเร็จแล้ว", icon: "fa-route" },
  { value: "94%", label: "อัตราความสำเร็จ", icon: "fa-check-double" },
  { value: "2,000+", label: "นักศึกษาที่ผ่านระบบ", icon: "fa-users" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="landing-page" style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans Thai', sans-serif", background: "#F1F5F9", color: "#0F172A" }}>
      
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
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>UTCC</span>
          </Link>
          <div className="landing-nav-links">
            <a href="#features" className="nav-item" style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 10, transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>ฟีเจอร์</a>
            <a href="#about" className="nav-item" style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", padding: "8px 16px", borderRadius: 10, transition: "color 0.2s", textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}>เกี่ยวกับเรา</a>
            <Link href="/login" style={{ fontSize: 13.5, fontWeight: 700, color: "white", background: "#2563EB", padding: "9px 22px", borderRadius: 10, transition: "all 0.2s", boxShadow: "0 4px 14px rgba(37,99,235,0.4)", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background="#1D4ED8"; e.currentTarget.style.transform="translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#2563EB"; e.currentTarget.style.transform="translateY(0)"; }}>
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #020617 0%, #0F172A 40%, #1E3A8A 80%, #1D4ED8 100%)",
        overflow: "hidden", paddingTop: 80, paddingBottom: 80
      }}>
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
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none" }}></div>

        {/* Hero Content */}
        <div className="reveal" style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 900, margin: "0 auto", width: "100%" }}>
          <div className="reveal reveal-delay-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.4)", borderRadius: 99, padding: "6px 18px", marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA", display: "inline-block", animation: "pulse-glow 2s infinite" }}></span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#93C5FD", letterSpacing: "0.06em" }}>Academic Year 2025 – 2026</span>
          </div>

          <h1 className="reveal reveal-delay-2" style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "white", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 24 }}>
            ยกระดับประสบการณ์<br />
            <span style={{ background: "linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundSize: "200% auto", animation: "gradient-flow 3s ease infinite" }}>
              การฝึกงานและศึกษาดูงาน
            </span>
          </h1>

          <p className="reveal reveal-delay-3" style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 44, fontWeight: 500, maxWidth: 640, margin: "0 auto 44px" }}>
            ระบบบริหารจัดการแบบครบวงจรสำหรับมหาวิทยาลัยหอการค้าไทย เชื่อมโยงนักศึกษา อาจารย์ และสถานประกอบการไว้ในแพลตฟอร์มเดียว
          </p>

          <RoleCards />
        </div>

        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.25)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", animation: "bounce 2.5s ease-in-out infinite" }}>
          <span>SCROLL</span><i className="fas fa-chevron-down" style={{ fontSize: 10 }}></i>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────── */}
      <section style={{ background: "#0B0F1A", padding: "40px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="reveal" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
          {STATS.map((s, i) => (
            <StatItem key={i} {...s} />
          ))}
        </div>
      </section>

      <StepsSection />
      <FeaturesBento />
      <InternshipNews />

      {/* ── ABOUT (Kept video as requested) ────────────────────── */}
      <section id="about" style={{ padding: "100px 32px", background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div className="reveal" style={{ position: "relative" }}>
            <div style={{ borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.15)", background: "#0F172A", aspectRatio: "16/9" }}>
              <iframe src="https://www.youtube.com/embed/1aXaSzhdPus?autoplay=0&mute=1&controls=1" style={{ width: "100%", height: "100%", border: "none" }} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" />
            </div>
            <div style={{ position: "absolute", bottom: -20, right: -20, background: "#2563EB", color: "white", borderRadius: 18, padding: "16px 24px", boxShadow: "0 8px 24px rgba(37,99,235,0.4)" }}>
              <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>120+</p>
              <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, marginTop: 2 }}>ทริปสำเร็จแล้ว</p>
            </div>
          </div>
          <div className="reveal reveal-delay-1">
            <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>เกี่ยวกับเรา</p>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px", lineHeight: 1.15, marginBottom: 20 }}>มหาวิทยาลัยหอการค้าไทย</h2>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, marginBottom: 16, fontWeight: 500 }}>ในฐานะมหาวิทยาลัยแห่งผู้ประกอบการ เราเชื่อมโยงความรู้ในห้องเรียนกับประสบการณ์จริงในโลกธุรกิจผ่านแพลตฟอร์มนี้</p>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, marginBottom: 36, fontWeight: 500 }}>ระบบ UTCC ช่วยให้อาจารย์ เจ้าหน้าที่ และนักศึกษาบริหารจัดการกิจกรรมเสริมหลักสูตรได้อย่างมีประสิทธิภาพและสะดวกสบาย</p>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#0F172A", color: "white", padding: "14px 28px", borderRadius: 14, fontSize: 14, fontWeight: 800, transition: "all 0.2s", textDecoration: "none" }}
              onMouseEnter={e => { e.currentTarget.style.background="#1E293B"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#0F172A"; e.currentTarget.style.transform="translateY(0)"; }}>
              เริ่มใช้งาน <i className="fas fa-arrow-right" style={{ fontSize: 12 }}></i>
            </Link>
          </div>
        </div>
      </section>

      <FaqSection />

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ background: "#020617", padding: "64px 32px 32px" }}>
        <div className="reveal" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48, paddingBottom: 40, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ gridColumn: "1 / -1", maxWidth: 400 }}>
              <img src="/utcc-logo.png" alt="UTCC" style={{ height: 32, filter: "brightness(0) invert(1)", opacity: 0.9, marginBottom: 20 }} />
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, fontWeight: 500, marginBottom: 24 }}>
                แพลตฟอร์มบริหารจัดการทริปและฝึกงานสำหรับมหาวิทยาลัยหอการค้าไทย ที่ช่วยยกระดับประสบการณ์การเรียนรู้ของนักศึกษา
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                <a href="https://www.facebook.com/dekutcc" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="#1877F2"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.4)"}><i className="fab fa-facebook"></i></a>
                <a href="https://www.instagram.com/dekutcc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color="#E1306C"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.4)"}><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "white", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>นำทาง</p>
              {[{l: "หน้าหลัก", h: "/"}, {l: "ฟีเจอร์", h: "#features"}, {l: "เกี่ยวกับเรา", h: "#about"}, {l: "เข้าสู่ระบบ", h: "/login"}, {l: "สมัครสมาชิก", h: "/signup"}].map((item, i) => (
                <Link key={i} href={item.h} style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 500, marginBottom: 12, transition: "color 0.2s", textDecoration: "none" }}
                  onMouseEnter={e => e.target.style.color = "white"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}>{item.l}</Link>
              ))}
            </div>

            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "white", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24 }}>ติดต่อเรา</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  <i className="fas fa-location-dot" style={{ marginTop: 4, color: "#2563EB" }} />
                  <span style={{ lineHeight: 1.6 }}>126/1 ถนนวิภาวดีรังสิต แขวงรัชดาภิเษก เขตดินแดง กรุงเทพฯ 10400</span>
                </div>
                <div style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  <i className="fas fa-phone" style={{ marginTop: 4, color: "#10B981" }} />
                  <span>02-697-6000</span>
                </div>
                <div style={{ display: "flex", gap: 12, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  <i className="fas fa-envelope" style={{ marginTop: 4, color: "#8B5CF6" }} />
                  <span>support@utcc.ac.th</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
              © 2026 UTCC Trip & Internship Management Platform. All rights reserved.
            </p>
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Privacy Policy</a>
              <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top button */}
      <button onClick={scrollToTop} className={`back-to-top ${showBackToTop ? 'show' : ''}`} aria-label="Back to top">
        <i className="fas fa-arrow-up"></i>
      </button>

    </div>
  );
}
