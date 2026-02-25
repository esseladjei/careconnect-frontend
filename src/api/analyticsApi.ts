import axiosClient from './axiosClient';
import type {
  AnalyticsFilterParams,
  ApiResponse,
  ChartData,
  DashboardStats,
  PatientBooking,
  ProviderAvailabilityData,
  ProviderBooking,
  ProviderCancellationRate,
  ProviderConfirmationRate,
  ProviderMonthlyData,
  ProviderOccupancyData,
} from '../types/analytics';

/**
 * Provider Analytics API Service
 */

/**
 * Get bookings data for all providers
 */
export const getProviderBookings = async (
  providerId?: string
): Promise<ProviderBooking[]> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<ApiResponse<ProviderBooking[]>>(
      '/analytics/provider/bookings',
      { params }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching provider bookings:', error);
    throw error;
  }
};

/**
 * Get bookings chart data for all providers
 */
export const getProviderBookingsChart = async (): Promise<ChartData> => {
  try {
    const response = await axiosClient.get<ApiResponse<ChartData>>(
      '/analytics/provider/bookings/chart'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching provider bookings chart:', error);
    throw error;
  }
};

/**
 * Get confirmation rate for providers
 */
export const getProviderConfirmationRate = async (
  providerId?: string
): Promise<ProviderConfirmationRate[]> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<
      ApiResponse<ProviderConfirmationRate[]>
    >('/analytics/provider/confirmation-rate', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching confirmation rate:', error);
    throw error;
  }
};

/**
 * Get cancellation rate for providers
 */
export const getProviderCancellationRate = async (
  providerId?: string
): Promise<ProviderCancellationRate[]> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<
      ApiResponse<ProviderCancellationRate[]>
    >('/analytics/provider/cancellation-rate', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching cancellation rate:', error);
    throw error;
  }
};

/**
 * Get monthly booking trends chart
 */
export const getMonthlyBookingTrendChart = async (
  providerId?: string
): Promise<ChartData> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<ApiResponse<ChartData>>(
      '/analytics/provider/monthly-booking-rate/chart',
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching monthly booking trends:', error);
    throw error;
  }
};

/**
 * Get monthly booking rate data
 */
export const getMonthlyBookingRate = async (
  providerId?: string
): Promise<ProviderMonthlyData[]> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<ApiResponse<ProviderMonthlyData[]>>(
      '/analytics/provider/monthly-booking-rate',
      { params }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching monthly booking rate:', error);
    throw error;
  }
};

/**
 * Get occupancy/unbooked slots data
 */
export const getOccupancyRate = async (
  providerId?: string
): Promise<ProviderOccupancyData[]> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<
      ApiResponse<ProviderOccupancyData[]>
    >('/analytics/provider/unbooked-slots', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching occupancy rate:', error);
    throw error;
  }
};

/**
 * Get monthly availability chart
 */
export const getMonthlyAvailabilityChart = async (
  providerId?: string
): Promise<ChartData> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<ApiResponse<ChartData>>(
      '/analytics/provider/monthly-availability/chart',
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching monthly availability chart:', error);
    throw error;
  }
};

/**
 * Get monthly availability data
 */
export const getMonthlyAvailability = async (
  providerId?: string
): Promise<ProviderAvailabilityData[]> => {
  try {
    const params = providerId ? { providerId } : {};
    const response = await axiosClient.get<
      ApiResponse<ProviderAvailabilityData[]>
    >('/analytics/provider/monthly-availability', { params });
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching monthly availability:', error);
    throw error;
  }
};

/**
 * Get yearly booking comparison chart
 */
export const getYearlyBookingChart = async (): Promise<ChartData> => {
  try {
    const response = await axiosClient.get<ApiResponse<ChartData>>(
      '/analytics/provider/yearly-booking-rate/chart'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching yearly booking chart:', error);
    throw error;
  }
};

/**
 * Get analytics for a date range
 */
export const getAnalyticsForDateRange = async (
  startDate: Date,
  endDate: Date,
  providerId?: string
): Promise<ProviderBooking[]> => {
  try {
    const params: AnalyticsFilterParams = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      providerId,
    };
    const response = await axiosClient.get<ApiResponse<ProviderBooking[]>>(
      '/analytics/provider/bookings',
      { params }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching analytics for date range:', error);
    throw error;
  }
};

/**
 * Get comprehensive provider dashboard data
 */
export const getProviderDashboard = async (
  providerId: string
): Promise<DashboardStats> => {
  try {
    const [
      bookings,
      confirmationRate,
      cancellationRate,
      monthlyTrend,
      availability,
    ] = await Promise.all([
      getProviderBookings(providerId),
      getProviderConfirmationRate(providerId),
      getProviderCancellationRate(providerId),
      getMonthlyBookingTrendChart(providerId),
      getMonthlyAvailabilityChart(providerId),
    ]);

    return {
      bookingStats: bookings[0] ?? {
        providerId: '',
        providerName: '',
        totalBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        pendingBookings: 0,
      },
      confirmationRate: confirmationRate[0]?.confirmationRate || 0,
      cancellationRate: cancellationRate[0]?.cancellationRate || 0,
      monthlyTrendChart: monthlyTrend,
      availabilityChart: availability,
    };
  } catch (error) {
    console.error('Error building provider dashboard:', error);
    throw error;
  }
};

/**
 * Patient Analytics API Service
 */

/**
 * Get patient bookings chart data
 */
export const getPatientBookingsChart = async (): Promise<ChartData> => {
  try {
    const response = await axiosClient.get<ApiResponse<ChartData>>(
      '/analytics/patient/bookings/chart'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching patient bookings chart:', error);
    throw error;
  }
};

/**
 * Get patient booking statistics
 */
export const getPatientBookings = async (
  patientId?: string
): Promise<PatientBooking[]> => {
  try {
    const params = patientId ? { patientId } : {};
    const response = await axiosClient.get<ApiResponse<PatientBooking[]>>(
      '/analytics/patient/bookings',
      { params }
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching patient bookings:', error);
    throw error;
  }
};

/**
 * Get all analytics data
 */
export const getAllAnalytics = async () => {
  try {
    const [
      providerBookings,
      patientBookings,
      confirmationRates,
      cancellationRates,
    ] = await Promise.all([
      getProviderBookingsChart(),
      getPatientBookingsChart(),
      getProviderConfirmationRate(),
      getProviderCancellationRate(),
    ]);

    return {
      providerBookings,
      patientBookings,
      confirmationRates,
      cancellationRates,
    };
  } catch (error) {
    console.error('Error fetching all analytics:', error);
    throw error;
  }
};
