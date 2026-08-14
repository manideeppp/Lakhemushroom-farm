import type { ReactNode } from 'react';
import { Header } from './Header';
import { MobileBottomNav } from '../navigation/MobileBottomNav';
import { Footer } from './Footer';
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
  const { itemCount } = useCart();
  const { user, profile } = useAuth();

  const cartCount = cartCountProp ?? itemCount;
  const isLoggedIn = isLoggedInProp ?? !!user;
  const userName =
    userNameProp ?? profile?.full_name ?? user?.email?.split('@')[0];

  return (
    <div className="min-h-dvh flex flex-col bg-surface text-ink-800">
      <Header
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />
      <main
        className={cn(
          'flex-1 w-full',
          !hideBottomNav &&
            'pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom)+8px)] lg:pb-0',
          className
        )}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
      {!hideBottomNav && <MobileBottomNav cartCount={cartCount} />}
    </div>
  );
}
