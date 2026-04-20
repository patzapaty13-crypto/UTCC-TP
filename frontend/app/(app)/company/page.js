import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function CompanyHomePage() {
  return (
    <RoleDashboardShell role="COMPANY" title="แดชบอร์ดบริษัท" subtitle="จัดการประกาศฝึกงาน ผู้สมัคร และขั้นตอนการคัดเลือก">
      <div className="grid-4" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>ประกาศที่เปิดอยู่</p><p className="text-muted">5 รายการ</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>ผู้สมัครใหม่</p><p className="text-muted">12 คน</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>นัดสัมภาษณ์</p><p className="text-muted">4 รายการ</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>offer ค้างตอบ</p><p className="text-muted">2 รายการ</p></div>
      </div>
    </RoleDashboardShell>
  );
}
