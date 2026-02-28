import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPassword } from '../hooks/useResetPassword';
import toast from 'react-hot-toast';
import { validatePasswordMatch, } from '../utils/passwordValidation';
import PasswordInput from '../components/PasswordInput';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, } from '@heroicons/react/24/outline';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    'weak' | 'medium' | 'strong'
  >('weak');

  // Validate URL parameters
  useEffect(() => {
    if (!role || !userId || !timestamp) {
      toast.error('Invalid reset link. Please request a new one.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [role, userId, timestamp, navigate]);

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      return 'strong';
    }
    return 'medium';
  };

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

    // Update password strength
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
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

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 'weak':
        return 'Weak';
      case 'medium':
        return 'Medium';
      case 'strong':
        return 'Strong';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            Create a new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors pr-10 ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}

            {/* Password Match Indicator */}
            {formData.confirmPassword &&
              formData.newPassword === formData.confirmPassword && (
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <span className="mr-1">✅</span> Passwords match
                </p>
              )}
            {formData.confirmPassword &&
              formData.newPassword !== formData.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="mr-1">❌</span> Passwords do not match
                </p>
              )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 mt-6 ${
              isPending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isPending ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2"
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
              </span>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <LockClosedIcon
              className="h-4 w-4 text-gray-600"
              aria-hidden="true"
            />
            <span className="font-semibold">Security Tip:</span>
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
