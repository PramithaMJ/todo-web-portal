/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './authStore';
import * as authApi from '../api/auth.api';
import * as oauthApi from '../api/oauth.api';
import type { OAuthProvider } from '../../../entities/session/model/types';
import { QUERY_KEYS } from '../../../shared/constants/api';
import { SESSION_KEYS } from '../../../shared/constants/storage';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    user,
    isAuthenticated,
    isLoading,
    setSession,
    clearSession,
    setLoading,
  } = useAuthStore();

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
        expiresAt: new Date(Date.now() + response.expiresIn * 1000),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
      navigate('/tasks');
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      // Clear session even on error
      clearSession();
      queryClient.clear();
      navigate('/login');
    },
  });

  /**
   * OAuth login - redirect to backend OAuth endpoint
   */
  const initiateOAuthLogin = useCallback(async (provider: OAuthProvider) => {
    try {
      setLoading(true);
      
      // Redirect to backend OAuth endpoint
      // Backend will redirect to Spring Security's OAuth2 authorization flow
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
      window.location.href = `${baseUrl}/auth/oauth2/${provider}`;
    } catch (error) {
      console.error('OAuth initiation failed:', error);
      setLoading(false);
      throw error;
    }
  }, [setLoading]);

  /**
   * Handle OAuth callback
   */
  const handleOAuthCallback = useCallback(
    async (provider: OAuthProvider, code: string, state: string) => {
      try {
        setLoading(true);
        
        // Verify state
        const storedState = sessionStorage.getItem(SESSION_KEYS.OAUTH_STATE);
        if (storedState !== state) {
          throw new Error('Invalid OAuth state');
        }

        const response = await oauthApi.handleOAuthCallback(provider, { code, state });

        setSession({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
          expiresAt: new Date(Date.now() + response.expiresIn * 1000),
        });

        // Clean up session storage
        sessionStorage.removeItem(SESSION_KEYS.OAUTH_STATE);
        const redirectUrl = sessionStorage.getItem(SESSION_KEYS.REDIRECT_URL) || '/tasks';
        sessionStorage.removeItem(SESSION_KEYS.REDIRECT_URL);

        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
        navigate(redirectUrl);
      } catch (error) {
        console.error('OAuth callback failed:', error);
        setLoading(false);
        navigate('/login?error=oauth_failed');
        throw error;
      }
    },
    [setSession, setLoading, queryClient, navigate]
  );

  /**
   * Get current user query
   */
  const { data: currentUser } = useQuery({
    queryKey: QUERY_KEYS.AUTH_USER,
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: currentUser || user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    initiateOAuthLogin,
    handleOAuthCallback,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
};
