"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NEWS_ITEMS = [
  {
    id: 1,
    company: "Agoda",
    position: "Software Engineer Intern (Summer 2026)",
    date: "15 พ.ค. 2026",
    tags: ["React", "Node.js", "Full-time"],
    logoBg: "#059669",
    logoChar: "A",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    company: "SCB TechX",
    position: "Data Analyst / Data Scientist Intern",
    date: "20 พ.ค. 2026",
    tags: ["Python", "SQL", "Data"],
    logoBg: "#7C3AED",
    logoChar: "S",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    company: "LINE MAN Wongnai",
    position: "UX/UI Designer Intern",
    date: "25 พ.ค. 2026",
    tags: ["Figma", "Design", "Hybrid"],
    logoBg: "#2563EB",
    logoChar: "L",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80"
  }
];

export default function InternshipNews() {
  const router = useRouter();

  return (
    <section id="news" style={{ padding: "100px 32px", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>LATEST INTERNSHIPS</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-1px" }}>ประกาศรับสมัครฝึกงานล่าสุด</h2>
          </div>
          <Link href="/login" style={{ fontSize: 14, fontWeight: 700, color: "#2563EB", display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "white", borderRadius: 12, border: "1px solid #E2E8F0", transition: "all 0.2s", textDecoration: "none" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#93C5FD"; e.currentTarget.style.background = "#EFF6FF"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.background = "white"; }}>
            ดูประกาศทั้งหมด <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {NEWS_ITEMS.map((item, i) => (
            <div key={item.id} className={`reveal reveal-delay-${i + 1}`} 
              onClick={() => router.push(`/preview-internship/${item.id}`)}
              style={{ background: "white", borderRadius: 20, border: "1px solid #F1F5F9", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer", display: "flex", flexDirection: "column", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.03)"; }}>
              
              <img src={item.imageUrl} alt={item.company} style={{ width: "100%", height: 160, objectFit: "cover" }} />

              <div style={{ padding: 28, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: item.logoBg, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>
                  {item.logoChar}
                </div>
                <div style={{ background: "#F1F5F9", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#64748B" }}>
                  <i className="far fa-calendar-alt" style={{ marginRight: 6 }}></i>
                  หมดเขต {item.date}
                </div>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 8, lineHeight: 1.4 }}>{item.position}</h3>
              <p style={{ fontSize: 15, color: "#64748B", fontWeight: 600, marginBottom: 24 }}>{item.company}</p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {item.tags.map((tag, ti) => (
                  <span key={ti} style={{ background: "#F8FAFC", color: "#475569", border: "1px solid #E2E8F0", padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>

                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 20, marginTop: "auto" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>ดูรายละเอียด <i className="fas fa-chevron-right" style={{ fontSize: 10, marginLeft: 4 }}></i></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
