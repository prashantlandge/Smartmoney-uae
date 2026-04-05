import Image from 'next/image';
import { Package } from 'lucide-react';

const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  remittance: '/images/categories/remittance.svg',
  credit_card: '/images/categories/credit-cards.svg',
  credit_cards: '/images/categories/credit-cards.svg',
  personal_loan: '/images/categories/personal-loans.svg',
  personal_loans: '/images/categories/personal-loans.svg',
  islamic_finance: '/images/categories/islamic-finance.svg',
  car_insurance: '/images/categories/car-insurance.svg',
  health_insurance: '/images/categories/health-insurance.svg',
};

interface CategoryIllustrationProps {
  category: string;
  size?: number;
  className?: string;
}

export default function CategoryIllustration({
  category,
  size = 64,
  className = '',
}: CategoryIllustrationProps) {
  const src = CATEGORY_ILLUSTRATIONS[category];

  if (!src) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <Package size={size * 0.6} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Image
        src={src}
        alt={category.replace(/_/g, ' ')}
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  );
}
