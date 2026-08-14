import { Link } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <AppShell hideBottomNav>
      <PageContainer as="main" className="py-14">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
          <span className="text-hero font-serif text-brand">404</span>
          <h1 className="text-h1 font-serif text-ink-900">
            We couldn’t find that page
          </h1>
          <p className="text-body text-ink-600">
            The link may be broken, or the page may have been moved.
          </p>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </PageContainer>
    </AppShell>
  );
}
