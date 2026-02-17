import React from 'react';
import RatingSummary from './RatingSummary';
import ReviewList from './ReviewList';

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

const ReviewsTab: React.FC<Props> = ({ reviews }) => {
  return (
    <div className="space-y-6 p-6">
      <RatingSummary reviews={reviews} />
      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewsTab;
