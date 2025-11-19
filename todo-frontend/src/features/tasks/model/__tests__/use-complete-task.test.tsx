/**
 * useCompleteTask Hook Unit Tests
 * Tests for task completion hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCompleteTask } from '../use-complete-task';
import * as taskApi from '../../api/task.api';
import type { Task } from '../../../../entities/task/model/types';
import React from 'react';

// Mock task API
vi.mock('../../api/task.api');

describe('useCompleteTask', () => {
  let queryClient: QueryClient;

  const mockTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: 'PENDING',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    userId: 'user-123',
  };

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

  describe('complete', () => {
    it('should complete a task successfully', async () => {
      const completedTask = { ...mockTask, status: 'COMPLETED' as const };
      vi.mocked(taskApi.completeTask).mockResolvedValueOnce(completedTask);

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.complete(mockTask.id);

      await waitFor(() => {
        expect(result.current.isCompleting).toBe(false);
      });

      expect(taskApi.completeTask).toHaveBeenCalledWith(mockTask.id);
    });

    it('should handle completion errors', async () => {
      const error = new Error('Completion failed');
      vi.mocked(taskApi.completeTask).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.complete(mockTask.id);

      await waitFor(() => {
        expect(result.current.error).toEqual(error);
      });
    });

    it('should set loading state during completion', async () => {
      const completedTask = { ...mockTask, status: 'COMPLETED' as const };
      vi.mocked(taskApi.completeTask).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(completedTask), 100))
      );

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.complete(mockTask.id);

      await waitFor(() => {
        expect(result.current.isCompleting).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isCompleting).toBe(false);
      });
    });

    it('should invalidate tasks query on success', async () => {
      const completedTask = { ...mockTask, status: 'COMPLETED' as const };
      vi.mocked(taskApi.completeTask).mockResolvedValueOnce(completedTask);

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.complete(mockTask.id);

      await waitFor(() => {
        expect(result.current.isCompleting).toBe(false);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });
  });

  describe('uncomplete', () => {
    it('should uncomplete a task successfully', async () => {
      const uncompletedTask = { ...mockTask, status: 'PENDING' as const };
      vi.mocked(taskApi.uncompleteTask).mockResolvedValueOnce(uncompletedTask);

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.uncomplete(mockTask.id);

      await waitFor(() => {
        expect(result.current.isUncompleting).toBe(false);
      });

      expect(taskApi.uncompleteTask).toHaveBeenCalledWith(mockTask.id);
    });

    it('should handle uncompletion errors', async () => {
      const error = new Error('Uncompletion failed');
      vi.mocked(taskApi.uncompleteTask).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.uncomplete(mockTask.id);

      await waitFor(() => {
        expect(result.current.error).toEqual(error);
      });
    });

    it('should set loading state during uncompletion', async () => {
      const uncompletedTask = { ...mockTask, status: 'PENDING' as const };
      vi.mocked(taskApi.uncompleteTask).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(uncompletedTask), 100))
      );

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.uncomplete(mockTask.id);

      await waitFor(() => {
        expect(result.current.isUncompleting).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isUncompleting).toBe(false);
      });
    });

    it('should invalidate tasks query on success', async () => {
      const uncompletedTask = { ...mockTask, status: 'PENDING' as const };
      vi.mocked(taskApi.uncompleteTask).mockResolvedValueOnce(uncompletedTask);

      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.uncomplete(mockTask.id);

      await waitFor(() => {
        expect(result.current.isUncompleting).toBe(false);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
    });
  });

  describe('error handling', () => {
    it('should expose error from complete mutation', async () => {
      const error = new Error('Complete error');
      vi.mocked(taskApi.completeTask).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.complete(mockTask.id);

      await waitFor(() => {
        expect(result.current.error).toEqual(error);
      });
    });

    it('should expose error from uncomplete mutation', async () => {
      const error = new Error('Uncomplete error');
      vi.mocked(taskApi.uncompleteTask).mockRejectedValueOnce(error);

      const { result } = renderHook(() => useCompleteTask(), { wrapper });

      result.current.uncomplete(mockTask.id);

      await waitFor(() => {
        expect(result.current.error).toEqual(error);
      });
    });
  });
});
