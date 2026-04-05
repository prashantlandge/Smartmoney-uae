import type { ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'islamic' | 'ai' | 'new' | 'best' | 'cashback' | 'promoted' | 'limited' | 'default';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
  error: 'bg-error-light text-error-dark',
  info: 'bg-info-light text-info-dark',
  islamic: 'bg-emerald-100 text-emerald-800',
  ai: 'bg-brand-primary-50 text-brand-primary-700',
  new: 'bg-brand-gold-50 text-amber-800',
  best: 'bg-lime-100 text-lime-800',
  cashback: 'bg-amber-50 text-amber-700 border border-amber-200',
  promoted: 'bg-blue-50 text-blue-700',
  limited: 'bg-rose-50 text-rose-700 border border-rose-200',
  default: 'bg-gray-100 text-gray-700',
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export default function Badge({ variant = 'default', children, className = '', icon }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-badge text-xs font-semibold ${VARIANT_CLASSES[variant]} ${className}`}>
      {icon}
      {children}
    </span>
  );
}
