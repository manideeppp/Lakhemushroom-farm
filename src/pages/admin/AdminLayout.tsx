import { useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CalendarClock,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  MailQuestion,
  Menu,
  Package,
  ShoppingBag,
  Users2,
  X,
} from 'lucide-react';
import { LakheLogo } from '../../components/navigation/LakheLogo';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const NAV: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag className="h-4 w-4" /> },
  { to: '/admin/customers', label: 'Customers', icon: <Users2 className="h-4 w-4" /> },
  { to: '/admin/products', label: 'Products', icon: <Package className="h-4 w-4" /> },
  { to: '/admin/training', label: 'Training', icon: <BookOpen className="h-4 w-4" /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <CalendarClock className="h-4 w-4" /> },
  { to: '/admin/queries', label: 'Queries', icon: <MailQuestion className="h-4 w-4" /> },
  { to: '/admin/gallery', label: 'Gallery', icon: <ImageIcon className="h-4 w-4" /> },
];

export function AdminLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const initials = (profile?.full_name ?? user?.email ?? 'A')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-dvh flex bg-cream-50 text-ink-800">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-ink-100 bg-surface-raised">
        <div className="h-16 flex items-center gap-2 px-4 border-b border-ink-100">
          <LakheLogo size="sm" />
          <Badge variant="premium">Admin</Badge>
        </div>
        <SidebarBody />
        <SidebarFooter
          initials={initials}
          email={user?.email ?? ''}
          onSignOut={async () => {
            await signOut();
            navigate('/');
          }}
        />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-ink-900/40" />
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 h-full w-64 bg-surface-raised border-r border-ink-100 flex flex-col animate-slide-up"
          >
            <div className="h-16 flex items-center justify-between gap-2 px-4 border-b border-ink-100">
              <div className="flex items-center gap-2">
                <LakheLogo size="sm" />
                <Badge variant="premium">Admin</Badge>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-ink-500 hover:text-ink-900 hover:bg-ink-100/60"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarBody onClick={() => setOpen(false)} />
            <SidebarFooter
              initials={initials}
              email={user?.email ?? ''}
              onSignOut={async () => {
                await signOut();
                navigate('/');
              }}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-ink-100 bg-surface-raised/95 backdrop-blur-md px-3 sm:px-4">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-forest-800 hover:bg-forest-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-forest-800" />
            <h1 className="font-serif text-h3 text-ink-900">Admin Portal</h1>
          </div>
          <Link
            to="/"
            className="ml-auto text-caption text-forest-800 hover:underline"
          >
            View site →
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarBody({ onClick }: { onClick?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto p-3">
      <ul className="space-y-0.5">
        {NAV.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === '/admin'}
              onClick={onClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-3 h-10 text-small font-medium transition',
                  isActive
                    ? 'bg-forest-50 text-brand'
                    : 'text-ink-700 hover:bg-forest-50/60 hover:text-forest-800'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SidebarFooter({
  initials,
  email,
  onSignOut,
}: {
  initials: string;
  email: string;
  onSignOut: () => Promise<void>;
}) {
  return (
    <div className="border-t border-ink-100 p-3">
      <div className="flex items-center gap-2 rounded-md bg-cream-50 p-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-100 text-forest-800 text-small font-semibold">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-medium text-ink-900">
            {email}
          </p>
          <p className="text-caption text-ink-500">Signed in</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          aria-label="Sign out"
          className="rounded-md p-1.5 text-ink-500 hover:text-danger hover:bg-ink-100/60"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
