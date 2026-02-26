import React from 'react';
import ProviderRatingSummary from '../reviews/ProviderRatingSummary';
import type { IProviderRatingSummary } from '../../types/reviews';

interface Props {
  ratingSummary?: IProviderRatingSummary | null;
}

const ReviewsTab: React.FC<Props> = ({ ratingSummary }) => {
  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-xl border border-gray-200">
        <ProviderRatingSummary rating={ratingSummary} />
      </div>
      <p className="text-sm text-gray-500">
        Public profiles show only overall rating and review count. Detailed
        comments are available to admins.
      </p>
    </div>
  );
};

export default ReviewsTab;
