# 🚀 UTCC-TP Production Deployment Guide

> **Last Updated:** 2026-04-23
> **Build Status:** ✅ Maven BUILD SUCCESS | All n8n workflows synced & active

---

## 📋 Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │────▶│   n8n Cloud     │
│   (Vercel)      │     │   (Render)      │     │   Automation    │
│   Next.js 14    │     │   Spring Boot   │     │   9 Workflows   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │                        │
                              ▼                        ▼
                        ┌───────────┐           ┌───────────────┐
                        │ Supabase  │           │ Resend Email  │
                        │ Postgres  │           │ Google Cal    │
                        └───────────┘           │ OpenRouter AI │
                                                └───────────────┘
```

---

## 🔧 Backend (Render) — Spring Boot

### Service Configuration

| Setting | Value |
|---------|-------|
| **Type** | Web Service |
| **Runtime** | Docker |
| **Dockerfile** | `./Dockerfile` |
| **Region** | Oregon (default) |
| **Plan** | Starter or above |
| **Health Check** | `/actuator/health` |
| **Port** | `8080` |

### Required Environment Variables (Render Dashboard)

```bash
# === Database (Supabase) ===
DATABASE_URL=jdbc:postgresql://<host>:5432/<db>
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>

# === Auth ===
JWT_SECRET=<32+ character secret>
OTP_EXPIRY_MINUTES=10

# === Email (Resend) ===
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_DOMAIN=yourdomain.com

# === File Upload (Cloudinary) ===
CLOUDINARY_CLOUD_NAME=<cloud>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

# === AI ===
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxxxx

# === n8n Webhooks ===
N8N_WEBHOOK_URL=https://thanathorn123.app.n8n.cloud/webhook/otp-send
N8N_WEBHOOK_BASE=https://thanathorn123.app.n8n.cloud/webhook
N8N_WEBHOOK_APP_STATUS=https://thanathorn123.app.n8n.cloud/webhook/utcctp-app-status
N8N_WEBHOOK_RESUME=https://thanathorn123.app.n8n.cloud/webhook/utcctp-resume-screening
N8N_WEBHOOK_INTERVIEW=https://thanathorn123.app.n8n.cloud/webhook/utcctp-interview-scheduled
N8N_WEBHOOK_SECURITY=https://thanathorn123.app.n8n.cloud/webhook/security-alert
N8N_WEBHOOK_FORGOT_PW=https://thanathorn123.app.n8n.cloud/webhook/forgot-password
N8N_WEBHOOK_EVENTS=https://thanathorn123.app.n8n.cloud/webhook/utcctp-events

# === CORS ===
CORS_ALLOWED_ORIGINS=https://utcc-tp.vercel.app
```

---

## 🌐 Frontend (Vercel) — Next.js 14

### Vercel Project Settings

| Setting | Value |
|---------|-------|
| **Framework** | Next.js |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm ci` |
| **Root Directory** | `frontend` |
| **Node Version** | 18.x or 20.x |

### Required Environment Variables (Vercel Dashboard)

```bash
# Backend API URL (Render)
NEXT_PUBLIC_API_URL=https://utcc-tp-backend.onrender.com/api/v1

# Site URL
NEXT_PUBLIC_SITE_URL=https://utcc-tp.vercel.app

# Nexus AI Chatbot (Google Gemini)
GEMINI_API_KEY=<your-gemini-api-key>
GEMINI_MODEL=gemini-1.5-flash
```

---

## 🤖 n8n Cloud — Automation Workflows

### Active Workflows (9)

| # | Workflow Name | Path | Purpose |
|---|-------------|------|---------|
| 1 | **UTCC-TP OTP Delivery (Final)** | `/webhook/otp-send` | Send OTP verification emails |
| 2 | **Forgot Password Email** | `/webhook/forgot-password` | Password reset OTP emails |
| 3 | **Professional Security Alert** | `/webhook/security-alert` | Account security notifications |
| 4 | **UTCC-TP Event Router** | `/webhook/utcctp-events` | Central event dispatcher |
| 5 | **Application Status Pipeline** | `/webhook/utcctp-app-status` | Status change email notifications |
| 6 | **Interview Auto-Scheduling** | `/webhook/utcctp-interview-scheduled` | Calendar + email for interviews |
| 7 | **AI Resume Screening** | `/webhook/utcctp-resume-screening` | AI-powered candidate scoring |
| 8 | **Nexus AI Assistant** | Chat Trigger | Conversational AI helper |
| 9 | **Weekly Report Reminder** | Cron (Sun 18:00) | Weekly reminder emails |

### Backend → n8n Integration Map

| Java Service Method | n8n Workflow | Trigger |
|---|---|---|
| `WebhookService.sendOtp()` | OTP Delivery | User signup / password reset |
| `WebhookService.sendStatusChange()` | Event Router | Application status transition |
| `WebhookService.sendApplicationStatusChange()` | App Status Pipeline | Rich status email dispatch |
| `WebhookService.sendInterviewScheduled()` | Interview Scheduling | Interview creation |
| `WebhookService.sendResumeForScreening()` | AI Resume Screening | Application submission |
| `WebhookService.sendSecurityAlert()` | Security Alert | Account security events |
| `WebhookService.sendForgotPassword()` | Forgot Password | Password reset request |
| `WebhookService.sendEvent()` | Event Router | Generic events |

---

## 📁 Project Structure

```
UTCC-TP/
├── src/main/java/org/example/utcctp/
│   ├── api/              # REST Controllers
│   ├── application/       # Application/ATS logic
│   ├── auth/             # JWT + OTP auth
│   ├── config/           # Spring config + CORS
│   ├── interview/        # Interview scheduling
│   ├── internship/       # Company + Position services
│   ├── model/            # JPA Entities
│   ├── notification/     # WebhookService + NotificationService
│   └── repository/       # Spring Data repositories
├── src/main/resources/
│   ├── application.properties  # All config with env var fallbacks
│   └── db/migration/          # Flyway SQL migrations (V1-V17)
├── frontend/
│   ├── app/              # Next.js App Router pages
│   │   ├── (app)/        # Protected pages by role
│   │   └── api/chat/     # Nexus AI API route (Gemini SDK)
│   ├── components/       # Reusable React components
│   └── lib/              # API client + utilities
├── Dockerfile            # Multi-stage Docker build
├── render.yaml           # Render deployment manifest
└── vercel.json           # Vercel config
```

---

## ✅ Production Checklist

### Backend
- [x] Maven BUILD SUCCESS (Java 21)
- [x] Dockerfile multi-stage build working
- [x] All webhook URLs configured in `application.properties`
- [x] `render.yaml` has all env vars declared
- [x] CORS configured for Vercel domain
- [x] Health check endpoint available
- [x] WebhookService has `@PreDestroy` shutdown hook
- [x] All API endpoints secured with JWT + `@PreAuthorize`

### Frontend
- [x] Next.js builds successfully
- [x] `vercel.json` configured
- [x] Nexus AI uses Gemini SDK (server-side, no CORS issues)
- [x] All role-based navigation complete (Student, Advisor, Company, Staff, Admin)
- [x] Mobile responsive design with sidebar + hamburger nav

### n8n
- [x] All 9 production workflows published & active
- [x] Duplicate OTP workflow deactivated
- [x] Resend SMTP credentials configured
- [x] OpenRouter AI credentials configured
- [x] Google Calendar integration configured

### Database
- [x] Supabase Postgres connected
- [x] Flyway migrations V1-V17 applied
- [x] Indexes created for performance

---

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add -A
git commit -m "feat: sync all n8n workflows + production ready"
git push origin main
```

### 2. Deploy Backend (Render)
- Connect repo to Render
- Set all env vars from list above
- Auto-deploy triggers on push to `main`

### 3. Deploy Frontend (Vercel)
- Connect repo to Vercel
- Set root directory to `frontend`
- Set all env vars from list above
- Auto-deploy triggers on push to `main`

### 4. Verify
- Check Render logs: `BUILD SUCCESS` → `Started UtcctpApplication`
- Check Vercel deployment: Build succeeds, pages load
- Test OTP flow: Register → receive email
- Test login → dashboard loads correctly
