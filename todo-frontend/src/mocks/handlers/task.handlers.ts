/**
 * Task Handlers
 * MSW handlers for task API endpoints
 */

import { http, HttpResponse } from 'msw';
import { getTasks, addTask, updateTask, deleteTask } from '../data/tasks';
import type { CreateTaskDTO } from '../../entities/task/model/types';

const API_BASE_URL = 'http://localhost:8080/api';

export const taskHandlers = [
  // Get all tasks
  http.get(`${API_BASE_URL}/tasks`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Get userId from token (in real app, decode JWT)
    // For mock, we'll use a simple mapping
    let userId = 'demo-user';
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        userId = tokenData.userId || 'demo-user';
      } catch {
        // Invalid token, use default
      }
    }
    
    const tasks = getTasks().filter(task => task.userId === userId);
    return HttpResponse.json(tasks);
  }),

  // Get task by ID
  http.get(`${API_BASE_URL}/tasks/:id`, ({ params }) => {
    const tasks = getTasks();
    const task = tasks.find((t) => t.id === params.id);
    
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(task);
  }),

  // Create task
  http.post(`${API_BASE_URL}/tasks`, async ({ request }) => {
    const data = (await request.json()) as CreateTaskDTO;
    
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    // Get userId from token
    let userId = 'demo-user';
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        userId = tokenData.userId || 'demo-user';
      } catch {
        // Invalid token, use default
      }
    }
    
    const newTask = addTask({
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
      userId,
    });
    
    return HttpResponse.json(newTask, { status: 201 });
  }),

  // Update task
  http.patch(`${API_BASE_URL}/tasks/:id`, async ({ params, request }) => {
    const updates = await request.json() as Record<string, unknown>;
    const updated = updateTask(params.id as string, updates);
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Delete task
  http.delete(`${API_BASE_URL}/tasks/:id`, ({ params }) => {
    deleteTask(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  // Complete task
  http.put(`${API_BASE_URL}/tasks/:id/complete`, ({ params }) => {
    const updated = updateTask(params.id as string, {
      status: 'COMPLETED',
      completedAt: new Date(),
    });
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),

  // Reopen task
  http.put(`${API_BASE_URL}/tasks/:id/reopen`, ({ params }) => {
    const updated = updateTask(params.id as string, {
      status: 'PENDING',
      completedAt: null,
    });
    
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updated);
  }),
];
