import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CheckCircleIcon,
  ClipboardDocumentIcon,
  ClockIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ShareIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { useReferralStats } from '../hooks/useReferrals';
import { useAuth } from '../hooks/useAuth';

const ReferralPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { role } = useAuth();
  const { data, isLoading, error } = useReferralStats(userId || '');
  const [isCopied, setIsCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<'code' | 'link' | null>(null);

  const handleCopy = async (text: string, type: 'code' | 'link') => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setCopiedType(type);
  };

  // Reset copy state after a short delay
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        setCopiedType(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
            <p className="text-red-600 text-lg font-semibold">
              Failed to load referral data
            </p>
            <p className="text-red-500 text-sm mt-2">Please try again later</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const referralType = role === 'provider' ? 'Patient' : 'Provider';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white pt-8 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-white/10 rounded-lg backdrop-blur-sm">
              <GiftIcon className="h-7 w-7 text-blue-200" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold">
              Referral Program
            </h1>
          </div>
          <p className="text-base text-blue-100 max-w-2xl">
            Share your unique link and earn GH¢
            {data.bonusPerReferral.toFixed(2)} for every successful referral
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 md:px-8 py-8">
        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-1">
              <UserGroupIcon className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-gray-600 uppercase">
                Total
              </h3>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {data.totalReferrals}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <h3 className="text-xs font-semibold text-gray-600 uppercase">
                Completed
              </h3>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {data.completedReferrals}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500">
            <div className="flex items-center gap-2 mb-1">
              <ClockIcon className="h-4 w-4 text-yellow-600" />
              <h3 className="text-xs font-semibold text-gray-600 uppercase">
                Pending
              </h3>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              {data.pendingReferrals}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-1">
              <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />
              <h3 className="text-xs font-semibold text-gray-600 uppercase">
                Earned
              </h3>
            </div>
            <p className="text-2xl font-extrabold text-gray-900">
              GH¢ {data.totalBonusEarned.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Share Section - Compact */}
        <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-xl shadow-md border border-blue-100 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShareIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Share Your Referral
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Referral Link */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Referral Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={data.referralLink}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => handleCopy(data.referralLink, 'link')}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                >
                  {isCopied && copiedType === 'link' ? (
                    <span className="flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Referral Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={data.referralCode}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-lg font-mono font-bold text-center bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  onClick={() => handleCopy(data.referralCode, 'code')}
                  className="px-4 py-2 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-700 transition-all shadow-sm"
                >
                  {isCopied && copiedType === 'code' ? (
                    <span className="flex items-center gap-1">
                      <CheckCircleIcon className="h-4 w-4" />
                      Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ClipboardDocumentIcon className="h-4 w-4" />
                      Copy
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="p-3 bg-blue-100 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">💡 Tip:</span> Your friend gets{' '}
              <span className="font-bold">
                GH¢ {data.bonusPerReferral.toFixed(2)} off
              </span>{' '}
              their first service, and you earn{' '}
              <span className="font-bold">
                GH¢ {data.bonusPerReferral.toFixed(2)}
              </span>{' '}
              after completion!
            </p>
          </div>
        </div>

        {/* How It Works - Compact */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <span className="text-2xl">📤</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  Share Your Link
                </h4>
                <p className="text-xs text-gray-600">
                  Copy your referral link or code and share it via text, email,
                  or social media.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="p-2 bg-green-100 rounded-lg shrink-0">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  They Sign Up & Book
                </h4>
                <p className="text-xs text-gray-600">
                  Your friend signs up using your link/code and books their
                  first appointment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">
                  You Both Earn
                </h4>
                <p className="text-xs text-gray-600">
                  They get GH¢ {data.bonusPerReferral.toFixed(2)} off, and you
                  earn GH¢ {data.bonusPerReferral.toFixed(2)} bonus credit!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals List - Compact */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Your Referrals
          </h2>

          {data.referrals.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-gray-500 text-base font-medium">
                No referrals yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Start sharing your link to earn rewards!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                      Email
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                      Bonus
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-700 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.referrals.map((referral) => (
                    <tr
                      key={referral._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-gray-900">
                          {referral.referredName || 'Pending signup'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600">
                          {referral.referredEmail || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full ${
                            referral.status === 'completed'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : referral.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {referral.status.charAt(0).toUpperCase() +
                            referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {referral.bonusPaid ? (
                          <span className="text-sm font-bold text-green-600">
                            +GH¢ {referral.bonusAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            GH¢ {referral.bonusAmount.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {new Date(referral.createdAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReferralPage;
