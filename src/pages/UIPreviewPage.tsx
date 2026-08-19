import { useState } from 'react';
import {
  Bell,
  Heart,
  Leaf,
  Phone,
  Search,
  ShoppingCart,
  Sprout,
  Star,
  Trash2,
  User,
} from 'lucide-react';

import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section, SectionHeader } from '../components/layout/Section';
import {
  HorizontalScroll,
  ResponsiveGrid,
  Stack,
} from '../components/layout/Layout';

import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal, ConfirmationModal } from '../components/ui/Modal';
import { BottomSheet } from '../components/ui/BottomSheet';
import { MobileDrawer } from '../components/ui/MobileDrawer';
import {
  Skeleton,
  SkeletonText,
  SkeletonImage,
  SkeletonCard,
  SkeletonSection,
} from '../components/ui/Skeleton';

import { Input } from '../components/forms/Input';
import { Textarea } from '../components/forms/Textarea';
import { Select } from '../components/forms/Select';
import { Checkbox } from '../components/forms/Checkbox';
import { Radio } from '../components/forms/Radio';
import { OTPInput } from '../components/forms/OTPInput';
import { FileUpload } from '../components/forms/FileUpload';
import { DateInput } from '../components/forms/DateInput';

import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { ImageSkeleton, VideoSkeleton } from '../components/media/MediaSkeletons';

import { Alert } from '../components/feedback/Alert';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SuccessState,
} from '../components/feedback/States';
import { useToast } from '../components/feedback/ToastProvider';

import {
  FeatureCard,
  InfoCard,
  MediaCard,
  OrderCard,
  ProductCard,
  StatCard,
  StoryCard,
  TrainingCard,
} from '../components/cards/Cards';

import { LakheLogo } from '../components/navigation/LakheLogo';
import type { BadgeVariant } from '../components/ui/Badge';

const SAMPLE_MUSHROOM_IMG =
  'https://images.unsplash.com/photo-1568900122085-3c05f8bd57e5?auto=format&fit=crop&w=800&q=60';
const SAMPLE_POWDER_IMG =
  'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=60';
const SAMPLE_FARM_IMG =
  'https://images.unsplash.com/photo-1602867741746-6df80f40b3f6?auto=format&fit=crop&w=1200&q=60';

const SwatchRow = ({
  name,
  swatches,
}: {
  name: string;
  swatches: { label: string; value: string; text?: 'dark' | 'light' }[];
}) => (
  <div>
    <p className="mb-2 text-label uppercase tracking-widest text-ink-500 font-medium">
      {name}
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {swatches.map((s) => (
        <div key={s.label} className="overflow-hidden rounded-lg border border-ink-100">
          <div
            className="aspect-[4/3] w-full flex items-end p-2"
            style={{ backgroundColor: s.value }}
          >
            <span
              className={
                s.text === 'light'
                  ? 'text-cream-50 text-caption'
                  : 'text-ink-900 text-caption'
              }
            >
              {s.value}
            </span>
          </div>
          <div className="px-2.5 py-1.5 bg-surface-raised">
            <p className="text-small font-medium text-ink-800">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export function UIPreviewPage() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState('online');

  const badgeVariants: BadgeVariant[] = [
    'fresh',
    'best-seller',
    'premium',
    'natural',
    'ready-to-eat',
    'online',
    'offline',
    'pending',
    'approved',
    'processing',
    'delivered',
    'neutral',
  ];

  return (
    <AppShell cartCount={3} isLoggedIn={true} userName="Rahul">
      <PageContainer as="main">
        <Section size="sm">
          <SectionHeader
            eyebrow="Internal"
            title="Lakhe UI Preview"
            description="A working reference of the Phase 1 design system: tokens, components and layout primitives used across the app."
          />
        </Section>

        {/* Brand & typography */}
        <PreviewBlock title="Brand" description="Logo and identity marks.">
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-ink-100 bg-surface-raised p-6">
            <LakheLogo size="sm" />
            <LakheLogo size="md" />
            <LakheLogo size="lg" />
            <div className="rounded-md bg-forest-900 p-4">
              <LakheLogo size="md" tone="light" />
            </div>
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Colors"
          description="Deep botanical greens on a warm cream base, with muted supporting tones."
        >
          <Stack gap="lg">
            <SwatchRow
              name="Brand / Forest"
              swatches={[
                { label: 'forest-900', value: '#1e3520', text: 'light' },
                { label: 'forest-800', value: '#274229', text: 'light' },
                { label: 'brand', value: '#2f5232', text: 'light' },
                { label: 'forest-500', value: '#4a7d4d', text: 'light' },
                { label: 'forest-300', value: '#96ba97' },
                { label: 'forest-50', value: '#f2f7f2' },
              ]}
            />
            <SwatchRow
              name="Cream / Neutral"
              swatches={[
                { label: 'cream-50', value: '#fdfcf7' },
                { label: 'surface', value: '#faf7ed' },
                { label: 'cream-200', value: '#f4eeda' },
                { label: 'ink-200', value: '#cdcdc9' },
                { label: 'ink-500', value: '#575753', text: 'light' },
                { label: 'ink-900', value: '#161615', text: 'light' },
              ]}
            />
            <SwatchRow
              name="Supporting"
              swatches={[
                { label: 'sage-100', value: '#e8ede4' },
                { label: 'sage-500', value: '#708764', text: 'light' },
                { label: 'clay-300', value: '#cfb083' },
                { label: 'gold-400', value: '#c7a13a' },
                { label: 'success', value: '#3e7b4a', text: 'light' },
                { label: 'danger', value: '#a8382e', text: 'light' },
              ]}
            />
          </Stack>
        </PreviewBlock>

        <PreviewBlock
          title="Typography"
          description="Fraunces serif for storytelling; Inter sans for everything else."
        >
          <Card padding="lg" className="space-y-3">
            <p className="text-label text-ink-500 uppercase tracking-widest">
              Display · Fraunces
            </p>
            <p className="font-serif text-hero text-ink-900 leading-[1.05]">
              Grow Mushrooms.
            </p>
            <p className="font-serif text-display text-ink-900">
              Grow Your Business.
            </p>
            <p className="font-serif text-h1 text-ink-900">
              Section heading H1
            </p>
            <p className="font-serif text-h2 text-ink-900">
              Section heading H2
            </p>
            <p className="font-serif text-h3 text-ink-900">
              Section heading H3
            </p>
            <hr className="lakhe-divider" />
            <p className="text-body-lg text-ink-800">
              Body large — used for lead paragraphs and hero copy that needs
              a touch more presence.
            </p>
            <p className="text-body text-ink-700">
              Body — the default reading size. Comfortable for long content,
              product descriptions and dashboards.
            </p>
            <p className="text-small text-ink-600">
              Small — captions and meta text where space is tight.
            </p>
            <p className="text-caption text-ink-500 uppercase tracking-widest">
              Caption · Uppercase Tag
            </p>
            <p className="text-price font-semibold text-ink-900">₹2,100 price</p>
          </Card>
        </PreviewBlock>

        {/* Buttons */}
        <PreviewBlock
          title="Buttons"
          description="Six variants, three sizes, loading and disabled states."
        >
          <Card padding="lg">
            <Stack gap="lg">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="icon" aria-label="Favourite">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button leftIcon={<ShoppingCart className="h-4 w-4" />}>
                  Add to cart
                </Button>
                <Button variant="outline" leftIcon={<Phone className="h-4 w-4" />}>
                  Call farm
                </Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
              <Button fullWidth size="lg">
                Full-width primary
              </Button>
            </Stack>
          </Card>
        </PreviewBlock>

        {/* Badges */}
        <PreviewBlock
          title="Badges"
          description="Consistent styling across product, order and account states."
        >
          <Card padding="lg">
            <div className="flex flex-wrap gap-2">
              {badgeVariants.map((v) => (
                <Badge key={v} variant={v} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="fresh" size="md" icon={<Leaf className="h-3 w-3" />}>
                Freshly harvested
              </Badge>
              <Badge variant="best-seller" size="md" icon={<Star className="h-3 w-3" />}>
                Best Seller
              </Badge>
              <Badge variant="approved" size="md">
                Order Approved
              </Badge>
            </div>
          </Card>
        </PreviewBlock>

        {/* Product & training cards */}
        <PreviewBlock title="Product Cards">
          <ResponsiveGrid cols={{ base: 2, sm: 2, md: 3, lg: 4 }} gap="md">
            <ProductCard
              id="preview-spawn"
              slug="oyster-mushroom-spawn"
              name="Oyster Mushroom Spawn"
              price={150}
              unit="500g bag"
              shortDescription="Vigorous contamination-free spawn from our farm."
              image={SAMPLE_MUSHROOM_IMG}
              badges={['fresh', 'best-seller']}
            />
            <ProductCard
              id="preview-powder"
              slug="mushroom-powder"
              name="Mushroom Powder"
              price={300}
              unit="150g jar"
              shortDescription="Nutrient-dense wellness powder."
              image={SAMPLE_POWDER_IMG}
              badges={['premium']}
            />
            <ProductCard
              id="preview-shiitake"
              slug="dry-shiitake-mushroom"
              name="Dried Shiitake"
              price={450}
              unit="100g pouch"
              badges={['natural']}
            />
            <ProductCard
              id="preview-rte"
              slug="ready-to-eat-oyster"
              name="Ready-to-Eat Pack"
              price={280}
              unit="250g pack"
              image={SAMPLE_MUSHROOM_IMG}
              badges={['ready-to-eat']}
              inStock={false}
            />
          </ResponsiveGrid>
        </PreviewBlock>

        <PreviewBlock title="Training Cards">
          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            <TrainingCard
              title="A–Z Mushroom Farming Online Training"
              format="Online"
              duration="12 hours · Self-paced"
              price={1500}
              image={SAMPLE_FARM_IMG}
              features={[
                '10+ recorded modules',
                'Lifetime access',
                'Certificate on completion',
              ]}
            />
            <TrainingCard
              title="Weekend Farm Immersion"
              format="Offline"
              duration="2 days"
              price={3000}
              image={SAMPLE_FARM_IMG}
              features={[
                'Hands-on farm sessions',
                'Meals included',
                'Small batch of 10',
              ]}
            />
            <TrainingCard
              title="Advanced Cultivation Bootcamp"
              format="Hybrid"
              duration="4 weeks"
              image={SAMPLE_FARM_IMG}
              features={[
                'Live weekly Q&A',
                'On-farm assessment',
                'Business toolkit',
              ]}
            />
          </ResponsiveGrid>
        </PreviewBlock>

        <PreviewBlock title="Story, Feature, Stat, Info, Media, Order Cards">
          <ResponsiveGrid cols={{ base: 1, md: 2, lg: 3 }} gap="md">
            <StoryCard
              eyebrow="Our journey"
              title="From a small shed to a trusted mushroom brand"
              excerpt="What began as an experiment on a family plot became a
              training ground for hundreds of aspiring farmers."
              image={SAMPLE_FARM_IMG}
            />
            <FeatureCard
              icon={<Sprout className="h-5 w-5" />}
              title="Chemical-free"
              description="No pesticides, no shortcuts. Just clean cultivation."
            />
            <StatCard value="500+" label="Farmers trained" hint="Across India" />
            <InfoCard title="Payment via UPI" tone="brand">
              Scan and pay using any UPI app. Upload the screenshot and our team
              will verify within a few hours.
            </InfoCard>
            <MediaCard
              title="Inside the farm"
              subtitle="Video tour"
              image={SAMPLE_FARM_IMG}
            />
            <OrderCard
              orderRef="LMF-00125"
              date="14 May 2026"
              itemCount={3}
              total={2100}
              status="pending"
            />
          </ResponsiveGrid>
        </PreviewBlock>

        {/* Forms */}
        <PreviewBlock title="Form Components">
          <ResponsiveGrid cols={{ base: 1, md: 2 }} gap="md">
            <Card padding="lg" className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Search"
                placeholder="Search products…"
                leftIcon={<Search className="h-4 w-4" />}
                hint="Try 'oyster', 'spawn' or 'training'."
              />
              <Input
                label="Phone"
                placeholder="+91"
                error="Enter a valid 10-digit number"
              />
              <Input
                label="Verified name"
                defaultValue="Rahul Kumar"
                success="Looks good"
              />
              <Textarea
                label="Your query"
                placeholder="Tell us how we can help…"
                rows={4}
              />
              <Select label="Format" defaultValue="online">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </Select>
              <DateInput label="Preferred visit date" />
            </Card>

            <Card padding="lg" className="space-y-4">
              <p className="text-label uppercase tracking-widest text-ink-500 font-medium">
                Selection controls
              </p>
              <Stack gap="sm">
                <Checkbox
                  label="I agree to the terms"
                  hint="You can change your preferences later."
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <Checkbox label="Send me updates on new products" />
                <Checkbox label="Disabled option" disabled />
              </Stack>
              <Stack gap="sm">
                <Radio
                  name="format"
                  label="Online training"
                  hint="Learn from anywhere at your own pace."
                  checked={radio === 'online'}
                  onChange={() => setRadio('online')}
                />
                <Radio
                  name="format"
                  label="Offline training"
                  hint="Hands-on sessions on the farm."
                  checked={radio === 'offline'}
                  onChange={() => setRadio('offline')}
                />
              </Stack>

              <div className="pt-2">
                <OTPInput
                  label="Enter the 6-digit OTP"
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={(v) =>
                    toast({
                      tone: 'success',
                      title: 'OTP received',
                      message: `Entered: ${v}`,
                    })
                  }
                />
              </div>

              <FileUpload
                label="Upload payment screenshot"
                hint="PNG or JPG · up to 5 MB"
              />
            </Card>
          </ResponsiveGrid>
        </PreviewBlock>

        {/* Media */}
        <PreviewBlock title="Media">
          <ResponsiveGrid cols={{ base: 1, md: 3 }} gap="md">
            <ResponsiveImage
              src={SAMPLE_MUSHROOM_IMG}
              alt="Fresh oyster mushrooms"
              aspect="aspect-[4/3]"
            />
            <ImageSkeleton />
            <VideoSkeleton />
          </ResponsiveGrid>
        </PreviewBlock>

        {/* Skeletons */}
        <PreviewBlock title="Skeletons">
          <Card padding="lg" className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <SkeletonText />
            <ResponsiveGrid cols={{ base: 2, md: 4 }} gap="md">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </ResponsiveGrid>
            <SkeletonImage />
            <SkeletonSection />
          </Card>
        </PreviewBlock>

        {/* Feedback */}
        <PreviewBlock title="Alerts, Toasts & States">
          <Stack gap="md">
            <div className="grid gap-3 sm:grid-cols-2">
              <Alert tone="success" title="Payment received">
                Your order will be confirmed within a few hours.
              </Alert>
              <Alert tone="warning" title="Pending verification">
                We are reviewing your payment screenshot.
              </Alert>
              <Alert tone="danger" title="Something went wrong" onClose={() => {}}>
                Please try uploading the screenshot again.
              </Alert>
              <Alert tone="info" title="Tip">
                Bookmark this page to test the design system quickly.
              </Alert>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={() =>
                  toast({
                    tone: 'success',
                    title: 'Saved',
                    message: 'Your changes were saved.',
                  })
                }
              >
                Success toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    tone: 'info',
                    title: 'Heads up',
                    message: 'This is an informational toast.',
                  })
                }
              >
                Info toast
              </Button>
              <Button
                variant="secondary"
                leftIcon={<Bell className="h-4 w-4" />}
                onClick={() =>
                  toast({
                    tone: 'warning',
                    message: 'Please verify your email address.',
                  })
                }
              >
                Warning toast
              </Button>
              <Button
                variant="danger"
                onClick={() =>
                  toast({
                    tone: 'danger',
                    title: 'Failed',
                    message: 'Could not connect to the server.',
                  })
                }
              >
                Danger toast
              </Button>
            </div>

            <ResponsiveGrid cols={{ base: 1, md: 2 }} gap="md">
              <EmptyState
                title="Your cart is empty"
                message="Explore fresh mushrooms, powders and training programs."
                action={<Button variant="primary">Browse products</Button>}
              />
              <SuccessState
                title="Payment submitted"
                message="Your payment proof has been received and is under verification."
              />
              <ErrorState
                title="Couldn’t load orders"
                message="Please check your connection and try again."
                action={<Button variant="outline">Retry</Button>}
              />
              <LoadingState message="Fetching your orders…" />
            </ResponsiveGrid>
          </Stack>
        </PreviewBlock>

        {/* Modal / Sheet / Drawer */}
        <PreviewBlock title="Overlays">
          <Card padding="lg" className="flex flex-wrap gap-2">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Open Confirmation
            </Button>
            <Button variant="outline" onClick={() => setSheetOpen(true)}>
              Open Bottom Sheet
            </Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              Open Mobile Drawer
            </Button>
          </Card>
        </PreviewBlock>

        {/* Layout demos */}
        <PreviewBlock title="Horizontal Scroll">
          <HorizontalScroll padded gap="md">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="snap-start shrink-0 w-40">
                <ProductCard
                  id={`preview-scroll-${i}`}
                  slug={`sample-product-${i}`}
                  name={`Sample product ${i + 1}`}
                  price={100 + i * 50}
                  unit="250g pack"
                  image={SAMPLE_MUSHROOM_IMG}
                  badges={['fresh']}
                />
              </div>
            ))}
          </HorizontalScroll>
        </PreviewBlock>
      </PageContainer>

      {/* Overlay instances */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Verify your payment"
        description="Upload a clear screenshot of your UPI transaction."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Submit
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Input label="UPI Transaction ID" placeholder="e.g. 4122009874561" />
          <FileUpload label="Screenshot" hint="PNG or JPG" />
        </div>
      </Modal>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Remove this item?"
        message={
          <span>
            This will remove <strong>Oyster Mushroom Spawn</strong> from your cart.
          </span>
        }
        confirmLabel="Remove"
        tone="danger"
      />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filter products"
      >
        <div className="space-y-3">
          <Checkbox label="Fresh" defaultChecked />
          <Checkbox label="Powders" />
          <Checkbox label="Ready to Eat" />
          <div className="pt-2">
            <Button fullWidth onClick={() => setSheetOpen(false)}>
              Apply filters
            </Button>
          </div>
        </div>
      </BottomSheet>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Account"
      >
        <nav className="space-y-1">
          <DrawerLink icon={<User className="h-4 w-4" />} label="My Profile" />
          <DrawerLink
            icon={<ShoppingCart className="h-4 w-4" />}
            label="My Orders"
          />
          <DrawerLink icon={<Heart className="h-4 w-4" />} label="Wishlist" />
          <DrawerLink icon={<Trash2 className="h-4 w-4" />} label="Delete account" />
        </nav>
      </MobileDrawer>
    </AppShell>
  );
}

function PreviewBlock({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Section size="sm">
      <SectionHeader title={title} description={description} />
      {children}
    </Section>
  );
}

function DrawerLink({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-body text-ink-800 hover:bg-forest-50"
    >
      <span className="text-forest-700">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
