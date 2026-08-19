import { Leaf, Minus, Plus, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge, type BadgeVariant } from '../ui/Badge';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { formatINR } from '../../utils/format';
import { cn } from '../../utils/cn';
import { useCart } from '../../context/CartContext';

/** Shared card shell — product & training cards use identical footprint. */
const CATALOG_CARD_SHELL =
  'h-full flex flex-col overflow-hidden rounded-2xl border border-cream-200/90 bg-cream-50 shadow-[0_2px_12px_rgba(30,53,32,0.06)] transition-shadow hover:shadow-[0_6px_20px_rgba(30,53,32,0.1)]';

const CATALOG_IMAGE_ASPECT = 'aspect-[4/3]';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  unit?: string;
  shortDescription?: string;
  image?: string;
  imageAlt?: string;
  badges?: BadgeVariant[];
  inStock?: boolean;
  onClick?: () => void;
  className?: string;
  detailHint?: string;
  /** Legacy: if set, overrides internal cart add */
  onAdd?: () => void;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  unit,
  shortDescription,
  image,
  imageAlt,
  badges = [],
  inStock = true,
  onClick,
  className,
  detailHint = 'Tap for nutrition & full details',
  onAdd,
}: ProductCardProps) {
  const { items, addItem, updateQty } = useCart();
  const cartQty =
    items.find((i) => i.id === id && i.type === 'product')?.qty ?? 0;

  const displayBadges = badges.filter((b) =>
    ['fresh', 'natural', 'premium', 'best-seller'].includes(b)
  ).slice(0, 2);

  const descriptor =
    shortDescription?.split('.')[0]?.trim() || 'Farm fresh · Naturally grown';

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!inStock) return;
    if (onAdd) {
      onAdd();
      return;
    }
    addItem(
      {
        id,
        type: 'product',
        name,
        price,
        image,
        slug,
        unit,
      },
      1
    );
  }

  function handleQtyChange(e: React.MouseEvent, delta: number) {
    e.stopPropagation();
    const next = cartQty + delta;
    if (next <= 0) {
      updateQty(id, 'product', 0);
    } else {
      updateQty(id, 'product', next);
    }
  }

  return (
    <article
      className={cn(CATALOG_CARD_SHELL, onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <div className={cn('relative overflow-hidden', CATALOG_IMAGE_ASPECT)}>
        {image ? (
          <img
            src={image}
            alt={imageAlt ?? name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-sage-100 flex items-center justify-center text-forest-400">
            <span className="text-caption">No image</span>
          </div>
        )}
        {displayBadges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {displayBadges.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/85 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-forest-800 shadow-sm backdrop-blur-sm"
              >
                {b === 'fresh' || b === 'natural' ? (
                  <Leaf className="h-3 w-3" aria-hidden />
                ) : null}
                {b === 'fresh'
                  ? 'Fresh'
                  : b === 'natural'
                    ? 'Natural'
                    : b === 'premium'
                      ? 'Premium'
                      : 'Best Seller'}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4 min-h-[148px]">
        <h3 className="font-serif text-[1.05rem] leading-tight text-forest-900 line-clamp-2">
          {name}
        </h3>
        <p className="text-caption text-ink-500 leading-snug line-clamp-1">
          {descriptor}
        </p>
        {unit && (
          <p className="text-caption text-forest-700/80 flex items-center gap-1.5">
            <span className="font-medium">{unit}</span>
            <span className="text-ink-300">·</span>
            <span className="inline-flex items-center gap-1 text-forest-700">
              <Leaf className="h-3 w-3" aria-hidden />
              Pesticide free
            </span>
          </p>
        )}
        {onClick && (
          <p className="text-[11px] text-forest-600/75 leading-snug">{detailHint}</p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <p className="font-serif text-[1.2rem] leading-none text-forest-900">
              {formatINR(price)}
            </p>
            <p className="mt-0.5 text-[10px] text-ink-400">Inclusive of all taxes</p>
          </div>

          {!inStock ? (
            <span className="text-caption text-danger shrink-0">Out of stock</span>
          ) : cartQty > 0 ? (
            <div
              className="flex items-center rounded-full border border-forest-200 bg-white shadow-sm shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Decrease quantity"
                className="flex h-9 w-9 items-center justify-center text-forest-800 hover:bg-forest-50 rounded-l-full"
                onClick={(e) => handleQtyChange(e, -1)}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-small font-semibold text-forest-900 tabular-nums">
                {cartQty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="flex h-9 w-9 items-center justify-center text-forest-800 hover:bg-forest-50 rounded-r-full"
                onClick={(e) => handleQtyChange(e, 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Add ${name} to cart`}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-4 py-2 text-small font-semibold text-cream-50 shadow-sm hover:bg-forest-900 transition-colors shrink-0"
              onClick={handleAdd}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
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
  detailHint?: string;
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
  detailHint = 'Tap for programme details',
}: TrainingCardProps) {
  return (
    <article
      className={cn(CATALOG_CARD_SHELL, onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <div className={cn('relative overflow-hidden', CATALOG_IMAGE_ASPECT)}>
        {image ? (
          <img
            src={image}
            alt={imageAlt ?? title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full bg-sage-100" aria-hidden />
        )}
        <div className="absolute left-2 top-2">
          <Badge variant={format === 'Online' ? 'online' : 'offline'} size="sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 sm:p-4 min-h-[148px]">
        <h3 className="font-serif text-[1.05rem] leading-tight text-forest-900 line-clamp-2">
          {title}
        </h3>
        {onClick && (
          <p className="text-[11px] text-forest-600/75 leading-snug">{detailHint}</p>
        )}
        {features.length > 0 && (
          <ul className="space-y-1 text-caption text-ink-600 line-clamp-3">
            {features.slice(0, 2).map((f) => (
              <li key={f} className="flex items-start gap-1.5">
                <span
                  className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest-500"
                  aria-hidden
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            {price !== undefined ? (
              <>
                <p className="font-serif text-[1.2rem] leading-none text-forest-900">
                  {formatINR(price)}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-400">
                  {duration ?? 'Full programme'}
                </p>
              </>
            ) : (
              <p className="text-small font-medium text-forest-800">
                {duration ?? 'Custom programme'}
              </p>
            )}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-4 py-2 text-small font-semibold text-cream-50 shadow-sm hover:bg-forest-900 transition-colors shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            {cta}
          </button>
        </div>
      </div>
    </article>
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
