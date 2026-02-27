import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProfileDetailsForm from '../components/ProfileDetailsForms';
import SecuritySettings from '../components/SecuritySettings';
import MFASettings from '../components/MFASettings';
import MFAVerificationModal from '../components/MFAVerificationModal';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import type {
  PatientProfile,
  ProviderProfile,
  UserPassword,
  UserProfile,
  UserResponse,
} from '../types/user.ts';
import axiosClient from '../api/axiosClient.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSendMFACode } from '../hooks/useSendMFACode.ts';
import { logoutAll } from '../api/authApi';

type SaveStatus = boolean;
type savePasswordStatus = boolean;

// --- Main Component ---
const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'mfa'>(
    'profile'
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(false);
  const [mfaVerificationOpen, setMFAVerificationOpen] = useState(false);
  const [mfaAction, setMFAAction] = useState<
    'login' | 'password-change' | 'profile-update'
  >('login');
  const [method, setMethod] = useState<'email' | 'totp'>('email');
  const [userResponse, setUserResponse] = useState<UserResponse>({
    user: {
      userId: '',
      title: '',
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      phone: '',
      location: '',
      gender: '',
      dateOfBirth: new Date(),
      languages: [],
      address: '',
      createdAt: undefined,
    },
    profile: {} as PatientProfile | ProviderProfile,
  });
  const { userId } = useAuth();
  const [savePasswordStatus, setSavePasswordStatus] =
    useState<savePasswordStatus>(false);
  const [userPassword, setUserPassword] = useState<UserPassword>({
    newPassword: '',
    confirmNewPassword: '',
    oldPassword: '',
  });
  const { sendCode } = useSendMFACode();

  const saveUserMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      const headers: Record<string, string> = {};
      // Add MFA token if available (from previous verification)
      const mfaToken = localStorage.getItem('mfa-token');
      if (mfaToken) {
        headers['x-mfa-token'] = mfaToken;
      }
      return axiosClient.patch(`/user/update/${userId}`, userResponse, {
        headers,
      });
    },
    onMutate: () => {
      return toast.loading('Saving profile…');
    },
    onSuccess: (_, __, toastId) => {
      toast.success('Profile updated successfully!', { id: toastId });
      localStorage.removeItem('mfa-token'); // Clean up after success
      setSaveStatus(true);
    },
    onError: async (err: any, __, toastId) => {
      // Check if MFA verification is required
      if (
        err.response?.status === 403 &&
        err.response?.data?.data.requiresMFA
      ) {
        toast.dismiss(toastId);
        setMFAVerificationOpen(true);
        setMFAAction('profile-update');
        const defaultMethod = err.response?.data?.data?.primaryMethod;
        const method = err.response?.data.data?.mfaMethods.find(
          (m: any) => m.type === defaultMethod
        );
        setMethod(method);
        if (method.type === 'email') {
          await sendCode(userId, method.type);
        }
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to update profile', {
        id: toastId,
      });
    },
  });

  const savePasswordMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      if (userPassword.newPassword !== userPassword.confirmNewPassword)
        return toast.error("Passwords don't match");

      const headers: Record<string, string> = {};

      // Add MFA token if available (from previous verification)
      const mfaToken = localStorage.getItem('mfa-token');
      if (mfaToken) {
        headers['x-mfa-token'] = mfaToken;
      }
      return axiosClient.patch(
        `/user/update/password/${userId}`,
        userPassword,
        { headers }
      );
    },
    onSuccess: () => {
      toast.success('Password updated successfully!');
      setUserPassword({
        newPassword: '',
        confirmNewPassword: '',
        oldPassword: '',
      });
      setSavePasswordStatus(true);
    },
    onError: async (err: any) => {
      // Check if MFA verification is required
      if (
        err.response?.status === 403 &&
        err.response?.data?.data?.requiresMFA
      ) {
        setMFAAction('password-change');
        setMFAVerificationOpen(true);
        const defaultMethod = err.response?.data?.data?.primaryMethod;
        const method = err.response?.data.data?.mfaMethods.find(
          (m: any) => m.type === defaultMethod
        );
        if (method) {
          setMethod(method.type);
          if (method.type === 'email') {
            await sendCode(userId, method.type);
          }
        }
        return;
      }
      toast.error(err.response?.data?.message || 'Failed to update password');
    },
  });

  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await axiosClient.get(`/user/${userId}`);
      return response.data as UserResponse;
    },
    enabled: !!userId,
  });

  // Define which fields belong to user vs profile
  const userFields = new Set([
    'title',
    'firstName',
    'lastName',
    'role',
    'email',
    'phone',
    'location',
    'gender',
    'dateOfBirth',
    'languages',
    'address',
    'createdAt',
    'password',
    'confirmPassword',
  ]);

  const handleChange = (
    field: keyof UserProfile | keyof (PatientProfile | ProviderProfile),
    value: string | string[] | Date | number | boolean
  ) => {
    setUserResponse((prev) => {
      // Check if field belongs to user object
      if (userFields.has(field as string)) {
        return {
          ...prev,
          user: {
            ...prev.user,
            [field]: value,
          } as UserProfile,
        };
      }
      // Otherwise update in profile object
      return {
        ...prev,
        profile: {
          ...prev.profile,
          [field]: value,
        },
      };
    });
    setSaveStatus(false);
  };

  const handlePasswordChange = (field: keyof UserPassword, value: string) => {
    setUserPassword((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSavePasswordStatus(false);
  };

  useEffect(() => {
    if (userData) {
      setUserResponse(userData);
    }
    if (isError) toast.error(error.message || 'Failed to fetch user data');
  }, [userData, isError]);

  const user = userResponse.user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* Hero Header Section with Gradient - Matching SearchPage */}
      <section className="bg-gradient-to-b from-slate-50 via-blue-50 to-white pt-8 pb-12 relative border-b border-blue-100">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight text-gray-900">
              Account Settings
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your profile, security preferences, and two-factor
              authentication
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 py-8 -mt-6 relative z-10">
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            {/* Avatar Skeleton */}
            <div className="flex items-center space-x-6 pb-8 border-b border-gray-200 mb-8">
              <div className="h-24 w-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5 animate-pulse"></div>
              </div>
            </div>

            {/* Tab Skeleton */}
            <div className="flex border-b border-gray-200 mb-8">
              <div className="h-12 bg-gray-200 rounded w-40 animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded w-40 ml-6 animate-pulse"></div>
            </div>

            {/* Form Content Skeleton */}
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        ) : isError ? (
          /* Error State */
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-red-500 mb-6">
                <svg
                  className="h-20 w-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Unable to load profile
              </h3>
              <p className="text-gray-600 mb-8 text-center max-w-sm">
                We encountered an error while fetching your profile data.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Profile Card Container */
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
            {/* Top Header/Avatar Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-3 md:space-y-0 md:space-x-4 pb-6 border-b border-gray-200 mb-8">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-4xl text-white font-bold overflow-hidden shrink-0 shadow-lg">
                {/* Display user initials */}
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {user.title} {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                <p className="text-gray-500 text-xs mb-3">
                  Member since{' '}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Recently'}
                </p>
              </div>
            </div>

            {/* Tab Navigation with Icons - Cursor Pointer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 shadow-md'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <UserCircleIcon
                  className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`font-semibold text-sm transition-colors ${
                    activeTab === 'profile' ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  Profile
                </span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group ${
                  activeTab === 'security'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 shadow-md'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <ShieldCheckIcon
                  className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    activeTab === 'security' ? 'text-blue-600' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`font-semibold text-sm transition-colors ${
                    activeTab === 'security' ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  Security
                </span>
              </button>
              <button
                onClick={() => setActiveTab('mfa')}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group ${
                  activeTab === 'mfa'
                    ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500 shadow-md'
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <CheckBadgeIcon
                  className={`h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    activeTab === 'mfa' ? 'text-blue-600' : 'text-gray-500'
                  }`}
                />
                <span
                  className={`font-semibold text-sm transition-colors ${
                    activeTab === 'mfa' ? 'text-blue-700' : 'text-gray-700'
                  }`}
                >
                  2FA
                </span>
              </button>
            </div>

            {/* Tab Content with Loading Indicator */}
            <div className="mt-6">
              {saveUserMutation.isPending || savePasswordMutation.isPending ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="lg" className="mr-3" />
                  <span className="text-gray-600 font-medium">
                    {saveUserMutation.isPending
                      ? 'Saving your profile...'
                      : 'Updating password...'}
                  </span>
                </div>
              ) : (
                <>
                  {activeTab === 'profile' && (
                    <ProfileDetailsForm
                      user={user}
                      onChange={handleChange}
                      onSave={saveUserMutation.mutate}
                      saveStatus={saveStatus}
                    />
                  )}
                  {activeTab === 'security' && (
                    <SecuritySettings
                      onChange={handlePasswordChange}
                      onPasswordSave={savePasswordMutation.mutate}
                      savePasswordStatus={savePasswordStatus}
                      onLogoutAll={async () => {
                        try {
                          await logoutAll();
                          toast.success(
                            'You have been logged out from all devices.'
                          );
                        } catch (error) {
                          toast.error(
                            'Failed to log out from all devices. Please try again.'
                          );
                        }
                      }}
                    />
                  )}
                  {activeTab === 'mfa' && userId && (
                    <MFASettings userId={userId} userEmail={user.email} />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MFA Verification Modal */}
      <MFAVerificationModal
        isOpen={mfaVerificationOpen}
        onClose={() => setMFAVerificationOpen(false)}
        onSuccess={(token?: string) => {
          setMFAVerificationOpen(false);
          // If a new token is returned, update it in localStorage
          if (token) {
            localStorage.setItem('mfa-token', token);
          }
          // Retry the original operation
          if (mfaAction === 'password-change') {
            savePasswordMutation.mutate();
          } else if (mfaAction === 'profile-update') {
            saveUserMutation.mutate();
          }
        }}
        onError={() => {
          setMFAVerificationOpen(false);
          localStorage.removeItem('mfa-token'); // Clean up on error
          toast.error('MFA verification failed. Please try again.');
        }}
        actionType={mfaAction}
        userId={userId}
        method={method}
      />

      <Footer />
    </div>
  );
};

export default UserProfilePage;
