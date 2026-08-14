import { Plus, ShoppingCart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge, type BadgeVariant } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { formatINR } from '../../utils/format';
import { cn } from '../../utils/cn';

export interface ProductCardProps {
  name: string;
  category?: string;
  price: number;
  image?: string;
  imageAlt?: string;
  badges?: BadgeVariant[];
  inStock?: boolean;
  onAdd?: () => void;
  onClick?: () => void;
  className?: string;
}

export function ProductCard({
  name,
  category,
  price,
  image,
  imageAlt,
  badges = [],
  inStock = true,
  onAdd,
  onClick,
  className,
}: ProductCardProps) {
  return (
    <Card
      as="article"
      padding="none"
      interactive={!!onClick}
      onClick={onClick}
      className={cn('overflow-hidden flex flex-col', className)}
    >
      <div className="relative">
        {image ? (
          <ResponsiveImage
            src={image}
            alt={imageAlt ?? name}
            aspect="aspect-square"
            rounded="none"
            fit="contain"
            containerClassName="bg-cream-50"
          />
        ) : (
          <div className="aspect-square w-full bg-forest-50 flex items-center justify-center text-forest-400">
            <span className="text-caption">No image</span>
          </div>
        )}
        {badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {badges.map((b) => (
              <Badge key={b} variant={b} size="sm" />
            ))}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-1 flex-col gap-1">
        {category && (
          <span className="text-caption uppercase tracking-widest text-forest-600 font-medium">
            {category}
          </span>
        )}
        <h3 className="text-body font-serif font-semibold text-ink-900 leading-tight line-clamp-2">
          {name}
        </h3>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-caption text-ink-500">Price</span>
            <span className="text-price font-semibold text-ink-900">
              {formatINR(price)}
            </span>
          </div>
          {onAdd && (
            <Button
              variant="primary"
              size="sm"
              aria-label={`Add ${name} to cart`}
              disabled={!inStock}
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add
            </Button>
          )}
        </div>
        {!inStock && (
          <span className="text-caption text-danger mt-1">Out of stock</span>
        )}
      </div>
    </Card>
  );
}

export interface TrainingCardProps {
  title: string;
  format?: 'Online' | 'Offline' | 'Hybrid';
  duration?: string;
  price?: number;
  image?: string;
  imageAlt?: string;
  features?: string[];
  onClick?: () => void;
  cta?: string;
  className?: string;
}

export function TrainingCard({
  title,
  format = 'Online',
  duration,
  price,
  image,
  imageAlt,
  features = [],
  onClick,
  cta = 'View Details',
  className,
}: TrainingCardProps) {
  return (
    <Card as="article" padding="none" className={cn('overflow-hidden flex flex-col', className)}>
      {image ? (
        <ResponsiveImage
          src={image}
          alt={imageAlt ?? title}
          aspect="aspect-[4/3]"
          rounded="none"
          fit="contain"
          containerClassName="bg-cream-50"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-forest-50" aria-hidden />
      )}
      <div className="p-4 flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={format === 'Online' ? 'online' : 'offline'} />
          {price !== undefined && (
            <span className="text-price font-semibold text-brand">
              {formatINR(price)}
            </span>
          )}
        </div>
        <h3 className="text-h3 font-serif text-ink-900 leading-tight">{title}</h3>
        {features.length > 0 && (
          <ul className="mt-1 space-y-1.5 text-small text-ink-700">
            {features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500"
                  aria-hidden
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {duration && (
            <span className="text-caption text-ink-500">{duration}</span>
          )}
          <Button variant="primary" size="sm" onClick={onClick}>
            {cta}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card padding="lg" className={cn('flex flex-col gap-3', className)}>
      {icon && (
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700">
          {icon}
        </span>
      )}
      <h3 className="text-h3 font-serif text-ink-900">{title}</h3>
      {description && (
        <p className="text-small text-ink-600 leading-relaxed">{description}</p>
      )}
    </Card>
  );
}

export interface StoryCardProps {
  eyebrow?: string;
  title: string;
  excerpt: string;
  image?: string;
  imageAlt?: string;
  onClick?: () => void;
  className?: string;
}

export function StoryCard({
  eyebrow,
  title,
  excerpt,
  image,
  imageAlt,
  onClick,
  className,
}: StoryCardProps) {
  return (
    <Card
      as="article"
      padding="none"
      interactive={!!onClick}
      onClick={onClick}
      className={cn('overflow-hidden flex flex-col', className)}
    >
      {image && (
        <ResponsiveImage
          src={image}
          alt={imageAlt ?? title}
          aspect="aspect-[16/10]"
          rounded="none"
        />
      )}
      <div className="p-4 flex flex-col gap-2">
        {eyebrow && (
          <span className="text-label uppercase tracking-widest text-forest-600 font-medium">
            {eyebrow}
          </span>
        )}
        <h3 className="text-h3 font-serif text-ink-900 leading-tight">{title}</h3>
        <p className="text-small text-ink-600 leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </div>
    </Card>
  );
}

export interface StatCardProps {
  value: string;
  label: string;
  hint?: string;
  className?: string;
}

export function StatCard({ value, label, hint, className }: StatCardProps) {
  return (
    <Card padding="lg" className={cn('flex flex-col gap-1', className)}>
      <span className="text-display font-serif text-brand leading-none">
        {value}
      </span>
      <span className="text-small font-medium text-ink-800">{label}</span>
      {hint && <span className="text-caption text-ink-500">{hint}</span>}
    </Card>
  );
}

export interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  tone?: 'default' | 'brand' | 'muted';
  className?: string;
}

export function InfoCard({
  title,
  children,
  action,
  tone = 'default',
  className,
}: InfoCardProps) {
  return (
    <Card
      padding="lg"
      className={cn(
        tone === 'brand' && 'bg-forest-50 border-forest-200',
        tone === 'muted' && 'bg-cream-100 border-cream-200',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 font-serif text-ink-900">{title}</h3>
        {action}
      </div>
      <div className="mt-2 text-small text-ink-700 leading-relaxed">
        {children}
      </div>
    </Card>
  );
}

export interface MediaCardProps {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  overlay?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MediaCard({
  title,
  subtitle,
  image,
  imageAlt,
  overlay,
  onClick,
  className,
}: MediaCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative block overflow-hidden rounded-lg border border-ink-100 bg-ink-900 text-left focus-visible:outline-none focus-visible:shadow-focus',
        className
      )}
    >
      {image ? (
        <ResponsiveImage
          src={image}
          alt={imageAlt ?? title}
          aspect="aspect-[3/4]"
          rounded="none"
          className="opacity-90"
        />
      ) : (
        <div className="aspect-[3/4] w-full bg-forest-800" />
      )}
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 text-cream-50">
        {subtitle && (
          <p className="text-caption uppercase tracking-widest opacity-80">
            {subtitle}
          </p>
        )}
        <h3 className="text-h3 font-serif leading-tight">{title}</h3>
      </div>
      {overlay}
    </button>
  );
}

export interface OrderCardProps {
  orderRef: string;
  date: string;
  itemCount: number;
  total: number;
  status: 'pending' | 'approved' | 'processing' | 'delivered';
  onClick?: () => void;
  className?: string;
}

const orderStatusToBadge: Record<OrderCardProps['status'], BadgeVariant> = {
  pending: 'pending',
  approved: 'approved',
  processing: 'processing',
  delivered: 'delivered',
};

export function OrderCard({
  orderRef,
  date,
  itemCount,
  total,
  status,
  onClick,
  className,
}: OrderCardProps) {
  return (
    <Card
      padding="md"
      interactive={!!onClick}
      onClick={onClick}
      className={cn('flex items-start gap-3', className)}
    >
      <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest-50 text-forest-700">
        <ShoppingCart className="h-4 w-4" aria-hidden />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-serif text-body font-semibold text-ink-900">
            {orderRef}
          </span>
          <Badge variant={orderStatusToBadge[status]} />
        </div>
        <p className="text-caption text-ink-500 mt-0.5">
          {date} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
        <p className="mt-1 text-price font-semibold text-ink-900">
          {formatINR(total)}
        </p>
      </div>
    </Card>
  );
}
