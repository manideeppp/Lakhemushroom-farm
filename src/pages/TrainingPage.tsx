import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveGrid } from '../components/layout/Layout';
import { TrainingCard } from '../components/cards/Cards';
import { EmptyState, LoadingState } from '../components/feedback/States';
import { listTraining } from '../lib/data';
import type { TrainingCourse, TrainingFormat } from '../types/training';
import { cn } from '../utils/cn';

const FORMATS: { key: 'all' | TrainingFormat; label: string }[] = [
  { key: 'all', label: 'All formats' },
  { key: 'online', label: 'Online' },
  { key: 'offline', label: 'Offline' },
];

// Public site only shows Online & Offline programs. Any legacy "hybrid"
// entries in data are shown under Offline so the catalogue stays consistent.
const formatLabel: Record<TrainingFormat, 'Online' | 'Offline'> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Offline',
};

export function TrainingPage() {
  const [courses, setCourses] = useState<TrainingCourse[] | null>(null);
  const [format, setFormat] = useState<(typeof FORMATS)[number]['key']>('all');
  const navigate = useNavigate();

  useEffect(() => {
    void listTraining()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  const filtered = useMemo(() => {
    if (!courses) return null;
    if (format === 'all') return courses;
    // Treat legacy "hybrid" courses as offline so the public catalogue
    // only exposes Online / Offline options.
    return courses.filter((c) => {
      const publicFormat: TrainingFormat = c.format === 'hybrid' ? 'offline' : c.format;
      return publicFormat === format;
    });
  }, [courses, format]);

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <SectionHeader
            eyebrow="Training"
            title="Learn mushroom farming from a real farm"
            description="Online and offline programs — pick the format that fits your life."
          />

          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFormat(f.key)}
                className={cn(
                  'rounded-pill border px-3 h-9 text-small font-medium transition',
                  format === f.key
                    ? 'bg-brand text-cream-50 border-brand'
                    : 'bg-surface-raised text-ink-700 border-ink-200 hover:border-forest-300'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Section>

        <Section size="sm">
          {!filtered ? (
            <LoadingState message="Loading training programs…" />
          ) : filtered.length === 0 ? (
            <EmptyState title="No matching programs" />
          ) : (
            <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
              {filtered.map((c) => (
                <TrainingCard
                  key={c.id}
                  title={c.title}
                  format={formatLabel[c.format]}
                  duration={c.duration}
                  price={c.price}
                  image={c.image}
                  features={c.features}
                  onClick={() => navigate(`/training/${c.slug}`)}
                />
              ))}
            </ResponsiveGrid>
          )}
        </Section>
      </PageContainer>
    </AppShell>
  );
}
