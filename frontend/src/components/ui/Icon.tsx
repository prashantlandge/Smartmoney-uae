import {
  ArrowLeftRight,
  CreditCard,
  Landmark,
  Moon,
  Car,
  HeartPulse,
  Search,
  BarChart3,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  Check,
  X,
  MailCheck,
  FileText,
  Shield,
  Clock,
  Package,
  Heart,
  ChevronRight,
  Wallet,
  type LucideProps,
} from 'lucide-react';
import type { FC } from 'react';

const CATEGORY_ICONS: Record<string, FC<LucideProps>> = {
  remittance: ArrowLeftRight,
  credit_card: CreditCard,
  credit_cards: CreditCard,
  personal_loan: Landmark,
  personal_loans: Landmark,
  islamic_finance: Moon,
  car_insurance: Car,
  health_insurance: HeartPulse,
};

const CATEGORY_COLORS: Record<string, string> = {
  remittance: 'text-brand-primary',
  credit_card: 'text-indigo-600',
  credit_cards: 'text-indigo-600',
  personal_loan: 'text-cyan-600',
  personal_loans: 'text-cyan-600',
  islamic_finance: 'text-emerald-600',
  car_insurance: 'text-amber-600',
  health_insurance: 'text-rose-500',
};

// Gradient backgrounds for professional look (PaisaBazaar-inspired)
const CATEGORY_GRADIENTS: Record<string, string> = {
  remittance: 'from-brand-primary/15 to-emerald-50',
  credit_card: 'from-indigo-50 to-violet-50',
  credit_cards: 'from-indigo-50 to-violet-50',
  personal_loan: 'from-cyan-50 to-sky-50',
  personal_loans: 'from-cyan-50 to-sky-50',
  islamic_finance: 'from-emerald-50 to-teal-50',
  car_insurance: 'from-amber-50 to-orange-50',
  health_insurance: 'from-rose-50 to-pink-50',
};

// Ring/border accent for category cards
const CATEGORY_RING: Record<string, string> = {
  remittance: 'ring-brand-primary/20',
  credit_card: 'ring-indigo-200',
  credit_cards: 'ring-indigo-200',
  personal_loan: 'ring-cyan-200',
  personal_loans: 'ring-cyan-200',
  islamic_finance: 'ring-emerald-200',
  car_insurance: 'ring-amber-200',
  health_insurance: 'ring-rose-200',
};

const CATEGORY_BG_COLORS: Record<string, string> = {
  remittance: 'bg-brand-primary-50',
  credit_card: 'bg-indigo-50',
  credit_cards: 'bg-indigo-50',
  personal_loan: 'bg-cyan-50',
  personal_loans: 'bg-cyan-50',
  islamic_finance: 'bg-emerald-50',
  car_insurance: 'bg-amber-50',
  health_insurance: 'bg-rose-50',
};

interface CategoryIconProps extends LucideProps {
  category: string;
  withBackground?: boolean;
  bgClassName?: string;
}

export function CategoryIcon({
  category,
  withBackground = false,
  bgClassName,
  size = 24,
  className,
  ...props
}: CategoryIconProps) {
  const IconComponent = CATEGORY_ICONS[category] || FileText;
  const colorClass = className || CATEGORY_COLORS[category] || 'text-gray-600';

  if (withBackground) {
    const gradient = CATEGORY_GRADIENTS[category] || '';
    const ring = CATEGORY_RING[category] || 'ring-gray-200';
    const bgColor = bgClassName || CATEGORY_BG_COLORS[category] || 'bg-gray-50';
    const containerSize = (size as number) * 2;

    return (
      <div
        className={`inline-flex items-center justify-center rounded-2xl ${gradient ? `bg-gradient-to-br ${gradient}` : bgColor} ring-1 ${ring} shadow-sm`}
        style={{ width: containerSize, height: containerSize }}
      >
        <IconComponent size={size} className={colorClass} strokeWidth={1.75} {...props} />
      </div>
    );
  }

  return <IconComponent size={size} className={colorClass} strokeWidth={1.75} {...props} />;
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || 'text-gray-600';
}

export function getCategoryBgColor(category: string): string {
  return CATEGORY_BG_COLORS[category] || 'bg-gray-50';
}

export {
  ArrowLeftRight,
  CreditCard,
  Landmark,
  Moon,
  Car,
  HeartPulse,
  Search,
  BarChart3,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  Check,
  X,
  MailCheck,
  FileText,
  Shield,
  Clock,
  Package,
  Heart,
  ChevronRight,
  Wallet,
};
