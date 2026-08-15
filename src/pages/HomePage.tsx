import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ExternalLink,
  Globe2,
  Leaf,
  MapPin,
  Package,
  Play,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import {
  ResponsiveGrid,
} from '../components/layout/Layout';
import { AutoScrollGallery } from '../components/gallery/AutoScrollGallery';
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
import { ResponsiveVideo } from '../components/media/ResponsiveVideo';
import type { BadgeVariant } from '../components/ui/Badge';
import { TestimonialCarousel } from '../components/feedback/TestimonialCarousel';
import { HomeQueryForm } from '../components/forms/HomeQueryForm';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import {
  listGallery,
  listProducts,
  listTestimonials,
  listTraining,
} from '../lib/data';
import { mergeSampleProducts, mergeSampleTraining } from '../lib/mediaResolve';
import { SAMPLE_PRODUCTS } from '../data/products';
import { SAMPLE_TRAINING } from '../data/training';
import {
  SAMPLE_TESTIMONIALS,
} from '../data/gallery';
import {
  HOME_FOUNDER_IMAGE,
  HOME_STORY_IMAGE,
  HOME_FARM_SHOWCASE,
} from '../data/home';
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

  const displayProducts =
    products.length > 0 ? mergeSampleProducts(products) : SAMPLE_PRODUCTS;
  const displayTraining =
    training.length > 0 ? mergeSampleTraining(training) : SAMPLE_TRAINING;
  const homeTraining = (() => {
    const online = displayTraining.find((t) => t.format === 'online');
    const offline = displayTraining.find(
      (t) => t.format === 'offline' || t.format === 'hybrid'
    );
    return [online, offline].filter(Boolean) as TrainingCourse[];
  })();
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : SAMPLE_TESTIMONIALS;
  const showcaseGallery =
    gallery.length > 0
      ? gallery
      : HOME_FARM_SHOWCASE.map((item, i) => ({
          id: item.id,
          type: item.type,
          category: 'farm' as const,
          media_url: item.media_url,
          thumbnail_url: item.thumbnail_url,
          caption: item.caption,
          order: i + 1,
        }));

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
                    src={HOME_STORY_IMAGE}
                    alt="Lakhe mushroom farm landscape"
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
                    src={HOME_FOUNDER_IMAGE}
                    alt="Lakhe Mushroom Farm founder"
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
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Full gallery
                </Button>
              </Link>
            }
          />
          <AutoScrollGallery className="py-1">
            {showcaseGallery.slice(0, 12).map((g) => (
              <div key={g.id} className="w-56 sm:w-72 shrink-0">
                <Card padding="none" className="overflow-hidden">
                  <div className="relative">
                    {g.type === 'video' ? (
                      <ResponsiveVideo
                        src={g.media_url}
                        poster={g.thumbnail_url}
                        aspect="aspect-[3/4]"
                        rounded="none"
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls={false}
                      />
                    ) : (
                      <ResponsiveImage
                        src={g.media_url}
                        alt={g.caption ?? 'Farm photo'}
                        aspect="aspect-[3/4]"
                        rounded="none"
                      />
                    )}
                    {g.type === 'video' && (
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-pill bg-forest-900/75 px-2 py-1 text-caption text-cream-50">
                        <Play className="h-3 w-3" /> Video
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
          </AutoScrollGallery>
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
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View all
                </Button>
              </Link>
            }
          />
          <ResponsiveGrid cols={{ base: 2, md: 3, lg: 4 }} gap="md">
            {displayProducts.slice(0, 4).map((p) => (
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
                  variant="primary"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View all
                </Button>
              </Link>
            }
          />
          <ResponsiveGrid cols={{ base: 1, md: 2 }} gap="md">
            {homeTraining.map((t) => (
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
          <TestimonialCarousel items={displayTestimonials} />
        </Section>

        {/* QUERY + MAP */}
        <Section size="md" className="!pb-5 sm:!pb-6">
          <ResponsiveGrid cols={{ base: 1, lg: 2 }} gap="lg">
            <Card padding="lg" elevated className="space-y-4">
              <div>
                <span className="text-label uppercase tracking-widest text-forest-600 font-medium">
                  Ask us anything
                </span>
                <h2 className="font-serif text-h2 text-ink-900 mt-1">
                  Send a quick query
                </h2>
                <p className="text-small text-ink-600 mt-1">
                  Products, training, orders — we usually reply within a day.
                </p>
              </div>
              <HomeQueryForm />
            </Card>

            <Card padding="none" className="overflow-hidden flex flex-col">
              <div className="p-5 sm:p-6 border-b border-ink-100">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-50 text-forest-800">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-serif text-h2 text-ink-900">
                      Visit the farm
                    </h2>
                    <p className="text-small text-ink-600 mt-1">
                      {config.business.address}
                    </p>
                    <a
                      href={config.business.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-small font-medium text-forest-800 hover:underline"
                    >
                      Open in Google Maps
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative min-h-[280px] flex-1 bg-ink-100">
                <iframe
                  title="Lakhe Mushroom Farm on Google Maps"
                  src={config.business.mapsEmbedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Card>
          </ResponsiveGrid>
        </Section>

        {/* INTERNATIONAL + CONTACT */}
        <Section size="sm" className="!pt-4 sm:!pt-5 !pb-0">
          <div className="space-y-4">
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

            <div
              className="rounded-2xl border border-forest-800 bg-forest-900 p-5 sm:p-6 shadow-card"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <h3 className="font-serif text-h2 text-cream-50">
                    Have a question? Let&apos;s talk.
                  </h3>
                  <p className="mt-1 text-small text-cream-100/90 max-w-md leading-relaxed">
                    Product enquiries, training queries and order help — we
                    usually reply within a day.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a
                    href={`https://wa.me/${config.business.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button
                      variant="secondary"
                      className="!bg-cream-50 !text-forest-900 !border-cream-100 hover:!bg-cream-100"
                      leftIcon={<WhatsAppIcon className="h-4 w-4" />}
                    >
                      Chat on WhatsApp
                    </Button>
                  </a>
                  <Link to="/contact">
                    <Button
                      variant="outline"
                      className="!border-cream-200/60 !text-cream-50 hover:!bg-white/10 hover:!text-cream-50"
                    >
                      Send a query
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
