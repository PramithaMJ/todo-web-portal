/**
 * useCreateTask Hook
 * React Query hook for creating tasks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api/task.api';
import type { CreateTaskDTO } from '../../../entities/task/model/types';
import { QUERY_KEYS } from '../../../shared/constants/api';

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskDTO) => createTask(data),
    onSuccess: () => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });
};
