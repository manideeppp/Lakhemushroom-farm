import { useState } from 'react';
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { Textarea } from '../components/forms/Textarea';
import { useToast } from '../components/feedback/ToastProvider';
import { createQuery } from '../lib/data';
import { useAuth } from '../context/AuthContext';
import { config } from '../lib/config';

export function ContactPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: profile?.full_name ?? '',
    email: user?.email ?? '',
    phone: profile?.phone ?? '',
    subject: 'General enquiry',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({
        tone: 'warning',
        message: 'Name, email and message are required.',
      });
      return;
    }
    try {
      setSubmitting(true);
      await createQuery({
        user_id: user?.id ?? null,
        ...form,
      });
      toast({
        tone: 'success',
        title: 'Message sent',
        message: 'Thanks for reaching out — we’ll reply shortly.',
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
      <PageContainer>
        <Section size="sm">
          <SectionHeader
            eyebrow="Get in touch"
            title="We’d love to hear from you"
            description="Questions about products, training, farm setup — or just curious about mushrooms? Send us a note."
          />
        </Section>

        <Section size="sm">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card padding="lg">
              <form onSubmit={submit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label="Name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
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
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  <Input
                    label="Subject"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                  />
                </div>
                <Textarea
                  label="Message"
                  required
                  rows={6}
                  placeholder="How can we help?"
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
                    Send message
                  </Button>
                </div>
              </form>
            </Card>

            <div className="space-y-4">
              <Card padding="lg" className="bg-forest-50 border-forest-200">
                <h3 className="font-serif text-h3 text-forest-900">Reach us</h3>
                <ul className="mt-3 space-y-3 text-small">
                  <li className="flex items-start gap-2 text-forest-900">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                    {config.business.address}
                  </li>
                  <li className="flex items-start gap-2 text-forest-900">
                    <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                    <a
                      href={`tel:${config.business.phone.replace(/\s+/g, '')}`}
                      className="hover:underline"
                    >
                      {config.business.phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-2 text-forest-900">
                    <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                    <a
                      href={`mailto:${config.business.email}`}
                      className="hover:underline"
                    >
                      {config.business.email}
                    </a>
                  </li>
                </ul>
                <a
                  href={`https://wa.me/${config.business.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block"
                >
                  <Button
                    leftIcon={<WhatsAppIcon className="h-4 w-4" />}
                  >
                    Chat on WhatsApp
                  </Button>
                </a>
              </Card>

              <Card padding="none" className="overflow-hidden">
                <iframe
                  title="Lakhe Mushroom Farm map"
                  src={config.business.mapsEmbedUrl}
                  loading="lazy"
                  className="w-full h-[260px] border-0"
                />
              </Card>

              <Card padding="lg">
                <h3 className="font-serif text-h3 text-ink-900">Hours</h3>
                <ul className="mt-2 space-y-1 text-small text-ink-700">
                  <li className="flex justify-between">
                    <span>Mon – Sat</span>
                    <span className="font-medium text-ink-900">
                      9:00 – 18:00
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-ink-900">Closed</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
