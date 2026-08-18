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
        'group block rounded-2xl bg-white px-6 py-8 sm:px-10 sm:py-10 text-center shadow-card border border-ink-100/80 transition-all hover:shadow-lg hover:border-forest-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500',
        className
      )}
    >
      <div className="relative mx-auto max-w-[280px] sm:max-w-xs">
        <img
          src={image}
          alt={imageAlt}
          className="mx-auto h-44 sm:h-52 w-full object-contain"
          loading="lazy"
          decoding="async"
        />
        <span
          className="absolute -bottom-1 left-1/2 inline-flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-sage-100 text-forest-800 shadow-subtle"
          aria-hidden
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <h3 className="mt-6 font-serif text-h2 sm:text-[1.65rem] text-forest-900 leading-tight">
        {title}
      </h3>
      <p className="mt-3 text-body text-forest-700/85 max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      <span
        className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-cream-50 transition-transform group-hover:translate-x-0.5 group-hover:bg-forest-900"
        aria-hidden
      >
        <ArrowRight className="h-5 w-5" />
      </span>
      <span className="sr-only">Learn more about {title}</span>
    </Link>
  );
}
