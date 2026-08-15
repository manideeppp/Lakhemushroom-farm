import { useEffect, useMemo, useState } from 'react';
import { PlayCircle, X } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { ResponsiveVideo } from '../components/media/ResponsiveVideo';
import { EmptyState } from '../components/feedback/States';
import { GalleryGridSkeleton } from '../components/feedback/PageSkeletons';
import { listGallery } from '../lib/data';
import type { GalleryItem } from '../types/profile';
import { cn } from '../utils/cn';

const CATEGORIES: {
  key: 'all' | GalleryItem['category'];
  label: string;
}[] = [
  { key: 'all', label: 'All' },
  { key: 'farm', label: 'Farm' },
  { key: 'cultivation', label: 'Cultivation' },
  { key: 'training', label: 'Training' },
  { key: 'team', label: 'Team' },
  { key: 'clients', label: 'Clients' },
];

export function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[] | null>(null);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]['key']>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  useEffect(() => {
    void listGallery().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    if (!items) return null;
    return cat === 'all' ? items : items.filter((i) => i.category === cat);
  }, [items, cat]);

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <SectionHeader
            eyebrow="Gallery"
            title="Life at Lakhe, in pictures and video"
            description="A quiet, honest look at how mushrooms grow, how farmers learn, and how a small farm becomes a brand."
          />
          <div className="-mx-4 px-4 flex gap-2 overflow-x-auto no-scrollbar sm:mx-0 sm:px-0 sm:flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCat(c.key)}
                className={cn(
                  'shrink-0 rounded-pill border px-3 h-9 text-small font-medium transition',
                  cat === c.key
                    ? 'bg-brand text-cream-50 border-brand'
                    : 'bg-surface-raised text-ink-700 border-ink-200 hover:border-forest-300'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Section>

        <Section size="sm">
          {!filtered ? (
            <GalleryGridSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No media yet"
              message="Check back soon — we’re constantly adding new photos and clips."
            />
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 [column-fill:_balance]">
              {filtered.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setLightbox(it)}
                  className="mb-3 sm:mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg border border-ink-100 bg-ink-900 focus-visible:outline-none focus-visible:shadow-focus"
                >
                  <div className="relative">
                    <ResponsiveImage
                      src={it.thumbnail_url || it.media_url}
                      alt={it.caption ?? 'Gallery image'}
                      aspect={
                        i % 3 === 0
                          ? 'aspect-[4/5]'
                          : i % 3 === 1
                            ? 'aspect-square'
                            : 'aspect-[3/4]'
                      }
                      rounded="none"
                    />
                    {it.type === 'video' && (
                      <span className="absolute inset-0 flex items-center justify-center bg-ink-900/40">
                        <PlayCircle className="h-10 w-10 text-cream-50 drop-shadow" />
                      </span>
                    )}
                    {it.caption && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/80 to-transparent px-3 py-2 text-caption text-cream-50">
                        {it.caption}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Section>
      </PageContainer>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-900/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-cream-50 hover:bg-white/20"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full max-h-[85vh]"
          >
            {lightbox.type === 'video' ? (
              <ResponsiveVideo src={lightbox.media_url} controls />
            ) : (
              <img
                src={lightbox.media_url}
                alt={lightbox.caption ?? ''}
                className="max-h-[80vh] w-full rounded-lg object-contain"
              />
            )}
            {lightbox.caption && (
              <p className="mt-3 text-center text-cream-100 text-small">
                {lightbox.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
