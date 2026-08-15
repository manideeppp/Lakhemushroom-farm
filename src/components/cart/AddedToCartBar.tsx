import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/format';

export function AddedToCartBar() {
  const { recentAdd, dismissRecentAdd, itemCount, subtotal } = useCart();

  if (!recentAdd) return null;

  return (
    <div
      className="fixed inset-x-0 top-[var(--header-h)] z-40 border-b border-forest-200/60 bg-forest-900/95 text-cream-50 shadow-lg backdrop-blur-md animate-slide-up lg:hidden"
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
        <Link to="/cart" onClick={() => dismissRecentAdd()}>
          <Button
            size="sm"
            className="!bg-cream-50 !text-forest-900 hover:!bg-cream-100 shrink-0"
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            View cart
          </Button>
        </Link>
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
