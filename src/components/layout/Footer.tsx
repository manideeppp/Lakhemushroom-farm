import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { LakheLogo } from '../navigation/LakheLogo';
import { PageContainer } from './PageContainer';
import { config } from '../../lib/config';

const exploreLinks = [
  { to: '/products', label: 'Products' },
  { to: '/training', label: 'Training' },
  { to: '/gallery', label: 'Gallery' },
];

const companyLinks = [
  { to: '/about', label: 'About Lakhe' },
  { to: '/founder', label: 'The Founder' },
  { to: '/contact', label: 'Contact' },
  { to: '/account', label: 'My Account' },
];

export function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-100 print:hidden">
      <PageContainer as="div" className="py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <LakheLogo size="md" tone="light" />
            <p className="mt-4 text-small text-cream-200/80 max-w-xs leading-relaxed">
              Premium mushroom products and expert training — grown with care,
              sold with honesty.
            </p>
          </div>

          {/* Explore + Company — side by side on all breakpoints below lg */}
          <div className="grid grid-cols-2 gap-6 md:col-span-2 lg:col-span-2 lg:grid-cols-2 lg:gap-8">
            <div>
              <h4 className="font-serif text-body-lg text-cream-50">Explore</h4>
              <ul className="mt-3 space-y-2.5">
                {exploreLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-small text-cream-200/85 hover:text-cream-50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-body-lg text-cream-50">Company</h4>
              <ul className="mt-3 space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-small text-cream-200/85 hover:text-cream-50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reach us */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="font-serif text-body-lg text-cream-50">Reach us</h4>
            <ul className="mt-3 space-y-3 text-small text-cream-200/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-cream-300/90" />
                <span className="leading-relaxed">{config.business.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-cream-300/90" />
                <a
                  href={`tel:${config.business.phone}`}
                  className="hover:text-cream-50 transition-colors"
                >
                  {config.business.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-cream-300/90" />
                <a
                  href={`mailto:${config.business.email}`}
                  className="hover:text-cream-50 transition-colors"
                >
                  {config.business.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="h-4 w-4 shrink-0 text-cream-300/90" />
                <span>@lakhemushroomfarm</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center gap-2 border-t border-cream-200/12 pt-6 text-center text-caption text-cream-200/65 sm:flex-row sm:justify-between sm:text-left"
        >
          <span>
            © {new Date().getFullYear()} Lakhe Mushroom Farm. All rights reserved.
          </span>
          <span>Handcrafted with care · Made in India</span>
        </div>
      </PageContainer>
    </footer>
  );
}
