"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav({ navItems, currentPath }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#3B82F6",
          color: "white",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
        }}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              width: 280,
              height: "100%",
              backgroundColor: "white",
              padding: 24,
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>เมนู</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderRadius: 8,
                    textDecoration: "none",
                    color: currentPath === item.href ? "#3B82F6" : "#64748b",
                    backgroundColor: currentPath === item.href ? "#eff6ff" : "transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <i className={`fas ${item.icon}`} style={{ width: 20, textAlign: "center" }}></i>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function HamburgerButton({ onClick, isOpen }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "none",
        flexDirection: "column",
        justifyContent: "center",
        gap: 5,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 8,
      }}
    >
      <span
        style={{
          width: 24,
          height: 2,
          backgroundColor: "#1e293b",
          transition: "all 0.3s",
          transform: isOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
        }}
      />
      <span
        style={{
          width: 24,
          height: 2,
          backgroundColor: "#1e293b",
          transition: "all 0.3s",
          opacity: isOpen ? 0 : 1,
        }}
      />
      <span
        style={{
          width: 24,
          height: 2,
          backgroundColor: "#1e293b",
          transition: "all 0.3s",
          transform: isOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
        }}
      />
    </button>
  );
}
