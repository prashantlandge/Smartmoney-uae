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
    <div className="card space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width={48} height={48} rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
      <Skeleton height={12} width="100%" />
      <Skeleton height={12} width="80%" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Skeleton height={40} rounded="xl" />
        <Skeleton height={40} rounded="xl" />
        <Skeleton height={40} rounded="xl" />
        <Skeleton height={40} rounded="xl" />
      </div>
      <Skeleton height={44} rounded="xl" className="mt-2" />
    </div>
  );
}
