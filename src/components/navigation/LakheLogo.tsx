import { cn } from '../../utils/cn';

export interface LakheLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'stacked' | 'inline' | 'mark';
  tone?: 'dark' | 'light';
  className?: string;
}

const sizeMap = {
  sm: { mark: 'h-7 w-7', word: 'text-body', tag: 'text-caption' },
  md: { mark: 'h-9 w-9', word: 'text-body-lg', tag: 'text-caption' },
  lg: { mark: 'h-11 w-11', word: 'text-h3', tag: 'text-label' },
};

/**
 * LakheLogo — brand mark + wordmark inspired by the reference:
 * a rounded green tile with an abstract mushroom silhouette, alongside
 * the "Lakhe" serif wordmark and small sans-serif tagline.
 */
export function LakheLogo({
  size = 'md',
  variant = 'stacked',
  tone = 'dark',
  className,
}: LakheLogoProps) {
  const s = sizeMap[size];
  const wordColor = tone === 'dark' ? 'text-forest-800' : 'text-cream-50';
  const tagColor = tone === 'dark' ? 'text-forest-600' : 'text-cream-200';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 select-none',
        variant === 'stacked' ? 'items-center' : 'items-center',
        className
      )}
      aria-label="Lakhe Mushroom Farm"
    >
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-md bg-brand text-cream-50 shadow-subtle',
          s.mark
        )}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-3/5 w-3/5" fill="currentColor">
          <path d="M8 21c0-4.4 3.6-8 8-8s8 3.6 8 8H8z" />
          <rect x="12" y="21" width="8" height="6" rx="1.5" />
        </svg>
      </span>
      {variant !== 'mark' && (
        <span className="flex flex-col leading-none">
          <span className={cn('font-serif font-semibold', s.word, wordColor)}>
            Lakhe
          </span>
          <span
            className={cn(
              'font-sans uppercase tracking-[0.18em] mt-0.5',
              s.tag,
              tagColor
            )}
          >
            Mushroom Farm
          </span>
        </span>
      )}
    </span>
  );
}
