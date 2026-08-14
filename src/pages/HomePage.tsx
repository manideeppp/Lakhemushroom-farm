import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Globe2,
  Leaf,
  MessageCircle,
  Package,
  Play,
  Sparkles,
  Sprout,
  Star,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import {
  HorizontalScroll,
  ResponsiveGrid,
} from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import {
  FeatureCard,
  ProductCard,
  StatCard,
  TrainingCard,
} from '../components/cards/Cards';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import type { BadgeVariant } from '../components/ui/Badge';
import {
  listGallery,
  listProducts,
  listTestimonials,
  listTraining,
} from '../lib/data';
import type { Product } from '../types/product';
import type { TrainingCourse, TrainingFormat } from '../types/training';
import type { GalleryItem, Testimonial } from '../types/profile';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/feedback/ToastProvider';
import { config } from '../lib/config';

const formatLabel: Record<TrainingFormat, 'Online' | 'Offline'> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Offline',
};

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [training, setTraining] = useState<TrainingCourse[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      const [p, t, ts, g] = await Promise.all([
        listProducts(),
        listTraining(),
        listTestimonials(),
        listGallery(),
      ]);
      setProducts(p);
      setTraining(t);
      setTestimonials(ts);
      setGallery(g);
    })();
  }, []);

  return (
    <AppShell>
      {/* HERO */}
      <PageContainer as="section" className="pt-4 sm:pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-forest-900 text-cream-50 shadow-card">
          <div className="absolute inset-0">
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=70"
              alt=""
              aspect="aspect-auto h-full"
              rounded="none"
              containerClassName="!h-full"
              className="opacity-50"
            />
          </div>
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-forest-900/85 via-forest-900/60 to-forest-900/30"
          />
          <div className="relative flex flex-col gap-4 max-w-xl px-6 py-14 sm:px-10 sm:py-20 lg:px-14 lg:py-24">
            <Badge variant="natural" className="w-fit">
              <Sparkles className="h-3 w-3" /> Premium Mushroom Brand
            </Badge>
            <h1 className="font-serif text-[2.25rem] leading-[1.05] sm:text-hero lg:text-[3.5rem] tracking-tight">
              Grow Mushrooms.
              <br />
              <span className="text-cream-200">Grow Your Business.</span>
            </h1>
            <p className="text-body-lg text-cream-100/90 max-w-lg">
              Quality mushroom products, complete farming training and end-to-end
              farm setup — from a farm that treats mushrooms as a craft.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-cream-50 !text-forest-900 hover:bg-cream-100"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Explore Products
                </Button>
              </Link>
              <Link to="/training">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cream-200 !text-cream-50 hover:bg-white/10"
                >
                  Start Training
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* STORY QUICK LINKS — short clickable boxes */}
      <PageContainer>
        <Section size="sm">
          <ResponsiveGrid cols={{ base: 1, sm: 2 }} gap="md">
            <Link
              to="/about"
              aria-label="Read our story"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 rounded-2xl"
            >
              <Card
                padding="none"
                elevated
                className="h-full overflow-hidden transition-transform group-hover:-translate-y-0.5"
              >
                <div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr]">
                  <ResponsiveImage
                    src="https://images.unsplash.com/photo-1611574474461-46f3f36fbb90?auto=format&fit=crop&w=800&q=70"
                    alt=""
                    aspect="aspect-square"
                    rounded="none"
                  />
                  <div className="p-4 sm:p-5 flex flex-col justify-center gap-1">
                    <span className="text-caption uppercase tracking-widest text-forest-600 font-medium">
                      Our Story
                    </span>
                    <h3 className="font-serif text-h3 text-ink-900 leading-tight">
                      A farm built on craft & patience
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-small font-medium text-forest-800">
                      Read the story
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
            <Link
              to="/founder"
              aria-label="Meet the founder"
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 rounded-2xl"
            >
              <Card
                padding="none"
                elevated
                className="h-full overflow-hidden transition-transform group-hover:-translate-y-0.5"
              >
                <div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr]">
                  <ResponsiveImage
                    src="https://images.unsplash.com/photo-1524178232363-1ba1f8b83d0b?auto=format&fit=crop&w=800&q=70"
                    alt=""
                    aspect="aspect-square"
                    rounded="none"
                  />
                  <div className="p-4 sm:p-5 flex flex-col justify-center gap-1">
                    <span className="text-caption uppercase tracking-widest text-forest-600 font-medium">
                      Founder's Story
                    </span>
                    <h3 className="font-serif text-h3 text-ink-900 leading-tight">
                      The person behind Lakhe
                    </h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-small font-medium text-forest-800">
                      Meet the founder
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </ResponsiveGrid>
        </Section>

        {/* GALLERY — photos & videos, horizontal scroll */}
        <Section size="sm">
          <SectionHeader
            eyebrow="Photos & Videos"
            title="Inside the farm"
            action={
              <Link to="/gallery">
                <Button
                  variant="ghost"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Full gallery
                </Button>
              </Link>
            }
          />
          <HorizontalScroll padded gap="md">
            {gallery.slice(0, 10).map((g) => (
              <div key={g.id} className="snap-start shrink-0 w-56 sm:w-64">
                <Card padding="none" className="overflow-hidden">
                  <div className="relative">
                    <ResponsiveImage
                      src={g.thumbnail_url ?? g.media_url}
                      alt={g.caption ?? 'Farm photo'}
                      aspect="aspect-[3/4]"
                      rounded="none"
                    />
                    {g.type === 'video' && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-900/70 text-cream-50">
                          <Play className="h-4 w-4" />
                        </span>
                      </span>
                    )}
                  </div>
                  {g.caption && (
                    <p className="px-3 py-2 text-caption text-ink-600">
                      {g.caption}
                    </p>
                  )}
                </Card>
              </div>
            ))}
          </HorizontalScroll>
        </Section>
      </PageContainer>

      {/* VALUE PROPS */}
      <PageContainer>
        <Section size="md">
          <SectionHeader
            eyebrow="Why Lakhe"
            title="A farm-to-shelf brand you can trust"
            description="Every batch traces back to real soil, real people and a real farm — no white-label sourcing."
          />
          <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
            <FeatureCard
              icon={<Leaf className="h-5 w-5" />}
              title="Naturally grown"
              description="Grown with care in controlled, chemical-free conditions."
            />
            <FeatureCard
              icon={<Sprout className="h-5 w-5" />}
              title="Expert training"
              description="Online and offline programs built from years of farm practice."
            />
            <FeatureCard
              icon={<Package className="h-5 w-5" />}
              title="Reliable delivery"
              description="Careful packing, tracked orders, honest updates."
            />
            <FeatureCard
              icon={<Globe2 className="h-5 w-5" />}
              title="Trusted globally"
              description="Serving customers and cohorts across India and abroad."
            />
          </ResponsiveGrid>
        </Section>

        {/* PRODUCTS */}
        <Section size="md">
          <SectionHeader
            eyebrow="Our Products"
            title="Freshly grown, gently packaged"
            action={
              <Link to="/products">
                <Button
                  variant="ghost"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View all
                </Button>
              </Link>
            }
          />
          <ResponsiveGrid cols={{ base: 2, md: 3, lg: 4 }} gap="md">
            {products.slice(0, 4).map((p) => (
              <ProductCard
                key={p.id}
                name={p.name}
                category={p.category}
                price={p.price}
                image={p.images[0]}
                badges={p.badges.slice(0, 2) as BadgeVariant[]}
                onAdd={() => {
                  addItem(
                    {
                      id: p.id,
                      type: 'product',
                      name: p.name,
                      price: p.price,
                      image: p.images[0],
                      slug: p.slug,
                      unit: p.unit,
                    },
                    1
                  );
                  toast({
                    tone: 'success',
                    title: 'Added to cart',
                    message: p.name,
                  });
                }}
                onClick={() => navigate(`/products/${p.slug}`)}
              />
            ))}
          </ResponsiveGrid>
        </Section>

        {/* TRAINING */}
        <Section size="md">
          <SectionHeader
            eyebrow="Training"
            title="Learn from a working farm"
            description="Online and offline programs designed to take you from curious beginner to confident cultivator."
            action={
              <Link to="/training">
                <Button
                  variant="ghost"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View all
                </Button>
              </Link>
            }
          />
          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            {training.slice(0, 3).map((t) => (
              <TrainingCard
                key={t.id}
                title={t.title}
                format={formatLabel[t.format]}
                duration={t.duration}
                price={t.price}
                image={t.image}
                features={t.features}
                onClick={() => navigate(`/training/${t.slug}`)}
              />
            ))}
          </ResponsiveGrid>
        </Section>

        {/* FARM SETUP */}
        <Section size="md">
          <Card padding="none" className="overflow-hidden">
            <div className="grid gap-0 md:grid-cols-2">
              <ResponsiveImage
                src="https://images.unsplash.com/photo-1615398265937-71bc7a9c8dfe?auto=format&fit=crop&w=1600&q=70"
                alt="Consultancy meeting on a farm"
                aspect="aspect-[4/3] md:h-full md:aspect-auto"
                rounded="none"
              />
              <div className="p-6 sm:p-10 flex flex-col justify-center gap-3">
                <span className="text-label uppercase tracking-widest text-forest-600 font-medium">
                  Farm Setup & Consultancy
                </span>
                <h2 className="font-serif text-h1 sm:text-display text-ink-900 leading-tight">
                  From an idea to a working farm
                </h2>
                <p className="text-body text-ink-700 leading-relaxed">
                  Infrastructure planning, cultivation guidance, market linkages
                  and help with government subsidies — end-to-end support so you
                  can start with confidence.
                </p>
                <div className="pt-2">
                  <Link to="/consultancy">
                    <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Explore consultancy
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* STATS */}
        <Section size="md">
          <ResponsiveGrid cols={{ base: 2, md: 4 }} gap="md">
            <StatCard value="500+" label="Farmers trained" />
            <StatCard value="12+" label="Product varieties" />
            <StatCard value="8" label="Years of practice" />
            <StatCard
              value="4.9"
              label="Avg. customer rating"
              hint="Across products & training"
            />
          </ResponsiveGrid>
        </Section>

        {/* TESTIMONIALS */}
        <Section size="md">
          <SectionHeader
            eyebrow="What people say"
            title="Trusted by home cooks, farmers and cohorts abroad"
          />
          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 4 }} gap="md">
            {testimonials.slice(0, 4).map((t) => (
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
          </ResponsiveGrid>
        </Section>

        {/* INTERNATIONAL */}
        <Section size="md">
          <Card padding="lg" className="bg-forest-50 border-forest-200 text-forest-900">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-forest-900 text-cream-50">
                  <Globe2 className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-serif text-h2 text-forest-900">
                    Serving international clients
                  </h3>
                  <p className="text-small text-forest-800/80 max-w-md">
                    From France to the Middle East, our products and training
                    reach mushroom lovers and cultivators around the world.
                  </p>
                </div>
              </div>
              <Link to="/gallery" className="shrink-0">
                <Button
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  See client stories
                </Button>
              </Link>
            </div>
          </Card>
        </Section>

        {/* CONTACT CTA */}
        <Section size="md">
          <Card
            padding="lg"
            className="bg-forest-900 border-forest-800 text-cream-50"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-serif text-h2 text-cream-50">
                  Have a question? Let’s talk.
                </h3>
                <p className="text-small text-cream-200/85 max-w-md">
                  Product enquiries, training queries, farm-setup consultations —
                  we usually reply within a day.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${config.business.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    className="bg-cream-50 !text-forest-900 hover:bg-cream-100"
                    leftIcon={<MessageCircle className="h-4 w-4" />}
                  >
                    Chat on WhatsApp
                  </Button>
                </a>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="border-cream-200 !text-cream-50 hover:bg-white/10"
                  >
                    Send a query
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
