import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  GraduationCap,
  LogOut,
  Mail,
  Package,
  Phone,
  Save,
  Settings2,
  ShoppingBag,
  User as UserIcon,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { Textarea } from '../components/forms/Textarea';
import { EmptyState } from '../components/feedback/States';
import { ProfilePageSkeleton, OrderListSkeleton } from '../components/feedback/PageSkeletons';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/feedback/ToastProvider';
import {
  listBookingsForUser,
  listOrdersForUser,
  listTraining,
  upsertProfile,
} from '../lib/data';
import type { Order } from '../types/order';
import type { OfflineBooking } from '../types/booking';
import type { TrainingCourse } from '../types/training';
import { formatDate, formatDateTime } from '../utils/ids';
import { formatINR } from '../utils/format';
import { cn } from '../utils/cn';

type Tab = 'overview' | 'orders' | 'bookings' | 'training' | 'settings';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'orders', label: 'Orders' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'training', label: 'Training' },
  { key: 'settings', label: 'Settings' },
];

export function AccountPage() {
  const { user, profile, isAdmin, signOut, refreshProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [bookings, setBookings] = useState<OfflineBooking[] | null>(null);
  const [training, setTraining] = useState<TrainingCourse[]>([]);
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      full_name: profile?.full_name ?? '',
      phone: profile?.phone ?? '',
      address: profile?.address ?? '',
    });
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const [o, b, t] = await Promise.all([
        listOrdersForUser(user.id),
        listBookingsForUser(user.id),
        listTraining(),
      ]);
      setOrders(o);
      setBookings(b);
      setTraining(t);
    })();
  }, [user]);

  const trainingItems = useMemo(() => {
    if (!orders) return [];
    return orders.flatMap((o) =>
      o.items
        .filter((it) => it.item_type === 'training')
        .map((it) => ({ order: o, item: it }))
    );
  }, [orders]);

  async function save() {
    if (!user || !profile) return;
    try {
      setSaving(true);
      await upsertProfile({
        ...profile,
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
      });
      await refreshProfile();
      toast({ tone: 'success', message: 'Profile updated.' });
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not save.',
      });
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !user) {
    return (
      <AppShell>
        <PageContainer>
          <Section size="sm">
            <ProfilePageSkeleton />
          </Section>
        </PageContainer>
      </AppShell>
    );
  }

  const initials = (profile?.full_name ?? user.email)
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          {/* Profile header */}
          <Card padding="lg" elevated>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-forest-800 font-serif text-h2">
                  {initials}
                </span>
                <div>
                  <h1 className="font-serif text-h2 text-ink-900 leading-tight">
                    {profile?.full_name || 'Welcome back'}
                  </h1>
                  <p className="text-small text-ink-600 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </p>
                  {isAdmin && (
                    <Badge variant="premium" className="mt-1 w-fit">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline">Admin portal</Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  leftIcon={<LogOut className="h-4 w-4" />}
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="mt-6 -mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
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
        </Section>

        <Section size="sm">
          {tab === 'overview' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card padding="lg" className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                  <ShoppingBag className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-caption text-ink-500">Orders</p>
                  <p className="font-serif text-h2 text-ink-900 leading-none">
                    {orders?.length ?? '—'}
                  </p>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setTab('orders');
                    }}
                    className="text-caption text-forest-800 hover:underline"
                  >
                    View orders
                  </Link>
                </div>
              </Card>
              <Card padding="lg" className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-caption text-ink-500">Enrolled trainings</p>
                  <p className="font-serif text-h2 text-ink-900 leading-none">
                    {trainingItems.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('training')}
                    className="text-caption text-forest-800 hover:underline"
                  >
                    Continue learning
                  </button>
                </div>
              </Card>
              <Card padding="lg" className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                  <Calendar className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-caption text-ink-500">Offline bookings</p>
                  <p className="font-serif text-h2 text-ink-900 leading-none">
                    {bookings?.length ?? '—'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('bookings')}
                    className="text-caption text-forest-800 hover:underline"
                  >
                    View bookings
                  </button>
                </div>
              </Card>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-3">
              {!orders ? (
                <OrderListSkeleton />
              ) : orders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  message="Once you place an order, it will appear here."
                  action={
                    <Link to="/products">
                      <Button>Start shopping</Button>
                    </Link>
                  }
                />
              ) : (
                orders.map((o) => (
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
                ))
              )}
            </div>
          )}

          {tab === 'bookings' && (
            <div className="space-y-3">
              {!bookings ? (
                <OrderListSkeleton count={3} />
              ) : bookings.length === 0 ? (
                <EmptyState
                  title="No offline bookings"
                  message="Book an on-farm training and it will show here."
                  action={
                    <Link to="/training">
                      <Button>Explore training</Button>
                    </Link>
                  }
                />
              ) : (
                bookings.map((b) => (
                  <Card key={b.id} padding="md" className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-serif text-body font-semibold text-ink-900">
                          {b.course_title}
                        </span>
                        <Badge
                          variant={
                            b.status === 'confirmed'
                              ? 'approved'
                              : b.status === 'rejected'
                                ? 'neutral'
                                : 'pending'
                          }
                        >
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-caption text-ink-500 mt-0.5">
                        Ref {b.booking_ref} · Preferred{' '}
                        {formatDate(b.preferred_date)}
                      </p>
                      {b.admin_notes && (
                        <p className="mt-1 text-caption text-ink-600">
                          Admin: {b.admin_notes}
                        </p>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {tab === 'training' && (
            <div className="space-y-3">
              {!orders ? (
                <OrderListSkeleton count={2} />
              ) : trainingItems.length === 0 ? (
                <EmptyState
                  title="No training yet"
                  message="Enrol in an online course to begin learning."
                  action={
                    <Link to="/training">
                      <Button>Browse training</Button>
                    </Link>
                  }
                />
              ) : (
                trainingItems.map(({ order, item }) => (
                  <Card key={item.id} padding="md" className="flex items-start gap-3">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-forest-50">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-body font-semibold text-ink-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-caption text-ink-500">
                        Order {order.order_ref} ·{' '}
                        {item.status === 'access_granted'
                          ? 'Access granted'
                          : item.status === 'access_pending'
                            ? 'Access pending'
                            : 'Access rejected'}
                      </p>
                    </div>
                    <div>
                      {item.status === 'access_granted' ? (
                        <Link
                          to={`/training/${
                            training.find((c) => c.id === item.course_id)
                              ?.slug ?? ''
                          }/access`}
                        >
                          <Button size="sm">Open</Button>
                        </Link>
                      ) : (
                        <Badge variant="pending">Waiting</Badge>
                      )}
                    </div>
                  </Card>
                ))
              )}
              <p className="text-caption text-ink-500">
                Tip: from any training page, you’ll see “Continue learning” once
                access is granted.
              </p>
            </div>
          )}

          {tab === 'settings' && (
            <Card padding="lg" className="max-w-2xl">
              <SectionHeader
                title="Your details"
                description="Used to prefill checkout and communicate about orders."
              />
              <div className="space-y-3">
                <Input
                  label="Full name"
                  leftIcon={<UserIcon className="h-4 w-4" />}
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
                <Input
                  label="Phone"
                  leftIcon={<Phone className="h-4 w-4" />}
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Textarea
                  label="Default delivery address"
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
                <div className="flex items-center justify-between gap-3 pt-2">
                  <p className="flex items-center gap-1.5 text-caption text-ink-500">
                    <Settings2 className="h-4 w-4" /> Signed in as {user.email}
                  </p>
                  <Button
                    onClick={save}
                    loading={saving}
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </Section>
      </PageContainer>
    </AppShell>
  );
}
