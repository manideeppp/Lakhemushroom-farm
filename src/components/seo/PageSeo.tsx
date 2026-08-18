import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getSeoForPath,
  ORGANIZATION_JSON_LD,
  LOCAL_BUSINESS_JSON_LD,
  SITE_NAME,
  SITE_URL,
} from '../../lib/seo';

function upsertMeta(
  attribute: 'name' | 'property',
  key: string,
  content: string
) {
  const selector = `meta[${attribute}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function PageSeo() {
  const { pathname } = useLocation();
  const seo = getSeoForPath(pathname);
  const canonical = `${SITE_URL}${seo.path === '/' ? '' : seo.path}`;
  const ogImage = `${SITE_URL}/lakhe-mark.svg`;

  useEffect(() => {
    document.title = seo.title;
    upsertMeta('name', 'description', seo.description);
    upsertMeta('name', 'robots', seo.noIndex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', 'en_IN');

    upsertMeta('name', 'twitter:card', 'summary');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', ogImage);
  }, [seo.title, seo.description, seo.noIndex, canonical, ogImage]);

  useEffect(() => {
    if (pathname === '/') {
      upsertJsonLd('lakhe-org-jsonld', ORGANIZATION_JSON_LD);
      upsertJsonLd('lakhe-local-jsonld', LOCAL_BUSINESS_JSON_LD);
    } else {
      document.getElementById('lakhe-org-jsonld')?.remove();
      document.getElementById('lakhe-local-jsonld')?.remove();
    }
  }, [pathname]);

  return null;
}
