/**
 * Analytics Types and Interfaces
 */

// Provider Analytics Types
export interface ProviderBooking {
  providerId: string;
  providerName: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
}

export interface ProviderConfirmationRate {
  providerId: string;
  providerName: string;
  confirmationRate: number;
  totalBookings: number;
  confirmedBookings: number;
}

export interface ProviderCancellationRate {
  providerId: string;
  providerName: string;
  cancellationRate: number;
  totalBookings: number;
  cancelledBookings: number;
}

export interface MonthlyBookingData {
  month: string;
  bookings: number;
  completed: number;
  cancelled: number;
  pending: number;
}

export interface ProviderMonthlyData {
  providerId: string;
  providerName: string;
  data: MonthlyBookingData[];
}

export interface OccupancyData {
  month: string;
  occupancyRate: number;
  bookedSlots: number;
  totalSlots: number;
}

export interface ProviderOccupancyData {
  providerId: string;
  providerName: string;
  data: OccupancyData[];
}

export interface AvailabilityData {
  month: string;
  availabilityPercentage: number;
  bookedHours: number;
  totalAvailabilityHours: number;
}

export interface ProviderAvailabilityData {
  providerId: string;
  providerName: string;
  data: AvailabilityData[];
}

export interface YearlyBookingData {
  year: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Patient Analytics Types
export interface PatientBooking {
  patientId: string;
  patientName: string;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
}

export interface PatientBookingsResponse {
  success: boolean;
  data: PatientBooking[];
}

export interface ProviderBookingsResponse {
  success: boolean;
  data: ProviderBooking[];
}

export interface ChartResponse {
  success: boolean;
  data: ChartData;
}

export interface DashboardStats {
  bookingStats: ProviderBooking;
  confirmationRate: number;
  cancellationRate: number;
  monthlyTrendChart: ChartData;
  availabilityChart: ChartData;
}

// Filter Parameters
export interface AnalyticsFilterParams {
  startDate?: string;
  endDate?: string;
  providerId?: string;
  patientId?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
