-- Supabase RLS baseline for production.
--
-- Notes:
-- 1) If your backend uses the Supabase Service Role key, it will bypass RLS.
-- 2) These policies are safe for a public frontend that only reads public listings.
-- 3) For user-specific access (student/company/advisor/staff/admin), keep using your backend JWT/role checks.
--    Add tighter owner-based policies later only if you migrate to Supabase Auth end-to-end.

-- ------------------------------------------------------------
-- Enable RLS on core tables
-- ------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- Helper function: allow authenticated Supabase users to read public internship listings
-- If you do not use Supabase Auth for the frontend, keep the backend as the only writer.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "public can read published internships" ON public.internship_positions;
CREATE POLICY "public can read published internships"
ON public.internship_positions
FOR SELECT
TO anon, authenticated
USING (status = 'PUBLISHED' OR status = 'OPEN');

DROP POLICY IF EXISTS "public can read public companies" ON public.companies;
CREATE POLICY "public can read public companies"
ON public.companies
FOR SELECT
TO anon, authenticated
USING (status = 'ACTIVE' OR status = 'PUBLISHED' OR status = 'APPROVED');

DROP POLICY IF EXISTS "public can read trips" ON public.trips;
CREATE POLICY "public can read trips"
ON public.trips
FOR SELECT
TO anon, authenticated
USING (status = 'PUBLISHED' OR status = 'OPEN');

-- ------------------------------------------------------------
-- Authenticated users can read their own base profile records IF you later map app users to Supabase auth users.
-- These policies are intentionally conservative and will not grant write access.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "auth users can read own profile row" ON public.student_profiles;
CREATE POLICY "auth users can read own profile row"
ON public.student_profiles
FOR SELECT
TO authenticated
USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "auth users can read own company profile row" ON public.company_profiles;
CREATE POLICY "auth users can read own company profile row"
ON public.company_profiles
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT cm.company_id
    FROM public.company_members cm
    WHERE cm.user_id::text = auth.uid()::text
      AND cm.active = true
  )
);

DROP POLICY IF EXISTS "auth users can read own company membership" ON public.company_members;
CREATE POLICY "auth users can read own company membership"
ON public.company_members
FOR SELECT
TO authenticated
USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "auth users can read own advisor link" ON public.student_advisors;
CREATE POLICY "auth users can read own advisor link"
ON public.student_advisors
FOR SELECT
TO authenticated
USING (student_id::text = auth.uid()::text OR advisor_id::text = auth.uid()::text);

-- ------------------------------------------------------------
-- User-specific activity tables: read only for owner/relevant party.
-- These are compatible if you later move auth to Supabase Auth.
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "owners can read applications" ON public.applications;
CREATE POLICY "owners can read applications"
ON public.applications
FOR SELECT
TO authenticated
USING (student_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "owners can read own reports" ON public.reports;
CREATE POLICY "owners can read own reports"
ON public.reports
FOR SELECT
TO authenticated
USING (student_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "owners can read own notifications" ON public.notifications;
CREATE POLICY "owners can read own notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "owners can read own refresh tokens" ON public.refresh_tokens;
CREATE POLICY "owners can read own refresh tokens"
ON public.refresh_tokens
FOR SELECT
TO authenticated
USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "owners can read own audit logs" ON public.audit_logs;
CREATE POLICY "owners can read own audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (actor_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "owners can read own interviews" ON public.interviews;
CREATE POLICY "owners can read own interviews"
ON public.interviews
FOR SELECT
TO authenticated
USING (
  application_id IN (
    SELECT a.id
    FROM public.applications a
    WHERE a.student_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "owners can read own offers" ON public.offers;
CREATE POLICY "owners can read own offers"
ON public.offers
FOR SELECT
TO authenticated
USING (
  application_id IN (
    SELECT a.id
    FROM public.applications a
    WHERE a.student_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "owners can read own application logs" ON public.application_status_log;
CREATE POLICY "owners can read own application logs"
ON public.application_status_log
FOR SELECT
TO authenticated
USING (
  application_id IN (
    SELECT a.id
    FROM public.applications a
    WHERE a.student_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "owners can read own application documents" ON public.application_documents;
CREATE POLICY "owners can read own application documents"
ON public.application_documents
FOR SELECT
TO authenticated
USING (
  application_id IN (
    SELECT a.id
    FROM public.applications a
    WHERE a.student_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "owners can read own interview feedback" ON public.interview_feedback;
CREATE POLICY "owners can read own interview feedback"
ON public.interview_feedback
FOR SELECT
TO authenticated
USING (
  interview_id IN (
    SELECT i.id
    FROM public.interviews i
    JOIN public.applications a ON a.id = i.application_id
    WHERE a.student_id::text = auth.uid()::text
  )
);

DROP POLICY IF EXISTS "owners can read own report grades" ON public.report_grades;
CREATE POLICY "owners can read own report grades"
ON public.report_grades
FOR SELECT
TO authenticated
USING (
  report_id IN (
    SELECT r.id
    FROM public.reports r
    WHERE r.student_id::text = auth.uid()::text
  )
);

-- ------------------------------------------------------------
-- By default, no direct writes from anon/authenticated to sensitive tables.
-- Keep writes in backend with service-role key.
-- ------------------------------------------------------------
-- No INSERT/UPDATE/DELETE policies are created here on purpose.
-- Add them only if your frontend talks directly to Supabase Auth + PostgREST.
