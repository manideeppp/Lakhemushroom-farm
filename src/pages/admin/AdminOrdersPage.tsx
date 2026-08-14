import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/forms/Input';
import { LoadingState } from '../../components/feedback/States';
import { listAllOrders } from '../../lib/data';
import type { Order, OrderStatus } from '../../types/order';
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

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('all');

  useEffect(() => {
    void listAllOrders().then(setOrders);
  }, []);

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
      </div>

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
          No orders match the filters.
        </Card>
      ) : (
        <Card padding="none" className="overflow-x-auto">
          <table className="w-full text-small">
            <thead className="bg-cream-100 text-ink-700">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Order</th>
                <th className="px-3 py-2 text-left font-medium">Customer</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Placed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-forest-50/40 cursor-pointer"
                >
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
                          : o.status === 'pending_verification'
                            ? 'pending'
                            : 'neutral'
                      }
                    >
                      {o.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-ink-700">
                    {formatDateTime(o.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}