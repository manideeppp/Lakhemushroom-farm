import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Mail, ShieldCheck } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
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
      <div
        className="flex min-h-[calc(100dvh-var(--header-h))] items-center justify-center bg-gradient-to-b from-cream-100 via-cream-50 to-surface px-4 py-10 sm:px-6 sm:py-12"
      >
        <div className="w-full max-w-[26rem]">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-small text-ink-500 hover:text-forest-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div
            className="rounded-2xl border border-forest-900/8 bg-surface-raised px-6 py-8 sm:px-8 sm:py-9 shadow-[0_8px_32px_rgba(30,53,32,0.06)]"
          >
            <div className="text-center">
              <LakheLogo size="md" className="mx-auto" />
              <p className="mt-5 text-label uppercase tracking-[0.14em] text-forest-700 font-medium">
                Lakhe Mushroom Farm
              </p>
              <h1 className="mt-2 font-serif text-h1 text-ink-900 leading-tight">
                {step === 'email' ? 'Sign in' : 'Enter your code'}
              </h1>
              <p className="mt-2 text-small text-ink-500 leading-relaxed max-w-xs mx-auto">
                {step === 'email'
                  ? `A ${OTP_LENGTH}-digit code by email — no password needed.`
                  : `Paste the code we sent to ${email}.`}
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

            <p className="mt-6 flex items-center justify-center gap-1.5 text-caption text-ink-400">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-forest-600" />
              Your email is only used to secure your orders.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
