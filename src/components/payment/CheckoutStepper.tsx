import { cn } from '../../utils/cn';

export function CheckoutStepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-1 sm:gap-2">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-caption font-bold transition',
                  done || active
                    ? 'bg-forest-800 text-cream-50'
                    : 'bg-ink-100 text-ink-500'
                )}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={cn(
                  'text-[10px] sm:text-caption font-medium text-center leading-tight truncate max-w-full',
                  active ? 'text-forest-900' : 'text-ink-500'
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1 min-w-[12px] rounded-full mb-4',
                  i < current ? 'bg-forest-600' : 'bg-ink-200'
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
