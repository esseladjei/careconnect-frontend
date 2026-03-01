import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

/**
 * Hook to fetch all available specialties from the database.
 * Caches results for 1 hour.
 */
export const useSpecialties = () => {
  return useQuery({
    queryKey: ['specialties'],
    queryFn: async () => {
      const response = await axiosClient.get('/providers/specialties');
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (data?.data && Array.isArray(data.data)) {
        return data.data;
      }

      if (data?.specialties && Array.isArray(data.specialties)) {
        return data.specialties;
      }

      console.warn('Unexpected specialties response structure:', data);
      return [];
    },
  });
};
