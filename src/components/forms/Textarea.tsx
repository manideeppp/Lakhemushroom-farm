import { forwardRef, useId, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
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
            className="mb-2 block text-label font-medium text-ink-800"
          >
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={!!error || undefined}
          className={cn(
            'w-full min-h-[120px] rounded-xl border bg-surface-raised px-3.5 py-3',
            'text-body text-ink-900 placeholder:text-ink-400 outline-none ring-0 shadow-none resize-y',
            'transition-[border-color] duration-150 ease-gentle',
            error
              ? 'border-danger/55 focus:border-danger'
              : 'border-ink-200/80 focus:border-forest-600',
            className
          )}
          {...rest}
        />
        {hint && !error && (
          <p className="mt-1.5 text-caption text-ink-500">{hint}</p>
        )}
        {error && <p className="mt-1.5 text-caption text-danger">{error}</p>}
      </div>
    );
  }
);
