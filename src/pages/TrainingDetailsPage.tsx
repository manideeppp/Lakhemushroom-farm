import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Phone, ShoppingCart } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { LoadingState } from '../components/feedback/States';
import { formatINR } from '../utils/format';
import { getTrainingBySlug } from '../lib/data';
import type { TrainingCourse, TrainingFormat } from '../types/training';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/feedback/ToastProvider';
import { useCartAddedFromNavigation } from '../hooks/useCartAddedFromNavigation';
import { config } from '../lib/config';

const formatLabel: Record<TrainingFormat, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Offline',
};

export function TrainingDetailsPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, announceRecentAdd } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useCartAddedFromNavigation(announceRecentAdd);

  useEffect(() => {
    if (!slug) return;
    void (async () => {
      setLoading(true);
      const c = await getTrainingBySlug(slug);
      setCourse(c);
      setLoading(false);
    })();
  }, [slug]);

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
          <Link to="/training" className="mt-3 inline-block">
            <Button variant="outline">Back to programmes</Button>
          </Link>
        </PageContainer>
      </AppShell>
    );

  const publicFormat: TrainingFormat =
    course.format === 'hybrid' ? 'offline' : course.format;

  function addToCart() {
    if (!course) return;
    addItem(
      {
        id: course.id,
        type: 'training',
        name: course.title,
        price: course.price,
        image: course.image,
        slug: course.slug,
      },
      1
    );
    toast({
      tone: 'success',
      title: 'Added to cart',
      message: course.title,
    });
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

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
            <ResponsiveImage
              src={course.image}
              alt={course.title}
              aspect="aspect-square"
              rounded="lg"
              fit="contain"
              containerClassName="bg-sage-50/50"
            />

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={publicFormat === 'offline' ? 'offline' : 'online'}
                >
                  {formatLabel[course.format]}
                </Badge>
                {course.duration && (
                  <span className="text-small text-ink-600">{course.duration}</span>
                )}
              </div>

              <h1 className="font-serif text-display text-ink-900 leading-tight">
                {course.title}
              </h1>

              <p className="text-body text-ink-700 leading-relaxed">
                {course.description}
              </p>

              {course.features.length > 0 && (
                <ul className="mt-1 grid gap-2 sm:grid-cols-2">
                  {course.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-small text-ink-700"
                    >
                      <Check className="h-4 w-4 mt-0.5 text-success shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}

              <Card padding="md" className="bg-forest-50 border-forest-200/80">
                <p className="text-label uppercase tracking-widest text-forest-700 font-medium">
                  How it works
                </p>
                <ol className="mt-2 space-y-2 text-small text-forest-900/90">
                  <li>1. Add this programme to cart and complete payment on the website.</li>
                  <li>
                    2. After your order is verified, Tatya Lakhe will call or WhatsApp you
                    directly.
                  </li>
                  <li>
                    3. All programme details — dates, schedule, materials and next steps —
                    are shared personally by the owner. There is no online course to
                    complete on this website.
                  </li>
                </ol>
                <a
                  href={`tel:${config.business.phone.replace(/\s/g, '')}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-small font-medium text-forest-800 hover:text-forest-900"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {config.business.phone}
                </a>
              </Card>

              <div className="mt-2 flex items-end justify-between border-t border-ink-100 pt-4">
                <div>
                  <p className="text-caption text-ink-500">Programme fee</p>
                  <p className="text-h1 font-serif text-ink-900">
                    {formatINR(course.price)}
                  </p>
                  <p className="mt-0.5 text-caption text-ink-500">
                    Pay online · details from owner after confirmation
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="lg"
                  fullWidth
                  leftIcon={<ShoppingCart className="h-4 w-4" />}
                  onClick={addToCart}
                >
                  Add to cart & pay
                </Button>
                <Link to="/cart" className="sm:flex-1">
                  <Button size="lg" fullWidth variant="outline">
                    View cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
