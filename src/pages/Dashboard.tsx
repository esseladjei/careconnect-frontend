import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ProviderAnalyticsDashboard } from '../components/analytics/ProviderAnalyticsDashboard';
import { PatientAnalyticsDashboard } from '../components/analytics/PatientAnalyticsDashboard';

const Dashboard: React.FC = () => {
  // Get user ID and role from localStorage
  const providerId = localStorage.getItem('providerId');
  const patientId = localStorage.getItem('patientId');
  const role = localStorage.getItem('role');

  // Determine dashboard type based on user role
  const isProvider = role === 'provider' || providerId;
  const isPatient = role === 'patient' || patientId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Simple Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isProvider && 'Provider Analytics Overview'}
            {isPatient && !isProvider && 'Patient Analytics Overview'}
            {!isProvider && !isPatient && 'Analytics Overview'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isProvider &&
              'View your booking statistics, confirmation rates, and performance metrics.'}
            {isPatient &&
              !isProvider &&
              'Track your appointment history, completion rates, and booking trends.'}
            {!isProvider && !isPatient && 'Welcome to CareConnect Analytics'}
          </p>
        </div>

        {/* Dashboard Content */}
        <div>
          {isProvider && providerId && (
            <ProviderAnalyticsDashboard providerId={providerId} />
          )}

          {isPatient && !isProvider && patientId && (
            <PatientAnalyticsDashboard patientId={patientId} />
          )}

          {!isProvider && !isPatient && (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to CareConnect Analytics
              </h2>
              <p className="mt-2 text-gray-600">
                Please complete your profile to access analytics and insights.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
