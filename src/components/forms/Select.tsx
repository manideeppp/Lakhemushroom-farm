import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, containerClassName, id, required, children, ...rest },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-label font-medium text-ink-800"
        >
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      <div
        className={cn(
          'relative flex items-center rounded-xl border bg-surface-raised h-12 shadow-sm',
          'transition-shadow duration-150 ease-gentle',
          error
            ? 'border-danger/60 focus-within:shadow-[0_0_0_3px_rgba(168,56,46,0.18)]'
            : 'border-ink-200/90 focus-within:border-forest-500 focus-within:shadow-focus'
        )}
      >
        <select
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error || undefined}
          className={cn(
            'w-full appearance-none bg-transparent px-3 pr-9 text-body text-ink-900 outline-none',
            'disabled:cursor-not-allowed disabled:opacity-70',
            className
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 h-4 w-4 text-ink-500"
          aria-hidden
        />
      </div>
      {hint && !error && (
        <p className="mt-1 text-caption text-ink-500">{hint}</p>
      )}
      {error && <p className="mt-1 text-caption text-danger">{error}</p>}
    </div>
  );
});
