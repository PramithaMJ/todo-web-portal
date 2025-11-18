/**
 * LoginButton Component
 * Button for traditional email/password login
 */

import React from 'react';
import { Button } from '../../../shared/ui/Button/Button';

export interface LoginButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      variant="primary"
      size="large"
      fullWidth
    >
      Sign In
    </Button>
  );
};
