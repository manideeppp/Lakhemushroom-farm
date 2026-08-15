import { Headphones, Leaf, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PaymentTrustFeatures({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4 border-t border-ink-100 pt-8',
        className
      )}
    >
      <div className="text-center sm:text-left">
        <ShieldCheck className="mx-auto sm:mx-0 h-5 w-5 text-forest-700" />
        <p className="mt-2 font-serif text-body font-medium text-ink-900">
          Secure payment
        </p>
        <p className="mt-0.5 text-caption text-ink-500">
          Your payment is safe with us.
        </p>
      </div>
      <div className="text-center sm:text-left">
        <Leaf className="mx-auto sm:mx-0 h-5 w-5 text-forest-700" />
        <p className="mt-2 font-serif text-body font-medium text-ink-900">
          Quality assured
        </p>
        <p className="mt-0.5 text-caption text-ink-500">
          Fresh, healthy & naturally grown.
        </p>
      </div>
      <div className="text-center sm:text-left">
        <Headphones className="mx-auto sm:mx-0 h-5 w-5 text-forest-700" />
        <p className="mt-2 font-serif text-body font-medium text-ink-900">
          Need help?
        </p>
        <p className="mt-0.5 text-caption text-ink-500">
          We&apos;re here for you.
        </p>
      </div>
    </div>
  );
}
