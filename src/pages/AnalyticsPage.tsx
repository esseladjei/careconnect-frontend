import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ProviderAnalyticsDashboard } from '../components/analytics/ProviderAnalyticsDashboard';
import { PatientAnalyticsDashboard } from '../components/analytics/PatientAnalyticsDashboard';
import {
  useAllAnalytics,
  usePatientBookingsChart,
  useProviderBookingsChart,
} from '../hooks/useAnalytics';
import { BarChart, LineChart } from '../components/charts';
import Spinner from '../components/Spinner';
import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
  PresentationChartLineIcon,
  SignalIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const AnalyticsPage: React.FC = () => {
  const [view, setView] = useState<'personal' | 'overview'>('personal');

  // Get user info from localStorage
  const providerId = localStorage.getItem('providerId');
  const patientId = localStorage.getItem('patientId');
  const role = localStorage.getItem('role');

  // Fetch overall analytics
  const allAnalyticsQuery = useAllAnalytics();
  const providerChartQuery = useProviderBookingsChart();
  const patientChartQuery = usePatientBookingsChart();

  const isLoading =
    allAnalyticsQuery.isLoading ||
    providerChartQuery.isLoading ||
    patientChartQuery.isLoading;

  // Determine which dashboard to show
  const showProviderDashboard = role ? role === 'provider' : !!providerId;
  const showPatientDashboard = role ? role === 'patient' : !!patientId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto">
        {/* Header Section */}
        <div className="border-b border-gray-200 bg-white shadow-sm">
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Analytics Center
                </h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive data analysis and visualization for your
                  healthcare platform
                </p>
              </div>

              {/* View Toggle */}
              {(showProviderDashboard || showPatientDashboard) && (
                <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setView('personal')}
                    className={`rounded px-4 py-2 text-sm font-medium transition-all ${
                      view === 'personal'
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    My Dashboard
                  </button>
                  <button
                    onClick={() => setView('overview')}
                    className={`rounded px-4 py-2 text-sm font-medium transition-all ${
                      view === 'overview'
                        ? 'bg-white text-blue-600 shadow'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    Platform Overview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          {/* Personal Dashboard View */}
          {view === 'personal' && (
            <>
              {showProviderDashboard && providerId && (
                <ProviderAnalyticsDashboard providerId={providerId} />
              )}
              {showPatientDashboard && patientId && (
                <PatientAnalyticsDashboard patientId={patientId} />
              )}
              {!showProviderDashboard && !showPatientDashboard && (
                <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                  <p className="text-gray-600">
                    Please log in to view your personal dashboard.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Platform Overview */}
          {view === 'overview' && (
            <div className="space-y-8">
              {/* Section 1: Quick Stats */}
              <div>
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Platform Overview
                </h2>

                {isLoading ? (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Provider Analytics Section */}
                    {showProviderDashboard && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Provider Performance
                        </h3>
                        {providerChartQuery.data && (
                          <BarChart
                            data={providerChartQuery.data}
                            title="Provider Bookings Overview"
                            height="350px"
                          />
                        )}
                      </div>
                    )}

                    {/* Patient Analytics Section */}
                    {showPatientDashboard && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          Patient Activity
                        </h3>
                        {patientChartQuery.data && (
                          <LineChart
                            data={patientChartQuery.data}
                            title="Patient Booking Trends"
                            height="350px"
                          />
                        )}
                      </div>
                    )}

                    {/* Overall Stats */}
                    <div className="mt-8 space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Key Metrics
                      </h3>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                          <p className="text-sm text-gray-600">
                            Total Platform Activity
                          </p>
                          <p className="mt-2 text-3xl font-bold text-blue-600">
                            <ChartBarIcon
                              className="h-8 w-8"
                              aria-hidden="true"
                            />
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            Comprehensive analytics tracking enabled
                          </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                          <p className="text-sm text-gray-600">
                            Data Collection
                          </p>
                          <p className="mt-2 text-3xl font-bold text-green-600">
                            <CheckCircleIcon
                              className="h-8 w-8"
                              aria-hidden="true"
                            />
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            Real-time data collection active
                          </p>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6">
                          <p className="text-sm text-gray-600">System Status</p>
                          <p className="mt-2 text-3xl font-bold text-green-600">
                            <SignalIcon
                              className="h-8 w-8"
                              aria-hidden="true"
                            />
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            All systems operational
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Features */}
              <div className="rounded-lg border border-gray-200 bg-white p-8">
                <h3 className="mb-6 text-xl font-semibold text-gray-900">
                  Available Analytics Features
                </h3>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex gap-4">
                    <ArrowTrendingUpIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Booking Trends
                      </h4>
                      <p className="text-sm text-gray-600">
                        Track booking patterns over time
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <SparklesIcon
                      className="h-6 w-6 text-yellow-500"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Performance Metrics
                      </h4>
                      <p className="text-sm text-gray-600">
                        Monitor confirmation and completion rates
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <PresentationChartLineIcon
                      className="h-6 w-6 text-indigo-600"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Visual Charts
                      </h4>
                      <p className="text-sm text-gray-600">
                        Interactive Chart.js visualizations
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <ArrowTrendingUpIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Growth Analysis
                      </h4>
                      <p className="text-sm text-gray-600">
                        Analyze growth and decline patterns
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <ClipboardDocumentCheckIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        KPI Tracking
                      </h4>
                      <p className="text-sm text-gray-600">
                        Monitor key performance indicators
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <LightBulbIcon
                      className="h-6 w-6 text-amber-500"
                      aria-hidden="true"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Smart Insights
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get actionable recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalyticsPage;
