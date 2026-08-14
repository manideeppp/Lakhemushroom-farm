import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Testimonial } from '../../types/profile';
import { cn } from '../../utils/cn';

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;

  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  if (count === 0) return null;

  const visible =
    count >= 2
      ? [items[index], items[(index + 1) % count]]
      : [items[index]];

  return (
    <div className="relative">
      <div
        className={cn(
          'grid gap-4',
          visible.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'
        )}
      >
        {visible.map((t) => (
          <Card key={t.id} padding="lg" className="flex flex-col gap-3 h-full">
            <div className="flex items-center gap-0.5 text-warning">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-small text-ink-700 leading-relaxed">
              “{t.quote}”
            </p>
            <div className="mt-auto pt-2">
              <p className="text-body font-serif text-ink-900">{t.name}</p>
              {(t.role || t.location) && (
                <p className="text-caption text-ink-500">
                  {[t.role, t.location].filter(Boolean).join(' · ')}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          <span className="text-caption text-ink-500 tabular-nums">
            {index + 1} / {count}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Next testimonial"
            onClick={() => go(1)}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
