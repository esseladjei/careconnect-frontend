import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PatientFlagModal from './PatientFlagModal';
import type { Appointment } from '../types/appointment.ts';
import { useAuth } from '../hooks/useAuth.ts';
import type { IUser } from '../types/user.ts';
// --- Status Styling Helper ---
const getStatusClasses = (status: Appointment['status']) => {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'checked-in':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const AppointmentCard: React.FC<{
  appointment: Appointment;
  onCancel: (id: string, cancelledBy: string) => void;
  onConfirm: (id: string) => void;
  onCheckIn: (id: string) => void;
  onCheckOut: (id: string) => void;
  isLoading?: boolean;
}> = ({
  appointment,
  onCancel,
  onConfirm,
  onCheckIn,
  onCheckOut,
  isLoading = false,
}) => {
  const { role } = useAuth();
  const [showFlagModal, setShowFlagModal] = useState(false);
  const canReview =
    role === 'patient' &&
    appointment.status === 'completed' &&
    appointment.paymentStatus === 'paid';
  const canFlag =
    role === 'provider' &&
    ['completed', 'no-show', 'cancelled'].includes(appointment.status);
  const canCheckIn = role === 'provider' && appointment.status === 'confirmed';
  const canCheckOut =
    role === 'provider' && appointment.status === 'checked-in';
  const canConfirm = role === 'provider' && appointment.status === 'pending';
  const patientId =
    (appointment.patientId as { _id?: string })?._id ||
    appointment.patientId.userId._id;
  const target =
    role === 'provider'
      ? (appointment?.patientId?.userId as IUser)
      : appointment?.providerId?.userId;
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 hover:shadow-xl transition-shadow duration-300">
      {/* Details (Left Side) */}
      <div className="grow space-y-1">
        <h3 className="text-xl font-bold text-gray-900">
          {appointment.doctor}
        </h3>
        <p className="text-blue-600 font-medium">
          {appointment.providerId.specialties.join('-')} Appointment
        </p>

        <div className="flex items-center text-gray-600 text-sm pt-1">
          <span className="mr-3">
            🗓️{' '}
            {new Date(appointment.scheduledAt).toLocaleDateString('en-GB', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{' '}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
            {appointment.appointmentType}
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          📍 {appointment?.availabilityId?.location}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-3 mt-2 border-t border-gray-200">
          {/* Time Slot */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
            <span className="text-xl">⏰</span>
            <div className="flex flex-col">
              <span className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                Appointment Time
              </span>
              <span className="text-sm font-bold text-purple-900">
                {appointment?.slotId?.startTime} -{' '}
                {appointment?.slotId?.endTime}
              </span>
            </div>
          </div>
          {/* Patient Info */}

          <div className="flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
            <span className="text-xl">👤</span>
            <div className="flex flex-col">
              <span className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                {role === 'provider' ? 'Patient' : 'Provider'} Info
              </span>
              <span className="text-sm font-bold text-blue-900">
                {target?.title} {target?.firstName} {target?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions & Status (Right Side) */}
      <div className="flex flex-col items-start md:items-end space-y-10 pt-4 md:pt-0">
        {/* Status Badge */}
        <span
          className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border ${getStatusClasses(appointment.status)}`}
        >
          {appointment.status}
        </span>

        {/* Action Buttons */}
        {appointment.status === 'confirmed' && (
          <div className="flex space-x-2">
            <button
              onClick={() => onCancel(appointment._id, role)}
              disabled={isLoading}
              className="px-3 py-1 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Canceling...' : 'Cancel'}
            </button>
            {canCheckIn && (
              <button
                onClick={() => onCheckIn(appointment._id)}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Checking in...' : 'Check in'}
              </button>
            )}
          </div>
        )}
        {appointment.status === 'pending' && canConfirm && (
          <div className="flex space-x-2">
            <button
              onClick={() => onConfirm(appointment._id)}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        )}
        {appointment.status === 'checked-in' && canCheckOut && (
          <div className="flex space-x-2">
            <button
              onClick={() => onCheckOut(appointment._id)}
              disabled={isLoading}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Checking out...' : 'Check out'}
            </button>
          </div>
        )}

        {(canReview || canFlag) && (
          <div className="flex flex-wrap gap-2">
            {canReview && (
              <Link
                to={`/appointments/${appointment._id}/review`}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Leave Review
              </Link>
            )}
            {canFlag && (
              <button
                type="button"
                onClick={() => setShowFlagModal(true)}
                className="px-3 py-1 text-sm border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50"
              >
                Report Issue
              </button>
            )}
          </div>
        )}
      </div>

      {showFlagModal && canFlag && (
        <PatientFlagModal
          appointmentId={appointment._id}
          patientId={patientId}
          onClose={() => setShowFlagModal(false)}
        />
      )}
    </div>
  );
};
export default AppointmentCard;
