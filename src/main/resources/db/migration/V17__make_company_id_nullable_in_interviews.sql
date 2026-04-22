-- Make company_id nullable in interviews table
-- V17: Allow interviews without direct company_id (can be derived from position)

ALTER TABLE interviews ALTER COLUMN company_id DROP NOT NULL;
