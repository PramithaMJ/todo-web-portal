/**
 * Storage Constants
 * Defines all localStorage and sessionStorage keys
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
} as const;

export const SESSION_KEYS = {
  OAUTH_STATE: 'oauth_state',
  REDIRECT_URL: 'redirect_url',
} as const;
