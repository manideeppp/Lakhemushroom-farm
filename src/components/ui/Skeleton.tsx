import { cn } from '../../utils/cn';

export interface SkeletonProps {
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'pill' | 'full';
  as?: 'div' | 'span';
  'aria-label'?: string;
}

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  pill: 'rounded-pill',
  full: 'rounded-full',
};

export function Skeleton({
  className,
  rounded = 'md',
  as: Tag = 'div',
  'aria-label': ariaLabel = 'Loading',
}: SkeletonProps) {
  return (
    <Tag
      role="status"
      aria-label={ariaLabel}
      className={cn(
        'skeleton-shimmer block bg-ink-100/60',
        roundedMap[rounded],
        className
      )}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)} aria-label="Loading text">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
          rounded="sm"
        />
      ))}
    </div>
  );
}

export function SkeletonImage({
  className,
  aspect = 'aspect-[4/3]',
}: {
  className?: string;
  aspect?: string;
}) {
  return (
    <Skeleton
      className={cn('w-full', aspect, className)}
      rounded="lg"
      aria-label="Loading image"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-surface-raised border border-ink-100 rounded-lg p-4 space-y-3',
        className
      )}
      aria-label="Loading card"
    >
      <SkeletonImage aspect="aspect-square" />
      <Skeleton className="h-4 w-3/4" rounded="sm" />
      <Skeleton className="h-3 w-1/2" rounded="sm" />
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-16" rounded="sm" />
        <Skeleton className="h-8 w-20" rounded="md" />
      </div>
    </div>
  );
}

export function SkeletonSection({ className }: { className?: string }) {
  return (
    <section className={cn('space-y-4', className)} aria-label="Loading section">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" rounded="sm" />
        <Skeleton className="h-4 w-16" rounded="sm" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </section>
  );
}
