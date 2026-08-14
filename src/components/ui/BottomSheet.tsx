import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * BottomSheet — mobile-first sheet that slides up from the bottom.
 * On desktop it centres like a modest dialog.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center animate-fade-in"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative w-full max-w-xl bg-surface-raised rounded-t-2xl border-t border-ink-100',
          'shadow-raised animate-sheet-in',
          className
        )}
      >
        <div className="pt-2.5 flex justify-center">
          <span className="h-1 w-10 rounded-pill bg-ink-200" aria-hidden />
        </div>
        {title && (
          <div className="flex items-center justify-between px-5 pt-3 pb-2">
            <h2 className="text-h3 font-serif text-ink-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="px-5 pb-safe pt-2 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
