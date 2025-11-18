-- Increase avatar_url column length to accommodate longer OAuth provider URLs
ALTER TABLE users ALTER COLUMN avatar_url TYPE VARCHAR(1000);
