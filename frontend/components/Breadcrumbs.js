"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname || pathname === "/") return null;

  const pathSegments = pathname.split("/").filter(Boolean);
  
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;
    
    return (
      <span key={segment}>
        {isLast ? (
          <span style={{ color: "#1e293b", fontWeight: 600 }}>{label}</span>
        ) : (
          <Link 
            href={href}
            style={{ 
              color: "#64748b", 
              textDecoration: "none",
              ":hover": { color: "#3b82f6" }
            }}
          >
            {label}
          </Link>
        )}
        {!isLast && <span style={{ margin: "0 8px", color: "#94a3b8" }}> / </span>}
      </span>
    );
  });

  return (
    <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
      <Link href="/" style={{ color: "#64748b", textDecoration: "none" }}>
        <i className="fas fa-home"></i>
      </Link>
      <span style={{ margin: "0 8px", color: "#94a3b8" }}> / </span>
      {breadcrumbs}
    </div>
  );
}
