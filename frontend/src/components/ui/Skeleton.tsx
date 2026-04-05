interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

const ROUNDED_MAP = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

export default function Skeleton({
  width,
  height = 16,
  rounded = 'lg',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`shimmer ${ROUNDED_MAP[rounded]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 sm:p-7 space-y-5">
      <div className="flex items-center gap-4">
        <Skeleton width={56} height={56} rounded="full" />
        <div className="flex-1 space-y-2.5">
          <Skeleton height={18} width="60%" />
          <Skeleton height={14} width="40%" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
        <Skeleton height={48} rounded="xl" />
        <Skeleton height={48} rounded="xl" />
        <Skeleton height={48} rounded="xl" />
        <Skeleton height={48} rounded="xl" />
      </div>
      <Skeleton height={14} width="100%" />
      <Skeleton height={14} width="75%" />
      <div className="flex gap-3 pt-3">
        <Skeleton height={44} width={140} rounded="xl" />
        <Skeleton height={44} width={120} rounded="xl" />
        <Skeleton height={44} width={110} rounded="xl" />
      </div>
    </div>
  );
}
