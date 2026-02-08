import React from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface Review {
  id: string;
  patientName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface Props {
  reviews: Review[];
}

const RatingSummary: React.FC<Props> = ({ reviews }) => {
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">
            {averageRating}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIconSolid
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.floor(Number(averageRating))
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">{reviews.length} reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter(
              (r) => Math.floor(r.rating) === rating
            ).length;
            const percentage =
              reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 w-12">
                  {rating} star
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingSummary;
