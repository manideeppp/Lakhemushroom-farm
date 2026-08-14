import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'icon'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-sans font-medium ' +
  'rounded-md select-none whitespace-nowrap ' +
  'transition-[background,color,border,box-shadow,transform] duration-150 ease-gentle ' +
  'disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px ' +
  'focus-visible:outline-none focus-visible:shadow-focus';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-cream-50 hover:bg-brand-deep active:bg-brand-deep border border-brand-deep/40',
  secondary:
    'bg-sage-100 text-forest-800 hover:bg-sage-200 border border-sage-200',
  outline:
    'bg-transparent text-brand border border-forest-300 hover:bg-forest-50',
  ghost:
    'bg-transparent text-forest-800 hover:bg-forest-50 border border-transparent',
  icon:
    'bg-transparent text-forest-800 hover:bg-forest-50 border border-transparent aspect-square',
  danger:
    'bg-danger text-cream-50 hover:brightness-95 border border-danger/40',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-small',
  md: 'h-11 px-5 text-body',
  lg: 'h-12 px-6 text-body-lg',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 w-9 p-0',
  md: 'h-11 w-11 p-0',
  lg: 'h-12 w-12 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    type = 'button',
    ...rest
  },
  ref
) {
  const isIcon = variant === 'icon';
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        baseClasses,
        variantClasses[variant],
        isIcon ? iconSizeClasses[size] : sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {!isIcon && children}
      {isIcon && !loading && children}
      {!loading && rightIcon && (
        <span className="inline-flex shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});
