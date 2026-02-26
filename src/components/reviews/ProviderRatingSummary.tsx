import React from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { IProviderRatingSummary } from '../../types/reviews';

interface ProviderRatingSummaryProps {
  rating?: IProviderRatingSummary | null;
}

const ProviderRatingSummary: React.FC<ProviderRatingSummaryProps> = ({
  rating,
}) => {
  if (!rating) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Ratings are not available yet.
      </div>
    );
  }

  if (rating.status === 'new-provider' || rating.totalReviews < 3) {
    return (
      <div className="p-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
          ⭐ New Provider
        </div>
        <p className="mt-3 text-sm text-gray-600">
          This provider is new on CareConnect. Ratings will appear after at
          least 3 verified reviews.
        </p>
      </div>
    );
  }

  const rounded = Math.round(rating.overallAvg);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold text-gray-900">
          {rating.overallAvg.toFixed(1)}
        </div>
        <div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIconSolid
                key={star}
                className={`w-5 h-5 ${
                  star <= rounded ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">
            {rating.totalReviews} verified reviews
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderRatingSummary;
