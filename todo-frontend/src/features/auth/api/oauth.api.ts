/**
 * OAuth API
 * Handles OAuth authentication flows
 */

import { apiClient } from '../../../shared/api/client/apiClient';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import type { OAuthProvider, AuthResponse } from '../../../entities/session/model/types';

export interface OAuthUrlResponse {
  url: string;
  state: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state: string;
}

/**
 * Get OAuth authorization URL for provider
 * Note: Spring Boot OAuth2 handles the redirect directly, no API call needed
 */
export const getOAuthUrl = (provider: OAuthProvider): string => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  
  switch (provider) {
    case 'google':
      return `${baseUrl}${API_ENDPOINTS.AUTH.OAUTH_GOOGLE}`;
    case 'github':
      return `${baseUrl}${API_ENDPOINTS.AUTH.OAUTH_GITHUB}`;
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

/**
 * Get Google OAuth URL
 */
export const getGoogleOAuthUrl = (): string => getOAuthUrl('google');

/**
 * Get GitHub OAuth URL
 */
export const getGithubOAuthUrl = (): string => getOAuthUrl('github');

/**
 * Handle OAuth callback
 * Spring Boot OAuth2 handles the callback automatically and redirects to success handler
 */
export const handleOAuthCallback = async (
  provider: OAuthProvider,
  data: OAuthCallbackRequest
): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${API_ENDPOINTS.AUTH.OAUTH_CALLBACK}/${provider}`, data);
};
