import { MapPin, Navigation } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { config } from '../../lib/config';

export function FarmLocationSection({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'grid gap-4'
          : 'grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-stretch'
      }
    >
      <Card padding="lg" className="flex flex-col justify-center">
        <p className="text-label uppercase tracking-widest text-forest-700 font-medium">
          Visit us
        </p>
        <h2
          className={`mt-2 font-serif text-ink-900 leading-tight ${
            compact ? 'text-h2' : 'text-h1'
          }`}
        >
          Lakhe Mushroom Farm
        </h2>
        <p className="mt-3 flex items-start gap-2 text-body text-ink-700 leading-relaxed">
          <MapPin className="h-5 w-5 shrink-0 text-forest-700 mt-0.5" aria-hidden />
          <span>{config.business.address}</span>
        </p>
        <ul className="mt-4 space-y-2 text-small text-ink-600">
          {config.business.branches.map((b) => (
            <li key={b.label}>
              <span className="font-medium text-ink-800">{b.label}:</span>{' '}
              {b.address}
            </li>
          ))}
        </ul>
        <a
          href={config.business.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block"
        >
          <Button
            variant="outline"
            leftIcon={<Navigation className="h-4 w-4" />}
          >
            Open in Google Maps
          </Button>
        </a>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <iframe
          title="Lakhe Mushroom Farm location"
          src={config.business.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block h-[min(420px,55vh)] w-full min-h-[280px] border-0"
        />
      </Card>
    </div>
  );
}
