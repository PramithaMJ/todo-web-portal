/**
 * OAuth API Unit Tests
 * Tests for OAuth authentication operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../../../shared/api/client/apiClient';
import {
  getOAuthUrl,
  handleOAuthCallback,
} from '../oauth.api';
import type { OAuthProvider } from '../../../../entities/session/model/types';
import { env } from '../../../../shared/config/env';

// Mock apiClient
vi.mock('../../../../shared/api/client/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

// Mock env
vi.mock('../../../../shared/config/env', () => ({
  env: {
    apiBaseUrl: 'http://localhost:8080/api/v1',
  },
}));

describe('OAuth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOAuthUrl', () => {
    it('should generate Google OAuth URL', () => {
      const provider: OAuthProvider = 'google';
      const url = getOAuthUrl(provider);

      expect(url).toBe('http://localhost:8080/oauth2/authorization/google');
    });

    it('should generate GitHub OAuth URL', () => {
      const provider: OAuthProvider = 'github';
      const url = getOAuthUrl(provider);

      expect(url).toBe('http://localhost:8080/oauth2/authorization/github');
    });

  });

  describe('handleOAuthCallback', () => {
    const mockAuthResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      expiresIn: 3600,
      user: {
        id: 'user-123',
        name: 'OAuth User',
        email: 'oauth@example.com',
        avatarUrl: 'https://example.com/avatar.jpg',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      },
    };

    it('should handle Google OAuth callback', async () => {
      const provider: OAuthProvider = 'google';
      const callbackData = {
        code: 'auth-code-123',
        state: 'random-state-456',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockAuthResponse);

      const result = await handleOAuthCallback(provider, callbackData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/login/oauth2/code/google',
        callbackData
      );
      expect(result).toEqual(mockAuthResponse);
      expect(result.user.email).toBe('oauth@example.com');
    });

    it('should handle GitHub OAuth callback', async () => {
      const provider: OAuthProvider = 'github';
      const callbackData = {
        code: 'auth-code-123',
        state: 'random-state-456',
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockAuthResponse);

      const result = await handleOAuthCallback(provider, callbackData);

      expect(apiClient.post).toHaveBeenCalledWith(
        '/login/oauth2/code/github',
        callbackData
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error on invalid authorization code', async () => {
      const callbackData = {
        code: 'invalid-code',
        state: 'state',
      };

      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid authorization code'));

      await expect(handleOAuthCallback('google', callbackData)).rejects.toThrow(
        'Invalid authorization code'
      );
    });

    it('should throw error on state mismatch', async () => {
      const callbackData = {
        code: 'valid-code',
        state: 'wrong-state',
      };

      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('State mismatch'));

      await expect(handleOAuthCallback('google', callbackData)).rejects.toThrow(
        'State mismatch'
      );
    });

    it('should handle OAuth provider errors', async () => {
      const callbackData = {
        code: 'code',
        state: 'state',
      };

      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('OAuth provider error'));

      await expect(handleOAuthCallback('github', callbackData)).rejects.toThrow(
        'OAuth provider error'
      );
    });
  });
});
