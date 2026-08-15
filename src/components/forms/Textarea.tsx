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
            className="mb-1.5 block text-label font-medium text-ink-800"
          >
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <div
          className={cn(
            'form-field-shell',
            error && 'border-danger/50 focus-within:border-danger/60'
          )}
        >
          <textarea
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={!!error || undefined}
            className={cn(
              'form-field-inner w-full min-h-[120px] px-3.5 py-3',
              'text-body text-ink-900 placeholder:text-ink-400 outline-none resize-y',
              'transition-shadow duration-150 ease-gentle',
              error
                ? 'focus:ring-2 focus:ring-danger/15'
                : 'focus:ring-2 focus:ring-forest-500/15',
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
