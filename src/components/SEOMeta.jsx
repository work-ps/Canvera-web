/**
 * SEOMeta — Per-page meta tag + JSON-LD manager
 * Injects <title>, <meta>, and structured data into <head> via useEffect.
 * No external dependencies — pure DOM manipulation.
 *
 * Usage:
 *   <SEOMeta
 *     title="Page Title | Canvera"
 *     description="..."
 *     canonical="https://canvera.com/page"
 *     og={{ image: '...', type: 'product' }}
 *     schema={[{ '@type': 'Product', ... }]}
 *     breadcrumb={[{ name: 'Home', url: 'https://canvera.com/' }, ...]}
 *   />
 */

import { useEffect } from 'react';

const SITE_NAME   = 'Canvera';
const BASE_URL    = 'https://canvera.com';
const DEFAULT_OG  = `${BASE_URL}/images/og-cover.jpg`;
const SCRIPT_ID   = 'seo-meta-schema';

function setMeta(name, content, attr = 'name') {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function SEOMeta({
  title,
  description,
  canonical,
  keywords,
  noIndex = false,
  og = {},
  schema = [],
  breadcrumb = [],
}) {
  useEffect(() => {
    // ── Title ───────────────────────────────────────────────────────
    if (title) document.title = title;

    // ── Primary meta ────────────────────────────────────────────────
    if (description) setMeta('description', description);
    if (keywords)    setMeta('keywords', keywords);
    if (noIndex)     setMeta('robots', 'noindex, nofollow');

    // ── Canonical ───────────────────────────────────────────────────
    if (canonical) setLink('canonical', canonical);

    // ── Open Graph ──────────────────────────────────────────────────
    const ogTitle = og.title || title || SITE_NAME;
    const ogDesc  = og.description || description || '';
    const ogImg   = og.image || DEFAULT_OG;
    const ogUrl   = og.url || canonical || BASE_URL;
    const ogType  = og.type || 'website';

    setMeta('og:title',       ogTitle,   'property');
    setMeta('og:description', ogDesc,    'property');
    setMeta('og:image',       ogImg,     'property');
    setMeta('og:url',         ogUrl,     'property');
    setMeta('og:type',        ogType,    'property');
    setMeta('og:site_name',   SITE_NAME, 'property');

    // ── Twitter Card ────────────────────────────────────────────────
    setMeta('twitter:title',       ogTitle);
    setMeta('twitter:description', ogDesc);
    setMeta('twitter:image',       ogImg);

    // ── Structured data ─────────────────────────────────────────────
    const allSchemas = [...schema];

    // Auto-inject BreadcrumbList if breadcrumb prop provided
    if (breadcrumb.length > 0) {
      allSchemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      });
    }

    if (allSchemas.length > 0) {
      let scriptEl = document.getElementById(SCRIPT_ID);
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id   = SCRIPT_ID;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(
        allSchemas.length === 1
          ? { '@context': 'https://schema.org', ...allSchemas[0] }
          : { '@context': 'https://schema.org', '@graph': allSchemas }
      );
    }

    // ── Cleanup: restore defaults on unmount ─────────────────────────
    return () => {
      // Remove per-page schema — global schema from index.html remains
      const scriptEl = document.getElementById(SCRIPT_ID);
      if (scriptEl) scriptEl.remove();
      // Reset robots if we set noindex
      if (noIndex) setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, canonical, JSON.stringify(og), JSON.stringify(schema), JSON.stringify(breadcrumb)]);

  return null; // renders nothing into the DOM body
}
