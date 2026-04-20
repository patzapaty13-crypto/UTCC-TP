"use client";

import { useState, useEffect } from "react";
import MaintenanceView from "@/components/MaintenanceView";

export default function AppWrapper({ children }) {
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const handleMaintenance = () => setIsMaintenance(true);
    window.addEventListener('maintenance_mode', handleMaintenance);
    return () => window.removeEventListener('maintenance_mode', handleMaintenance);
  }, []);

  if (isMaintenance) {
    return <MaintenanceView />;
  }

  return children;
}
