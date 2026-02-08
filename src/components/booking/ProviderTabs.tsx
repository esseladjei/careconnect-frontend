import React from 'react';

interface Props {
  activeTab: 'overview' | 'availability' | 'reviews';
  setActiveTab: React.Dispatch<
    React.SetStateAction<'overview' | 'availability' | 'reviews'>
  >;
  reviewCount: number;
}

const ProviderTabs: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  reviewCount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 px-6 py-4 font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 px-6 py-4 font-semibold transition-colors ${
            activeTab === 'reviews'
              ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Reviews ({reviewCount})
        </button>
      </div>
    </div>
  );
};

export default ProviderTabs;
