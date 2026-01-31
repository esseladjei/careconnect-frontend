import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import BenefitCard from '../components/BenefitCard';

// --- Mock Data ---
interface ReferralData {
  code: string;
  totalReferrals: number;
  bonusEarned: number;
  bonusPerReferral: number;
  referralType: 'Patient' | 'Provider';
}

const mockReferralData: ReferralData = {
  code: 'JANE_DOE_15',
  totalReferrals: 7,
  bonusEarned: 350.00,
  bonusPerReferral: 50.00, // $50 bonus for each successful referral
  referralType: 'Patient', // Could be 'Provider' as well
};


const ReferralPage: React.FC = () => {
  const [data, setData] = useState(mockReferralData);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.code);
    setIsCopied(true);
  };

  // Reset copy state after a short delay
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);



  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> 
      
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refer a Friend, Get Rewarded!</h1>
        <p className="text-gray-600 mb-8">Share your unique code with **new {data.referralType.toLowerCase()}s** and earn a bonus for every successful referral.</p>

        {/* --- 1. Referral Code Section --- */}
        <div className="bg-white p-8 rounded-xl shadow-2xl border-l-4 border-yellow-500 mb-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Unique Referral Code</h2>
            
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                
                {/* Code Display */}
                <div className="flex-grow w-full">
                    <input
                        type="text"
                        readOnly
                        value={data.code}
                        className="w-full p-4 border border-gray-300 rounded-lg text-2xl font-mono text-center bg-gray-50 select-all"
                    />
                </div>

                {/* Copy Button */}
                <button
                    onClick={handleCopy}
                    className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto flex-shrink-0"
                >
                    {isCopied ? '✅ Copied!' : '📋 Copy Code'}
                </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-600">
                They get **${data.bonusPerReferral.toFixed(2)} off** their first service, and you earn **${data.bonusPerReferral.toFixed(2)}**!
            </p>
        </div>

        {/* --- 2. Earnings and Statistics Summary --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-green-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Total Referrals</h3>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">{data.totalReferrals}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-green-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Bonus Earned</h3>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">${data.bonusEarned.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center border-b-4 border-green-500">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Bonus per Referral</h3>
                <p className="text-4xl font-extrabold text-gray-900 mt-2">${data.bonusPerReferral.toFixed(2)}</p>
            </div>
        </div>

        {/* --- 3. How It Works / Benefits --- */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BenefitCard 
                icon="📤" 
                title="Share Your Code" 
                description="Copy your code above and share it via text, email, or social media with friends." 
            />
            <BenefitCard 
                icon="🤝" 
                title="They Sign Up & Book" 
                description={`The referred ${data.referralType.toLowerCase()} uses the code at checkout to receive their discount.`} 
            />
            <BenefitCard 
                icon="💰" 
                title="You Earn a Bonus" 
                description={`Once their appointment is completed, your account is credited with $${data.bonusPerReferral.toFixed(2)}.`} 
            />
        </div>

      </main>

      <Footer />
    </div>
  );
};

export default ReferralPage;