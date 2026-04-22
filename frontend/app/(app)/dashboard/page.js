"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      try {
        const user = await api.getMe();
        const roles = user?.roles || ["STUDENT"];
        const primaryRole = roles[0];

        // Redirect to role-specific dashboard
        switch (primaryRole) {
          case "STUDENT":
            router.replace("/student/dashboard");
            break;
          case "COMPANY":
            router.replace("/company/dashboard");
            break;
          case "ADVISOR":
            router.replace("/advisor/dashboard");
            break;
          case "STAFF":
            router.replace("/staff/dashboard");
            break;
          case "ADMIN":
            router.replace("/admin/dashboard");
            break;
          default:
            router.replace("/student/dashboard");
        }
      } catch (err) {
        router.push("/login");
      }
    };

    redirectBasedOnRole();
  }, [router]);

  return null;
}
