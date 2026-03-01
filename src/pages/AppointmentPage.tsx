import React, { useState } from 'react';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
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
import { useTimezone } from '../hooks/useTimezone';
import { formatDateInTimezone } from '../utils/timezoneUtils';

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
  const timezone = useTimezone();
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
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* Hero Header Section */}
      <section className="bg-linear-to-br from-slate-700 via-blue-700 to-blue-800 text-white pt-8 pb-12 relative overflow-hidden border-b border-blue-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
              <CalendarDaysIcon className="h-8 w-8 text-blue-200" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">
              Your Appointments
            </h1>
          </div>
          <p className="text-lg text-blue-100 max-w-2xl">
            View, manage, and track all your medical appointments in one place
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 py-10">
        {/* Date Filter Section - Improved Design */}
        <div className="bg-linear-to-br from-white to-blue-50 rounded-xl shadow-md p-5 mb-8 border border-blue-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">
              Filter Appointments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                From
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                To
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="md:col-span-2 flex flex-wrap gap-2 items-end">
              <button
                onClick={() => {
                  const today = new Date();
                  const nextMonth = new Date();
                  nextMonth.setMonth(nextMonth.getMonth() + 1);
                  setStartDate(today.toISOString().split('T')[0]);
                  setEndDate(nextMonth.toISOString().split('T')[0]);
                }}
                className="px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-all cursor-pointer"
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
                className="px-3 py-2 text-xs font-semibold text-green-700 bg-green-100 border border-green-200 rounded-lg hover:bg-green-200 transition-all cursor-pointer"
              >
                This Year
              </button>
              <button
                onClick={() => {
                  setStartDate(getDefaultStartDate());
                  setEndDate(getDefaultEndDate());
                }}
                className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Date Range Info - Compact */}
          <div className="p-2.5 bg-blue-100 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">📅 Showing:</span>{' '}
              <span className="font-medium">
                {formatDateInTimezone(startDate, timezone, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="mx-1">→</span>
              <span className="font-medium">
                {formatDateInTimezone(endDate, timezone, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Tab Navigation - More Compact */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <CheckCircleIcon className="h-4 w-4" />
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${
              activeTab === 'past'
                ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            <CalendarDaysIcon className="h-4 w-4" />
            Past ({pastAppointments.length})
          </button>
        </div>

        {/* Appointment List - More Compact Spacing */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner />
            </div>
          ) : error ? (
            <div className="p-10 bg-white rounded-2xl shadow-lg text-center border border-red-200">
              <p className="text-lg text-red-600 font-semibold">
                Failed to load appointments
              </p>
              <p className="text-gray-600 mt-2">Please try again later</p>
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
            <div className="p-10 bg-white rounded-2xl shadow-lg text-center border border-gray-200">
              <div className="mb-4 text-5xl">📋</div>
              <p className="text-lg text-gray-700 font-semibold">
                {activeTab === 'upcoming'
                  ? 'No upcoming appointments'
                  : 'No past appointments'}
              </p>
              <p className="text-gray-600 mt-2">
                {activeTab === 'upcoming'
                  ? 'Time to book your next appointment!'
                  : 'Your past appointments will appear here'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentHistoryPage;
