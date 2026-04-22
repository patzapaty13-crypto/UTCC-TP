"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function CompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await api.getMe();
        if (user.role !== "COMPANY") {
          router.push("/dashboard");
        } else {
          router.push("/company/dashboard");
        }
      } catch (e) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <RoleDashboardShell role="COMPANY" title="บริษัท">
        <div className="card" style={{ padding: 24 }}>
          <p className="text-muted">กำลังโหลด...</p>
        </div>
      </RoleDashboardShell>
    );
  }

  return null;
}
