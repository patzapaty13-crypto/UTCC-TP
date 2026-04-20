-- V9: Add company_id to users table
-- This allows users with COMPANY role to be linked to a company

ALTER TABLE users ADD COLUMN company_id UUID;

-- Add foreign key constraint (optional, but recommended)
-- ALTER TABLE users ADD CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES companies(id);

-- Update existing company users with a default company (if needed)
-- You can manually update this after creating companies
