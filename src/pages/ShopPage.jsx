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
  'premium-albums':   'Photobooks',
  'standard-albums':  'Photobooks',
  'moment-books':     'Momentbooks',
  'momentbooks':      'Momentbooks',
  'photobooks':       'Photobooks',
  'superbooks':       'Superbooks',
  'magazines':        'Magazines',
  'wall-decor':       'Decor Products',
  'canvas-frames':    'Decor Products',
  'gifting-packages': 'Gifting Kit',
  'gifting-kit':      'Gifting Kit',
  'decor':            'Decor Products',
  'decor-products':   'Decor Products',
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

/* ── Helpers to derive size / orientation / binding from products ── */
function getProductSizes(p) {
  if (p.category === 'Superbooks')                  return ['24×24', '18×18', '15×15'];
  if (p.tag === 'Canvas Print')                     return ['12×18', '18×24', '20×30'];
  if (p.tag === 'Wooden Plaque')                    return ['8×10'];
  if (p.tag === 'Fridge Magnet' || p.tag === 'Photo Calendar') return [];
  if (p.tag === 'Celestial Range')                  return ['12×18', '12×15'];
  if (p.category === 'Photobooks')                  return ['12×15', '12×18', '15×18'];
  return [];
}

function getProductOrientations(p) {
  if (p.category === 'Superbooks')  return ['Square'];
  if (p.tag === 'Photo Calendar')   return ['Landscape'];
  if (p.tag === 'Fridge Magnet')    return ['Portrait', 'Landscape', 'Square'];
  if (p.tag === 'Wooden Plaque')    return ['Portrait', 'Landscape'];
  if (p.tag === 'Canvas Print')     return ['Portrait', 'Landscape'];
  if (p.category === 'Photobooks')  return ['Portrait', 'Landscape'];
  return [];
}

function getProductBindings(p) {
  if (p.category !== 'Photobooks') return [];
  const s = (p.specs || '').toLowerCase();
  if (s.includes('all binding'))   return ['Layflat', 'Flush Mount', 'Absolute', 'Neo-Flush'];
  const b = [];
  if (s.includes('layflat'))       b.push('Layflat');
  if (s.includes('neo-flush'))     b.push('Neo-Flush');
  else if (s.includes('flush'))    b.push('Flush Mount');
  if (s.includes('absolute'))      b.push('Absolute');
  return b.length > 0 ? b : ['Layflat', 'Absolute'];
}

/* ── Generic count-deriving utility ───────────────────────────── */
function deriveOptions(getter) {
  const counts = new Map();
  products.forEach(p => {
    const vals = getter(p);
    (Array.isArray(vals) ? vals : vals ? [vals] : [])
      .forEach(v => counts.set(v, (counts.get(v) || 0) + 1));
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count }));
}

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
  'Photobooks', 'Momentbooks', 'Superbooks', 'Magazines', 'Decor Products', 'Gifting Kit',
];
const _catCounts = {};
products.forEach(p => { _catCounts[p.category] = (_catCounts[p.category] || 0) + 1; });
const CAT_OPTIONS = HEADER_CATEGORY_ORDER
  .map(v => ({ value: v, count: _catCounts[v] || 0 }))
  .filter(o => o.count > 0);   // hide zero-product categories

/* ── Collections, Occasions, Album Type (derived from data) ─────── */
const COL_OPTIONS  = collections
  .map(c => ({ value: c.name, count: products.filter(p => p.collection === c.name).length }))
  .filter(o => o.count > 0)
  .sort((a, b) => b.count - a.count);
const OCC_OPTIONS  = deriveOptions(p => p.occasions);
const TYPE_OPTIONS = deriveOptions(p => p.tag);

/* ── New filter dimensions ─────────────────────────────────────── */
const SIZE_OPTIONS        = deriveOrderedOptions(
  ['12×15', '12×18', '15×18', '18×24', '8×10', '15×15', '18×18', '24×24', '20×30'],
  getProductSizes,
);
const ORIENTATION_OPTIONS = deriveOrderedOptions(
  ['Portrait', 'Landscape', 'Square'],
  getProductOrientations,
);
const BINDING_OPTIONS     = deriveOrderedOptions(
  ['Layflat', 'Flush Mount', 'Absolute', 'Neo-Flush'],
  getProductBindings,
);

/* ── Section definitions ────────────────────────────────────────── */
const SECTIONS = [
  { id: 'categories',   label: 'Category',      options: CAT_OPTIONS,         control: 'checkbox' },
  { id: 'collections',  label: 'Collection',     options: COL_OPTIONS,         control: 'checkbox' },
  { id: 'occasions',    label: 'Occasion',       options: OCC_OPTIONS,         control: 'pill'     },
  { id: 'sizes',        label: 'Size',           options: SIZE_OPTIONS,        control: 'pill'     },
  { id: 'orientations', label: 'Orientation',    options: ORIENTATION_OPTIONS, control: 'pill'     },
  { id: 'bindings',     label: 'Binding Type',   options: BINDING_OPTIONS,     control: 'checkbox' },
  { id: 'types',        label: 'Album Type',     options: TYPE_OPTIONS,        control: 'pill'     },
];

/* ── Empty filter state ────────────────────────────────────────── */
const EMPTY_FILTERS = {
  categories: [], collections: [], occasions: [],
  sizes: [], orientations: [], bindings: [], types: [],
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
                return (
                  <label
                    key={opt.value}
                    className={`shop-fs__row${checked ? ' shop-fs__row--active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="shop-fs__checkbox"
                      checked={checked}
                      onChange={() => onToggle(section.id, opt.value)}
                    />
                    <span className="shop-fs__row-label">{opt.value}</span>
                    <span className="shop-fs__row-count">{opt.count}</span>
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

  /* ── Seed categories from URL ?category= param (spec §7) ────── */
  const [filters, setFilters] = useState(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const resolved = CATEGORY_ALIASES[cat.toLowerCase()] ?? cat;
      // Find exact match in the header category list
      const match = HEADER_CATEGORY_ORDER.find(
        c => c.toLowerCase() === resolved.toLowerCase()
      ) ?? products.find(p =>
        p.category.toLowerCase() === resolved.toLowerCase()
      )?.category;
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

  /* ── Filtered + sorted (spec §6) ────────────────────────────── */
  const filtered = useMemo(() => {
    let r = [...products];

    if (filters.categories.length)
      r = r.filter(p => filters.categories.includes(p.category));
    if (filters.collections.length)
      r = r.filter(p => filters.collections.includes(p.collection));
    if (filters.occasions.length)
      r = r.filter(p => p.occasions?.some(o => filters.occasions.includes(o)));
    if (filters.sizes.length)
      r = r.filter(p => getProductSizes(p).some(s => filters.sizes.includes(s)));
    if (filters.orientations.length)
      r = r.filter(p => getProductOrientations(p).some(o => filters.orientations.includes(o)));
    if (filters.bindings.length)
      r = r.filter(p => getProductBindings(p).some(b => filters.bindings.includes(b)));
    if (filters.types.length)
      r = r.filter(p => filters.types.includes(p.tag));

    /* Badge: UI pills override URL badge param for simplicity */
    const effectiveBadge = activeBadge ?? badgeParam;
    if (effectiveBadge) r = r.filter(p => p.badge === effectiveBadge);

    switch (sortBy) {
      case 'price-low':    return [...r].sort((a, b) => a.price - b.price);
      case 'price-high':   return [...r].sort((a, b) => b.price - a.price);
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
