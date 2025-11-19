/**
 * Auth API Unit Tests
 * Tests for authentication operations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from '../../../../shared/api/client/apiClient';
import {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  type LoginCredentials,
  type RegisterCredentials,
} from '../auth.api';
import type { AuthResponse } from '../../../../entities/session/model/types';

// Mock apiClient
vi.mock('../../../../shared/api/client/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Auth API', () => {
  const mockAuthResponse: AuthResponse = {
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600,
    user: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: null,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockAuthResponse);

      const result = await login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockAuthResponse);
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error on invalid credentials', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(login(credentials)).rejects.toThrow('Invalid credentials');
    });

    it('should handle network errors', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'));

      await expect(login(credentials)).rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    const credentials: RegisterCredentials = {
      name: 'New User',
      email: 'newuser@example.com',
      password: 'password123',
    };

    it('should register successfully with valid credentials', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockAuthResponse);

      const result = await register(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', credentials);
      expect(result).toEqual(mockAuthResponse);
      expect(result.accessToken).toBeTruthy();
      expect(result.user.name).toBe('Test User');
    });

    it('should throw error on duplicate email', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Email already exists'));

      await expect(register(credentials)).rejects.toThrow('Email already exists');
    });

    it('should handle validation errors', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Validation failed'));

      await expect(register(credentials)).rejects.toThrow('Validation failed');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce(undefined);

      await logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should handle logout errors gracefully', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Logout failed'));

      await expect(logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshTokenValue = 'valid-refresh-token';
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockAuthResponse);

      const result = await refreshToken(refreshTokenValue);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: refreshTokenValue,
      });
      expect(result).toEqual(mockAuthResponse);
      expect(result.accessToken).toBeTruthy();
    });

    it('should throw error on invalid refresh token', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Invalid refresh token'));

      await expect(refreshToken('invalid-token')).rejects.toThrow('Invalid refresh token');
    });

    it('should throw error on expired refresh token', async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Refresh token expired'));

      await expect(refreshToken('expired-token')).rejects.toThrow('Refresh token expired');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockAuthResponse.user);

      const result = await getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockAuthResponse.user);
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error when not authenticated', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Unauthorized'));

      await expect(getCurrentUser()).rejects.toThrow('Unauthorized');
    });

    it('should handle network errors', async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'));

      await expect(getCurrentUser()).rejects.toThrow('Network error');
    });
  });
});
