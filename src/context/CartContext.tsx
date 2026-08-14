import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { readStore, writeStore } from '../lib/storage';

export type CartItemType = 'product' | 'training';

export interface CartItem {
  id: string; // product_id or course_id
  type: CartItemType;
  name: string;
  price: number;
  qty: number;
  image?: string;
  slug?: string;
  unit?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  updateQty: (id: string, type: CartItemType, qty: number) => void;
  removeItem: (id: string, type: CartItemType) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORE_KEY = 'lakhe.cart';

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

  useEffect(() => {
    writeStore(STORE_KEY, items);
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (x) => x.id === item.id && x.type === item.type
      );
      if (idx >= 0) {
        const next = [...prev];
        // Training courses are single-purchase; cap at 1.
        next[idx] = {
          ...next[idx],
          qty:
            item.type === 'training' ? 1 : Math.max(1, next[idx].qty + qty),
        };
        return next;
      }
      return [...prev, { ...item, qty: item.type === 'training' ? 1 : qty }];
    });
  }, []);

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

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((s, x) => s + x.qty, 0);
    const subtotal = items.reduce((s, x) => s + x.price * x.qty, 0);
    return { items, itemCount, subtotal, addItem, updateQty, removeItem, clear };
  }, [items, addItem, updateQty, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
