import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, hint, error, id, className, disabled, ...rest }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-start gap-2.5 cursor-pointer select-none',
          disabled && 'cursor-not-allowed opacity-70',
          className
        )}
      >
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error || undefined}
            className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-sm border border-ink-300 bg-surface-raised checked:border-brand checked:bg-brand focus-visible:shadow-focus"
            {...rest}
          />
          <Check
            className="pointer-events-none h-3.5 w-3.5 text-cream-50 opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>
        <span className="min-w-0">
          {label && (
            <span className="block text-small text-ink-800">{label}</span>
          )}
          {hint && !error && (
            <span className="block text-caption text-ink-500">{hint}</span>
          )}
          {error && (
            <span className="block text-caption text-danger">{error}</span>
          )}
        </span>
      </label>
    );
  }
);
