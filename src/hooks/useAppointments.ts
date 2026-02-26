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
  type CheckInAppointmentParams,
  type CheckOutAppointmentParams,
  type ConfirmAppointmentParams,
  type FetchAppointmentsParams,
  type IGetAppointmentParams,
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
 * Hook to fetch user appointment by Appointment ID
 * @param params - AppointmentId Filter parameter for appointments
 * @returns Query result with appointment data
 */
export const useGetAppointment = (
  params: IGetAppointmentParams
): UseQueryResult<Appointment, Error> => {
  return useQuery({
    queryKey: appointmentQueryKeys.detail(params.appointmentId),
    queryFn: () => appointmentsApi.fetchUserAppointment(params),
    enabled: Boolean(params.appointmentId),
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

/**
 * Hook to check in an appointment
 * @returns Mutation result for checking in appointments
 */
export const useCheckInAppointment = (): UseMutationResult<
  Appointment,
  Error,
  CheckInAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CheckInAppointmentParams) =>
      appointmentsApi.checkInAppointment(params),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.all,
      });
      toast.success(`Appointment checked in successfully! ${data.status}`);
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to check in appointment: ${error.message || 'Unknown error'}`
      );
    },
  });
};

/**
 * Hook to check out an appointment
 * @returns Mutation result for checking out appointments
 */
export const useCheckOutAppointment = (): UseMutationResult<
  Appointment,
  Error,
  CheckOutAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CheckOutAppointmentParams) =>
      appointmentsApi.checkOutAppointment(params),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: appointmentQueryKeys.all,
      });
      toast.success(`Appointment checked out successfully! ${data.status}`);
    },
    onError: (error: Error) => {
      toast.error(
        `Failed to check out appointment: ${error.message || 'Unknown error'}`
      );
    },
  });
};
