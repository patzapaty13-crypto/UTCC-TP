export const ROLES = {
  STUDENT: {
    label: "นักศึกษา",
    icon: "fa-user-graduate",
    color: "#2563EB",
    description: "ค้นหาฝึกงาน สมัครงาน ติดตามสถานะ และส่งรายงาน",
    prefix: "/student",
  },
  COMPANY: {
    label: "บริษัท",
    icon: "fa-building",
    color: "#059669",
    description: "จัดการประกาศรับฝึกงาน คัดกรองผู้สมัคร และนัดสัมภาษณ์",
    prefix: "/company",
  },
  ADVISOR: {
    label: "อาจารย์ที่ปรึกษา",
    icon: "fa-chalkboard-user",
    color: "#0891B2",
    description: "ติดตามนักศึกษา ตรวจรายงาน และให้ feedback",
    prefix: "/advisor",
  },
  STAFF: {
    label: "เจ้าหน้าที่",
    icon: "fa-id-badge",
    color: "#D97706",
    description: "ตรวจเอกสาร อนุมัติคำร้อง และประสานงานฝึกงาน",
    prefix: "/staff",
  },
  ADMIN: {
    label: "ผู้ดูแลระบบ",
    icon: "fa-user-shield",
    color: "#7C3AED",
    description: "กำหนดสิทธิ์ ดูระบบ และตรวจสอบ audit logs",
    prefix: "/admin",
  },
};

export const ROLE_ORDER = ["STUDENT", "COMPANY", "ADVISOR", "STAFF", "ADMIN"];

export function getPrimaryRole(user) {
  return user?.roles?.find((role) => ROLES[role]) || user?.roles?.[0] || "STUDENT";
}

export function getRoleMeta(role) {
  return ROLES[role] || ROLES.STUDENT;
}
