/**
 * CallbackPage
 * OAuth callback handler page
 */

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/model/useAuth';
import { useAuthStore } from '../../../features/auth/model/authStore';
import type { OAuthProvider } from '../../../entities/session/model/types';
import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import './CallbackPage.css';

export const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  const { setSession } = useAuthStore();

  useEffect(() => {
    // Check if we have direct tokens (from Spring OAuth2 redirect)
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    
    if (token && refreshToken) {
      // Direct token flow - tokens provided in URL
      try {
        setSession({
          accessToken: token,
          refreshToken: refreshToken,
          user: {} as any, // Will be fetched by useAuth
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });
        navigate('/tasks');
      } catch (error) {
        console.error('Token storage error:', error);
        navigate('/login?error=oauth_failed');
      }
      return;
    }

    // Original OAuth flow with code
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const provider = searchParams.get('provider') as OAuthProvider;
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (!code || !state || !provider) {
      console.error('Missing OAuth parameters');
      navigate('/login?error=invalid_callback');
      return;
    }

    handleOAuthCallback(provider, code, state).catch((err) => {
      console.error('OAuth callback error:', err);
      navigate('/login?error=oauth_failed');
    });
  }, [searchParams, navigate, handleOAuthCallback, setSession]);

  return (
    <div className="callback-page">
      <div className="callback-page__content">
        <Spinner size="large" label="Completing sign in..." />
      </div>
    </div>
  );
};
