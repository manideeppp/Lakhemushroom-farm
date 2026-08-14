import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/feedback/States';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/format';

const SHIPPING_FLAT = 60;
const FREE_SHIPPING_THRESHOLD = 999;

export function CartPage() {
  const { items, subtotal, updateQty, removeItem, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = items.some((it) => it.type === 'product')
    ? subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FLAT
    : 0;
  const total = subtotal + shipping;

  function proceed() {
    if (!user) {
      navigate('/login', {
        state: { redirectTo: '/payment' },
      });
    } else {
      navigate('/payment');
    }
  }

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
          >
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </button>
          <SectionHeader
            eyebrow="Your Cart"
            title={items.length ? `${itemCount} items in cart` : 'Your cart'}
            description={
              items.length
                ? 'Review your items, then head to checkout — we accept UPI.'
                : undefined
            }
          />

          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              message="Discover fresh produce, wellness powders and training programs."
              icon={<ShoppingBag className="h-6 w-6" />}
              action={
                <Link to="/products">
                  <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Explore products
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              {/* Items */}
              <div className="space-y-3">
                {items.map((it) => (
                  <Card
                    key={`${it.type}-${it.id}`}
                    padding="md"
                    className="flex gap-3"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-forest-50">
                      {it.image && (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-body font-serif font-semibold text-ink-900 leading-tight line-clamp-2">
                            {it.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant={it.type === 'training' ? 'online' : 'fresh'}
                            >
                              {it.type === 'training' ? 'Training' : 'Product'}
                            </Badge>
                            {it.unit && (
                              <span className="text-caption text-ink-500">
                                {it.unit}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(it.id, it.type)}
                          className="rounded-md p-1.5 text-ink-500 hover:text-danger hover:bg-ink-100/60"
                          aria-label={`Remove ${it.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {it.type === 'training' ? (
                          <span className="text-caption text-ink-500">
                            Single enrolment
                          </span>
                        ) : (
                          <div className="flex items-center rounded-md border border-ink-200">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(it.id, it.type, it.qty - 1)
                              }
                              className="h-9 w-9 text-ink-700 hover:bg-forest-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4 mx-auto" />
                            </button>
                            <span className="w-8 text-center text-body font-medium">
                              {it.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(it.id, it.type, it.qty + 1)
                              }
                              className="h-9 w-9 text-ink-700 hover:bg-forest-50"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4 mx-auto" />
                            </button>
                          </div>
                        )}
                        <span className="text-price font-semibold text-ink-900">
                          {formatINR(it.price * it.qty)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Summary */}
              <div>
                <Card
                  padding="lg"
                  elevated
                  className="lg:sticky lg:top-24 space-y-3"
                >
                  <h3 className="font-serif text-h3 text-ink-900">
                    Order summary
                  </h3>
                  <dl className="space-y-1.5 text-small text-ink-700">
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
                  {shipping > 0 && (
                    <p className="text-caption text-ink-500">
                      Add {formatINR(FREE_SHIPPING_THRESHOLD - subtotal)} more
                      for free shipping.
                    </p>
                  )}
                  <Button
                    fullWidth
                    size="lg"
                    onClick={proceed}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Proceed to payment
                  </Button>
                  <p className="text-caption text-ink-500 text-center">
                    Secure UPI checkout · Receipt on approval
                  </p>
                </Card>
              </div>
            </div>
          )}
        </Section>
      </PageContainer>
    </AppShell>
  );
}
