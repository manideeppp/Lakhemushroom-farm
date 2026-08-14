import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/feedback/States';
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
        <PageContainer>
          <Section size="sm">
            <Card padding="lg" className="text-center">
              <p className="text-body text-ink-700">
                We couldn’t find that order.
              </p>
              <Link to="/orders" className="mt-3 inline-block">
                <Button variant="outline">Go to my orders</Button>
              </Link>
            </Card>
          </Section>
        </PageContainer>
      </AppShell>
    );

  return (
    <AppShell hideBottomNav>
      <PageContainer>
        <Section size="sm">
          <Card padding="lg" elevated className="max-w-2xl mx-auto text-center">
            <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-50 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <Badge variant="pending" className="mx-auto mt-3 w-fit">
              <Sparkles className="h-3 w-3" /> Payment received
            </Badge>
            <h1 className="mt-3 font-serif text-h1 text-ink-900 leading-tight">
              Thank you, your order is in.
            </h1>
            <p className="mt-2 text-body text-ink-700 max-w-md mx-auto">
              We’ve received your payment and are verifying it. You’ll get a
              confirmation on your email once approved (usually within a day).
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 text-left">
              <div className="rounded-md border border-ink-100 bg-cream-50 p-3">
                <p className="text-caption text-ink-500">Order reference</p>
                <p className="mt-0.5 font-serif text-h3 text-ink-900">
                  {order.order_ref}
                </p>
              </div>
              <div className="rounded-md border border-ink-100 bg-cream-50 p-3">
                <p className="text-caption text-ink-500">Amount paid</p>
                <p className="mt-0.5 font-serif text-h3 text-ink-900">
                  {formatINR(order.total)}
                </p>
              </div>
              <div className="rounded-md border border-ink-100 bg-cream-50 p-3">
                <p className="text-caption text-ink-500">Placed on</p>
                <p className="mt-0.5 text-body text-ink-900">
                  {formatDateTime(order.created_at)}
                </p>
              </div>
              <div className="rounded-md border border-ink-100 bg-cream-50 p-3">
                <p className="text-caption text-ink-500">UPI reference</p>
                <p className="mt-0.5 text-body text-ink-900 font-mono">
                  {order.upi_txn_id ?? '—'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link to={`/orders/${order.order_ref}/receipt`}>
                <Button leftIcon={<Download className="h-4 w-4" />}>
                  Download payment receipt
                </Button>
              </Link>
              <Link to={`/orders/${order.order_ref}`}>
                <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  View order
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => navigate('/orders')}>
                My orders
              </Button>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1 text-caption text-ink-500">
              <ShieldCheck className="h-3.5 w-3.5 text-forest-600" />
              You can always find this receipt in your account.
            </p>
          </Card>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
