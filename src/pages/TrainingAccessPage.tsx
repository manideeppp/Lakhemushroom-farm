import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState, EmptyState } from '../components/feedback/States';
import { getTrainingBySlug, listOrdersForUser } from '../lib/data';
import type { TrainingCourse } from '../types/training';
import { useAuth } from '../context/AuthContext';
import { config } from '../lib/config';

export function TrainingAccessPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !user) return;
    void (async () => {
      setLoading(true);
      const c = await getTrainingBySlug(slug);
      setCourse(c);
      if (!c) {
        setConfirmed(false);
        setLoading(false);
        return;
      }
      const orders = await listOrdersForUser(user.id);
      const granted = orders.some(
        (o) =>
          o.status === 'approved' &&
          o.items.some(
            (it) =>
              it.item_type === 'training' &&
              it.course_id === c.id &&
              it.status === 'access_granted'
          )
      );
      setConfirmed(granted);
      setLoading(false);
    })();
  }, [slug, user]);

  if (loading)
    return (
      <AppShell>
        <LoadingState message="Loading programme…" />
      </AppShell>
    );

  if (!course)
    return (
      <AppShell>
        <PageContainer className="py-14 text-center">
          <p className="text-body text-ink-700">Programme not found.</p>
        </PageContainer>
      </AppShell>
    );

  if (!confirmed)
    return (
      <AppShell>
        <PageContainer>
          <Section size="sm">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <EmptyState
              title="Awaiting order confirmation"
              message="Once your payment is verified, Tatya Lakhe will contact you directly with programme details. There is no online course to open on this website."
              action={
                <Link to={`/training/${course.slug}`}>
                  <Button>View programme</Button>
                </Link>
              }
            />
          </Section>
        </PageContainer>
      </AppShell>
    );

  return (
    <AppShell>
      <PageContainer>
        <Section size="sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <Card padding="lg" className="bg-forest-50 border-forest-200">
            <h1 className="font-serif text-h2 text-forest-900">{course.title}</h1>
            <p className="mt-2 text-body text-forest-900/90 leading-relaxed">
              Your payment for this programme is confirmed. Tatya Lakhe will contact
              you directly with dates, schedule, materials and everything you need.
              Programme details are not delivered through this website — expect a call
              or WhatsApp from the owner.
            </p>
            <a
              href={`tel:${config.business.phone.replace(/\s/g, '')}`}
              className="mt-4 inline-flex items-center gap-2 text-body font-medium text-forest-800 hover:text-forest-900"
            >
              <Phone className="h-5 w-5" aria-hidden />
              {config.business.phone}
            </a>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link to="/account">
                <Button variant="outline">View orders</Button>
              </Link>
              <Link to="/training">
                <Button variant="ghost">All programmes</Button>
              </Link>
            </div>
          </Card>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
