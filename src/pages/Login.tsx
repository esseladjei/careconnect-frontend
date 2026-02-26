import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import MFAVerificationModal from '../components/MFAVerificationModal';
import Spinner from '../components/Spinner';
import SEO from '../components/SEO';
import Footer from '../components/Footer';
import { useSendMFACode } from '../hooks/useSendMFACode.ts';

interface LoginResponse {
  user: { userId: string; role: string };
  provider?: string;
  patient?: string;
  requiresMFA?: boolean;
  userId?: string;
  primaryMethod: 'email' | 'totp';
  mfaMethods?: Array<{ type: 'email' | 'totp'; isVerified: boolean }>;
}

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    localStorage.setItem('lastLoginTime', Date.now().toString());

    if (user.role === 'provider' && provider) {
      localStorage.setItem('providerId', provider);
    } else if (user.role === 'patient' && patient) {
      localStorage.setItem('patientId', patient);
    }

    if (rememberMe) {
      localStorage.setItem('rememberMeEmail', email);
    } else {
      localStorage.removeItem('rememberMeEmail');
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      return await axiosClient.post('/auth/login', { email, password });
    },
    onSuccess: async (data) => {
      const response: LoginResponse = data.data;

      if (response.requiresMFA && response.userId && response.mfaMethods) {
        setMfaRequired(true);
        setMfaUserId(response.userId);
        setLoginData(response);
        setMfaMethods(response.mfaMethods);
        const defaultMethod = response.primaryMethod;
        if (defaultMethod) {
          setMethod(defaultMethod);
          if (defaultMethod === 'email') {
            setSelectedMFAMethod('email');
            await sendCode(response.userId, defaultMethod);
          } else {
            setSelectedMFAMethod('totp');
          }
        }
        toast.loading('MFA verification required. Check your email or app.');
        return;
      }

      const { user } = response;
      setLocalStorage(response);
      toast.success('Login successful!');
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

  const handleMFASuccess = async () => {
    if (!mfaUserId || !loginData) {
      toast.error('MFA session lost. Please login again.');
      setMfaRequired(false);
      return;
    }

    try {
      const { user } = loginData;
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
    <>
      <SEO
        title="Login to CareConnect - Access Your Healthcare Dashboard | Telemedicine Ghana"
        description="Securely log in to your CareConnect account to book appointments with licensed Ghanaian doctors, manage your healthcare, and pay with Mobile Money. Fast, secure, and convenient telemedicine access."
        keywords="login CareConnect, telemedicine login Ghana, healthcare portal login, doctor appointment login, mobile money healthcare, secure medical login, Ghana health portal, telehealth access"
        ogTitle="CareConnect Login - Your Gateway to Quality Healthcare in Ghana"
        ogDescription="Access your personal healthcare dashboard. Book virtual consultations with verified doctors, manage appointments, and pay securely with MTN or Vodafone Momo."
      />

      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-slate-700 via-blue-700 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 mb-6 text-blue-100 hover:text-white transition-colors"
              >
                <img src="/logo.png" alt="CareConnect" className="h-8 w-8" />
                <span className="text-xl font-bold">CareConnect</span>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome Back to Quality Healthcare
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Access your personal health dashboard, connect with verified
                Ghanaian doctors, and manage your appointments with secure
                Mobile Money payments.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Marketing Content */}
            <div className="hidden lg:block space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Health, Your Way
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Join thousands of Ghanaians who trust CareConnect for
                  convenient, professional healthcare services from the comfort
                  of their homes.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Verified Healthcare Professionals
                    </h3>
                    <p className="text-sm text-gray-600">
                      Connect with licensed doctors and specialists across Ghana
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <DevicePhoneMobileIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Mobile Money Payments
                    </h3>
                    <p className="text-sm text-gray-600">
                      Secure payments with MTN or Vodafone Mobile Money
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Bank-Level Security
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your health data is encrypted and protected with
                      multi-factor authentication
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <UserGroupIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      24/7 Appointment Access
                    </h3>
                    <p className="text-sm text-gray-600">
                      Book and manage consultations anytime, anywhere
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Trusted by healthcare providers and patients across Ghana
                </p>
                <p className="text-xs text-gray-600">
                  Operating in Accra, Kumasi, Takoradi, Tamale, and all major
                  cities
                </p>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-slate-700 via-blue-700 to-blue-800 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Sign In to Your Account
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Enter your credentials to access your dashboard
                  </p>
                </div>

                <div className="p-8">
                  {/* MFA Method Selection */}
                  {mfaRequired && mfaMethods.length > 0 && (
                    <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-4">
                        <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                        <p className="text-sm font-semibold text-gray-900">
                          Select verification method:
                        </p>
                      </div>
                      <div className="space-y-3">
                        {mfaMethods.map((method) => (
                          <label
                            key={method.type}
                            className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
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
                              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm font-medium text-gray-900 capitalize flex items-center gap-2">
                              {method.type === 'email' ? (
                                <>
                                  <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                                  Email Verification
                                </>
                              ) : (
                                <>
                                  <DevicePhoneMobileIcon className="h-4 w-4 text-gray-500" />
                                  Authenticator App
                                </>
                              )}
                            </span>
                            {sendingCode &&
                              selectedMFAMethod === method.type && (
                                <Spinner size="sm" className="ml-auto" />
                              )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  {!mfaRequired && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-gray-900 mb-2"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                              <EyeIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="remember"
                            className="ml-2 block text-sm text-gray-700 font-medium"
                          >
                            Remember me
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/forgot-password')}
                          className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                      >
                        {mutation.isPending ? (
                          <>
                            <Spinner size="sm" />
                            Signing In...
                          </>
                        ) : (
                          <>
                            Sign In
                            <ArrowRightIcon className="h-5 w-5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Sign Up Link */}
                  {!mfaRequired && (
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                          to="/register"
                          className="text-blue-600 font-semibold hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                        >
                          Create Account
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      </p>
                      <p className="text-xs text-gray-500 mt-3">
                        By signing in, you agree to our Terms of Service and
                        Privacy Policy
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Feature Highlights */}
              <div className="lg:hidden mt-8 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Secure & encrypted healthcare platform
                  </p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
                  <DevicePhoneMobileIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Mobile Money payment support (MTN & Vodafone)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Ghana's Leading Telemedicine Platform
              </h2>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  CareConnect is Ghana's premier telemedicine and healthcare
                  platform, connecting patients with licensed medical
                  professionals across the country. Our secure login portal
                  provides instant access to your personalized health dashboard,
                  where you can book virtual consultations, manage appointments,
                  access medical records, and make secure payments using Mobile
                  Money.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Whether you're in Accra, Kumasi, Takoradi, Tamale, or any city
                  in Ghana, CareConnect brings quality healthcare to your
                  fingertips. Our platform supports both patients seeking
                  medical care and healthcare providers offering their services.
                  With bank-level encryption, multi-factor authentication, and
                  compliance with international healthcare data standards, your
                  health information remains private and secure.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Join thousands of Ghanaians who trust CareConnect for
                  convenient, affordable, and professional healthcare services.
                  Sign in now to book same-day consultations, get digital
                  prescriptions, and experience the future of healthcare in
                  Ghana.
                </p>
              </div>

              {/* Keywords for SEO */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  <strong>Healthcare Services:</strong> Telemedicine Ghana,
                  Online Doctor Consultation, Virtual Healthcare, Medical
                  Appointments, Health Portal, Digital Prescriptions, Mobile
                  Money Healthcare Payments, MTN Momo Medical Services, Vodafone
                  Cash Health Payments, Licensed Ghanaian Doctors
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
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
    </>
  );
};

export default Login;
