/**
 * Card Component
 * Reusable container with elevation and padding
 */

import React from 'react';
import './Card.css';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevation = 'low',
  padding = 'medium',
  onClick,
}) => {
  const classNames = [
    'card',
    `card--elevation-${elevation}`,
    `card--padding-${padding}`,
    onClick && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`card__header ${className}`}>{children}</div>;
};

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return <div className={`card__body ${className}`}>{children}</div>;
};

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return <div className={`card__footer ${className}`}>{children}</div>;
};
