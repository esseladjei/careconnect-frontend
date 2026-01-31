import React, { useState } from 'react';
// --- Sub-Component: Security Settings Form ---
const SecuritySettings: React.FC = () => {
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        // Simulate password change logic
        setTimeout(() => {
            alert('Password updated successfully!');
            setIsUpdatingPassword(false);
        }, 1500);
    };

    return (
        <div className="space-y-8">
            {/* Password Change */}
            <div className="pb-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                    <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input type="password" id="current-password" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" id="new-password" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <div>
                        <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input type="password" id="confirm-new-password" required className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500" />
                    </div>
                    <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Account Deactivation (Placeholder) */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Deactivation</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="px-4 py-2 text-sm text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                    Deactivate Account
                </button>
            </div>
        </div>
    );
};

export default SecuritySettings;