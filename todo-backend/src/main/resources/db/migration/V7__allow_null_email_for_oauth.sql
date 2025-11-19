-- Migration to handle GitHub OAuth users with private emails
-- Allow email to be nullable for OAuth providers who don't share email
-- Add unique constraint on provider + provider_id combination

-- First, update any existing GitHub users that might have null emails
UPDATE users 
SET email = CONCAT(provider_id, '@github.oauth.local')
WHERE provider = 'GITHUB' AND email IS NULL;

-- Drop the NOT NULL constraint on email
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Create a unique constraint on provider + provider_id combination
-- This ensures each OAuth user is unique by their provider identity
CREATE UNIQUE INDEX idx_users_provider_provider_id_unique 
ON users(provider, provider_id) 
WHERE provider_id IS NOT NULL;

-- Add a constraint to ensure OAuth users have provider_id
ALTER TABLE users ADD CONSTRAINT chk_oauth_provider_id 
CHECK (
    (provider IN ('GOOGLE', 'GITHUB') AND provider_id IS NOT NULL) OR
    (provider = 'EMAIL')
);
