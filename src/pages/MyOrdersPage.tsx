import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState, LoadingState } from '../components/feedback/States';
import { listOrdersForUser } from '../lib/data';
import { useAuth } from '../context/AuthContext';
import type { Order, OrderStatus } from '../types/order';
import { formatDateTime } from '../utils/ids';
import { formatINR } from '../utils/format';
import { cn } from '../utils/cn';

const FILTERS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending_verification', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');

  useEffect(() => {
    if (!user) return;
    void listOrdersForUser(user.id).then(setOrders);
  }, [user]);

  const filtered = useMemo(() => {
    if (!orders) return null;
    return filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <Link
            to="/account"
            className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to account
          </Link>
          <SectionHeader eyebrow="Account" title="My orders" />
          <div className="-mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  'shrink-0 rounded-pill border px-3 h-9 text-small font-medium transition',
                  filter === f.key
                    ? 'bg-brand text-cream-50 border-brand'
                    : 'bg-surface-raised text-ink-700 border-ink-200 hover:border-forest-300'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Section>

        <Section size="sm">
          {!filtered ? (
            <LoadingState />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No orders match"
              message="Try another filter — or start shopping."
              action={
                <Link to="/products">
                  <Button>Browse products</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((o) => (
                <Card
                  key={o.id}
                  padding="md"
                  interactive
                  onClick={() => navigate(`/orders/${o.order_ref}`)}
                  className="flex items-start gap-3"
                >
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                    <Package className="h-4 w-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="font-serif text-body font-semibold text-ink-900">
                        {o.order_ref}
                      </span>
                      <Badge
                        variant={
                          o.status === 'approved'
                            ? 'approved'
                            : o.status === 'rejected'
                              ? 'neutral'
                              : 'pending'
                        }
                      >
                        {o.status === 'pending_verification'
                          ? 'Pending verification'
                          : o.status === 'approved'
                            ? 'Approved'
                            : o.status === 'rejected'
                              ? 'Rejected'
                              : 'Cancelled'}
                      </Badge>
                    </div>
                    <p className="text-caption text-ink-500 mt-0.5">
                      {formatDateTime(o.created_at)} · {o.items.length}{' '}
                      {o.items.length === 1 ? 'item' : 'items'}
                    </p>
                    <p className="mt-1 text-price font-semibold text-ink-900">
                      {formatINR(o.total)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>
      </PageContainer>
    </AppShell>
  );
}
