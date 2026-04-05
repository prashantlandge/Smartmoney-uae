import type { ReactNode } from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASSES: Record<ContainerSize, string> = {
  sm: 'max-w-content-sm',
  md: 'max-w-content-md',
  lg: 'max-w-content-lg',
  xl: 'max-w-content-xl',
};

interface ContainerProps {
  size?: ContainerSize;
  children: ReactNode;
  className?: string;
}

export default function Container({ size = 'xl', children, className = '' }: ContainerProps) {
  return (
    <div className={`${SIZE_CLASSES[size]} mx-auto px-4 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}
