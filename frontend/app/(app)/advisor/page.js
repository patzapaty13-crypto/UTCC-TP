"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdvisorRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/advisor/dashboard");
  }, [router]);
  return null;
}
