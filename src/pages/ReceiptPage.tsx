import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LoadingState } from '../components/feedback/States';
import { LakheLogo } from '../components/navigation/LakheLogo';
import { getOrderByRef } from '../lib/data';
import type { Order } from '../types/order';
import { formatDateTime } from '../utils/ids';
import { formatINR } from '../utils/format';
import { config } from '../lib/config';

export function ReceiptPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref) return;
    void (async () => {
      setLoading(true);
      const o = await getOrderByRef(ref);
      setOrder(o);
      setLoading(false);
    })();
  }, [ref]);

  if (loading) return <AppShell hideBottomNav hideFooter><LoadingState /></AppShell>;
  if (!order) {
    return (
      <AppShell hideBottomNav hideFooter>
        <PageContainer>
          <Section size="sm">
            <Card padding="lg" className="text-center">
              <p className="text-body text-ink-700">Order not found.</p>
              <Link to="/orders" className="mt-3 inline-block">
                <Button variant="outline">Back to my orders</Button>
              </Link>
            </Card>
          </Section>
        </PageContainer>
      </AppShell>
    );
  }

  const isApproved = order.status === 'approved';
  const title = isApproved ? 'Order Confirmation Receipt' : 'Payment Submission Receipt';

  return (
    <AppShell hideBottomNav hideFooter>
      <PageContainer>
        <Section size="sm">
          <div className="mb-4 flex items-center justify-between print:hidden">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <Button
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={() => window.print()}
            >
              Print / Save as PDF
            </Button>
          </div>

          {/* Receipt */}
          <div className="mx-auto max-w-3xl bg-surface-raised border border-ink-100 rounded-lg shadow-subtle p-8 print:shadow-none print:border-0 print:rounded-none">
            {order.delivery_address && (
              <div className="mb-5 rounded-xl border-2 border-forest-300 bg-forest-50 px-4 py-4 shadow-sm">
                <p className="text-caption font-semibold uppercase tracking-widest text-forest-800">
                  Delivery address
                </p>
                <p className="mt-2 text-body font-semibold text-ink-900 leading-relaxed">
                  {order.delivery_address}
                </p>
              </div>
            )}

            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-200 pb-5">
              <div className="flex items-center gap-3">
                <LakheLogo size="md" />
                <div>
                  <p className="text-caption text-ink-500">
                    Lakhe Mushroom Farm
                  </p>
                  <p className="text-caption text-ink-600">
                    {config.business.address}
                  </p>
                  <p className="text-caption text-ink-600">
                    {config.business.email} · {config.business.phone}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif text-h2 text-ink-900 leading-tight">
                  {title}
                </p>
                <p className="text-caption text-ink-500 mt-1">
                  {formatDateTime(order.created_at)}
                </p>
              </div>
            </header>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-caption text-ink-500 uppercase tracking-widest">
                  Billed to
                </p>
                <p className="text-body font-semibold text-ink-900 mt-1">
                  {order.customer_name}
                </p>
                <p className="text-small text-ink-700">
                  {order.customer_email}
                </p>
                {order.customer_phone && (
                  <p className="text-small text-ink-700">
                    {order.customer_phone}
                  </p>
                )}
              </div>
              <div className="sm:text-right">
                <p className="text-caption text-ink-500 uppercase tracking-widest">
                  Order
                </p>
                <p className="text-body font-semibold text-ink-900 mt-1">
                  {order.order_ref}
                </p>
                <p className="text-small text-ink-700">
                  Status:{' '}
                  <span
                    className={
                      isApproved ? 'text-forest-800 font-medium' : 'text-clay-500 font-medium'
                    }
                  >
                    {isApproved ? 'Approved' : 'Pending verification'}
                  </span>
                </p>
              </div>
            </div>

            {/* Items table */}
            <div className="mt-6 overflow-hidden border border-ink-200 rounded-md">
              <table className="w-full text-small">
                <thead className="bg-cream-100 text-ink-700">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium">Item</th>
                    <th className="text-left px-3 py-2 font-medium">Type</th>
                    <th className="text-right px-3 py-2 font-medium">Qty</th>
                    <th className="text-right px-3 py-2 font-medium">Price</th>
                    <th className="text-right px-3 py-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 text-ink-900">
                  {order.items.map((it) => (
                    <tr key={it.id}>
                      <td className="px-3 py-2">{it.name}</td>
                      <td className="px-3 py-2 capitalize">{it.item_type}</td>
                      <td className="px-3 py-2 text-right">{it.qty}</td>
                      <td className="px-3 py-2 text-right">
                        {formatINR(it.unit_price)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {formatINR(it.unit_price * it.qty)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 ml-auto max-w-xs space-y-1 text-small">
              <div className="flex justify-between">
                <span className="text-ink-700">Subtotal</span>
                <span className="text-ink-900 font-medium">
                  {formatINR(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-700">Shipping</span>
                <span className="text-ink-900 font-medium">
                  {order.shipping === 0 ? 'Free' : formatINR(order.shipping)}
                </span>
              </div>
              {(order.discount ?? 0) > 0 && (
                <div className="flex justify-between text-forest-800">
                  <span>Coupon{order.coupon_code ? ` (${order.coupon_code})` : ''}</span>
                  <span className="font-medium">−{formatINR(order.discount!)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-ink-200 pt-1 mt-1">
                <span className="text-body font-semibold text-ink-900">
                  Total paid
                </span>
                <span className="text-price font-semibold text-ink-900">
                  {formatINR(order.total)}
                </span>
              </div>
            </div>

            <footer className="mt-8 border-t border-ink-200 pt-4 text-caption text-ink-500 text-center">
              {isApproved
                ? 'Thank you for your order. This receipt confirms your successful purchase.'
                : 'We have received your payment and are verifying it. This receipt is your submission proof.'}
              <br />
              Questions? Write to {config.business.email}
            </footer>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
