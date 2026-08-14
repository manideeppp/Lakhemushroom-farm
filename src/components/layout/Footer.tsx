import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { LakheLogo } from '../navigation/LakheLogo';
import { PageContainer } from './PageContainer';
import { config } from '../../lib/config';

export function Footer() {
  return (
    <footer className="mt-16 bg-forest-900 text-cream-100 print:hidden">
      <PageContainer as="div" className="py-10 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <LakheLogo size="md" tone="light" />
            <p className="mt-4 text-small text-cream-200/85 max-w-xs leading-relaxed">
              Premium mushroom products, expert training, and end-to-end farm
              setup consultancy — grown with care, sold with honesty.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-body-lg text-cream-50">Explore</h4>
            <ul className="mt-3 space-y-2 text-small text-cream-200/85">
              <li><Link to="/products" className="hover:text-cream-50">Products</Link></li>
              <li><Link to="/training" className="hover:text-cream-50">Training</Link></li>
              <li><Link to="/consultancy" className="hover:text-cream-50">Farm Setup</Link></li>
              <li><Link to="/gallery" className="hover:text-cream-50">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-body-lg text-cream-50">Company</h4>
            <ul className="mt-3 space-y-2 text-small text-cream-200/85">
              <li><Link to="/about" className="hover:text-cream-50">About Lakhe</Link></li>
              <li><Link to="/founder" className="hover:text-cream-50">The Founder</Link></li>
              <li><Link to="/contact" className="hover:text-cream-50">Contact</Link></li>
              <li><Link to="/account" className="hover:text-cream-50">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-body-lg text-cream-50">Reach us</h4>
            <ul className="mt-3 space-y-2 text-small text-cream-200/85">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{config.business.address}</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <a href={`tel:${config.business.phone}`} className="hover:text-cream-50">
                  {config.business.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <a href={`mailto:${config.business.email}`} className="hover:text-cream-50">
                  {config.business.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="h-4 w-4 mt-0.5 shrink-0" />
                <span>@lakhemushroomfarm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-cream-200/10 pt-5 text-caption text-cream-200/70 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Lakhe Mushroom Farm. All rights reserved.
          </span>
          <span>Handcrafted with care · Made in India</span>
        </div>
      </PageContainer>
    </footer>
  );
}
