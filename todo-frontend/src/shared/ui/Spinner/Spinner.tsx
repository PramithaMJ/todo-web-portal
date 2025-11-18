/**
 * Spinner Component
 * Loading spinner with multiple sizes
 */

import React from 'react';
import './Spinner.css';

export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  className = '',
  label = 'Loading...',
}) => {
  const classNames = ['spinner', `spinner--${size}`, className].filter(Boolean).join(' ');

  return (
    <div className="spinner-container" role="status" aria-label={label}>
      <div className={classNames} />
      <span className="spinner-label">{label}</span>
    </div>
  );
};
