/**
 * SignUpPage
 * User registration page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../features/auth/model/useAuth';
import { register } from '../../../features/auth/api/auth.api';
import { Button } from '../../../shared/ui/Button/Button';
import { Input } from '../../../shared/ui/Input/Input';
import type { OAuthProvider } from '../../../entities/session/model/types';
import './LoginPage.css';

export const SignUpPage: React.FC = () => {
  const { initiateOAuthLogin, loginAsync } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '', general: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', general: '' };
    let isValid = true;

    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({ name: '', email: '', password: '', confirmPassword: '', general: '' });

    try {
      // Register the user
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Auto-login after successful registration
      await loginAsync({
        email: formData.email,
        password: formData.password,
      });
      // Navigation happens automatically in useAuth
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      setErrors({
        ...errors,
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthClick = async (provider: OAuthProvider) => {
    try {
      setErrors({ name: '', email: '', password: '', confirmPassword: '', general: '' });
      await initiateOAuthLogin(provider);
    } catch {
      setErrors({
        ...errors,
        general: 'Failed to initiate OAuth signup. Please try again.',
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__card">
          <div className="login-page__header">
            <h1 className="login-page__title">Create Account</h1>
            <p className="login-page__subtitle">Sign up to get started</p>
          </div>

          {errors.general && (
            <div className="login-page__error">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="login-page__form">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              disabled={isLoading}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              disabled={isLoading}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              disabled={isLoading}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
              disabled={isLoading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </form>

          <div className="login-page__divider">
            <span>or</span>
          </div>

          <div className="login-page__oauth">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleOAuthClick('google')}
              disabled={isLoading}
            >
              <svg className="login-page__oauth-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleOAuthClick('github')}
              disabled={isLoading}
            >
              <svg className="login-page__oauth-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              Continue with GitHub
            </Button>
          </div>

          <div className="login-page__footer">
            <p className="login-page__footer-text">
              Already have an account?{' '}
              <Link to="/login" className="login-page__link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
