import React, { useState } from 'react';
import ProfileDetailsForm from '../components/ProfileDetailsForms';
import SecuritySettings from '../components/SecuritySettings';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 


// --- Mock User Data ---
const mockUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@appco.com',
  phone: '555-123-4567',
  location: 'London, UK',
  joinDate: 'January 1, 2024',
};
// --- Main Component ---
const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

        {/* Profile Card Container */}
        <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8">
            
            {/* Top Header/Avatar Section */}
            <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 mb-6">
                <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-4xl text-blue-500 font-bold overflow-hidden flex-shrink-0">
                    {/* Display user initials */}
                    {mockUser.firstName[0]}{mockUser.lastName[0]}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{mockUser.firstName} {mockUser.lastName}</h2>
                    <p className="text-gray-500 text-sm">Member since {mockUser.joinDate}</p>
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
                {activeTab === 'profile' && <ProfileDetailsForm  mockUser={mockUser}/>}
                {activeTab === 'security' && <SecuritySettings />}
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfilePage;