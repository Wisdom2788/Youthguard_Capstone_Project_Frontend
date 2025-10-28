import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Task } from '../../types';

const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await api.get('/api/earn/tasks/');
  return data;
};

export const useTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};