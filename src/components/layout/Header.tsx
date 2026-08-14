import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { LakheLogo } from '../navigation/LakheLogo';
import { MobileDrawer } from '../ui/MobileDrawer';
import { Input } from '../forms/Input';

export interface HeaderProps {
  cartCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const desktopLinks = [
  { to: '/products', label: 'Products' },
  { to: '/training', label: 'Training' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
];

const mobileMenuLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/training', label: 'Training' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'Our Story' },
  { to: '/founder', label: 'The Founder' },
  { to: '/contact', label: 'Contact' },
];

export function Header({
  cartCount = 0,
  isLoggedIn = false,
  userName,
  onSearch,
  className,
}: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query.trim());
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full bg-surface/85 backdrop-blur-md border-b border-ink-100',
          className
        )}
      >
        <div className="mx-auto flex h-[60px] w-full max-w-content items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Mobile: menu button */}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-forest-800 hover:bg-forest-50 lg:hidden"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Lakhe home">
            <LakheLogo size="md" />
          </Link>

          {/* Desktop nav */}
          <nav className="ml-6 hidden flex-1 lg:flex" aria-label="Primary">
            <ul className="flex items-center gap-1">
              {desktopLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex h-10 items-center rounded-md px-3 text-small font-medium transition',
                        isActive
                          ? 'text-brand'
                          : 'text-ink-700 hover:text-brand hover:bg-forest-50'
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="touch-icon text-forest-800 hover:bg-forest-50"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            <Link
              to="/cart"
              className="relative touch-icon text-forest-800 hover:bg-forest-50"
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-pill bg-brand text-cream-50 text-[10px] font-semibold flex items-center justify-center border-2 border-surface">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <Link
                to="/account"
                className="hidden sm:inline-flex h-10 items-center gap-2 rounded-md px-3 text-small font-medium text-forest-800 hover:bg-forest-50"
                aria-label="Account"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-forest-100 text-forest-700 text-caption font-semibold">
                  {(userName ?? 'L').slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden md:inline">
                  {userName ?? 'Account'}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex h-10 items-center gap-2 rounded-md px-3 text-small font-medium text-forest-800 hover:bg-forest-50"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile-only account icon */}
            <Link
              to={isLoggedIn ? '/account' : '/login'}
              className="touch-icon text-forest-800 hover:bg-forest-50 sm:hidden"
              aria-label={isLoggedIn ? 'Account' : 'Login'}
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Search bar (collapsible) */}
        {searchOpen && (
          <div className="border-t border-ink-100 bg-surface animate-fade-in">
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex w-full max-w-content items-center gap-2 px-4 py-3 sm:px-6 lg:px-8"
            >
              <Input
                autoFocus
                placeholder="Search products, training, or resources…"
                leftIcon={<Search className="h-4 w-4" />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                containerClassName="flex-1"
              />
            </form>
          </div>
        )}
      </header>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Menu"
      >
        <nav aria-label="Mobile menu">
          <ul className="flex flex-col">
            {mobileMenuLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between min-h-12 py-3 border-b border-ink-100 text-body',
                      isActive
                        ? 'text-brand font-semibold'
                        : 'text-ink-800'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </MobileDrawer>
    </>
  );
}
