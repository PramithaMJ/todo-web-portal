/**
 * RouterProvider
 * Application routing configuration
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../../pages/home/ui/HomePage';
import { LoginPage } from '../../pages/auth/ui/LoginPage';
import { SignUpPage } from '../../pages/auth/ui/SignUpPage';
import { CallbackPage } from '../../pages/auth/ui/CallbackPage';
import { TasksPage } from '../../pages/tasks/ui/TasksPage';
import { Navbar } from '../../widgets/navbar/ui/Navbar';
import { useAuthStore } from '../../features/auth/model/authStore';

/**
 * Protected Route Component
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Layout with Navbar
 */
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export const RouterProvider: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth/callback" element={<CallbackPage />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Layout>
                <TasksPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
