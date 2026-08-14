import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { config } from '../../lib/config';
import { cn } from '../../utils/cn';

export interface WhatsAppFloatProps {
  className?: string;
  withBottomNav?: boolean;
}

/**
 * Floating WhatsApp action — sits above the mobile bottom nav.
 */
export function WhatsAppFloat({
  className,
  withBottomNav = true,
}: WhatsAppFloatProps) {
  const location = useLocation();
  const hideOnContact = location.pathname === '/contact';

  if (hideOnContact) return null;

  return (
    <a
      href={`https://wa.me/${config.business.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        'fixed z-40 flex h-14 w-14 items-center justify-center rounded-full',
        'bg-[#25D366] text-white shadow-lg shadow-forest-900/20',
        'transition-transform duration-200 hover:scale-105 active:scale-95',
        'right-4 lg:bottom-6 lg:right-6',
        withBottomNav
          ? 'bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom)+12px)]'
          : 'bottom-[calc(env(safe-area-inset-bottom)+16px)]',
        className
      )}
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </a>
  );
}
