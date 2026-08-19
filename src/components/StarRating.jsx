import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = null, onRate, size = 'md', readOnly = false }) {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const activeRating = hoverRating || rating || 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeRating;
          return (
            <button
              key={starValue}
              type="button"
              disabled={readOnly}
              onClick={() => onRate && onRate(starValue)}
              onMouseEnter={() => !readOnly && setHoverRating(starValue)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              className={`transition-transform duration-100 ${
                readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 focus:outline-none'
              }`}
              title={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-stone-300 fill-stone-100'
                }`}
              />
            </button>
          );
        })}

        {!readOnly && rating && (
          <button
            type="button"
            onClick={() => onRate(null)}
            className="ml-2 text-xs text-stone-400 hover:text-stone-600 underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}