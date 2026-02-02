import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ProfileDetailsForm from '../components/ProfileDetailsForms';
import SecuritySettings from '../components/SecuritySettings';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import type { User, UserPassword } from '../types/user.ts';
import axiosClient from '../api/axiosClient.ts';
import { useAuth } from '../hooks/useAuth.ts';

type SaveStatus = boolean;
type savePasswordStatus = boolean;

// --- Main Component ---
const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(false);
  const [user, setUser] = useState<User>({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    createdAt: undefined,
  });
  const { userId } = useAuth();
  const [savePasswordStatus, setSavePasswordStatus] =
    useState<savePasswordStatus>(false);
  const [userPassword, setUserPassword] = useState<UserPassword>({
    newPassword: '',
    confirmNewPassword: '',
    oldPassword: '',
  });

  const handleChange = (field: keyof User, value: string) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaveStatus(false);
  };
  const handlePasswordChange = (field: keyof UserPassword, value: string) => {
    setUserPassword((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSavePasswordStatus(false);
  };
  const savePassword = async () => {
    if (!userId) return;
    if (userPassword.newPassword !== userPassword.confirmNewPassword)
      return toast.error("Passwords don't match");
    try {
      await axiosClient.patch(`/users/update/password/${userId}`, userPassword);
      toast.success('Password updated successfully!');

      // Reset form
      setUserPassword({
        newPassword: '',
        confirmNewPassword: '',
        oldPassword: '',
      });
      setSavePasswordStatus(true);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || 'Failed to update password',
        {}
      );
    }
  };
  const saveUser = async () => {
    if (!userId) return;

    const savingToast = toast.loading('Saving profile…');
    try {
      await axiosClient.patch(`/users/update/${userId}`, user);
      toast.success('Profile updated successfully!', {
        id: savingToast,
      });
      setSaveStatus(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile', {
        id: savingToast,
      });
    }
  };
  useEffect(() => {
    if (userId) {
      (async () => {
        try {
          const response = await axiosClient.get(
            `/users/${userId ? `${userId}` : ''}`
          );
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      })();
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Account Settings
        </h1>

        {/* Profile Card Container */}
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
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'profile' && (
              <ProfileDetailsForm
                user={user}
                onChange={handleChange}
                onSave={saveUser}
                saveStatus={saveStatus}
              />
            )}
            {activeTab === 'security' && (
              <SecuritySettings
                onChange={handlePasswordChange}
                onPasswordSave={savePassword}
                savePasswordStatus={savePasswordStatus}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;
