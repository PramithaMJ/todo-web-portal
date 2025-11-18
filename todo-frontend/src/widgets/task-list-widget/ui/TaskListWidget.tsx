/**
 * TaskListWidget
 * Widget for displaying task list with filters
 */

import React, { useState } from 'react';
import { TaskList } from '../../../features/tasks/ui/TaskList';
import { TaskFilters } from '../../../features/tasks/ui/TaskFilters';
import { useGetTasks } from '../../../features/tasks/model/use-get-tasks';
import { useCompleteTask } from '../../../features/tasks/model/use-complete-task';
import type { TaskStatus } from '../../../entities/task/model/types';
import './TaskListWidget.css';

export interface TaskListWidgetProps {
  showFilters?: boolean;
  maxTasks?: number;
}

export const TaskListWidget: React.FC<TaskListWidgetProps> = ({ 
  showFilters = true,
  maxTasks,
}) => {
  const { data: tasks = [], isLoading } = useGetTasks();
  const { complete, uncomplete } = useCompleteTask();
  const [completingTaskId, setCompletingTaskId] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const handleComplete = (taskId: string) => {
    setCompletingTaskId(taskId);
    complete(taskId, {
      onSettled: () => setCompletingTaskId(undefined),
    });
  };

  const handleUncomplete = (taskId: string) => {
    setCompletingTaskId(taskId);
    uncomplete(taskId, {
      onSettled: () => setCompletingTaskId(undefined),
    });
  };

  return (
    <div className="task-list-widget">
      {showFilters && (
        <TaskFilters
          status={statusFilter}
          search={searchQuery}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
        />
      )}
      <TaskList
        tasks={tasks}
        isLoading={isLoading}
        onComplete={handleComplete}
        onUncomplete={handleUncomplete}
        completingTaskId={completingTaskId}
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        maxTasks={maxTasks}
      />
    </div>
  );
};
