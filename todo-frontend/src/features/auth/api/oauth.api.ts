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
 * Get OAuth authorization URL for Google
 */
export const getGoogleOAuthUrl = async (): Promise<OAuthUrlResponse> => {
  return apiClient.get<OAuthUrlResponse>(API_ENDPOINTS.AUTH.OAUTH_GOOGLE);
};

/**
 * Get OAuth authorization URL for GitHub
 */
export const getGithubOAuthUrl = async (): Promise<OAuthUrlResponse> => {
  return apiClient.get<OAuthUrlResponse>(API_ENDPOINTS.AUTH.OAUTH_GITHUB);
};

/**
 * Handle OAuth callback
 */
export const handleOAuthCallback = async (
  provider: OAuthProvider,
  data: OAuthCallbackRequest
): Promise<AuthResponse> => {
  return apiClient.post<AuthResponse>(`${API_ENDPOINTS.AUTH.OAUTH_CALLBACK}/${provider}`, data);
};

/**
 * Get OAuth URL by provider
 */
export const getOAuthUrl = async (provider: OAuthProvider): Promise<OAuthUrlResponse> => {
  switch (provider) {
    case 'google':
      return getGoogleOAuthUrl();
    case 'github':
      return getGithubOAuthUrl();
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};
