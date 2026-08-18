import { cn } from '../../utils/cn';

function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 24"
      aria-hidden
      className={cn('h-5 w-10 text-forest-300/80', className)}
      fill="currentColor"
    >
      <path d="M4 20c8-2 14-8 18-16 2 10 8 14 16 16-10 0-18-6-22-14-2 4-6 8-14 10z" />
    </svg>
  );
}

export function GrowSectionEmblem({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <Sprig className="scale-x-[-1]" />
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream-50 shadow-subtle"
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="currentColor">
          <path d="M8 21c0-4.4 3.6-8 8-8s8 3.6 8 8H8z" />
          <rect x="12" y="21" width="8" height="6" rx="1.5" />
        </svg>
      </span>
      <Sprig />
    </div>
  );
}
