import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { Footer } from './Footer';
import { AddedToCartBar } from '../cart/AddedToCartBar';
import { CheckoutTopBar } from '../cart/CheckoutTopBar';
import { cn } from '../../utils/cn';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export interface AppShellProps {
  children: ReactNode;
  cartCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  hideBottomNav?: boolean;
  hideFooter?: boolean;
  className?: string;
}

/**
 * AppShell — Header + main + Footer + Mobile bottom nav.
 * Reads cart count and auth state from context when props are not provided,
 * so pages just render their children and the shell handles global chrome.
 */
export function AppShell({
  children,
  cartCount: cartCountProp,
  isLoggedIn: isLoggedInProp,
  userName: userNameProp,
  hideBottomNav = false,
  hideFooter = false,
  className,
}: AppShellProps) {
  const { itemCount, recentAdd } = useCart();
  const { user, profile } = useAuth();
  const location = useLocation();

  const cartCount = cartCountProp ?? itemCount;
  const isLoggedIn = isLoggedInProp ?? !!user;
  const userName =
    userNameProp ?? profile?.full_name ?? user?.email?.split('@')[0];
  const showFooter = !hideFooter && location.pathname === '/';
  const onCheckoutPath =
    location.pathname === '/cart' || location.pathname === '/payment';

  return (
    <div className="min-h-dvh flex flex-col bg-white text-ink-800">
      <Header
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
      {recentAdd && !onCheckoutPath && <AddedToCartBar />}
      {onCheckoutPath && itemCount > 0 && <CheckoutTopBar />}
      <main
        className={cn(
          'flex-1 w-full',
          (recentAdd && !onCheckoutPath) || (onCheckoutPath && itemCount > 0)
            ? 'pt-12 sm:pt-[3.25rem]'
            : undefined,
          !hideBottomNav &&
            'pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom)+8px)] lg:pb-0',
          className
        )}
      >
        {children}
      </main>
      {!hideFooter && showFooter && <Footer />}
      {!hideBottomNav && <MobileBottomNav cartCount={cartCount} />}
    </div>
  );
}
