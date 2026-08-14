import { useState, type VideoHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface ResponsiveVideoProps
  extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
  src: string;
  poster?: string;
  aspect?: string;
  rounded?: 'none' | 'md' | 'lg' | 'xl' | '2xl';
  containerClassName?: string;
}

const roundedMap = {
  none: 'rounded-none',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
};

export function ResponsiveVideo({
  src,
  poster,
  aspect = 'aspect-video',
  rounded = 'lg',
  className,
  containerClassName,
  autoPlay,
  muted,
  loop,
  playsInline = true,
  controls = true,
  ...rest
}: ResponsiveVideoProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-ink-100',
        aspect,
        roundedMap[rounded],
        containerClassName
      )}
    >
      {!loaded && (
        <span className="absolute inset-0 skeleton-shimmer" aria-hidden />
      )}
      <video
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted ?? autoPlay}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        onLoadedData={() => setLoaded(true)}
        className={cn(
          'absolute inset-0 h-full w-full object-cover',
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300',
          className
        )}
        {...rest}
      />
    </div>
  );
}
