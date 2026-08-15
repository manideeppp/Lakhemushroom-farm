import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../forms/Input';
import { useCart } from '../../context/CartContext';
import { useToast } from '../feedback/ToastProvider';
import { formatINR } from '../../utils/format';

export function CouponCodeField({ className }: { className?: string }) {
  const { appliedCoupon, applyCoupon, clearCoupon } = useCart();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleApply() {
    if (!code.trim()) return;
    try {
      setLoading(true);
      const err = await applyCoupon(code);
      if (err) {
        toast({ tone: 'warning', message: err });
      } else {
        toast({ tone: 'success', message: 'Coupon applied.' });
        setCode('');
      }
    } catch (e) {
      toast({
        tone: 'danger',
        message: e instanceof Error ? e.message : 'Could not apply coupon.',
      });
    } finally {
      setLoading(false);
    }
  }

  if (appliedCoupon) {
    return (
      <div
        className={`flex items-center justify-between gap-2 rounded-xl border border-forest-200 bg-forest-50/80 px-3 py-2.5 ${className ?? ''}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Tag className="h-4 w-4 text-forest-700 shrink-0" />
          <div className="min-w-0">
            <p className="text-small font-medium text-forest-900">
              {appliedCoupon.code}
            </p>
            <p className="text-caption text-forest-700">
              −{formatINR(appliedCoupon.discount)} off
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => clearCoupon()}
          className="touch-icon text-forest-700 hover:text-danger shrink-0"
          aria-label="Remove coupon"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex gap-2">
        <Input
          placeholder="Coupon code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          leftIcon={<Tag className="h-4 w-4" />}
          containerClassName="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleApply();
            }
          }}
        />
        <Button
          variant="outline"
          onClick={() => void handleApply()}
          loading={loading}
          className="shrink-0"
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
