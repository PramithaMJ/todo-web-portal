/**
 * TaskCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskCard } from '../TaskCard';
import type { Task } from '../../../../entities/task/model/types';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'PENDING',
  createdAt: new Date('2025-11-18T10:00:00Z'),
  updatedAt: new Date('2025-11-18T10:00:00Z'),
  completedAt: null,
  userId: 'user-1',
};

describe('TaskCard', () => {
  it('should render task information', () => {
    const onComplete = vi.fn();
    const onUncomplete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call onComplete when Done button clicked', async () => {
    const onComplete = vi.fn();
    const onUncomplete = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onComplete={onComplete}
        onUncomplete={onUncomplete}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onComplete).toHaveBeenCalledWith('1');
  });

  it('should show Undo button for completed tasks', () => {
    const completedTask: Task = {
      ...mockTask,
      status: 'COMPLETED',
      completedAt: new Date(),
    };

    render(
      <TaskCard
        task={completedTask}
        onComplete={vi.fn()}
        onUncomplete={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });
});
