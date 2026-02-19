import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { useSendMFACode } from '../hooks/useSendMFACode';
import MFAVerificationModal from '../components/MFAVerificationModal';
import type { MFARequirements } from '../api/forgotPasswordApi';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: requestReset, isPending } = useForgotPassword();
  const { sendCode } = useSendMFACode();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // MFA related state
  const [mfaVerificationOpen, setMFAVerificationOpen] = useState(false);
  const [mfaRequirements, setMfaRequirements] =
    useState<MFARequirements | null>(null);
  const [userId, setUserId] = useState<string>('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const onSuccessCallback = () => {
    setSubmitted(true);
    setEmail('');
    localStorage.removeItem('email');
    toast.success('Password reset link sent to your email!');
    // Auto-redirect after 5 seconds
    setTimeout(() => navigate('/login'), 5000);
  };

  const onErrorCallback = async (err: any) => {
    // Check if MFA verification is required
    if (err.response?.status === 403 && err.response?.data?.data?.requiresMFA) {
      const mfaData = err.response.data.data;
      setMfaRequirements(mfaData);
      const extractedUserId = mfaData.userId || '';
      setUserId(extractedUserId);

      // Set default method to primary method
      const primaryMethod = mfaData.primaryMethod || 'email';

      // Send code if email method is selected
      if (primaryMethod === 'email' && extractedUserId) {
        await sendCode(extractedUserId, 'email');
      }

      // Open MFA verification modal
      setMFAVerificationOpen(true);
      return;
    }

    // Handle other errors
    const message =
      err.response?.data?.message ||
      err.message ||
      'Failed to send reset email';
    toast.error(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    //store email in localstorage, and send it along during verification
    localStorage.setItem('email', email);
    requestReset(
      { email },
      {
        onSuccess: onSuccessCallback,
        onError: onErrorCallback,
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-sm">
            No worries! We'll send you a link to reset your password.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold flex items-center">
                <span className="text-2xl mr-2">✅</span>
                Email sent!
              </p>
              <p className="text-green-700 text-sm mt-2">
                Check your email inbox for a password reset link. The link will
                expire in 24 hours.
              </p>
            </div>

            {/* Check Email Reminder */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">💡 Tip:</span> If you don't see
                the email, check your spam folder.
              </p>
            </div>

            {/* Auto-redirect Message */}
            <p className="text-center text-sm text-gray-600">
              Redirecting to login in 5 seconds...
            </p>

            {/* Manual Navigation */}
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  error
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <p className="text-xs text-gray-500 mt-1">
                Enter the email address associated with your account.
              </p>
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
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
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
        )}

        {/* Info Box */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-yellow-900">
              ⚠️ Security Note:
            </span>{' '}
            Never share your password reset link with anyone. Delete it after
            use.
          </p>
        </div>
      </div>

      {/* MFA Verification Modal */}
      {mfaRequirements && (
        <MFAVerificationModal
          isOpen={mfaVerificationOpen}
          onClose={() => setMFAVerificationOpen(false)}
          onSuccess={(token?: string) => {
            setMFAVerificationOpen(false);
            // Retry password reset with MFA token
            if (token) {
              requestReset(
                { email, mfaToken: token },
                {
                  onSuccess: () => {
                    setSubmitted(true);
                    setEmail('');
                    toast.success('Password reset link sent to your email!');
                    // Auto-redirect after 5 seconds
                    setTimeout(() => navigate('/login'), 5000);
                  },
                  onError: (err: any) => {
                    const message =
                      err.response?.data?.message ||
                      err.message ||
                      'Failed to send reset email';
                    toast.error(message);
                  },
                }
              );
            }
          }}
          onError={() => {
            setMFAVerificationOpen(false);
            toast.error('MFA verification failed. Please try again.');
          }}
          actionType="password-reset"
          userId={userId}
          method={mfaRequirements.primaryMethod || 'email'}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
