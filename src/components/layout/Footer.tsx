import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { LakheLogo } from '../navigation/LakheLogo';
import { PageContainer } from './PageContainer';
import { config } from '../../lib/config';

export function Footer() {
  return (
    <footer className="bg-forest-900 text-cream-100 print:hidden">
      <PageContainer as="div" className="pt-8 pb-8 sm:pt-10 sm:pb-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-0">
          <div className="col-span-2 lg:col-span-1">
            <LakheLogo size="md" tone="light" />
            <p className="mt-3 text-small text-cream-200/85 max-w-xs leading-relaxed">
              Premium mushroom products and expert training — grown with care,
              sold with honesty.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-body-lg text-cream-50">Explore</h4>
            <ul className="mt-3 space-y-2.5 text-small text-cream-200/85">
              <li>
                <Link to="/products" className="hover:text-cream-50 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-cream-50 transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-cream-50 transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-body-lg text-cream-50">Company</h4>
            <ul className="mt-3 space-y-2.5 text-small text-cream-200/85">
              <li>
                <Link to="/about" className="hover:text-cream-50 transition-colors">
                  About Lakhe
                </Link>
              </li>
              <li>
                <Link to="/founder" className="hover:text-cream-50 transition-colors">
                  The Founder
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cream-50 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-cream-50 transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-serif text-body-lg text-cream-50">Reach us</h4>
            <ul className="mt-3 space-y-2.5 text-small text-cream-200/85">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-cream-300" />
                <span>{config.business.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0 text-cream-300" />
                <a
                  href={`tel:${config.business.phone}`}
                  className="hover:text-cream-50 transition-colors"
                >
                  {config.business.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-cream-300" />
                <a
                  href={`mailto:${config.business.email}`}
                  className="hover:text-cream-50 transition-colors"
                >
                  {config.business.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="h-4 w-4 mt-0.5 shrink-0 text-cream-300" />
                <span>@lakhemushroomfarm</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-8 flex flex-col gap-2 border-t border-cream-200/15 pt-6 text-caption text-cream-200/70 sm:flex-row sm:items-center sm:justify-between"
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
