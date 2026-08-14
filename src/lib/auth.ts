/** Default Supabase email OTP length (Auth → Sign In → Email). */
export const OTP_LENGTH = 6;

export function normalizeOtpCode(input: string): string {
  return input.replace(/\D/g, '');
}

export function isValidOtpFormat(code: string): boolean {
  const clean = normalizeOtpCode(code);
  // Loose range so a future dashboard change doesn't brick the client.
  return clean.length >= 6 && clean.length <= 10;
}

export function isCompleteOtp(code: string): boolean {
  return isValidOtpFormat(code);
}
