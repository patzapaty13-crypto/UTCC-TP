"use client";
import { useMemo } from "react";

export default function Particles({ count = 20 }) {
  const dots = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100 + "%",
      bottom: -(Math.random() * 20) + "%",
      size: 2 + Math.random() * 3,
      dur: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.4,
    })), [count]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map((d, i) => (
        <div key={i} className="particle" style={{
          left: d.left, bottom: d.bottom,
          width: d.size, height: d.size,
          background: `rgba(96,165,250,${d.opacity})`,
          animationDuration: d.dur + "s",
          animationDelay: d.delay + "s",
        }} />
      ))}
    </div>
  );
}
