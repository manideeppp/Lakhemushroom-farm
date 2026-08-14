import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeOnOverlay?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) dialogRef.current?.focus();
  }, [open]);

  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center animate-fade-in"
      role="presentation"
      onClick={closeOnOverlay ? onClose : undefined}
    >
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px]" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-desc' : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKey}
        className={cn(
          'relative w-full sm:w-auto sm:min-w-[420px] bg-surface-raised sm:rounded-xl rounded-t-2xl',
          'border border-ink-100 shadow-raised',
          'sm:animate-slide-up animate-sheet-in',
          'flex flex-col max-h-[92vh]',
          sizeMap[size],
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-2">
          <div className="min-w-0">
            {title && (
              <h2
                id="modal-title"
                className="text-h3 font-serif text-ink-900 leading-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="modal-desc"
                className="mt-1 text-small text-ink-600"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="shrink-0 rounded-md p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-5 py-3 overflow-y-auto">{children}</div>
        {footer && (
          <div className="border-t border-ink-100 bg-cream-50 px-5 py-3 rounded-b-xl sm:rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export interface ConfirmationModalProps
  extends Omit<ModalProps, 'children' | 'footer'> {
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  tone?: 'brand' | 'danger';
  loading?: boolean;
  message?: ReactNode;
}

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'brand',
  loading,
}: ConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      {message && <p className="text-small text-ink-700">{message}</p>}
    </Modal>
  );
}
