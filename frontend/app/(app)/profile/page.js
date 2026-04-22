"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectBasedOnRole = async () => {
      try {
        const user = await api.getMe();
        const roles = user?.roles || ["STUDENT"];
        const primaryRole = roles[0];
        
        switch (primaryRole) {
          case "STUDENT":
            router.replace("/student/profile");
            break;
          case "COMPANY":
            router.replace("/company/profile");
            break;
          case "ADVISOR":
            router.replace("/advisor/profile");
            break;
          case "STAFF":
            router.replace("/advisor/profile"); // Staff uses advisor profile
            break;
          case "ADMIN":
            router.replace("/advisor/profile"); // Admin uses advisor profile
            break;
          default:
            router.replace("/student/profile");
        }
      } catch {
        router.push("/login");
      }
    };

    redirectBasedOnRole();
  }, [router]);

  return null;
}
