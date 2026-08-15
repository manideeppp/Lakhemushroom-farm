import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatINR } from '../../utils/format';
import type { CartItem } from '../../context/CartContext';

export function OrderSummaryCard({
  items,
  subtotal,
  shipping,
  discount = 0,
  couponCode,
  total,
  footer,
  className,
}: {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
  total: number;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <Card padding="lg" elevated className={className}>
      <h3 className="font-serif text-h3 text-ink-900">Order summary</h3>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={`${it.type}-${it.id}`} className="flex gap-2 text-small">
            <span className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-forest-50">
              {it.image && (
                <img
                  src={it.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-ink-900 font-medium">{it.name}</p>
              <p className="text-caption text-ink-500">
                <Badge variant={it.type === 'training' ? 'online' : 'fresh'}>
                  {it.type === 'training' ? 'Training' : 'Product'}
                </Badge>{' '}
                × {it.qty}
              </p>
            </div>
            <span className="text-ink-900 font-medium shrink-0">
              {formatINR(it.price * it.qty)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-1.5 border-t border-ink-100 pt-3 text-small text-ink-700">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="font-medium text-ink-900">{formatINR(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="font-medium text-ink-900">
            {shipping === 0 ? 'Free' : formatINR(shipping)}
          </dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-forest-800">
            <dt>Coupon{couponCode ? ` (${couponCode})` : ''}</dt>
            <dd className="font-medium">−{formatINR(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-ink-100 pt-2 mt-2">
          <dt className="text-body font-semibold text-ink-900">Total</dt>
          <dd className="text-price font-semibold text-ink-900">
            {formatINR(total)}
          </dd>
        </div>
      </dl>
      {footer}
    </Card>
  );
}
