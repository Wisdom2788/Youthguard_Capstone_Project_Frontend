import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Company } from '../../types';

const fetchCompanies = async (): Promise<Company[]> => {
  const { data } = await api.get('/api/core/companies/');
  return data;
};

export const useCompanies = () => {
  return useQuery<Company[], Error>({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
