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
import { LakheLogo } from '../components/navigation/LakheLogo';
import { useAuth, DEMO_OTP } from '../context/AuthContext';
import { useToast } from '../components/feedback/ToastProvider';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  OTP_LENGTH,
  isCompleteOtp,
  isValidOtpFormat,
  normalizeOtpCode,
} from '../lib/auth';
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
        message: isSupabaseConfigured()
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

  function onCodeChange(raw: string) {
    const digits = normalizeOtpCode(raw).slice(0, 10);
    setCode(digits);
    if (isValidOtpFormat(digits) && digits.length >= OTP_LENGTH) {
      void handleVerify(digits);
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
                      : `Paste the ${OTP_LENGTH}-digit code from your email.`}
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
                    <Input
                      label="Verification code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      autoFocus
                      placeholder={`Paste ${OTP_LENGTH}-digit code`}
                      value={code}
                      onChange={(e) => onCodeChange(e.target.value)}
                      onPaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text');
                        onCodeChange(text);
                      }}
                      hint="Copy from email and paste here — verifies automatically."
                      className="text-center font-mono text-lg tracking-[0.35em]"
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

                {!isSupabaseConfigured() && (
                  <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-cream-100 p-3">
                    <Info className="h-4 w-4 mt-0.5 text-clay-500 shrink-0" />
                    <div className="text-caption text-ink-700">
                      <p className="font-medium text-ink-900">Demo mode</p>
                      <p className="mt-1">
                        Use code{' '}
                        <span className="font-mono font-semibold">{DEMO_OTP}</span>
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
