import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CheckCircle2, Info, TriangleAlert, X, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastItem {
  id: string;
  tone: ToastTone;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2);
      const item: ToastItem = { duration: 4000, ...t, id };
      setItems((prev) => [...prev, item]);
      if (item.duration && item.duration > 0) {
        const timer = setTimeout(() => dismiss(id), item.duration);
        timers.current.set(id, timer);
      }
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport items={items} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

const toneMap: Record<
  ToastTone,
  { icon: typeof Info; iconColor: string; ring: string }
> = {
  info: { icon: Info, iconColor: 'text-info', ring: 'ring-info/30' },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-success',
    ring: 'ring-forest-200',
  },
  warning: {
    icon: TriangleAlert,
    iconColor: 'text-warning',
    ring: 'ring-gold-200',
  },
  danger: {
    icon: AlertCircle,
    iconColor: 'text-danger',
    ring: 'ring-danger/30',
  },
};

function ToastViewport({
  items,
  onDismiss,
}: {
  items: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+80px)] sm:pb-6 sm:items-end sm:pr-6"
    >
      {items.map((t) => {
        const { icon: Icon, iconColor, ring } = toneMap[t.tone];
        return (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto w-full max-w-sm animate-slide-up',
              'flex items-start gap-3 rounded-lg bg-surface-raised border border-ink-100',
              'shadow-raised ring-1 px-4 py-3',
              ring
            )}
          >
            <span className={cn('mt-0.5 shrink-0', iconColor)}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              {t.title && (
                <p className="text-body font-semibold text-ink-900 leading-5">
                  {t.title}
                </p>
              )}
              <p className="text-small text-ink-700 leading-5">{t.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-sm p-1 text-ink-500 hover:text-ink-800 hover:bg-ink-100/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
