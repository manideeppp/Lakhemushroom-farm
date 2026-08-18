import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/feedback/States';
import { OrderReceiptDocument } from '../components/receipt/OrderReceiptDocument';
import { getOrderByRef } from '../lib/data';
import type { Order } from '../types/order';

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

  if (loading)
    return (
      <AppShell hideBottomNav hideFooter>
        <LoadingState />
      </AppShell>
    );

  if (!order) {
    return (
      <AppShell hideBottomNav hideFooter>
        <PageContainer className="py-12">
          <div className="mx-auto max-w-md text-center rounded-2xl border border-ink-100 bg-surface-raised p-8">
            <p className="text-body text-ink-700">Order not found.</p>
            <Link to="/orders" className="mt-4 inline-block">
              <Button variant="outline">Back to my orders</Button>
            </Link>
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell hideBottomNav hideFooter>
      <div className="min-h-[calc(100dvh-var(--header-h))] bg-cream-50 print:bg-white">
        <PageContainer className="py-6 sm:py-8 print:py-0">
          <div className="mx-auto max-w-3xl">
            <div className="mb-5 flex items-center justify-between print:hidden">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-small text-ink-600 hover:text-forest-800 transition-colors"
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

            <OrderReceiptDocument order={order} />
          </div>
        </PageContainer>
      </div>
    </AppShell>
  );
}
