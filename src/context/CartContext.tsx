import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { readStore, writeStore } from '../lib/storage';
import { validateCouponCode } from '../lib/data';
import type { AppliedCoupon } from '../types/coupon';

export type CartItemType = 'product' | 'training';

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  price: number;
  qty: number;
  image?: string;
  slug?: string;
  unit?: string;
}

interface RecentAdd {
  name: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  appliedCoupon: AppliedCoupon | null;
  discount: number;
  recentAdd: RecentAdd | null;
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  updateQty: (id: string, type: CartItemType, qty: number) => void;
  removeItem: (id: string, type: CartItemType) => void;
  clear: () => void;
  applyCoupon: (code: string) => Promise<string | null>;
  clearCoupon: () => void;
  dismissRecentAdd: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORE_KEY = 'lakhe.cart';
const COUPON_KEY = 'lakhe.coupon';

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    readStore<CartItem[]>(STORE_KEY, [])
  );
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    () => readStore<AppliedCoupon | null>(COUPON_KEY, null)
  );
  const [recentAdd, setRecentAdd] = useState<RecentAdd | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    writeStore(STORE_KEY, items);
  }, [items]);

  useEffect(() => {
    writeStore(COUPON_KEY, appliedCoupon);
  }, [appliedCoupon]);

  const dismissRecentAdd = useCallback(() => {
    setRecentAdd(null);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((s, x) => s + x.price * x.qty, 0),
    [items]
  );

  const discount = appliedCoupon?.discount ?? 0;

  const addItem = useCallback(
    (item: Omit<CartItem, 'qty'>, qty = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex(
          (x) => x.id === item.id && x.type === item.type
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            qty:
              item.type === 'training' ? 1 : Math.max(1, next[idx].qty + qty),
          };
          return next;
        }
        return [...prev, { ...item, qty: item.type === 'training' ? 1 : qty }];
      });

      setRecentAdd({ name: item.name });
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = setTimeout(() => setRecentAdd(null), 5000);

      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    []
  );

  const updateQty = useCallback(
    (id: string, type: CartItemType, qty: number) => {
      setItems((prev) => {
        if (qty <= 0) return prev.filter((x) => !(x.id === id && x.type === type));
        return prev.map((x) =>
          x.id === id && x.type === type
            ? { ...x, qty: type === 'training' ? 1 : qty }
            : x
        );
      });
    },
    []
  );

  const removeItem = useCallback((id: string, type: CartItemType) => {
    setItems((prev) => prev.filter((x) => !(x.id === id && x.type === type)));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
    dismissRecentAdd();
  }, [dismissRecentAdd]);

  const clearCoupon = useCallback(() => setAppliedCoupon(null), []);

  const applyCoupon = useCallback(
    async (code: string): Promise<string | null> => {
      const result = await validateCouponCode(code, subtotal);
      if (!result.valid) {
        return result.message ?? 'Invalid coupon.';
      }
      setAppliedCoupon({
        code: result.code!,
        discount: result.discount!,
        discount_type: result.discount_type!,
        discount_value: result.discount_value!,
      });
      return null;
    },
    [subtotal]
  );

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((s, x) => s + x.qty, 0);
    return {
      items,
      itemCount,
      subtotal,
      appliedCoupon,
      discount,
      recentAdd,
      addItem,
      updateQty,
      removeItem,
      clear,
      applyCoupon,
      clearCoupon,
      dismissRecentAdd,
    };
  }, [
    items,
    subtotal,
    appliedCoupon,
    discount,
    recentAdd,
    addItem,
    updateQty,
    removeItem,
    clear,
    applyCoupon,
    clearCoupon,
    dismissRecentAdd,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
