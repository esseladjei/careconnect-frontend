import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { GiftIcon } from '@heroicons/react/24/outline';

/**
 * ReferralBanner - A simple banner component to promote the referral program
 * Can be placed on dashboard, profile page, or as a notification
 */
const ReferralBanner: React.FC = () => {
  const { userId, role } = useAuth();
  const referralType = role === 'provider' ? 'patient' : 'provider';

  return (
    <div className="bg-linear-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl text-amber-500">
            <GiftIcon className="h-9 w-9" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              Earn GH¢50 for Every Referral!
            </h3>
            <p className="text-yellow-100 text-sm">
              Share your link with friends and get rewarded when they join
            </p>
          </div>
        </div>
        <Link
          to={`/referral/${referralType}/${userId}`}
          className="bg-white text-yellow-600 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-50 transition-colors shadow-md whitespace-nowrap"
        >
          Get My Link →
        </Link>
      </div>
    </div>
  );
};

export default ReferralBanner;
