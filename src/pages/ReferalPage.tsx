import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BenefitCard from '../components/BenefitCard';
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
      <div className="min-h-screen bg-gray-100">
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
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4 md:p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 text-lg">
              Failed to load referral data. Please try again later.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const referralType = role === 'provider' ? 'Patient' : 'Provider';

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Refer a Friend, Get Rewarded!
        </h1>
        <p className="text-gray-600 mb-8">
          Share your unique link or code with new {referralType.toLowerCase()}s
          and earn GH¢{data.bonusPerReferral.toFixed(2)} for every successful
          referral.
        </p>

        {/* --- 1. Referral Link & Code Section --- */}
        <div className="bg-white p-8 rounded-xl shadow-2xl border-l-4 border-yellow-500 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Share Your Referral
          </h2>

          {/* Referral Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Link
            </label>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                readOnly
                value={data.referralLink}
                className="grow w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 select-all"
              />
              <button
                onClick={() => handleCopy(data.referralLink, 'link')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto shrink-0"
              >
                {isCopied && copiedType === 'link'
                  ? '✅ Copied!'
                  : '📋 Copy Link'}
              </button>
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referral Code
            </label>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="text"
                readOnly
                value={data.referralCode}
                className="grow w-full p-3 border border-gray-300 rounded-lg text-xl font-mono text-center bg-gray-50 select-all"
              />
              <button
                onClick={() => handleCopy(data.referralCode, 'code')}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md w-full sm:w-auto shrink-0"
              >
                {isCopied && copiedType === 'code'
                  ? '✅ Copied!'
                  : '📋 Copy Code'}
              </button>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            💡 <strong>Tip:</strong> Your friend gets{' '}
            <strong>GH¢ {data.bonusPerReferral.toFixed(2)} off</strong> their
            first service, and you earn{' '}
            <strong>GH¢ {data.bonusPerReferral.toFixed(2)}</strong> once they
            complete it!
          </p>
        </div>

        {/* --- 2. Earnings and Statistics Summary --- */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Total Referrals
            </h3>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {data.totalReferrals}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Completed
            </h3>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {data.completedReferrals}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Pending
            </h3>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              {data.pendingReferrals}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 uppercase">
              Bonus Earned
            </h3>
            <p className="text-4xl font-extrabold text-gray-900 mt-2">
              GH¢ {data.totalBonusEarned.toFixed(2)}
            </p>
          </div>
        </div>

        {/* --- 3. Referred Users List --- */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Referrals
          </h2>

          {data.referrals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No referrals yet. Start sharing your link!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.referrals.map((referral) => (
                    <tr key={referral._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {referral.referredName || 'Pending signup'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {referral.referredEmail || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            referral.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : referral.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {referral.status.charAt(0).toUpperCase() +
                            referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {referral.bonusPaid ? (
                          <span className="text-green-600 font-semibold">
                            +GH¢ {referral.bonusAmount.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">
                            GH¢ {referral.bonusAmount.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString(
                          'en-GB',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* --- 4. How It Works / Benefits --- */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <BenefitCard
            icon="📤"
            title="Share Your Link"
            description="Copy your referral link or code and share it via text, email, or social media."
          />
          <BenefitCard
            icon="🤝"
            title="They Sign Up & Book"
            description={`Your friend signs up using your link/code and books their first appointment. Your Bonus will be sent to your after 1 month`}
          />
          <BenefitCard
            icon="💰"
            title="You Both Earn"
            description={`They get GH¢ ${data.bonusPerReferral.toFixed(2)} off, and you earn GH¢ ${data.bonusPerReferral.toFixed(2)} bonus credit!`}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReferralPage;
