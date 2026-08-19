import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed z-40 inline-flex h-11 w-11 items-center justify-center rounded-full',
        'bg-forest-800 text-cream-50 shadow-lg border border-forest-700/40',
        'transition-all duration-200 hover:bg-forest-900 active:scale-95',
        'right-4 lg:right-6',
        'bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom)+12px)] lg:bottom-6',
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-2 opacity-0 pointer-events-none'
      )}
    >
      <ArrowUp className="h-5 w-5" aria-hidden />
    </button>
  );
}
