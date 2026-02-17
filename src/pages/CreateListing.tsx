import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import appointmentsApi from '../api/appointmentsApi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import type { ICreateListingParams } from '../types/providerListing';
import { filterLocations, useLocations } from '../hooks/useLocations.ts';
import { getFormattedDate } from '../hooks/useDate.ts';

const DAYS_OF_WEEK = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 0, label: 'Sunday' },
];

const APPOINTMENT_TYPES = ['In-Person', 'Phone Consultation', 'Home Visit'];

const SESSION_DURATIONS = [
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1 hour 30 minutes' },
  { value: 120, label: '2 hours' },
];

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [formData, setFormData] = useState<ICreateListingParams>({
    userId: userId || '', // Get from URL params
    start: getFormattedDate(0),
    end: getFormattedDate(3),
    price: 0,
    appointmentType: 'In-Person',
    location: '',
    workingDays: [], // Default: Mon-Fri
    dailyStartTime: '09:00',
    dailyEndTime: '17:00',
    sessionDuration: 30,
  });

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationInputRef = useRef<HTMLDivElement>(null);

  // Fetch all available locations from DB using custom hook
  const { data: allLocations = [], isLoading: locationsLoading } =
    useLocations();

  // Filter locations based on input
  const filteredLocations = filterLocations(allLocations, formData.location);

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setFormData({ ...formData, location: location });
    setShowLocationDropdown(false);
  };

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setFormData({ ...formData, location: e.target.value });
    setShowLocationDropdown(input.length > 0);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createListingMutation = useMutation({
    mutationFn: async (data: ICreateListingParams) => {
      return await appointmentsApi.publishAvailability(data);
    },
    onSuccess: () => {
      toast.success('Availability published successfully!');
      navigate(`/dashboard/${userId}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to publish availability',
        { duration: 4000 }
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.start || !formData.end) {
      toast.error('Please select start and end dates');
      return;
    }

    if (new Date(formData.end) <= new Date(formData.start)) {
      toast.error('End date must be after start date');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    if (!formData.workingDays || formData.workingDays.length === 0) {
      toast.error('Please select at least one working day');
      return;
    }

    createListingMutation.mutate(formData);
  };

  const handleDayToggle = (day: number) => {
    setFormData((prev) => {
      const workingDays = prev.workingDays || [];
      if (workingDays.includes(day)) {
        return {
          ...prev,
          workingDays: workingDays.filter((d) => d !== day),
        };
      } else {
        return {
          ...prev,
          workingDays: [...workingDays, day].sort((a, b) => a - b),
        };
      }
    });
  };
  const handleSetDaysFromDate = () => {
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return; // Exit if dates are invalid
    }

    const selectedDays: number[] = [];
    const currentDate = new Date(startDate);

    // Iterate through all dates in the range
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Add day if not already in the array
      if (!selectedDays.includes(dayOfWeek)) {
        selectedDays.push(dayOfWeek);
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setFormData((prevState) => ({
      ...prevState,
      workingDays: selectedDays.sort((a, b) => a - b),
    }));
  };
  useEffect(() => {
    handleSetDaysFromDate();
  }, [formData.start, formData.end]);
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Create Availability Listing | CareConnect"
        description="Publish your availability and start accepting appointments from patients"
      />

      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Publish Availability
            </h1>
            <p className="text-blue-100">
              Set your schedule and start accepting appointments
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Date Range Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                Availability Period
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start}
                    onChange={(e) =>
                      setFormData({ ...formData, start: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end}
                    onChange={(e) =>
                      setFormData({ ...formData, end: e.target.value })
                    }
                    min={
                      formData.start || new Date().toISOString().split('T')[0]
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Working Days Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                Working Days
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all border-2 ${
                      formData.workingDays?.includes(day.value)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{day.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Time Range Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <ClockIcon className="w-6 h-6 text-blue-600" />
                Daily Working Hours
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.dailyStartTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dailyStartTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.dailyEndTime}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyEndTime: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Duration
                  </label>
                  <select
                    required
                    value={formData.sessionDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sessionDuration: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {SESSION_DURATIONS.map((duration) => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Appointments will be automatically
                  generated in {formData.sessionDuration}-minute slots between{' '}
                  {formData.dailyStartTime} and {formData.dailyEndTime} on your
                  selected working days.
                </p>
              </div>
            </div>

            {/* Appointment Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-blue-600" />
                Appointment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="appointmentType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Appointment Type
                  </label>
                  <select
                    id="appointmentType"
                    name="appointmentType"
                    required
                    value={formData.appointmentType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {APPOINTMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location with Autocomplete */}
                <div ref={locationInputRef} className="relative">
                  <label
                    htmlFor="location-filter"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>
                  <div className="relative">
                    {/* Location Input with City Icon */}
                    <input
                      id="location-filter"
                      type="text"
                      placeholder="Search location or enter location..."
                      value={formData.location}
                      onChange={handleLocationChange}
                      onFocus={() =>
                        formData.location.length > 0 &&
                        setShowLocationDropdown(true)
                      }
                      disabled={locationsLoading}
                      className="w-full px-4 py-3 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {/* City/Building Icon */}
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2h2v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>

                    {/* Autocomplete Dropdown */}
                    {showLocationDropdown && filteredLocations.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                        {filteredLocations.map((location, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleLocationSelect(location)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                          >
                            <svg
                              className="text-blue-600 w-4 h-4 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm text-gray-700 font-medium">
                              {location}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No results message */}
                    {showLocationDropdown &&
                      formData.location.length > 0 &&
                      filteredLocations.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center">
                          <p className="text-sm text-gray-500">
                            No locations found for "{formData.location}"
                          </p>
                        </div>
                      )}

                    {/* Loading indicator */}
                    {locationsLoading && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center">
                        <p className="text-sm text-gray-500">
                          Loading locations...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                Pricing
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Session (GH¢)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createListingMutation.isPending}
                className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {createListingMutation.isPending
                  ? 'Publishing...'
                  : 'Publish Availability'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-blue-600 text-3xl mb-3">📅</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Flexible Scheduling
            </h3>
            <p className="text-sm text-gray-600">
              Set your own working days and hours to match your availability
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-blue-600 text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Automatic Slots
            </h3>
            <p className="text-sm text-gray-600">
              Time slots are automatically generated based on your preferences
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="text-blue-600 text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Slot Locking</h3>
            <p className="text-sm text-gray-600">
              Booked slots are automatically locked to prevent double booking
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateListing;
