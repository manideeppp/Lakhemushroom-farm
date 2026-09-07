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

export function TrainingPage() {
  const [courses, setCourses] = useState<TrainingCourse[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void listTraining()
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <SectionHeader
            eyebrow="Programmes"
            title="Online & offline mushroom training"
            description="Pay the programme fee on this website. Online includes recorded videos; offline is a 2-day hands-on programme at our farm. Tatya Lakhe will contact you with full details after payment."
          />
        </Section>

        <Section size="sm">
          {!courses ? (
            <TrainingGridSkeleton count={2} />
          ) : courses.length === 0 ? (
            <EmptyState title="No programmes listed" />
          ) : (
            <ResponsiveGrid cols={{ base: 1, md: 2 }} gap="md" className="max-w-4xl mx-auto">
              {courses.map((c) => (
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
