import React from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import Spinner from '../Spinner';
import type { IProviderListing } from '../../types/providerListing.ts';

interface TimeSlot {
  time: string;
  available: boolean;
  slotId?: string;
}

interface Props {
  offer: IProviderListing;
  selectedDate: Date;
  selectedSlot?: string | null;
  onBook: () => void;
  isBooking?: boolean;
  timeSlots?: TimeSlot[];
  onSlotSelect?: (time: string) => void;
  slotsLoading?: boolean;
  isWorkingDay?: boolean;
  patientCondition: string;
  onPatientConditionChange: (value: string) => void;
  knownAllergy: string;
  onKnownAllergyChange: (value: string) => void;
}

const BookingSidebar: React.FC<Props> = ({
  offer,
  selectedDate,
  selectedSlot,
  onBook,
  isBooking = false,
  timeSlots = [],
  onSlotSelect,
  slotsLoading = false,
  isWorkingDay = true,
  patientCondition,
  onPatientConditionChange,
  knownAllergy,
  onKnownAllergyChange,
}) => {
  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-4 space-y-6">
        {/* Booking Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          <div className="bg-linear-to-r from-blue-700 via-blue-800 to-indigo-800 px-6 py-4">
            <h3 className="text-2xl font-bold text-white">Book Appointment</h3>
          </div>

          <div className="p-6 space-y-4">
            {/* Price Display */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-baseline gap-2 justify-center">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                <span className="text-4xl font-bold text-gray-900">
                  Gh¢ {offer.price}
                </span>
              </div>
              <p className="text-center text-sm text-gray-600 mt-1 font-medium">
                per session ({offer.sessionDuration || 30} min)
              </p>
            </div>
            {/* Health Information Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-5 border-2 border-amber-300 shadow-sm">
              {/* Section Header */}
              <div className="flex items-center gap-2 mb-4">
                <HeartIcon className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-amber-900">
                  Health Information
                </h4>
              </div>

              {/* Patient Condition */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="patientCondition"
                    className="block text-sm font-semibold text-amber-900"
                  >
                    Current Condition
                  </label>
                  <span className="text-xs text-amber-600 font-medium">
                    {patientCondition.length}/200
                  </span>
                </div>
                <textarea
                  id="patientCondition"
                  placeholder="e.g., Migraine, Asthma, Chronic pain, Fever..."
                  name="patientCondition"
                  value={patientCondition}
                  maxLength={200}
                  onChange={(e) => onPatientConditionChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-amber-200
                  rounded-lg bg-white/95 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-amber-500 
                  focus:border-transparent transition-all shadow-sm
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
                  rows={2}
                />
                <p className="text-xs text-amber-700 mt-1">
                  Help your provider understand your needs for better care
                </p>
              </div>

              {/* Known Allergies */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="knownAllergy"
                    className="block text-sm font-semibold text-amber-900"
                  >
                    Known Allergies
                  </label>
                  {knownAllergy && (
                    <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                      <ExclamationCircleIcon className="w-3 h-3" />
                      Important
                    </span>
                  )}
                </div>
                <input
                  id="knownAllergy"
                  placeholder="e.g., Penicillin, Shellfish, Dairy, Latex..."
                  name="knownAllergy"
                  type="text"
                  value={knownAllergy}
                  onChange={(e) => onKnownAllergyChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-2 border-amber-200
                  rounded-lg bg-white/95 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-amber-500
                  focus:border-transparent transition-all shadow-sm
                  disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-amber-700 mt-1">
                  This helps prevent adverse reactions during your appointment
                </p>
              </div>
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-900 mb-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="font-semibold">
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Time Slots Section */}
            {selectedDate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-gray-900">Select Time</h4>
                </div>

                {!isWorkingDay ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-yellow-800 font-medium">
                      Not available on this day
                    </p>
                  </div>
                ) : slotsLoading ? (
                  <div className="flex justify-center py-6">
                    <Spinner size="md" />
                  </div>
                ) : timeSlots.length > 0 ? (
                  <>
                    <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                      {timeSlots.map((slot, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            slot.available && onSlotSelect?.(slot.time)
                          }
                          disabled={!slot.available}
                          className={`py-2 px-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                            selectedSlot === slot.time
                              ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105'
                              : slot.available
                                ? 'bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400'
                                : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>

                    {/* Slot Legend */}
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded border-2 border-green-300 bg-white"></div>
                        <span className="text-gray-600">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-600"></div>
                        <span className="text-gray-600">Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-gray-100 border-2 border-gray-200"></div>
                        <span className="text-gray-600">Booked</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">No slots available</p>
                  </div>
                )}
              </div>
            )}

            {/* Booking Summary */}
            {selectedSlot && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  Booking Summary
                </h4>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>
                    <strong>Date:</strong>{' '}
                    {selectedDate.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedSlot}
                  </p>
                  <p>
                    <strong>Duration:</strong> {offer.sessionDuration || 30}{' '}
                    minutes
                  </p>
                  <p>
                    <strong>Price:</strong> Gh¢{offer.price}
                  </p>
                </div>
              </div>
            )}

            {/* Booking Button */}
            <button
              onClick={onBook}
              disabled={!selectedSlot || isBooking}
              className={`w-full py-4 font-bold text-lg shadow-lg text-white rounded-lg
                focus:outline-none focus:ring-4 focus:ring-blue-300
                transition-all duration-200 transform ${
                  !selectedSlot || isBooking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 hover:-translate-y-0.5 cursor-pointer'
                }`}
            >
              {isBooking
                ? 'Booking...'
                : selectedSlot
                  ? 'Confirm Booking'
                  : 'Select a Time Slot'}
            </button>

            <p className="text-xs text-center text-gray-500">
              By booking, you agree to our Terms & Conditions
            </p>
          </div>
        </div>

        {/* Quick Info Card */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm text-gray-700">
                Verified healthcare professionals
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm text-gray-700">
                Secure payment processing
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm text-gray-700">
                Easy rescheduling options
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-sm text-gray-700">
                24/7 customer support
              </span>
            </li>
          </ul>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 text-center">
          <div className="text-4xl mb-3">💬</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our support team is here to assist you
          </p>
          <button className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
};

export default BookingSidebar;
