import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0-5, supports half values
  showNumber?: boolean;
  size?: number;
  className?: string;
}

export default function StarRating({ rating, showNumber = true, size = 14, className = '' }: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const roundedUp = rating - fullStars >= 0.75;

  for (let i = 0; i < 5; i++) {
    const isFull = i < fullStars || (roundedUp && i === fullStars);
    const isHalf = hasHalf && i === fullStars;

    stars.push(
      <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
        {/* Empty star background */}
        <Star
          size={size}
          className="absolute inset-0 text-surface-300"
          fill="currentColor"
          strokeWidth={0}
        />
        {/* Filled star (full or half) */}
        {(isFull || isHalf) && (
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: isHalf ? '50%' : '100%' }}
          >
            <Star
              size={size}
              className="text-amber-400"
              fill="currentColor"
              strokeWidth={0}
            />
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span className="inline-flex gap-0.5">{stars}</span>
      {showNumber && (
        <span className="text-xs font-bold text-gray-700 ml-0.5">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}

/** Generate a consistent pseudo-rating from product features */
export function generateRating(features: Record<string, unknown>): number {
  const featureCount = Object.keys(features).length;
  if (featureCount >= 25) return 4.8;
  if (featureCount >= 20) return 4.5;
  if (featureCount >= 15) return 4.2;
  if (featureCount >= 10) return 3.9;
  if (featureCount >= 5) return 3.5;
  return 3.0;
}
