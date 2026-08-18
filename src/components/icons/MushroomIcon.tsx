import { cn } from '../../utils/cn';

export function MushroomIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('h-4 w-4', className)}
      fill="currentColor"
    >
      <path d="M6 18c0-3.3 2.7-6 6-6s6 2.7 6 6H6z" />
      <rect x="9" y="18" width="6" height="4" rx="1" />
    </svg>
  );
}
