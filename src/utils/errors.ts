type ErrorLike = {
  message?: string;
  msg?: string;
  error_description?: string;
  code?: string;
  error_code?: string;
  status?: number;
  __isAuthError?: boolean;
  originalError?: unknown;
};

const ERROR_CODE_MESSAGES: Record<string, string> = {
  over_email_send_rate_limit:
    'Too many code requests. Wait about a minute, then try again.',
  unexpected_failure:
    'Could not send the sign-in email. Check Supabase SMTP: sender must be onboarding@resend.dev (testing) or a verified domain. On Resend’s free tier you can only send to your Resend account email until you verify a domain.',
  email_not_confirmed:
    'Please confirm your email first, or turn off "Confirm email" in Supabase Auth settings.',
  invalid_credentials: 'That code did not work. Check the code and try again.',
  otp_expired: 'That code expired. Request a new one.',
};

function extractRawMessage(err: ErrorLike): string {
  const candidates = [
    err.message,
    err.msg,
    err.error_description,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim() && c.trim() !== '{}' && c.trim() !== '[object Object]') {
      return c.trim();
    }
  }
  return '';
}

/** Readable message from unknown errors (Supabase Auth, fetch, etc.). */
export function getErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (typeof err === 'string' && err.trim()) return mapAuthMessage(err.trim());

  if (err && typeof err === 'object') {
    const e = err as ErrorLike;

    const code = e.code ?? e.error_code;
    if (code && ERROR_CODE_MESSAGES[code]) {
      return ERROR_CODE_MESSAGES[code];
    }

    const raw = extractRawMessage(e);
    if (raw) return mapAuthMessage(raw);

    if (e.originalError) {
      const nested = getErrorMessage(e.originalError, '');
      if (nested) return nested;
    }
  }

  if (err instanceof Error) {
    const raw = extractRawMessage(err as ErrorLike);
    if (raw) return mapAuthMessage(raw);
  }

  return fallback;
}

function mapAuthMessage(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes('magic link email') ||
    lower.includes('confirmation email') ||
    lower.includes('error sending') ||
    lower.includes('smtp')
  ) {
    return 'Could not send the sign-in email. Check Supabase SMTP sender (onboarding@resend.dev for testing). On Resend’s free tier, emails only go to your Resend account address until you verify a domain.';
  }

  if (lower.includes('rate limit') || lower.includes('too many') || lower.includes('only request this after')) {
    return 'Too many code requests. Wait about a minute, then try again.';
  }

  if (lower.includes('invalid login credentials') || lower.includes('otp')) {
    return 'That code did not work. Check the code and try again.';
  }

  if (lower.includes('row-level security') || lower.includes('violates row-level')) {
    return 'Could not save your order. Sign in again and retry, or contact support.';
  }

  if (lower.includes('bucket') || lower.includes('storage')) {
    return 'Could not upload payment screenshot. Run supabase/setup_all.sql to create the payment-screenshots bucket.';
  }

  if (lower.includes('invalid input syntax for type uuid')) {
    return 'Cart item mismatch — clear your cart, refresh the page, and add items again.';
  }

  return message;
}
