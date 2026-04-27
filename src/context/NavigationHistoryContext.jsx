/**
 * NavigationHistoryContext
 *
 * Tracks the user's real in-session navigation trail so breadcrumbs reflect
 * actual paths taken (e.g. Home → Collections → Celestial → Luxury Celestial)
 * rather than hardcoded site-map hierarchies.
 *
 * Storage: sessionStorage — per-tab, cleared on tab close, survives reloads.
 *
 * SEO note: the trail drives JSON-LD BreadcrumbList in <Breadcrumb />.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { products, collections } from '../data/products';

/* ─────────────────────────────────────────────────────────────────
   Route → human label map (static routes)
───────────────────────────────────────────────────────────────── */
const STATIC_LABELS = {
  '/':            'Home',
  '/shop':        'Shop',
  '/collections': 'Collections',
  '/finder':      'Find Your Album',
  '/custom':      'Make Your Own',
  '/about':       'About Us',
  '/contact':     'Contact',
  '/faq':         'FAQ & Support',
  '/cart':        'Cart',
  '/checkout':    'Checkout',
  '/profile':     'My Account',
  '/track':       'Track Order',
  '/genuine':     'Check Genuineness',
  '/verify':      'Check Genuineness',
  '/login':       'Log In',
  '/signup':      'Sign Up',
};

/* ─────────────────────────────────────────────────────────────────
   Paths that are transient/utility steps and should NOT appear
   as intermediate ancestors in the breadcrumb trail.
   (They can still appear as the current/last item.)
───────────────────────────────────────────────────────────────── */
const SKIP_AS_ANCESTOR = new Set(['/login', '/signup']);

/* ─────────────────────────────────────────────────────────────────
   Convert a slug to a readable title (fallback only)
   e.g. "luxury-celestial" → "Luxury Celestial"
───────────────────────────────────────────────────────────────── */
function slugToTitle(slug) {
  return slug
    .split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/* ─────────────────────────────────────────────────────────────────
   Resolve a pathname to a human-readable label.
   Priority: navigation state label → data lookup → slug title → STATIC_LABELS
───────────────────────────────────────────────────────────────── */
export function resolveLabel(pathname, stateLabel) {
  // Caller can supply a rich label via location.state.breadcrumbLabel
  if (stateLabel) return stateLabel;

  // Exact static match
  if (STATIC_LABELS[pathname]) return STATIC_LABELS[pathname];

  // Dynamic: /products/:slug → look up product name
  if (pathname.startsWith('/products/')) {
    const slug = pathname.slice('/products/'.length);
    return products.find(p => p.slug === slug)?.name || slugToTitle(slug);
  }

  // Dynamic: /collections/:slug → look up collection name
  if (pathname.startsWith('/collections/')) {
    const slug = pathname.slice('/collections/'.length);
    return collections.find(c => c.slug === slug)?.name || slugToTitle(slug);
  }

  // Dynamic: /order/:slug → product name + context
  if (pathname.startsWith('/order/')) {
    const slug = pathname.slice('/order/'.length);
    const name = products.find(p => p.slug === slug)?.name || slugToTitle(slug);
    return `Order — ${name}`;
  }

  // Fallback: clean up the raw path
  return slugToTitle(pathname.replace(/^\//, '') || 'Page');
}

/* ─────────────────────────────────────────────────────────────────
   sessionStorage helpers
───────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'cnv_nav_trail';
const MAX_DEPTH   = 7;

function trailLoad() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function trailSave(trail) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(trail)); }
  catch { /* quota or private mode — silent */ }
}

/* ─────────────────────────────────────────────────────────────────
   Context
───────────────────────────────────────────────────────────────── */
const NavHistoryCtx = createContext([]);

/** Returns the full recorded trail Array<{ path, label }> */
export function useNavTrail() {
  return useContext(NavHistoryCtx);
}

/**
 * Returns the filtered display trail for breadcrumb rendering.
 * Strips transient utility pages (login, signup) from ancestor positions
 * but always keeps the current (last) entry.
 */
export function useDisplayTrail() {
  const trail = useContext(NavHistoryCtx);
  return trail.filter(
    (entry, i) => i === trail.length - 1 || !SKIP_AS_ANCESTOR.has(entry.path),
  );
}

/* ─────────────────────────────────────────────────────────────────
   Provider — must live inside <BrowserRouter>
───────────────────────────────────────────────────────────────── */
export function NavigationHistoryProvider({ children }) {
  const location = useLocation();

  const [trail, setTrail] = useState(() => {
    // Rehydrate from sessionStorage; if empty, seed with Home
    const stored = trailLoad();
    if (stored && stored.length > 0) return stored;
    return [{ path: '/', label: 'Home' }];
  });

  useEffect(() => {
    const { pathname, state } = location;
    const label = resolveLabel(pathname, state?.breadcrumbLabel ?? null);
    const entry = { path: pathname, label };

    setTrail(prev => {
      // No-op: already on this page
      if (prev.length > 0 && prev[prev.length - 1].path === pathname) return prev;

      let next;
      const existingIdx = prev.findIndex(e => e.path === pathname);

      if (existingIdx !== -1) {
        // User navigated back to a page already in the trail →
        // truncate forward history and refresh the label
        next = [...prev.slice(0, existingIdx), entry];
      } else {
        // New page in the journey → append, cap depth
        next = [...prev, entry].slice(-MAX_DEPTH);
      }

      trailSave(next);
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <NavHistoryCtx.Provider value={trail}>
      {children}
    </NavHistoryCtx.Provider>
  );
}
