"use client";

import { getStatusConfig } from "@/lib/statusUtils";

export default function StatusBadge({ status, size = "md" }) {
  const config = getStatusConfig(status);

  const sizeStyles = {
    sm: {
      padding: "4px 8px",
      fontSize: 11,
      borderRadius: 6
    },
    md: {
      padding: "6px 12px",
      fontSize: 12,
      borderRadius: 8
    },
    lg: {
      padding: "8px 16px",
      fontSize: 14,
      borderRadius: 10
    }
  };

  const style = {
    ...sizeStyles[size],
    background: config.background,
    color: config.textColor,
    border: `1px solid ${config.borderColor}`,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 6
  };

  return (
    <span style={style}>
      <i className={`fas ${config.icon}`}></i>
      {config.label}
    </span>
  );
}

export function StatusBadgeWithCount({ status, count, size = "md" }) {
  const config = getStatusConfig(status);

  const sizeStyles = {
    sm: {
      padding: "4px 8px",
      fontSize: 11,
      borderRadius: 6
    },
    md: {
      padding: "6px 12px",
      fontSize: 12,
      borderRadius: 8
    },
    lg: {
      padding: "8px 16px",
      fontSize: 14,
      borderRadius: 10
    }
  };

  const style = {
    ...sizeStyles[size],
    background: config.background,
    color: config.textColor,
    border: `1px solid ${config.borderColor}`,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 6
  };

  return (
    <span style={style}>
      <i className={`fas ${config.icon}`}></i>
      {config.label}
      <span style={{
        background: config.color,
        color: "white",
        padding: "2px 6px",
        borderRadius: 99,
        fontSize: size === "sm" ? 10 : size === "lg" ? 13 : 11,
        fontWeight: 900
      }}>
        {count}
      </span>
    </span>
  );
}
