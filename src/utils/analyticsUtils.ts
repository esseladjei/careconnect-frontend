/**
 * Analytics Utility Functions
 * Helper functions for data transformation and analysis
 */

import type { ChartData, MonthlyBookingData } from '../types/analytics';

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  current: number,
  previous: number
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format number with commas
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Format percentage with decimal places
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get trend direction based on change value
 */
export const getTrendDirection = (change: number): 'up' | 'down' | 'stable' => {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'stable';
};

/**
 * Calculate average from array of numbers
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum / numbers.length;
};

/**
 * Extract monthly data from booking data
 */
export const getMonthlyStats = (data: MonthlyBookingData[]) => {
  return {
    months: data.map((d) => d.month),
    completed: data.map((d) => d.completed),
    cancelled: data.map((d) => d.cancelled),
    pending: data.map((d) => d.pending),
    bookings: data.map((d) => d.bookings),
  };
};

/**
 * Create trend comparison between periods
 */
export const comparePeriods = (
  currentPeriod: MonthlyBookingData[],
  previousPeriod: MonthlyBookingData[]
) => {
  const currentTotal = currentPeriod.reduce((sum, d) => sum + d.bookings, 0);
  const previousTotal = previousPeriod.reduce((sum, d) => sum + d.bookings, 0);

  return {
    currentTotal,
    previousTotal,
    change: calculatePercentageChange(currentTotal, previousTotal),
  };
};

/**
 * Get most recent value from array
 */
export const getLatestValue = <T extends { [key: string]: unknown }>(
  data: T[],
  key: string
): unknown => {
  if (data.length === 0) return null;
  return data[data.length - 1][key];
};

/**
 * Calculate moving average
 */
export const calculateMovingAverage = (
  values: number[],
  windowSize: number = 3
): number[] => {
  const result: number[] = [];

  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(values.length, i + Math.ceil(windowSize / 2));
    const window = values.slice(start, end);
    const average = calculateAverage(window);
    result.push(average);
  }

  return result;
};

/**
 * Get performance rating based on metrics
 */
export const getPerformanceRating = (
  confirmationRate: number,
  completionRate: number,
  cancellationRate: number
): 'excellent' | 'good' | 'fair' | 'poor' => {
  const score =
    confirmationRate * 0.4 + completionRate * 0.4 - cancellationRate * 0.2;

  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
};

/**
 * Get rating color for UI display
 */
export const getRatingColor = (
  rating: 'excellent' | 'good' | 'fair' | 'poor'
): string => {
  const colors = {
    excellent: 'text-green-600 bg-green-50',
    good: 'text-blue-600 bg-blue-50',
    fair: 'text-yellow-600 bg-yellow-50',
    poor: 'text-red-600 bg-red-50',
  };
  return colors[rating];
};

/**
 * Aggregate data by date range
 */
export const aggregateByDateRange = (
  data: MonthlyBookingData[],
  startIndex: number,
  endIndex: number
) => {
  const subset = data.slice(startIndex, endIndex + 1);

  return {
    totalBookings: subset.reduce((sum, d) => sum + d.bookings, 0),
    completedBookings: subset.reduce((sum, d) => sum + d.completed, 0),
    cancelledBookings: subset.reduce((sum, d) => sum + d.cancelled, 0),
    pendingBookings: subset.reduce((sum, d) => sum + d.pending, 0),
    avgBookingsPerMonth:
      subset.length > 0
        ? subset.reduce((sum, d) => sum + d.bookings, 0) / subset.length
        : 0,
  };
};

/**
 * Format chart data with colors
 */
export const formatChartData = (
  chartData: ChartData,
  colors?: {
    primary?: string;
    success?: string;
    danger?: string;
    warning?: string;
  }
): ChartData => {
  const defaultColors = {
    primary: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  };

  const finalColors = { ...defaultColors, ...colors };

  return {
    ...chartData,
    datasets: chartData.datasets.map((dataset, index) => ({
      ...dataset,
      borderColor:
        dataset.borderColor ||
        [
          finalColors.primary,
          finalColors.success,
          finalColors.danger,
          finalColors.warning,
        ][index % 4],
      backgroundColor:
        dataset.backgroundColor ||
        [
          'rgba(59, 130, 246, 0.1)',
          'rgba(16, 185, 129, 0.1)',
          'rgba(239, 68, 68, 0.1)',
          'rgba(245, 158, 11, 0.1)',
        ][index % 4],
    })),
  };
};

/**
 * Get insights based on metrics
 */
export const generateInsights = (
  totalBookings: number,
  completedBookings: number,
  cancelledBookings: number,
  confirmationRate: number,
  cancellationRate: number
): string[] => {
  const insights: string[] = [];
  const completionRate =
    totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  // Positive insights
  if (completionRate >= 90) {
    insights.push(
      'Excellent completion rate - keep maintaining this high standard'
    );
  } else if (completionRate >= 80) {
    insights.push('Strong completion rate with room for improvement');
  }

  if (confirmationRate >= 90) {
    insights.push(
      'High confirmation rate indicates good patient/provider communication'
    );
  }

  if (cancellationRate <= 5) {
    insights.push('Very low cancellation rate - excellent reliability');
  }

  // Areas to improve
  if (completionRate < 70) {
    insights.push('Focus on improving appointment completion rates');
  }

  if (cancellationRate > 15) {
    insights.push('Consider strategies to reduce cancellations');
  }

  if (confirmationRate < 70) {
    insights.push('Improve confirmation follow-ups with patients');
  }

  if (totalBookings < 10) {
    insights.push('Build booking volume to gather more meaningful metrics');
  }

  return insights;
};

/**
 * Determine status badge color
 */
export const getStatusColor = (
  status: 'completed' | 'cancelled' | 'pending'
): 'green' | 'red' | 'yellow' => {
  const colors = {
    completed: 'green',
    cancelled: 'red',
    pending: 'yellow',
  } as const;
  return colors[status];
};

/**
 * Format date for display
 */
export const formatDate = (
  date: Date,
  format: 'short' | 'long' = 'short'
): string => {
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Get time period label
 */
export const getTimePeriodLabel = (days: number): string => {
  if (days === 7) return 'Last 7 Days';
  if (days === 30) return 'Last 30 Days';
  if (days === 90) return 'Last 90 Days';
  if (days === 365) return 'Last Year';
  return `Last ${days} Days`;
};

/**
 * Validate analytics data
 */
export const validateAnalyticsData = (data: unknown): boolean => {
  if (!data || typeof data !== 'object') return false;
  if (Array.isArray(data)) return data.length > 0;
  return Object.keys(data).length > 0;
};
