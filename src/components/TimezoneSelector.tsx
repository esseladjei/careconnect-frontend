import React, { useEffect, useState } from 'react';
import { setTimezone } from '../api/axiosClient';
import { formatDateInTimezone } from '../utils/timezoneUtils.ts';

/**
 * TimezoneSelector Component
 * Allows users to view and change their timezone preference
 */

const COMMON_TIMEZONES = [
  { value: 'Africa/Accra', label: 'Africa/Accra (GMT)' },
  { value: 'Africa/Johannesburg', label: 'Africa/Johannesburg (SAST)' },
  { value: 'Africa/Cairo', label: 'Africa/Cairo (EET)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'America/Toronto', label: 'America/Toronto (EST/EDT)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (CST/CDT)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Europe/Rome (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (MSK)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (ICT)' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong (HKT)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (KST)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT/AEST)' },
  { value: 'Australia/Brisbane', label: 'Australia/Brisbane (AEST)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZDT/NZST)' },
];

interface ITimezoneProps {
  currentTimezone: string;
  onTimezoneChange?: (timezone: string) => void;
  onSave: (timezone: string) => void;
  isSaving?: boolean;
  compact?: boolean;
}

export const TimezoneSelector: React.FC<ITimezoneProps> = ({
  currentTimezone,
  onTimezoneChange,
  onSave,
  isSaving = false,
  compact = false,
}) => {
  const [selectedTimezone, setSelectedTimezone] = useState(currentTimezone);

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = e.target.value;
    setSelectedTimezone(newTimezone);
    onTimezoneChange?.(newTimezone);
    // Update local storage for immediate effect
    setTimezone(newTimezone);
  };

  // Update local state when currentTimezone prop changes (after successful save)
  useEffect(() => {
    setSelectedTimezone(currentTimezone);
  }, [currentTimezone]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <select
          value={selectedTimezone}
          onChange={handleTimezoneChange}
          disabled={isSaving}
          className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {COMMON_TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        {selectedTimezone !== currentTimezone && (
          <button
            onClick={() => onSave(selectedTimezone)}
            disabled={isSaving}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Timezone Settings
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="timezone-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Timezone
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Times in your appointments will be displayed in this timezone
          </p>
          <select
            id="timezone-select"
            value={selectedTimezone}
            onChange={handleTimezoneChange}
            disabled={isSaving}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {selectedTimezone !== currentTimezone && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            You have unsaved changes. Click Save to apply the new timezone.
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => onSave(selectedTimezone)}
            disabled={selectedTimezone === currentTimezone || isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSaving ? 'Saving...' : 'Save Timezone'}
          </button>
          {selectedTimezone !== currentTimezone && (
            <button
              onClick={() => {
                setSelectedTimezone(currentTimezone);
              }}
              disabled={isSaving}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Current Settings
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Active Timezone:</dt>
              <dd className="font-medium text-gray-900">{currentTimezone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Current Local Time:</dt>
              <dd className="font-medium text-gray-900">
                {formatDateInTimezone(new Date(), currentTimezone)}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default TimezoneSelector;
