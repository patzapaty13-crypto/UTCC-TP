"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RoleLandingPage() {
  const router = useRouter();

  useEffect(() => {
    // Explicitly do not return the promise from router.replace
    const performRedirect = async () => {
      await router.replace("/dashboard");
    };
    performRedirect();
  }, [router]);

  return null;
}
