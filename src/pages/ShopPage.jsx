import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { products, collections } from '../data/products';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import SEOMeta from '../components/SEOMeta';
import './ShopPage.css';

/* ── Category URL aliases (slug → catalogue label) ─────────────── */
const CATEGORY_ALIASES = {
  'premium-photobooks':  'Premium Photobooks',
  'standard-photobooks': 'Standard Photobooks',
  // legacy aliases
  'photobooks':          'Premium Photobooks',   // old links → nearest new category
  'premium-albums':      'Premium Photobooks',
  'standard-albums':     'Standard Photobooks',
  'moment-books':        'Momentbooks',
  'momentbooks':         'Momentbooks',
  'superbooks':          'Superbooks',
  'magazines':                  'Premium Magazine Books',
  'premium-magazine-books':     'Premium Magazine Books',
  'wall-decor':          'Decor Products',
  'canvas-frames':       'Decor Products',
  'gifting-packages':    'Gifting Kit',
  'gifting-kit':         'Gifting Kit',
  'decor':               'Decor Products',
  'decor-products':      'Decor Products',
};

/* ── Sort options ───────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: 'relevance',    label: 'Relevance'          },
  { value: 'newest',       label: 'Newest'             },
  { value: 'best-selling', label: 'Best Selling'       },
  { value: 'better-deal',  label: 'Better Deal'        },
  { value: 'price-low',    label: 'Price: Low → High'  },
  { value: 'price-high',   label: 'Price: High → Low'  },
];

/* ── Badge quick-filter pills (toolbar) ────────────────────────── */
const BADGE_PILLS = [
  { value: null,         label: 'All'         },
  { value: 'bestseller', label: 'Bestsellers' },
  { value: 'new',        label: 'New'         },
  { value: 'popular',    label: 'Popular'     },
  { value: 'limited',    label: 'Limited'     },
];

/* ── Derive ordered filter options from products ──────────────── */
function deriveOrderedOptions(orderedKeys, getter) {
  const counts = new Map();
  products.forEach(p => {
    const vals = getter(p);
    (Array.isArray(vals) ? vals : vals ? [vals] : [])
      .forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
  });
  return orderedKeys
    .filter(k => counts.has(k))
    .map(k => ({ value: k, count: counts.get(k) }));
}

/* ── Categories — matches the Shop dropdown in the Header exactly ── */
const HEADER_CATEGORY_ORDER = [
  'Premium Photobooks', 'Standard Photobooks',
  'Momentbooks', 'Superbooks', 'Premium Magazine Books', 'Decor Products', 'Gifting Kit',
];
const _catCounts = {};
products.forEach(p => { _catCounts[p.category] = (_catCounts[p.category] || 0) + 1; });
// All header categories always shown — count of 0 means "coming soon"
const CAT_OPTIONS = HEADER_CATEGORY_ORDER
  .map(v => ({ value: v, count: _catCounts[v] || 0 }));

/* ── Occasions — same order as the home page OccasionsSection ────── */
const OCC_ORDER = [
  'Weddings', 'Pre-Wedding', 'Maternity', 'Baby & Kids',
  'Birthdays', 'Corporate', 'Portraits & Family',
];
const OCC_OPTIONS = deriveOrderedOptions(OCC_ORDER, p => p.occasions);

/* ── Collections — matches the Collections dropdown in the Header ── */
const COL_OPTIONS = collections
  .map(c => ({ value: c.name, count: products.filter(p => p.collection === c.name).length }))
  .filter(o => o.count > 0);   // preserve header order, hide empties

/* ── Print Type — always show all 3; count shows how many products ── */
const PRINT_TYPE_OPTIONS = [
  { value: 'Indi Pro', count: products.filter(p => p.printType === 'Indi Pro').length },
  { value: 'SH Pro',   count: products.filter(p => p.printType === 'SH Pro').length   },
  { value: 'Ink Jet',  count: products.filter(p => p.printType === 'Ink Jet').length  },
];

/* ── Section definitions — 4 sections, all checkbox ────────────── */
const SECTIONS = [
  { id: 'categories',  label: 'Products',    options: CAT_OPTIONS,         control: 'checkbox' },
  { id: 'occasions',   label: 'Occasions',   options: OCC_OPTIONS,         control: 'checkbox' },
  { id: 'collections', label: 'Collections', options: COL_OPTIONS,         control: 'checkbox' },
  { id: 'printTypes',  label: 'Print Type',  options: PRINT_TYPE_OPTIONS,  control: 'checkbox' },
];

/* ── Empty filter state ────────────────────────────────────────── */
const EMPTY_FILTERS = {
  categories: [], occasions: [], collections: [], printTypes: [],
};

/* ─────────────────────────────────────────────────────────────────
   ChevronIcon
───────────────────────────────────────────────────────────────── */
function ChevronIcon({ open }) {
  return (
    <svg
      className={`shop-fs__chevron${open ? ' shop-fs__chevron--open' : ''}`}
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FilterSection — controlled collapsible block.
   open / onOpen are driven by FilterPanel (accordion).
───────────────────────────────────────────────────────────────── */
function FilterSection({ section, values, open, onOpen, onToggle }) {
  return (
    <div className="shop-fs">
      {/* Header button */}
      <button className="shop-fs__head" onClick={onOpen}>
        <span className="shop-fs__label">
          {section.label}
          {values.length > 0 && (
            <span className="shop-fs__badge">{values.length}</span>
          )}
        </span>
        <ChevronIcon open={open} />
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="shop-fs__body-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="shop-fs__body">

              {/* Checkbox list */}
              {section.control === 'checkbox' && section.options.map(opt => {
                const checked = values.includes(opt.value);
                const isEmpty  = opt.count === 0;
                return (
                  <label
                    key={opt.value}
                    className={`shop-fs__row${checked ? ' shop-fs__row--active' : ''}${isEmpty ? ' shop-fs__row--empty' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="shop-fs__checkbox"
                      checked={checked}
                      onChange={() => onToggle(section.id, opt.value)}
                    />
                    <span className="shop-fs__row-label">{opt.value}</span>
                    {opt.count > 0 && (
                      <span className="shop-fs__row-count">{opt.count}</span>
                    )}
                  </label>
                );
              })}

              {/* Pill toggles */}
              {section.control === 'pill' && (
                <div className="shop-fs__pill-wrap">
                  {section.options.map(opt => {
                    const active = values.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        className={`shop-fs__pill${active ? ' shop-fs__pill--active' : ''}`}
                        onClick={() => onToggle(section.id, opt.value)}
                      >
                        {opt.value}
                      </button>
                    );
                  })}
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FilterPanel — accordion: only one section open at a time.
   Reused verbatim in desktop sidebar AND mobile drawer.
───────────────────────────────────────────────────────────────── */
function FilterPanel({ filters, onToggle, totalActive }) {
  // Accordion: track which section id is open (null = all closed)
  const [openId, setOpenId] = useState('categories');

  const handleOpen = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <div className="shop-fpanel">
      <div className="shop-fpanel__head">
        <span className="shop-fpanel__title">Filters</span>
        {totalActive > 0 && (
          <button className="shop-fpanel__clear" onClick={() => onToggle('clear-all')}>
            Clear all
          </button>
        )}
      </div>
      {SECTIONS.map(section => (
        <FilterSection
          key={section.id}
          section={section}
          values={filters[section.id]}
          open={openId === section.id}
          onOpen={() => handleOpen(section.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────── */
export default function ShopPage() {
  const [searchParams] = useSearchParams();

  /* ── Seed categories from URL ?category= param ──────────────── */
  const [filters, setFilters] = useState(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const resolved = CATEGORY_ALIASES[cat.toLowerCase()] ?? cat;
      const match = HEADER_CATEGORY_ORDER.find(
        c => c.toLowerCase() === resolved.toLowerCase()
      );
      if (match) return { ...EMPTY_FILTERS, categories: [match] };
    }
    return { ...EMPTY_FILTERS };
  });

  /* ── Badge URL param (spec §6.3) — no UI, orthogonal to filters */
  const badgeParam = searchParams.get('badge') || null;

  const [activeBadge, setActiveBadge] = useState(null);
  const [sortBy,      setSortBy]      = useState('relevance');
  const [mobileOpen,  setMobileOpen]  = useState(false);

  /* ── Single toggle handler (spec §3.2) ──────────────────────── */
  const handleToggle = (dimension, value) => {
    if (dimension === 'clear-all') { setFilters(EMPTY_FILTERS); return; }
    setFilters(prev => {
      const cur = prev[dimension];
      return {
        ...prev,
        [dimension]: cur.includes(value)
          ? cur.filter(v => v !== value)
          : [...cur, value],
      };
    });
  };

  /* ── Aggregated active count ─────────────────────────────────── */
  const totalActive = useMemo(
    () => Object.values(filters).reduce((n, arr) => n + arr.length, 0),
    [filters],
  );

  /* ── Active chip list (spec §8) ─────────────────────────────── */
  const activeChips = useMemo(
    () => SECTIONS.flatMap(s =>
      filters[s.id].map(v => ({ dimension: s.id, value: v }))
    ),
    [filters],
  );

  /* ── Filtered + sorted ───────────────────────────────────────── */
  const filtered = useMemo(() => {
    let r = [...products];

    if (filters.categories.length)
      r = r.filter(p => filters.categories.includes(p.category));
    if (filters.occasions.length)
      r = r.filter(p => p.occasions?.some(o => filters.occasions.includes(o)));
    if (filters.collections.length)
      r = r.filter(p => filters.collections.includes(p.collection));
    if (filters.printTypes.length)
      r = r.filter(p => filters.printTypes.includes(p.printType));

    const effectiveBadge = activeBadge ?? badgeParam;
    if (effectiveBadge) r = r.filter(p => p.badge === effectiveBadge);

    switch (sortBy) {
      case 'price-low':    return [...r].sort((a, b) => a.price.base - b.price.base);
      case 'price-high':   return [...r].sort((a, b) => b.price.base - a.price.base);
      case 'newest':       return [...r].sort((a, b) => b.id - a.id);
      case 'best-selling': return [...r].sort((a, b) => b.reviewCount - a.reviewCount);
      case 'better-deal':  return [...r].sort((a, b) =>
        (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
      default: return r;
    }
  }, [filters, activeBadge, badgeParam, sortBy]);

  /* ── ItemList schema for top-rated products ─────────────────── */
  const shopSchema = {
    '@type': 'ItemList',
    name: 'Canvera Premium Photobooks & Wedding Albums',
    description: "India's leading premium photobook and wedding album collection for professional photographers.",
    url: 'https://canvera.com/shop',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://canvera.com/products/${p.slug}`,
      name: p.name,
    })),
  };

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="shop">

      <SEOMeta
        title="Shop Premium Photobooks & Wedding Albums — Canvera"
        description={`Browse ${products.length} premium photobooks, wedding albums, superbooks and decor products. Canvera serves 91,000+ professional photographers across India.`}
        canonical="https://canvera.com/shop"
        og={{ url: 'https://canvera.com/shop' }}
        schema={[shopSchema]}
        breadcrumb={[
          { name: 'Home', url: 'https://canvera.com/' },
          { name: 'Shop', url: 'https://canvera.com/shop' },
        ]}
      />

      <Breadcrumb />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="shop__hero">
        <div className="shop__hero-inner">
          <p className="shop__eyebrow">Shop Albums</p>
          <h1 className="shop__headline">
            <span className="shop__hl1">Every collection,</span>
            <span className="shop__hl2">every material.</span>
          </h1>
          <p className="shop__sub">
            {products.length} premium albums across {CAT_OPTIONS.length} categories.
          </p>
        </div>
      </section>

      {/* ── Sticky toolbar: badge pills + count + sort + filter btn ── */}
      <div className="shop-toolbar">
        <div className="shop-toolbar__inner">

          {/* Badge quick-filter pills (left) */}
          <div className="shop-toolbar__pills">
            {BADGE_PILLS.map(pill => (
              <button
                key={String(pill.value)}
                className={`shop-toolbar__pill${activeBadge === pill.value ? ' shop-toolbar__pill--active' : ''}`}
                onClick={() => setActiveBadge(pill.value)}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Right: count + sort + mobile filter button */}
          <div className="shop-toolbar__right">
            <span className="shop-toolbar__count">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>

            <div className="shop-toolbar__sort">
              <label className="shop-toolbar__sort-label" htmlFor="shop-sort-sel">Sort</label>
              <select
                id="shop-sort-sel"
                className="shop-toolbar__sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Mobile filter button — hidden on desktop */}
            <button
              className="shop-toolbar__filter-btn"
              onClick={() => setMobileOpen(true)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6"  x2="20" y2="6"/>
                <line x1="4" y1="12" x2="14" y2="12"/>
                <line x1="4" y1="18" x2="8"  y2="18"/>
              </svg>
              Filters
              {totalActive > 0 && (
                <span className="shop-toolbar__filter-dot">{totalActive}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Active chip rail (spec §8) — mounts only when selections exist ── */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            className="shop-chips"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="shop-chips__inner">
              {activeChips.map(chip => (
                <button
                  key={`${chip.dimension}-${chip.value}`}
                  className="shop-chip"
                  onClick={() => handleToggle(chip.dimension, chip.value)}
                >
                  {chip.value}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
                    <line x1="18" y1="6"  x2="6"  y2="18"/>
                    <line x1="6"  y1="6"  x2="18" y2="18"/>
                  </svg>
                </button>
              ))}
              <button
                className="shop-chips__clear"
                onClick={() => handleToggle('clear-all')}
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Two-column layout ─────────────────────────────────── */}
      <div className="shop-layout">

        {/* Sidebar — desktop only (spec §2.2) */}
        <aside className="shop-sidebar">
          <FilterPanel
            filters={filters}
            onToggle={handleToggle}
            totalActive={totalActive}
          />
        </aside>

        {/* Product grid */}
        <section className="shop-main">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                className="shop-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </motion.div>
            ) : (
              /* Empty state (spec §12) */
              <motion.div
                key="empty"
                className="shop-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
                  style={{ color: 'var(--text-secondary)', opacity: 0.35 }}
                >
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <p>No products match your filters.</p>
                <button
                  className="shop-empty__btn"
                  onClick={() => handleToggle('clear-all')}
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </div>

      {/* ── Mobile overlay + drawer (spec §11) ───────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="shop-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="shop-mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <div className="shop-mobile-drawer__head">
                <span className="shop-mobile-drawer__title">Filters</span>
                <button
                  className="shop-mobile-drawer__close"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6"  x2="6"  y2="18"/>
                    <line x1="6"  y1="6"  x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="shop-mobile-drawer__body">
                <FilterPanel
                  filters={filters}
                  onToggle={handleToggle}
                  totalActive={totalActive}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
