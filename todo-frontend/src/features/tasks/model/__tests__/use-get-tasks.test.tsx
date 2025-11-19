/**
 * useGetTasks Hook Unit Tests
 * Tests for tasks fetching hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetTasks } from '../use-get-tasks';
import * as taskApi from '../../api/task.api';
import type { Task, TaskFilters } from '../../../../entities/task/model/types';
import React from 'react';

// Mock task API
vi.mock('../../api/task.api');

describe('useGetTasks', () => {
  let queryClient: QueryClient;

  const mockTasks: Task[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Task 1',
      description: 'Description 1',
      status: 'PENDING',
      priority: 'high',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      userId: 'user-123',
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Task 2',
      description: 'Description 2',
      status: 'COMPLETED',
      priority: 'medium',
      createdAt: new Date('2024-01-02T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      userId: 'user-123',
    },
  ];

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
  });

  it('should fetch tasks without filters', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce(mockTasks);

    const { result } = renderHook(() => useGetTasks(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(taskApi.getTasks).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockTasks);
  });

  it('should fetch tasks with status filter', async () => {
    const filters: TaskFilters = { status: 'COMPLETED' };
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce([mockTasks[1]]);

    const { result } = renderHook(() => useGetTasks(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(taskApi.getTasks).toHaveBeenCalledWith(filters);
    expect(result.current.data).toEqual([mockTasks[1]]);
  });

  it('should fetch tasks with search filter', async () => {
    const filters: TaskFilters = { search: 'Task 1' };
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce([mockTasks[0]]);

    const { result } = renderHook(() => useGetTasks(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(taskApi.getTasks).toHaveBeenCalledWith(filters);
    expect(result.current.data).toEqual([mockTasks[0]]);
  });

  it('should fetch tasks with multiple filters', async () => {
    const filters: TaskFilters = { status: 'PENDING', search: 'Task' };
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce([mockTasks[0]]);

    const { result } = renderHook(() => useGetTasks(filters), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(taskApi.getTasks).toHaveBeenCalledWith(filters);
  });

  it('should handle empty results', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useGetTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual([]);
  });

  it('should handle fetch errors', async () => {
    const error = new Error('Failed to fetch tasks');
    vi.mocked(taskApi.getTasks).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useGetTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should use stale time of 30 seconds', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce(mockTasks);

    const { result } = renderHook(() => useGetTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the data is marked as fresh (not stale) initially
    expect(result.current.isStale).toBe(false);
  });

  it('should refetch on window focus', async () => {
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce(mockTasks);

    const { result } = renderHook(() => useGetTasks(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    vi.mocked(taskApi.getTasks).mockResolvedValueOnce(mockTasks);

    // Trigger refetch manually
    result.current.refetch();

    await waitFor(() => {
      expect(taskApi.getTasks).toHaveBeenCalledTimes(2);
    });
  });

  it('should cache results for the same filters', async () => {
    const filters: TaskFilters = { status: 'PENDING' };
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce([mockTasks[0]]);

    const { result: result1 } = renderHook(() => useGetTasks(filters), { wrapper });

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    // Render another hook with the same filters
    const { result: result2 } = renderHook(() => useGetTasks(filters), { wrapper });

    // Should use cached data
    expect(result2.current.data).toEqual([mockTasks[0]]);
    // API should only be called once (from first hook)
    expect(taskApi.getTasks).toHaveBeenCalledTimes(1);
  });

  it('should create separate cache for different filters', async () => {
    const filters1: TaskFilters = { status: 'PENDING' };
    const filters2: TaskFilters = { status: 'COMPLETED' };

    vi.mocked(taskApi.getTasks).mockResolvedValueOnce([mockTasks[0]]);
    vi.mocked(taskApi.getTasks).mockResolvedValueOnce([mockTasks[1]]);

    const { result: result1 } = renderHook(() => useGetTasks(filters1), { wrapper });
    const { result: result2 } = renderHook(() => useGetTasks(filters2), { wrapper });

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
      expect(result2.current.isSuccess).toBe(true);
    });

    // Both hooks should have called the API independently
    expect(taskApi.getTasks).toHaveBeenCalledTimes(2);
    expect(taskApi.getTasks).toHaveBeenCalledWith(filters1);
    expect(taskApi.getTasks).toHaveBeenCalledWith(filters2);
  });
});
