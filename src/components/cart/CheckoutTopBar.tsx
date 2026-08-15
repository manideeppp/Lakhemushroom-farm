import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CreditCard, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/format';

const SHIPPING_FLAT = 60;
const FREE_SHIPPING_THRESHOLD = 999;

export function CheckoutTopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, itemCount, subtotal, discount } = useCart();

  const onCart = pathname === '/cart';
  const onPayment = pathname === '/payment';
  if ((!onCart && !onPayment) || items.length === 0) return null;

  const hasProducts = items.some((it) => it.type === 'product');
  const shipping = hasProducts
    ? subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FLAT
    : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  function goCheckout() {
    if (!user) {
      navigate('/login', { state: { redirectTo: '/payment' } });
    } else {
      navigate('/payment');
    }
  }

  return (
    <div
      className="fixed inset-x-0 top-[var(--header-h)] z-40 border-b border-forest-200/60 bg-forest-900/95 text-cream-50 shadow-lg backdrop-blur-md animate-slide-up"
      role="status"
    >
      <div className="mx-auto flex max-w-content items-center gap-2 px-4 py-2.5 sm:gap-3">
        {onPayment ? (
          <CreditCard className="h-4 w-4 shrink-0 text-cream-200" />
        ) : (
          <ShoppingBag className="h-4 w-4 shrink-0 text-cream-200" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-small font-medium leading-tight">
            {onPayment ? 'Checkout' : 'Your cart'}
          </p>
          <p className="text-caption text-cream-200/90">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · {formatINR(total)}
          </p>
        </div>
        {onCart ? (
          <Button
            size="sm"
            className="!bg-cream-50 !text-forest-900 hover:!bg-cream-100 shrink-0"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            onClick={goCheckout}
          >
            Checkout
          </Button>
        ) : (
          <Link to="/cart" className="shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="!border-cream-200/50 !text-cream-50 hover:!bg-white/10"
            >
              View cart
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
