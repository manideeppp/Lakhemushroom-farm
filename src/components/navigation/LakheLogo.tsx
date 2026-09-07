import { cn } from '../../utils/cn';
import { brandAssets } from '../../data/media';

export interface LakheLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'stacked' | 'inline' | 'mark';
  tone?: 'dark' | 'light';
  className?: string;
}

const sizeMap = {
  sm: { mark: 'h-9 w-9', word: 'text-body', tag: 'text-caption' },
  md: { mark: 'h-11 w-11', word: 'text-body-lg', tag: 'text-caption' },
  lg: { mark: 'h-14 w-14', word: 'text-h3', tag: 'text-label' },
};

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
      <img
        src={brandAssets.logo}
        alt=""
        className={cn('shrink-0 object-contain', s.mark)}
        aria-hidden
      />
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
