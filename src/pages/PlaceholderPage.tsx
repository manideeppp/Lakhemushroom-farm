import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';

export interface PlaceholderPageProps {
  title: string;
  description?: string;
  hideBottomNav?: boolean;
}

/**
 * Placeholder page used by every route during Phase 1.
 * Real screens will replace these in later phases.
 */
export function PlaceholderPage({
  title,
  description,
  hideBottomNav,
}: PlaceholderPageProps) {
  return (
    <AppShell cartCount={0} isLoggedIn={false} hideBottomNav={hideBottomNav}>
      <PageContainer as="main" className="py-10 sm:py-14">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center rounded-2xl border border-ink-100 bg-surface-raised px-6 py-12 shadow-subtle">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-700">
            <Construction className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="font-serif text-display text-ink-900 leading-tight">
            {title}
          </h1>
          <p className="text-body text-ink-600 max-w-md">
            {description ??
              'This page is scaffolded for Phase 1. Content, layout and interactions will be built in a later phase.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Link to="/">
              <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Back to Home
              </Button>
            </Link>
            <Link to="/ui-preview">
              <Button variant="primary">Open UI Preview</Button>
            </Link>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}
