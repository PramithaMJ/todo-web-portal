/**
 * TaskList Component
 * Displays a list of tasks with filtering and pagination
 */

import React, { useState, useMemo } from 'react';
import type { Task } from '../../../entities/task/model/types';
import { TaskCard } from './TaskCard';
import { Spinner } from '../../../shared/ui/Spinner/Spinner';
import { Button } from '../../../shared/ui/Button/Button';
import './TaskList.css';

export interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onComplete: (taskId: string) => void;
  onUncomplete: (taskId: string) => void;
  completingTaskId?: string;
  statusFilter?: 'all' | 'PENDING' | 'COMPLETED';
  searchQuery?: string;
  maxTasks?: number;
}

const TASKS_PER_PAGE = 5;

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  onComplete,
  onUncomplete,
  completingTaskId,
  statusFilter = 'all',
  searchQuery = '',
  maxTasks,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Sort by creation date (most recent first)
    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tasks, statusFilter, searchQuery]);

  // Apply maxTasks limit if specified (for dashboard view)
  const tasksToDisplay = maxTasks ? filteredTasks.slice(0, maxTasks) : filteredTasks;
  
  // Calculate pagination (only if not using maxTasks)
  const totalPages = maxTasks ? 1 : Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = maxTasks ? 0 : (currentPage - 1) * TASKS_PER_PAGE;
  const endIndex = maxTasks ? maxTasks : startIndex + TASKS_PER_PAGE;
  const currentTasks = maxTasks ? tasksToDisplay : filteredTasks.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds or filters change
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="task-list__loading">
        <Spinner size="large" label="Loading tasks..." />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-message">No tasks yet. Add your first task to get started!</p>
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-message">
          {searchQuery ? `No tasks found matching "${searchQuery}"` : 'No tasks found for this filter'}
        </p>
      </div>
    );
  }

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="task-list-container">
      <div className="task-list">
        {currentTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onUncomplete={onUncomplete}
            isLoading={completingTaskId === task.id}
          />
        ))}
      </div>
      
      {!maxTasks && totalPages > 1 && (
        <div className="task-list__pagination">
          <Button
            variant="ghost"
            size="small"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          
          <span className="task-list__pagination-info">
            Page {currentPage} of {totalPages} ({filteredTasks.length} tasks)
          </span>
          
          <Button
            variant="ghost"
            size="small"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
};
