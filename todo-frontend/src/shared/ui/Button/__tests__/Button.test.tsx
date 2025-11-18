/**
 * Button Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply variant classes', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');
  });

  it('should apply size classes', () => {
    render(<Button size="large">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--large');
  });

  it('should apply fullWidth class', () => {
    render(<Button fullWidth>Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--full-width');
  });

  it('should render loading spinner when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--loading');
  });

  it('should render left icon', () => {
    render(<Button leftIcon={<span data-testid="left-icon">←</span>}>Click me</Button>);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('should render right icon', () => {
    render(<Button rightIcon={<span data-testid="right-icon">→</span>}>Click me</Button>);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});
