import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function StudentHomePage() {
  return (
    <RoleDashboardShell role="STUDENT" title="แดชบอร์ดนักศึกษา" subtitle="ติดตามการสมัครฝึกงาน รายงาน และการแจ้งเตือนทั้งหมดในที่เดียว">
      <div className="grid-4" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>โปรไฟล์ครบแล้ว</p><p className="text-muted">80%</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>ใบสมัคร</p><p className="text-muted">3 รายการ</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>นัดสัมภาษณ์</p><p className="text-muted">1 รายการ</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>รายงานค้างส่ง</p><p className="text-muted">0 รายการ</p></div>
      </div>
    </RoleDashboardShell>
  );
}
