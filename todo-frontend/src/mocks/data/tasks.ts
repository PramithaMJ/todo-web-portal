/**
 * Mock Task Data
 * Realistic task data for MSW handlers
 */

import type { Task } from '../../entities/task/model/types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Buy books',
    description: 'Buy books for the next school year',
    status: 'PENDING',
    createdAt: new Date('2025-11-15T10:00:00Z'),
    updatedAt: new Date('2025-11-15T10:00:00Z'),
    completedAt: null,
    userId: 'demo-user',
  },
  {
    id: '2',
    title: 'Clean home',
    description: 'Need to clean the bed room',
    status: 'PENDING',
    createdAt: new Date('2025-11-16T09:00:00Z'),
    updatedAt: new Date('2025-11-16T09:00:00Z'),
    completedAt: null,
    userId: 'demo-user',
  },
  {
    id: '3',
    title: 'Takehome assignment',
    description: 'Finish the mid-term assignment',
    status: 'PENDING',
    createdAt: new Date('2025-11-17T08:00:00Z'),
    updatedAt: new Date('2025-11-17T08:00:00Z'),
    completedAt: null,
    userId: 'demo-user',
  },
  {
    id: '4',
    title: 'Play Cricket',
    description: 'Plan the soft ball cricket match on next Sunday',
    status: 'PENDING',
    createdAt: new Date('2025-11-17T14:00:00Z'),
    updatedAt: new Date('2025-11-17T14:00:00Z'),
    completedAt: null,
    userId: 'demo-user',
  },
  {
    id: '5',
    title: 'Help Saman',
    description: 'Saman need help with his software project',
    status: 'PENDING',
    createdAt: new Date('2025-11-18T07:00:00Z'),
    updatedAt: new Date('2025-11-18T07:00:00Z'),
    completedAt: null,
    userId: 'demo-user',
  },
  {
    id: '6',
    title: 'Review project code',
    description: 'Review the pull requests for the new feature',
    status: 'PENDING',
    createdAt: new Date('2025-11-18T08:00:00Z'),
    updatedAt: new Date('2025-11-18T08:00:00Z'),
    completedAt: null,
    userId: 'john-user',
  },
  {
    id: '7',
    title: 'Team meeting',
    description: 'Attend the weekly team sync meeting',
    status: 'PENDING',
    createdAt: new Date('2025-11-18T09:00:00Z'),
    updatedAt: new Date('2025-11-18T09:00:00Z'),
    completedAt: null,
    userId: 'john-user',
  },
];

let tasks = [...mockTasks];

export const getTasks = () => tasks;

export const addTask = (task: Task) => {
  tasks.push(task);
  return task;
};

export const updateTask = (id: string, updates: Partial<Task>) => {
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date() };
    return tasks[index];
  }
  return null;
};

export const deleteTask = (id: string) => {
  tasks = tasks.filter((t) => t.id !== id);
};

export const resetTasks = () => {
  tasks = [...mockTasks];
};
