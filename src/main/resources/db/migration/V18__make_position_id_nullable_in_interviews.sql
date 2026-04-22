-- Make position_id nullable in interviews table to support applications without internship positions
ALTER TABLE interviews ALTER COLUMN position_id DROP NOT NULL;
