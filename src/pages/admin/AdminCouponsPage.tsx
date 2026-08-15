import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, Tag } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { Textarea } from '../../components/forms/Textarea';
import { Select } from '../../components/forms/Select';
import { Checkbox } from '../../components/forms/Checkbox';
import { Modal } from '../../components/ui/Modal';
import { LoadingState } from '../../components/feedback/States';
import { useToast } from '../../components/feedback/ToastProvider';
import { deleteCoupon, listCoupons, upsertCoupon } from '../../lib/data';
import type { Coupon, CouponDiscountType } from '../../types/coupon';
import { newId } from '../../utils/ids';

const emptyCoupon = (): Coupon => ({
  id: newId(),
  code: '',
  description: '',
  discount_type: 'percent',
  discount_value: 10,
  min_subtotal: 0,
  used_count: 0,
  is_active: true,
});

export function AdminCouponsPage() {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setCoupons(await listCoupons());
  }

  useEffect(() => {
    void load();
  }, []);

  async function save() {
    if (!editing) return;
    if (!editing.code.trim() || editing.discount_value <= 0) {
      toast({ tone: 'warning', message: 'Code and discount value are required.' });
      return;
    }
    try {
      setSaving(true);
      await upsertCoupon(editing);
      toast({ tone: 'success', message: 'Coupon saved.' });
      setEditing(null);
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not save.',
      });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      toast({ tone: 'success', message: 'Coupon deleted.' });
      await load();
    } catch (err) {
      toast({
        tone: 'danger',
        message: err instanceof Error ? err.message : 'Could not delete.',
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
            Promotions
          </p>
          <h2 className="font-serif text-h1 text-ink-900 leading-tight">
            Coupon codes
          </h2>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setEditing(emptyCoupon())}
        >
          New coupon
        </Button>
      </div>

      {!coupons ? (
        <LoadingState />
      ) : coupons.length === 0 ? (
        <Card padding="lg" className="text-center text-small text-ink-600">
          No coupons yet. Create one for checkout discounts.
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {coupons.map((c) => (
            <Card key={c.id} padding="md" className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-body font-semibold text-ink-900">
                    {c.code}
                  </p>
                  <p className="text-caption text-ink-600 mt-0.5">
                    {c.description || 'No description'}
                  </p>
                </div>
                <Badge variant={c.is_active ? 'approved' : 'neutral'}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-small text-ink-700">
                {c.discount_type === 'percent'
                  ? `${c.discount_value}% off`
                  : `₹${c.discount_value} off`}
                {c.min_subtotal > 0 && ` · min ₹${c.min_subtotal}`}
              </p>
              <p className="text-caption text-ink-500">
                Used {c.used_count}
                {c.max_uses != null ? ` / ${c.max_uses}` : ''} times
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Pencil className="h-3.5 w-3.5" />}
                  onClick={() => setEditing(c)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => void remove(c.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.code ? `Edit ${editing.code}` : 'New coupon'}
      >
        {editing && (
          <div className="space-y-3">
            <Input
              label="Code"
              value={editing.code}
              onChange={(e) =>
                setEditing({ ...editing, code: e.target.value.toUpperCase() })
              }
              leftIcon={<Tag className="h-4 w-4" />}
              placeholder="WELCOME10"
            />
            <Textarea
              label="Description"
              rows={2}
              value={editing.description ?? ''}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Select
                label="Discount type"
                value={editing.discount_type}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    discount_type: e.target.value as CouponDiscountType,
                  })
                }
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed amount (₹)</option>
              </Select>
              <Input
                label="Discount value"
                type="number"
                min={1}
                value={editing.discount_value}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    discount_value: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Minimum subtotal (₹)"
                type="number"
                min={0}
                value={editing.min_subtotal}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    min_subtotal: Number(e.target.value),
                  })
                }
              />
              <Input
                label="Max uses (optional)"
                type="number"
                min={1}
                value={editing.max_uses ?? ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    max_uses: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            </div>
            <Checkbox
              label="Active"
              checked={editing.is_active}
              onChange={(e) =>
                setEditing({ ...editing, is_active: e.target.checked })
              }
            />
            <Button fullWidth loading={saving} onClick={() => void save()}>
              Save coupon
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
