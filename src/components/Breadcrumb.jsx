/**
 * Breadcrumb — dynamic, history-aware navigation trail.
 *
 * Visibility rule:
 *   ≤ 3 items  → show all (Home / … / Current)
 *   ≥ 4 items  → show Home + collapsed "…" expander + Previous + Current
 *                clicking the expander reveals the full trail inline
 *
 * By default reads from NavigationHistoryContext which records the user's
 * real in-session navigation path. Static `items` prop is supported as a
 * fallback override for edge cases.
 *
 * Props:
 *   items    Array<{ label, href? }> — optional static override
 *   variant  'default' | 'flush'    — 'flush' removes the bottom border
 *
 * Emits:
 *   JSON-LD <script> with schema.org/BreadcrumbList for SEO.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDisplayTrail } from '../context/NavigationHistoryContext';
import './Breadcrumb.css';

const SITE_ORIGIN = 'https://canvera.com';

export default function Breadcrumb({ items: staticItems, variant = 'default' }) {
  const location  = useLocation();
  const dynTrail  = useDisplayTrail();
  const [expanded, setExpanded] = useState(false);

  /* ── Build the item list ─────────────────────────────────────── */
  const items = staticItems
    ? staticItems
    : dynTrail.map((entry, i, arr) => ({
        label: entry.label,
        href: i < arr.length - 1 ? entry.path : undefined,
      }));

  if (!items || items.length === 0) return null;

  /* ── Collapse logic ──────────────────────────────────────────── */
  // When 4+ crumbs, collapse middle items into an expandable "…" button.
  // Visible: [0] Home · … · [n-2] Previous · [n-1] Current
  const shouldCollapse = items.length >= 4 && !expanded;
  const collapsedCount = items.length - 3; // how many are hidden

  /* ── JSON-LD BreadcrumbList for SEO ─────────────────────────── */
  const jsonLd = JSON.stringify({
    '@context':       'https://schema.org',
    '@type':          'BreadcrumbList',
    itemListElement:  items.map((item, i) => ({
      '@type':    'ListItem',
      position:   i + 1,
      name:       item.label,
      ...(item.href
        ? { item: `${SITE_ORIGIN}${item.href}` }
        : { item: `${SITE_ORIGIN}${location.pathname}` }),
    })),
  });

  /* ── Render helpers ──────────────────────────────────────────── */
  function CrumbLink({ item }) {
    if (!item.href) {
      return (
        <span className="breadcrumb__current" aria-current="page">
          {item.label}
        </span>
      );
    }
    return (
      <Link to={item.href} className="breadcrumb__link">
        {item.label}
      </Link>
    );
  }

  function Separator() {
    return <span className="breadcrumb__sep" aria-hidden="true">/</span>;
  }

  /* ── Collapsed view: Home · [expander] · Previous · Current ─── */
  function CollapsedCrumbs() {
    const first    = items[0];
    const previous = items[items.length - 2];
    const current  = items[items.length - 1];

    return (
      <>
        {/* Home */}
        <li className="breadcrumb__item">
          <CrumbLink item={first} />
        </li>

        {/* Expander */}
        <li className="breadcrumb__item breadcrumb__item--expander">
          <Separator />
          <button
            className="breadcrumb__expander"
            onClick={() => setExpanded(true)}
            aria-label={`Show ${collapsedCount} hidden steps`}
            title="Show full path"
          >
            ···
          </button>
        </li>

        {/* Previous */}
        <li className="breadcrumb__item">
          <Separator />
          <CrumbLink item={previous} />
        </li>

        {/* Current */}
        <li className="breadcrumb__item">
          <Separator />
          <span className="breadcrumb__current" aria-current="page">
            {current.label}
          </span>
        </li>
      </>
    );
  }

  /* ── Expanded / normal view: all crumbs ──────────────────────── */
  function AllCrumbs() {
    return (
      <>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="breadcrumb__item">
              {i > 0 && <Separator />}
              {isLast || !item.href ? (
                <span
                  className="breadcrumb__current"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="breadcrumb__link">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </>
    );
  }

  return (
    <>
      {/* Structured data — crawled by Google even in client-rendered apps */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <nav
        className={`breadcrumb breadcrumb--${variant}`}
        aria-label="Breadcrumb"
      >
        <ol className="breadcrumb__list">
          {shouldCollapse ? <CollapsedCrumbs /> : <AllCrumbs />}
        </ol>
      </nav>
    </>
  );
}
