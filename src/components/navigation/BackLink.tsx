import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

export function BackLink({
  to,
  onClick,
  children,
  className,
}: {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const classes = cn(
    'mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 -ml-1',
    'text-small font-medium text-ink-600 hover:text-forest-800 hover:bg-forest-50/80',
    'focus-visible:outline-none focus-visible:shadow-focus',
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        <ArrowLeft className="h-4 w-4 shrink-0" />
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <ArrowLeft className="h-4 w-4 shrink-0" />
      {children}
    </button>
  );
}
