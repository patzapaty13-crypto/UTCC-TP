"use client";
import { useRef } from "react";
import { useCountUp } from "./useScrollReveal";

export default function StatItem({ icon, value, label }) {
  const ref = useRef(null);
  useCountUp(ref, value);
  return (
    <div style={{ textAlign: "center" }}>
      <i className={`fas ${icon}`} style={{ color: "rgba(37,99,235,0.7)", fontSize: 18, marginBottom: 12, display: "block" }} />
      <span ref={ref} className="stat-value">0</span>
      <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginTop: 8, display: "block" }}>{label}</span>
    </div>
  );
}
