import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { FileUpload } from '../components/forms/FileUpload';
import { EmptyState } from '../components/feedback/States';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/feedback/ToastProvider';
import { createOrder, uploadPaymentScreenshot } from '../lib/data';
import type { OrderItemType } from '../types/order';
import { formatINR } from '../utils/format';
import { config } from '../lib/config';

const SHIPPING_FLAT = 60;
const FREE_SHIPPING_THRESHOLD = 999;

export function PaymentPage() {
  const { items, subtotal, clear } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
  });
  const [txnId, setTxnId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasProducts = items.some((it) => it.type === 'product');
  const shipping = hasProducts
    ? subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FLAT
    : 0;
  const total = subtotal + shipping;

  useEffect(() => {
    setCustomer((c) => ({
      name: c.name || profile?.full_name || '',
      phone: c.phone || profile?.phone || '',
      address: c.address || profile?.address || '',
    }));
  }, [profile]);

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: config.business.upiId,
      pn: config.business.upiPayee,
      am: total.toFixed(2),
      cu: 'INR',
      tn: `Lakhe Order`,
    });
    return `upi://pay?${params.toString()}`;
  }, [total]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(upiUrl)}`;

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(config.business.upiId);
      toast({ tone: 'success', message: 'UPI ID copied.' });
    } catch {
      toast({ tone: 'warning', message: 'Could not copy — copy manually.' });
    }
  }

  async function submitOrder() {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/payment' } });
      return;
    }
    if (items.length === 0) return;
    if (!customer.name || !customer.phone) {
      toast({
        tone: 'warning',
        message: 'Please enter your name and phone.',
      });
      return;
    }
    if (hasProducts && !customer.address) {
      toast({
        tone: 'warning',
        message: 'Please enter a delivery address.',
      });
      return;
    }
    if (!file) {
      toast({
        tone: 'warning',
        message: 'Please upload your UPI payment screenshot.',
      });
      return;
    }
    if (!txnId) {
      toast({
        tone: 'warning',
        message: 'Please enter the UPI transaction reference.',
      });
      return;
    }
    try {
      setSubmitting(true);
      setUploading(true);
      const url = await uploadPaymentScreenshot(user.id, file);
      setUploading(false);
      const order = await createOrder({
        user_id: user.id,
        customer_name: customer.name,
        customer_email: user.email,
        customer_phone: customer.phone,
        subtotal,
        shipping,
        total,
        upi_txn_id: txnId,
        payment_screenshot_url: url,
        items: items.map((it) => ({
          item_type: it.type as OrderItemType,
          product_id: it.type === 'product' ? it.id : null,
          course_id: it.type === 'training' ? it.id : null,
          name: it.name,
          unit_price: it.price,
          qty: it.qty,
          image: it.image,
        })),
      });
      clear();
      navigate(`/payment-submitted/${order.order_ref}`, { replace: true });
    } catch (err) {
      toast({
        tone: 'danger',
        title: 'Could not submit order',
        message: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  if (items.length === 0) {
    return (
      <AppShell hideBottomNav>
        <PageContainer>
          <Section size="sm">
            <EmptyState
              title="Nothing to pay for"
              message="Your cart is empty. Add products or training to continue."
              action={
                <Link to="/products">
                  <Button>Browse products</Button>
                </Link>
              }
            />
          </Section>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell hideBottomNav>
      <PageContainer>
        <Section size="sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </button>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            {/* LEFT */}
            <div className="space-y-4">
              <Card padding="lg">
                <h2 className="font-serif text-h2 text-ink-900">
                  1. Pay via UPI
                </h2>
                <p className="mt-1 text-small text-ink-600">
                  Scan the QR with any UPI app (GPay, PhonePe, Paytm…) and pay{' '}
                  <span className="font-semibold text-ink-900">
                    {formatINR(total)}
                  </span>
                  .
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr] items-start">
                  <div className="rounded-lg border border-ink-100 bg-cream-50 p-3">
                    <img
                      src={qrUrl}
                      alt="UPI QR code"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-caption text-ink-500">Pay to (UPI)</p>
                      <div className="mt-1 flex items-center gap-2 rounded-md border border-ink-200 bg-surface-raised px-3 py-2">
                        <span className="font-mono text-body text-ink-900 flex-1 truncate">
                          {config.business.upiId}
                        </span>
                        <button
                          type="button"
                          onClick={copyUpi}
                          className="rounded-md p-1.5 text-ink-500 hover:bg-forest-50 hover:text-forest-800"
                          aria-label="Copy UPI ID"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-caption text-ink-500">Amount</p>
                      <p className="text-h2 font-serif text-ink-900 leading-tight">
                        {formatINR(total)}
                      </p>
                    </div>
                    <div className="flex items-start gap-2 rounded-md bg-cream-100 border border-cream-200 p-3">
                      <Info className="h-4 w-4 mt-0.5 text-clay-500 shrink-0" />
                      <p className="text-caption text-ink-700">
                        On mobile? Tap “Pay via UPI app” — we open your default
                        UPI app with the amount pre-filled.
                      </p>
                    </div>
                    <a href={upiUrl}>
                      <Button variant="outline" fullWidth>
                        Pay via UPI app
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <h2 className="font-serif text-h2 text-ink-900">
                  2. Delivery details
                </h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Full name"
                    required
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                  />
                  <Input
                    label="Phone"
                    required
                    inputMode="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                  />
                </div>
                {hasProducts ? (
                  <div className="mt-3">
                    <Input
                      label="Delivery address"
                      required
                      placeholder="Flat / house, street, city, PIN"
                      value={customer.address}
                      onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                      }
                    />
                  </div>
                ) : (
                  <p className="mt-3 text-caption text-ink-500">
                    Training-only order — no shipping address needed.
                  </p>
                )}
              </Card>

              <Card padding="lg">
                <h2 className="font-serif text-h2 text-ink-900">
                  3. Confirm payment
                </h2>
                <p className="mt-1 text-small text-ink-600">
                  Enter the UPI transaction reference (from your payment app)
                  and upload a screenshot. Our team verifies within 1 working
                  day.
                </p>
                <div className="mt-3 space-y-3">
                  <Input
                    label="UPI transaction reference"
                    required
                    placeholder="e.g. 41253896721"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                  />
                  <FileUpload
                    label="Payment screenshot"
                    accept="image/*"
                    hint="PNG or JPG. Clear enough to read the amount and reference."
                    onFileSelected={setFile}
                  />
                </div>
                <Button
                  fullWidth
                  size="lg"
                  className="mt-4"
                  loading={submitting || uploading}
                  onClick={submitOrder}
                  leftIcon={
                    submitting ? undefined : (
                      <CheckCircle2 className="h-4 w-4" />
                    )
                  }
                >
                  {uploading
                    ? 'Uploading…'
                    : submitting
                      ? 'Submitting…'
                      : 'I have paid — submit order'}
                </Button>
                <p className="mt-2 flex items-center justify-center gap-1 text-caption text-ink-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-forest-600" /> We
                  never store your UPI credentials.
                </p>
              </Card>
            </div>

            {/* RIGHT: order recap */}
            <div>
              <Card padding="lg" elevated className="lg:sticky lg:top-24 space-y-3">
                <h3 className="font-serif text-h3 text-ink-900">Your order</h3>
                <ul className="space-y-2">
                  {items.map((it) => (
                    <li
                      key={`${it.type}-${it.id}`}
                      className="flex gap-2 text-small"
                    >
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-forest-50">
                        {it.image && (
                          <img
                            src={it.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-ink-900 font-medium">
                          {it.name}
                        </p>
                        <p className="text-caption text-ink-500">
                          <Badge variant={it.type === 'training' ? 'online' : 'fresh'}>
                            {it.type === 'training' ? 'Training' : 'Product'}
                          </Badge>{' '}
                          × {it.qty}
                        </p>
                      </div>
                      <span className="text-ink-900 font-medium">
                        {formatINR(it.price * it.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-1.5 border-t border-ink-100 pt-3 text-small text-ink-700">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="font-medium text-ink-900">
                      {formatINR(subtotal)}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="font-medium text-ink-900">
                      {shipping === 0 ? 'Free' : formatINR(shipping)}
                    </dd>
                  </div>
                  <div className="flex justify-between border-t border-ink-100 pt-2 mt-2">
                    <dt className="text-body font-semibold text-ink-900">
                      Total
                    </dt>
                    <dd className="text-price font-semibold text-ink-900">
                      {formatINR(total)}
                    </dd>
                  </div>
                </dl>
                {uploading && (
                  <p className="flex items-center gap-2 text-caption text-forest-800">
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading
                    screenshot…
                  </p>
                )}
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
