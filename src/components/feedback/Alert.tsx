import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
  className?: string;
  icon?: ReactNode;
}

const toneMap: Record<
  AlertTone,
  { wrap: string; iconColor: string; Icon: typeof Info }
> = {
  info: {
    wrap: 'bg-info/10 border-info/30 text-ink-800',
    iconColor: 'text-info',
    Icon: Info,
  },
  success: {
    wrap: 'bg-forest-50 border-forest-200 text-forest-900',
    iconColor: 'text-success',
    Icon: CheckCircle2,
  },
  warning: {
    wrap: 'bg-gold-50 border-gold-200 text-ink-800',
    iconColor: 'text-warning',
    Icon: TriangleAlert,
  },
  danger: {
    wrap: 'bg-danger/5 border-danger/30 text-ink-800',
    iconColor: 'text-danger',
    Icon: AlertCircle,
  },
};

export function Alert({
  tone = 'info',
  title,
  children,
  onClose,
  className,
  icon,
}: AlertProps) {
  const { wrap, iconColor, Icon } = toneMap[tone];
  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-md border px-4 py-3 text-small',
        wrap,
        className
      )}
    >
      <span className={cn('mt-0.5 shrink-0', iconColor)}>
        {icon ?? <Icon className="h-4 w-4" aria-hidden />}
      </span>
      <div className="min-w-0 flex-1">
        {title && (
          <p className="font-semibold text-ink-900 leading-5">{title}</p>
        )}
        {children && (
          <div className={cn('text-ink-700 leading-5', title && 'mt-0.5')}>
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 rounded-sm p-1 text-ink-500 hover:text-ink-800 hover:bg-ink-100/60"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
