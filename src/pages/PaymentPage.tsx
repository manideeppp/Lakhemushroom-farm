import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { FileUpload } from '../components/forms/FileUpload';
import { EmptyState } from '../components/feedback/States';
import { BackLink } from '../components/navigation/BackLink';
import { CheckoutStepper } from '../components/payment/CheckoutStepper';
import { OrderSummaryCard } from '../components/payment/OrderSummaryCard';
import { UpiAppBadges } from '../components/payment/UpiAppBadges';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/feedback/ToastProvider';
import { createOrder, uploadPaymentScreenshot } from '../lib/data';
import { getErrorMessage } from '../utils/errors';
import { supabase } from '../lib/supabase';
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

  const canSubmit =
    customer.name.trim() &&
    customer.phone.trim() &&
    (!hasProducts || customer.address.trim()) &&
    file &&
    txnId.trim();

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
      tn: 'Lakhe Order',
    });
    return `upi://pay?${params.toString()}`;
  }, [total]);

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data=${encodeURIComponent(upiUrl)}`;

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(config.business.upiId);
      toast({ tone: 'success', message: 'UPI ID copied.' });
    } catch {
      toast({ tone: 'warning', message: 'Could not copy — copy manually.' });
    }
  }

  async function submitOrder() {
    if (items.length === 0) return;
    if (!customer.name || !customer.phone) {
      toast({ tone: 'warning', message: 'Please enter your name and phone.' });
      return;
    }
    if (hasProducts && !customer.address) {
      toast({ tone: 'warning', message: 'Please enter a delivery address.' });
      return;
    }
    if (!file) {
      toast({ tone: 'warning', message: 'Please upload your UPI payment screenshot.' });
      return;
    }
    if (!txnId) {
      toast({ tone: 'warning', message: 'Please enter the UPI transaction reference.' });
      return;
    }
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      navigate('/login', { state: { redirectTo: '/payment' } });
      return;
    }
    const authUser = session.user;
    const customerEmail = authUser.email?.trim() || user?.email?.trim() || '';
    if (!customerEmail) {
      toast({
        tone: 'warning',
        message: 'Your account email is missing. Sign out and sign in again.',
      });
      return;
    }
    try {
      setSubmitting(true);
      setUploading(true);
      const url = await uploadPaymentScreenshot(authUser.id, file);
      setUploading(false);
      const order = await createOrder({
        user_id: authUser.id,
        customer_name: customer.name,
        customer_email: customerEmail,
        customer_phone: customer.phone,
        delivery_address: hasProducts ? customer.address : undefined,
        subtotal,
        shipping,
        total,
        upi_txn_id: txnId,
        payment_screenshot_url: url,
        items: items.map((it) => ({
          item_type: it.type as OrderItemType,
          product_id: it.type === 'product' ? it.id : null,
          course_id: it.type === 'training' ? it.id : null,
          slug: it.slug,
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
        message: getErrorMessage(err, 'Please try again.'),
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
                  <Button size="lg">Browse products</Button>
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
      <PageContainer className="pb-checkout-bar">
        <Section size="sm">
          <BackLink onClick={() => navigate('/cart')}>Back to cart</BackLink>

          <div className="mb-6 space-y-2">
            <h1 className="font-serif text-h1 text-ink-900 leading-tight">
              Checkout
            </h1>
            <p className="text-small text-ink-600">
              Secure UPI payment · Manual verification within 1 working day
            </p>
            <CheckoutStepper
              steps={['Pay via UPI', 'Your details', 'Confirm']}
              current={txnId || file ? 2 : customer.name && customer.phone ? 1 : 0}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Order summary first on mobile */}
            <div className="lg:order-2">
              <OrderSummaryCard
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                className="lg:sticky lg:top-24"
                footer={
                  uploading ? (
                    <p className="mt-3 flex items-center gap-2 text-caption text-forest-800">
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading
                      screenshot…
                    </p>
                  ) : null
                }
              />
              <div className="mt-3 hidden lg:block">
                <Button
                  fullWidth
                  size="lg"
                  loading={submitting || uploading}
                  disabled={!canSubmit}
                  onClick={submitOrder}
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                >
                  Submit order
                </Button>
              </div>
            </div>

            <div className="lg:order-1 space-y-4">
              {/* UPI payment card */}
              <Card padding="none" className="overflow-hidden border-forest-200">
                <div className="bg-forest-900 px-5 py-4 text-cream-50">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-caption uppercase tracking-widest text-cream-200/90">
                        Step 1
                      </p>
                      <h2 className="font-serif text-h2 text-cream-50">
                        Pay with UPI
                      </h2>
                    </div>
                    <span className="rounded-lg bg-white/15 px-2.5 py-1 text-caption font-semibold">
                      UPI
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  <UpiAppBadges />

                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="rounded-xl border-2 border-forest-100 bg-white p-3 shadow-sm shrink-0">
                      <img
                        src={qrUrl}
                        alt="Scan to pay with UPI"
                        width={200}
                        height={200}
                        className="h-[200px] w-[200px] object-contain"
                      />
                      <p className="mt-2 text-center text-caption text-ink-500">
                        Scan with any UPI app
                      </p>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      <div>
                        <p className="text-caption text-ink-500">Payee</p>
                        <p className="text-body font-semibold text-ink-900">
                          {config.business.upiPayee}
                        </p>
                      </div>
                      <div>
                        <p className="text-caption text-ink-500">UPI ID</p>
                        <div className="mt-1 flex items-center gap-2 rounded-lg border border-ink-200 bg-cream-50 px-3 py-2.5">
                          <span className="font-mono text-body text-ink-900 flex-1 truncate">
                            {config.business.upiId}
                          </span>
                          <button
                            type="button"
                            onClick={copyUpi}
                            className="touch-icon text-forest-800 hover:bg-forest-50"
                            aria-label="Copy UPI ID"
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="rounded-lg bg-forest-50 border border-forest-100 px-4 py-3">
                        <p className="text-caption text-forest-700">Amount to pay</p>
                        <p className="text-display font-serif text-forest-900 leading-none mt-0.5">
                          {formatINR(total)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-forest-100 bg-forest-50/80 px-4 py-4">
                    <p className="text-body font-medium text-forest-900">
                      After you pay, scroll down to Step 3
                    </p>
                    <p className="mt-1.5 text-small text-forest-800/90 leading-relaxed">
                      Scan the QR code or copy the UPI ID above using GPay,
                      PhonePe, Paytm or any UPI app. Then upload your payment
                      screenshot in the section below along with your delivery
                      details.
                    </p>
                  </div>
                </div>
              </Card>

              <Card padding="lg">
                <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
                  Step 2
                </p>
                <h2 className="font-serif text-h2 text-ink-900 mt-1">
                  Delivery details
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
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
                <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
                  Step 3
                </p>
                <h2 className="font-serif text-h2 text-ink-900 mt-1">
                  Confirm payment
                </h2>
                <p className="mt-1 text-small text-ink-600">
                  Upload a clear screenshot of your successful UPI payment below.
                  We verify every order manually within one working day.
                </p>
                <div className="mt-4 space-y-3">
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
                    hint="PNG or JPG from GPay / PhonePe / Paytm payment screen."
                    onFileSelected={setFile}
                  />
                </div>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-caption text-ink-500">
                  <ShieldCheck className="h-4 w-4 text-forest-600 shrink-0" />
                  We never store your UPI PIN or bank login.
                </p>
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>

      {/* Mobile sticky submit bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-100 bg-surface-raised/95 backdrop-blur-md px-4 py-3 pb-safe shadow-raised lg:hidden"
      >
        <div className="mx-auto flex max-w-content items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-caption text-ink-500">Total</p>
            <p className="text-price font-semibold text-ink-900 leading-tight">
              {formatINR(total)}
            </p>
          </div>
          <Button
            size="lg"
            className="shrink-0 min-w-[140px]"
            loading={submitting || uploading}
            disabled={!canSubmit}
            onClick={submitOrder}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
          >
            Submit order
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
