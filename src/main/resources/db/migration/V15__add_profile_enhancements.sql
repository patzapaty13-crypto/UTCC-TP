-- Add Skills, Experience, and Social Links to users table
-- V15: Profile Enhancements

-- Add JSON columns for skills and experiences
ALTER TABLE users ADD COLUMN IF NOT EXISTS skills JSONB;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experiences JSONB;

-- Add social links columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS github VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS portfolio VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(255);

-- Add comments for documentation
COMMENT ON COLUMN users.skills IS 'JSON array of skills with name and level';
COMMENT ON COLUMN users.experiences IS 'JSON array of work experiences';
COMMENT ON COLUMN users.linkedin IS 'LinkedIn profile URL';
COMMENT ON COLUMN users.github IS 'GitHub profile URL';
COMMENT ON COLUMN users.portfolio IS 'Portfolio website URL';
COMMENT ON COLUMN users.website IS 'Personal website URL';
