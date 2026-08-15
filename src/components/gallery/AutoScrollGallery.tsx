import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface AutoScrollGalleryProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
}

/** Horizontal auto-scrolling strip — duplicates children for seamless loop. */
export function AutoScrollGallery({
  children,
  className,
  speed = 0.45,
  pauseOnHover = true,
}: AutoScrollGalleryProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const step = () => {
      if (!pausedRef.current) {
        offsetRef.current += speed;
        const half = track.scrollWidth / 2;
        if (half > 0 && offsetRef.current >= half) {
          offsetRef.current = 0;
        }
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed, children]);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={() => {
        if (pauseOnHover) pausedRef.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) pausedRef.current = false;
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={() => {
        pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className="flex gap-3 sm:gap-4 will-change-transform"
        style={{ width: 'max-content' }}
      >
        <div className="flex gap-3 sm:gap-4 shrink-0">{children}</div>
        <div className="flex gap-3 sm:gap-4 shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
