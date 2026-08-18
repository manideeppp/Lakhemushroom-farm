/** Must match Supabase Auth → Sign In → Email → Email OTP length (set to 6). */
export const OTP_LENGTH = 6;

export function normalizeOtpCode(input: string): string {
  return input.replace(/\D/g, '');
}

export function isValidOtpFormat(code: string): boolean {
  const clean = normalizeOtpCode(code);
  return clean.length >= OTP_LENGTH && clean.length <= 10;
}

export function isCompleteOtp(code: string): boolean {
  return normalizeOtpCode(code).length === OTP_LENGTH;
}
