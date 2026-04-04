import type { FC, ReactNode } from 'react';
import type { LucideProps } from 'lucide-react';
import { Package } from 'lucide-react';

interface EmptyStateProps {
  icon?: FC<LucideProps>;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon: Icon = Package,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400" />
      </div>
      <h3 className="text-heading-sm font-semibold text-gray-700 mb-1">{title}</h3>
      {description && (
        <p className="text-body-sm text-gray-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
