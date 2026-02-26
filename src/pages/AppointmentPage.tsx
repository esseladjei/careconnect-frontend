import React, { useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  useCancelAppointment,
  useCheckInAppointment,
  useCheckOutAppointment,
  useConfirmAppointment,
  useFetchAppointments,
} from '../hooks/useAppointments';
import Spinner from '../components/Spinner';
import { useAuth } from '../hooks/useAuth.ts';
import AppointmentCard from '../components/AppointmentCard.tsx';

// Set default date range: 3 months ago to 3 months from now
const getDefaultStartDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 3);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

const getDefaultEndDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
};

// --- Main Component ---
const AppointmentHistoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const { userId, role, actorId } = useAuth();
  // Fetch appointments with TanStack Query
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useFetchAppointments({
    userId: userId,
    role,
    actorId,
    start: new Date(startDate).toISOString(),
    end: new Date(endDate).toISOString(),
  });

  // Mutations for cancel and confirm
  const { mutate: cancelAppointment, isPending: isCanceling } =
    useCancelAppointment();
  const { mutate: confirmAppointment, isPending: isConfirming } =
    useConfirmAppointment();
  const { mutate: checkInAppointment, isPending: isCheckingIn } =
    useCheckInAppointment();
  const { mutate: checkOutAppointment, isPending: isCheckingOut } =
    useCheckOutAppointment();

  const handleCancel = (appointmentId: string, cancelledBy: string) => {
    cancelAppointment({
      appointmentId,
      cancelledBy,
      reason: 'User requested cancellation',
    });
  };

  const handleConfirm = (appointmentId: string) => {
    confirmAppointment({ appointmentId, status: 'confirmed' });
  };

  const handleCheckIn = (appointmentId: string) => {
    checkInAppointment({ appointmentId });
  };

  const handleCheckOut = (appointmentId: string) => {
    checkOutAppointment({ appointmentId });
  };

  const upcomingAppointments = appointments.filter(
    (a) =>
      a.status === 'confirmed' ||
      a.status === 'pending' ||
      a.status === 'checked-in'
  );
  const pastAppointments = appointments.filter(
    (a) =>
      a.status === 'completed' ||
      a.status === 'cancelled' ||
      a.status === 'no-show'
  );

  const appointmentsToShow =
    activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Your Appointments
        </h1>

        {/* Date Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-blue-50 p-2">
              <CalendarDaysIcon
                className="h-5 w-5 text-blue-600"
                aria-hidden="true"
              />
            </span>
            Filter by Date Range
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Start Date */}
            <div className="flex-1">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* End Date */}
            <div className="flex-1">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const nextMonth = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setStartDate(today.toISOString().split('T')[0]);
                  setEndDate(nextMonth.toISOString().split('T')[0]);
                }}
                className="px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
              >
                Next Month
              </button>
              <button
                onClick={() => {
                  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
                  const endOfYear = new Date(new Date().getFullYear(), 11, 31);
                  setStartDate(startOfYear.toISOString().split('T')[0]);
                  setEndDate(endOfYear.toISOString().split('T')[0]);
                }}
                className="px-4 py-2.5 text-sm font-medium text-green-700 bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors whitespace-nowrap"
              >
                This Year
              </button>
              <button
                onClick={() => {
                  setStartDate(getDefaultStartDate());
                  setEndDate(getDefaultEndDate());
                }}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Date Range Info */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Showing appointments from:</span>{' '}
              {new Date(startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              <span className="font-semibold">to</span>{' '}
              {new Date(endDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-2 rounded-xl shadow-lg mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'past'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Appointment List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner />
            </div>
          ) : error ? (
            <div className="p-8 bg-white rounded-xl shadow-lg text-center text-red-500">
              Failed to load appointments. Please try again.
            </div>
          ) : appointmentsToShow.length > 0 ? (
            appointmentsToShow.map((app) => (
              <AppointmentCard
                key={app._id}
                appointment={app}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                isLoading={
                  isCanceling || isConfirming || isCheckingIn || isCheckingOut
                }
              />
            ))
          ) : (
            <div className="p-8 bg-white rounded-xl shadow-lg text-center text-gray-500">
              {activeTab === 'upcoming'
                ? 'You have no upcoming appointments. Time to book one!'
                : 'No past records found.'}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentHistoryPage;
