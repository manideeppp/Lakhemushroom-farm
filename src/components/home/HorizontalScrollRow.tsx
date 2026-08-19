import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface HorizontalScrollRowProps {
  children: ReactNode;
  className?: string;
}

/** Manual horizontal scroll — pair with `HorizontalScrollItem` wrappers. */
export function HorizontalScrollRow({
  children,
  className,
}: HorizontalScrollRowProps) {
  return (
    <div
      className={cn(
        'flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2',
        '-mx-4 px-4 sm:mx-0 sm:px-0',
        className
      )}
    >
      {children}
    </div>
  );
}

export function HorizontalScrollItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'snap-start shrink-0 w-[280px] max-w-[280px] h-full',
        className
      )}
    >
      {children}
    </div>
  );
}
