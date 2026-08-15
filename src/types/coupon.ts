export type CouponDiscountType = 'percent' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  min_subtotal: number;
  max_uses?: number | null;
  used_count: number;
  is_active: boolean;
  expires_at?: string | null;
  created_at?: string;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  discount_type: CouponDiscountType;
  discount_value: number;
}
