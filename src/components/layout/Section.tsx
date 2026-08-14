import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  tone?: 'default' | 'alt' | 'brand';
}

const sizeMap = {
  sm: 'py-6 sm:py-8',
  md: 'py-10 sm:py-14',
  lg: 'py-14 sm:py-20',
};

const toneMap = {
  default: '',
  alt: 'bg-cream-100',
  brand: 'bg-forest-900 text-cream-50',
};

export function Section({
  size = 'md',
  tone = 'default',
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      className={cn(sizeMap[size], toneMap[tone], className)}
      {...rest}
    >
      {children}
    </section>
  );
}

export interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-2 mb-5 sm:mb-8',
        align === 'center' && 'items-center text-center',
        action && 'sm:flex-row sm:items-end sm:justify-between sm:gap-6',
        className
      )}
    >
      <div className={cn('flex flex-col gap-1', align === 'center' && 'items-center')}>
        {eyebrow && (
          <span className="text-label uppercase tracking-widest text-forest-600 font-medium">
            {eyebrow}
          </span>
        )}
        <h2 className="font-serif text-h1 sm:text-display text-ink-900 leading-[1.15]">
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'text-body text-ink-600 max-w-prose',
              align === 'center' && 'mx-auto'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
