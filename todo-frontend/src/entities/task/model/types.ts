/**
 * Task Entity Types
 * Pure domain types for Task entity
 */

export type TaskId = string;
export type TaskStatus = 'PENDING' | 'COMPLETED';
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Core Task entity interface
 */
export interface Task {
  id: TaskId;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  userId: string;
}

/**
 * Task creation data transfer object
 */
export interface CreateTaskDTO {
  title: string;
  description: string;
}

/**
 * Task update data transfer object
 */
export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/**
 * Task filter options
 */
export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
}
