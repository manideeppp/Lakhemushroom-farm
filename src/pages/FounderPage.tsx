import { Link } from 'react-router-dom';
import {
  ArrowRight,
  GraduationCap,
  Mail,
  MapPin,
  Quote,
  Sprout,
  Star,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveGrid } from '../components/layout/Layout';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { config } from '../lib/config';

export function FounderPage() {
  return (
    <AppShell>
      <PageContainer as="section" className="pt-4 sm:pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-forest-900 text-cream-50 shadow-card">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="relative min-h-[280px] md:min-h-[420px]">
              <ResponsiveImage
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1400&q=70"
                alt="Founder of Lakhe Mushroom Farm"
                aspect="aspect-auto h-full"
                rounded="none"
                containerClassName="!h-full"
              />
            </div>
            <div className="relative flex flex-col justify-center gap-3 px-6 py-10 sm:px-10 sm:py-14">
              <Badge variant="natural" className="w-fit">
                <Sprout className="h-3 w-3" /> Meet the Founder
              </Badge>
              <h1 className="font-serif text-[2.25rem] leading-[1.05] sm:text-hero tracking-tight">
                The person behind
                <br />
                <span className="text-cream-200">every basket.</span>
              </h1>
              <p className="text-body-lg text-cream-100/90 max-w-lg">
                A small-town beginning, an obsession with growing things, and a
                belief that mushrooms could change rural livelihoods — that’s
                the story of Lakhe.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link to="/training">
                  <Button
                    className="bg-cream-50 !text-forest-900 hover:bg-cream-100"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Explore training
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="border-cream-200 !text-cream-50 hover:bg-white/10"
                  >
                    Say hello
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <PageContainer>
        {/* Journey */}
        <Section size="md">
          <SectionHeader
            eyebrow="The Journey"
            title="From curiosity to craft"
            description="A short, honest look at the road so far."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {[
              {
                title: 'The spark',
                text: 'Grew up in a farming family. Watched a small mushroom growing kit produce food out of nothing — and never really got over it.',
              },
              {
                title: 'Learning the hard way',
                text: 'Failed batches, contamination, seasons of low yield. Every mistake became a note in a growing playbook.',
              },
              {
                title: 'Building the farm',
                text: 'Set up humidity, airflow and steady processes. Started supplying restaurants, then homes.',
              },
              {
                title: 'Passing it on',
                text: 'Started teaching others what took years to figure out — no jargon, no gatekeeping.',
              },
            ].map((c) => (
              <Card key={c.title} padding="lg">
                <h3 className="font-serif text-h3 text-ink-900">{c.title}</h3>
                <p className="mt-2 text-small text-ink-700 leading-relaxed">
                  {c.text}
                </p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Experience */}
        <Section size="md">
          <SectionHeader
            eyebrow="Experience"
            title="Numbers that keep it honest"
          />
          <ResponsiveGrid cols={{ base: 2, md: 4 }} gap="md">
            <Card padding="lg">
              <span className="font-serif text-display text-brand leading-none">
                8+
              </span>
              <p className="mt-1 text-small font-medium text-ink-800">
                Years farming
              </p>
            </Card>
            <Card padding="lg">
              <span className="font-serif text-display text-brand leading-none">
                12
              </span>
              <p className="mt-1 text-small font-medium text-ink-800">
                Mushroom varieties grown
              </p>
            </Card>
            <Card padding="lg">
              <span className="font-serif text-display text-brand leading-none">
                300+
              </span>
              <p className="mt-1 text-small font-medium text-ink-800">
                Learners mentored
              </p>
            </Card>
            <Card padding="lg">
              <span className="font-serif text-display text-brand leading-none">
                50+
              </span>
              <p className="mt-1 text-small font-medium text-ink-800">
                Farms set up
              </p>
            </Card>
          </ResponsiveGrid>
        </Section>

        {/* Quote */}
        <Section size="md">
          <Card padding="lg" className="bg-cream-100 border-cream-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <Quote className="h-8 w-8 text-brand shrink-0" />
              <div>
                <p className="font-serif text-h2 text-ink-900 leading-snug">
                  “A mushroom is small, but a mushroom farm changes families.
                  I’ve seen it happen — that’s why I do this.”
                </p>
                <div className="mt-3 flex items-center gap-2 text-small text-ink-600">
                  <span className="font-medium text-ink-800">Founder</span>
                  <span>·</span>
                  <span>Lakhe Mushroom Farm</span>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* Skills */}
        <Section size="md">
          <SectionHeader
            eyebrow="What I can help you with"
            title="Skills and specialities"
          />
          <ResponsiveGrid cols={{ base: 1, sm: 2, lg: 3 }} gap="md">
            {[
              {
                title: 'Substrate & spawn',
                text: 'Practical recipes for straw, sawdust, husks and grain spawn.',
                icon: <Sprout className="h-5 w-5" />,
              },
              {
                title: 'Farm design',
                text: 'Climate control on a budget — for hot, humid, and cold zones.',
                icon: <MapPin className="h-5 w-5" />,
              },
              {
                title: 'Training design',
                text: 'Step-by-step curricula for households, small farms and startups.',
                icon: <GraduationCap className="h-5 w-5" />,
              },
              {
                title: 'Market & branding',
                text: 'Selling to homes, restaurants, retailers and online.',
                icon: <Star className="h-5 w-5" />,
              },
              {
                title: 'Value-added products',
                text: 'Drying, powdering, ready-to-eat and spawn packaging.',
                icon: <Star className="h-5 w-5" />,
              },
              {
                title: 'Community',
                text: 'Follow-up support, WhatsApp groups, alumni network.',
                icon: <Mail className="h-5 w-5" />,
              },
            ].map((s) => (
              <Card key={s.title} padding="lg" className="flex gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                  {s.icon}
                </span>
                <div>
                  <h3 className="font-serif text-h3 text-ink-900">{s.title}</h3>
                  <p className="mt-1 text-small text-ink-700 leading-relaxed">
                    {s.text}
                  </p>
                </div>
              </Card>
            ))}
          </ResponsiveGrid>
        </Section>

        {/* Message */}
        <Section size="md">
          <div className="rounded-2xl bg-forest-900 text-cream-50 px-6 py-10 sm:px-10 sm:py-14 shadow-card">
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h2 className="font-serif text-h1 text-cream-50 leading-tight">
                  A message to future mushroom growers
                </h2>
                <p className="mt-2 text-body text-cream-100/85 max-w-xl">
                  If mushrooms have caught your eye — start small, but start
                  with the right method. I built Lakhe so nobody has to figure
                  it out alone.
                </p>
                <p className="mt-3 text-small text-cream-100/70">
                  Write to me at{' '}
                  <a
                    className="underline hover:text-cream-50"
                    href={`mailto:${config.business.email}`}
                  >
                    {config.business.email}
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/training">
                  <Button
                    size="lg"
                    className="bg-cream-50 !text-forest-900 hover:bg-cream-100"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Learn with me
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
