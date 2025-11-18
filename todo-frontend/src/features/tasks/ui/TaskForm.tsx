/**
 * TaskForm Component
 * Form for creating new tasks
 */

import React, { useState } from 'react';
import type { CreateTaskDTO, TaskPriority } from '../../../entities/task/model/types';
import { Input } from '../../../shared/ui/Input/Input';
import { Button } from '../../../shared/ui/Button/Button';
import { createTaskSchema } from '../api/task.schemas';
import './TaskForm.css';

export interface TaskFormProps {
  onSubmit: (data: CreateTaskDTO) => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = createTaskSchema.parse({
        title,
        description,
        priority,
      });

      onSubmit(validatedData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (error) {
      if (error instanceof Error) {
        const zodError = JSON.parse(error.message);
        const fieldErrors: Record<string, string> = {};
        zodError.forEach((err: { path: string[]; message: string }) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form__title">Add a Task</h2>
      
      <div className="task-form__field">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          error={errors.title}
          fullWidth
          disabled={isLoading}
        />
      </div>

      <div className="task-form__field">
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          error={errors.description}
          fullWidth
          disabled={isLoading}
        />
      </div>

      <div className="task-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="large"
          loading={isLoading}
          disabled={isLoading}
        >
          Add
        </Button>
      </div>
    </form>
  );
};
