import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  type Appointment,
  type CancelAppointmentParams,
  type ConfirmAppointmentParams,
  type FetchAppointmentsParams,
} from '../types/appointment';

import appointmentsApi from '../api/appointmentsApi.ts';
import toast from 'react-hot-toast';

/**
 * Query keys for appointments
 */
export const appointmentQueryKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentQueryKeys.all, 'list'] as const,
  list: (params: FetchAppointmentsParams) =>
    [...appointmentQueryKeys.lists(), params] as const,
  details: () => [...appointmentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentQueryKeys.details(), id] as const,
};

/**
 * Hook to fetch user appointments
 * @param params - Filter parameters for appointments
 * @returns Query result with appointments data
 */
export const useFetchAppointments = (
  params: FetchAppointmentsParams
): UseQueryResult<Appointment[], Error> => {
  return useQuery({
    queryKey: appointmentQueryKeys.list(params),
    queryFn: () => appointmentsApi.fetchUserAppointments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Hook to confirm an appointment
 * @returns Mutation result for confirming appointments
 */
export const useConfirmAppointment = (): UseMutationResult<
  Appointment,
  Error,
  ConfirmAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ConfirmAppointmentParams) =>
      appointmentsApi.confirmAppointment(params),
    onSuccess: async (data) => {
      // Invalidate all appointment queries to refetch
      await queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.all,
      });

      toast.success(`Appointment confirmed successfully! ${data.status}`);
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to confirm appointment: ${error.message || 'Unknown error'}`
      );
    },
  });
};

/**
 * Hook to cancel an appointment
 * @returns Mutation result for canceling appointments
 */
export const useCancelAppointment = (): UseMutationResult<
  Appointment,
  Error,
  CancelAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CancelAppointmentParams) =>
      appointmentsApi.cancelAppointment(params),
    onSuccess: async (data) => {
      // Invalidate all appointment queries to refetch
      await queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.all,
      });
      toast.success(`Appointment cancelled successfully!${data.status}`);
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to cancel appointment: ${error.message || 'Unknown error'}`
      );
    },
  });
};
