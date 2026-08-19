import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Building2, GraduationCap, Leaf } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StripItem {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
}

const STRIP_ITEMS: StripItem[] = [
  {
    title: 'Farm-Fresh Products',
    description: 'Fresh, quality-grown mushrooms.',
    to: '/products',
    icon: Leaf,
  },
  {
    title: 'Expert-Led Training',
    description: 'Practical guidance to grow with confidence.',
    to: '/training',
    icon: GraduationCap,
  },
  {
    title: 'Complete Farm Setup',
    description: 'End-to-end mushroom farm solutions.',
    to: '/training/complete-farm-setup',
    icon: Building2,
  },
];

export function HeroOfferingsStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-cream-200/90 bg-cream-50 shadow-[0_4px_28px_rgba(30,53,32,0.09)]',
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-cream-200/90">
        {STRIP_ITEMS.map((item, index) => (
          <Link
            key={item.title}
            to={item.to}
            className={cn(
              'group flex items-center gap-4 px-6 py-6 sm:px-8 sm:py-7 transition-colors hover:bg-cream-100/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest-400',
              index > 0 && 'border-t border-cream-200/90 md:border-t-0'
            )}
          >
            <span
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-100 text-forest-800"
              aria-hidden
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 text-left">
              <p className="font-serif text-[1.05rem] sm:text-[1.125rem] font-semibold leading-snug text-forest-900">
                {item.title}
              </p>
              <p className="mt-1 text-[0.8125rem] sm:text-small leading-relaxed text-forest-700/85">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
