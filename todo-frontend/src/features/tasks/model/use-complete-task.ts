/**
 * useCompleteTask Hook
 * React Query hook for completing/uncompleting tasks
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeTask, uncompleteTask } from '../api/task.api';
import { QUERY_KEYS } from '../../../shared/constants/api';

export const useCompleteTask = () => {
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });

  const uncompleteMutation = useMutation({
    mutationFn: (taskId: string) => uncompleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
    },
  });

  return {
    complete: completeMutation.mutate,
    uncomplete: uncompleteMutation.mutate,
    isCompleting: completeMutation.isPending,
    isUncompleting: uncompleteMutation.isPending,
    error: completeMutation.error || uncompleteMutation.error,
  };
};
