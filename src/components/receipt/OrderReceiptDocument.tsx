import type { Order } from '../../types/order';
import { formatDate } from '../../utils/ids';
import { formatINR } from '../../utils/format';
import { config } from '../../lib/config';
import { LakheLogo } from '../navigation/LakheLogo';
import { cn } from '../../utils/cn';

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
    <div className="mt-3 flex h-9 items-end justify-end gap-[2px]" aria-hidden>
      {bars.map((w, i) => (
        <span
          key={i}
          className="bg-ink-800"
          style={{ width: `${w}px`, height: `${10 + (i % 4) * 3}px` }}
        />
      ))}
    </div>
  );
}

function documentTitle(status: Order['status']): string {
  if (status === 'approved') return 'Official Receipt';
  return 'Payment Acknowledgement';
}

function statusLabel(status: Order['status']): string {
  switch (status) {
    case 'approved':
      return 'Payment verified';
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
        'relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card print:rounded-none print:border print:border-ink-300 print:shadow-none',
        className
      )}
    >
      {/* Status ribbon */}
      <div
        className={cn(
          'px-6 py-2.5 text-center text-caption font-semibold uppercase tracking-[0.14em]',
          isApproved
            ? 'bg-forest-900 text-cream-50'
            : 'bg-clay-600 text-cream-50'
        )}
      >
        {documentTitle(order.status)}
        {!isApproved && ' · Subject to payment verification'}
      </div>

      <div className="p-6 sm:p-8 print:p-6">
        {/* Letterhead */}
        <header className="border-b-2 border-forest-900 pb-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <LakheLogo size="lg" />
              <p className="mt-2 text-small font-medium text-forest-800">
                Lakhe Mushroom Farm
              </p>
              <p className="text-caption text-ink-600 mt-0.5">
                Fresh · Natural · Farm-grown
              </p>
              <address className="mt-4 not-italic text-caption text-ink-600 space-y-1 leading-relaxed">
                <p>{config.business.address}</p>
                <p>{config.business.phone}</p>
                <p>{config.business.email}</p>
              </address>
            </div>

            <div className="text-right shrink-0 min-w-[200px]">
              <p className="font-serif text-2xl tracking-[0.12em] text-ink-900">
                RECEIPT
              </p>
              <p className="mt-1 text-caption text-ink-500 uppercase tracking-widest">
                Tax invoice summary
              </p>
              <dl className="mt-4 space-y-2 text-caption border-t border-ink-200 pt-4">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Receipt no.</dt>
                  <dd className="font-mono font-semibold text-ink-900">
                    {order.order_ref}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Date</dt>
                  <dd className="font-medium text-ink-900">
                    {formatDate(order.created_at)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Time</dt>
                  <dd className="font-medium text-ink-900">
                    {formatOrderTime(order.created_at)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 items-center">
                  <dt className="text-ink-500">Status</dt>
                  <dd>
                    <span
                      className={cn(
                        'inline-flex rounded px-2 py-0.5 text-caption font-semibold uppercase tracking-wide',
                        isApproved
                          ? 'bg-forest-100 text-forest-900'
                          : 'bg-clay-100 text-clay-800'
                      )}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-500">Payment</dt>
                  <dd className="font-medium text-ink-900">UPI</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        {/* Bill to */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-ink-200 bg-cream-50/50 p-4">
            <p className="text-caption font-bold uppercase tracking-widest text-ink-500">
              Bill to
            </p>
            <p className="mt-2 font-serif text-h3 text-ink-900">
              {order.customer_name}
            </p>
            <p className="mt-1 text-small text-ink-600">{order.customer_email}</p>
            {order.customer_phone && (
              <p className="text-small text-ink-600">{order.customer_phone}</p>
            )}
            {order.delivery_address && (
              <p className="mt-2 text-small text-ink-700 leading-relaxed border-t border-ink-200/80 pt-2">
                {order.delivery_address}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-ink-200 bg-white p-4 sm:text-right">
            <p className="text-caption font-bold uppercase tracking-widest text-ink-500">
              Order reference
            </p>
            <p className="mt-2 font-mono text-h3 text-ink-900 tracking-wide">
              {order.order_ref}
            </p>
            <ReceiptBarcode value={order.order_ref} />
          </div>
        </div>

        {/* Line items */}
        <div className="mt-6 overflow-hidden rounded-lg border border-ink-200">
          <table className="w-full text-small">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50 text-caption uppercase tracking-wide text-ink-600">
                <th className="px-4 py-3 text-left font-semibold w-10">#</th>
                <th className="px-4 py-3 text-left font-semibold">Description</th>
                <th className="px-4 py-3 text-center font-semibold w-16">Qty</th>
                <th className="px-4 py-3 text-right font-semibold w-28">
                  Rate (₹)
                </th>
                <th className="px-4 py-3 text-right font-semibold w-28">
                  Amount (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {order.items.map((it, idx) => (
                <tr key={it.id} className="text-ink-900 bg-white">
                  <td className="px-4 py-3.5 text-ink-500 tabular-nums">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium leading-snug">{it.name}</p>
                    <p className="text-caption text-ink-500 capitalize mt-0.5">
                      {it.item_type}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-center tabular-nums">
                    {it.qty}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {formatINR(it.unit_price)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums">
                    {formatINR(it.unit_price * it.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-6">
          <div className="text-caption text-ink-500 max-w-xs leading-relaxed">
            <p>
              {isApproved
                ? 'This receipt confirms payment received for the order listed above.'
                : 'This document acknowledges your payment submission. Final confirmation will be issued upon verification.'}
            </p>
            <p className="mt-2 text-ink-400">All amounts in Indian Rupees (INR).</p>
          </div>
          <div className="w-full sm:w-72 rounded-lg border border-ink-200 bg-cream-50/40 p-4 space-y-2 text-small">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span className="tabular-nums text-ink-900">
                {formatINR(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-ink-600">
              <span>Shipping</span>
              <span className="tabular-nums text-ink-900">
                {order.shipping === 0 ? 'Free' : formatINR(order.shipping)}
              </span>
            </div>
            {(order.discount ?? 0) > 0 && (
              <div className="flex justify-between text-forest-800">
                <span>
                  Discount
                  {order.coupon_code ? ` (${order.coupon_code})` : ''}
                </span>
                <span className="tabular-nums">−{formatINR(order.discount!)}</span>
              </div>
            )}
            <div className="border-t-2 border-forest-900 pt-3 mt-2">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-body-lg font-semibold text-ink-900">
                  Grand total
                </span>
                <span className="font-serif text-h2 text-forest-900 tabular-nums">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature block */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 border-t border-dashed border-ink-300 pt-8">
          <div>
            <p className="text-caption text-ink-500 uppercase tracking-widest">
              Customer
            </p>
            <p className="mt-6 border-b border-ink-300 pb-1 text-small text-ink-700">
              {order.customer_name}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-caption text-ink-500 uppercase tracking-widest">
              For Lakhe Mushroom Farm
            </p>
            <p className="mt-6 border-b border-ink-300 pb-1 text-small text-ink-700 sm:max-w-[200px] sm:ml-auto">
              Authorized signatory
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-ink-200 bg-ink-50 px-6 py-4 text-center text-caption text-ink-500">
        <p className="font-medium text-ink-700">
          Thank you for choosing Lakhe Mushroom Farm
        </p>
        <p className="mt-1">
          Questions? {config.business.phone} · {config.business.email}
        </p>
        <p className="mt-2 text-ink-400">
          Computer-generated receipt · {order.order_ref}
        </p>
      </div>
    </div>
  );
}
