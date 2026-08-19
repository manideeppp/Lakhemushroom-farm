import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveGrid } from '../components/layout/Layout';
import { TrainingCard } from '../components/cards/Cards';
import { EmptyState } from '../components/feedback/States';
import { TrainingGridSkeleton } from '../components/feedback/PageSkeletons';
import { listTraining } from '../lib/data';
import type { TrainingCourse, TrainingFormat } from '../types/training';

const formatLabel: Record<TrainingFormat, 'Online' | 'Offline'> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Offline',
};

const PROGRAMME_ORDER = [
  'online-training',
  'offline-training',
  'complete-farm-setup',
];

export function TrainingPage() {
  const [courses, setCourses] = useState<TrainingCourse[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void listTraining()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  const sorted =
    courses
      ? [...courses].sort(
          (a, b) =>
            PROGRAMME_ORDER.indexOf(a.slug) - PROGRAMME_ORDER.indexOf(b.slug)
        )
      : null;

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <SectionHeader
            eyebrow="Programmes"
            title="Online training, offline training & farm setup"
            description="Pay the programme fee on this website. Tatya Lakhe will contact you directly with dates, schedule and full details — there is no online course portal here."
          />
        </Section>

        <Section size="sm">
          {!sorted ? (
            <TrainingGridSkeleton count={3} />
          ) : sorted.length === 0 ? (
            <EmptyState title="No programmes listed" />
          ) : (
            <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
              {sorted.map((c) => (
                <TrainingCard
                  key={c.id}
                  title={c.title}
                  format={formatLabel[c.format]}
                  duration={c.duration}
                  price={c.price}
                  image={c.image}
                  subtitle={c.short_description}
                  onClick={() => navigate(`/training/${c.slug}`)}
                  className="h-full"
                />
              ))}
            </ResponsiveGrid>
          )}
        </Section>
      </PageContainer>
    </AppShell>
  );
}
