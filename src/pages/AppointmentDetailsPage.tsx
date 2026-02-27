import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../hooks/useAuth.ts';
import {
  useFetchAppointments,
  useSaveAppointmentNote,
} from '../hooks/useAppointments';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { prescriptionPdfGenerator } from '../utils/prescriptionPdfGenerator';

const AppointmentDetailsPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { userId, role, actorId } = useAuth();
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');

  // Fetch all appointments and find the specific one
  const {
    data: appointments = [],
    isLoading,
    error,
  } = useFetchAppointments({
    userId: userId,
    role,
    actorId,
    start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    end: new Date(new Date().getFullYear() + 1, 0, 1).toISOString(),
  });

  const appointment = appointments.find((a) => a._id === appointmentId);
  const {
    mutate: saveAppointmentNote,
    isPending,
    isError,
    isSuccess,
  } = useSaveAppointmentNote();
  const handleSaveNotes = async () => {
    if (!appointmentId) {
      toast.error('Invalid appointment ID');
      return;
    }
    if (!prescriptionNotes.trim() && !consultationNotes.trim()) {
      toast.error('Please add at least one note');
      return;
    }
    saveAppointmentNote({
      appointmentId,
      consultationNotes,
      prescriptions: prescriptionNotes,
    });
  };
  useEffect(() => {
    if (isSuccess) {
      setConsultationNotes('');
      setPrescriptionNotes('');
    }
  }, [isSuccess]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-20 flex justify-center">
          <Spinner />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-red-200">
            <p className="text-lg text-red-600 font-semibold">
              Appointment not found
            </p>
            <button
              onClick={() => navigate('/appointments')}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Appointments
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isProvider = role === 'provider';
  const patient = appointment.patientId?.userId;
  const provider = appointment.providerId?.userId;
  const hasNotesOrPrescriptions =
    Boolean(appointment?.consultationNotes) ||
    Boolean(appointment.prescriptions);
  const patientName =
    `${patient.title || ''} ${patient?.firstName || ''} ${patient?.lastName || ''}`.trim();
  const providerName =
    `${provider.title || ''} ${provider?.firstName || ''} ${provider?.lastName || ''}`.trim();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-linear-to-br from-slate-700 via-blue-700 to-blue-800 text-white pt-8 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => navigate(`/appointments/${userId}`)}
            className="flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Appointments
          </button>
          <h1 className="text-4xl font-extrabold mb-2">Appointment Details</h1>
          <p className="text-blue-100">
            {appointment.providerId.specialties.join(' • ')}
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 py-10">
        {/* Main Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Appointment Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
                </div>
                Appointment & Consultation Information
              </h2>

              {/* Consultation Notes and Prescription */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                {/* Header with Icon */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2.5 rounded-lg">
                        <DocumentTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80 uppercase tracking-wide">
                          Medical Documentation
                        </p>
                        <p className="text-lg font-bold text-white">
                          Consultation & Prescription
                        </p>
                      </div>
                    </div>
                    {(appointment.consultationNotes ||
                      appointment.prescriptions) && (
                      <button
                        onClick={() =>
                          prescriptionPdfGenerator(role, {
                            appointmentId: appointment._id,
                            patientName: patientName,
                            providerName: providerName,
                            consultationNotes:
                              appointment.consultationNotes || '',
                            prescriptions: appointment.prescriptions || '',
                            appointmentDate: new Date(
                              appointment.scheduledAt
                            ).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            }),
                            appointmentTime: new Date(
                              appointment.scheduledAt
                            ).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            }),
                          })
                        }
                        title="Download PDF"
                        className="cursor-grab flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Download PDF</span>
                        <span className="sm:hidden">PDF</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Consultation Notes Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Consultation Notes
                      </h3>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-gray-800 leading-relaxed text-sm">
                        {appointment.consultationNotes ? (
                          appointment.consultationNotes
                        ) : (
                          <span className="text-gray-400 italic">
                            No consultation notes provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Prescription Info Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Prescription Information
                      </h3>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-line">
                        {appointment.prescriptions ? (
                          appointment.prescriptions
                        ) : (
                          <span className="text-gray-400 italic">
                            No prescription information provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 1: Date & Time and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Time */}
                <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-600 font-semibold uppercase mb-2">
                    Date & Time
                  </p>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-gray-900">
                      {new Date(appointment.scheduledAt).toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </p>
                    <p className="text-base font-bold text-blue-700">
                      {appointment?.slotId?.startTime} -{' '}
                      {appointment?.slotId?.endTime}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                  <p className="text-sm text-orange-600 font-semibold uppercase mb-2">
                    Location
                  </p>
                  <p className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-orange-600" />
                    {appointment?.availabilityId?.location}
                  </p>
                </div>
              </div>

              {/* Row 2: Appointment Type and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Appointment Type */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <p className="text-sm text-purple-600 font-semibold uppercase mb-2">
                    Type
                  </p>
                  <p className="text-base font-bold text-gray-900">
                    {appointment.appointmentType}
                  </p>
                </div>

                {/* Status */}
                <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold uppercase mb-2">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    <span className="text-base font-bold text-gray-900 capitalize">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Provider/Patient Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserIcon className="h-6 w-6 text-purple-600" />
                </div>
                Participants
              </h2>

              {/* Provider Info */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 font-semibold uppercase mb-3">
                  Healthcare Provider
                </p>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-gray-900">
                    {provider?.title} {provider?.firstName} {provider?.lastName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Service Name:</span>{' '}
                    {appointment.providerId.serviceDescription}
                  </p>
                  {role === 'patient' && (
                    <>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Gender:</span>{' '}
                        {provider.gender}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Languages:</span>{' '}
                        {provider.languages.join(', ')}
                      </p>
                    </>
                  )}
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Specialties:</span>{' '}
                    {appointment.providerId.specialties.join(', ')}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Email:</span>{' '}
                    {provider?.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Phone:</span>{' '}
                    {appointment?.providerId.clinicPhone}
                  </p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
                <p className="text-sm text-yellow-600 font-semibold uppercase mb-3">
                  Patient
                </p>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-gray-900">
                    {patient?.title} {patient?.firstName} {patient?.lastName}
                  </p>
                  {role === 'provider' && (
                    <>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Gender:</span>{' '}
                        {patient?.gender}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Date of Birth:</span>{' '}
                        {new Date(patient?.dateOfBirth).toLocaleDateString(
                          'en-GB',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Languages:</span>{' '}
                        {patient?.languages.join(', ')}
                      </p>
                    </>
                  )}
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Email:</span>{' '}
                    {patient?.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Phone:</span>{' '}
                    {patient?.phone}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Location:</span>{' '}
                    {patient?.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prescription & Notes Section (Provider Only) */}
        {isProvider && !hasNotesOrPrescriptions && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-amber-600" />
              </div>
              Prescription & Consultation Notes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Prescription */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  💊 Prescription Notes
                </label>
                <textarea
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  placeholder="Enter medication details, dosage, instructions, and any important information..."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none hover:border-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Be specific about medications, dosages, and duration
                </p>
              </div>

              {/* Consultation Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  📝 Consultation Notes
                </label>
                <textarea
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Record consultation details, findings, recommendations, and follow-up instructions..."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none hover:border-gray-400"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Include observations, diagnosis, and treatment plan
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setPrescriptionNotes('');
                  setConsultationNotes('');
                }}
                className="px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all"
              >
                Clear
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={isPending || isSuccess}
                className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isPending
                  ? 'Saving...'
                  : isSuccess
                    ? 'Saved'
                    : '💾 Save Notes'}
              </button>
              {isError && <p className="text-red-500">Something went wrong.</p>}
            </div>
          </div>
        )}

        {/* Patient View - Summary Section */}
        {!isProvider && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Consultation Summary
            </h2>
            {appointment.status === 'completed' ? (
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-gray-700 mb-4">
                  Your consultation has been completed. The provider may share
                  prescription and consultation notes here once they're
                  available.
                </p>
                <button
                  onClick={() =>
                    navigate(`/appointments/${appointment._id}/review`)
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Leave a Review
                </button>
              </div>
            ) : (
              <div className="p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-yellow-800">
                  ⏳ Awaiting appointment. Consultation notes will appear here
                  after the appointment is completed.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AppointmentDetailsPage;
