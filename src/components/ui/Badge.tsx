import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant =
  | 'fresh'
  | 'best-seller'
  | 'premium'
  | 'natural'
  | 'ready-to-eat'
  | 'online'
  | 'offline'
  | 'pending'
  | 'approved'
  | 'processing'
  | 'delivered'
  | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  fresh: 'bg-forest-50 text-forest-700 border-forest-200',
  'best-seller': 'bg-gold-50 text-gold-600 border-gold-200',
  premium: 'bg-clay-50 text-clay-500 border-clay-200',
  natural: 'bg-sage-100 text-sage-700 border-sage-200',
  'ready-to-eat': 'bg-cream-200 text-clay-500 border-clay-200',
  online: 'bg-forest-50 text-forest-700 border-forest-200',
  offline: 'bg-ink-100 text-ink-500 border-ink-200',
  pending: 'bg-gold-50 text-gold-600 border-gold-200',
  approved: 'bg-forest-50 text-forest-700 border-forest-200',
  processing: 'bg-sage-100 text-sage-700 border-sage-200',
  delivered: 'bg-forest-100 text-forest-800 border-forest-300',
  neutral: 'bg-ink-100 text-ink-700 border-ink-200',
};

const variantLabel: Record<BadgeVariant, string> = {
  fresh: 'Fresh',
  'best-seller': 'Best Seller',
  premium: 'Premium',
  natural: 'Natural',
  'ready-to-eat': 'Ready to Eat',
  online: 'Online',
  offline: 'Offline',
  pending: 'Pending Verification',
  approved: 'Approved',
  processing: 'Processing',
  delivered: 'Delivered',
  neutral: '',
};

export function Badge({
  variant = 'neutral',
  children,
  className,
  icon,
  size = 'sm',
}: BadgeProps) {
  const sizeCls =
    size === 'sm'
      ? 'text-caption px-2 py-0.5'
      : 'text-label px-2.5 py-1';

  const label = children ?? variantLabel[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill border font-medium tracking-wide',
        sizeCls,
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {label}
    </span>
  );
}
