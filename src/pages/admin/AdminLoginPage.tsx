import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { PageContainer } from '../../components/layout/PageContainer';
import { Section } from '../../components/layout/Section';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/forms/Input';
import { LakheLogo } from '../../components/navigation/LakheLogo';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../components/feedback/ToastProvider';

interface LocState {
  redirectTo?: string;
}

export function AdminLoginPage() {
  const { isAdmin, loading, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocState | null) ?? {};
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate(state.redirectTo ?? '/admin', { replace: true });
    }
  }, [loading, isAdmin, navigate, state.redirectTo]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) {
      toast({ tone: 'warning', message: 'Enter the admin password.' });
      return;
    }
    try {
      setSubmitting(true);
      await signIn(password);
      toast({ tone: 'success', message: 'Welcome to the admin portal.' });
      navigate(state.redirectTo ?? '/admin', { replace: true });
    } catch (err) {
      toast({
        tone: 'danger',
        title: 'Access denied',
        message: err instanceof Error ? err.message : 'Incorrect password.',
      });
      setPassword('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell hideBottomNav hideFooter>
      <PageContainer>
        <Section size="sm">
          <div className="mx-auto max-w-md">
            <Link
              to="/"
              className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>

            <Card padding="lg" elevated className="space-y-5">
              <div className="flex flex-col items-center text-center gap-2">
                <LakheLogo size="lg" />
                <Badge variant="premium" className="w-fit">
                  <ShieldCheck className="h-3 w-3" /> Admin Portal
                </Badge>
                <h1 className="font-serif text-h1 text-ink-900 leading-tight">
                  Sign in to admin
                </h1>
                <p className="text-small text-ink-600 max-w-xs">
                  Enter the admin password. For order approval, sign in on the
                  main site with your admin email first.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  label="Admin password"
                  type={show ? 'text' : 'password'}
                  required
                  autoFocus
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label={show ? 'Hide password' : 'Show password'}
                      className="text-ink-500 hover:text-ink-800"
                    >
                      {show ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={submitting}
                >
                  Enter admin portal
                </Button>
              </form>

              <div className="flex items-center justify-center gap-2 text-caption text-ink-500">
                <ShieldCheck className="h-4 w-4 text-forest-600" />
                Sessions expire after 8 hours of inactivity.
              </div>
            </Card>
          </div>
        </Section>
      </PageContainer>
    </AppShell>
  );
}
