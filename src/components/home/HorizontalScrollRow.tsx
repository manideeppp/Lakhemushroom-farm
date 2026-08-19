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
        'flex items-stretch gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2',
        '-mx-4 px-4 sm:mx-0 sm:px-0 sm:gap-4',
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
        'snap-start shrink-0 flex w-[min(260px,calc(100vw-2rem))] sm:w-[280px]',
        className
      )}
    >
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
