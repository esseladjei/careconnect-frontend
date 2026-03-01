import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPassword } from '../hooks/useResetPassword';
import toast from 'react-hot-toast';
import { validatePasswordMatch } from '../utils/passwordValidation';
import PasswordInput from '../components/PasswordInput';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPassword: React.FC = () => {
  const { role, userId, timestamp } = useParams<{
    role?: string;
    userId?: string;
    timestamp?: string;
  }>();
  const navigate = useNavigate();
  const { mutate: resetPass, isPending } = useResetPassword();

  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate URL parameters
  useEffect(() => {
    if (!role || !userId || !timestamp) {
      toast.error('Invalid reset link. Please request a new one.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [role, userId, timestamp, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    // ...existing code...
    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else {
      const passwordValidation = validatePasswordMatch(
        formData.newPassword,
        formData.confirmPassword
      );
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    if (!role || !userId || !timestamp) {
      toast.error('Invalid reset link');
      return;
    }

    resetPass(
      {
        role,
        userId,
        timestamp,
        payload: {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
      },
      {
        onSuccess: () => {
          // Clear form
          setFormData({
            newPassword: '',
            confirmPassword: '',
          });
          // Redirect to login after 2 seconds
          setTimeout(() => navigate('/login'), 2000);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-blue-700 to-blue-800 text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-white/20 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <LockClosedIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Field */}
          <PasswordInput
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, newPassword: value }))
            }
            label="New Password"
            placeholder="Enter your new password"
            error={errors.newPassword}
            required={true}
            showStrengthMeter={true}
            showChecklist={true}
          />

          {/* Confirm Password Field */}
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold text-gray-900 mb-1.5"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-required="true"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? 'confirmPassword-error' : undefined
                }
                className={`w-full px-3 py-2 pr-10 border-2 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none ${
                  errors.confirmPassword
                    ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-red-600 text-xs font-medium mt-1"
              >
                {errors.confirmPassword}
              </p>
            )}

            {/* Password Match Indicator */}
            {formData.confirmPassword &&
              formData.newPassword === formData.confirmPassword && (
                <p className="text-green-600 text-xs font-medium mt-2 flex items-center gap-1">
                  ✅ Passwords match
                </p>
              )}
            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="text-red-500 text-xs font-medium mt-2 flex items-center gap-1">
                  ❌ Passwords do not match
                </p>
              )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 mt-6 inline-flex items-center justify-center gap-2 group ${
              isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95'
            }`}
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <LockClosedIcon
              className="h-4 w-4 text-blue-600"
              aria-hidden="true"
            />
            <span className="font-semibold text-sm text-gray-900">
              Security Tip:
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Use a strong password with uppercase letters, numbers, and special
            characters for better security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
