import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { updateTimezone } from '../api/timezoneApi';
import { setTimezone } from '../api/axiosClient';

interface UseUpdateTimezoneOptions {
  onSuccess?: (timezone: string) => void;
  onError?: (error: any) => void;
  autoReload?: boolean;
}

/**
 * Custom hook for updating user's timezone
 * @param userId - The user's ID
 * @param options - Optional callbacks and configuration
 * @returns TanStack Query mutation object
 */
export const useUpdateTimezone = (
  userId: string,
  options?: UseUpdateTimezoneOptions
): UseMutationResult<{ timezone: string }, any, string, unknown> => {
  return useMutation({
    mutationFn: async (timezone: string) => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return updateTimezone(userId, timezone);
    },
    onMutate: () => {
      return toast.loading('Saving timezone…');
    },
    onSuccess: (_, timezone, toastId) => {
      toast.success('Timezone updated successfully!', { id: toastId });
      // Update localStorage for immediate effect across the app
      setTimezone(timezone);

      // Call custom onSuccess callback if provided
      options?.onSuccess?.(timezone);

      // Auto-reload if enabled (default: false for profile page)
      const shouldReload = options?.autoReload === true;
      if (shouldReload) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    onError: (err: any, __, toastId) => {
      toast.error(err.response?.data?.message || 'Failed to update timezone', {
        id: toastId,
      });

      // Call custom onError callback if provided
      options?.onError?.(err);
    },
  });
};
