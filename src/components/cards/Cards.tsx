import {
  ArrowRight,
  Clock,
  GraduationCap,
  Leaf,
  Minus,
  Plus,
  Scale,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge, type BadgeVariant } from '../ui/Badge';
import { ResponsiveImage } from '../media/ResponsiveImage';
import { formatINR } from '../../utils/format';
import { cn } from '../../utils/cn';
import { useCart } from '../../context/CartContext';

/** Shared catalog card footprint — product & training must match. */
export const CATALOG_CARD_SHELL =
  'h-full flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 shadow-[0_4px_22px_rgba(30,53,32,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(30,53,32,0.11)]';

export const CATALOG_IMAGE_ASPECT = 'aspect-[3/2]';

const CATALOG_BODY = 'flex flex-col px-4 pt-3 pb-3';

const CATALOG_TITLE =
  'font-serif text-[1.125rem] leading-[1.35] text-forest-900 line-clamp-2 min-h-[2.7rem]';

const CATALOG_DESCRIPTOR =
  'mt-1 h-5 text-[0.8125rem] leading-5 text-ink-500 font-sans line-clamp-1';

const CATALOG_META_ROW =
  'mt-2 h-5 flex items-center gap-2 text-[0.75rem] text-forest-800 font-sans';

function formatWeightLabel(unit?: string): string {
  if (!unit) return '';
  const match = unit.match(/(\d+)\s*g/i);
  if (match) return `${match[1]} g`;
  return unit.replace(/\s*pack$/i, '').trim();
}

function CatalogMetaDivider() {
  return (
    <span
      className="h-3.5 w-px border-l border-dashed border-ink-300/70"
      aria-hidden
    />
  );
}

function CatalogPriceFooter({
  priceLabel,
  priceSub,
  action,
}: {
  priceLabel: string;
  priceSub?: string;
  action: React.ReactNode;
}) {
  return (
  <>
    <div className="mt-2 border-t border-cream-200/90" />
    <div className="mt-2 flex items-end justify-between gap-2">
      <div className="min-w-0">
        <p className="font-serif text-[1.35rem] leading-none tracking-tight text-forest-900">
          {priceLabel}
        </p>
        {priceSub && (
          <p className="mt-0.5 text-[10px] leading-tight text-ink-400 font-sans">
            {priceSub}
          </p>
        )}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  </>
  );
}

function ImageOverlayBadge({
  label,
  tone = 'fresh',
}: {
  label: string;
  tone?: 'fresh' | 'natural' | 'format-online' | 'format-offline';
}) {
  const toneClass =
    tone === 'fresh'
      ? 'bg-sage-100/95 border-sage-200/90 text-forest-800'
      : tone === 'natural'
        ? 'bg-cream-50/95 border-cream-300/90 text-forest-800'
        : tone === 'format-online'
          ? 'bg-sage-100/95 border-sage-200/90 text-forest-800'
          : 'bg-cream-100/95 border-cream-300/90 text-forest-800';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] shadow-sm backdrop-blur-[2px]',
        toneClass
      )}
    >
      {(tone === 'fresh' || tone === 'natural') && (
        <Leaf className="h-3 w-3 shrink-0" aria-hidden />
      )}
      {label}
    </span>
  );
}

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
  onAdd?: () => void;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  unit,
  image,
  imageAlt,
  badges = [],
  inStock = true,
  onClick,
  className,
  onAdd,
}: ProductCardProps) {
  const { items, addItem, updateQty } = useCart();
  const cartQty =
    items.find((i) => i.id === id && i.type === 'product')?.qty ?? 0;

  const showFresh = badges.includes('fresh') || badges.includes('best-seller');
  const showNatural = badges.includes('natural') || badges.includes('premium');

  const descriptor = 'Farm fresh · Naturally grown';

  const weightLabel = formatWeightLabel(unit);

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
      <div className={cn('relative shrink-0 overflow-hidden', CATALOG_IMAGE_ASPECT)}>
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
        {(showFresh || showNatural) && (
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {showFresh && <ImageOverlayBadge label="Fresh" tone="fresh" />}
            {showNatural && <ImageOverlayBadge label="Natural" tone="natural" />}
          </div>
        )}
      </div>

      <div className={CATALOG_BODY}>
        <h3 className={CATALOG_TITLE}>{name}</h3>
        <p className={CATALOG_DESCRIPTOR}>{descriptor}</p>
        <div className={CATALOG_META_ROW}>
          {weightLabel ? (
            <span className="inline-flex items-center gap-1">
              <Scale className="h-3.5 w-3.5 text-forest-600" aria-hidden />
              <span className="font-medium">{weightLabel}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Scale className="h-3.5 w-3.5 text-forest-600" aria-hidden />
              <span className="font-medium">Farm pack</span>
            </span>
          )}
          <CatalogMetaDivider />
          <span className="inline-flex items-center gap-1 text-forest-700">
            <Leaf className="h-3.5 w-3.5" aria-hidden />
            Pesticide free
          </span>
        </div>

        <CatalogPriceFooter
          priceLabel={formatINR(price)}
          priceSub="Inclusive of all taxes"
          action={
            !inStock ? (
              <span className="text-caption text-danger shrink-0 font-sans">
                Out of stock
              </span>
            ) : cartQty > 0 ? (
              <div
                className="flex h-10 items-center rounded-full border border-forest-200/80 bg-white shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="flex h-10 w-9 items-center justify-center text-forest-800 hover:bg-forest-50 rounded-l-full"
                  onClick={(e) => handleQtyChange(e, -1)}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-7 text-center text-small font-semibold text-forest-900 tabular-nums font-sans">
                  {cartQty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="flex h-10 w-9 items-center justify-center text-forest-800 hover:bg-forest-50 rounded-r-full"
                  onClick={(e) => handleQtyChange(e, 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label={`Add ${name} to cart`}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-forest-800 px-4 text-[0.8125rem] font-semibold text-cream-50 shadow-sm hover:bg-forest-900 transition-colors font-sans"
                onClick={handleAdd}
              >
                <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden />
                <span>+ Add</span>
              </button>
            )
          }
        />
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
  subtitle?: string;
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
  subtitle,
  onClick,
  cta = 'View',
  className,
}: TrainingCardProps) {
  const isOnline = format === 'Online';
  const descriptor =
    subtitle?.trim() ||
    (isOnline ? 'Learn from home · Expert-led' : 'On-farm · Hands-on practice');
  const durationLabel = duration?.trim() || 'Flexible schedule';

  return (
    <article
      className={cn(CATALOG_CARD_SHELL, onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <div className={cn('relative shrink-0 overflow-hidden', CATALOG_IMAGE_ASPECT)}>
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
        <div className="absolute left-2.5 top-2.5">
          <ImageOverlayBadge
            label={format}
            tone={isOnline ? 'format-online' : 'format-offline'}
          />
        </div>
      </div>

      <div className={CATALOG_BODY}>
        <h3 className={CATALOG_TITLE}>{title}</h3>
        <p className={CATALOG_DESCRIPTOR}>{descriptor}</p>
        <div className={CATALOG_META_ROW}>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-forest-600" aria-hidden />
            <span className="font-medium">{durationLabel}</span>
          </span>
          <CatalogMetaDivider />
          <span className="inline-flex items-center gap-1 text-forest-700">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden />
            Expert-led
          </span>
        </div>

        <CatalogPriceFooter
          priceLabel={price !== undefined ? formatINR(price) : 'Custom quote'}
          priceSub={
            price !== undefined
              ? 'Programme fee · taxes as applicable'
              : 'Inclusive of all taxes'
          }
          action={
            <button
              type="button"
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-forest-800 px-4 text-[0.8125rem] font-semibold text-cream-50 shadow-sm hover:bg-forest-900 transition-colors font-sans"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              <span>{cta}</span>
            </button>
          }
        />
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
