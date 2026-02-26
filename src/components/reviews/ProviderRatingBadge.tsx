import React from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useProviderRating } from '../../hooks/useReviews';

interface ProviderRatingBadgeProps {
  providerId: string;
  showCount?: boolean;
  compact?: boolean;
}

const ProviderRatingBadge: React.FC<ProviderRatingBadgeProps> = ({
  providerId,
  showCount = true,
  compact = false,
}) => {
  const { data: rating, isLoading } = useProviderRating(providerId);

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-gray-500">
        Loading rating...
      </span>
    );
  }

  if (!rating) {
    return null;
  }

  if (rating.status === 'new-provider' || rating.totalReviews < 3) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
        ⭐ New Provider
      </span>
    );
  }

  const rounded = Math.round(rating.overallAvg);

  return (
    <span
      className={`inline-flex items-center gap-2 ${
        compact ? 'text-xs' : 'text-sm'
      } text-gray-700`}
    >
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`w-4 h-4 ${
              star <= rounded ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </span>
      <span className="font-semibold">{rating.overallAvg.toFixed(1)}</span>
      {showCount && (
        <span className="text-gray-500">({rating.totalReviews})</span>
      )}
    </span>
  );
};

export default ProviderRatingBadge;
