import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function AdvisorHomePage() {
  return (
    <RoleDashboardShell role="ADVISOR" title="แดชบอร์ดอาจารย์ที่ปรึกษา" subtitle="ตรวจรายงาน ติดตามนักศึกษา และให้ feedback ได้ครบในหน้าจอเดียว">
      <div className="grid-4" style={{ gap: 16 }}>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>นักศึกษาในความดูแล</p><p className="text-muted">48 คน</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>รายงานรอตรวจ</p><p className="text-muted">9 ฉบับ</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>คำขออนุมัติ</p><p className="text-muted">3 รายการ</p></div>
        <div className="card" style={{ padding: 20 }}><p style={{ fontWeight: 800 }}>เสี่ยงล่าช้า</p><p className="text-muted">2 คน</p></div>
      </div>
    </RoleDashboardShell>
  );
}
