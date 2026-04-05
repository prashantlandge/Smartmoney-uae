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
  rounded = 'md',
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
    <div className="bg-white rounded-card border border-surface-200 p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton width={48} height={48} rounded="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="55%" />
          <Skeleton height={12} width="35%" />
        </div>
        <Skeleton height={36} width={100} rounded="md" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
        <Skeleton height={40} rounded="md" />
        <Skeleton height={40} rounded="md" />
        <Skeleton height={40} rounded="md" />
        <Skeleton height={40} rounded="md" />
        <Skeleton height={40} rounded="md" className="hidden sm:block" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton height={34} width={100} rounded="md" />
        <Skeleton height={34} width={90} rounded="md" />
      </div>
    </div>
  );
}
