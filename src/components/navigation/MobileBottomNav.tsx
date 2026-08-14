import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  Home,
  ShoppingBag,
  ShoppingCart,
  User,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
}

const items: NavItem[] = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/products', label: 'Products', Icon: ShoppingBag },
  { to: '/training', label: 'Training', Icon: GraduationCap },
  { to: '/cart', label: 'Cart', Icon: ShoppingCart },
  { to: '/account', label: 'Account', Icon: User },
];

export interface MobileBottomNavProps {
  cartCount?: number;
  className?: string;
}

export function MobileBottomNav({ cartCount = 0, className }: MobileBottomNavProps) {
  return (
    <nav
      aria-label="Primary mobile"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-surface-raised/95 backdrop-blur-md lg:hidden',
        'pb-safe',
        className
      )}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pt-1.5">
        {items.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'group relative flex flex-col items-center justify-center gap-0.5 py-1.5',
                  'text-caption font-medium min-h-[52px]',
                  isActive ? 'text-brand' : 'text-ink-500'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'relative inline-flex h-7 w-10 items-center justify-center rounded-pill transition',
                      isActive && 'bg-forest-50'
                    )}
                  >
                    <Icon
                      className="h-[20px] w-[20px]"
                      strokeWidth={isActive ? 2.2 : 1.7}
                      aria-hidden
                    />
                    {to === '/cart' && cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-pill bg-brand text-cream-50 text-[10px] font-semibold flex items-center justify-center border-2 border-surface-raised">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </span>
                  <span
                    className={cn(
                      'leading-none',
                      isActive ? 'font-semibold' : 'font-medium'
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
