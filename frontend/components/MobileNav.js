"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileNav({ navItems, currentPath, unreadCount = 0, isOpen: controlledOpen, onClose, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const actualIsOpen = isControlled ? controlledOpen : isOpen;

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {actualIsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={handleClose}
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
              {navItems.map((item) => {
                const isNotification = item.href.includes("notifications");
                const hasUnread = isNotification && unreadCount > 0;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
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
                      position: "relative",
                    }}
                  >
                    <i className={`fas ${item.icon}`} style={{ width: 20, textAlign: "center" }}></i>
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                    {hasUnread && (
                      <span style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "#DC2626",
                        color: "white",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 99,
                        minWidth: 18,
                        textAlign: "center"
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              
              <div style={{ marginTop: 20, borderTop: "1px solid #E5E7EB", paddingTop: 20 }}>
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    handleClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 12,
                    borderRadius: 8,
                    border: "none",
                    background: "none",
                    color: "#DC2626",
                    fontWeight: 500,
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left"
                  }}
                >
                  <i className="fas fa-sign-out-alt" style={{ width: 20, textAlign: "center" }}></i>
                  <span>ออกจากระบบ</span>
                </button>
              </div>
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
