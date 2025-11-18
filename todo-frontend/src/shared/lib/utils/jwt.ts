/**
 * JWT Utility Functions
 * Pure functions for JWT token handling
 */

interface JWTPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Decodes JWT token without verification
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
};

/**
 * Checks if JWT token is expired
 * @param token JWT token string
 * @returns True if expired or invalid
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return true;
  }

  // Add 30 second buffer
  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now() + 30000;
  
  return currentTime >= expirationTime;
};

/**
 * Gets remaining time until token expiration
 * @param token JWT token string
 * @returns Remaining milliseconds or 0 if expired/invalid
 */
export const getTokenExpirationTime = (token: string): number => {
  const payload = decodeJWT(token);
  
  if (!payload || !payload.exp) {
    return 0;
  }

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const remaining = expirationTime - currentTime;
  
  return remaining > 0 ? remaining : 0;
};

/**
 * Extracts user ID from JWT token
 * @param token JWT token string
 * @returns User ID or null
 */
export const getUserIdFromToken = (token: string): string | null => {
  const payload = decodeJWT(token);
  return payload?.sub || null;
};
