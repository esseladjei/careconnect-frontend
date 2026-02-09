import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';

interface Props {
  providerId: string;
}

const ProviderQuickActions: React.FC<Props> = ({ providerId }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <CalendarIcon className="w-8 h-8 text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Create New Listing Card */}
        <Link
          to={`/createlisting/${providerId}`}
          className="bg-white rounded-lg p-6 border-2 border-blue-300 hover:border-blue-500 hover:shadow-lg transition-all group"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <PlusCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Publish Availability
              </h3>
              <p className="text-sm text-gray-600">
                Create new availability listing and set your schedule
              </p>
            </div>
          </div>
        </Link>

        {/* View Bookings Card */}
        <div className="bg-white rounded-lg p-6 border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transition-all group cursor-pointer">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
              <CalendarIcon className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                View Bookings
              </h3>
              <p className="text-sm text-gray-600">
                See all your upcoming appointments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-4 text-center border border-blue-200">
          <ClockIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 font-medium">
            Flexible
            <br />
            Hours
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-green-200">
          <CheckCircleIcon className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 font-medium">
            Auto
            <br />
            Slots
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
          <div className="text-2xl mb-1">🔒</div>
          <p className="text-xs text-gray-600 font-medium">
            Slot
            <br />
            Locking
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderQuickActions;
