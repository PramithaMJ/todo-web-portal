/**
 * Session Entity Types
 * Pure domain types for Session/Authentication
 */

import type { User } from '../../user/model/types';

/**
 * Authentication session interface
 */
export interface Session {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresAt: Date;
}

/**
 * OAuth provider types
 */
export type OAuthProvider = 'google' | 'github';

/**
 * OAuth callback data
 */
export interface OAuthCallbackData {
  code: string;
  state: string;
  provider: OAuthProvider;
}

/**
 * Authentication response from API
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}
