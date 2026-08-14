export type OrderItemType = 'product' | 'training';
export type OrderStatus =
  | 'pending_verification'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type OrderItemStatus =
  | 'pending'
  | 'processing'
  | 'delivered'
  | 'access_pending'
  | 'access_granted'
  | 'rejected';

export interface OrderItem {
  id: string;
  order_id: string;
  item_type: OrderItemType;
  product_id?: string | null;
  course_id?: string | null;
  name: string;
  unit_price: number;
  qty: number;
  status: OrderItemStatus;
  image?: string | null;
}

export interface Order {
  id: string;
  order_ref: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  payment_method: 'upi';
  upi_txn_id?: string;
  payment_screenshot_url?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  approved_at?: string | null;
  items: OrderItem[];
}
