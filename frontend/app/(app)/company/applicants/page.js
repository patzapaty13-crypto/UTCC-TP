"use client";
// Alias: /company/applicants -> uses the same page as /company/applications
// (both represent "ผู้สมัคร/ใบสมัคร" for the company)
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompanyApplicantsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/company/applications");
  }, [router]);
  return null;
}
