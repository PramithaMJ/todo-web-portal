/**
 * AuthProvider
 * Authentication provider wrapper
 */

import React from 'react';

export interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth provider - currently just a wrapper
 * Auth state is managed by Zustand store in features/auth
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <>{children}</>;
};
