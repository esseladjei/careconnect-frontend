import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PatientFlagModal from './PatientFlagModal';
import type { Appointment } from '../types/appointment.ts';
import { useAuth } from '../hooks/useAuth.ts';
import type { IUser } from '../types/user.ts';
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChevronRightIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import {
  useCheckExistingFlag,
  useCheckExistingReview,
} from '../hooks/useAppointments';
import { useTimezone } from '../hooks/useTimezone';
import { formatDateShortInTimezone } from '../utils/timezoneUtils';
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
  const timezone = useTimezone();
  const [showFlagModal, setShowFlagModal] = useState(false);
  const patientId = appointment.patientId?.userId?._id;
  const providerId = appointment.providerId?.userId?._id;
  const navigate = useNavigate();
  // Call hooks unconditionally at top level (required by React Rules of Hooks)
  const { data: reviewCheckData } = useCheckExistingReview(
    appointment._id,
    patientId || ''
  );
  const { data: flagCheckData } = useCheckExistingFlag(
    appointment._id,
    providerId || ''
  );

  // Determine which data to use based on role
  const existingReview = role === 'patient' ? reviewCheckData?.existing : false;
  const existingFlag = role === 'provider' ? flagCheckData?.existing : false;

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

  const target =
    role === 'provider'
      ? (appointment?.patientId?.userId as IUser)
      : appointment?.providerId?.userId;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group">
      {/* Top Border Accent */}
      <div className="h-1 bg-linear-to-r from-blue-500 via-blue-600 to-blue-700"></div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left Content Section */}
          <div className="flex-1 space-y-2">
            {/* Clickable Title */}
            <Link
              to={`/appointments/${appointment._id}/details`}
              className="group/link inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 truncate transition-colors">
                {appointment.providerId.serviceDescription}
              </h3>
              <ChevronRightIcon className="h-4 w-4 text-gray-400 group-hover/link:text-blue-600 transition-all" />
            </Link>

            {/* Specialty & Type */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-blue-600 font-medium">
                {appointment.providerId.specialties.join(' • ')}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 uppercase">
                {appointment.appointmentType}
              </span>
            </div>

            {/* Date, Time & Location - Compact Row */}
            <div className="flex flex-wrap items-center gap-4 text-sm pt-1">
              <div className="flex items-center gap-1.5 text-gray-700">
                <CalendarDaysIcon className="h-3.5 w-3.5 text-blue-600" />
                <span className="font-medium">
                  {formatDateShortInTimezone(appointment.scheduledAt, timezone)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-700">
                <span className="text-sm">⏰</span>
                <span className="font-medium">
                  {appointment?.slotId?.startTime} -{' '}
                  {appointment?.slotId?.endTime}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-gray-700">
                <MapPinIcon className="h-3.5 w-3.5 text-green-600" />
                <span className="font-medium">
                  {appointment?.availabilityId?.location}
                </span>
              </div>
            </div>
            {/* Provider/Patient Info - Compact */}
            <div className="flex gap-2 pt-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                <span className="text-sm">👤</span>
                <div>
                  <span className="text-xs text-gray-600 font-medium">
                    {role === 'provider' ? 'Patient' : 'Provider'}:{' '}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {target?.firstName} {target?.lastName}
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                <span className="text-sm">
                  {' '}
                  <BuildingOffice2Icon className="h-3.5 w-3.5 text-orange-600" />
                </span>
                <div>
                  <span className="text-xs text-gray-600 font-medium">
                    Normal Practice facility:{' '}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {appointment.providerId.practiceName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Status & Actions */}
          <div className="flex flex-col items-end space-y-2 w-full md:w-auto">
            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-xs leading-5 font-bold rounded-full border capitalize ${getStatusClasses(appointment.status)}`}
            >
              {appointment.status}
            </span>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              {appointment.status === 'confirmed' && (
                <>
                  {canCheckIn && (
                    <button
                      onClick={() => onCheckIn(appointment._id)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Checking in...' : 'Check in'}
                    </button>
                  )}
                  <button
                    onClick={() => onCancel(appointment._id, role)}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Canceling...' : 'Cancel'}
                  </button>
                </>
              )}

              {appointment.status === 'pending' && canConfirm && (
                <button
                  onClick={() => onConfirm(appointment._id)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Confirming...' : 'Confirm'}
                </button>
              )}

              {appointment.status === 'checked-in' && canCheckOut && (
                <button
                  onClick={() => onCheckOut(appointment._id)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Checking out...' : 'Check out'}
                </button>
              )}

              {(canReview || canFlag) && (
                <>
                  {canReview && (
                    <button
                      onClick={() =>
                        navigate(`/appointments/${appointment._id}/review`)
                      }
                      disabled={existingReview}
                      title={
                        existingReview
                          ? 'You have already reviewed this appointment'
                          : 'Leave a review for this appointment'
                      }
                      className={`${
                        existingReview
                          ? 'cursor-not-allowed disabled:cursor-not-allowed disabled:opacity-70'
                          : ''
                      } px-3 py-1.5 text-xs font-semibold text-white bg-linear-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-center`}
                    >
                      Review
                    </button>
                  )}
                  {canFlag && (
                    <button
                      type="button"
                      onClick={() => setShowFlagModal(true)}
                      disabled={existingFlag}
                      title={
                        existingFlag
                          ? 'You have already reported this appointment'
                          : 'Report this appointment'
                      }
                      className={`${
                        existingFlag
                          ? 'cursor-not-allowed disabled:cursor-not-allowed disabled:opacity-70'
                          : ''
                      } px-3 py-1.5 text-xs font-semibold border border-orange-400 text-orange-700 rounded-lg hover:bg-orange-50 transition-all `}
                    >
                      Report
                    </button>
                  )}
                </>
              )}

              {/* View Details Link */}
              <Link
                to={`/appointments/${appointment._id}/details`}
                className="px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-all text-center"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
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
