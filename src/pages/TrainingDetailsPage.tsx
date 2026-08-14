import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Input } from '../components/forms/Input';
import { DateInput } from '../components/forms/DateInput';
import { Textarea } from '../components/forms/Textarea';
import { Modal } from '../components/ui/Modal';
import { LoadingState } from '../components/feedback/States';
import { formatINR } from '../utils/format';
import { getTrainingBySlug, createBooking } from '../lib/data';
import type { TrainingCourse } from '../types/training';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/feedback/ToastProvider';

export function TrainingDetailsPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    email: '',
    preferred_date: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const { addItem } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoading(true);
      const c = await getTrainingBySlug(slug);
      setCourse(c);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    if (user)
      setBooking((b) => ({
        ...b,
        name: b.name || profile?.full_name || '',
        email: b.email || user.email,
        phone: b.phone || profile?.phone || '',
      }));
  }, [user, profile]);

  if (loading)
    return (
      <AppShell>
        <LoadingState message="Loading training…" />
      </AppShell>
    );
  if (!course)
    return (
      <AppShell>
        <PageContainer className="py-14 text-center">
          <p className="text-body text-ink-700">Training not found.</p>
          <Link to="/training" className="mt-3 inline-block">
            <Button variant="outline">Back to training</Button>
          </Link>
        </PageContainer>
      </AppShell>
    );

  const isOnline = course.format === 'online' || course.format === 'hybrid';
  const isOffline = course.format === 'offline' || course.format === 'hybrid';

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!course) return;
    if (!booking.name || !booking.phone || !booking.preferred_date) {
      toast({ tone: 'warning', message: 'Please fill name, phone and date.' });
      return;
    }
    try {
      setSubmitting(true);
      const b = await createBooking({
        user_id: user?.id ?? null,
        course_id: course.id,
        course_title: course.title,
        ...booking,
      });
      toast({
        tone: 'success',
        title: 'Booking submitted',
        message: `Reference: ${b.booking_ref}. We'll confirm shortly.`,
      });
      setBookingOpen(false);
      setBooking({
        name: '',
        phone: '',
        email: '',
        preferred_date: '',
        notes: '',
      });
      if (user) navigate('/account');
    } catch (err) {
      toast({
        tone: 'danger',
        title: 'Booking failed',
        message: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

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

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
            <div>
              <ResponsiveImage
                src={course.image}
                alt={course.title}
                aspect="aspect-[16/9]"
                rounded="xl"
                fit="contain"
                containerClassName="bg-cream-50"
              />

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge variant={course.format === 'offline' ? 'offline' : 'online'}>
                  {course.format === 'online'
                    ? 'Online'
                    : course.format === 'offline'
                      ? 'Offline'
                      : 'Hybrid'}
                </Badge>
                <span className="inline-flex items-center gap-1 text-small text-ink-600">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
              </div>

              <h1 className="mt-3 font-serif text-display text-ink-900 leading-tight">
                {course.title}
              </h1>
              <p className="mt-2 text-body-lg text-ink-700 leading-relaxed">
                {course.description}
              </p>

              {course.outcomes && course.outcomes.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-serif text-h2 text-ink-900">
                    What you’ll be able to do
                  </h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {course.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-small text-ink-700">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.modules && course.modules.length > 0 && (
                <div className="mt-8">
                  <h2 className="font-serif text-h2 text-ink-900">Course modules</h2>
                  <ol className="mt-3 space-y-2">
                    {course.modules.map((m, i) => (
                      <li key={m.id}>
                        <Card padding="md" className="flex items-start gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-700 text-small font-semibold">
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-body font-semibold text-ink-900">
                              {m.title}
                            </p>
                            {m.description && (
                              <p className="text-small text-ink-600">
                                {m.description}
                              </p>
                            )}
                          </div>
                          {m.duration_minutes && (
                            <span className="text-caption text-ink-500 shrink-0">
                              {m.duration_minutes} min
                            </span>
                          )}
                        </Card>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="lg:sticky lg:top-24 space-y-4 lg:self-start">
              <Card padding="lg" className="space-y-3">
                <p className="text-caption text-ink-500">Program fee</p>
                <p className="text-display font-serif text-ink-900 leading-none">
                  {formatINR(course.price)}
                </p>

                <ul className="mt-2 space-y-2 text-small text-ink-700">
                  {course.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2 pt-3">
                  {isOnline && (
                    <Button
                      size="lg"
                      leftIcon={<PlayCircle className="h-4 w-4" />}
                      onClick={() => {
                        addItem({
                          id: course.id,
                          type: 'training',
                          name: course.title,
                          price: course.price,
                          image: course.image,
                          slug: course.slug,
                        });
                        toast({
                          tone: 'success',
                          title: 'Added to cart',
                          message: course.title,
                        });
                      }}
                    >
                      Enrol in online course
                    </Button>
                  )}
                  {isOffline && (
                    <Button
                      size="lg"
                      variant={isOnline ? 'outline' : 'primary'}
                      leftIcon={<Calendar className="h-4 w-4" />}
                      onClick={() => setBookingOpen(true)}
                    >
                      Book offline session
                    </Button>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2 rounded-md bg-forest-50 p-3 text-caption text-forest-800">
                  <Award className="h-4 w-4 shrink-0" />
                  Certificate on successful completion.
                </div>
              </Card>

              <Card padding="lg" className="bg-cream-100 border-cream-200">
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-forest-700 mt-1 shrink-0" />
                  <div>
                    <p className="text-body font-semibold text-ink-900">
                      Not sure which format?
                    </p>
                    <p className="text-small text-ink-700 mt-1">
                      Talk to us and we’ll recommend the right training for
                      your goal — home cultivator, small farmer or commercial unit.
                    </p>
                    <Link to="/contact" className="mt-2 inline-block">
                      <Button variant="outline" size="sm">
                        Ask us
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>

      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title="Book offline session"
        description={`Preferred date for “${course.title}”. Our team will confirm within a day.`}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={(e) =>
                submitBooking(
                  e as unknown as React.FormEvent
                )
              }
              loading={submitting}
            >
              Submit booking
            </Button>
          </div>
        }
      >
        <form onSubmit={submitBooking} className="space-y-3">
          <Input
            label="Your name"
            required
            value={booking.name}
            onChange={(e) => setBooking({ ...booking, name: e.target.value })}
          />
          <Input
            label="Phone"
            required
            inputMode="tel"
            value={booking.phone}
            onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
          />
          <Input
            label="Email (optional)"
            type="email"
            value={booking.email}
            onChange={(e) => setBooking({ ...booking, email: e.target.value })}
          />
          <DateInput
            label="Preferred date"
            required
            value={booking.preferred_date}
            onChange={(e) =>
              setBooking({ ...booking, preferred_date: e.target.value })
            }
          />
          <Textarea
            label="Notes (optional)"
            rows={3}
            placeholder="Anything we should know?"
            value={booking.notes}
            onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
          />
        </form>
      </Modal>
    </AppShell>
  );
}
