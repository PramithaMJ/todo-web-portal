/**
 * API Error Classes
 * Custom error hierarchy for better error handling
 */

export class ApiError extends Error {
  public message: string;
  public statusCode?: number;
  public code?: string;
  public details?: unknown;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred') {
    super(message, undefined, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed', statusCode: number = 401) {
    super(message, statusCode, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Access forbidden', statusCode: number = 403) {
    super(message, statusCode, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation failed', details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error', statusCode: number = 500) {
    super(message, statusCode, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

/**
 * Maps HTTP status codes to appropriate error classes
 */
export const createApiError = (
  statusCode: number,
  message: string,
  details?: unknown
): ApiError => {
  switch (statusCode) {
    case 401:
      return new AuthenticationError(message, statusCode);
    case 403:
      return new AuthorizationError(message, statusCode);
    case 404:
      return new NotFoundError(message);
    case 400:
      return new ValidationError(message, details);
    case 500:
    case 502:
    case 503:
      return new ServerError(message, statusCode);
    default:
      return new ApiError(message, statusCode, 'UNKNOWN_ERROR', details);
  }
};
