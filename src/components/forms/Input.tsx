import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    success,
    leftIcon,
    rightIcon,
    className,
    containerClassName,
    id,
    required,
    disabled,
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy: string[] = [];
  if (hint) describedBy.push(`${inputId}-hint`);
  if (error) describedBy.push(`${inputId}-error`);
  if (success) describedBy.push(`${inputId}-success`);

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
          'flex items-center gap-2 rounded-xl border bg-surface-raised px-3.5 h-12',
          'shadow-sm transition-[border-color,box-shadow] duration-150 ease-gentle',
          error
            ? 'border-danger/60 focus-within:ring-2 focus-within:ring-danger/15'
            : success
              ? 'border-forest-300 focus-within:ring-2 focus-within:ring-forest-500/20'
              : 'border-ink-200/90 focus-within:border-forest-500 focus-within:ring-2 focus-within:ring-forest-500/20',
          disabled && 'bg-ink-50 opacity-70 cursor-not-allowed'
        )}
      >
        {leftIcon && (
          <span className="text-ink-400 shrink-0">{leftIcon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy.join(' ') || undefined}
          className={cn(
            'flex-1 min-w-0 bg-transparent outline-none text-body text-ink-900 placeholder:text-ink-400',
            'disabled:cursor-not-allowed',
            className
          )}
          {...rest}
        />
        {rightIcon && (
          <span className="text-ink-400 shrink-0">{rightIcon}</span>
        )}
      </div>
      {hint && !error && !success && (
        <p id={`${inputId}-hint`} className="mt-1 text-caption text-ink-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-caption text-danger">
          {error}
        </p>
      )}
      {success && (
        <p id={`${inputId}-success`} className="mt-1 text-caption text-success">
          {success}
        </p>
      )}
    </div>
  );
});
