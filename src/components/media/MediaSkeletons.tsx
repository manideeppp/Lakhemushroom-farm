import { cn } from '../../utils/cn';

export function ImageSkeleton({
  aspect = 'aspect-[4/3]',
  className,
}: {
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'skeleton-shimmer w-full rounded-lg bg-ink-100/60',
        aspect,
        className
      )}
      aria-label="Loading image"
      role="status"
    />
  );
}

export function VideoSkeleton({
  aspect = 'aspect-video',
  className,
}: {
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'skeleton-shimmer w-full rounded-lg bg-ink-100/60',
        aspect,
        className
      )}
      aria-label="Loading video"
      role="status"
    />
  );
}
