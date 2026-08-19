import type { ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface HomeGrowOfferingCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  to: string;
  className?: string;
}

/** Compact offering card — image hero like product cards, smaller footprint. */
export function HomeGrowOfferingCard({
  title,
  description,
  image,
  imageAlt,
  to,
  className,
}: HomeGrowOfferingCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-cream-50 shadow-[0_4px_22px_rgba(30,53,32,0.08)] transition-shadow hover:shadow-[0_8px_28px_rgba(30,53,32,0.11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500',
        className
      )}
    >
      <div className="relative aspect-[3/2] shrink-0 overflow-hidden bg-cream-50">
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-contain object-center p-2 sm:p-3"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="flex flex-col items-center px-5 pb-5 pt-4 text-center">
        <h3 className="font-serif text-[1.2rem] sm:text-[1.35rem] text-forest-900 leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-[0.8125rem] sm:text-small text-forest-700/85 max-w-[16rem] leading-relaxed">
          {description}
        </p>
        <span
          className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-cream-50 transition-colors group-hover:bg-forest-900"
          aria-hidden
        >
          <ArrowRight className="h-4 w-4" />
        </span>
        <span className="sr-only">Learn more about {title}</span>
      </div>
    </Link>
  );
}
