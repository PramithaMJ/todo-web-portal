/**
 * JWT Utilities Unit Tests
 * Tests for JWT token handling functions
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  decodeJWT,
  isTokenExpired,
  getTokenExpirationTime,
  getUserIdFromToken,
} from '../jwt';

describe('JWT Utilities', () => {
  // Valid JWT token for testing (payload: { sub: "user-123", exp: future, iat: past })
  const createMockToken = (payload: Record<string, unknown>): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify(payload));
    const signature = 'mock-signature';
    return `${header}.${payloadEncoded}.${signature}`;
  };

  const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
  const currentTimestamp = Math.floor(Date.now() / 1000);

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('decodeJWT', () => {
    it('should decode valid JWT token', () => {
      const payload = { sub: 'user-123', exp: futureTimestamp, iat: currentTimestamp };
      const token = createMockToken(payload);

      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe('user-123');
      expect(decoded?.exp).toBe(futureTimestamp);
    });

    it('should return null for invalid token format', () => {
      const invalidToken = 'invalid.token';

      const decoded = decodeJWT(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should return null for empty token', () => {
      const decoded = decodeJWT('');

      expect(decoded).toBeNull();
    });

    it('should return null for malformed JWT', () => {
      const malformedToken = 'header.payload'; // Missing signature

      const decoded = decodeJWT(malformedToken);

      expect(decoded).toBeNull();
    });

    it('should handle JWT with URL-safe base64', () => {
      const payload = { sub: 'user-123', data: 'test+value/data=' };
      const token = createMockToken(payload);

      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.sub).toBe('user-123');
    });

    it('should decode token with additional claims', () => {
      const payload = {
        sub: 'user-123',
        exp: futureTimestamp,
        iat: currentTimestamp,
        email: 'test@example.com',
        role: 'admin',
      };
      const token = createMockToken(payload);

      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.role).toBe('admin');
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for non-expired token', () => {
      const payload = { sub: 'user-123', exp: futureTimestamp };
      const token = createMockToken(payload);

      const expired = isTokenExpired(token);

      expect(expired).toBe(false);
    });

    it('should return true for expired token', () => {
      const payload = { sub: 'user-123', exp: pastTimestamp };
      const token = createMockToken(payload);

      const expired = isTokenExpired(token);

      expect(expired).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const payload = { sub: 'user-123' };
      const token = createMockToken(payload);

      const expired = isTokenExpired(token);

      expect(expired).toBe(true);
    });

    it('should return true for invalid token', () => {
      const expired = isTokenExpired('invalid-token');

      expect(expired).toBe(true);
    });

    it('should consider 30 second buffer for expiration', () => {
      // Token expires in 20 seconds (within buffer)
      const soonExpiry = Math.floor(Date.now() / 1000) + 20;
      const payload = { sub: 'user-123', exp: soonExpiry };
      const token = createMockToken(payload);

      const expired = isTokenExpired(token);

      // Should be considered expired due to 30 second buffer
      expect(expired).toBe(true);
    });

    it('should not expire token beyond 30 second buffer', () => {
      // Token expires in 60 seconds (beyond buffer)
      const laterExpiry = Math.floor(Date.now() / 1000) + 60;
      const payload = { sub: 'user-123', exp: laterExpiry };
      const token = createMockToken(payload);

      const expired = isTokenExpired(token);

      expect(expired).toBe(false);
    });
  });

  describe('getTokenExpirationTime', () => {
    it('should return remaining time for valid token', () => {
      const expiryIn60Seconds = Math.floor(Date.now() / 1000) + 60;
      const payload = { sub: 'user-123', exp: expiryIn60Seconds };
      const token = createMockToken(payload);

      const remaining = getTokenExpirationTime(token);

      // Should be approximately 60000 milliseconds (60 seconds)
      expect(remaining).toBeGreaterThan(59000);
      expect(remaining).toBeLessThanOrEqual(60000);
    });

    it('should return 0 for expired token', () => {
      const payload = { sub: 'user-123', exp: pastTimestamp };
      const token = createMockToken(payload);

      const remaining = getTokenExpirationTime(token);

      expect(remaining).toBe(0);
    });

    it('should return 0 for token without exp claim', () => {
      const payload = { sub: 'user-123' };
      const token = createMockToken(payload);

      const remaining = getTokenExpirationTime(token);

      expect(remaining).toBe(0);
    });

    it('should return 0 for invalid token', () => {
      const remaining = getTokenExpirationTime('invalid-token');

      expect(remaining).toBe(0);
    });

    it('should handle token expiring in far future', () => {
      // Token expires in 1 day
      const farFuture = Math.floor(Date.now() / 1000) + 86400;
      const payload = { sub: 'user-123', exp: farFuture };
      const token = createMockToken(payload);

      const remaining = getTokenExpirationTime(token);

      // Should be approximately 86400000 milliseconds (1 day)
      expect(remaining).toBeGreaterThan(86390000);
      expect(remaining).toBeLessThanOrEqual(86400000);
    });
  });

  describe('getUserIdFromToken', () => {
    it('should extract user ID from valid token', () => {
      const payload = { sub: 'user-123', exp: futureTimestamp };
      const token = createMockToken(payload);

      const userId = getUserIdFromToken(token);

      expect(userId).toBe('user-123');
    });

    it('should return null for token without sub claim', () => {
      const payload = { exp: futureTimestamp };
      const token = createMockToken(payload);

      const userId = getUserIdFromToken(token);

      expect(userId).toBeNull();
    });

    it('should return null for invalid token', () => {
      const userId = getUserIdFromToken('invalid-token');

      expect(userId).toBeNull();
    });

    it('should handle numeric user IDs', () => {
      const payload = { sub: '12345', exp: futureTimestamp };
      const token = createMockToken(payload);

      const userId = getUserIdFromToken(token);

      expect(userId).toBe('12345');
    });

    it('should handle UUID user IDs', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const payload = { sub: uuid, exp: futureTimestamp };
      const token = createMockToken(payload);

      const userId = getUserIdFromToken(token);

      expect(userId).toBe(uuid);
    });
  });

  describe('Edge Cases', () => {
    it('should handle tokens with special characters in payload', () => {
      const payload = {
        sub: 'user-123',
        exp: futureTimestamp,
        data: 'special@chars!#$%',
      };
      const token = createMockToken(payload);

      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.data).toBe('special@chars!#$%');
    });

    it('should handle tokens with nested objects', () => {
      const payload = {
        sub: 'user-123',
        exp: futureTimestamp,
        metadata: {
          role: 'admin',
          permissions: ['read', 'write'],
        },
      };
      const token = createMockToken(payload);

      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.metadata).toEqual({
        role: 'admin',
        permissions: ['read', 'write'],
      });
    });

    it('should handle empty payload', () => {
      const token = createMockToken({});

      const decoded = decodeJWT(token);

      expect(decoded).not.toBeNull();
      expect(Object.keys(decoded!)).toHaveLength(0);
    });
  });
});
