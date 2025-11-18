/**
 * App Component
 * Root application component with all providers
 */

import React from 'react';
import { ErrorBoundary } from '../shared/ui/ErrorBoundary/ErrorBoundary';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { RouterProvider } from './providers/RouterProvider';
import './styles/globals.css';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <RouterProvider />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
