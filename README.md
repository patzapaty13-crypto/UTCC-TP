# 🎓 UTCC-TP: ระบบบริหารจัดการการฝึกงานและการเดินทาง (Trip & Internship Management)

**มหาวิทยาลัยหอการค้าไทย (University of the Thai Chamber of Commerce)**
ระบบ ATS (Applicant Tracking System) ระดับมืออาชีพที่ผสานพลัง AI และระบบ Automation เพื่อยกระดับการจัดการฝึกงาน

---

## 🏗️ สถาปัตยกรรมระบบและกระแสข้อมูล (System Architecture)

ระบบถูกออกแบบโดยแบ่งแยกหน้าที่อย่างชัดเจน (Separation of Concerns) เพื่อความเสถียรและความปลอดภัย:

```mermaid
graph TD
    subgraph "หน้าบ้าน (Frontend - Next.js 16)"
        UI["React 19 Components (UI)"]
        Lib["API Library (Axios + Interceptors)"]
        Context["Auth Context (จัดการ Login/Session)"]
    end

    subgraph "หลังบ้าน (Backend - Spring Boot 3.4)"
        API["REST Controllers (จุดรับ Request)"]
        Security["JWT & Spring Security (ระบบรักษาความปลอดภัย)"]
        Service["Business Logic Services (หัวใจการประมวลผล)"]
        Repo["JPA Repositories (การเชื่อมต่อฐานข้อมูล)"]
    end

    subgraph "โครงสร้างพื้นฐาน (Infrastructure)"
        DB[("PostgreSQL Database")]
        n8n["n8n Automation Cloud (ระบบจัดการคิวงาน)"]
        Cloud["Cloudinary (ที่เก็บไฟล์และรูปภาพ)"]
        Mail["Resend API (ระบบส่งอีเมล)"]
    end

    UI --> Lib
    Lib -->|ส่ง JWT Token + ข้อมูล| API
    API --> Security
    Security -->|ตรวจสอบสิทธิ์| Service
    Service --> Repo
    Repo --> DB
    Service -->|สั่งงานอัตโนมัติแบบ Async| n8n
    Service -->|อัปโหลดไฟล์| Cloud
    n8n --> Mail
```

---

## 📂 เจาะลึกโครงสร้างโฟลเดอร์และไฟล์ (Deep Dive)

### 💻 ภาคส่วนหน้าบ้าน: `/frontend`
พัฒนาด้วย **Next.js 16 (App Router)** ซึ่งเป็นเวอร์ชันล่าสุด

| โฟลเดอร์ / ไฟล์ | คำอธิบายโดยละเอียด |
|---|-|
| `app/` | **หัวใจของ Routing:** ทุกโฟลเดอร์คือ 1 หน้าเว็บ |
| `app/(app)/` | **Route กลุ่มที่มีการป้องกัน:** ต้อง Login เท่านั้นถึงจะเข้าได้ (Student, Advisor, Admin Dashboards) |
| `app/api/chat/` | **API Route สำหรับ Nexus AI:** ทำหน้าที่เป็นตัวกลางส่งข้อความจาก User ไปหา n8n หรือ Gemini |
| `components/` | **ส่วนประกอบ UI ที่นำกลับมาใช้ใหม่ได้:** ช่วยให้โค้ดสะอาดและจัดการง่าย |
| `components/RoleDashboardShell.js` | **เฟรมเวิร์กหลักของ Dashboard:** ตรวจสอบ Role ของ User และแสดงเมนูข้าง (Sidebar) ที่ต่างกัน |
| `components/ApplicationForm.js` | **แบบฟอร์มสมัครงาน 5 ขั้นตอน:** จัดการข้อมูลส่วนตัว, ประวัติการเรียน, และการอัปโหลดไฟล์ (Resume/Transcript) |
| `components/NexusChat.js` | **ปุ่มแชท AI ลอยตัว:** อินเตอร์เฟซสำหรับคุยกับระบบ Nexus AI |
| `lib/api.js` | **Axios Instance:** ตั้งค่า Base URL และดักจับ Request เพื่อแนบ JWT Token อัตโนมัติ |
| `lib/statusConfig.js` | **การตั้งค่าสถานะ (Status):** กำหนดสีและไอคอนของสถานะการสมัครงาน (เช่น Pending = สีเหลือง, Approved = สีเขียว) |

---

### ⚙️ ภาคส่วนหลังบ้าน: `/src/main/java/org/example/utcctp`
พัฒนาด้วย **Spring Boot 3.4 (Java 21)** เน้นความเร็วและความปลอดภัยระดับ Enterprise

| แพ็กเกจ (Package) | คำอธิบายโดยละเอียด |
|---|-|
| `api/` | **Controllers:** ส่วนที่รับคำสั่งจาก Frontend เช่น `ApplicationController` รับการสมัครงาน, `InternshipController` จัดการประกาศรับสมัคร |
| `auth/` | **ระบบยืนยันตัวตน:** จัดการการสมัครสมาชิก (Signup), การเข้าสู่ระบบ (Login), และระบบ OTP ผ่านอีเมล |
| `model/` | **Entities:** นิยามโครงสร้างตารางในฐานข้อมูล (เช่น User, InternshipPosition, Application, AuditLog) |
| `service/` | **Business Logic:** หัวใจสำคัญที่ควบคุมกฎเกณฑ์ เช่น `ApplicationService` จะคอยตรวจสอบว่าสถานะการสมัครเปลี่ยนจาก 'ยื่นคำขอ' เป็น 'สัมภาษณ์' ได้เมื่อไหร่ |
| `notification/` | **WebhookService:** ระบบส่งสัญญาณไปหา n8n เพื่อเริ่มทำงานอัตโนมัติ เช่น ส่งเมลแจ้งเตือนเมื่อได้งาน |
| `security/` | **Security Config:** ตั้งค่าว่าใครเข้าหน้าไหนได้บ้าง (Role-based Access Control) และจัดการ JWT Filter |
| `storage/` | **Storage Logic:** ระบบจัดการไฟล์ที่รองรับทั้งเก็บในเครื่อง (Local) และเก็บบน Cloud (Cloudinary) |
| `repository/` | **JPA Repositories:** ส่วนที่คุยกับฐานข้อมูล PostgreSQL โดยตรงด้วยคำสั่ง SQL หรือ Method Name |

---

## 🤖 ระบบอัตโนมัติด้วย n8n (Automation Workflows)

เราใช้ n8n Cloud ในการจัดการงานที่ต้องใช้เวลาประมวลผลสูง (Background Tasks):

1.  **OTP Delivery:** รับคำขอจาก Backend -> ส่งอีเมลรหัส OTP ให้ User ทันที
2.  **Application Pipeline:** เมื่อสถานะการสมัครเปลี่ยน -> n8n จะส่งอีเมลแจ้งทั้งนักศึกษาและบริษัท
3.  **AI Resume Screening:** (อยู่ระหว่างพัฒนา) ใช้ AI วิเคราะห์ความเหมาะสมของ Resume กับตำแหน่งงาน
4.  **Nexus AI Assistant:** รับข้อความแชทจากหน้าเว็บ -> ประมวลผลผ่าน LLM (Gemini/OpenRouter) -> ตอบกลับ User

---

## 🔐 ระบบความปลอดภัยและการตรวจสอบ (Security & Audit)

*   **JWT (JSON Web Token):** ใช้สำหรับการจดจำ Session ของ User อย่างปลอดภัย ไม่มีการเก็บ Cookie ที่เสี่ยงต่อการแฮ็ก
*   **Role-based Access:** ระบบแยกสิทธิ์ชัดเจน:
    *   `STUDENT`: สมัครงาน, แก้ไขโปรไฟล์, รายงานตัว
    *   `COMPANY`: ประกาศงาน, นัดสัมภาษณ์, ส่ง Offer
    *   `ADVISOR`: ตรวจสอบสถานะเด็ก, อนุมัติการฝึกงาน
    *   `ADMIN`: ดู Audit Logs, จัดการผู้ใช้, ดูสถิติรวม
*   **Audit Logging:** ทุกการกระทำที่สำคัญ (เช่น การเปลี่ยนคะแนนสัมภาษณ์ หรือการลบข้อมูล) จะถูกบันทึกลงตาราง `audit_logs` พร้อมระบุ IP Address และ Browser ที่ใช้

---

## 🚀 ลิงก์สำคัญ (Production Links)

*   **หน้าเว็บ (Frontend):** [https://utcc-tp-indol.vercel.app](https://utcc-tp-indol.vercel.app)
*   **ระบบหลังบ้าน (Backend):** [https://utcc-tp-backend.onrender.com](https://utcc-tp-backend.onrender.com)
*   **API Health Check:** [https://utcc-tp-backend.onrender.com/actuator/health](https://utcc-tp-backend.onrender.com/actuator/health)

---

## 💻 วิธีการติดตั้งและรันระบบ (Local Setup)

### 1. ระบบหลังบ้าน (Backend - Spring Boot)
ต้องมี Java 21 ติดตั้งในเครื่อง:
```bash
# รันด้วยฐานข้อมูล H2 (In-memory) ไม่ต้องตั้งค่าฐานข้อมูล
./mvnw spring-boot:run
```
*   ระบบจะรันที่: `http://localhost:8080`
*   หน้าทดสอบ API (Swagger): `http://localhost:8080/swagger-ui.html`

### 2. ระบบหน้าบ้าน (Frontend - Next.js)
ต้องมี Node.js ติดตั้งในเครื่อง:
```bash
cd frontend
npm install
npm run dev
```
*   ระบบจะรันที่: `http://localhost:3000`

---

## 🗄️ การจัดการฐานข้อมูล (Database Migrations)
เราใช้ **Flyway** ในการควบคุมเวอร์ชันของฐานข้อมูล ไฟล์ทั้งหมดอยู่ที่ `src/main/resources/db/migration/`

*   **V1 - V5:** โครงสร้างพื้นฐาน, ระบบความปลอดภัย, และ Audit Logs
*   **V8:** ส่วนขยายสำหรับ Phase 1 (แบบฟอร์มสมัครงานและรายละเอียดตำแหน่งงานแบบละเอียด)
*   **V11:** ระบบรายงาน (Reports) และการส่งงานของนักศึกษา

---

## 🛠️ รายการตัวแปรสภาพแวดล้อม (Environment Variables)
ดูได้ที่ไฟล์ `.env.example` (Backend) และ `frontend/.env.example` (Frontend)

**ตัวที่สำคัญที่สุด:**
*   `JWT_SECRET`: รหัสลับสำหรับสร้าง Token (ห้ามเปิดเผย)
*   `DATABASE_URL`: ลิงก์เชื่อมต่อฐานข้อมูล PostgreSQL
*   `RESEND_API_KEY`: คีย์สำหรับส่งอีเมลผ่านระบบ Resend
*   `CORS_ALLOWED_ORIGINS`: รายชื่อ URL ที่อนุญาตให้เรียกใช้ API (เช่น https://utcc-tp.vercel.app)
