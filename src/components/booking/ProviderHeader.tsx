import React, { useState } from 'react';
import {
  AcademicCapIcon,
  CheckBadgeIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import useCapitalizeFirst from '../../hooks/useCapitalizeFirst';
import type { IProviderListing } from '../../types/providerListing.ts';

interface Props {
  offer: IProviderListing;
  averageRating: number;
}

const ProviderHeader: React.FC<Props> = ({ offer, averageRating }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const providerName = `${offer.user.title} ${useCapitalizeFirst(offer.user.firstName)} ${useCapitalizeFirst(offer.user.lastName)}`;
  const primarySpecialty =
    offer.provider.specialties?.[0] || 'Healthcare Provider';

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this healthcare provider on CareConnect`;

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        );
        break;
      case 'copy':
        navigator.clipboard
          .writeText(url)
          .then(() => alert('Link copied to clipboard!'))
          .catch(() => alert('Failed to copy link'));
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      {/* Hero Banner */}
      <div className="h-32 bg-linear-to-r from-blue-700 via-blue-800 to-indigo-800"></div>

      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xl flex items-center justify-center text-6xl border-4 border-white z-10">
            👨‍⚕️
          </div>

          <div className="flex-1 mt-4 sm:mt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold text-white">
                    {providerName}
                  </h1>
                  {offer.provider.providerStatus === 'verified' && (
                    <CheckBadgeIcon
                      className="w-7 h-7 text-white cursor-pointer"
                      title="Verified Provider"
                    />
                  )}
                </div>
                <p className="text-xl text-blue-700 font-semibold mb-2">
                  {primarySpecialty}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIconSolid
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(averageRating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-700 font-semibold">
                    {averageRating}
                  </span>
                  <span className="text-gray-500">(3 reviews)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isFavorite
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600'
                  }`}
                  aria-label="Add to favorites"
                >
                  {isFavorite ? (
                    <HeartIconSolid className="w-6 h-6" />
                  ) : (
                    <HeartIcon className="w-6 h-6" />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
                    aria-label="Share provider"
                  >
                    <ShareIcon className="w-6 h-6" />
                  </button>

                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>📘</span> Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>🐦</span> Twitter
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>💼</span> LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span>🔗</span> Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Pills */}
        <div className="flex flex-wrap gap-3 mt-6">
          {offer.provider.experience && (
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
              <AcademicCapIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                {offer.provider.experience} Years Experience
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm font-semibold text-green-900">
              {useCapitalizeFirst(offer.provider.available)}
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full border border-purple-200">
            <MapPinIcon className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-900">
              {offer.location}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProviderHeader;
