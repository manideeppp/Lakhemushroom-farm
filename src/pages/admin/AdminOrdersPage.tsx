import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Search, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import { listAllOrders, updateOrderStatus } from '../../lib/data';
import type { Order, OrderStatus } from '../../types/order';
import { isPendingOrderStatusStatus } from '../../types/order';
import { formatDateTime } from '../../utils/ids';
import { formatINR } from '../../utils/format';
import { cn } from '../../utils/cn';

const TABS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending_verification', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'cancelled', label: 'Cancelled' },
];

function isPendingOrderStatus(status: string): boolean {
  return isPendingOrderStatusStatus(status);
}

export function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    setOrders(null);
    try {
      const o = await listAllOrders();
      setOrders(o);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not load orders.';
      setLoadError(message);
      setOrders([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function quickApprove(order: Order, next: 'approved' | 'rejected') {
    try {
      setActingId(order.id);
      await updateOrderStatus(order.order_ref, next);
      toast({
        tone: next === 'approved' ? 'success' : 'warning',
        message: `Order ${order.order_ref} ${next}.`,
      });
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not update order.',
      });
    } finally {
      setActingId(null);
    }
  }

  const filtered = useMemo(() => {
    if (!orders) return null;
    return orders.filter((o) => {
      if (tab !== 'all' && o.status !== tab) return false;
      if (
        q &&
        !`${o.order_ref} ${o.customer_name} ${o.customer_email}`
          .toLowerCase()
          .includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [orders, q, tab]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
            Orders
          </p>
          <h2 className="font-serif text-h1 text-ink-900 leading-tight">
            All orders
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          Refresh
        </Button>
      </div>

      {loadError && (
        <Card padding="md" className="border-danger/30 bg-cream-100 text-small text-ink-800">
          <p className="font-medium text-danger">Could not load orders</p>
          <p className="mt-1">{loadError}</p>
          <p className="mt-2 text-caption text-ink-600">
            Run <code className="font-mono">supabase/setup_all.sql</code> in
            Supabase, then sign out and sign in at /admin again.
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by ref, name, email…"
          leftIcon={<Search className="h-4 w-4" />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          containerClassName="flex-1"
        />
      </div>
      <div className="-mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              'shrink-0 rounded-pill border px-3 h-9 text-small font-medium transition',
              tab === t.key
                ? 'bg-brand text-cream-50 border-brand'
                : 'bg-surface-raised text-ink-700 border-ink-200 hover:border-forest-300'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!filtered ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <Card padding="lg" className="text-center text-small text-ink-600">
          {orders?.length === 0
            ? 'No orders yet. When customers pay, they appear here.'
            : 'No orders match the filters.'}
        </Card>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {filtered.map((o) => {
              const pending = isPendingOrderStatus(o.status);
              return (
                <Card key={o.id} padding="md" className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/admin/orders/${o.order_ref}`}
                        className="font-serif text-h3 font-semibold text-ink-900 hover:text-brand"
                      >
                        {o.order_ref}
                      </Link>
                      <p className="mt-1 text-small text-ink-900">{o.customer_name}</p>
                      <p className="text-caption text-ink-500">{o.customer_email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-medium text-ink-900">{formatINR(o.total)}</p>
                      <Badge
                        className="mt-1"
                        variant={
                          o.status === 'approved'
                            ? 'approved'
                            : pending
                              ? 'pending'
                              : 'neutral'
                        }
                      >
                        {o.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-caption text-ink-500">
                    Placed {formatDateTime(o.created_at)}
                  </p>
                  {pending ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        fullWidth
                        loading={actingId === o.id}
                        leftIcon={<CheckCircle2 className="h-4 w-4" />}
                        onClick={() => void quickApprove(o, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        fullWidth
                        variant="danger"
                        loading={actingId === o.id}
                        leftIcon={<XCircle className="h-4 w-4" />}
                        onClick={() => void quickApprove(o, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Link to={`/admin/orders/${o.order_ref}`}>
                      <Button fullWidth variant="outline" size="sm">
                        View order
                      </Button>
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>

          <Card padding="none" className="hidden md:block overflow-x-auto">
            <table className="w-full text-small">
            <thead className="bg-cream-100 text-ink-700">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Order</th>
                <th className="px-3 py-2 text-left font-medium">Customer</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Placed</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-forest-50/40">
                  <td className="px-3 py-2">
                    <Link
                      to={`/admin/orders/${o.order_ref}`}
                      className="font-serif font-semibold text-ink-900 hover:text-brand"
                    >
                      {o.order_ref}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-ink-900">{o.customer_name}</p>
                    <p className="text-caption text-ink-500">
                      {o.customer_email}
                    </p>
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-ink-900">
                    {formatINR(o.total)}
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      variant={
                        o.status === 'approved'
                          ? 'approved'
                          : isPendingOrderStatus(o.status)
                            ? 'pending'
                            : 'neutral'
                      }
                    >
                      {o.status.replace(/_/g, ' ')}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-ink-700">
                    {formatDateTime(o.created_at)}
                  </td>
                  <td className="px-3 py-2">
                    {isPendingOrderStatus(o.status) ? (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          loading={actingId === o.id}
                          leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                          onClick={() => void quickApprove(o, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          loading={actingId === o.id}
                          leftIcon={<XCircle className="h-3.5 w-3.5" />}
                          onClick={() => void quickApprove(o, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Link
                        to={`/admin/orders/${o.order_ref}`}
                        className="text-caption text-forest-800 hover:underline"
                      >
                        View
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        </>
      )}
    </div>
  );
}
