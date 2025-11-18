-- Add password field for email authentication
ALTER TABLE users ADD COLUMN password VARCHAR(255);

-- Password is required for EMAIL provider, nullable for OAuth providers
COMMENT ON COLUMN users.password IS 'BCrypt hashed password for EMAIL authentication, NULL for OAuth providers';
