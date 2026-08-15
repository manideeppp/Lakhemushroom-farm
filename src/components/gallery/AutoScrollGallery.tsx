import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface AutoScrollGalleryProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

/** Auto-scrolls horizontally; swipe/drag to scroll manually too. */
export function AutoScrollGallery({
  children,
  className,
  speed = 0.6,
}: AutoScrollGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const userScrollRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      if (!pausedRef.current && !userScrollRef.current) {
        el.scrollLeft += speed;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half - 1) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onScroll = () => {
      userScrollRef.current = true;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        userScrollRef.current = false;
      }, 2500);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [speed, children]);

  return (
    <div
      ref={scrollerRef}
      className={cn(
        'flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory',
        'touch-pan-x cursor-grab active:cursor-grabbing',
        className
      )}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onTouchStart={() => {
        pausedRef.current = true;
      }}
      onTouchEnd={() => {
        pausedRef.current = false;
      }}
    >
      <div className="flex gap-3 sm:gap-4 shrink-0">{children}</div>
      <div className="flex gap-3 sm:gap-4 shrink-0" aria-hidden>
        {children}
      </div>
    </div>
  );
}
