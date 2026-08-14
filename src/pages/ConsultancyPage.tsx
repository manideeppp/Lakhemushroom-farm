import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Compass,
  HandCoins,
  Layers,
  MessageCircle,
  ShieldCheck,
  Sprout,
  TrendingUp,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { ResponsiveGrid } from '../components/layout/Layout';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { Textarea } from '../components/forms/Textarea';
import { Select } from '../components/forms/Select';
import { useToast } from '../components/feedback/ToastProvider';
import { createQuery } from '../lib/data';
import { useAuth } from '../context/AuthContext';
import { config } from '../lib/config';

const SERVICES = [
  {
    key: 'farm-setup',
    icon: <Building2 className="h-5 w-5" />,
    title: 'Farm setup',
    description:
      'End-to-end design of your grow rooms, spawn area, packaging and workflow — for hot, humid or cold zones.',
  },
  {
    key: 'cultivation',
    icon: <Sprout className="h-5 w-5" />,
    title: 'Cultivation guidance',
    description:
      'Choosing the right species, substrate recipes, contamination control, harvest planning.',
  },
  {
    key: 'market',
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Market guidance',
    description:
      'Selling to restaurants, retail, homes and online — plus brand and packaging.',
  },
  {
    key: 'subsidy',
    icon: <HandCoins className="h-5 w-5" />,
    title: 'Subsidy guidance',
    description:
      'Navigating government schemes, subsidies and loans for mushroom farming.',
  },
  {
    key: 'a-to-z',
    icon: <Layers className="h-5 w-5" />,
    title: 'A–Z consultancy',
    description:
      'One partner from land selection to first sale — bundled and priced clearly.',
  },
  {
    key: 'ongoing',
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Ongoing support',
    description:
      'WhatsApp support, monthly reviews, on-call troubleshooting after setup.',
  },
];

export function ConsultancyPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: profile?.full_name ?? '',
    email: user?.email ?? '',
    phone: profile?.phone ?? '',
    subject: 'Farm setup consultancy',
    message: '',
    service: 'farm-setup',
  });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ tone: 'warning', message: 'Name, email and message are required.' });
      return;
    }
    try {
      setSubmitting(true);
      await createQuery({
        user_id: user?.id ?? null,
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `${form.subject} · ${form.service}`,
        message: form.message,
      });
      toast({
        tone: 'success',
        title: 'Enquiry sent',
        message: 'Our team will reach out within one working day.',
      });
      setForm({ ...form, message: '' });
    } catch (err) {
      toast({
        tone: 'danger',
        title: 'Could not send',
        message: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      {/* HERO */}
      <PageContainer as="section" className="pt-4 sm:pt-8">
        <div className="relative overflow-hidden rounded-2xl bg-forest-900 text-cream-50 shadow-card">
          <div className="absolute inset-0">
            <ResponsiveImage
              src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=2000&q=70"
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
            <Badge variant="natural" className="w-fit">
              <Compass className="h-3 w-3" /> Farm Setup Consultancy
            </Badge>
            <h1 className="font-serif text-hero leading-[1.05] tracking-tight">
              We help you build a real,
              <br />
              <span className="text-cream-200">running mushroom farm.</span>
            </h1>
            <p className="text-body-lg text-cream-100/90 max-w-xl">
              From site selection to your first harvest — plans that fit your
              budget, honest numbers, and hands-on help. No fluff.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <a href="#enquire">
                <Button
                  size="lg"
                  className="bg-cream-50 !text-forest-900 hover:bg-cream-100"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Talk to us
                </Button>
              </a>
              <a
                href={`https://wa.me/${config.business.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cream-200 !text-cream-50 hover:bg-white/10"
                  leftIcon={<MessageCircle className="h-4 w-4" />}
                >
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </PageContainer>

      <PageContainer>
        {/* Services */}
        <Section size="md">
          <SectionHeader
            eyebrow="What we do"
            title="Everything a mushroom farm needs — under one roof"
            description="Pick a single service, or hand it all to us. Priced clearly, delivered honestly."
          />
          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            {SERVICES.map((s) => (
              <Card key={s.key} padding="lg" className="flex flex-col gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                  {s.icon}
                </span>
                <h3 className="font-serif text-h3 text-ink-900">{s.title}</h3>
                <p className="text-small text-ink-700 leading-relaxed">
                  {s.description}
                </p>
              </Card>
            ))}
          </ResponsiveGrid>
        </Section>

        {/* Process */}
        <Section size="md">
          <SectionHeader
            eyebrow="How it works"
            title="A calm, structured process"
          />
          <ol className="grid gap-4 md:grid-cols-4">
            {[
              {
                n: '01',
                title: 'Discovery',
                text: 'A free 20-minute call to understand your goal, land, and budget.',
              },
              {
                n: '02',
                title: 'Plan',
                text: 'A written plan: layout, species, spawn, costs, timeline.',
              },
              {
                n: '03',
                title: 'Build',
                text: 'On-site or remote guidance while you build and set up.',
              },
              {
                n: '04',
                title: 'Harvest & sell',
                text: 'First-cycle mentoring, quality checks, and market intro.',
              },
            ].map((s) => (
              <li key={s.n}>
                <Card padding="lg" className="h-full">
                  <span className="font-serif text-h1 text-brand leading-none">
                    {s.n}
                  </span>
                  <h3 className="mt-2 font-serif text-h3 text-ink-900">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-small text-ink-700">{s.text}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Section>

        {/* Enquiry */}
        <Section size="md" id="enquire">
          <SectionHeader
            eyebrow="Enquiry"
            title="Tell us about your plan"
            description="We reply within one working day. No spam, ever."
          />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card padding="lg">
              <form onSubmit={submit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Phone (optional)"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <Select
                    label="Service you need"
                    value={form.service}
                    onChange={(e) =>
                      setForm({ ...form, service: e.target.value })
                    }
                  >
                    {SERVICES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.title}
                      </option>
                    ))}
                  </Select>
                </div>
                <Textarea
                  label="Tell us more"
                  rows={5}
                  required
                  placeholder="What are you planning? Land, budget, timeline?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    loading={submitting}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Send enquiry
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4">
              <Card padding="lg" className="bg-forest-50 border-forest-200">
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-6 w-6 text-forest-800 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-h3 text-forest-900">
                      What you get
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-small text-forest-900/85">
                      <li>· Site & climate suitability review</li>
                      <li>· Layout drawing & bill of materials</li>
                      <li>· Investment plan with realistic returns</li>
                      <li>· 90-day WhatsApp support post go-live</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card padding="lg" className="bg-cream-100 border-cream-200">
                <h3 className="font-serif text-h3 text-ink-900">
                  Prefer a quick chat?
                </h3>
                <p className="mt-1 text-small text-ink-700">
                  Message us on WhatsApp — we usually reply the same day.
                </p>
                <a
                  href={`https://wa.me/${config.business.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block"
                >
                  <Button
                    variant="outline"
                    leftIcon={<MessageCircle className="h-4 w-4" />}
                  >
                    Chat on WhatsApp
                  </Button>
                </a>
              </Card>

              <Card padding="lg">
                <h3 className="font-serif text-h3 text-ink-900">
                  Also want training?
                </h3>
                <p className="mt-1 text-small text-ink-700">
                  Many clients pair setup with our online/offline training
                  program — you learn while your farm gets built.
                </p>
                <Link to="/training" className="mt-3 inline-block">
                  <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Explore training
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
