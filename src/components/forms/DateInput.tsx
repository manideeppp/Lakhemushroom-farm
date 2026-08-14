import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface DateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  function DateInput(
    { label, hint, error, className, containerClassName, id, required, ...rest },
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
            'flex items-center gap-2 rounded-md border bg-surface-raised px-3 h-11',
            'transition-shadow duration-150 ease-gentle',
            error
              ? 'border-danger/60 focus-within:shadow-[0_0_0_3px_rgba(168,56,46,0.18)]'
              : 'border-ink-200 focus-within:border-forest-400 focus-within:shadow-focus'
          )}
        >
          <Calendar className="h-4 w-4 text-ink-500" aria-hidden />
          <input
            ref={ref}
            id={inputId}
            type="date"
            required={required}
            aria-invalid={!!error || undefined}
            className={cn(
              'flex-1 bg-transparent outline-none text-body text-ink-900',
              className
            )}
            {...rest}
          />
        </div>
        {hint && !error && (
          <p className="mt-1 text-caption text-ink-500">{hint}</p>
        )}
        {error && <p className="mt-1 text-caption text-danger">{error}</p>}
      </div>
    );
  }
);
