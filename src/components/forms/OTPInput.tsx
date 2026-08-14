import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';
import { cn } from '../../utils/cn';

export interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  autoFocus?: boolean;
  className?: string;
}

/**
 * OTPInput — accessible 6-digit style entry.
 * Uncontrolled by default; supply `value` to control externally.
 */
export function OTPInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled,
  error,
  label,
  autoFocus,
  className,
}: OTPInputProps) {
  const [internal, setInternal] = useState<string>(value ?? '');
  const digits = value ?? internal;

  const refs = useMemo(
    () => Array.from({ length }, () => createRef<HTMLInputElement>()),
    [length]
  );
  const didAutoFocus = useRef(false);

  useEffect(() => {
    if (autoFocus && !didAutoFocus.current) {
      refs[0].current?.focus();
      didAutoFocus.current = true;
    }
  }, [autoFocus, refs]);

  const commit = useCallback(
    (next: string) => {
      const clean = next.replace(/\D/g, '').slice(0, length);
      if (value === undefined) setInternal(clean);
      onChange?.(clean);
      if (clean.length === length) onComplete?.(clean);
    },
    [length, onChange, onComplete, value]
  );

  const handleChange = (idx: number, ch: string) => {
    const next = digits.split('');
    next[idx] = ch.slice(-1);
    const joined = next.join('').padEnd(idx + 1, '').slice(0, length);
    commit(joined);
    if (ch && idx < length - 1) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[idx] && idx > 0) {
        refs[idx - 1].current?.focus();
      } else if (digits[idx]) {
        const next = digits.split('');
        next[idx] = '';
        commit(next.join(''));
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      refs[idx - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      refs[idx + 1].current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!text) return;
    commit(text);
    const target = Math.min(text.length, length - 1);
    refs[target].current?.focus();
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <p className="mb-2 text-label font-medium text-ink-800">{label}</p>
      )}
      <div
        className="flex items-center justify-between gap-2 sm:gap-3"
        role="group"
        aria-label="One time passcode"
      >
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={refs[i]}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={digits[i] ?? ''}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={!!error || undefined}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={cn(
              'h-12 w-11 sm:h-14 sm:w-12 flex-1 rounded-md border bg-surface-raised text-center',
              'font-serif text-h2 text-ink-900 tracking-widest outline-none',
              'transition-shadow duration-150 ease-gentle',
              error
                ? 'border-danger/60 focus:shadow-[0_0_0_3px_rgba(168,56,46,0.18)]'
                : 'border-ink-200 focus:border-forest-400 focus:shadow-focus',
              disabled && 'opacity-70 cursor-not-allowed'
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-caption text-danger">{error}</p>}
    </div>
  );
}
