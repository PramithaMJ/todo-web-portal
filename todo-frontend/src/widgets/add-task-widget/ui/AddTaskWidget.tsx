/**
 * AddTaskWidget
 * Widget for adding new tasks
 */

import React from 'react';
import { TaskForm } from '../../../features/tasks/ui/TaskForm';
import { useCreateTask } from '../../../features/tasks/model/use-create-task';
import type { CreateTaskDTO } from '../../../entities/task/model/types';

export const AddTaskWidget: React.FC = () => {
  const createTask = useCreateTask();

  const handleSubmit = (data: CreateTaskDTO) => {
    createTask.mutate(data);
  };

  return <TaskForm onSubmit={handleSubmit} isLoading={createTask.isPending} />;
};
