import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageContainer } from '../components/layout/PageContainer';
import { Section } from '../components/layout/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
import { OTPInput } from '../components/forms/OTPInput';
import { LakheLogo } from '../components/navigation/LakheLogo';
import { useAuth, DEMO_OTP } from '../context/AuthContext';
import { useToast } from '../components/feedback/ToastProvider';
import { isSupabaseConfigured } from '../lib/supabase';
import { OTP_LENGTH, isCompleteOtp } from '../lib/auth';
import { getErrorMessage } from '../utils/errors';

interface LocState {
  redirectTo?: string;
}

export function LoginPage() {
  const {
    user,
    pendingEmail,
    requestOtp,
    verifyOtp,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocState | null) ?? {};
  const { toast } = useToast();
  const [email, setEmail] = useState(pendingEmail ?? '');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>(
    pendingEmail ? 'otp' : 'email'
  );
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(state.redirectTo ?? '/account', { replace: true });
    }
  }, [authLoading, user, navigate, state.redirectTo]);

  async function sendCode(): Promise<boolean> {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ tone: 'warning', message: 'Enter a valid email address.' });
      return false;
    }
    try {
      setSending(true);
      setSendError(null);
      await requestOtp(email);
      toast({
        tone: 'success',
        title: 'Code sent',
        message: isSupabaseConfigured
          ? `Check ${email} for your ${OTP_LENGTH}-digit code.`
          : `Demo mode: use ${DEMO_OTP} (or any ${OTP_LENGTH} digits).`,
      });
      return true;
    } catch (err) {
      const message = getErrorMessage(err, 'Could not send code. Try again.');
      setSendError(message);
      toast({
        tone: 'danger',
        title: 'Could not send code',
        message,
      });
      return false;
    } finally {
      setSending(false);
    }
  }

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    const ok = await sendCode();
    if (ok) setStep('otp');
  }

  async function handleResend() {
    setCode('');
    await sendCode();
  }

  async function handleVerify(finalCode: string) {
    try {
      setVerifying(true);
      await verifyOtp(email, finalCode);
      toast({ tone: 'success', message: 'Welcome!' });
      navigate(state.redirectTo ?? '/account', { replace: true });
    } catch (err) {
      toast({
        tone: 'danger',
        title: 'Invalid code',
        message: getErrorMessage(err, 'That code did not work. Try again.'),
      });
      setCode('');
    } finally {
      setVerifying(false);
    }
  }

  return (
    <AppShell hideBottomNav hideFooter>
      <div className="relative min-h-[70vh] bg-gradient-to-b from-cream-100 via-surface to-surface">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_top,_rgba(45,90,61,0.12),_transparent_70%)]"
          aria-hidden
        />
        <PageContainer>
          <Section size="sm">
            <div className="mx-auto max-w-md">
              <Link
                to="/"
                className="mb-4 inline-flex items-center gap-1 text-small text-ink-600 hover:text-forest-800"
              >
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>

              <Card
                padding="lg"
                elevated
                className="space-y-5 border-ink-100/80 shadow-card ring-1 ring-ink-100/60"
              >
              <div className="flex flex-col items-center text-center gap-2">
                <LakheLogo size="lg" />
                <Badge variant="natural" className="w-fit">
                  <Sparkles className="h-3 w-3" /> Sign in
                </Badge>
                <h1 className="font-serif text-h1 text-ink-900 leading-tight">
                  {step === 'email' ? 'Sign in to Lakhe' : 'Enter your code'}
                </h1>
                <p className="text-small text-ink-600 max-w-xs">
                  {step === 'email'
                    ? `We send a ${OTP_LENGTH}-digit code to your email — no password needed.`
                    : `We sent a ${OTP_LENGTH}-digit code to ${email}.`}
                </p>
              </div>

              {step === 'email' ? (
                <form onSubmit={handleRequest} className="space-y-3">
                  <Input
                    label="Email"
                    type="email"
                    required
                    autoFocus
                    leftIcon={<Mail className="h-4 w-4" />}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={sending}
                  >
                    Send code
                  </Button>
                  {sendError && (
                    <p className="text-caption text-danger leading-relaxed">
                      {sendError}
                    </p>
                  )}
                </form>
              ) : (
                <div className="space-y-3">
                  <OTPInput
                    autoFocus
                    length={OTP_LENGTH}
                    value={code}
                    onChange={setCode}
                    onComplete={handleVerify}
                  />
                  <Button
                    fullWidth
                    size="lg"
                    loading={verifying}
                    disabled={!isCompleteOtp(code)}
                    onClick={() => handleVerify(code)}
                  >
                    Verify & continue
                  </Button>
                  <div className="flex items-center justify-between text-caption">
                    <button
                      type="button"
                      className="text-forest-800 hover:underline"
                      onClick={() => setStep('email')}
                    >
                      Change email
                    </button>
                    <button
                      type="button"
                      className="text-forest-800 hover:underline disabled:opacity-60"
                      disabled={sending}
                      onClick={() => void handleResend()}
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              )}

              {!isSupabaseConfigured && (
                <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-cream-100 p-3">
                  <Info className="h-4 w-4 mt-0.5 text-clay-500 shrink-0" />
                  <div className="text-caption text-ink-700">
                    <p className="font-medium text-ink-900">Demo mode — no real email</p>
                    <p className="mt-1">
                      Supabase is not connected on this deploy. Copy the same values
                      from your local <span className="font-mono">.env.local</span> into
                      Vercel → Project → Settings → Environment Variables:
                    </p>
                    <ul className="mt-2 list-disc pl-4 space-y-0.5 font-mono text-ink-800">
                      <li>VITE_SUPABASE_URL</li>
                      <li>VITE_SUPABASE_ANON_KEY</li>
                    </ul>
                    <p className="mt-2">
                      Enable for <strong>Production</strong>, then{' '}
                      <strong>Redeploy</strong> (Vite only reads env vars at build
                      time — adding them without redeploying keeps demo mode).
                    </p>
                    <p className="mt-2">
                      For testing now, use code{' '}
                      <span className="font-mono font-semibold">{DEMO_OTP}</span> (or any
                      6–10 digits).
                    </p>
                  </div>
                </div>
              )}

              {isSupabaseConfigured && step === 'otp' && (
                <div className="flex items-start gap-2 rounded-md bg-cream-100 border border-cream-200 p-3">
                  <Info className="h-4 w-4 mt-0.5 text-clay-500 shrink-0" />
                  <div className="text-caption text-ink-700 space-y-2">
                    <p className="font-medium text-ink-900">No code in your inbox?</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Check spam / promotions for &quot;Your Lakhe sign-in code&quot;.</li>
                      <li>
                        In Supabase → <strong>Authentication → Email Templates</strong>, put{' '}
                        <span className="font-mono">{'{{ .Token }}'}</span> in both{' '}
                        <strong>Magic Link</strong> and <strong>Confirm signup</strong> templates.
                      </li>
                      <li>
                        Turn <strong>Confirm email</strong> OFF under Authentication →
                        Sign In / Providers → Email.
                      </li>
                      <li>
                        Set up custom SMTP (Resend): Supabase → Project Settings →
                        Authentication → SMTP. Default Supabase mail is only ~3 emails/hour.
                      </li>
                      <li>
                        On Resend&apos;s free tier, mail only goes to your Resend account email
                        until you verify a domain.
                      </li>
                      <li>
                        Add your site URL in Supabase → Authentication → URL Configuration
                        (Site URL + Redirect URLs).
                      </li>
                    </ul>
                    <p>
                      Still stuck? Open Supabase → <strong>Logs → Auth</strong> after clicking
                      Send code — errors there show the exact SMTP/template problem.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-caption text-ink-500">
                <ShieldCheck className="h-4 w-4 text-forest-600" />
                We only use your email to keep your orders safe.
              </div>
            </Card>
          </div>
        </Section>
      </PageContainer>
      </div>
    </AppShell>
  );
}
