import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  title?: string;
  children?: ReactNode;
  className?: string;
}

export function MobileDrawer({
  open,
  onClose,
  side = 'left',
  title,
  children,
  className,
}: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const isLeft = side === 'left';

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex animate-fade-in"
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
          'relative h-full w-[86%] max-w-[340px] bg-surface-raised shadow-raised',
          'border-ink-100 flex flex-col',
          isLeft
            ? 'mr-auto border-r animate-[slideUp_.25s_ease-out] rtl:animate-none'
            : 'ml-auto border-l',
          className
        )}
        style={{
          animation: `${isLeft ? 'drawerInLeft' : 'drawerInRight'} 260ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
        }}
      >
        <div className="flex items-center justify-between px-4 h-[60px] border-b border-ink-100 pt-safe">
          {title ? (
            <h2 className="text-h3 font-serif text-ink-900">{title}</h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
      <style>{`
        @keyframes drawerInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes drawerInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>,
    document.body
  );
}
