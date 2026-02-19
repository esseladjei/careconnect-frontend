import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProfileDetailsForm from '../components/ProfileDetailsForms';
import SecuritySettings from '../components/SecuritySettings';
import MFASettings from '../components/MFASettings';
import MFAVerificationModal from '../components/MFAVerificationModal';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Account Settings
        </h1>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8">
            {/* Avatar Skeleton */}
            <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 mb-6">
              <div className="h-24 w-24 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/5 animate-pulse"></div>
              </div>
            </div>

            {/* Tab Skeleton */}
            <div className="flex border-b border-gray-200 mb-6">
              <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-32 ml-4 animate-pulse"></div>
            </div>

            {/* Form Content Skeleton */}
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        ) : isError ? (
          /* Error State */
          <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-red-500 mb-4">
                <svg
                  className="h-16 w-16"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unable to load profile
              </h3>
              <p className="text-gray-600 mb-6">
                We encountered an error while fetching your profile data.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Profile Card Container */
          <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8">
            {/* Top Header/Avatar Section */}
            <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 mb-6">
              <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl text-blue-500 font-bold overflow-hidden shrink-0">
                {/* Display user initials */}
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.title} {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 text-sm">
                  Member since{' '}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Recently'}
                </p>
                <button className="text-blue-600 text-sm mt-1 hover:text-blue-700">
                  Change Photo
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'security'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Security & Access
              </button>
              <button
                onClick={() => setActiveTab('mfa')}
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  activeTab === 'mfa'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Two-Factor Auth
              </button>
            </div>

            {/* Tab Content with Loading Indicator */}
            <div>
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
                      onLogoutAll={() => logoutAll()}
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
