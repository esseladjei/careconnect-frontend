import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import MFAVerificationModal from '../components/MFAVerificationModal';
import Spinner from '../components/Spinner';
import { useSendMFACode } from '../hooks/useSendMFACode.ts';

interface LoginResponse {
  accessToken: string;
  user: { userId: string; role: string };
  provider?: string;
  patient?: string;
  requiresMFA?: boolean;
  userId?: string;
  defaultMethod: string;
  mfaMethods?: Array<{ type: 'email' | 'totp'; isVerified: boolean }>;
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaUserId, setMfaUserId] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<LoginResponse | null>(null);
  const [mfaMethods, setMfaMethods] = useState<
    Array<{ type: 'email' | 'totp'; isVerified: boolean }>
  >([]);
  const [method, setMethod] = useState<'email' | 'totp'>('email');
  const [selectedMFAMethod, setSelectedMFAMethod] = useState<
    'email' | 'totp'
  >();
  const { sendCode, sendingCode } = useSendMFACode();

  // Load saved email ONLY on component mount (NOT password for security)
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberMeEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const setLocalStorage = (response: LoginResponse): void => {
    const { user, provider, patient } = response;
    localStorage.setItem('userId', user.userId);
    localStorage.setItem('role', user.role);
    if (user.role === 'provider' && provider) {
      localStorage.setItem('providerId', provider);
    } else if (user.role === 'patient' && patient) {
      localStorage.setItem('patientId', patient);
    }

    // Handle "Remember me" functionality (SECURE: Email only, never store password)
    if (rememberMe) {
      localStorage.setItem('rememberMeEmail', email);
    } else {
      // Clear saved email if "Remember me" is unchecked
      localStorage.removeItem('rememberMeEmail');
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      return await axiosClient.post('/auth/login', { email, password });
    },
    onSuccess: async (data) => {
      const response: LoginResponse = data.data;

      // Check if MFA is required
      if (response.requiresMFA && response.userId && response.mfaMethods) {
        setMfaRequired(true);
        setMfaUserId(response.userId);
        setLoginData(response);
        setMfaMethods(response.mfaMethods);
        const defaultMethod = response.defaultMethod;
        // Auto-select email if available, otherwise TOTP
        const method = response?.mfaMethods.find(
          (m) => m.type === defaultMethod
        );
        if (method) {
          const { type } = method;
          setMethod(type);
          if (method?.type === 'email') {
            setSelectedMFAMethod('email');
          } else {
            setSelectedMFAMethod('totp');
          }
          // Automatically send code to the selected method
          await sendCode(response.userId, type);
        }
        toast.loading('MFA verification required. Check your email or app.');
        return;
      }

      // No MFA - proceed with normal login
      const { user, accessToken } = response;
      localStorage.setItem('token', accessToken);
      setLocalStorage(response);
      toast.success('Login successful!');
      // Force a hard reload to ensure useAuth hook re-evaluates
      window.location.href = `/dashboard/${user.userId}`;
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Login failed');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  /*const handleSendMFACode = async (
    userId: string,
    method: 'email' | 'totp'
  ) => {
    try {
      setSendingCode(true);
      await sendMFACode(userId, method);
      toast.success(
        method === 'email'
          ? 'Verification code sent to your email'
          : 'Ready to enter code from your authenticator app'
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          `Failed to send ${method} code. Please try again.`
      );
    } finally {
      setSendingCode(false);
    }
  };
*/
  const handleMFASuccess = async (token?: string) => {
    if (!mfaUserId || !loginData) {
      toast.error('MFA session lost. Please login again.');
      setMfaRequired(false);
      return;
    }

    try {
      const { user } = loginData;
      // Use the new token from MFA verification if provided
      if (token) {
        localStorage.setItem('token', token);
      }
      setLocalStorage(loginData);
      toast.success('Login successful!');
      setMfaRequired(false);
      window.location.href = `/dashboard/${user.userId}`;
    } catch (err: any) {
      toast.error('Failed to complete login');
    }
  };

  const handleMFAError = () => {
    toast.error('MFA verification failed');
    setMfaRequired(false);
    setMfaUserId(null);
    setLoginData(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-l from-blue-700 via-blue-800 to-gray-900 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          CareConnect Login
        </h2>

        {/* Show MFA method selection if MFA is required but before modal */}
        {mfaRequired && mfaMethods.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-gray-800 mb-3">
              Select verification method:
            </p>
            <div className="space-y-2">
              {mfaMethods.map((method) => (
                <label
                  key={method.type}
                  className="flex items-center p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="mfaMethod"
                    value={method.type}
                    checked={selectedMFAMethod === method.type}
                    onChange={async () => {
                      setSelectedMFAMethod(method.type);
                      await sendCode(mfaUserId!, method.type);
                    }}
                    disabled={sendingCode}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm capitalize">
                    {method.type === 'email' ? 'Email' : 'Authenticator App'}
                  </span>
                  {sendingCode && selectedMFAMethod === method.type && (
                    <Spinner size="sm" className="ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Show normal login form only if MFA is not required */}
        {!mfaRequired && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {mutation.isPending && <Spinner size="sm" />}
              Sign In
            </button>
          </form>
        )}

        {!mfaRequired && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
            >
              Sign Up
            </a>
          </p>
        )}
      </div>

      {/* MFA Verification Modal */}
      {mfaRequired && mfaUserId && (
        <MFAVerificationModal
          isOpen={mfaRequired}
          onClose={() => {
            setMfaRequired(false);
            setMfaUserId(null);
            setLoginData(null);
          }}
          onSuccess={handleMFASuccess}
          onError={handleMFAError}
          actionType="login"
          userId={mfaUserId}
          method={method}
        />
      )}
    </div>
  );
};

export default Login;
