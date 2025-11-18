/**
 * CallbackPage
 * OAuth callback handler page
 */

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/model/useAuth';
import type { OAuthProvider } from '../../../entities/session/model/types';
import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import './CallbackPage.css';

export const CallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
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
  }, [searchParams, navigate, handleOAuthCallback]);

  return (
    <div className="callback-page">
      <div className="callback-page__content">
        <Spinner size="large" label="Completing sign in..." />
      </div>
    </div>
  );
};
