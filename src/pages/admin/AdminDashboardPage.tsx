import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Layers,
  MailQuestion,
  Package,
  ShoppingBag,
  Users2,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/feedback/States';
import {
  listAllBookings,
  listAllOrders,
  listCustomers,
  listProducts,
  listQueries,
  listTraining,
} from '../../lib/data';
import type { Order } from '../../types/order';
import type { OfflineBooking, CustomerQuery } from '../../types/booking';
import type { Profile } from '../../types/profile';
import type { Product } from '../../types/product';
import type { TrainingCourse } from '../../types/training';
import { formatDateTime } from '../../utils/ids';
import { formatINR } from '../../utils/format';

export function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [bookings, setBookings] = useState<OfflineBooking[]>([]);
  const [queries, setQueries] = useState<CustomerQuery[]>([]);
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [training, setTraining] = useState<TrainingCourse[]>([]);

  useEffect(() => {
    void (async () => {
      const [o, b, q, c, p, t] = await Promise.all([
        listAllOrders(),
        listAllBookings(),
        listQueries(),
        listCustomers(),
        listProducts(),
        listTraining(),
      ]);
      setOrders(o);
      setBookings(b);
      setQueries(q);
      setCustomers(c);
      setProducts(p);
      setTraining(t);
    })();
  }, []);

  if (!orders) return <LoadingState message="Loading dashboard…" />;

  const pending = orders.filter((o) => o.status === 'pending_verification');
  const approved = orders.filter((o) => o.status === 'approved');
  const revenue = approved.reduce((s, o) => s + o.total, 0);
  const newQueries = queries.filter((q) => q.status === 'new');
  const pendingBookings = bookings.filter((b) => b.status === 'pending');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
          Overview
        </p>
        <h2 className="font-serif text-h1 text-ink-900 leading-tight">
          Welcome back
        </h2>
        <p className="text-small text-ink-600">
          A quick pulse on the farm today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Total orders"
          value={orders.length}
        />
        <Stat
          icon={<Layers className="h-5 w-5" />}
          label="Pending verifications"
          value={pending.length}
          tone={pending.length > 0 ? 'warn' : undefined}
        />
        <Stat
          icon={<Users2 className="h-5 w-5" />}
          label="Customers"
          value={customers.length}
        />
        <Stat
          icon={<Package className="h-5 w-5" />}
          label="Revenue (approved)"
          value={formatINR(revenue)}
          isString
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<BookOpen className="h-5 w-5" />}
          label="Products"
          value={products.length}
        />
        <Stat
          icon={<BookOpen className="h-5 w-5" />}
          label="Training courses"
          value={training.length}
        />
        <Stat
          icon={<CalendarClock className="h-5 w-5" />}
          label="Pending bookings"
          value={pendingBookings.length}
          tone={pendingBookings.length > 0 ? 'warn' : undefined}
        />
        <Stat
          icon={<MailQuestion className="h-5 w-5" />}
          label="New queries"
          value={newQueries.length}
          tone={newQueries.length > 0 ? 'warn' : undefined}
        />
      </div>

      {/* Recent pending orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-h3 text-ink-900">
              Recent pending orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-caption text-forest-800 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-ink-100">
            {pending.slice(0, 5).map((o) => (
              <li key={o.id} className="py-2.5">
                <Link
                  to={`/admin/orders/${o.order_ref}`}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-body font-semibold text-ink-900">
                      {o.order_ref}
                    </p>
                    <p className="text-caption text-ink-500 truncate">
                      {o.customer_name} · {formatDateTime(o.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-body font-semibold text-ink-900">
                      {formatINR(o.total)}
                    </p>
                    <Badge variant="pending">Pending</Badge>
                  </div>
                </Link>
              </li>
            ))}
            {pending.length === 0 && (
              <li className="py-4 text-center text-small text-ink-500">
                No pending orders. Nice work.
              </li>
            )}
          </ul>
        </Card>

        <Card padding="lg">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-h3 text-ink-900">
              Latest customer queries
            </h3>
            <Link
              to="/admin/queries"
              className="text-caption text-forest-800 hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-ink-100">
            {queries.slice(0, 5).map((q) => (
              <li key={q.id} className="py-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body font-medium text-ink-900">
                      {q.name}{' '}
                      <span className="text-caption text-ink-500">
                        · {q.email}
                      </span>
                    </p>
                    <p className="text-small text-ink-700 line-clamp-2">
                      {q.subject ? `${q.subject}: ` : ''}
                      {q.message}
                    </p>
                    <p className="text-caption text-ink-500">
                      {formatDateTime(q.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      q.status === 'new'
                        ? 'pending'
                        : q.status === 'in_progress'
                          ? 'processing'
                          : 'approved'
                    }
                  >
                    {q.status.replace('_', ' ')}
                  </Badge>
                </div>
              </li>
            ))}
            {queries.length === 0 && (
              <li className="py-4 text-center text-small text-ink-500">
                No queries yet.
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
  isString,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone?: 'warn';
  isString?: boolean;
}) {
  return (
    <Card padding="lg" className="flex items-start gap-3">
      <span
        className={
          tone === 'warn'
            ? 'inline-flex h-10 w-10 items-center justify-center rounded-md bg-gold-50 text-gold-600'
            : 'inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700'
        }
      >
        {icon}
      </span>
      <div>
        <p className="text-caption text-ink-500">{label}</p>
        <p
          className={
            isString
              ? 'font-serif text-h3 text-ink-900 leading-none mt-0.5'
              : 'font-serif text-h1 text-ink-900 leading-none mt-0.5'
          }
        >
          {value}
        </p>
      </div>
    </Card>
  );
}
