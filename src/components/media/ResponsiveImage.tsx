import { useState, type ImgHTMLAttributes } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface ResponsiveImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  aspect?: string;
  rounded?: 'none' | 'md' | 'lg' | 'xl' | '2xl' | 'pill';
  fit?: 'cover' | 'contain';
  containerClassName?: string;
}

const roundedMap = {
  none: 'rounded-none',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  pill: 'rounded-pill',
};

/**
 * ResponsiveImage — wraps an <img> in an aspect-ratio box with graceful
 * loading / error states. Uses native lazy-loading by default.
 */
export function ResponsiveImage({
  src,
  alt,
  aspect = 'aspect-[4/3]',
  rounded = 'lg',
  fit = 'cover',
  className,
  containerClassName,
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-ink-100',
        aspect,
        roundedMap[rounded],
        containerClassName
      )}
    >
      {!loaded && !errored && (
        <span className="absolute inset-0 skeleton-shimmer" aria-hidden />
      )}
      {errored ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-ink-400">
          <ImageOff className="h-6 w-6" aria-hidden />
          <span className="text-caption">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-300',
            fit === 'cover' ? 'object-cover' : 'object-contain',
            loaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          {...rest}
        />
      )}
    </div>
  );
}
