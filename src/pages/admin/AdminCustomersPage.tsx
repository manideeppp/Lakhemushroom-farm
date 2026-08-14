import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck, User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/forms/Input';
import { LoadingState } from '../../components/feedback/States';
import { listCustomers, listAllOrders } from '../../lib/data';
import type { Profile } from '../../types/profile';
import type { Order } from '../../types/order';
import { formatDate } from '../../utils/ids';
import { formatINR } from '../../utils/format';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Profile[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    void (async () => {
      const [c, o] = await Promise.all([listCustomers(), listAllOrders()]);
      setCustomers(c);
      setOrders(o);
    })();
  }, []);

  const enriched = useMemo(() => {
    if (!customers) return null;
    return customers
      .map((c) => {
        const co = orders.filter((o) => o.user_id === c.id);
        const spend = co
          .filter((o) => o.status === 'approved')
          .reduce((s, o) => s + o.total, 0);
        return { profile: c, orderCount: co.length, spend };
      })
      .filter((x) => {
        if (!q) return true;
        const s = `${x.profile.full_name ?? ''} ${x.profile.email}`.toLowerCase();
        return s.includes(q.toLowerCase());
      });
  }, [customers, orders, q]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
          Customers
        </p>
        <h2 className="font-serif text-h1 text-ink-900 leading-tight">
          All customers
        </h2>
      </div>

      <Input
        placeholder="Search by name or email…"
        leftIcon={<Search className="h-4 w-4" />}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {!enriched ? (
        <LoadingState />
      ) : enriched.length === 0 ? (
        <Card padding="lg" className="text-center text-small text-ink-600">
          No customers yet.
        </Card>
      ) : (
        <Card padding="none" className="overflow-x-auto">
          <table className="w-full text-small">
            <thead className="bg-cream-100 text-ink-700">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Customer</th>
                <th className="px-3 py-2 text-left font-medium">Contact</th>
                <th className="px-3 py-2 text-right font-medium">Orders</th>
                <th className="px-3 py-2 text-right font-medium">Total spend</th>
                <th className="px-3 py-2 text-left font-medium">Joined</th>
                <th className="px-3 py-2 text-left font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {enriched.map(({ profile, orderCount, spend }) => (
                <tr key={profile.id}>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-100 text-forest-800 text-small font-semibold">
                        {(profile.full_name ?? profile.email)
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <span className="font-medium text-ink-900">
                        {profile.full_name ?? '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-ink-900">{profile.email}</p>
                    {profile.phone && (
                      <p className="text-caption text-ink-500">
                        {profile.phone}
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {orderCount}
                  </td>
                  <td className="px-3 py-2 text-right font-medium">
                    {formatINR(spend)}
                  </td>
                  <td className="px-3 py-2 text-ink-700">
                    {profile.created_at ? formatDate(profile.created_at) : '—'}
                  </td>
                  <td className="px-3 py-2">
                    {profile.is_admin ? (
                      <Badge variant="premium">
                        <ShieldCheck className="h-3 w-3" /> Admin
                      </Badge>
                    ) : (
                      <Badge variant="neutral">
                        <User className="h-3 w-3" /> Customer
                      </Badge>
                    )}
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
