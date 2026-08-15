import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  Check,
  Download,
  FileText,
  IndianRupee,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/feedback/States';
import { PaymentTrustFeatures } from '../components/payment/PaymentTrustFeatures';
import { getOrderByRef } from '../lib/data';
import type { Order } from '../types/order';
import { formatINR } from '../utils/format';
import { formatDateTime } from '../utils/ids';

export function PaymentSubmittedPage() {
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

  if (loading)
    return (
      <AppShell hideBottomNav>
        <LoadingState message="Loading your receipt…" />
      </AppShell>
    );

  if (!order)
    return (
      <AppShell hideBottomNav>
        <PageContainer className="py-12">
          <div className="mx-auto max-w-md text-center rounded-2xl border border-ink-100 bg-surface-raised p-8">
            <p className="text-body text-ink-700">
              We couldn&apos;t find that order.
            </p>
            <Link to="/orders" className="mt-4 inline-block">
              <Button variant="outline">Go to my orders</Button>
            </Link>
          </div>
        </PageContainer>
      </AppShell>
    );

  return (
    <AppShell hideBottomNav>
      <div className="min-h-[calc(100dvh-var(--header-h))] bg-cream-50">
        <PageContainer className="py-8 sm:py-10">
          <div className="mx-auto max-w-lg">
            {/* Success icon */}
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <span
                  className="absolute inset-0 rounded-full border-2 border-forest-200/80"
                  aria-hidden
                />
                <span
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-900 text-cream-50 shadow-md"
                >
                  <Check className="h-8 w-8" strokeWidth={2.5} />
                </span>
              </div>

              <span
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest-50 px-3.5 py-1.5 text-small font-medium text-forest-800"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-forest-600" />
                Payment received
              </span>

              <h1 className="mt-4 font-serif text-h1 text-ink-900 leading-tight">
                Thank you, your order is in!
              </h1>
              <p className="mt-2 text-small text-ink-600 leading-relaxed max-w-sm">
                We&apos;ve received your payment and are verifying it. You&apos;ll
                get a confirmation on your email once approved (usually within a
                day).
              </p>
            </div>

            {/* Order details card */}
            <div
              className="mt-8 rounded-2xl border border-cream-200 bg-cream-100/70 p-5 sm:p-6"
            >
              <p className="text-caption font-semibold uppercase tracking-[0.14em] text-ink-500">
                Order details
              </p>
              <ul className="mt-4 divide-y divide-ink-200/50">
                <li className="flex items-center gap-4 py-3.5 first:pt-0">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-800"
                  >
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-caption text-ink-500">Order reference</p>
                    <p className="font-serif text-h3 text-ink-900">
                      {order.order_ref}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4 py-3.5">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-800"
                  >
                    <IndianRupee className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-caption text-ink-500">Amount paid</p>
                    <p className="font-serif text-h3 text-ink-900">
                      {formatINR(order.total)}
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-4 py-3.5 last:pb-0">
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-100 text-forest-800"
                  >
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-caption text-ink-500">Placed on</p>
                    <p className="font-serif text-body-lg text-ink-900">
                      {formatDateTime(order.created_at)}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <Link to={`/orders/${order.order_ref}/receipt`} className="block">
                <Button fullWidth size="lg" leftIcon={<Download className="h-4 w-4" />}>
                  Download payment receipt
                </Button>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/orders/${order.order_ref}`}>
                  <Button
                    fullWidth
                    variant="outline"
                    leftIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    View order details
                  </Button>
                </Link>
                <Button
                  fullWidth
                  variant="outline"
                  leftIcon={<ShoppingBag className="h-4 w-4" />}
                  onClick={() => navigate('/orders')}
                >
                  My orders
                </Button>
              </div>
            </div>

            <div
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-cream-100/80 border border-cream-200/80 px-4 py-3 text-caption text-ink-600"
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-forest-700" />
              You can always find this receipt in your account.
            </div>

            <PaymentTrustFeatures className="mt-8" />
          </div>
        </PageContainer>
      </div>
    </AppShell>
  );
}
