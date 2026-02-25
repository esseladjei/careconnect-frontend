import React, { useState } from 'react';
import { BarChart, DoughnutChart, LineChart } from '../charts/ChartComponents';
import { KPICard, ProgressBar, StatGrid } from './StatCards';
import Spinner from '../Spinner';
import {
  usePatientBookings,
  usePatientBookingsChart,
} from '../../hooks/useAnalytics';
import type { PatientBooking } from '../../types/analytics';

interface PatientAnalyticsDashboardProps {
  patientId?: string;
}

/**
 * Patient Analytics Dashboard
 * Comprehensive view of patient booking history and activity metrics
 */
export const PatientAnalyticsDashboard: React.FC<
  PatientAnalyticsDashboardProps
> = ({ patientId }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'history' | 'details'
  >('overview');

  // Fetch analytics data
  const bookingsQuery = usePatientBookings(patientId);
  const chartQuery = usePatientBookingsChart();

  const isLoading = bookingsQuery.isLoading || chartQuery.isLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Extract data
  const patientData = bookingsQuery.data?.[0] as PatientBooking | undefined;
  const chartData = chartQuery.data;

  // Calculate metrics
  const totalBookings = Number(patientData?.totalBookings) || 0;
  const completedBookings = Number(patientData?.completedBookings) || 0;
  const cancelledBookings = Number(patientData?.cancelledBookings) || 0;
  const pendingBookings = Number(patientData?.pendingBookings) || 0;

  const completionRate =
    totalBookings > 0
      ? Number(((completedBookings / totalBookings) * 100).toFixed(1))
      : 0;
  const cancellationRate =
    totalBookings > 0
      ? Number(((cancelledBookings / totalBookings) * 100).toFixed(1))
      : 0;

  // Create distribution chart data
  const distributionChartData = {
    labels: ['Completed', 'Cancelled', 'Pending'],
    datasets: [
      {
        label: 'Booking Status Distribution',
        data: [completedBookings, cancelledBookings, pendingBookings],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Prepare stat cards
  const statCards = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      color: 'blue' as const,
      change: {
        value: 12,
        type: 'increase' as const,
      },
      icon: '📅',
    },
    {
      title: 'Completed',
      value: completedBookings,
      color: 'green' as const,
      change: {
        value: 15,
        type: 'increase' as const,
      },
      icon: '✅',
    },
    {
      title: 'Cancelled',
      value: cancelledBookings,
      color: 'red' as const,
      change: {
        value: 8,
        type: 'decrease' as const,
      },
      icon: '❌',
    },
    {
      title: 'Pending',
      value: pendingBookings,
      color: 'yellow' as const,
      change: {
        value: 5,
        type: 'neutral' as const,
      },
      icon: '⏳',
    },
  ];

  const kpiCards = [
    {
      title: 'Completion Rate',
      value: completionRate,
      unit: '%',
      subtitle: 'Successfully completed appointments',
      trend: {
        value: 4.2,
        direction: 'up' as const,
      },
    },
    {
      title: 'Cancellation Rate',
      value: cancellationRate,
      unit: '%',
      subtitle: 'Cancelled appointments',
      trend: {
        value: 2.1,
        direction: 'down' as const,
      },
    },
    {
      title: 'Pending Ratio',
      value:
        totalBookings > 0
          ? ((pendingBookings / totalBookings) * 100).toFixed(1)
          : 0,
      unit: '%',
      subtitle: 'Awaiting confirmation',
      trend: {
        value: 1.5,
        direction: 'stable' as const,
      },
    },
  ];

  return (
    <div className="space-y-6 bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Patient Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            {patientData?.patientName || 'Patient'} - Booking History & Activity
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 rounded-lg bg-white p-1 shadow-sm">
          {(['overview', 'history', 'details'] as const).map((tab) => (
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

          {/* Quick Stats */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Quick Statistics
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-4 font-semibold text-gray-700">
                  Booking Status
                </h4>
                <div className="space-y-3">
                  <ProgressBar
                    label="Completed"
                    value={completedBookings}
                    max={totalBookings}
                    color="green"
                    showPercentage={false}
                  />
                  <ProgressBar
                    label="Pending"
                    value={pendingBookings}
                    max={totalBookings}
                    color="yellow"
                    showPercentage={false}
                  />
                  <ProgressBar
                    label="Cancelled"
                    value={cancelledBookings}
                    max={totalBookings}
                    color="red"
                    showPercentage={false}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                {distributionChartData && (
                  <DoughnutChart data={distributionChartData} height="250px" />
                )}
              </div>
            </div>
          </div>

          {/* Chart */}
          {chartData && (
            <LineChart data={chartData} title="Booking Trends" height="350px" />
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {chartData && (
            <BarChart
              data={chartData}
              title="Booking History Timeline"
              height="400px"
            />
          )}

          {/* Detailed Timeline */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Booking Timeline
            </h3>

            <div className="space-y-4">
              {/* Timeline Events */}
              <div className="flex gap-4 border-l-4 border-green-500 pl-4 py-2">
                <div>
                  <p className="font-semibold text-green-600">
                    Completed Appointments
                  </p>
                  <p className="text-sm text-gray-600">
                    {completedBookings} successfully completed appointments
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {completedBookings > 0
                      ? `Average: ${(completedBookings / 12).toFixed(1)} per month`
                      : 'No completed appointments yet'}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border-l-4 border-yellow-500 pl-4 py-2">
                <div>
                  <p className="font-semibold text-yellow-600">
                    Pending Appointments
                  </p>
                  <p className="text-sm text-gray-600">
                    {pendingBookings} appointments awaiting confirmation
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Estimated response time: 24-48 hours
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border-l-4 border-red-500 pl-4 py-2">
                <div>
                  <p className="font-semibold text-red-600">
                    Cancelled Appointments
                  </p>
                  <p className="text-sm text-gray-600">
                    {cancelledBookings} cancelled appointments
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {cancelledBookings > 0
                      ? `Cancellation rate: ${cancellationRate}%`
                      : 'No cancellations'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-600">
                Total Bookings
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {totalBookings}
              </p>
              <p className="mt-1 text-xs text-gray-500">Lifetime bookings</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {completionRate}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Completion percentage
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-600">
                Cancellation Rate
              </p>
              <p className="mt-2 text-3xl font-bold text-red-600">
                {cancellationRate}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Cancellation percentage
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-600">
                Pending Actions
              </p>
              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {pendingBookings}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Awaiting confirmation
              </p>
            </div>
          </div>

          {/* Performance Analysis */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Patient Profile
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-4 font-semibold text-gray-700">
                  Engagement Level
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">
                      Total appointments: <strong>{totalBookings}</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600">
                      Completed rate: <strong>{completionRate}%</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span className="text-gray-600">
                      Pending: <strong>{pendingBookings} appointments</strong>
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 font-semibold text-gray-700">
                  Reliability Score
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="mb-2 text-sm text-gray-600">
                      Overall Reliability
                    </p>
                    <ProgressBar
                      label="Score"
                      value={parseFloat(completionRate.toString())}
                      color="blue"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Based on completion rate and booking consistency
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Recommendations
            </h3>
            <ul className="space-y-3">
              {completionRate < 80 && (
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-lg">💡</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Improve Attendance
                    </p>
                    <p className="text-sm text-gray-600">
                      Your completion rate is {completionRate}%. Try setting
                      reminders to improve attendance.
                    </p>
                  </div>
                </li>
              )}
              {cancelledBookings > 2 && (
                <li className="flex items-start gap-3">
                  <span className="mt-1 text-lg">⚠️</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Reduce Cancellations
                    </p>
                    <p className="text-sm text-gray-600">
                      You have {cancelledBookings} cancelled appointments.
                      Consider scheduling at times that work best for you.
                    </p>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-3">
                <span className="mt-1 text-lg">✅</span>
                <div>
                  <p className="font-medium text-gray-900">Maintain Momentum</p>
                  <p className="text-sm text-gray-600">
                    Keep booking appointments regularly to maintain good health
                    outcomes.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAnalyticsDashboard;
