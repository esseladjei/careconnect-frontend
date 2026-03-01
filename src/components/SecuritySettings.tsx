import React, { useState } from 'react';
import type { IUserPassword } from '../types/user.ts';
import PasswordInput from './PasswordInput';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface SecuritySettingsProps {
  onChange: (field: keyof IUserPassword, value: string) => void;
  onPasswordSave: () => void;
  savePasswordStatus: boolean;
  onLogoutAll: () => void;
}

// Simple input component for current password (no strength meter needed)
const CurrentPasswordInput: React.FC<{
  id: string;
  label: string;
  onChange: (value: string) => void;
}> = ({ id, label, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-gray-900 mb-1.5"
      >
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder="Enter your current password"
          className="w-full px-3 py-2 pr-10 border-2 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// --- Sub-Component: Security Settings Form ---
const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onChange,
  onPasswordSave,
  savePasswordStatus,
  onLogoutAll,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');
    onPasswordSave();
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    onChange('newPassword', value);
    if (passwordError) setPasswordError('');
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    onChange('confirmNewPassword', value);
    if (passwordError) setPasswordError('');
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Change Password
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Update your password regularly to keep your account secure
        </p>
        <form
          onSubmit={handlePasswordChangeSubmit}
          className="space-y-5 max-w-2xl"
        >
          {/* Current Password */}
          <CurrentPasswordInput
            id="current-password"
            label="Current Password"
            onChange={(value) => onChange('oldPassword', value)}
          />

          {/* New Password with Strength Meter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <PasswordInput
              id="new-password"
              name="new-password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              label="New Password"
              placeholder="Create a strong password"
              error={
                passwordError && !newPassword
                  ? 'New password is required'
                  : undefined
              }
              required={true}
              showStrengthMeter={true}
              showChecklist={true}
            />

            {/* Confirm New Password */}
            <PasswordInput
              id="confirm-new-password"
              name="confirm-new-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              label="Confirm New Password"
              placeholder="Re-enter your password"
              error={passwordError}
              required={true}
              showStrengthMeter={false}
              showChecklist={false}
            />
          </div>

          {/* Password Match Indicator */}
          {confirmPassword && newPassword === confirmPassword && (
            <p className="text-green-600 text-xs font-medium flex items-center gap-1">
              ✅ Passwords match
            </p>
          )}
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-red-500 text-xs font-medium flex items-center gap-1">
              ❌ Passwords do not match
            </p>
          )}

          <button
            type="submit"
            disabled={savePasswordStatus || !newPassword || !confirmPassword}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 mt-2 inline-flex items-center gap-2"
          >
            {savePasswordStatus ? (
              <>
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Password Updated
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Account Deactivation */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Account Deactivation
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
          Deactivate Account
        </button>
      </div>

      {/* Logout all devices */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Logout All Devices
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Sign out of your account on all devices for security.
        </p>
        <button
          type="button"
          onClick={onLogoutAll}
          className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          Log out all devices
        </button>
      </div>
    </div>
  );
};

export default SecuritySettings;
