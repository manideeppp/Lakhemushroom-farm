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
        'group block overflow-hidden rounded-3xl bg-white text-center shadow-[0_8px_32px_rgba(30,53,32,0.08)] border border-forest-100/80 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(30,53,32,0.12)] hover:border-forest-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500',
        className
      )}
    >
      <div
        className="relative bg-gradient-to-b from-sage-50/90 via-cream-50 to-white px-6 pt-10 pb-5 sm:px-12 sm:pt-12 sm:pb-7"
      >
        <div className="relative mx-auto max-w-lg sm:max-w-xl">
          <img
            src={image}
            alt={imageAlt}
            className="mx-auto h-56 sm:h-72 lg:h-80 w-full object-contain drop-shadow-[0_16px_36px_rgba(30,53,32,0.14)] transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
          <span
            className="absolute -bottom-2 left-1/2 inline-flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-sage-100 text-forest-800 shadow-md"
            aria-hidden
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        </div>
      </div>
      <div className="px-6 pb-9 pt-6 sm:px-12 sm:pb-11 sm:pt-7">
        <h3 className="font-serif text-h2 sm:text-[1.75rem] text-forest-900 leading-tight">
          {title}
        </h3>
        <p className="mt-3 text-body sm:text-body-lg text-forest-700/88 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
        <span
          className="mt-7 inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-800 text-cream-50 shadow-md transition-all group-hover:translate-x-0.5 group-hover:bg-forest-900 group-hover:shadow-lg"
          aria-hidden
        >
          <ArrowRight className="h-5 w-5" />
        </span>
        <span className="sr-only">Learn more about {title}</span>
      </div>
    </Link>
  );
}
