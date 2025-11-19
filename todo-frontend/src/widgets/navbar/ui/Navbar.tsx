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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const isOnTasksPage = location.pathname === '/tasks';
  const currentTab = location.state?.tab || 'dashboard';

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__brand">
          <img src="/logo.png" alt="TODO App" className="navbar__logo-img" />
          <h1 className="navbar__logo">TODO App</h1>
        </div>
        
        {/* Mobile Menu Button */}
        {isAuthenticated && (
          <button 
            className="navbar__mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        )}

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

      {/* Mobile Menu */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className="navbar__mobile-menu">
          {isOnTasksPage && (
            <div className="navbar__mobile-nav">
              <button
                className={`navbar__mobile-nav-button ${currentTab === 'dashboard' ? 'navbar__mobile-nav-button--active' : ''}`}
                onClick={() => {
                  navigate('/tasks', { state: { tab: 'dashboard' } });
                  setIsMobileMenuOpen(false);
                }}
              >
                Dashboard
              </button>
              <button
                className={`navbar__mobile-nav-button ${currentTab === 'all-tasks' ? 'navbar__mobile-nav-button--active' : ''}`}
                onClick={() => {
                  navigate('/tasks', { state: { tab: 'all-tasks' } });
                  setIsMobileMenuOpen(false);
                }}
              >
                All Tasks
              </button>
            </div>
          )}
          {user && (
            <div className="navbar__mobile-user">
              <span className="navbar__mobile-user-name">Hi, {user.name}</span>
              <Button 
                variant="ghost" 
                size="small" 
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                fullWidth
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
