/**
 * Task API
 * Handles task CRUD operations
 */

import { apiClient } from '../../../shared/api/client/apiClient';
import { API_ENDPOINTS } from '../../../shared/constants/api';
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '../../../entities/task/model/types';
import { taskSchema, createTaskSchema, updateTaskSchema } from './task.schemas';

/**
 * Paginated response from backend
 */
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Get all tasks for current user
 */
export const getTasks = async (filters?: TaskFilters): Promise<Task[]> => {
  const params = new URLSearchParams();
  
  if (filters?.status) {
    params.append('status', filters.status);
  }
  if (filters?.search) {
    params.append('search', filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `${API_ENDPOINTS.TASKS.BASE}?${queryString}` : API_ENDPOINTS.TASKS.BASE;

  const response = await apiClient.get<PageResponse<Task>>(url);
  
  // Extract content from paginated response
  const tasks = response.content || [];
  
  // Validate response with Zod
  return tasks.map(task => taskSchema.parse(task));
};

/**
 * Get task by ID
 */
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(API_ENDPOINTS.TASKS.BY_ID(id));
  return taskSchema.parse(response);
};

/**
 * Create new task
 */
export const createTask = async (data: CreateTaskDTO): Promise<Task> => {
  // Validate input
  const validatedData = createTaskSchema.parse(data);
  
  const response = await apiClient.post<Task>(API_ENDPOINTS.TASKS.BASE, validatedData);
  return taskSchema.parse(response);
};

/**
 * Update existing task
 */
export const updateTask = async (id: string, data: UpdateTaskDTO): Promise<Task> => {
  // Validate input
  const validatedData = updateTaskSchema.parse(data);
  
  const response = await apiClient.patch<Task>(API_ENDPOINTS.TASKS.BY_ID(id), validatedData);
  return taskSchema.parse(response);
};

/**
 * Delete task
 */
export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete<void>(API_ENDPOINTS.TASKS.BY_ID(id));
};

/**
 * Mark task as completed
 */
export const completeTask = async (id: string): Promise<Task> => {
  const response = await apiClient.put<Task>(API_ENDPOINTS.TASKS.COMPLETE(id));
  return taskSchema.parse(response);
};

/**
 * Mark task as uncompleted (reopen)
 */
export const uncompleteTask = async (id: string): Promise<Task> => {
  const response = await apiClient.put<Task>(API_ENDPOINTS.TASKS.REOPEN(id));
  return taskSchema.parse(response);
};
