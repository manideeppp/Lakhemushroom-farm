import type { ReactNode } from 'react';
import { CheckCircle2, Inbox, Loader2, XCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

function BaseState({
  title,
  message,
  icon,
  action,
  className,
  iconTone,
}: StateProps & { iconTone: string }) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-md flex-col items-center justify-center gap-3 rounded-lg border border-ink-100 bg-surface-raised px-6 py-10 text-center',
        className
      )}
      role="status"
    >
      <span
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          iconTone
        )}
      >
        {icon}
      </span>
      {title && (
        <h3 className="text-h3 font-serif text-ink-900">{title}</h3>
      )}
      {message && (
        <p className="text-small text-ink-600 max-w-xs">{message}</p>
      )}
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export function EmptyState(props: StateProps) {
  return (
    <BaseState
      {...props}
      iconTone="bg-ink-100 text-ink-500"
      icon={props.icon ?? <Inbox className="h-6 w-6" aria-hidden />}
      title={props.title ?? 'Nothing here yet'}
      message={
        props.message ??
        'Once there is something to show, it will appear right here.'
      }
    />
  );
}

export function SuccessState(props: StateProps) {
  return (
    <BaseState
      {...props}
      iconTone="bg-forest-50 text-success"
      icon={props.icon ?? <CheckCircle2 className="h-6 w-6" aria-hidden />}
      title={props.title ?? 'All done'}
      message={props.message ?? 'Your action completed successfully.'}
    />
  );
}

export function ErrorState(props: StateProps) {
  return (
    <BaseState
      {...props}
      iconTone="bg-danger/10 text-danger"
      icon={props.icon ?? <XCircle className="h-6 w-6" aria-hidden />}
      title={props.title ?? 'Something went wrong'}
      message={
        props.message ??
        'We couldn’t complete that just now. Please try again in a moment.'
      }
    />
  );
}

export function LoadingState({
  message = 'Loading…',
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-10 text-ink-600',
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand" aria-hidden />
      <p className="text-small">{message}</p>
    </div>
  );
}
