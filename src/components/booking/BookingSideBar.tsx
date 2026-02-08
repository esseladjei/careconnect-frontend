import React from 'react';
import { CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import type { IProviderListing } from '../../types/providerListing.ts';

interface Props {
  offer: IProviderListing;
  selectedDate: Date;
  onBook: () => void;
}

const BookingSidebar: React.FC<Props> = ({ offer, selectedDate, onBook }) => {
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
                per session
              </p>
            </div>

            {/* Selected Info */}
            {selectedDate && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 text-sm text-blue-900 mb-2">
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

            {/* Booking Button */}
            <button
              onClick={onBook}
              className="w-full py-4 font-bold text-lg shadow-lg text-white
            bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg
            focus:outline-none focus:ring-4 focus:ring-blue-300
            transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Confirm Booking
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
