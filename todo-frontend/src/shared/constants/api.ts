/**
 * API Constants
 * Centralizes all API endpoints and HTTP configuration
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    OAUTH_GOOGLE: '/auth/oauth/google',
    OAUTH_GITHUB: '/auth/oauth/github',
    OAUTH_CALLBACK: '/auth/oauth/callback',
  },
  // Task endpoints
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id: string) => `/tasks/${id}`,
    COMPLETE: (id: string) => `/tasks/${id}/complete`,
    UNCOMPLETE: (id: string) => `/tasks/${id}/uncomplete`,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const QUERY_KEYS = {
  TASKS: ['tasks'] as const,
  TASK: (id: string) => ['tasks', id] as const,
  AUTH_USER: ['auth', 'user'] as const,
} as const;
