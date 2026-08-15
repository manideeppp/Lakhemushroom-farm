import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Mail, ShieldCheck } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/forms/Input';
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

function LoginBrandMark() {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-forest-900 text-cream-50 shadow-sm"
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor">
          <path d="M8 21c0-4.4 3.6-8 8-8s8 3.6 8 8H8z" />
          <rect x="12" y="21" width="8" height="6" rx="1.5" />
        </svg>
      </span>
      <p className="mt-4 font-serif text-2xl font-semibold uppercase tracking-[0.06em] text-forest-900">
        Lakhe
      </p>
      <p className="mt-1 text-caption font-sans uppercase tracking-[0.28em] text-forest-800">
        Mushroom Farm
      </p>
      <div className="mt-5 h-px w-14 bg-forest-800/70" aria-hidden />
    </div>
  );
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
      <div
        className="flex min-h-[calc(100dvh-var(--header-h))] items-center justify-center bg-surface px-4 py-10 sm:px-6"
      >
        <div className="w-full max-w-[22rem] sm:max-w-[24rem]">
          <Link
            to="/"
            className="mb-5 inline-flex items-center gap-1.5 text-small text-ink-500 hover:text-forest-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div
            className="rounded-2xl border border-ink-100 bg-white px-7 py-9 sm:px-8 sm:py-10 shadow-[0_12px_40px_rgba(30,53,32,0.08)]"
          >
            <LoginBrandMark />

            <div className="mt-6 text-center">
              <h1 className="font-serif text-h1 text-ink-900 leading-tight">
                {step === 'email' ? 'Sign in' : 'Enter your code'}
              </h1>
              <p className="mt-2 text-small text-ink-500 leading-relaxed">
                {step === 'email'
                  ? 'Enter your email to receive a sign in code'
                  : `Paste the ${OTP_LENGTH}-digit code sent to ${email}`}
              </p>
            </div>

            <div className="mt-7">
              {step === 'email' ? (
                <form onSubmit={handleRequest} className="space-y-5">
                  <Input
                    label="Email address"
                    type="email"
                    required
                    autoFocus
                    leftIcon={<Mail className="h-4 w-4" />}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" fullWidth size="lg" loading={sending}>
                    Send code
                  </Button>
                  {sendError && (
                    <p className="text-caption text-danger text-center">
                      {sendError}
                    </p>
                  )}
                </form>
              ) : (
                <div className="space-y-5">
                  <Input
                    label="Verification code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    placeholder={`${OTP_LENGTH}-digit code`}
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value)}
                    onPaste={(e) => {
                      e.preventDefault();
                      onCodeChange(e.clipboardData.getData('text'));
                    }}
                    hint="Paste from email — verifies automatically."
                    className="text-center font-mono text-lg tracking-[0.28em]"
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
                  <div className="flex items-center justify-between text-caption text-ink-500">
                    <button
                      type="button"
                      className="hover:text-forest-800 transition-colors"
                      onClick={() => setStep('email')}
                    >
                      Change email
                    </button>
                    <button
                      type="button"
                      className="hover:text-forest-800 transition-colors disabled:opacity-50"
                      disabled={sending}
                      onClick={() => void handleResend()}
                    >
                      Resend code
                    </button>
                  </div>
                </div>
              )}
            </div>

            {!isSupabaseConfigured() && (
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-clay-200/80 bg-cream-50 px-3.5 py-3">
                <Info className="h-4 w-4 mt-0.5 text-clay-600 shrink-0" />
                <p className="text-caption text-ink-600 leading-relaxed">
                  Demo mode — use code{' '}
                  <span className="font-mono font-semibold text-ink-900">
                    {DEMO_OTP}
                  </span>
                </p>
              </div>
            )}

            <p className="mt-7 flex items-center justify-center gap-1.5 text-caption text-ink-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ink-400" />
              {step === 'email'
                ? 'We never share your email with anyone.'
                : 'Your email is only used to secure your orders.'}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
