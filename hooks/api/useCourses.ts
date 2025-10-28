import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Course } from '../../types';

const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await api.get('/api/courses/');
  return data;
};

export const useCourses = () => {
  return useQuery<Course[], Error>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
