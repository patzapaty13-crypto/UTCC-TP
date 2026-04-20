"use client";

import { useEffect, useState } from "react";
import RoleDashboardShell from "@/components/RoleDashboardShell";
import { api } from "@/lib/api";

export default function StudentProfilePage() {
  const [me, setMe] = useState(null);
  useEffect(() => { api.getMe().then(setMe); }, []);

  return (
    <RoleDashboardShell role="STUDENT" title="โปรไฟล์นักศึกษา" subtitle="จัดการข้อมูลส่วนตัว ทักษะ และเอกสารสำหรับฝึกงาน">
      <div className="card" style={{ padding: 24 }}>
        {me ? (
          <>
            <p style={{ fontWeight: 800 }}>{me.displayName || me.username}</p>
            <p className="text-muted" style={{ marginTop: 4 }}>{me.major || "-"} • ชั้นปี {me.academicYear || "-"}</p>
          </>
        ) : <p className="text-muted">กำลังโหลด...</p>}
      </div>
    </RoleDashboardShell>
  );
}
