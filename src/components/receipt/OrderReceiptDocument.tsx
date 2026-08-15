import type { Order } from '../../types/order';
import { formatDate } from '../../utils/ids';
import { formatINR } from '../../utils/format';
import { config } from '../../lib/config';
import { LakheLogo } from '../navigation/LakheLogo';
import { productImages } from '../../data/media';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { cn } from '../../utils/cn';
import {
  Headphones,
  Instagram,
  Leaf,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';

function formatOrderTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function ReceiptBarcode({ value }: { value: string }) {
  const bars = value
    .split('')
    .map((c) => (c.charCodeAt(0) % 3) + 1)
    .slice(0, 48);

  return (
    <div className="mt-2 flex h-10 items-end justify-center gap-[2px] px-2" aria-hidden>
      {bars.map((w, i) => (
        <span
          key={i}
          className="bg-ink-800"
          style={{ width: `${w}px`, height: `${12 + (i % 4) * 4}px` }}
        />
      ))}
    </div>
  );
}

function statusLabel(status: Order['status']): string {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending verification';
  }
}

export function OrderReceiptDocument({
  order,
  className,
}: {
  order: Order;
  className?: string;
}) {
  const isApproved = order.status === 'approved';

  return (
    <div
      className={cn(
        'relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-ink-100 bg-[#faf8f4] shadow-subtle print:rounded-none print:border-0 print:shadow-none',
        className
      )}
    >
      {/* Decorative leaf accent */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-20 print:opacity-10"
        aria-hidden
      >
        <svg viewBox="0 0 120 120" className="h-full w-full text-forest-600">
          <path
            fill="currentColor"
            d="M100 20c-30 10-50 35-55 65 25-5 45-20 55-45C95 35 100 20 100 20zM40 90c15-25 35-45 60-55-5 30-25 50-60 55z"
          />
        </svg>
      </div>

      <div className="relative p-6 sm:p-8 print:p-6">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-ink-200/60 pb-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <LakheLogo size="lg" />
            </div>
            <p className="mt-1 text-caption italic text-forest-700">
              Fresh. Natural. Healthy.
            </p>
            <ul className="mt-4 space-y-2 text-caption text-ink-600">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-forest-700" />
                <span>{config.business.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-forest-700" />
                <span>{config.business.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0 text-forest-700" />
                <span>{config.business.email}</span>
              </li>
            </ul>
          </div>

          <div className="text-right shrink-0">
            <p className="font-serif text-3xl tracking-[0.2em] text-ink-900">
              RECEIPT
            </p>
            <div className="mx-auto mt-2 h-px w-24 bg-ink-300" />
            <dl className="mt-4 space-y-1.5 text-caption text-ink-600">
              <div className="flex justify-between gap-4">
                <dt>Receipt No.</dt>
                <dd className="font-medium text-ink-900">{order.order_ref}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Order Date</dt>
                <dd className="font-medium text-ink-900">
                  {formatDate(order.created_at)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Order Time</dt>
                <dd className="font-medium text-ink-900">
                  {formatOrderTime(order.created_at)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 items-center">
                <dt>Order Status</dt>
                <dd>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-caption font-medium',
                      isApproved
                        ? 'bg-forest-100 text-forest-800'
                        : 'bg-clay-100 text-clay-700'
                    )}
                  >
                    {statusLabel(order.status)}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </header>

        {/* Billed to + reference */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 rounded-xl bg-cream-100/90 border border-cream-200/80 p-4 sm:p-5">
          <div>
            <p className="text-caption font-semibold uppercase tracking-widest text-ink-500">
              Billed to
            </p>
            <p className="mt-2 font-serif text-h3 text-ink-900">
              {order.customer_name}
            </p>
            <p className="mt-1 text-small text-ink-600">{order.customer_email}</p>
            {order.customer_phone && (
              <p className="text-small text-ink-600">{order.customer_phone}</p>
            )}
            {order.delivery_address && (
              <p className="mt-2 text-small text-ink-700 leading-relaxed">
                {order.delivery_address}
              </p>
            )}
          </div>
          <div className="sm:text-right">
            <p className="text-caption font-semibold uppercase tracking-widest text-ink-500">
              Order reference
            </p>
            <p className="mt-2 font-serif text-h3 text-ink-900">
              {order.order_ref}
            </p>
            <ReceiptBarcode value={order.order_ref} />
          </div>
        </div>

        {/* Items table */}
        <div className="mt-6 overflow-hidden rounded-xl border border-ink-200/80">
          <table className="w-full text-small">
            <thead>
              <tr className="bg-forest-900 text-cream-50 text-caption uppercase tracking-wide">
                <th className="px-3 py-2.5 text-left font-medium w-8">#</th>
                <th className="px-3 py-2.5 text-left font-medium">Item</th>
                <th className="px-3 py-2.5 text-left font-medium">Type</th>
                <th className="px-3 py-2.5 text-center font-medium">Qty</th>
                <th className="px-3 py-2.5 text-right font-medium">Unit price</th>
                <th className="px-3 py-2.5 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 bg-white/60">
              {order.items.map((it, idx) => (
                <tr key={it.id} className="text-ink-900">
                  <td className="px-3 py-3 text-ink-500">{idx + 1}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-lg object-cover border border-ink-100"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-cream-100 border border-ink-100" />
                      )}
                      <span className="font-medium leading-snug">{it.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 capitalize text-ink-600">
                    {it.item_type}
                  </td>
                  <td className="px-3 py-3 text-center">{it.qty}</td>
                  <td className="px-3 py-3 text-right">
                    {formatINR(it.unit_price)}
                  </td>
                  <td className="px-3 py-3 text-right font-medium">
                    {formatINR(it.unit_price * it.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-small">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span className="text-ink-900">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-600">
              <span>Shipping</span>
              <span className="text-ink-900">
                {order.shipping === 0 ? 'Free' : formatINR(order.shipping)}
              </span>
            </div>
            {(order.discount ?? 0) > 0 && (
              <div className="flex justify-between text-forest-800">
                <span>
                  Coupon{order.coupon_code ? ` (${order.coupon_code})` : ''}
                </span>
                <span>−{formatINR(order.discount!)}</span>
              </div>
            )}
            <div className="border-t border-dashed border-ink-300 pt-3 mt-2">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-body-lg text-ink-900">
                  Total paid
                </span>
                <span className="font-serif text-h2 text-ink-900">
                  {formatINR(order.total)}
                </span>
              </div>
              <p className="mt-1 text-caption text-ink-500 text-right">
                (All amounts are in INR)
              </p>
            </div>
          </div>
        </div>

        {/* Note + mushroom art */}
        <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] items-end">
          <div className="rounded-xl border border-cream-200 bg-cream-50/80 p-4 max-w-sm">
            <div className="flex items-start gap-2">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-800">
                <Leaf className="h-4 w-4" />
              </span>
              <div>
                <p className="text-caption font-semibold uppercase tracking-widest text-ink-500">
                  Note
                </p>
                <p className="mt-1 text-small text-ink-700 leading-relaxed">
                  {isApproved
                    ? 'Thank you for your order. This receipt confirms your payment.'
                    : 'We have received your payment and are verifying it. This is your submission proof.'}
                </p>
                <p className="mt-4 font-serif italic text-ink-800">
                  Lakhe Mushroom Farm
                </p>
                <p className="text-caption text-ink-500">For Lakhe Mushroom Farm</p>
              </div>
            </div>
          </div>
          <img
            src={productImages.freshOyster}
            alt=""
            className="hidden sm:block h-28 w-auto object-contain opacity-90 print:h-24"
            aria-hidden
          />
        </div>
      </div>

      {/* Trust bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-forest-900 px-6 py-5 text-cream-50 sm:px-8">
        <div className="flex gap-3">
          <Leaf className="h-5 w-5 shrink-0 text-cream-200" />
          <div>
            <p className="font-serif text-body font-medium">Fresh & naturally grown</p>
            <p className="mt-0.5 text-caption text-cream-200/85">
              High-quality mushrooms directly from our farm.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-cream-200" />
          <div>
            <p className="font-serif text-body font-medium">100% quality assured</p>
            <p className="mt-0.5 text-caption text-cream-200/85">
              Clean, healthy & hygienically packed products.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Headphones className="h-5 w-5 shrink-0 text-cream-200" />
          <div>
            <p className="font-serif text-body font-medium">Need help?</p>
            <p className="mt-0.5 text-caption text-cream-200/85">
              We&apos;re here for you. {config.business.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Thank you strip */}
      <div className="flex flex-col items-center gap-3 border-t border-forest-800 bg-cream-100 px-6 py-4 text-center">
        <p className="text-caption font-semibold uppercase tracking-[0.12em] text-forest-900">
          Thank you for choosing Lakhe Mushroom Farm!
        </p>
        <div className="flex items-center gap-4 text-forest-800">
          <a
            href="https://www.instagram.com/lakhemushroomfarm"
            target="_blank"
            rel="noreferrer"
            className="hover:text-forest-600"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={`https://wa.me/${config.business.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-forest-600"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}