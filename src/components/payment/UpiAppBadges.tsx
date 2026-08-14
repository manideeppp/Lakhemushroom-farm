import type { ReactNode } from 'react';
export function UpiAppBadges({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="text-caption text-ink-500 mb-2 text-center sm:text-left">
        Pay with any UPI app
      </p>
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <UpiBadge label="Google Pay" bg="#FFFFFF" border>
          <GooglePayIcon />
        </UpiBadge>
        <UpiBadge label="PhonePe" bg="#5F259F">
          <PhonePeIcon />
        </UpiBadge>
        <UpiBadge label="Paytm" bg="#00BAF2">
          <PaytmIcon />
        </UpiBadge>
        <UpiBadge label="BHIM UPI" bg="#008C44">
          <BhimIcon />
        </UpiBadge>
      </div>
    </div>
  );
}

function UpiBadge({
  label,
  bg,
  border,
  children,
}: {
  label: string;
  bg: string;
  border?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 shadow-sm"
      style={{
        backgroundColor: bg,
        border: border ? '1px solid #e5e7eb' : undefined,
      }}
      title={label}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        {children}
      </span>
      <span
        className="text-[11px] font-semibold leading-none"
        style={{
          color: border ? '#1f2937' : '#ffffff',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function GooglePayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M12 10.2v3.6h5.1c-.2 1.2-1.6 3.5-5.1 3.5-3.1 0-5.6-2.5-5.6-5.6s2.5-5.6 5.6-5.6c1.8 0 3 .8 3.7 1.5l2.8-2.7C16.9 3.2 14.6 2.2 12 2.2 6.9 2.2 2.4 6.7 2.4 12s4.5 9.8 9.6 9.8c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

function PhonePeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.95" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fill="#5F259F"
        fontSize="9"
        fontWeight="700"
        fontFamily="Arial,sans-serif"
      >
        Pe
      </text>
    </svg>
  );
}

function PaytmIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" fill="#fff" fillOpacity="0.95" />
      <text
        x="12"
        y="14"
        textAnchor="middle"
        fill="#002E6E"
        fontSize="7"
        fontWeight="700"
        fontFamily="Arial,sans-serif"
      >
        Paytm
      </text>
    </svg>
  );
}

function BhimIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="#fff" fillOpacity="0.2" />
      <text
        x="12"
        y="14"
        textAnchor="middle"
        fill="#fff"
        fontSize="7"
        fontWeight="700"
        fontFamily="Arial,sans-serif"
      >
        BHIM
      </text>
    </svg>
  );
}
