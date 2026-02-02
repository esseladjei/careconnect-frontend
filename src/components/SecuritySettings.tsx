import React from 'react';
import type { UserPassword } from '../types/user.ts';

interface SecuritySettingsProps {
  onChange: (field: keyof UserPassword, value: string) => void;
  onPasswordSave: () => void;
  savePasswordStatus: boolean;
}
// --- Sub-Component: Security Settings Form ---
const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onChange,
  onPasswordSave,
  savePasswordStatus,
}) => {
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSave();
  };

  return (
    <div className="space-y-8">
      {/* Password Change */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Change Password
        </h3>
        <form
          onSubmit={handlePasswordChangeSubmit}
          className="space-y-4 max-w-lg"
        >
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700"
            >
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              name="password"
              onChange={(e) => onChange('oldPassword', e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newpassword"
              name="newPassword"
              onChange={(e) => onChange('newPassword', e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-new-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-new-password"
              name="confirmNewPassword"
              onChange={(e) => onChange('confirmNewPassword', e.target.value)}
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={savePasswordStatus}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {savePasswordStatus ? 'Password changed...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Account Deactivation (Placeholder) */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Account Deactivation
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="px-4 py-2 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
          Deactivate Account
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
