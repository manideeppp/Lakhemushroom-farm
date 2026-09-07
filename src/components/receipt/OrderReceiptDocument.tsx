import type { Order } from '../../types/order';
import { formatDate } from '../../utils/ids';
import { formatINR } from '../../utils/format';
import { SHIPPING_FEE_NOTE } from '../../utils/shipping';
import { config } from '../../lib/config';
import { LakheLogo } from '../navigation/LakheLogo';
import { cn } from '../../utils/cn';

const RECEIPT_EMAIL = 'lakhe.tatya@gmail.com';

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
    .slice(0, 32);

  return (
    <div className="mt-3 flex h-8 max-w-full items-end justify-start gap-[2px] overflow-hidden sm:justify-end" aria-hidden>
      {bars.map((w, i) => (
        <span
          key={i}
          className="bg-ink-800 shrink-0"
          style={{ width: `${w}px`, height: `${8 + (i % 4) * 3}px` }}
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
  const hasProductItems = order.items.some((it) => it.item_type === 'product');

  return (
    <div
      className={cn(
        'relative mx-auto w-full min-w-0 max-w-3xl overflow-hidden rounded-xl border border-ink-200 bg-cream-50 shadow-card print:rounded-none print:border print:border-ink-300 print:bg-cream-50 print:shadow-none',
        className
      )}
    >
      <div
        className={cn(
          'px-4 py-2 text-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] sm:px-6 sm:py-2.5 sm:text-caption',
          isApproved ? 'bg-forest-900 text-cream-50' : 'bg-clay-600 text-cream-50'
        )}
      >
        {documentTitle(order.status)}
        {!isApproved && ' · Subject to payment verification'}
      </div>

      <div className="p-4 sm:p-8 print:p-6">
        <header className="border-b-2 border-forest-900 pb-5 sm:pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <LakheLogo size="lg" />
              <p className="mt-2 text-small font-medium text-forest-800">
                Lakhe Mushroom Farm
              </p>
              <p className="text-caption text-ink-600 mt-0.5">
                Fresh · Natural · Farm-grown
              </p>
              <address className="mt-3 not-italic text-caption text-ink-600 space-y-1 leading-relaxed break-words">
                <p>{config.business.address}</p>
                <p>{config.business.phone}</p>
                <p className="break-all">{RECEIPT_EMAIL}</p>
              </address>
            </div>

            <div className="w-full min-w-0 sm:w-auto sm:max-w-[240px] sm:text-right">
              <p className="font-serif text-xl tracking-[0.1em] text-ink-900 sm:text-2xl">
                RECEIPT
              </p>
              <p className="mt-1 text-caption text-ink-500 uppercase tracking-widest">
                Tax invoice summary
              </p>
              <dl className="mt-3 space-y-2 text-caption border-t border-ink-200 pt-3 sm:mt-4 sm:pt-4">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500 shrink-0">Receipt no.</dt>
                  <dd className="font-mono font-semibold text-ink-900 text-right break-all">
                    {order.order_ref}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Date</dt>
                  <dd className="font-medium text-ink-900">
                    {formatDate(order.created_at)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Time</dt>
                  <dd className="font-medium text-ink-900">
                    {formatOrderTime(order.created_at)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 items-center">
                  <dt className="text-ink-500">Status</dt>
                  <dd>
                    <span
                      className={cn(
                        'inline-flex rounded px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide sm:text-caption',
                        isApproved
                          ? 'bg-forest-100 text-forest-900'
                          : 'bg-clay-100 text-clay-800'
                      )}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-500">Payment</dt>
                  <dd className="font-medium text-ink-900">UPI</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2">
          <div className="rounded-lg border border-ink-200 bg-cream-100/60 p-3.5 sm:p-4">
            <p className="text-caption font-bold uppercase tracking-widest text-ink-500">
              Bill to
            </p>
            <p className="mt-2 font-serif text-h3 text-ink-900 break-words">
              {order.customer_name}
            </p>
            <p className="mt-1 text-small text-ink-600 break-all">
              {order.customer_email}
            </p>
            {order.customer_phone && (
              <p className="text-small text-ink-600">{order.customer_phone}</p>
            )}
            {order.delivery_address && (
              <p className="mt-2 text-small text-ink-700 leading-relaxed border-t border-ink-200/80 pt-2 break-words">
                {order.delivery_address}
              </p>
            )}
          </div>
          <div className="rounded-lg border border-ink-200 bg-cream-100/80 p-3.5 sm:p-4 sm:text-right">
            <p className="text-caption font-bold uppercase tracking-widest text-ink-500">
              Order reference
            </p>
            <p className="mt-2 font-mono text-h3 text-ink-900 tracking-wide break-all">
              {order.order_ref}
            </p>
            <ReceiptBarcode value={order.order_ref} />
          </div>
        </div>

        {/* Mobile line items */}
        <ul className="mt-5 divide-y divide-ink-100 rounded-lg border border-ink-200 sm:hidden">
          {order.items.map((it, idx) => (
            <li key={it.id} className="bg-cream-50 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-caption text-ink-500">#{idx + 1}</p>
                  <p className="font-medium text-ink-900 leading-snug break-words">
                    {it.name}
                  </p>
                  <p className="text-caption text-ink-500 capitalize mt-0.5">
                    {it.item_type}
                  </p>
                </div>
                <p className="font-semibold text-ink-900 tabular-nums shrink-0">
                  {formatINR(it.unit_price * it.qty)}
                </p>
              </div>
              <div className="mt-2 flex justify-between text-caption text-ink-600">
                <span>Qty {it.qty}</span>
                <span>Rate {formatINR(it.unit_price)}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop table */}
        <div className="mt-6 hidden overflow-x-auto rounded-lg border border-ink-200 sm:block">
          <table className="w-full min-w-[520px] text-small">
            <thead>
              <tr className="border-b border-ink-200 bg-cream-100 text-caption uppercase tracking-wide text-ink-600">
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
                <tr key={it.id} className="text-ink-900 bg-cream-50">
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

        <div className="mt-5 flex flex-col gap-5 sm:mt-6 sm:flex-row sm:justify-between sm:gap-6">
          <div className="text-caption text-ink-500 leading-relaxed">
            <p>
              {isApproved
                ? 'This receipt confirms payment received for the order listed above.'
                : 'This document acknowledges your payment submission. Final confirmation will be issued upon verification.'}
            </p>
            <p className="mt-2 text-ink-400">All amounts in Indian Rupees (INR).</p>
          </div>
          <div className="w-full rounded-lg border border-ink-200 bg-cream-100/70 p-3.5 space-y-2 text-small sm:w-72 sm:p-4">
            <div className="flex justify-between text-ink-600">
              <span>Subtotal</span>
              <span className="tabular-nums text-ink-900">
                {formatINR(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-ink-600">
              <span className="shrink-0">Shipping</span>
              <span className="text-right text-ink-900 max-w-[11rem] sm:max-w-[14rem]">
                {hasProductItems ? (
                  <span className="text-caption leading-snug">{SHIPPING_FEE_NOTE}</span>
                ) : order.shipping === 0 ? (
                  '—'
                ) : (
                  <span className="tabular-nums">{formatINR(order.shipping)}</span>
                )}
              </span>
            </div>
            {(order.discount ?? 0) > 0 && (
              <div className="flex justify-between text-forest-800 gap-3">
                <span className="min-w-0">
                  Discount
                  {order.coupon_code ? ` (${order.coupon_code})` : ''}
                </span>
                <span className="tabular-nums shrink-0">
                  −{formatINR(order.discount!)}
                </span>
              </div>
            )}
            <div className="border-t-2 border-forest-900 pt-3 mt-2">
              <div className="flex justify-between items-baseline gap-3">
                <span className="font-serif text-body-lg font-semibold text-ink-900">
                  Grand total
                </span>
                <span className="font-serif text-h2 text-forest-900 tabular-nums shrink-0">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-200 bg-cream-100 px-4 py-3 text-center text-caption text-ink-500 sm:px-6 sm:py-4">
        <p className="font-medium text-ink-700">
          Thank you for choosing Lakhe Mushroom Farm
        </p>
        <p className="mt-1 break-words">
          Questions? {config.business.phone} · {RECEIPT_EMAIL}
        </p>
        <p className="mt-2 text-ink-400 break-all">
          Computer-generated receipt · {order.order_ref}
        </p>
      </div>
    </div>
  );
}
