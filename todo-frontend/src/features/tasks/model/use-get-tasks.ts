/**
 * useGetTasks Hook
 * React Query hook for fetching tasks
 */

import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api/task.api';
import type { TaskFilters } from '../../../entities/task/model/types';
import { QUERY_KEYS } from '../../../shared/constants/api';

export const useGetTasks = (filters?: TaskFilters) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TASKS, filters],
    queryFn: () => getTasks(filters),
    staleTime: 30 * 1000, // 30 seconds
  });
};
