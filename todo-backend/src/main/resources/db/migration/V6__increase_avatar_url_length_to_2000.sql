-- Increase avatar_url column length to 2000 to accommodate very long OAuth provider URLs
ALTER TABLE users ALTER COLUMN avatar_url TYPE VARCHAR(2000);
