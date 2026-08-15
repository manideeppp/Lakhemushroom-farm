import { cn } from '../../utils/cn';
import { Skeleton, SkeletonCard, SkeletonText } from '../ui/Skeleton';

export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6',
        className
      )}
      aria-label="Loading products"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function TrainingGridSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6', className)}
      aria-label="Loading training"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-ink-100 bg-surface-raised"
        >
          <Skeleton className="aspect-[4/3] w-full !rounded-none" rounded="lg" />
          <div className="p-4 space-y-3">
            <div className="flex justify-between gap-2">
              <Skeleton className="h-5 w-20 rounded-pill" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GalleryGridSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4',
        className
      )}
      aria-label="Loading gallery"
      role="status"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'mb-3 sm:mb-4 w-full break-inside-avoid',
            i % 3 === 0 ? 'aspect-[4/5]' : i % 3 === 1 ? 'aspect-square' : 'aspect-[3/4]'
          )}
          rounded="lg"
        />
      ))}
    </div>
  );
}

export function OrderListSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)} aria-label="Loading orders" role="status">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-ink-100 bg-surface-raised p-4 space-y-3"
        >
          <div className="flex justify-between gap-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20 rounded-pill" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading profile" role="status">
      <div className="rounded-lg border border-ink-100 bg-surface-raised p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-pill" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-ink-100 bg-surface-raised p-5 space-y-2"
          >
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
