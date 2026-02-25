import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '../api/analyticsApi';

/**
 * Hook to fetch provider booking statistics
 */
export const useProviderBookings = (providerId?: string) => {
  return useQuery({
    queryKey: ['providerBookings', providerId],
    queryFn: () => analyticsApi.getProviderBookings(providerId),
  });
};

/**
 * Hook to fetch provider bookings chart data
 */
export const useProviderBookingsChart = () => {
  return useQuery({
    queryKey: ['providerBookingsChart'],
    queryFn: () => analyticsApi.getProviderBookingsChart(),
  });
};

/**
 * Hook to fetch confirmation rate data
 */
export const useConfirmationRate = (providerId?: string) => {
  return useQuery({
    queryKey: ['confirmationRate', providerId],
    queryFn: () => analyticsApi.getProviderConfirmationRate(providerId),
  });
};

/**
 * Hook to fetch cancellation rate data
 */
export const useCancellationRate = (providerId?: string) => {
  return useQuery({
    queryKey: ['cancellationRate', providerId],
    queryFn: () => analyticsApi.getProviderCancellationRate(providerId),
  });
};

/**
 * Hook to fetch monthly booking trends chart
 */
export const useMonthlyBookingTrendChart = (providerId?: string) => {
  return useQuery({
    queryKey: ['monthlyBookingTrendChart', providerId],
    queryFn: () => analyticsApi.getMonthlyBookingTrendChart(providerId),
  });
};

/**
 * Hook to fetch monthly availability chart
 */
export const useMonthlyAvailabilityChart = (providerId?: string) => {
  return useQuery({
    queryKey: ['monthlyAvailabilityChart', providerId],
    queryFn: () => analyticsApi.getMonthlyAvailabilityChart(providerId),
  });
};

/**
 * Hook to fetch yearly booking comparison chart
 */
export const useYearlyBookingChart = () => {
  return useQuery({
    queryKey: ['yearlyBookingChart'],
    queryFn: () => analyticsApi.getYearlyBookingChart(),
  });
};

/**
 * Hook to fetch patient bookings chart
 */
export const usePatientBookingsChart = () => {
  return useQuery({
    queryKey: ['patientBookingsChart'],
    queryFn: () => analyticsApi.getPatientBookingsChart(),
  });
};

/**
 * Hook to fetch patient booking statistics
 */
export const usePatientBookings = (patientId?: string) => {
  return useQuery({
    queryKey: ['patientBookings', patientId],
    queryFn: () => analyticsApi.getPatientBookings(patientId),
  });
};

/**
 * Hook to fetch comprehensive provider dashboard
 */
export const useProviderDashboard = (providerId: string) => {
  return useQuery({
    queryKey: ['providerDashboard', providerId],
    queryFn: () => analyticsApi.getProviderDashboard(providerId),
    enabled: !!providerId,
  });
};

/**
 * Hook to fetch all analytics data
 */
export const useAllAnalytics = () => {
  return useQuery({
    queryKey: ['allAnalytics'],
    queryFn: () => analyticsApi.getAllAnalytics(),
  });
};

/**
 * Hook to handle date range filtering
 */
export const useAnalyticsDateRange = (
  startDate?: Date,
  endDate?: Date,
  providerId?: string
) => {
  return useQuery({
    queryKey: ['analyticsDateRange', startDate, endDate, providerId],
    queryFn: () => {
      if (!startDate || !endDate) {
        return Promise.resolve([]);
      }
      return analyticsApi.getAnalyticsForDateRange(
        startDate,
        endDate,
        providerId
      );
    },
    enabled: !!startDate && !!endDate,
  });
};
