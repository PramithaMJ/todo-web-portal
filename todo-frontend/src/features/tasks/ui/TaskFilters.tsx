/**
 * TaskFilters Component
 * Filter and search controls for tasks
 */

import React from 'react';
import type { TaskStatus } from '../../../entities/task/model/types';
import { Input } from '../../../shared/ui/Input/Input';
import './TaskFilters.css';

export interface TaskFiltersProps {
  status: TaskStatus | 'all';
  search: string;
  onStatusChange: (status: TaskStatus | 'all') => void;
  onSearchChange: (search: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  status,
  search,
  onStatusChange,
  onSearchChange,
}) => {
  return (
    <div className="task-filters">
      <div className="task-filters__tabs">
        <button
          className={`task-filters__tab ${status === 'all' ? 'task-filters__tab--active' : ''}`}
          onClick={() => onStatusChange('all')}
        >
          All Tasks
        </button>
        <button
          className={`task-filters__tab ${status === 'PENDING' ? 'task-filters__tab--active' : ''}`}
          onClick={() => onStatusChange('PENDING')}
        >
          Pending
        </button>
        <button
          className={`task-filters__tab ${status === 'COMPLETED' ? 'task-filters__tab--active' : ''}`}
          onClick={() => onStatusChange('COMPLETED')}
        >
          Completed
        </button>
      </div>

      <div className="task-filters__search">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          fullWidth
        />
      </div>
    </div>
  );
};
