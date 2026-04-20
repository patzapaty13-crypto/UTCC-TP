-- Extend file_assets to support external storage providers (e.g. Cloudinary)
ALTER TABLE file_assets ADD COLUMN IF NOT EXISTS provider VARCHAR(30) NOT NULL DEFAULT 'LOCAL';
ALTER TABLE file_assets ADD COLUMN IF NOT EXISTS public_url VARCHAR(1000);
ALTER TABLE file_assets ADD COLUMN IF NOT EXISTS external_id VARCHAR(500);

-- Make storage_path nullable because cloud providers may not have a local filesystem path.
ALTER TABLE file_assets ALTER COLUMN storage_path DROP NOT NULL;
