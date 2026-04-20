"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPrimaryRole } from "@/lib/roles";

const ROLE_ROOTS = {
  STUDENT: "/student",
  COMPANY: "/company",
  ADVISOR: "/advisor",
  STAFF: "/staff",
  ADMIN: "/admin",
};

export default function RoleGate({ user, allow, children }) {
  const router = useRouter();
  const role = getPrimaryRole(user);
  const allowed = allow?.includes(role);

  useEffect(() => {
    if (!allowed) {
      router.replace(ROLE_ROOTS[role] || "/student");
    }
  }, [allowed, role, router]);

  if (!allowed) {
    return null;
  }

  return children;
}
