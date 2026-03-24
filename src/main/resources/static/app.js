const { createApp, reactive, ref, computed, onMounted } = Vue;
const { createRouter, createWebHashHistory, useRoute, useRouter } = VueRouter;
const { createI18n, useI18n } = VueI18n;

const messages = {
  en: {
    app: {
      title: "Trip & Internship Platform",
      subtitle: "University trip, internship, and reporting hub",
    },
    nav: {
      dashboard: "Dashboard",
      trips: "Trips",
      internships: "Internships",
      applications: "Applications",
      reports: "Reports",
      analytics: "Analytics",
      ai: "AI Assistant",
      admin: "Admin",
    },
    actions: {
      notifications: "Notifications",
      createTrip: "Create Trip",
      openApplications: "Open Applications",
      viewAnalytics: "View Analytics",
      logout: "Log out",
      login: "Sign in",
      review: "Review",
      viewAll: "View all",
      openPlan: "Open plan",
      viewDetails: "View details",
      reviewBatch: "Review batch",
      runSummary: "Run Summary",
      generateMatch: "Generate Match",
      createDraft: "Create Draft",
      toggleMenu: "Menu",
      openChat: "Open Chat",
      addUser: "Add User",
      apply: "Apply",
      approve: "Approve",
      reject: "Reject",
      save: "Save",
      createCompany: "Create Company",
      createPosition: "Create Position",
      uploadReport: "Upload Report",
      send: "Send",
      openNotifications: "Open Notifications",
      close: "Close",
      refresh: "Refresh",
      addSchedule: "Add Schedule",
      addBudget: "Add Budget",
      addDocument: "Add Document",
      publishTrip: "Publish Trip",
      submit: "Submit",
      uploadFile: "Upload File",
    },
    labels: {
      role: "Role",
      user: "User",
      language: "Language",
      status: "Status",
      title: "Title",
      email: "Email",
      major: "Major",
      year: "Year",
      company: "Company",
      position: "Position",
      startDate: "Start date",
      endDate: "End date",
      capacity: "Capacity",
      budget: "Budget",
      objective: "Objective",
      location: "Location",
      file: "File",
      note: "Note",
      score: "Score",
    },
    login: {
      title: "Welcome back",
      subtitle: "Sign in to manage trips, internships, and reports.",
      username: "Username",
      password: "Password",
      demoTitle: "Demo accounts",
      demoNote: "Use these accounts to explore role-based views.",
      error: "Invalid username or password.",
      badge: "Cohort 2026",
      heroTitle: "Orchestrate field trips and internships with clarity.",
      heroNote:
        "A single workspace for planning, approvals, budgets, and student reporting.",
      featurePlan: "Structured trip planning with live schedules",
      featureApprove: "Fast approvals for advisors and staff",
      featureTrack: "Real-time student progress and submissions",
      ticket: "Field Trip Access",
    },
    roles: {
      STUDENT: "Student",
      ADVISOR: "Advisor",
      STAFF: "Faculty Staff",
      ADMIN: "Admin",
    },
    dashboard: {
      eyebrow: "System Overview",
      heroTitle: "Plan trips, place interns, and track outcomes in one flow.",
      heroNote:
        "Built for advisors and faculty teams. All approvals, reports, and analytics stay connected.",
      liveStatus: "Live Status",
      activeTrips: "Active Trips",
      internshipSlots: "Internship Slots",
      reportsDue: "Reports Due",
      upcomingTrips: "Upcoming Trips",
      approvalQueue: "Approval Queue",
      viewAll: "View all",
      awaiting: "Awaiting approval",
      next7Days: "Next 7 days",
      openSlots: "open",
    },
    trips: {
      title: "Manage trips from draft to completion.",
      newTrip: "New Trip",
    },
    internships: {
      title: "Match students to positions with confidence.",
      addPosition: "Add Position",
      slots: "slots",
    },
    applications: {
      title: "Keep approvals moving and transparent.",
      student: "Student",
      program: "Program",
      type: "Type",
    },
    reports: {
      title: "Review outcomes and evaluate performance.",
      pendingLabel: "pending",
    },
    analytics: {
      title: "Insights and statistics across the platform.",
      totalTrips: "Total Trips",
      totalPositions: "Total Positions",
      totalApplications: "Total Applications",
      totalReports: "Total Reports",
      overviewTitle: "Platform Overview",
      tripsByStatus: "Trips by Status",
      applicationsByStatus: "Applications by Status",
      recentActivity: "Recent Activity",
    },
    filters: {
      all: "All",
      draft: "Draft",
      published: "Published",
      completed: "Completed",
      allSectors: "All sectors",
      openSlots: "Open slots",
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      awaitingReview: "Awaiting review",
      graded: "Graded",
      uploadTemplate: "Upload Template",
      users: "Users",
      roles: "Roles",
      auditLogs: "Audit Logs",
      action: "Action",
    },
    ai: {
      title: "Draft, summarize, and recommend with oversight.",
      summary: "Report Summary",
      recommend: "Placement Matching",
      draft: "Approval Draft",
      chatbot: "Chatbot",
      summaryNote: "Generate a draft summary for advisor review.",
      recommendNote: "Recommend placements based on skills and major.",
      draftNote: "Auto-draft trip approval documents.",
      chatbotNote: "Answer student questions on process and steps.",
    },
    admin: {
      title: "Manage users, permissions, and compliance.",
      activeUsers: "Active Users",
      security: "Security",
      systemHealth: "System Health",
      advisors: "advisors",
      admins: "admins",
      alerts: "critical alerts",
      lastScan: "Last scan",
      pdpaReady: "PDPA ready",
      uptime: "uptime",
      apiAvg: "API avg",
      cacheHit: "Cache hit",
    },
    status: {
      pending: "Pending",
      published: "Published",
      draft: "Draft",
      approved: "Approved",
      rejected: "Rejected",
      completed: "Completed",
      submitted: "Submitted",
      awaiting_review: "Awaiting review",
      graded: "Graded",
      in_progress: "In progress",
      open: "Open",
      closed: "Closed",
    },
    landing: {
      heroTitle: "Transforming Careers through Practical Excellence",
      heroSubtitle: "Your gateway to professional field trips and global internship placements.",
      getStarted: "Get Started",
      exploreTrips: "Explore Trips",
      feature1Title: "Professional Field Trips",
      feature1Desc: "Immerse yourself in industry-leading environments with structured university-led visits.",
      feature2Title: "Global Internships",
      feature2Desc: "Connect with world-class organizations and secure life-changing internship positions.",
      feature3Title: "AI-Powered Coaching",
      feature3Desc: "Harness the power of AI to match your skills with the perfect industry placement.",
      stat1: "Corporate Partners",
      stat2: "Trips Managed",
      stat3: "Placement Rate",
      aboutTitle: "About UTCC-TP",
      aboutDesc: "The University of the Thai Chamber of Commerce (UTCC) is leading the way in integrating academic knowledge with real-world business experience. Our Trip & Internship Platform (TP) is designed to give students a professional edge.",
    },
  },
  th: {
    app: {
      title: "แพลตฟอร์มทริปและฝึกงาน",
      subtitle: "ศูนย์กลางการจัดการทริป ฝึกงาน และรายงาน",
    },
    nav: {
      dashboard: "ภาพรวม",
      trips: "ทริปดูงาน",
      internships: "ฝึกงาน",
      applications: "คำขอสมัคร",
      reports: "รายงาน",
      analytics: "สถิติ",
      ai: "ผู้ช่วย AI",
      admin: "ผู้ดูแลระบบ",
    },
    actions: {
      notifications: "การแจ้งเตือน",
      createTrip: "สร้างทริป",
      openApplications: "เปิดคำขอ",
      viewAnalytics: "ดูสถิติ",
      logout: "ออกจากระบบ",
      login: "เข้าสู่ระบบ",
      review: "ตรวจสอบ",
      viewAll: "ดูทั้งหมด",
      openPlan: "เปิดแผน",
      viewDetails: "ดูรายละเอียด",
      reviewBatch: "ตรวจชุดรายงาน",
      runSummary: "สรุปทันที",
      generateMatch: "สร้างคำแนะนำ",
      createDraft: "สร้างร่าง",
      openChat: "เปิดแชต",
      toggleMenu: "เมนู",
      addUser: "เพิ่มผู้ใช้",
      apply: "สมัคร",
      approve: "อนุมัติ",
      reject: "ไม่อนุมัติ",
      save: "บันทึก",
      createCompany: "สร้างสถานประกอบการ",
      createPosition: "สร้างตำแหน่ง",
      uploadReport: "อัปโหลดรายงาน",
      send: "ส่ง",
      openNotifications: "เปิดการแจ้งเตือน",
      close: "ปิด",
      refresh: "รีเฟรช",
      addSchedule: "เพิ่มตาราง",
      addBudget: "เพิ่มงบ",
      addDocument: "เพิ่มเอกสาร",
      publishTrip: "เผยแพร่ทริป",
      submit: "ยืนยัน",
      uploadFile: "อัปโหลดไฟล์",
    },
    labels: {
      role: "บทบาท",
      user: "ผู้ใช้",
      language: "ภาษา",
      status: "สถานะ",
      title: "ชื่อเรื่อง",
      email: "อีเมล",
      major: "สาขา",
      year: "ชั้นปี",
      company: "สถานประกอบการ",
      position: "ตำแหน่ง",
      startDate: "วันเริ่ม",
      endDate: "วันสิ้นสุด",
      capacity: "จำนวนรับ",
      budget: "งบประมาณ",
      objective: "วัตถุประสงค์",
      location: "สถานที่",
      file: "ไฟล์",
      note: "หมายเหตุ",
      score: "คะแนน",
    },
    login: {
      title: "ยินดีต้อนรับกลับ",
      subtitle: "ลงชื่อเข้าใช้เพื่อจัดการทริป ฝึกงาน และรายงาน",
      username: "ชื่อผู้ใช้",
      password: "รหัสผ่าน",
      demoTitle: "บัญชีตัวอย่าง",
      demoNote: "ใช้บัญชีเหล่านี้เพื่อดูมุมมองตามบทบาท",
      error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      badge: "รุ่นปี 2026",
      heroTitle: "จัดการทริปและฝึกงานให้เป็นระบบในที่เดียว",
      heroNote:
        "รวมการวางแผน อนุมัติ งบประมาณ และรายงานนักศึกษาไว้ในแพลตฟอร์มเดียว",
      featurePlan: "วางแผนทริปแบบเป็นขั้นตอน พร้อมตารางกิจกรรม",
      featureApprove: "อนุมัติรวดเร็วสำหรับอาจารย์และเจ้าหน้าที่",
      featureTrack: "ติดตามความคืบหน้าและการส่งรายงานแบบเรียลไทม์",
      ticket: "สิทธิ์เข้าร่วมทริป",
    },
    roles: {
      STUDENT: "นักศึกษา",
      ADVISOR: "อาจารย์ที่ปรึกษา",
      STAFF: "เจ้าหน้าที่คณะ",
      ADMIN: "ผู้ดูแลระบบ",
    },
    dashboard: {
      eyebrow: "ภาพรวมระบบ",
      heroTitle: "วางแผนทริป จัดฝึกงาน และติดตามผลในขั้นตอนเดียว",
      heroNote:
        "ออกแบบเพื่ออาจารย์และเจ้าหน้าที่ ให้การอนุมัติ รายงาน และสถิติอยู่ในที่เดียว",
      liveStatus: "สถานะล่าสุด",
      activeTrips: "ทริปที่ดำเนินการ",
      internshipSlots: "ตำแหน่งฝึกงาน",
      reportsDue: "รายงานที่ถึงกำหนด",
      upcomingTrips: "ทริปที่กำลังจะถึง",
      approvalQueue: "คิวอนุมัติ",
      viewAll: "ดูทั้งหมด",
      awaiting: "รออนุมัติ",
      next7Days: "ภายใน 7 วัน",
      openSlots: "ว่าง",
    },
    trips: {
      title: "จัดการทริปตั้งแต่ร่างจนจบกิจกรรม",
      newTrip: "สร้างทริปใหม่",
    },
    internships: {
      title: "จับคู่นักศึกษากับตำแหน่งฝึกงานได้อย่างมั่นใจ",
      addPosition: "เพิ่มตำแหน่ง",
      slots: "ตำแหน่ง",
    },
    applications: {
      title: "อนุมัติคำขออย่างโปร่งใส",
      student: "นักศึกษา",
      program: "สาขา",
      type: "ประเภท",
    },
    reports: {
      title: "ตรวจผลลัพธ์และประเมินผลงาน",
      pendingLabel: "รายการ",
    },
    analytics: {
      title: "ข้อมูลเชิงลึกและสถิติของแพลตฟอร์ม",
      totalTrips: "ทริปทั้งหมด",
      totalPositions: "ตำแหน่งทั้งหมด",
      totalApplications: "คำขอทั้งหมด",
      totalReports: "รายงานทั้งหมด",
      overviewTitle: "ภาพรวมแพลตฟอร์ม",
      tripsByStatus: "ทริปตามสถานะ",
      applicationsByStatus: "คำขอตามสถานะ",
      recentActivity: "กิจกรรมล่าสุด",
    },
    filters: {
      all: "ทั้งหมด",
      draft: "ฉบับร่าง",
      published: "เผยแพร่",
      completed: "เสร็จสิ้น",
      allSectors: "ทุกอุตสาหกรรม",
      openSlots: "ตำแหน่งว่าง",
      pending: "รอดำเนินการ",
      approved: "อนุมัติแล้ว",
      rejected: "ไม่อนุมัติ",
      awaitingReview: "รอตรวจ",
      graded: "ให้คะแนนแล้ว",
      uploadTemplate: "อัปโหลดแบบฟอร์ม",
      users: "ผู้ใช้",
      roles: "สิทธิ์",
      auditLogs: "บันทึกตรวจสอบ",
      action: "การจัดการ",
    },
    ai: {
      title: "ช่วยร่าง สรุป และแนะนำ โดยมีคนดูแล",
      summary: "สรุปรายงาน",
      recommend: "จับคู่งานฝึกงาน",
      draft: "ร่างเอกสารอนุมัติ",
      chatbot: "แชตบอท",
      summaryNote: "สร้างสรุปร่างเพื่อให้อาจารย์ตรวจทาน",
      recommendNote: "แนะนำการจับคู่จากทักษะและสาขา",
      draftNote: "ร่างเอกสารขออนุมัติทริปโดยอัตโนมัติ",
      chatbotNote: "ตอบคำถามนักศึกษาเกี่ยวกับขั้นตอน",
    },
    admin: {
      title: "จัดการผู้ใช้ สิทธิ์ และความปลอดภัย",
      activeUsers: "ผู้ใช้ที่ใช้งาน",
      security: "ความปลอดภัย",
      systemHealth: "สถานะระบบ",
      advisors: "อาจารย์ที่ปรึกษา",
      admins: "ผู้ดูแลระบบ",
      alerts: "การแจ้งเตือนสำคัญ",
      lastScan: "สแกนล่าสุด",
      pdpaReady: "พร้อมใช้งาน PDPA",
      uptime: "เวลาพร้อมใช้งาน",
      apiAvg: "API เฉลี่ย",
      cacheHit: "อัตราแคช",
    },
    status: {
      pending: "รอดำเนินการ",
      published: "เผยแพร่",
      draft: "ฉบับร่าง",
      approved: "อนุมัติแล้ว",
      rejected: "ไม่อนุมัติ",
      completed: "เสร็จสิ้น",
      submitted: "ส่งแล้ว",
      awaiting_review: "รอตรวจ",
      graded: "ให้คะแนนแล้ว",
      in_progress: "กำลังดำเนินการ",
      open: "เปิดรับ",
      closed: "ปิดรับ",
    },
    landing: {
      heroTitle: "ยกระดับอาชีพด้วยความเป็นเลิศเชิงปฏิบัติ",
      heroSubtitle: "ประตูสู่เส้นทางอาชีพผ่านทริปดูงานระดับมืออาชีพและการฝึกงานระดับโลก",
      getStarted: "เริ่มต้นใช้งาน",
      exploreTrips: "สำรวจทริปดูงาน",
      feature1Title: "ทริปดูงานมืออาชีพ",
      feature1Desc: "สัมผัสประสบการณ์จริงในอุตสาหกรรมชั้นนำผ่านทริปที่มหาวิทยาลัยจัดขึ้นอย่างเป็นระบบ",
      feature2Title: "ฝึกงานระดับสากล",
      feature2Desc: "เชื่อมต่อกับองค์กรระดับโลกและคว้าโอกาสในการฝึกงานที่เปลี่ยนชีวิตคุณ",
      feature3Title: "โค้ชชิ่งด้วย AI",
      feature3Desc: "ใช้พลังของ AI เพื่อจับคู่ทักษะของคุณกับตำแหน่งงานที่เหมาะสมที่สุด",
      stat1: "พันธมิตรทางธุรกิจ",
      stat2: "ทริปที่จัดการแล้ว",
      stat3: "อัตราการได้ที่ฝึกงาน",
      aboutTitle: "เกี่ยวกับ UTCC-TP",
      aboutDesc: "มหาวิทยาลัยหอการค้าไทย (UTCC) ผู้นำในการบูรณาการความรู้ทางวิชาการเข้ากับประสบการณ์ธุรกิจจริง แพลตฟอร์ม TP ของเราออกแบบมาเพื่อให้นักศึกษามีความได้เปรียบในระดับมืออาชีพ",
    },
  },
};

const appConfig = window.__APP_CONFIG__ || {};
const apiBase = (appConfig.apiBase || "").replace(/\/$/, "");

const state = reactive({
  token: localStorage.getItem("utcctp_token") || "",
  user: null,
  locale: localStorage.getItem("utcctp_locale") || "th",
});

const apiFetch = async (path, options = {}) => {
  const apiRoot = apiBase ? `${apiBase}/api/v1` : "/api/v1";
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
  }
  const response = await fetch(`${apiRoot}${path}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Request failed");
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }
  return response.json();
};

const api = {
  login: (payload) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => apiFetch("/auth/me"),
  dashboard: () => apiFetch("/dashboard/summary"),
  analytics: () => apiFetch("/analytics/overview"),
  listTrips: () => apiFetch("/trips"),
  getTrip: (id) => apiFetch(`/trips/${id}`),
  createTrip: (payload) =>
    apiFetch("/trips", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateTrip: (id, payload) =>
    apiFetch(`/trips/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  publishTrip: (id) =>
    apiFetch(`/trips/${id}/publish`, {
      method: "POST",
    }),
  addSchedule: (id, payload) =>
    apiFetch(`/trips/${id}/schedule`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addBudget: (id, payload) =>
    apiFetch(`/trips/${id}/budget`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  addDocument: (id, payload) =>
    apiFetch(`/trips/${id}/documents`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listCompanies: () => apiFetch("/companies"),
  createCompany: (payload) =>
    apiFetch("/companies", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listInternships: () => apiFetch("/internships"),
  createInternship: (payload) =>
    apiFetch("/internships", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateInternship: (id, payload) =>
    apiFetch(`/internships/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  listApplications: () => apiFetch("/applications"),
  createApplication: (payload) =>
    apiFetch("/applications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  decideApplication: (id, payload) =>
    apiFetch(`/applications/${id}/decision`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  listReports: () => apiFetch("/reports"),
  createReport: (payload) =>
    apiFetch("/reports", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  gradeReport: (id, payload) =>
    apiFetch(`/reports/${id}/grade`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch("/files", { method: "POST", body: formData });
  },
  listNotifications: () => apiFetch("/notifications"),
  markNotificationRead: (id) =>
    apiFetch(`/notifications/${id}/read`, { method: "PUT" }),
  aiSummary: (payload) =>
    apiFetch("/ai/summary", { method: "POST", body: JSON.stringify(payload) }),
  aiRecommend: (payload) =>
    apiFetch("/ai/recommend", { method: "POST", body: JSON.stringify(payload) }),
  aiDraft: (payload) =>
    apiFetch("/ai/draft", { method: "POST", body: JSON.stringify(payload) }),
  aiChat: (payload) =>
    apiFetch("/ai/chat", { method: "POST", body: JSON.stringify(payload) }),
  adminUsers: () => apiFetch("/admin/users"),
  createUser: (payload) =>
    apiFetch("/admin/users", { method: "POST", body: JSON.stringify(payload) }),
  updateUser: (id, payload) =>
    apiFetch(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
};

const navItems = [
  { path: "/app/dashboard", label: "nav.dashboard", icon: "fa-solid fa-chart-pie", roles: ["STUDENT", "ADVISOR", "STAFF", "ADMIN"] },
  { path: "/app/trips", label: "nav.trips", icon: "fa-solid fa-route", roles: ["STUDENT", "ADVISOR", "STAFF", "ADMIN"] },
  { path: "/app/internships", label: "nav.internships", icon: "fa-solid fa-briefcase", roles: ["STUDENT", "ADVISOR", "STAFF", "ADMIN"] },
  { path: "/app/applications", label: "nav.applications", icon: "fa-solid fa-file-signature", roles: ["STUDENT", "ADVISOR", "STAFF", "ADMIN"] },
  { path: "/app/reports", label: "nav.reports", icon: "fa-solid fa-folder-open", roles: ["STUDENT", "ADVISOR", "STAFF", "ADMIN"] },
  { path: "/app/analytics", label: "nav.analytics", icon: "fa-solid fa-chart-line", roles: ["ADVISOR", "STAFF", "ADMIN"] },
  { path: "/app/ai", label: "nav.ai", icon: "fa-solid fa-wand-magic-sparkles", roles: ["ADVISOR", "STAFF", "ADMIN"] },
  { path: "/app/admin", label: "nav.admin", icon: "fa-solid fa-user-shield", roles: ["ADMIN"] },
];

const formatDate = (value, locale) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatCurrency = (value, locale) =>
  new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);

const statusClass = (status) => {
  const normalized = status?.toLowerCase();
  if (normalized === "published" || normalized === "approved") {
    return "status green";
  }
  if (normalized === "pending" || normalized === "awaiting_review") {
    return "status amber";
  }
  if (normalized === "rejected") {
    return "status red";
  }
  return "status slate";
};

const statusKey = (status) => `status.${status?.toLowerCase() || "draft"}`;

const LandingView = {
  template: `
    <div class="landing-page">
      <!-- Sophisticated Sticky Navbar -->
      <nav class="landing-nav" :class="{ scrolled: isScrolled }">
        <div class="container landing-nav-inner">
          <div class="brand">
            <img src="/utcc-logo.png?v=13" alt="UTCC" class="official-logo-dash" />
            <div class="brand-text-dash">
              <p class="brand-title">UTCCTP</p>
              <p class="brand-subtitle">{{ $t("app.subtitle") }}</p>
            </div>
          </div>
          <div class="nav-links">
            <a href="#about" class="nav-link-item">{{ $t("landing.aboutTitle") }}</a>
            <a href="#features" class="nav-link-item">Features</a>
            <button class="ghost action-btn locale-btn" @click="toggleLocale">
               <i class="fas fa-globe"></i> {{ localeLabel }}
            </button>
            <router-link v-if="state.token" to="/app/dashboard" class="solid btn-signin">{{ $t("nav.dashboard") }}</router-link>
            <router-link v-else to="/login" class="solid btn-signin">{{ $t("actions.login") }}</router-link>
          </div>
        </div>
      </nav>

      <!-- Hero Section with Video Background -->
      <section class="landing-hero">
        <div class="hero-video-container">
          <iframe 
            src="https://www.youtube.com/embed/gu4zf2yK6oI?autoplay=1&mute=1&loop=1&playlist=gu4zf2yK6oI&controls=0&showinfo=0&rel=0&modestbranding=1" 
            frameborder="0" 
            allow="autoplay; encrypted-media" 
            class="hero-video">
          </iframe>
          <div class="hero-overlay"></div>
        </div>
        <div class="hero-content container">
          <div class="hero-text-wrap animate-slide-up">
            <h1 class="hero-display-title">{{ $t("landing.heroTitle") }}</h1>
            <p class="hero-display-subtitle">{{ $t("landing.heroSubtitle") }}</p>
            <div class="hero-actions-modern">
              <router-link to="/login" class="solid btn-hero-primary">
                {{ $t("landing.getStarted") }} <i class="fas fa-arrow-right"></i>
              </router-link>
              <a href="#features" class="ghost btn-hero-secondary">
                {{ $t("landing.exploreTrips") }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="landing-stats">
        <div class="container stats-grid">
          <div class="stat-item">
            <h2>100+</h2>
            <p>{{ $t("landing.stat1") }}</p>
          </div>
          <div class="stat-item">
            <h2>500+</h2>
            <p>{{ $t("landing.stat2") }}</p>
          </div>
          <div class="stat-item">
            <h2>98%</h2>
            <p>{{ $t("landing.stat3") }}</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="landing-features">
        <div class="container">
          <div class="section-head-center">
            <p class="eyebrow">Excellence in Motion</p>
            <h2 class="modern-section-title">Professional Development Redefined</h2>
          </div>
          <div class="features-grid">
            <div class="feature-card-atelier">
              <div class="f-icon"><i class="fas fa-route"></i></div>
              <h3>{{ $t("landing.feature1Title") }}</h3>
              <p>{{ $t("landing.feature1Desc") }}</p>
              <router-link to="/login" class="link">Learn More <i class="fas fa-chevron-right"></i></router-link>
            </div>
            <div class="feature-card-atelier">
              <div class="f-icon"><i class="fas fa-briefcase"></i></div>
              <h3>{{ $t("landing.feature2Title") }}</h3>
              <p>{{ $t("landing.feature2Desc") }}</p>
              <router-link to="/login" class="link">Learn More <i class="fas fa-chevron-right"></i></router-link>
            </div>
            <div class="feature-card-atelier">
              <div class="f-icon"><i class="fas fa-wand-magic-sparkles"></i></div>
              <h3>{{ $t("landing.feature3Title") }}</h3>
              <p>{{ $t("landing.feature3Desc") }}</p>
              <router-link to="/login" class="link">Learn More <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section id="about" class="landing-about">
        <div class="container about-flex">
          <div class="about-image-wrap">
             <div class="about-video-context">
                <iframe 
                  src="https://www.youtube.com/embed/1aXaSzhdPus?autoplay=0&mute=1&controls=1" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                  class="context-video">
                </iframe>
             </div>
          </div>
          <div class="about-content-wrap">
            <p class="eyebrow">{{ $t("landing.aboutTitle") }}</p>
            <h2 class="modern-about-title">Leading the Thai Chamber of Commerce Spirit</h2>
            <p class="about-text">{{ $t("landing.aboutDesc") }}</p>
            <router-link to="/login" class="solid btn-about">Join the Cohort</router-link>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container footer-content">
          <div class="footer-brand">
            <img src="/utcc-logo.png?v=13" alt="UTCC" class="footer-logo" />
            <p>&copy; 2026 UTCC Trip & Internship Platform. All rights reserved.</p>
          </div>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  setup() {
    const i18n = useI18n();
    const isScrolled = ref(false);
    
    const handleScroll = () => {
      isScrolled.value = window.scrollY > 50;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    const toggleLocale = () => {
      state.locale = state.locale === "th" ? "en" : "th";
      i18n.locale.value = state.locale;
      localStorage.setItem("utcctp_locale", state.locale);
      document.documentElement.lang = state.locale;
    };

    const localeLabel = computed(() => (state.locale === "th" ? "English" : "ไทย"));

    return { isScrolled, toggleLocale, localeLabel, state };
  }
};

const LoginView = {
  template: `
    <div class="split-login-shell">
      <div class="split-video-side">
        <div class="split-video-wrapper">
          <iframe 
            src="https://www.youtube.com/embed/cITK1pnMPMw?si=GRSmXWmF3sByMvcE&autoplay=1&mute=1&loop=1&playlist=cITK1pnMPMw&controls=0&showinfo=0&rel=0" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
        </div>
        <div class="split-video-overlay">
        </div>
      </div>
      
      <div class="split-form-side">
        <div class="form-container">
          <div class="form-header animate-fade-in-1">
             <div class="header-top">
                <a href="/#/" class="back-home-link" title="กลับหน้าแรก">
                  <img src="/utcc-logo.png?v=13" alt="UTCC Logo" class="official-logo-form" />
                </a>
                <button class="lang-btn" @click="toggleLocale">{{ localeLabel }}</button>
             </div>
             <h2 class="title">{{ $t("login.title") }}</h2>
             <p class="subtitle">{{ $t("login.subtitle") }}</p>
          </div>
          
          <form class="animated-form" @submit.prevent="submit">
             <div class="input-float animate-fade-in-2">
                <input v-model="username" id="username" placeholder=" " required />
                <label for="username">{{ $t("login.username") }}</label>
             </div>
             <div class="input-float animate-fade-in-3">
                <input v-model="password" id="password" type="password" placeholder=" " required />
                <label for="password">{{ $t("login.password") }}</label>
             </div>
             
             <button class="btn-ripple animate-fade-in-4" type="submit">
               <span>{{ $t("actions.login") }}</span>
             </button>
          </form>
          
          <div v-if="error" class="error-toast animate-scale-in">{{ $t("login.error") }}</div>

          <div class="demo-section animate-fade-in-5">
             <p class="demo-label">{{ $t("login.demoTitle") }}</p>
             <div class="demo-grid">
               <button v-for="demo in demoUsers" :key="demo.username" class="demo-btn" @click="username = demo.username; password = demo.password; submit()">
                  <span class="d-user">{{ demo.username }}</span>
                  <span class="d-role">{{ $t(\`roles.\${demo.role}\`) }}</span>
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const username = ref("");
    const password = ref("");
    const error = ref(false);
    const demoUsers = [
      { username: "student1", password: "pass123", role: "STUDENT" },
      { username: "advisor1", password: "pass123", role: "ADVISOR" },
      { username: "staff1", password: "pass123", role: "STAFF" },
      { username: "admin1", password: "pass123", role: "ADMIN" },
    ];

    const toggleLocale = () => {
      state.locale = state.locale === "th" ? "en" : "th";
      i18n.global.locale.value = state.locale;
      localStorage.setItem("utcctp_locale", state.locale);
      document.documentElement.lang = state.locale;
    };

    const localeLabel = computed(() => (state.locale === "th" ? "English" : "ไทย"));

    const submit = async () => {
      error.value = false;
      try {
        const data = await api.login({ username: username.value, password: password.value });
        state.token = data.token;
        state.user = data.user;
        localStorage.setItem("utcctp_token", data.token);
        router.push("/app/dashboard");
      } catch (err) {
        error.value = true;
      }
    };

    return { username, password, submit, error, demoUsers, toggleLocale, localeLabel };
  },
};

const AppLayout = {
  template: `
    <div class="app-shell dash-shell">
      <header class="top-bar">
        <div class="top-bar-left">
          <button class="hamburger" @click="toggleMenu" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
          <a href="/#/" class="brand brand-link" title="กลับหน้าแรก">
            <img src="/utcc-logo.png?v=13" alt="UTCC" class="official-logo-dash" />
            <div class="brand-text-dash">
              <p class="brand-title">UTCCTP</p>
              <p class="brand-subtitle">{{ $t("app.subtitle") }}</p>
            </div>
          </a>
        </div>
        <div class="top-actions">
          <button class="ghost action-btn btn-icon" @click="toggleNotifications">
            <i class="fas fa-bell"></i>
            <span v-if="unreadCount" class="badge badge-pulse">{{ unreadCount }}</span>
          </button>
          <button class="ghost action-btn locale-btn" @click="toggleLocale"><i class="fas fa-globe"></i> {{ localeLabel }}</button>
          
          <div class="avatar-wrap">
            <div class="avatar dropdown-trigger" @click.stop="toggleProfileMenu">{{ initials }}</div>
            <div v-if="showProfileMenu" class="avatar-dropdown modern-dropdown" style="display: block;">
               <div class="dropdown-header">
                  <p class="dropdown-name">{{ userName }}</p>
                  <p class="dropdown-role">{{ roleLabel }}</p>
               </div>
               <div class="dropdown-divider"></div>
               <button class="dropdown-item text-danger" @click="logout" style="border-radius: 0 0 16px 16px;">
                 <i class="fas fa-sign-out-alt"></i> {{ $t("actions.logout") }}
               </button>
            </div>
            <!-- Overlay to close the menu when clicking elsewhere -->
            <div v-if="showProfileMenu" style="position: fixed; inset: 0; z-index: 80;" @click="showProfileMenu = false"></div>
          </div>
        </div>
      </header>

      <div v-if="showNotifications" class="notification-panel modern-dropdown animate-scale-in">
        <div class="panel-head">
          <h4 class="panel-title-text">{{ $t("actions.notifications") }}</h4>
          <div class="panel-actions">
            <button class="btn-icon-small" @click="loadNotifications" title="Refresh"><i class="fas fa-sync-alt"></i></button>
            <button class="btn-icon-small" @click="toggleNotifications" title="Close"><i class="fas fa-times"></i></button>
          </div>
        </div>
        <div class="panel-body">
          <div v-if="!notifications.length" class="empty-state-sm">
             <i class="fas fa-bell-slash"></i>
             <p>No new notifications</p>
          </div>
          <div class="notification-item" v-for="item in notifications" :key="item.id">
            <div class="notif-icon bg-blue-light"><i class="fas fa-info-circle text-blue"></i></div>
            <div class="notif-content">
              <strong>{{ item.title }}</strong>
              <p class="muted-text">{{ item.message }}</p>
            </div>
            <button class="btn-icon-small check" @click="markRead(item.id)" title="Mark as read"><i class="fas fa-check"></i></button>
          </div>
        </div>
      </div>
      <div class="layout">
        <nav class="side-nav" :class="{ open: menuOpen }">
          <button
            v-for="item in availableNav"
            :key="item.path"
            class="nav-item"
            :class="{ active: route.path === item.path }"
            @click="go(item.path); menuOpen = false;"
          >
            <i :class="item.icon" class="nav-icon"></i>
            {{ $t(item.label) }}
          </button>
          <div class="nav-foot">
            <div class="user-pill">
               <div class="pill-avatar">{{ initials }}</div>
               <div class="pill-info">
                  <strong>{{ userName }}</strong>
                  <span>{{ roleLabel }}</span>
               </div>
            </div>
          </div>
        </nav>
        <div v-if="menuOpen" class="nav-overlay" @click="menuOpen = false"></div>
        <main class="content">
          <router-view />
        </main>
      </div>
    </div>
  `,
  setup() {
    const router = useRouter();
    const route = useRoute();
    const menuOpen = ref(false);

    const role = computed(() => state.user?.roles?.[0] || "GUEST");
    const availableNav = computed(() =>
      navItems.filter((item) => !item.roles || item.roles.includes(role.value))
    );

    const notifications = ref([]);
    const showNotifications = ref(false);
    const showProfileMenu = ref(false);
    let eventSource = null;

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value;
      if (showProfileMenu.value) showNotifications.value = false;
    };

    const logout = () => {
      state.token = "";
      state.user = null;
      localStorage.removeItem("utcctp_token");
      router.push("/login");
    };

    const toggleLocale = () => {
      state.locale = state.locale === "th" ? "en" : "th";
      i18n.global.locale.value = state.locale;
      localStorage.setItem("utcctp_locale", state.locale);
      document.documentElement.lang = state.locale;
    };

    const localeLabel = computed(() => (state.locale === "th" ? "English" : "ไทย"));
    const roleLabel = computed(() => (state.user ? i18n.global.t(`roles.${role.value}`) : "-"));
    const userName = computed(() => state.user?.displayName || "-");
    const initials = computed(() =>
      (state.user?.displayName || "U")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    );

    const go = (path) => router.push(path);

    const loadNotifications = async () => {
      notifications.value = await api.listNotifications();
    };

    const markRead = async (id) => {
      await api.markNotificationRead(id);
      await loadNotifications();
    };

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) {
        loadNotifications();
      }
    };

    const unreadCount = computed(
      () => notifications.value.filter((item) => item.status === "UNREAD").length
    );

    const connectStream = () => {
      if (eventSource) {
        eventSource.close();
      }
      if (!state.token) {
        return;
      }
      const apiRoot = apiBase ? `${apiBase}/api/v1` : "/api/v1";
      eventSource = new EventSource(`${apiRoot}/notifications/stream?token=${state.token}`);
      eventSource.addEventListener("notification", () => {
        loadNotifications();
      });
    };

    onMounted(() => {
      connectStream();
    });

    return {
      availableNav,
      route,
      logout,
      roleLabel,
      userName,
      initials,
      localeLabel,
      toggleLocale,
      go,
      notifications,
      showNotifications,
      unreadCount,
      toggleNotifications,
      loadNotifications,
      markRead,
      menuOpen,
      toggleMenu,
      showProfileMenu,
      toggleProfileMenu,
    };
  },
};

const DashboardView = {
  template: `
    <section v-if="summary" class="dashboard-page animate-fade-in-up">
      <div class="kpi-banner">
        <div class="kpi-header">
           <h1 class="welcome-heading">{{ $t("dashboard.heroTitle") }}</h1>
           <p class="welcome-sub">{{ $t("dashboard.heroNote") }}</p>
           <div class="hero-actions-modern">
               <button class="btn-primary" @click="$router.push('/app/applications')"><i class="fas fa-folder-open"></i> {{ $t("actions.openApplications") }}</button>
               <button class="btn-secondary" @click="$router.push('/app/analytics')"><i class="fas fa-chart-line"></i> {{ $t("actions.viewAnalytics") }}</button>
           </div>
        </div>
      </div>

      <div class="bento-grid-modern delay-1">
        <div class="bento-card">
            <div class="bento-card-header">
                <div>
                    <h2 class="bento-title">{{ $t("dashboard.upcomingTrips") }}</h2>
                    <p class="bento-subtitle">Scheduled academic visits & tours</p>
                </div>
                <button class="btn-text" @click="$router.push('/app/trips')">{{ $t("dashboard.viewAll") }}</button>
            </div>
            <div class="bento-list">
                <div class="bento-item" v-for="trip in trips" :key="trip.id">
                    <div class="item-icon"><i class="fas fa-map-marker-alt"></i></div>
                    <div class="item-details">
                        <h4 class="item-name">{{ trip.title }}</h4>
                        <p class="item-meta">{{ trip.location }} &bull; {{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }}</p>
                    </div>
                    <span :class="['modern-badge', statusClass(trip.status)]">{{ $t(statusKey(trip.status)) }}</span>
                </div>
                <div v-if="trips.length === 0" class="empty-state">No upcoming trips</div>
            </div>
        </div>

        <div class="bento-card">
            <div class="bento-card-header">
                <div>
                    <h2 class="bento-title">{{ $t("dashboard.approvalQueue") }}</h2>
                    <p class="bento-subtitle">Action required on applications</p>
                </div>
                <button class="btn-text" @click="$router.push('/app/applications')">{{ $t("actions.openApplications") }}</button>
            </div>
            <div class="bento-list">
                <div class="bento-item align-center" v-for="app in applications" :key="app.id">
                    <div class="avatar-sm">{{ app.studentName.charAt(0) }}</div>
                    <div class="item-details flex-1">
                        <h4 class="item-name">{{ app.studentName }}</h4>
                        <p class="item-meta">{{ app.type }} &bull; {{ app.studentMajor || "-" }}</p>
                    </div>
                    <div class="item-actions">
                        <button class="btn-action primary" @click="$router.push('/app/applications')">{{ $t("actions.review") }}</button>
                    </div>
                </div>
                <div v-if="applications.length === 0" class="empty-state">All caught up!</div>
            </div>
        </div>
      </div>
    </section>
  `,
  setup() {
    const summary = ref(null);
    const trips = ref([]);
    const applications = ref([]);

    const load = async () => {
      summary.value = await api.dashboard();
      trips.value = await api.listTrips();
      applications.value = await api.listApplications();
    };

    onMounted(load);

    return {
      summary,
      trips,
      applications,
      formatDate: (value) => formatDate(value, state.locale),
      statusClass,
      statusKey,
    };
  },
};

const TripsView = {
  template: `
    <section class="animate-fade-in-up">
      <div class="section-head-modern">
        <div class="head-left">
          <p class="eyebrow">{{ $t("nav.trips") }}</p>
          <h2 class="modern-section-title">{{ $t("trips.title") }}</h2>
          <p class="section-subtitle">Manage educational excursions from planning to feedback</p>
        </div>
        <div class="filters-modern">
          <button 
            v-for="f in availableFilters" 
            :key="f"
            class="filter-tab"
            :class="{ active: currentFilter === f }"
            @click="currentFilter = f"
          >
            {{ $t('filters.' + f.toLowerCase()) }}
          </button>
        </div>
      </div>

      <!-- Management Tools for Staff/Advisors -->
      <div v-if="canManage" class="admin-tools-grid animate-fade-in-delayed">
        <div class="card modern-form-card">
          <div class="form-card-header">
            <i class="fas fa-plus-circle"></i>
            <h3>{{ $t("actions.createTrip") }}</h3>
          </div>
          <div class="form-grid-modern">
            <div class="input-group">
              <label>{{ $t("labels.title") }}</label>
              <input v-model="form.title" placeholder="Industry Visit 2026" />
            </div>
            <div class="input-group">
              <label>{{ $t("labels.location") }}</label>
              <input v-model="form.location" placeholder="Bangkok" />
            </div>
            <div class="input-group">
              <label>{{ $t("labels.startDate") }}</label>
              <input type="date" v-model="form.startDate" />
            </div>
            <div class="input-group">
              <label>{{ $t("labels.endDate") }}</label>
              <input type="date" v-model="form.endDate" />
            </div>
            <div class="input-group">
              <label>{{ $t("labels.capacity") }}</label>
              <input type="number" v-model="form.capacity" placeholder="40" />
            </div>
            <div class="input-group">
              <label>{{ $t("labels.budget") }}</label>
              <input type="number" v-model="form.budgetTotal" placeholder="150000" />
            </div>
            <div class="input-group full">
              <label>{{ $t("labels.objective") }}</label>
              <textarea v-model="form.objective" rows="2" placeholder="Describe the educational goals..."></textarea>
            </div>
          </div>
          <div class="form-footer">
            <button class="btn-primary-glow" @click="submitTrip">
              <i class="fas fa-save"></i> {{ $t("actions.saveDraft") }}
            </button>
          </div>
        </div>

        <div class="card modern-form-card">
          <div class="form-card-header">
            <i class="fas fa-tools"></i>
            <h3>Trip Utils</h3>
          </div>
          <p class="muted-text-sm">Manage details for existing trips</p>
          <div class="form-grid-modern" style="margin-top: 20px;">
            <div class="input-group full">
               <label>Target Trip</label>
               <select v-model="selectedTripId" class="modern-select">
                 <option disabled value="">Choose a trip to edit...</option>
                 <option v-for="trip in trips" :key="trip.id" :value="trip.id">{{ trip.title }}</option>
               </select>
            </div>
            <div class="input-group">
              <label>Service Category</label>
              <input v-model="budget.category" placeholder="Transportation" />
            </div>
            <div class="input-group">
              <label>Cost</label>
              <input v-model="budget.amount" type="number" placeholder="5000" />
            </div>
          </div>
          <div class="form-footer">
             <button class="btn-secondary-glow" @click="addBudget">{{ $t("actions.addBudget") }}</button>
             <button class="btn-secondary-glow" v-if="selectedTripId" @click="publishTrip(selectedTripId)">
               <i class="fas fa-paper-plane"></i> {{ $t("actions.publish") }}
             </button>
          </div>
        </div>
      </div>

      <!-- Main Trip Grid -->
      <div class="modern-trip-grid">
        <article v-for="trip in filteredTrips" :key="trip.id" class="trip-card-bento animate-scale-in">
          <div class="trip-card-content">
            <div class="trip-type-tag">{{ trip.location }}</div>
            <h3 class="trip-name">{{ trip.title }}</h3>
            <div class="trip-details">
              <div class="detail-item">
                <i class="far fa-calendar-alt"></i>
                <span>{{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-coins"></i>
                <span>{{ formatCurrency(trip.budgetTotal || 0) }}</span>
              </div>
            </div>
            <div :class="['status-pill-large', statusClass(trip.status)]">
              {{ $t(statusKey(trip.status)) }}
            </div>
          </div>
          <div class="trip-card-footer">
             <button v-if="isStudent && trip.status === 'PUBLISHED'" class="btn-apply" @click="applyTrip(trip.id)">
               {{ $t("actions.apply") }}
             </button>
             <button v-if="canManage && trip.status === 'DRAFT'" class="btn-manage-draft" @click="publishTrip(trip.id)">
               <i class="fas fa-paper-plane"></i> Publish
             </button>
             <button v-if="canManage" class="btn-icon-ghost" title="Edit Trip">
               <i class="fas fa-edit"></i>
             </button>
          </div>
        </article>
        
        <div v-if="filteredTrips.length === 0" class="empty-state-large">
           <i class="fas fa-folder-open"></i>
           <p>No trips found in this category</p>
        </div>
      </div>
    </section>
  `,
  setup() {
    const trips = ref([]);
    const form = reactive({
      title: "",
      objective: "",
      location: "",
      startDate: "",
      endDate: "",
      capacity: "",
      budgetTotal: "",
    });
    const schedule = reactive({ activity: "", startTime: "", endTime: "" });
    const budget = reactive({ category: "", amount: "" });
    const document = reactive({ docType: "", file: null });
    const selectedTripId = ref("");

    const role = computed(() => state.user?.roles?.[0] || "GUEST");
    const canManage = computed(() => ["ADVISOR", "STAFF", "ADMIN"].includes(role.value));
    const isStudent = computed(() => role.value === "STUDENT");

    const currentFilter = ref("ALL");
    const availableFilters = computed(() => {
      const base = ['ALL', 'DRAFT', 'PUBLISHED', 'COMPLETED'];
      if (isStudent.value) return ['ALL', 'PUBLISHED', 'COMPLETED'];
      return base;
    });
    const loadTrips = async () => {
      trips.value = await api.listTrips();
    };

    const filteredTrips = computed(() => {
      let result = trips.value;
      
      // Role-based visibility
      if (isStudent.value) {
        result = result.filter(t => t.status === 'PUBLISHED' || t.status === 'COMPLETED');
      }

      // Status filter tab
      if (currentFilter.value !== "ALL") {
        result = result.filter(t => t.status === currentFilter.value);
      }
      
      return result;
    });

    const submitTrip = async () => {
      await api.createTrip({
        title: form.title,
        objective: form.objective,
        location: form.location,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        capacity: form.capacity ? Number(form.capacity) : null,
        budgetTotal: form.budgetTotal ? Number(form.budgetTotal) : null,
      });
      form.title = "";
      form.objective = "";
      form.location = "";
      form.startDate = "";
      form.endDate = "";
      form.capacity = "";
      form.budgetTotal = "";
      await loadTrips();
    };

    const applyTrip = async (tripId) => {
      await api.createApplication({ type: "TRIP", tripId });
    };

    const publishTrip = async (tripId) => {
      await api.publishTrip(tripId);
      await loadTrips();
    };

    const addSchedule = async () => {
      if (!selectedTripId.value) {
        return;
      }
      await api.addSchedule(selectedTripId.value, {
        activity: schedule.activity,
        startTime: schedule.startTime ? new Date(schedule.startTime).toISOString() : null,
        endTime: schedule.endTime ? new Date(schedule.endTime).toISOString() : null,
      });
      schedule.activity = "";
      schedule.startTime = "";
      schedule.endTime = "";
    };

    const addBudget = async () => {
      if (!selectedTripId.value) {
        return;
      }
      await api.addBudget(selectedTripId.value, {
        category: budget.category,
        amount: Number(budget.amount || 0),
      });
      budget.category = "";
      budget.amount = "";
    };

    const handleDocFile = (event) => {
      document.file = event.target.files[0] || null;
    };

    const addDocument = async () => {
      if (!selectedTripId.value || !document.file) {
        return;
      }
      const file = await api.uploadFile(document.file);
      await api.addDocument(selectedTripId.value, { docType: document.docType, fileId: file.id });
      document.docType = "";
      document.file = null;
    };

    onMounted(loadTrips);

    return {
      trips,
      filteredTrips,
      currentFilter,
      availableFilters,
      form,
      schedule,
      budget,
      document,
      selectedTripId,
      canManage,
      isStudent,
      submitTrip,
      applyTrip,
      publishTrip,
      addSchedule,
      addBudget,
      addDocument,
      handleDocFile,
      formatDate: (value) => formatDate(value, state.locale),
      formatCurrency: (value) => formatCurrency(value, state.locale),
      statusClass,
      statusKey,
    };
  },
};

const InternshipsView = {
  template: `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("nav.internships") }}</p>
          <h2>{{ $t("internships.title") }}</h2>
        </div>
        <div class="filters">
          <button class="ghost">{{ $t("filters.allSectors") }}</button>
          <button class="ghost">{{ $t("filters.openSlots") }}</button>
        </div>
      </div>

      <div v-if="canManage" class="card form-card">
        <h3>{{ $t("actions.createCompany") }}</h3>
        <div class="form-grid">
          <div>
            <label>{{ $t("labels.company") }}</label>
            <input v-model="companyForm.name" />
          </div>
          <div>
            <label>Industry</label>
            <input v-model="companyForm.industry" />
          </div>
          <div>
            <label>{{ $t("labels.location") }}</label>
            <input v-model="companyForm.location" />
          </div>
          <div>
            <label>Contact Name</label>
            <input v-model="companyForm.contactName" />
          </div>
          <div>
            <label>Contact Email</label>
            <input v-model="companyForm.contactEmail" />
          </div>
        </div>
        <div class="form-actions">
          <button class="solid" @click="submitCompany">{{ $t("actions.createCompany") }}</button>
        </div>
      </div>

      <div v-if="canManage" class="card form-card">
        <h3>{{ $t("actions.createPosition") }}</h3>
        <div class="form-grid">
          <div class="full">
            <label>{{ $t("labels.company") }}</label>
            <select v-model="positionForm.companyId">
              <option disabled value="">Select company</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>
          <div>
            <label>{{ $t("labels.position") }}</label>
            <input v-model="positionForm.title" />
          </div>
          <div>
            <label>{{ $t("labels.location") }}</label>
            <input v-model="positionForm.location" />
          </div>
          <div>
            <label>Mode</label>
            <input v-model="positionForm.mode" placeholder="Hybrid" />
          </div>
          <div>
            <label>Slots</label>
            <input type="number" v-model="positionForm.slots" />
          </div>
          <div class="full">
            <label>Description</label>
            <textarea v-model="positionForm.description" rows="2"></textarea>
          </div>
          <div class="full">
            <label>Requirements</label>
            <textarea v-model="positionForm.requirements" rows="2"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button class="solid" @click="submitPosition">{{ $t("actions.createPosition") }}</button>
        </div>
      </div>

      <div class="card-grid">
        <div class="card accent" v-for="internship in internships" :key="internship.id">
          <h3>{{ internship.company }}</h3>
          <p>{{ internship.title }} ({{ internship.slots }} {{ $t("internships.slots") }})</p>
          <div class="meta">
            <span>{{ internship.location }}</span>
            <span>{{ internship.mode }}</span>
          </div>
          <div class="card-actions">
            <button v-if="isStudent" class="solid small" @click="applyInternship(internship.id)">
              {{ $t("actions.apply") }}
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  setup() {
    const internships = ref([]);
    const companies = ref([]);
    const role = computed(() => state.user?.roles?.[0] || "GUEST");
    const canManage = computed(() => ["STAFF", "ADMIN"].includes(role.value));
    const isStudent = computed(() => role.value === "STUDENT");

    const companyForm = reactive({
      name: "",
      industry: "",
      location: "",
      contactName: "",
      contactEmail: "",
    });

    const positionForm = reactive({
      companyId: "",
      title: "",
      description: "",
      requirements: "",
      location: "",
      mode: "",
      slots: "",
    });

    const loadData = async () => {
      internships.value = await api.listInternships();
      companies.value = await api.listCompanies();
    };

    const submitCompany = async () => {
      await api.createCompany(companyForm);
      companyForm.name = "";
      companyForm.industry = "";
      companyForm.location = "";
      companyForm.contactName = "";
      companyForm.contactEmail = "";
      companies.value = await api.listCompanies();
    };

    const submitPosition = async () => {
      await api.createInternship({
        ...positionForm,
        slots: Number(positionForm.slots || 0),
      });
      positionForm.companyId = "";
      positionForm.title = "";
      positionForm.description = "";
      positionForm.requirements = "";
      positionForm.location = "";
      positionForm.mode = "";
      positionForm.slots = "";
      internships.value = await api.listInternships();
    };

    const applyInternship = async (id) => {
      await api.createApplication({ type: "INTERNSHIP", internshipPositionId: id });
    };

    onMounted(loadData);

    return {
      internships,
      companies,
      companyForm,
      positionForm,
      canManage,
      isStudent,
      submitCompany,
      submitPosition,
      applyInternship,
    };
  },
};

const ApplicationsView = {
  template: `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("nav.applications") }}</p>
          <h2>{{ $t("applications.title") }}</h2>
        </div>
        <div class="filters">
          <button class="ghost">{{ $t("filters.pending") }}</button>
          <button class="ghost">{{ $t("filters.approved") }}</button>
          <button class="ghost">{{ $t("filters.rejected") }}</button>
        </div>
      </div>
      <div class="table">
        <div class="table-row header">
          <span>{{ $t("applications.student") }}</span>
          <span>{{ $t("applications.program") }}</span>
          <span>{{ $t("applications.type") }}</span>
          <span>{{ $t("labels.status") }}</span>
          <span>{{ $t("filters.action") }}</span>
        </div>
        <div class="table-row" v-for="app in applications" :key="app.id">
          <span>{{ app.studentName }}</span>
          <span>{{ app.studentMajor || "-" }}</span>
          <span>{{ app.type }}</span>
          <span :class="statusClass(app.status)">{{ $t(statusKey(app.status)) }}</span>
          <div class="row-actions">
            <button v-if="canDecide" class="solid small" @click="decide(app.id, 'APPROVE')">
              {{ $t("actions.approve") }}
            </button>
            <button v-if="canDecide" class="ghost small" @click="decide(app.id, 'REJECT')">
              {{ $t("actions.reject") }}
            </button>
            <span v-if="!canDecide" class="muted">{{ app.tripTitle || app.internshipTitle }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  setup() {
    const applications = ref([]);
    const role = computed(() => state.user?.roles?.[0] || "GUEST");
    const canDecide = computed(() => ["ADVISOR", "STAFF", "ADMIN"].includes(role.value));

    const load = async () => {
      applications.value = await api.listApplications();
    };

    const decide = async (id, decision) => {
      await api.decideApplication(id, { decision, note: "" });
      await load();
    };

    onMounted(load);
    return { applications, statusClass, statusKey, canDecide, decide };
  },
};

const ReportsView = {
  template: `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("nav.reports") }}</p>
          <h2>{{ $t("reports.title") }}</h2>
        </div>
        <div class="filters">
          <button class="ghost">{{ $t("filters.awaitingReview") }}</button>
          <button class="ghost">{{ $t("filters.graded") }}</button>
        </div>
      </div>

      <div v-if="isStudent" class="card form-card">
        <h3>{{ $t("actions.uploadReport") }}</h3>
        <div class="form-grid">
          <div class="full">
            <label>{{ $t("labels.position") }}</label>
            <select v-model="reportForm.type">
              <option value="TRIP">Trip</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <div class="full" v-if="reportForm.type === 'TRIP'">
            <label>{{ $t("nav.trips") }}</label>
            <select v-model="reportForm.tripId">
              <option disabled value="">Select trip</option>
              <option v-for="trip in trips" :key="trip.id" :value="trip.id">
                {{ trip.title }}
              </option>
            </select>
          </div>
          <div class="full" v-if="reportForm.type === 'INTERNSHIP'">
            <label>{{ $t("nav.internships") }}</label>
            <select v-model="reportForm.internshipId">
              <option disabled value="">Select position</option>
              <option v-for="internship in internships" :key="internship.id" :value="internship.id">
                {{ internship.title }}
              </option>
            </select>
          </div>
          <div class="full">
            <label>{{ $t("labels.file") }}</label>
            <input type="file" @change="handleReportFile" />
          </div>
        </div>
        <div class="form-actions">
          <button class="solid" @click="submitReport">{{ $t("actions.submit") }}</button>
        </div>
      </div>

      <div class="card-grid">
        <div class="card" v-for="report in reports" :key="report.id">
          <h3>{{ report.title }}</h3>
          <div class="meta">
            <span :class="statusClass(report.status)">{{ $t(statusKey(report.status)) }}</span>
            <span>{{ formatDate(report.submittedAt) }}</span>
          </div>
          <div v-if="canGrade" class="form-grid compact">
            <div>
              <label>{{ $t("labels.score") }}</label>
              <input type="number" v-model="grades[report.id].score" />
            </div>
            <div class="full">
              <label>{{ $t("labels.note") }}</label>
              <input v-model="grades[report.id].comment" />
            </div>
          </div>
          <div class="form-actions" v-if="canGrade">
            <button class="solid small" @click="grade(report.id)">{{ $t("actions.approve") }}</button>
          </div>
        </div>
      </div>
    </section>
  `,
  setup() {
    const reports = ref([]);
    const trips = ref([]);
    const internships = ref([]);
    const reportForm = reactive({
      type: "TRIP",
      tripId: "",
      internshipId: "",
      file: null,
    });
    const grades = reactive({});

    const role = computed(() => state.user?.roles?.[0] || "GUEST");
    const isStudent = computed(() => role.value === "STUDENT");
    const canGrade = computed(() => ["ADVISOR", "STAFF", "ADMIN"].includes(role.value));

    const load = async () => {
      reports.value = await api.listReports();
      trips.value = await api.listTrips();
      internships.value = await api.listInternships();
      reports.value.forEach((report) => {
        if (!grades[report.id]) {
          grades[report.id] = { score: "", comment: "" };
        }
      });
    };

    const handleReportFile = (event) => {
      reportForm.file = event.target.files[0] || null;
    };

    const submitReport = async () => {
      if (!reportForm.file) {
        return;
      }
      const file = await api.uploadFile(reportForm.file);
      await api.createReport({
        tripId: reportForm.type === "TRIP" ? reportForm.tripId : null,
        internshipPositionId: reportForm.type === "INTERNSHIP" ? reportForm.internshipId : null,
        fileId: file.id,
      });
      reportForm.tripId = "";
      reportForm.internshipId = "";
      reportForm.file = null;
      await load();
    };

    const grade = async (id) => {
      const gradeData = grades[id];
      await api.gradeReport(id, {
        score: gradeData.score ? Number(gradeData.score) : null,
        comment: gradeData.comment || "",
      });
      await load();
    };

    onMounted(load);
    return {
      reports,
      trips,
      internships,
      reportForm,
      grades,
      isStudent,
      canGrade,
      handleReportFile,
      submitReport,
      grade,
      formatDate: (value) => formatDate(value, state.locale),
      statusClass,
      statusKey,
    };
  },
};

const AiView = {
  template: `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("nav.ai") }}</p>
          <h2>{{ $t("ai.title") }}</h2>
        </div>
      </div>
      <div class="ai-grid">
        <div class="card">
          <h3>{{ $t("ai.summary") }}</h3>
          <p>{{ $t("ai.summaryNote") }}</p>
          <select v-model="summary.reportId">
            <option disabled value="">Select report</option>
            <option v-for="report in reports" :key="report.id" :value="report.id">
              {{ report.title }}
            </option>
          </select>
          <button class="solid" @click="runSummary">{{ $t("actions.runSummary") }}</button>
        </div>
        <div class="card">
          <h3>{{ $t("ai.recommend") }}</h3>
          <p>{{ $t("ai.recommendNote") }}</p>
          <input v-model="recommend.major" :placeholder="$t('labels.major')" />
          <input v-model="recommend.skills" placeholder="SQL, Python" />
          <button class="solid" @click="runRecommend">{{ $t("actions.generateMatch") }}</button>
        </div>
        <div class="card">
          <h3>{{ $t("ai.draft") }}</h3>
          <p>{{ $t("ai.draftNote") }}</p>
          <select v-model="draft.tripId">
            <option disabled value="">Select trip</option>
            <option v-for="trip in trips" :key="trip.id" :value="trip.id">
              {{ trip.title }}
            </option>
          </select>
          <button class="solid" @click="runDraft">{{ $t("actions.createDraft") }}</button>
        </div>
        <div class="card">
          <h3>{{ $t("ai.chatbot") }}</h3>
          <p>{{ $t("ai.chatbotNote") }}</p>
          <input v-model="chat.message" placeholder="Ask a question" />
          <button class="solid" @click="runChat">{{ $t("actions.openChat") }}</button>
        </div>
      </div>
      <div v-if="response" class="card ai-response">
        <h3>AI Output</h3>
        <p>{{ response }}</p>
      </div>
    </section>
  `,
  setup() {
    const response = ref("");
    const reports = ref([]);
    const trips = ref([]);
    const summary = reactive({ reportId: "" });
    const recommend = reactive({ major: "", skills: "" });
    const draft = reactive({ tripId: "" });
    const chat = reactive({ message: "" });

    const load = async () => {
      reports.value = await api.listReports();
      trips.value = await api.listTrips();
    };

    const runSummary = async () => {
      if (!summary.reportId) return;
      const result = await api.aiSummary({ reportId: summary.reportId, language: state.locale });
      response.value = result.content;
    };

    const runRecommend = async () => {
      const result = await api.aiRecommend({ major: recommend.major, skills: recommend.skills });
      response.value = result.content;
    };

    const runDraft = async () => {
      if (!draft.tripId) return;
      const result = await api.aiDraft({ tripId: draft.tripId });
      response.value = result.content;
    };

    const runChat = async () => {
      const result = await api.aiChat({ message: chat.message });
      response.value = result.content;
    };

    onMounted(load);

    return { reports, trips, summary, recommend, draft, chat, response, runSummary, runRecommend, runDraft, runChat };
  },
};

const AdminView = {
  template: `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("nav.admin") }}</p>
          <h2>{{ $t("admin.title") }}</h2>
        </div>
      </div>
      <div class="card form-card">
        <h3>{{ $t("actions.addUser") }}</h3>
        <div class="form-grid">
          <div>
            <label>{{ $t("labels.user") }}</label>
            <input v-model="form.username" placeholder="user1" />
          </div>
          <div>
            <label>{{ $t("labels.email") }}</label>
            <input v-model="form.email" />
          </div>
          <div>
            <label>{{ $t("labels.major") }}</label>
            <input v-model="form.major" />
          </div>
          <div>
            <label>{{ $t("labels.year") }}</label>
            <input type="number" v-model="form.academicYear" />
          </div>
          <div>
            <label>{{ $t("labels.user") }}</label>
            <input v-model="form.displayName" placeholder="Display Name" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" v-model="form.password" placeholder="pass123" />
          </div>
          <div class="full">
            <label>Roles</label>
            <div class="chip-row">
              <label v-for="role in roleOptions" :key="role" class="chip-check">
                <input type="checkbox" :value="role" v-model="form.roles" />
                <span>{{ role }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="solid" @click="submitUser">{{ $t("actions.save") }}</button>
        </div>
      </div>

      <div class="card">
        <div class="card-head">
          <h3>{{ $t("filters.users") }}</h3>
          <button class="ghost" @click="loadUsers">{{ $t("actions.refresh") }}</button>
        </div>
        <div class="table">
          <div class="table-row header">
            <span>{{ $t("labels.user") }}</span>
            <span>{{ $t("labels.email") }}</span>
            <span>{{ $t("labels.major") }}</span>
            <span>{{ $t("labels.status") }}</span>
            <span>{{ $t("filters.action") }}</span>
          </div>
          <div class="table-row" v-for="user in users" :key="user.id">
            <span>{{ user.displayName }}</span>
            <span>{{ user.email || "-" }}</span>
            <span>{{ user.major || "-" }}</span>
            <span class="status green">{{ user.roles.join(", ") }}</span>
            <button class="ghost small" @click="selectUser(user)">Edit</button>
          </div>
        </div>
      </div>
    </section>
  `,
  setup() {
    const users = ref([]);
    const roleOptions = ["STUDENT", "ADVISOR", "STAFF", "ADMIN"];
    const form = reactive({
      id: "",
      username: "",
      displayName: "",
      email: "",
      major: "",
      academicYear: "",
      password: "",
      roles: [],
    });

    const loadUsers = async () => {
      users.value = await api.adminUsers();
    };

    const submitUser = async () => {
      const payload = {
        username: form.username,
        displayName: form.displayName,
        email: form.email,
        major: form.major,
        academicYear: form.academicYear ? Number(form.academicYear) : null,
        password: form.password,
        roles: form.roles,
      };
      if (form.id) {
        await api.updateUser(form.id, payload);
      } else {
        await api.createUser(payload);
      }
      form.id = "";
      form.username = "";
      form.displayName = "";
      form.email = "";
      form.major = "";
      form.academicYear = "";
      form.password = "";
      form.roles = [];
      await loadUsers();
    };

    const selectUser = (user) => {
      form.id = user.id;
      form.username = user.username;
      form.displayName = user.displayName;
      form.email = user.email;
      form.major = user.major;
      form.academicYear = user.academicYear;
      form.roles = [...user.roles];
    };

    onMounted(loadUsers);

    return { users, form, roleOptions, submitUser, loadUsers, selectUser };
  },
};

const AnalyticsView = {
  template: `
    <section>
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ $t("nav.analytics") }}</p>
          <h2>{{ $t("analytics.title") }}</h2>
        </div>
      </div>
      <div class="analytics-kpi-grid" v-if="data">
        <div class="analytics-kpi-card">
          <div class="kpi-icon trips-icon">📋</div>
          <h3>{{ data.trips }}</h3>
          <p>{{ $t("analytics.totalTrips") }}</p>
        </div>
        <div class="analytics-kpi-card">
          <div class="kpi-icon positions-icon">🏢</div>
          <h3>{{ data.internships }}</h3>
          <p>{{ $t("analytics.totalPositions") }}</p>
        </div>
        <div class="analytics-kpi-card">
          <div class="kpi-icon apps-icon">📝</div>
          <h3>{{ data.applications }}</h3>
          <p>{{ $t("analytics.totalApplications") }}</p>
        </div>
        <div class="analytics-kpi-card">
          <div class="kpi-icon reports-icon">📊</div>
          <h3>{{ data.reports }}</h3>
          <p>{{ $t("analytics.totalReports") }}</p>
        </div>
      </div>
      <div class="grid" v-if="trips.length || applications.length">
        <div class="card">
          <h3>{{ $t("analytics.tripsByStatus") }}</h3>
          <div class="analytics-bar-chart">
            <div class="bar-row" v-for="item in tripStatusData" :key="item.label">
              <span class="bar-label">{{ $t(statusKey(item.label)) }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: item.percent + '%' }" :class="item.color"></div>
              </div>
              <span class="bar-value">{{ item.count }}</span>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>{{ $t("analytics.applicationsByStatus") }}</h3>
          <div class="analytics-bar-chart">
            <div class="bar-row" v-for="item in appStatusData" :key="item.label">
              <span class="bar-label">{{ $t(statusKey(item.label)) }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: item.percent + '%' }" :class="item.color"></div>
              </div>
              <span class="bar-value">{{ item.count }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card" v-if="applications.length">
        <h3>{{ $t("analytics.recentActivity") }}</h3>
        <div class="table">
          <div class="table-row header">
            <span>{{ $t("applications.student") }}</span>
            <span>{{ $t("applications.type") }}</span>
            <span>{{ $t("labels.status") }}</span>
            <span>{{ $t("labels.startDate") }}</span>
            <span></span>
          </div>
          <div class="table-row" v-for="app in recentApps" :key="app.id">
            <span>{{ app.studentName }}</span>
            <span>{{ app.type }}</span>
            <span :class="statusClass(app.status)">{{ $t(statusKey(app.status)) }}</span>
            <span>{{ formatDate(app.createdAt) }}</span>
            <span></span>
          </div>
        </div>
      </div>
    </section>
  `,
  setup() {
    const data = ref(null);
    const trips = ref([]);
    const applications = ref([]);

    const load = async () => {
      data.value = await api.analytics();
      trips.value = await api.listTrips();
      applications.value = await api.listApplications();
    };

    const countByStatus = (items, statusField) => {
      const counts = {};
      items.forEach((item) => {
        const status = item[statusField] || "UNKNOWN";
        counts[status] = (counts[status] || 0) + 1;
      });
      return counts;
    };

    const colorForStatus = (status) => {
      const s = status?.toLowerCase();
      if (s === "published" || s === "approved" || s === "completed" || s === "graded") return "bar-green";
      if (s === "pending" || s === "awaiting_review" || s === "draft") return "bar-amber";
      if (s === "rejected") return "bar-red";
      return "bar-slate";
    };

    const tripStatusData = computed(() => {
      const counts = countByStatus(trips.value, "status");
      const total = Math.max(trips.value.length, 1);
      return Object.entries(counts).map(([label, count]) => ({
        label,
        count,
        percent: Math.round((count / total) * 100),
        color: colorForStatus(label),
      }));
    });

    const appStatusData = computed(() => {
      const counts = countByStatus(applications.value, "status");
      const total = Math.max(applications.value.length, 1);
      return Object.entries(counts).map(([label, count]) => ({
        label,
        count,
        percent: Math.round((count / total) * 100),
        color: colorForStatus(label),
      }));
    });

    const recentApps = computed(() => {
      return [...applications.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
    });

    onMounted(load);

    return {
      data,
      trips,
      applications,
      tripStatusData,
      appStatusData,
      recentApps,
      formatDate: (value) => formatDate(value, state.locale),
      statusClass,
      statusKey,
    };
  },
};

const routes = [
  { path: "/", component: LandingView, meta: { public: true } },
  { path: "/login", component: LoginView, meta: { public: true } },
  {
    path: "/app",
    component: AppLayout,
    children: [
      { path: "", redirect: "/app/dashboard" },
      { path: "dashboard", component: DashboardView },
      { path: "trips", component: TripsView },
      { path: "internships", component: InternshipsView },
      { path: "applications", component: ApplicationsView },
      { path: "reports", component: ReportsView },
      { path: "analytics", component: AnalyticsView, meta: { roles: ["ADVISOR", "STAFF", "ADMIN"] } },
      { path: "ai", component: AiView, meta: { roles: ["ADVISOR", "STAFF", "ADMIN"] } },
      { path: "admin", component: AdminView, meta: { roles: ["ADMIN"] } },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: state.locale,
  messages,
});

router.beforeEach(async (to) => {
  if (to.meta.public) {
    return true;
  }
  if (!state.token) {
    return "/login";
  }
  if (!state.user) {
    try {
      state.user = await api.me();
    } catch (error) {
      state.token = "";
      localStorage.removeItem("utcctp_token");
      return "/login";
    }
  }
  if (to.meta.roles && !to.meta.roles.some((role) => state.user.roles.includes(role))) {
    return "/app/dashboard";
  }
  return true;
});

document.documentElement.lang = state.locale;

const app = createApp({ template: "<router-view />" });
app.use(router);
app.use(i18n);
app.mount("#app");
