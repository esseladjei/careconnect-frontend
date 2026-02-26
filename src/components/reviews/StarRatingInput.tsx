import React from 'react';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface StarRatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
            aria-label={`${label} ${star} star`}
          >
            <StarIconSolid
              className={`w-6 h-6 ${
                star <= value ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRatingInput;
