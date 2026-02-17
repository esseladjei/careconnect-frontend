import { useQuery } from '@tanstack/react-query';
import axiosClient from '../api/axiosClient';

/**
 * Hook to fetch all available locations from the database
 * Caches results for 1 hour
 */
export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await axiosClient.get('/providers/locations');
      // Handle different response structures
      const data = response.data;

      // If response is already an array
      if (Array.isArray(data)) {
        return data;
      }

      // If response is wrapped in an object with 'data' property
      if (data?.data && Array.isArray(data.data)) {
        return data.data;
      }

      // If response is wrapped in an object with 'locations' property
      if (data?.locations && Array.isArray(data.locations)) {
        return data.locations;
      }

      // Fallback
      console.warn('Unexpected locations response structure:', data);
      return [];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Filter locations based on search input
 */
export const filterLocations = (
  locations: string[] | undefined,
  searchInput: string
): string[] => {
  // Defensive check: ensure locations is an array
  if (!Array.isArray(locations)) {
    console.warn('filterLocations received non-array:', locations);
    return [];
  }

  if (!searchInput) {
    return locations;
  }

  return locations.filter((loc) =>
    loc.toLowerCase().includes(searchInput.toLowerCase())
  );
};
