import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/forms/Textarea';
import { Select } from '../../components/forms/Select';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import {
  getOrderByRef,
  updateOrderItemStatus,
  updateOrderStatus,
} from '../../lib/data';
import type { Order, OrderItemStatus } from '../../types/order';
import { formatDateTime } from '../../utils/ids';
import { formatINR } from '../../utils/format';

const PRODUCT_STATUS: OrderItemStatus[] = ['pending', 'processing', 'delivered'];
const TRAINING_STATUS: OrderItemStatus[] = [
  'access_pending',
  'access_granted',
  'rejected',
];

export function AdminOrderDetailPage() {
  const { ref } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');

  async function load() {
    if (!ref) return;
    setLoading(true);
    const o = await getOrderByRef(ref);
    setOrder(o);
    setNotes(o?.admin_notes ?? '');
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  if (loading) return <LoadingState />;
  if (!order)
    return (
      <Card padding="lg" className="text-center">
        <p className="text-body text-ink-700">Order not found.</p>
        <Link to="/admin/orders" className="mt-3 inline-block">
          <Button variant="outline">Back to orders</Button>
        </Link>
      </Card>
    );

  async function updateStatus(next: 'approved' | 'rejected') {
    if (!order) return;
    try {
      setSaving(true);
      await updateOrderStatus(order.order_ref, next, notes);
      toast({
        tone: next === 'approved' ? 'success' : 'warning',
        message: `Order ${next}.`,
      });
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not update.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function updateItem(itemId: string, status: OrderItemStatus) {
    try {
      await updateOrderItemStatus(itemId, status);
      toast({ tone: 'success', message: 'Item updated.' });
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not update.',
      });
    }
  }

  const pending = order.status === 'pending_verification';

  const verificationCard = (
    <Card padding="lg" elevated className="lg:sticky lg:top-24 space-y-3">
      <h3 className="font-serif text-h3 text-ink-900">Verification</h3>
      <p className="text-small text-ink-600">
        Review payment proof and delivery details, then approve or reject.
      </p>
      <Textarea
        label="Admin notes (optional)"
        rows={4}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Anything to record about this order?"
      />
      <div className="flex flex-col gap-2">
        <Button
          fullWidth
          loading={saving}
          leftIcon={<CheckCircle2 className="h-4 w-4" />}
          onClick={() => void updateStatus('approved')}
          disabled={order.status === 'approved'}
        >
          Approve order
        </Button>
        <Button
          fullWidth
          variant="danger"
          loading={saving}
          leftIcon={<XCircle className="h-4 w-4" />}
          onClick={() => void updateStatus('rejected')}
          disabled={order.status === 'rejected'}
        >
          Reject order
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {pending && (
        <div className="lg:hidden space-y-2">
          <p className="text-caption font-medium text-forest-700 uppercase tracking-widest">
            Action required
          </p>
          {verificationCard}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Card padding="lg">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-caption text-ink-500">Order</p>
                <h1 className="font-serif text-h1 text-ink-900 leading-tight">
                  {order.order_ref}
                </h1>
                <p className="mt-1 text-small text-ink-600">
                  Placed on {formatDateTime(order.created_at)}
                </p>
              </div>
              <Badge
                variant={
                  order.status === 'approved'
                    ? 'approved'
                    : order.status === 'pending_verification'
                      ? 'pending'
                      : 'neutral'
                }
              >
                {order.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-small">
              <div>
                <p className="text-caption text-ink-500">Customer</p>
                <p className="text-ink-900 font-medium">{order.customer_name}</p>
                <p className="text-ink-700">{order.customer_email}</p>
                {order.customer_phone && (
                  <p className="text-ink-700">{order.customer_phone}</p>
                )}
                {order.delivery_address && (
                  <div className="mt-3">
                    <p className="text-caption text-ink-500">Delivery address</p>
                    <p className="text-ink-900 leading-relaxed">
                      {order.delivery_address}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-caption text-ink-500">UPI reference</p>
                <p className="text-ink-900 font-mono">
                  {order.upi_txn_id ?? '—'}
                </p>
                <p className="text-caption text-ink-500 mt-2">Total</p>
                <p className="font-serif text-h3 text-ink-900">
                  {formatINR(order.total)}
                </p>
              </div>
            </div>
          </Card>

          {order.payment_screenshot_url && (
            <Card padding="lg">
              <h2 className="font-serif text-h2 text-ink-900">
                Payment screenshot
              </h2>
              <a
                href={order.payment_screenshot_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block max-w-md overflow-hidden rounded-md border border-ink-100"
              >
                <img
                  src={order.payment_screenshot_url}
                  alt="Payment screenshot"
                  className="w-full"
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

          <Card padding="lg">
            <h2 className="font-serif text-h2 text-ink-900">Items</h2>
            <ul className="mt-3 divide-y divide-ink-100">
              {order.items.map((it) => {
                const options =
                  it.item_type === 'training' ? TRAINING_STATUS : PRODUCT_STATUS;
                return (
                  <li key={it.id} className="py-3 flex flex-col gap-2 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-forest-50">
                        {it.image && (
                          <img
                            src={it.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-serif text-body font-semibold text-ink-900">
                          {it.name}
                        </p>
                        <p className="text-caption text-ink-500">
                          {it.item_type} · {formatINR(it.unit_price)} × {it.qty}
                        </p>
                      </div>
                    </div>
                    <div className="w-full sm:w-48 shrink-0">
                      <Select
                        value={it.status}
                        onChange={(e) =>
                          void updateItem(it.id, e.target.value as OrderItemStatus)
                        }
                      >
                        {options.map((s) => (
                          <option key={s} value={s}>
                            {s.replace('_', ' ')}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="hidden lg:block">{verificationCard}</div>
      </div>
    </div>
  );
}
