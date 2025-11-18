/**
 * Task API Schemas
 * Zod schemas for task validation
 */

import { z } from 'zod';

/**
 * Task priority schema
 */
export const taskPrioritySchema = z.enum(['low', 'medium', 'high']);

/**
 * Task status schema - matches backend enum (uppercase)
 */
export const taskStatusSchema = z.enum(['PENDING', 'COMPLETED']);

/**
 * Task schema
 */
export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long'),
  status: taskStatusSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  userId: z.string(),
});

/**
 * Create task schema
 */
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').default(''),
  priority: taskPrioritySchema.default('medium'),
});

/**
 * Update task schema
 */
export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
  description: z.string().max(2000, 'Description is too long').optional(),
  priority: taskPrioritySchema.optional(),
  status: taskStatusSchema.optional(),
});

/**
 * Task filters schema
 */
export const taskFiltersSchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  search: z.string().optional(),
});

// Export types
export type TaskSchema = z.infer<typeof taskSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type TaskFiltersSchema = z.infer<typeof taskFiltersSchema>;
