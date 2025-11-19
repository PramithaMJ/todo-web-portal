/**
 * API Interceptors
 * Request and response interceptors for authentication and error handling
 */

import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { STORAGE_KEYS } from '../../constants/storage';
import { API_ENDPOINTS } from '../../constants/api';
import { createApiError, NetworkError } from './errors';

/**
 * Adds authentication token to request headers
 */
export const authRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

/**
 * Handles request errors
 */
export const requestErrorInterceptor = (_error: AxiosError) => {
  return Promise.reject(new NetworkError('Request failed to send'));
};

/**
 * Handles successful responses
 */
export const responseSuccessInterceptor = (response: AxiosResponse) => {
  return response;
};

/**
 * Handles response errors and attempts token refresh
 */
export const responseErrorInterceptor = (axiosInstance: AxiosInstance) => {
  return async (error: AxiosError<{ message?: string; details?: unknown }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Network error
    if (!error.response) {
      return Promise.reject(new NetworkError('Network error occurred'));
    }

    const { status, data } = error.response;

    // Handle 401 Unauthorized - attempt token refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Attempt to refresh token
        const response = await axiosInstance.post<{ accessToken: string; refreshToken: string }>(
          API_ENDPOINTS.AUTH.REFRESH,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear auth state
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(createApiError(401, 'Session expired, please login again'));
      }
    }

    // Handle other errors
    const message = data?.message || error.message || 'An error occurred';
    return Promise.reject(createApiError(status, message, data?.details));
  };
};

/**
 * Sets up all interceptors for an axios instance
 */
export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  // Request interceptors
  axiosInstance.interceptors.request.use(
    authRequestInterceptor,
    requestErrorInterceptor
  );

  // Response interceptors
  axiosInstance.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor(axiosInstance)
  );
};
