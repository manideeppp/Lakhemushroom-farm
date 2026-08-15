import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart } from 'lucide-react';
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

const formatLabel: Record<TrainingFormat, string> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Offline',
};

export function TrainingDetailsPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
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
      qty
    );
    toast({
      tone: 'success',
      title: 'Added to cart',
      message: `${course.title} × ${qty}`,
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

              <div className="mt-2 flex items-end justify-between border-t border-ink-100 pt-4">
                <div>
                  <p className="text-caption text-ink-500">Program fee</p>
                  <p className="text-h1 font-serif text-ink-900">
                    {formatINR(course.price)}
                  </p>
                </div>
                <div className="flex items-center rounded-md border border-ink-200">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-10 w-10 text-ink-700 hover:bg-forest-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4 mx-auto" />
                  </button>
                  <span className="w-10 text-center text-body font-medium">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-10 w-10 text-ink-700 hover:bg-forest-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4 mx-auto" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="lg"
                  fullWidth
                  leftIcon={<ShoppingCart className="h-4 w-4" />}
                  onClick={addToCart}
                >
                  Add to cart
                </Button>
                <Link to="/cart" className="sm:flex-1">
                  <Button size="lg" fullWidth variant="outline">
                    View cart
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {course.outcomes && course.outcomes.length > 0 && (
            <Card padding="lg" className="mt-8">
              <h2 className="font-serif text-h2 text-ink-900">
                What you&apos;ll learn
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex items-start gap-2 text-small text-ink-700"
                  >
                    <Check className="h-4 w-4 mt-0.5 text-success shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </Section>
      </PageContainer>
    </AppShell>
  );
}
