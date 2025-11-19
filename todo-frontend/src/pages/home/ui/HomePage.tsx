/**
 * HomePage
 * Landing/home page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/model/useAuth';
import { Button } from '../../../shared/ui/Button/Button';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-page">
      <div className="home-page__container">
        <div className="home-page__buttons">
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button
            variant="secondary"
            size="large"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};
