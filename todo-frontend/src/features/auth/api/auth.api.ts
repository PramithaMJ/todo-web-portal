/**
 * Authentication API
 * Handles authentication operations
 */

import { apiClient } from '../../../shared/api/client/apiClient';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import type { AuthResponse } from '../../../entities/session/model/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

/**
 * Login with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
};

/**
 * Register new user
 */
export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>('/auth/register', credentials);
};

/**
 * Logout current user
 */
export const logout = async (): Promise<void> => {
  return apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * Refresh access token
 */
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
};

/**
 * Get current user info
 */
export const getCurrentUser = async (): Promise<AuthResponse['user']> => {
  return apiClient.get<AuthResponse['user']>(API_ENDPOINTS.AUTH.ME);
};
