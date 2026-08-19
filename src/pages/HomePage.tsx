import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Leaf,
  Play,
  Sprout,
  Users,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveGrid } from '../components/layout/Layout';
import { AutoScrollGallery } from '../components/gallery/AutoScrollGallery';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  FeatureCard,
  ProductCard,
  TrainingCard,
} from '../components/cards/Cards';
import { HeroOfferingsStrip } from '../components/home/HeroOfferingsStrip';
import {
  HorizontalScrollItem,
  HorizontalScrollRow,
} from '../components/home/HorizontalScrollRow';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { ResponsiveVideo } from '../components/media/ResponsiveVideo';
import type { BadgeVariant } from '../components/ui/Badge';
import { ProductGridSkeleton } from '../components/feedback/PageSkeletons';
import { HomeQueryForm } from '../components/forms/HomeQueryForm';
import { TestimonialCarousel } from '../components/feedback/TestimonialCarousel';
import { FOUNDER } from '../data/founder';
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
  HOME_FOUNDER_IMAGE,
  HOME_HERO_IMAGE,
  HOME_STORY_IMAGE,
  HOME_FARM_SHOWCASE,
} from '../data/home';
import type { Product } from '../types/product';
import type { TrainingCourse, TrainingFormat } from '../types/training';
import type { GalleryItem, Testimonial } from '../types/profile';
import { config } from '../lib/config';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

const formatLabel: Record<TrainingFormat, 'Online' | 'Offline'> = {
  online: 'Online',
  offline: 'Offline',
  hybrid: 'Offline',
};

export function HomePage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [training, setTraining] = useState<TrainingCourse[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      try {
        const [p, t, g, testim] = await Promise.all([
          listProducts(),
          listTraining(),
          listGallery(),
          listTestimonials(),
        ]);
        setProducts(p);
        setTraining(t);
        setGallery(g);
        setTestimonials(testim);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const displayProducts =
    products.length > 0 ? mergeSampleProducts(products) : SAMPLE_PRODUCTS;
  const displayTraining =
    training.length > 0 ? mergeSampleTraining(training) : SAMPLE_TRAINING;
  const homeTraining = (() => {
    const slugs = ['online-training', 'offline-training', 'complete-farm-setup'];
    return slugs
      .map((slug) => displayTraining.find((t) => t.slug === slug))
      .filter(Boolean) as TrainingCourse[];
  })();
  const showcaseGallery =
    gallery.length > 0
      ? gallery.sort((a, b) => a.order - b.order)
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
      <section
        className="relative overflow-hidden bg-forest-950 text-cream-50 min-h-[min(88vh,720px)] sm:min-h-[680px]"
      >
        <div className="absolute inset-0" aria-hidden>
          <img
            src={HOME_HERO_IMAGE}
            alt=""
            className="h-full w-full object-cover object-[center_42%]"
            loading="eager"
            decoding="async"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-forest-950/75 via-forest-950/35 to-forest-950/10"
        />

        <div
          className="relative z-10 mx-auto flex min-h-[min(88vh,720px)] sm:min-h-[680px] max-w-[1320px] items-center px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 pt-20 sm:pt-24"
        >
          <div className="max-w-xl">
            <p
              className="text-[0.6875rem] sm:text-xs uppercase tracking-[0.22em] text-cream-100/95 font-semibold [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]"
            >
              Lakhe Mushroom Farm
            </p>
            <h1
              className="mt-5 sm:mt-6 font-serif text-[2rem] sm:text-[2.5rem] lg:text-[2.75rem] tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]"
            >
              <span className="block leading-[1.35] sm:leading-[1.4]">Fresh Mushrooms.</span>
              <span className="mt-2 sm:mt-3 block leading-[1.35] sm:leading-[1.4]">
                Grown with Care.
              </span>
            </h1>
            <p
              className="mt-6 sm:mt-7 text-[0.9375rem] sm:text-body-lg text-cream-50/95 leading-relaxed max-w-md [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]"
            >
              Farm-fresh mushrooms, expert training, and complete farm solutions.
            </p>
            <div className="mt-8 sm:mt-9 flex flex-wrap gap-3">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-forest-800 !text-cream-50 hover:bg-forest-900 shadow-md min-h-11 px-6 rounded-lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Explore Products
                </Button>
              </Link>
              <Link to="/training">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cream-200/70 !text-cream-50 bg-transparent hover:bg-white/10 min-h-11 px-6 rounded-lg"
                >
                  Mushroom Training
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <svg
          viewBox="0 0 1440 88"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute bottom-0 left-0 w-full h-14 sm:h-[4.5rem] text-cream-100"
        >
          <path
            fill="currentColor"
            d="M0,56 C240,88 480,24 720,48 C960,72 1200,16 1440,44 L1440,88 L0,88 Z"
          />
        </svg>
      </section>

      {/* HERO OFFERINGS STRIP */}
      <section className="relative -mt-px bg-cream-100">
        <PageContainer className="relative z-10 -mt-5 sm:-mt-7 pb-10 sm:pb-12">
          <HeroOfferingsStrip />
        </PageContainer>
      </section>

      {/* OUR PRODUCTS */}
      <section className="bg-sage-50/40">
        <PageContainer>
          <Section size="md">
            <SectionHeader
              eyebrow="Our products"
              title="Farm-grown, carefully packed"
              description="Tap any card for full details, nutrition facts and specifications."
              action={
                <Link to="/products">
                  <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View all
                  </Button>
                </Link>
              }
            />
            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
              <HorizontalScrollRow>
                {displayProducts.map((p) => (
                  <HorizontalScrollItem key={p.id}>
                    <ProductCard
                      id={p.id}
                      slug={p.slug}
                      name={p.name}
                      price={p.price}
                      unit={p.unit}
                      shortDescription={p.short_description}
                      image={p.images[0]}
                      badges={p.badges.slice(0, 2) as BadgeVariant[]}
                      onClick={() => navigate(`/products/${p.slug}`)}
                      className="h-full"
                    />
                  </HorizontalScrollItem>
                ))}
              </HorizontalScrollRow>
            )}
          </Section>
        </PageContainer>
      </section>

      {/* OUR TRAINING */}
      <section className="bg-white">
        <PageContainer>
          <Section size="md">
            <SectionHeader
              eyebrow="Our programmes"
              title="Online, offline & farm setup"
              description="Pay on the website — Tatya Lakhe shares all programme details with you directly."
              action={
                <Link to="/training">
                  <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View all
                  </Button>
                </Link>
              }
            />
            <HorizontalScrollRow>
              {homeTraining.map((t) => (
                <HorizontalScrollItem key={t.id}>
                  <TrainingCard
                    title={t.title}
                    format={formatLabel[t.format]}
                    duration={t.duration}
                    price={t.price}
                    image={t.image}
                    subtitle={t.features[0]}
                    onClick={() => navigate(`/training/${t.slug}`)}
                    className="h-full"
                  />
                </HorizontalScrollItem>
              ))}
            </HorizontalScrollRow>
          </Section>
        </PageContainer>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-sage-50/40 border-t border-ink-100">
        <PageContainer>
          <Section size="md">
            <SectionHeader
              eyebrow="Testimonials"
              title="Trusted by growers & customers"
              description="Farmers, students and buyers who have worked with Lakhe Mushroom Farm."
            />
            <TestimonialCarousel items={testimonials} />
          </Section>
        </PageContainer>
      </section>

      {/* INSIDE LAKHE */}
      <section className="bg-sage-50/40">
        <PageContainer>
          <Section size="md">
            <SectionHeader
              eyebrow="Inside Lakhe"
              title="Photos & videos from the farm"
              action={
                <Link to="/gallery">
                  <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Full gallery
                  </Button>
                </Link>
              }
            />
            <AutoScrollGallery className="py-1">
              {showcaseGallery.slice(0, 12).map((g) => (
                <div key={g.id} className="w-56 sm:w-72 shrink-0">
                  <Card padding="none" className="overflow-hidden bg-white">
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
                        <span
                          className="absolute bottom-3 left-3 flex items-center gap-1 rounded-pill bg-forest-900/75 px-2 py-1 text-caption text-cream-50"
                        >
                          <Play className="h-3 w-3" /> Video
                        </span>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </AutoScrollGallery>
          </Section>
        </PageContainer>
      </section>

      {/* TRUST STATS */}
      <section className="bg-forest-900 text-cream-50">
        <PageContainer>
          <Section size="md">
            <ResponsiveGrid cols={{ base: 2, md: 4 }} gap="md">
              {[
                { value: '20+', label: 'Years of practice' },
                { value: '5000+', label: 'Farmers trained' },
                { value: '25+', label: 'Countries served' },
                { value: '12+', label: 'Product varieties' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/10 px-5 py-6 text-center"
                >
                  <p className="font-serif text-display text-cream-50 leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-small font-medium text-cream-200">
                    {stat.label}
                  </p>
                </div>
              ))}
            </ResponsiveGrid>
          </Section>
        </PageContainer>
      </section>

      {/* OUR STORY */}
      <section className="bg-white">
        <PageContainer>
          <Section size="md">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div
                className="flex items-center justify-center rounded-2xl border border-ink-100 bg-white p-3 sm:p-5 shadow-subtle"
              >
                <img
                  src={HOME_STORY_IMAGE}
                  alt="Lakhe Mushroom Farm — spawn, grow, harvest and pack"
                  className="w-full h-auto max-h-[min(75vh,560px)] object-contain"
                />
              </div>
              <div>
                <p className="text-label uppercase tracking-widest text-forest-700 font-medium">
                  Our story
                </p>
                <h2 className="mt-2 font-serif text-h1 text-ink-900 leading-tight">
                  A farm built on craft & patience
                </h2>
                <p className="mt-4 text-body text-ink-600 leading-relaxed">
                  Lakhe Mushroom Farm grew from a small shed and a belief that
                  mushrooms could change lives — through healthy food, honest
                  business and hands-on learning. Today we grow, teach and
                  support cultivators across India and abroad.
                </p>
                <Link to="/about" className="mt-6 inline-block">
                  <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Read our story
                  </Button>
                </Link>
              </div>
            </div>
          </Section>
        </PageContainer>
      </section>

      {/* FOUNDER'S STORY */}
      <section className="bg-sage-50/40">
        <PageContainer>
          <Section size="md">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="order-2 lg:order-1">
                <p className="text-label uppercase tracking-widest text-forest-700 font-medium">
                  Founder&apos;s story
                </p>
                <h2 className="mt-2 font-serif text-h1 text-ink-900 leading-tight">
                  {FOUNDER.honorific}
                </h2>
                <p className="mt-1 text-small font-medium text-forest-700">
                  {FOUNDER.title} · {FOUNDER.location}
                </p>
                <p className="mt-4 text-body text-ink-600 leading-relaxed">
                  {FOUNDER.bio}
                </p>
                <Link to="/founder" className="mt-6 inline-block">
                  <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Meet the founder
                  </Button>
                </Link>
              </div>
              <div
                className="order-1 lg:order-2 flex items-end justify-center rounded-2xl border border-ink-100 bg-white p-3 sm:p-5 shadow-subtle"
              >
                <img
                  src={HOME_FOUNDER_IMAGE}
                  alt="Founder of Lakhe Mushroom Farm"
                  className="w-full h-auto max-h-[min(75vh,640px)] object-contain object-bottom"
                />
              </div>
            </div>
          </Section>
        </PageContainer>
      </section>

      {/* WHY LAKHE */}
      <section className="bg-white border-t border-ink-100">
        <PageContainer>
          <Section size="md">
            <SectionHeader
              eyebrow="Why Lakhe"
              title="Premium quality, rooted in the farm"
              description="Every batch traces back to real soil, real people and a real farm."
            />
            <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
              <FeatureCard
                icon={<Award className="h-5 w-5" />}
                title="Quality"
                description="Clean, hygienic products grown with strict quality checks."
              />
              <FeatureCard
                icon={<Sprout className="h-5 w-5" />}
                title="Expertise"
                description="Training built from years of on-farm practice, not theory alone."
              />
              <FeatureCard
                icon={<Users className="h-5 w-5" />}
                title="Support"
                description="Guidance from first spawn to your first sale — we stay with you."
              />
              <FeatureCard
                icon={<Leaf className="h-5 w-5" />}
                title="Sustainable farming"
                description="Naturally grown mushrooms with care for soil, water and people."
              />
            </ResponsiveGrid>
          </Section>
        </PageContainer>
      </section>

      {/* ASK US */}
      <section className="bg-sage-50/40 border-t border-ink-100">
        <PageContainer>
          <Section size="md">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
              <div>
                <p className="text-label uppercase tracking-widest text-forest-700 font-medium">
                  Ask us
                </p>
                <h2 className="mt-2 font-serif text-h1 text-ink-900 leading-tight">
                  Have a question?
                </h2>
                <p className="mt-4 text-body text-ink-600 leading-relaxed max-w-md">
                  Products, training, farm setup or orders — send us a quick note
                  and we&apos;ll get back to you.
                </p>
                <a
                  href={`https://wa.me/${config.business.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-small font-medium text-forest-800 hover:text-forest-900"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white">
                    <WhatsAppIcon className="h-3.5 w-3.5" />
                  </span>
                  Or chat on WhatsApp
                </a>
              </div>
              <Card padding="lg" className="border-ink-100 shadow-subtle">
                <HomeQueryForm />
              </Card>
            </div>
          </Section>
        </PageContainer>
      </section>

      {/* FINAL CTA */}
      <section className="bg-forest-900">
        <PageContainer>
          <Section size="md" className="!pb-8 sm:!pb-10">
            <div
              className="rounded-2xl border border-forest-700 bg-forest-800/50 px-6 py-10 sm:px-10 sm:py-12 text-center"
            >
              <h2 className="font-serif text-h1 text-cream-50 leading-tight">
                Ready to grow with Lakhe?
              </h2>
              <p className="mt-3 text-body text-cream-100/85 max-w-lg mx-auto">
                Whether you want fresh products, expert training or a full farm
                setup — we&apos;re here to help you start and scale.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-cream-50 !text-forest-900 hover:bg-white"
                  >
                    Shop products
                  </Button>
                </Link>
                <Link to="/training">
                  <Button
                    size="lg"
                    variant="outline"
                    className="!border-cream-200/60 !text-cream-50 hover:!bg-white/10"
                  >
                    Explore training
                  </Button>
                </Link>
              </div>
              <a
                href={`https://wa.me/${config.business.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-cream-200/25 bg-white/5 px-5 py-2.5 text-small font-medium text-cream-50 transition-colors hover:bg-white/10 hover:border-cream-200/40"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppIcon className="h-4 w-4" />
                </span>
                Talk to us on WhatsApp
              </a>
            </div>
          </Section>
        </PageContainer>
      </section>
    </AppShell>
  );
}
