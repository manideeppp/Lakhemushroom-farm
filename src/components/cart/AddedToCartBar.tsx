import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/format';

export function AddedToCartBar() {
  const { recentAdd, dismissRecentAdd, itemCount, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!recentAdd) return null;

  function goCheckout() {
    dismissRecentAdd();
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
      <div className="mx-auto flex max-w-content items-center gap-2 px-4 py-2.5">
        <ShoppingBag className="h-4 w-4 shrink-0 text-cream-200" />
        <div className="min-w-0 flex-1">
          <p className="text-small font-medium leading-tight truncate">
            Added · {recentAdd.name}
          </p>
          <p className="text-caption text-cream-200/90">
            {itemCount} items · {formatINR(subtotal)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link to="/cart" onClick={() => dismissRecentAdd()}>
            <Button
              size="sm"
              variant="outline"
              className="!border-cream-200/50 !text-cream-50 hover:!bg-white/10 hidden xs:inline-flex"
            >
              View cart
            </Button>
          </Link>
          <Button
            size="sm"
            className="!bg-cream-50 !text-forest-900 hover:!bg-cream-100"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            onClick={goCheckout}
          >
            Checkout
          </Button>
        </div>
        <button
          type="button"
          onClick={() => dismissRecentAdd()}
          className="touch-icon text-cream-200 hover:text-cream-50 shrink-0"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
