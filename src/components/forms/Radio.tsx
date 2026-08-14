import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, hint, id, className, disabled, ...rest },
  ref
) {
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
          type="radio"
          disabled={disabled}
          className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border border-ink-300 bg-surface-raised checked:border-brand focus-visible:shadow-focus"
          {...rest}
        />
        <span className="pointer-events-none h-2.5 w-2.5 rounded-full bg-brand opacity-0 peer-checked:opacity-100" />
      </span>
      <span className="min-w-0">
        {label && <span className="block text-small text-ink-800">{label}</span>}
        {hint && <span className="block text-caption text-ink-500">{hint}</span>}
      </span>
    </label>
  );
});
