import RoleDashboardShell from "@/components/RoleDashboardShell";

export default function AdminAuditPage() {
  return (
    <RoleDashboardShell role="ADMIN" title="Audit Logs" subtitle="ตรวจสอบประวัติการทำงานและกิจกรรมสำคัญในระบบ">
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontWeight: 800, marginBottom: 8 }}>System Audit</h3>
        <p className="text-muted">หน้านี้พร้อมต่อยอดไปยังรายการ audit log จริง</p>
      </div>
    </RoleDashboardShell>
  );
}
