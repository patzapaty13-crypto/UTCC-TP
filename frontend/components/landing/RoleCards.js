"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROLES = [
  { id: "STUDENT", title: "นักศึกษา", icon: "fa-user-graduate", desc: "สมัครฝึกงาน ดูทริป ส่งรายงาน", color: "#60A5FA" },
  { id: "ADVISOR", title: "อาจารย์", icon: "fa-chalkboard-user", desc: "ดูแลนักศึกษา อนุมัติเอกสาร", color: "#34D399" },
  { id: "STAFF", title: "เจ้าหน้าที่", icon: "fa-user-shield", desc: "บริหารระบบ จัดการข้อมูล", color: "#A78BFA" }
];

export default function RoleCards() {
  const router = useRouter();
  
  return (
    <div className="reveal reveal-delay-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 48 }}>
      {ROLES.map((r, i) => (
        <div key={i} className="role-card" onClick={() => router.push("/login")}>
          <div className="role-card-icon" style={{ background: `rgba(255,255,255,0.1)`, color: r.color, boxShadow: `0 0 20px 4px ${r.color}20` }}>
            <i className={`fas ${r.icon}`} />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "white", marginBottom: 6 }}>{r.title}</h3>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500, lineHeight: 1.5 }}>{r.desc}</p>
        </div>
      ))}
    </div>
  );
}
