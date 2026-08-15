import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  HeartHandshake,
  Leaf,
  Sprout,
  Target,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveGrid } from '../components/layout/Layout';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FeatureCard, StatCard } from '../components/cards/Cards';

export function AboutPage() {
  return (
    <AppShell>
      {/* HERO */}
      <PageContainer as="section" className="pt-4 sm:pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-forest-900 text-cream-50 shadow-card">
          <div className="absolute inset-0">
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=2000&q=70"
              alt=""
              aspect="aspect-auto h-full"
              rounded="none"
              containerClassName="!h-full"
              className="opacity-45"
            />
          </div>
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-forest-900/90 via-forest-900/60 to-forest-900/30"
          />
          <div className="relative flex flex-col gap-4 max-w-2xl px-6 py-14 sm:px-10 sm:py-20">
            <p className="text-label uppercase tracking-[0.2em] text-cream-200/90 font-medium">
              Our story
            </p>
            <h1 className="font-serif text-hero leading-[1.05] tracking-tight">
              A farm built on <span className="text-cream-200">patience</span>,
              craft, and community.
            </h1>
            <p className="text-body-lg text-cream-100/90 max-w-xl">
              Lakhe Mushroom Farm began as a simple idea — that mushrooms
              deserve the same care that great tea or wine gets. Today it’s a
              brand, a training school and a farm-setup partner for people who
              want to build their own mushroom business.
            </p>
          </div>
        </div>
      </PageContainer>

      {/* MISSION VISION */}
      <PageContainer>
        <Section size="md">
          <ResponsiveGrid cols={{ base: 1, md: 2 }} gap="lg">
            <Card padding="lg" className="bg-forest-50 border-forest-200">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest-100 text-forest-800">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-serif text-h2 text-forest-900">Mission</h2>
              <p className="mt-2 text-body text-forest-900/85 leading-relaxed">
                Make premium, chemical-free mushrooms and mushroom knowledge
                accessible — to households, farmers, and entrepreneurs alike.
              </p>
            </Card>
            <Card padding="lg" className="bg-cream-100 border-cream-200">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-cream-200 text-clay-500">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="mt-3 font-serif text-h2 text-ink-900">Vision</h2>
              <p className="mt-2 text-body text-ink-700 leading-relaxed">
                A world where a mushroom farm is as normal as a kitchen garden —
                nourishing, profitable, and rooted in the community that grows it.
              </p>
            </Card>
          </ResponsiveGrid>
        </Section>

        {/* JOURNEY TIMELINE */}
        <Section size="md">
          <SectionHeader
            eyebrow="Our Journey"
            title="From one growing tent to a full mushroom platform"
            description="A quick look at how Lakhe grew, one honest step at a time."
          />
          <ol className="relative border-l-2 border-forest-200 ml-3 space-y-6">
            {[
              {
                year: 'Beginning',
                title: 'A single grow tent',
                text: 'Started as a home experiment with a handful of substrate bags and one tiny grow tent — and a lot of curiosity.',
              },
              {
                year: 'First harvests',
                title: 'From kitchen table to local market',
                text: 'Neighbours became first customers. Local restaurants asked for weekly deliveries. The name Lakhe was born.',
              },
              {
                year: 'Training begins',
                title: 'Sharing what worked',
                text: 'Farmers and hobbyists began asking how to do this at home. We started structured, hands-on training programs.',
              },
              {
                year: 'Today',
                title: 'A farm, a brand and a school',
                text: 'Fresh produce, wellness products, spawn, training and end-to-end farm setup — all under one honest brand.',
              },
            ].map((step) => (
              <li key={step.title} className="ml-6">
                <span className="absolute -left-[9px] mt-1 h-4 w-4 rounded-full bg-brand ring-4 ring-forest-50" />
                <p className="text-caption uppercase tracking-widest text-forest-600 font-medium">
                  {step.year}
                </p>
                <h3 className="font-serif text-h3 text-ink-900 mt-0.5">
                  {step.title}
                </h3>
                <p className="mt-1 text-small text-ink-700 leading-relaxed max-w-2xl">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        {/* VALUES */}
        <Section size="md">
          <SectionHeader
            eyebrow="Values"
            title="What we care about, in everything we do"
          />
          <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 4 }} gap="md">
            <FeatureCard
              icon={<Leaf className="h-5 w-5" />}
              title="Grown, not sourced"
              description="Every product traces back to our own beds and process. No white-label reselling."
            />
            <FeatureCard
              icon={<HeartHandshake className="h-5 w-5" />}
              title="Farmer-first"
              description="We share the exact playbook we use — because more good farms is a good thing."
            />
            <FeatureCard
              icon={<Sprout className="h-5 w-5" />}
              title="Simple methods"
              description="Low-tech, local materials, and steady practices that anyone can repeat."
            />
            <FeatureCard
              icon={<Award className="h-5 w-5" />}
              title="Quality over quantity"
              description="A slow, careful farm makes better mushrooms. We aren’t in a race."
            />
          </ResponsiveGrid>
        </Section>

        {/* STATS */}
        <Section size="md">
          <ResponsiveGrid cols={{ base: 2, md: 4 }} gap="md">
            <StatCard value="1000+" label="Kilos harvested" hint="every year" />
            <StatCard value="300+" label="Farmers trained" />
            <StatCard value="50+" label="Farms set up" />
            <StatCard value="10+" label="States served" />
          </ResponsiveGrid>
        </Section>

        {/* CTA */}
        <Section size="md">
          <div className="rounded-2xl bg-forest-900 text-cream-50 px-6 py-10 sm:px-10 sm:py-14 shadow-card">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h2 className="font-serif text-h1 text-cream-50 leading-tight">
                  Want to visit the farm or learn from us?
                </h2>
                <p className="mt-2 text-body text-cream-100/85">
                  We host visits, cohorts and farm-setup consultations. Reach out
                  and we’ll make time.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/contact">
                  <Button
                    size="lg"
                    className="bg-cream-50 !text-forest-900 hover:bg-cream-100"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Contact us
                  </Button>
                </Link>
                <Link to="/founder">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-cream-200 !text-cream-50 hover:bg-white/10"
                  >
                    Meet the founder
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
