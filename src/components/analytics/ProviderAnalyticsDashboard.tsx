import React, { useState } from 'react';
import { BarChart, LineChart } from '../charts/ChartComponents';
import { KPICard, ProgressBar, StatGrid } from './StatCards';
import Spinner from '../Spinner';
import {
  useCancellationRate,
  useConfirmationRate,
  useMonthlyAvailabilityChart,
  useMonthlyBookingTrendChart,
  useProviderBookings,
} from '../../hooks/useAnalytics';
import type { ProviderBooking } from '../../types/analytics';

interface ProviderAnalyticsDashboardProps {
  providerId?: string;
}

/**
 * Provider Analytics Dashboard
 * Comprehensive view of provider statistics and performance metrics
 */
export const ProviderAnalyticsDashboard: React.FC<
  ProviderAnalyticsDashboardProps
> = ({ providerId }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'trends' | 'performance'
  >('overview');

  // Fetch analytics data
  const bookingsQuery = useProviderBookings(providerId);
  const confirmationRateQuery = useConfirmationRate(providerId);
  const cancellationRateQuery = useCancellationRate(providerId);
  const monthlyTrendQuery = useMonthlyBookingTrendChart(providerId);
  const availabilityQuery = useMonthlyAvailabilityChart(providerId);

  const isLoading =
    bookingsQuery.isLoading ||
    confirmationRateQuery.isLoading ||
    cancellationRateQuery.isLoading ||
    monthlyTrendQuery.isLoading ||
    availabilityQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Extract data
  const bookingData = bookingsQuery.data?.[0] as ProviderBooking | undefined;
  const confirmationRate =
    confirmationRateQuery.data?.[0]?.confirmationRate || 0;
  const cancellationRate =
    cancellationRateQuery.data?.[0]?.cancellationRate || 0;
  const monthlyTrendData = monthlyTrendQuery.data;
  const availabilityData = availabilityQuery.data;

  // Calculate metrics
  const totalBookings = bookingData?.totalBookings || 0;
  const completedBookings = bookingData?.completedBookings || 0;
  const cancelledBookings = bookingData?.cancelledBookings || 0;
  const pendingBookings = bookingData?.pendingBookings || 0;
  const completionRate =
    bookingData && bookingData.totalBookings > 0
      ? (
          (bookingData.completedBookings / bookingData.totalBookings) *
          100
        ).toFixed(1)
      : '0.0';

  // Prepare stat cards
  const statCards = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      color: 'blue' as const,
      change: {
        value: 5,
        type: 'increase' as const,
      },
      icon: '📅',
    },
    {
      title: 'Completed',
      value: completedBookings,
      color: 'green' as const,
      change: {
        value: 8,
        type: 'increase' as const,
      },
      icon: '✅',
    },
    {
      title: 'Cancelled',
      value: cancelledBookings,
      color: 'red' as const,
      change: {
        value: 2,
        type: 'decrease' as const,
      },
      icon: '❌',
    },
    {
      title: 'Pending',
      value: pendingBookings,
      color: 'yellow' as const,
      change: {
        value: 3,
        type: 'neutral' as const,
      },
      icon: '⏳',
    },
  ];

  const kpiCards = [
    {
      title: 'Confirmation Rate',
      value: confirmationRate.toFixed(1),
      unit: '%',
      subtitle: 'Confirmed bookings rate',
      trend: {
        value: 2.5,
        direction: 'up' as const,
      },
    },
    {
      title: 'Cancellation Rate',
      value: cancellationRate.toFixed(1),
      unit: '%',
      subtitle: 'Cancelled bookings rate',
      trend: {
        value: 1.2,
        direction: 'down' as const,
      },
    },
    {
      title: 'Completion Rate',
      value: completionRate,
      unit: '%',
      subtitle: 'Completed bookings rate',
      trend: {
        value: 3.8,
        direction: 'up' as const,
      },
    },
  ];

  return (
    <div className="space-y-6 bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Provider Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            {bookingData?.providerName || 'Provider'} - Performance Dashboard
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 rounded-lg bg-white p-1 shadow-sm">
          {(['overview', 'trends', 'performance'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <StatGrid stats={statCards} cols={4} />

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {kpiCards.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>

          {/* Progress Bars */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Performance Metrics
            </h3>
            <div className="space-y-6">
              <ProgressBar
                label="Confirmation Rate"
                value={confirmationRate}
                color="blue"
              />
              <ProgressBar
                label="Completion Rate"
                value={parseFloat(completionRate as string)}
                color="green"
              />
              <ProgressBar
                label="Cancellation Rate"
                value={cancellationRate}
                color="red"
              />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {monthlyTrendData && (
              <LineChart
                data={monthlyTrendData}
                title="Monthly Booking Trends"
                height="350px"
              />
            )}

            {availabilityData && (
              <BarChart
                data={availabilityData}
                title="Monthly Availability"
                height="350px"
              />
            )}
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid gap-6">
            {monthlyTrendData && (
              <LineChart
                data={monthlyTrendData}
                title="Monthly Booking Trends"
                height="400px"
              />
            )}
          </div>

          {/* Detailed Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Booking Distribution
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">Completed Bookings</p>
                <p className="text-3xl font-bold text-blue-600">
                  {completedBookings}
                </p>
                <p className="text-xs text-gray-500">
                  {(totalBookings > 0
                    ? (completedBookings / totalBookings) * 100
                    : 0
                  ).toFixed(1)}% of total
                </p>
              </div>

              <div className="space-y-2 rounded-lg bg-red-50 p-4">
                <p className="text-sm text-gray-600">Cancelled Bookings</p>
                <p className="text-3xl font-bold text-red-600">
                  {cancelledBookings}
                </p>
                <p className="text-xs text-gray-500">
                  {(totalBookings > 0
                    ? (cancelledBookings / totalBookings) * 100
                    : 0
                  ).toFixed(1)}% of total
                </p>
              </div>

              <div className="space-y-2 rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-green-600">
                  {pendingBookings}
                </p>
                <p className="text-xs text-gray-500">
                  {(totalBookings > 0
                    ? (pendingBookings / totalBookings) * 100
                    : 0
                  ).toFixed(1)}% of total
                </p>
              </div>

              <div className="space-y-2 rounded-lg bg-yellow-50 p-4">
                <p className="text-sm text-gray-600">Confirmation Rate</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {confirmationRate.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">
                  Average confirmation performance
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {availabilityData && (
            <BarChart
              data={availabilityData}
              title="Availability Overview"
              height="400px"
            />
          )}

          {/* Performance Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Performance Summary
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-4 font-semibold text-gray-700">Strengths</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl">✅</span>
                    <span className="text-gray-600">
                      High confirmation rate at {confirmationRate.toFixed(1)}%
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl">✅</span>
                    <span className="text-gray-600">
                      Strong completion rate at {completionRate}%
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl">✅</span>
                    <span className="text-gray-600">
                      Consistent booking flow with {totalBookings} total
                      bookings
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-700">
                  Areas to Improve
                </h4>
                <ul className="space-y-2">
                  {cancellationRate > 15 && (
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl">⚠️</span>
                      <span className="text-gray-600">
                        Cancellation rate is at {cancellationRate.toFixed(1)}% -
                        consider communication improvements
                      </span>
                    </li>
                  )}
                  {cancelledBookings > completedBookings * 0.2 && (
                    <li className="flex items-start gap-3">
                      <span className="mt-1 text-xl">⚠️</span>
                      <span className="text-gray-600">
                        Reduce cancellations to improve reliability metrics
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-3">
                    <span className="mt-1 text-xl">💡</span>
                    <span className="text-gray-600">
                      Maintain pending bookings momentum to sustain growth
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderAnalyticsDashboard;
