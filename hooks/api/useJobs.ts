
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Job } from '../../types';

const fetchJobs = async (): Promise<Job[]> => {
  const { data } = await api.get('/api/jobs/');
  return data;
};

export const useJobs = () => {
  return useQuery<Job[], Error>({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
