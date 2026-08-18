type ErrorLike = {
  message?: string;
  msg?: string;
  error_description?: string;
  details?: string;
  hint?: string;
  code?: string;
  error_code?: string;
  status?: number;
  __isAuthError?: boolean;
  originalError?: unknown;
};

const SMTP_SETUP_HINT =
  'Supabase could not send the email. In Supabase → Authentication → SMTP: host smtp.resend.com, port 465, user resend, password = Resend API key, sender no-reply@lakhemushroom.com. Turn OFF “Confirm email” under Sign In / Providers → Email. See supabase/RESEND_OTP_LAKHEMUSHROOM.md.';

const ERROR_CODE_MESSAGES: Record<string, string> = {
  over_email_send_rate_limit:
    'Too many code requests. Wait about a minute, then try again.',
  unexpected_failure: SMTP_SETUP_HINT,
  email_not_confirmed:
    'Please confirm your email first, or turn off "Confirm email" in Supabase Auth settings.',
  invalid_credentials: 'That code did not work. Check the code and try again.',
  otp_expired: 'That code expired. Request a new one.',
  '42P17':
    'Database policy error. Run supabase/patches/fix_profiles_rls_recursion.sql in Supabase SQL Editor, then retry.',
  '42501': 'Permission denied. Sign in again and retry checkout.',
};

function authErrorCode(err: ErrorLike): string | undefined {
  const code = err.code ?? err.error_code;
  if (typeof code === 'string' && code && !/^\d+$/.test(code)) return code;
  if (typeof err.error_code === 'string' && err.error_code) return err.error_code;
  return undefined;
}

function extractRawMessage(err: ErrorLike): string {
  const candidates = [
    err.message,
    err.msg,
    err.error_description,
    err.details,
    err.hint,
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

    const authCode = authErrorCode(e);
    if (authCode && ERROR_CODE_MESSAGES[authCode]) {
      return ERROR_CODE_MESSAGES[authCode];
    }

    const raw = extractRawMessage(e);
    if (raw) return mapAuthMessage(raw);

    if (e.status === 500) {
      return SMTP_SETUP_HINT;
    }

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
    lower.includes('smtp') ||
    lower.includes('unexpected_failure')
  ) {
    return SMTP_SETUP_HINT;
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

  if (lower.includes('infinite recursion')) {
    return 'Database policy error. Run supabase/patches/fix_profiles_rls_recursion.sql in Supabase SQL Editor, then retry.';
  }

  return message;
}
