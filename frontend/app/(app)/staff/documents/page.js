import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function StaffDocumentsPage() {
  return (
    <RoleDashboardShell role="STAFF" title="อนุมัติเอกสาร" subtitle="จัดการเอกสารที่เกี่ยวข้องกับการฝึกงานและการส่งตัว">
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 8 }}>Document Queue</h3>
        <p className="text-muted">หน้านี้พร้อมต่อยอดไปยังระบบอัปโหลดและอนุมัติเอกสาร</p>
      </div>
    </RoleDashboardShell>
  );
}
