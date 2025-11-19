/**
 * Navbar Component
 * Navigation bar with auth controls, theme toggle, and navigation
 */

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/model/useAuth';
import { Button } from '../../../shared/ui/Button/Button';
import { ThemeToggle } from '../../theme-toggle';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isOnTasksPage = location.pathname === '/tasks';
  const currentTab = location.state?.tab || 'dashboard';

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <h1 className="navbar__logo">TaskManager</h1>
        </div>
        <div className="navbar__actions">
          {isAuthenticated && isOnTasksPage && (
            <div className="navbar__nav-buttons">
              <button
                className={`navbar__nav-button ${currentTab === 'dashboard' ? 'navbar__nav-button--active' : ''}`}
                onClick={() => navigate('/tasks', { state: { tab: 'dashboard' } })}
              >
                Dashboard
              </button>
              <button
                className={`navbar__nav-button ${currentTab === 'all-tasks' ? 'navbar__nav-button--active' : ''}`}
                onClick={() => navigate('/tasks', { state: { tab: 'all-tasks' } })}
              >
                All Tasks
              </button>
            </div>
          )}
          <ThemeToggle />
          {isAuthenticated && user && (
            <>
              <span className="navbar__user">Hi, {user.name}</span>
              <Button variant="ghost" size="small" onClick={() => logout()}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
