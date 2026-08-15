import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Package,
  PlayCircle,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/feedback/States';
import { getOrderByRef, listTraining } from '../lib/data';
import type { Order, OrderItemStatus } from '../types/order';
import type { TrainingCourse } from '../types/training';
import { formatDateTime } from '../utils/ids';
import { formatINR } from '../utils/format';

function itemStatusBadge(s: OrderItemStatus) {
  if (s === 'processing') return { variant: 'processing' as const, label: 'Processing' };
  if (s === 'delivered') return { variant: 'delivered' as const, label: 'Delivered' };
  if (s === 'access_granted') return { variant: 'approved' as const, label: 'Access granted' };
  if (s === 'access_pending') return { variant: 'pending' as const, label: 'Access pending' };
  if (s === 'rejected') return { variant: 'neutral' as const, label: 'Rejected' };
  return { variant: 'pending' as const, label: 'Pending' };
}

export function OrderDetailsPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState<TrainingCourse[]>([]);

  useEffect(() => {
    if (!ref) return;
    void (async () => {
      setLoading(true);
      const [o, t] = await Promise.all([getOrderByRef(ref), listTraining()]);
      setOrder(o);
      setTraining(t);
      setLoading(false);
    })();
  }, [ref]);

  if (loading) return <AppShell><LoadingState message="Loading order…" /></AppShell>;

  if (!order)
    return (
      <AppShell>
        <PageContainer>
          <Section size="sm">
            <Card padding="lg" className="text-center">
              <p className="text-body text-ink-700">We couldn’t find that order.</p>
              <Link to="/orders" className="mt-3 inline-block">
                <Button variant="outline">Back to my orders</Button>
              </Link>
            </Card>
          </Section>
        </PageContainer>
      </AppShell>
    );

  const statusBadge =
    order.status === 'approved'
      ? { variant: 'approved' as const, label: 'Approved' }
      : order.status === 'rejected'
        ? { variant: 'neutral' as const, label: 'Rejected' }
        : order.status === 'cancelled'
          ? { variant: 'neutral' as const, label: 'Cancelled' }
          : { variant: 'pending' as const, label: 'Pending verification' };

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <Card padding="lg">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-caption text-ink-500">Order</p>
                    <h1 className="font-serif text-h1 text-ink-900 leading-tight">
                      {order.order_ref}
                    </h1>
                    <p className="mt-1 text-small text-ink-600">
                      Placed on {formatDateTime(order.created_at)}
                    </p>
                  </div>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </div>
                {order.admin_notes && (
                  <div className="mt-3 rounded-md bg-cream-100 border border-cream-200 p-3 text-small text-ink-700">
                    <p className="font-medium text-ink-900">Notes from our team</p>
                    <p className="mt-0.5">{order.admin_notes}</p>
                  </div>
                )}
                {order.status === 'approved' && (
                  <div className="mt-3 rounded-xl border border-forest-200 bg-forest-50 p-4 text-small">
                    <p className="font-medium text-forest-900 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      Payment verified
                    </p>
                    {order.approved_at && (
                      <p className="mt-1 text-forest-800">
                        Approved on {formatDateTime(order.approved_at)}
                      </p>
                    )}
                    <p className="mt-1 text-forest-800/90">
                      Products move to dispatch; training access is granted when ready.
                    </p>
                  </div>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/orders/${order.order_ref}/receipt`}>
                    <Button leftIcon={<Download className="h-4 w-4" />}>
                      Download receipt
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="font-serif text-h2 text-ink-900">Items</h2>
                <ul className="mt-3 divide-y divide-ink-100">
                  {order.items.map((it) => {
                    const b = itemStatusBadge(it.status);
                    const course = training.find((c) => c.id === it.course_id);
                    return (
                      <li key={it.id} className="py-3 flex items-start gap-3">
                        <span className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-forest-50">
                          {it.image && (
                            <img
                              src={it.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="font-serif text-body font-semibold text-ink-900 line-clamp-2">
                              {it.name}
                            </p>
                            <Badge variant={b.variant}>{b.label}</Badge>
                          </div>
                          <p className="text-caption text-ink-500">
                            {it.item_type === 'training' ? 'Training' : 'Product'} ·{' '}
                            {formatINR(it.unit_price)} × {it.qty}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {it.item_type === 'training' &&
                              it.status === 'access_granted' &&
                              course && (
                                <Link to={`/training/${course.slug}/access`}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    leftIcon={<PlayCircle className="h-4 w-4" />}
                                  >
                                    Start learning
                                  </Button>
                                </Link>
                              )}
                            {it.item_type === 'product' && (
                              <span className="text-caption text-ink-500 inline-flex items-center gap-1">
                                {it.status === 'delivered' ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                                    Delivered
                                  </>
                                ) : it.status === 'processing' ? (
                                  <>
                                    <Package className="h-3.5 w-3.5 text-forest-700" />
                                    Being prepared for dispatch
                                  </>
                                ) : (
                                  'Waiting for verification'
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-body font-semibold text-ink-900 shrink-0">
                          {formatINR(it.unit_price * it.qty)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </Card>

              {order.payment_screenshot_url && (
                <Card padding="lg">
                  <h2 className="font-serif text-h2 text-ink-900">
                    Payment proof
                  </h2>
                  <p className="mt-1 text-small text-ink-600">
                    Uploaded at checkout. Kept private and only visible to you
                    and our team.
                  </p>
                  <a
                    href={order.payment_screenshot_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block max-w-sm overflow-hidden rounded-md border border-ink-100"
                  >
                    <img
                      src={order.payment_screenshot_url}
                      alt="Payment screenshot"
                      className="w-full object-cover"
                    />
                  </a>
                  <a
                    href={order.payment_screenshot_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-small text-forest-800 hover:underline"
                  >
                    Open full size <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Card>
              )}
            </div>

            <div>
              <Card padding="lg" elevated className="lg:sticky lg:top-24 space-y-3">
                <h3 className="font-serif text-h3 text-ink-900">Summary</h3>
                <dl className="space-y-1.5 text-small text-ink-700">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-ink-900">
                      {formatINR(order.subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="font-medium text-ink-900">
                      {order.shipping === 0 ? 'Free' : formatINR(order.shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-ink-100 pt-2 mt-2">
                    <dt className="text-body font-semibold text-ink-900">
                      Total
                    </dt>
                    <dd className="text-price font-semibold text-ink-900">
                      {formatINR(order.total)}
                    </dd>
                  </div>
                </dl>
                <div className="border-t border-ink-100 pt-3 text-small">
                  <p className="text-caption text-ink-500">Customer</p>
                  <p className="text-ink-900 font-medium">{order.customer_name}</p>
                  <p className="text-ink-700">{order.customer_email}</p>
                  {order.customer_phone && (
                    <p className="text-ink-700">{order.customer_phone}</p>
                  )}
                </div>
                {order.delivery_address && (
                  <div className="border-t border-ink-100 pt-3 text-small">
                    <p className="text-caption text-ink-500">Delivery address</p>
                    <p className="text-ink-900 leading-relaxed">
                      {order.delivery_address}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
