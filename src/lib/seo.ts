export const SITE_URL = 'https://lakhemushroom.com';
export const SITE_NAME = 'Lakhe Mushroom Farm';
export const DEFAULT_DESCRIPTION =
  'Premium oyster mushrooms, spawn, training and farm setup from Lakhe Mushroom Farm — a working farm in Maharashtra serving growers across India.';

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

const ROUTE_SEO: Record<string, PageSeoConfig> = {
  '/': {
    title: 'Lakhe Mushroom Farm | Fresh Mushrooms, Training & Farm Setup',
    description: DEFAULT_DESCRIPTION,
    path: '/',
  },
  '/products': {
    title: 'Mushroom Products | Lakhe Mushroom Farm',
    description:
      'Shop fresh oyster mushrooms, spawn, powders and ready-to-eat packs — farm-grown and carefully packed.',
    path: '/products',
  },
  '/training': {
    title: 'Mushroom Training | Lakhe Mushroom Farm',
    description:
      'Online and offline mushroom cultivation training from a working farm in Maharashtra.',
    path: '/training',
  },
  '/gallery': {
    title: 'Farm Gallery | Lakhe Mushroom Farm',
    description: 'Inside Lakhe Mushroom Farm — growing sheds, harvests and training days.',
    path: '/gallery',
  },
  '/about': {
    title: 'About Us | Lakhe Mushroom Farm',
    description:
      'The story of Lakhe Mushroom Farm — craft, patience and mushrooms that change lives.',
    path: '/about',
  },
  '/founder': {
    title: 'Meet the Founder | Lakhe Mushroom Farm',
    description:
      'The person behind Lakhe — from backyard experiments to training thousands of cultivators.',
    path: '/founder',
  },
  '/consultancy': {
    title: 'Farm Setup & Consultancy | Lakhe Mushroom Farm',
    description:
      'End-to-end mushroom farm design, build and launch support for growers and agri entrepreneurs.',
    path: '/consultancy',
  },
  '/contact': {
    title: 'Contact | Lakhe Mushroom Farm',
    description: 'Questions about products, training or farm setup — reach Lakhe Mushroom Farm.',
    path: '/contact',
  },
  '/login': {
    title: 'Sign In | Lakhe Mushroom Farm',
    description: 'Sign in to Lakhe Mushroom Farm with a secure email code.',
    path: '/login',
    noIndex: true,
  },
  '/cart': {
    title: 'Your Cart | Lakhe Mushroom Farm',
    description: 'Review your Lakhe Mushroom Farm order.',
    path: '/cart',
    noIndex: true,
  },
};

const PRIVATE_PREFIXES = [
  '/admin',
  '/payment',
  '/account',
  '/orders',
  '/ui-preview',
];

export function getSeoForPath(pathname: string): PageSeoConfig {
  if (pathname.startsWith('/products/')) {
    return {
      title: 'Product Details | Lakhe Mushroom Farm',
      description: DEFAULT_DESCRIPTION,
      path: pathname,
    };
  }
  if (pathname.startsWith('/training/')) {
    return {
      title: 'Training Programme | Lakhe Mushroom Farm',
      description:
        'Mushroom training programme details from Lakhe Mushroom Farm.',
      path: pathname,
    };
  }
  if (PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))) {
    return {
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      path: pathname,
      noIndex: true,
    };
  }
  return ROUTE_SEO[pathname] ?? {
    title: 'Page Not Found | Lakhe Mushroom Farm',
    description: DEFAULT_DESCRIPTION,
    path: pathname,
    noIndex: true,
  };
}

export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/lakhe-mark.svg`,
  description: DEFAULT_DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Mundhekarwadi',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  sameAs: [],
};

export const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/lakhe-mark.svg`,
  description: DEFAULT_DESCRIPTION,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: "Lakhe's Hi-Tech Mushroom Project, Mundhekarwadi",
    addressRegion: 'Maharashtra',
    postalCode: '413726',
    addressCountry: 'IN',
  },
};
