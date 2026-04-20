# UTCC-TP

**Trip & Internship Management Platform** — University of the Thai Chamber of Commerce.

Spring Boot 3.4 (Java 21) + Next.js 16 (React 19). Supports Supabase Postgres, Cloudinary file storage, Resend transactional email, OTP signup, audit logs, and a live analytics dashboard.

---

## Stack

| Layer       | Tech                                                        |
|-------------|-------------------------------------------------------------|
| Backend     | Spring Boot 3.4.3 · Java 21 · JWT · Flyway                  |
| Frontend    | Next.js 16 (App Router) · React 19                          |
| Database    | Postgres (Supabase / self-hosted) · H2 in-memory for dev    |
| Storage     | Cloudinary (prod) · Local filesystem (dev)                  |
| Email       | Resend API                                                  |
| Automation  | n8n Webhook                                                 |
| AI          | OpenAI API (optional)                                       |

---

## Local development

### 1. Backend (H2 in-memory, zero setup)

```bash
./mvnw -DskipTests spring-boot:run
```

Backend boots on `http://localhost:8080`. Seeded demo users:

| Username  | Password | Role     |
|-----------|----------|----------|
| student1  | pass123  | STUDENT  |
| advisor1  | pass123  | ADVISOR  |
| staff1    | pass123  | STAFF    |
| admin1    | pass123  | ADMIN    |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` and targets `http://localhost:8080/api/v1` by default (override via `NEXT_PUBLIC_API_URL`).

### 3. Postgres via Docker (optional)

```bash
docker compose up -d
SPRING_PROFILES_ACTIVE=postgres ./mvnw -DskipTests spring-boot:run
```

---

## Production deploy

### A. Database — Supabase Postgres

1. Create a Supabase project. Copy the connection string (Pooler 5432 is fine; include `?sslmode=require`).
2. Set env vars on the backend host:
   - `DATABASE_URL` — full JDBC URL, e.g. `jdbc:postgresql://db.xxx.supabase.co:5432/postgres?sslmode=require`
   - `DATABASE_USERNAME` (usually `postgres`)
   - `DATABASE_PASSWORD`
   - `SPRING_PROFILES_ACTIVE=supabase`
3. Flyway auto-runs migrations V1 → V5 on first start.

### B. File storage — Cloudinary

1. Sign up at cloudinary.com → copy **cloud name** from the dashboard.
2. Preferred (signed): set `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`.
3. Simpler (unsigned): create an unsigned **upload preset** and set `CLOUDINARY_UPLOAD_PRESET`.
4. `STORAGE_PROVIDER=auto` (default) uses Cloudinary when configured, otherwise falls back to local disk.

### C. Email — Resend

1. Create a Resend account, verify your sender domain.
2. Set `RESEND_API_KEY` and `MAIL_FROM` (e.g. `UTCC-TP <noreply@yourdomain.com>`).
3. If either is missing, the backend runs in dry-run mode (logs instead of sending) — safe for staging.

### D. Backend — Render (Docker)

`render.yaml` is included. Steps:

1. New web service → "Existing repo" → pick this repo.
2. Render auto-detects `Dockerfile` (`runtime: docker`).
3. In the dashboard → **Environment**, add all secrets from `.env.example`.
4. Render sets `PORT` automatically; health check is at `/actuator/health`.

### E. Frontend — Vercel

1. Import repo, Root Directory = `frontend/`.
2. Vercel auto-detects Next.js.
3. Environment variable: `NEXT_PUBLIC_API_URL = https://<your-backend>.onrender.com/api/v1`.
4. Update backend `CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>`.

### F. Automation — n8n (optional)

Set `N8N_WEBHOOK_URL` to post status-change events to your n8n workflow. Payload schema:

```json
{
  "applicationId": "...", "studentName": "...",
  "oldStatus": "PENDING", "newStatus": "ACCEPTED",
  "positionTitle": "...", "changedBy": "..."
}
```

---

## Features

- **ATS pipeline** — application funnel with status logs, AI match scoring.
- **Enhanced Application Form** (Phase 1) — multi-step form with personal info, academic info, cover letter, and portfolio.
- **Enhanced Job Details** (Phase 1) — salary range, duration, deadline, benefits, contact info, and Google Maps.
- **OTP signup** — `POST /api/v1/auth/signup/request-otp` → `POST /api/v1/auth/signup/verify`.
- **Audit trail** — every sensitive mutation logged with actor/IP/UA. Admin view: `GET /api/v1/admin/audit`.
- **Analytics dashboard** — `GET /api/v1/analytics/dashboard` returns applications by status / major / month + placement rate. Rendered on `/analytics` page.
- **File storage** — pluggable provider (`LOCAL` / `CLOUDINARY`) selected per request.
- **Email notifications** — transactional mail on status changes via Resend.
- **Role-based access** — `STUDENT`, `ADVISOR`, `STAFF`, `ADMIN` with method-level `@PreAuthorize`.

---

## 📚 Documentation

- **[Phase 1 Enhancements](./docs/PHASE1_ENHANCEMENTS.md)** - Technical documentation for Phase 1 features
- **[Phase 1 Quick Start](./docs/PHASE1_QUICK_START.md)** - User guide for students and companies
- **[Phase 1 Complete](./PHASE1_COMPLETE.md)** - Summary of Phase 1 completion
- **[Workflows & Roles](./docs/01-workflows-roles.md)** - System workflows and user roles
- **[ERD & API](./docs/02-erd-api.md)** - Database schema and API documentation
- **[Wireframes](./docs/03-wireframes.md)** - UI/UX design mockups

---

## Environment variables

See `.env.example` (backend) and `frontend/.env.example` (frontend) for the full list with descriptions.

Minimum required for production:

```
JWT_SECRET              # REQUIRED - long random string
DATABASE_URL            # REQUIRED - Supabase JDBC URL
DATABASE_PASSWORD       # REQUIRED
RESEND_API_KEY          # email notifications
CLOUDINARY_CLOUD_NAME   # +  API_KEY/SECRET or UPLOAD_PRESET
CORS_ALLOWED_ORIGINS    # your frontend origin(s)
```

---

## Database migrations

Flyway SQL files in `src/main/resources/db/migration/`:

| Version | Description                                 |
|---------|---------------------------------------------|
| V1      | Initial schema (users, trips, applications) |
| V2      | ATS tables (status log, AI evaluations)     |
| V3      | File storage provider columns               |
| V4      | Signup / OTP table + user fields            |
| V5      | Audit logs                                  |
| V8      | **Phase 1 Enhancements** (application form fields, job details) |

**Phase 1 Enhancement** (V8):
- Applications: +9 fields (phone, email, address, gpa, student_year, cover_letter, portfolio_url, updated_at, submitted_at)
- Internship Positions: +10 fields (salary_min, salary_max, start_date, end_date, application_deadline, benefits, internship_type, contact_email, contact_phone, contact_line)

See [docs/PHASE1_ENHANCEMENTS.md](./docs/PHASE1_ENHANCEMENTS.md) for details.

---

## API surface (abridged)

```
POST   /api/v1/auth/login
POST   /api/v1/auth/signup/request-otp
POST   /api/v1/auth/signup/verify
GET    /api/v1/auth/me

GET    /api/v1/internships
POST   /api/v1/applications
PUT    /api/v1/applications/{id}/status
POST   /api/v1/applications/{id}/decide

POST   /api/v1/files                (multipart upload)
GET    /api/v1/files/{id}           (redirect for Cloudinary, stream for local)

GET    /api/v1/analytics/dashboard  (STAFF/ADMIN/ADVISOR)
GET    /api/v1/admin/audit          (ADMIN)
GET    /api/v1/notifications/stream (SSE)
```

