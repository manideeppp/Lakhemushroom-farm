import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Award, CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingState, EmptyState } from '../components/feedback/States';
import {
  getTrainingBySlug,
  listOrdersForUser,
  listProgress,
  markModuleComplete,
} from '../lib/data';
import type { TrainingCourse } from '../types/training';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/feedback/ToastProvider';

export function TrainingAccessPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || !user) return;
    void (async () => {
      setLoading(true);
      const c = await getTrainingBySlug(slug);
      setCourse(c);
      if (!c) {
        setHasAccess(false);
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
      setHasAccess(granted);
      if (granted) {
        const progress = await listProgress(user.id);
        setCompletedIds(
          new Set(
            progress
              .filter((p) => p.course_id === c.id)
              .map((p) => p.module_id)
          )
        );
        if (c.modules && c.modules[0]) setActiveModuleId(c.modules[0].id);
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const activeModule = useMemo(
    () => course?.modules?.find((m) => m.id === activeModuleId),
    [course, activeModuleId]
  );

  const progressPct = useMemo(() => {
    if (!course?.modules || course.modules.length === 0) return 0;
    return Math.round((completedIds.size / course.modules.length) * 100);
  }, [course, completedIds]);

  async function toggleComplete(moduleId: string) {
    if (!user || !course) return;
    if (completedIds.has(moduleId)) return;
    await markModuleComplete(user.id, course.id, moduleId);
    setCompletedIds((s) => new Set([...s, moduleId]));
    toast({ tone: 'success', message: 'Module marked complete' });
  }

  if (loading) return <AppShell><LoadingState message="Loading your training…" /></AppShell>;

  if (!course)
    return (
      <AppShell>
        <PageContainer className="py-14 text-center">
          <p className="text-body text-ink-700">Training not found.</p>
        </PageContainer>
      </AppShell>
    );

  if (!hasAccess)
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
              title="Access not yet available"
              message="Once your order is approved by our team, this training will unlock automatically."
              icon={<Lock className="h-6 w-6" />}
              action={
                <Link to={`/training/${course.slug}`}>
                  <Button>Enrol in this training</Button>
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

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <Card padding="none" className="overflow-hidden">
                <div className="aspect-video w-full bg-ink-900 flex items-center justify-center">
                  {activeModule ? (
                    <div className="text-cream-100 text-center">
                      <PlayCircle className="mx-auto h-10 w-10 mb-2" />
                      <p className="text-body">Video player for “{activeModule.title}”</p>
                      <p className="text-caption text-cream-200/70">
                        {activeModule.video_url || 'Video will be added by admin.'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-cream-100">Select a module</p>
                  )}
                </div>
                {activeModule && (
                  <div className="p-4 sm:p-6">
                    <h2 className="font-serif text-h2 text-ink-900">
                      {activeModule.title}
                    </h2>
                    {activeModule.description && (
                      <p className="mt-2 text-body text-ink-700">
                        {activeModule.description}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        onClick={() => toggleComplete(activeModule.id)}
                        disabled={completedIds.has(activeModule.id)}
                        leftIcon={<CheckCircle2 className="h-4 w-4" />}
                      >
                        {completedIds.has(activeModule.id)
                          ? 'Completed'
                          : 'Mark as complete'}
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {progressPct === 100 && (
                <Card padding="lg" className="bg-forest-50 border-forest-200">
                  <div className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-forest-800" />
                    <div>
                      <p className="font-serif text-h3 text-forest-900">
                        Congratulations — course complete!
                      </p>
                      <p className="text-small text-forest-800/85">
                        Your certificate is available in your account. We’ll
                        email it to you within a day.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-3">
              <Card padding="lg">
                <p className="text-caption text-ink-500">Your progress</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-serif text-display text-brand leading-none">
                    {progressPct}%
                  </span>
                  <span className="text-small text-ink-500">
                    · {completedIds.size}/{course.modules?.length ?? 0} modules
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className="h-full bg-brand transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </Card>

              <Card padding="md">
                <p className="text-label uppercase tracking-widest text-ink-500 font-medium">
                  Modules
                </p>
                <ul className="mt-2 space-y-1">
                  {course.modules?.map((m, i) => {
                    const done = completedIds.has(m.id);
                    const active = m.id === activeModuleId;
                    return (
                      <li key={m.id}>
                        <button
                          type="button"
                          onClick={() => setActiveModuleId(m.id)}
                          className={`w-full flex items-start gap-2 rounded-md px-2.5 py-2 text-left transition ${
                            active
                              ? 'bg-forest-50 text-forest-900'
                              : 'text-ink-800 hover:bg-forest-50/60'
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-caption font-semibold ${
                              done
                                ? 'bg-success text-cream-50'
                                : 'bg-ink-100 text-ink-600'
                            }`}
                          >
                            {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                          </span>
                          <span className="text-small font-medium leading-5">
                            {m.title}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
