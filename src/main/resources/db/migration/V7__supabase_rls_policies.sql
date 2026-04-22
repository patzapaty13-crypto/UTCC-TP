-- Supabase RLS policies - SKIPPED for non-Supabase Postgres deployments.
-- These policies require Supabase-specific roles (anon, authenticated) and functions (auth.uid())
-- which do not exist in standard PostgreSQL.
-- RLS enforcement is handled at the application layer via Spring Security + JWT.
SELECT 1;
