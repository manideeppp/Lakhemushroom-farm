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

export function HomeGrowOfferingCard({
  title,
  description,
  image,
  imageAlt,
  icon: Icon,
  to,
  className,
}: HomeGrowOfferingCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group block overflow-hidden rounded-2xl bg-cream-50 text-center shadow-[0_4px_24px_rgba(30,53,32,0.07)] border border-forest-100/70 transition-shadow hover:shadow-[0_8px_32px_rgba(30,53,32,0.11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500',
        className
      )}
    >
      <div className="relative bg-cream-100 px-4 pt-6 pb-10 sm:px-6 sm:pt-8 sm:pb-12">
        <img
          src={image}
          alt={imageAlt}
          className="mx-auto w-full h-auto max-h-48 sm:max-h-56 lg:max-h-64 object-contain object-center"
          loading="lazy"
          decoding="async"
        />
        <span
          className="absolute bottom-0 left-1/2 z-10 inline-flex h-11 w-11 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-cream-100 text-forest-800 shadow-[0_2px_12px_rgba(30,53,32,0.12)] ring-4 ring-cream-50"
          aria-hidden
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>

      <div className="px-6 pb-8 pt-9 sm:px-8 sm:pb-9 sm:pt-10 bg-cream-50">
        <h3 className="font-serif text-h2 sm:text-[1.65rem] text-forest-900 leading-tight">
          {title}
        </h3>
        <p className="mt-3 text-body text-forest-700/85 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
        <span
          className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-cream-50 transition-colors group-hover:bg-forest-900"
          aria-hidden
        >
          <ArrowRight className="h-4 w-4" />
        </span>
        <span className="sr-only">Learn more about {title}</span>
      </div>
    </Link>
  );
}
