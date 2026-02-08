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

const ReviewList: React.FC<Props> = ({ reviews }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-300 transition-all"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-gray-900">
                  {review.patientName}
                </h4>
                {review.verified && (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded">
                    Verified Patient
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIconSolid
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
        </article>
      ))}
    </div>
  );
};

export default ReviewList;
