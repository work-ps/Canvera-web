import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { products, bindingImages } from '../data/products';
import { PRODUCT_CONTENT, CARE_TIPS } from '../data/productContent';
import PriceGate from '../components/PriceGate';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import SEOMeta from '../components/SEOMeta';
import './ProductDetailPage.css';

/* ── Constants ──────────────────────────────────────────────────────────────── */
const ZOOM_FACTOR = 2.5;
const TABS        = ['Description', 'Benefits', 'Care Instructions'];

/* ── Orientation → Sizes (from Canvera product catalogue) ──────────────────── */
const ORIENTATION_SIZES = {
  Landscape: [
    { id: 'l-12x18', dims: '12×18"', cmDims: '30×46 cm', w: 18, h: 12, tier: 'Large',  popular: true  },
    { id: 'l-12x16', dims: '12×16"', cmDims: '30×41 cm', w: 16, h: 12, tier: 'Large',  popular: false },
    { id: 'l-12x15', dims: '12×15"', cmDims: '30×38 cm', w: 15, h: 12, tier: 'Medium', popular: false },
  ],
  Portrait: [
    { id: 'p-12x18', dims: '12×18"', cmDims: '30×46 cm', w: 12, h: 18, tier: 'Large',  popular: true  },
    { id: 'p-12x15', dims: '12×15"', cmDims: '30×38 cm', w: 12, h: 15, tier: 'Medium', popular: false },
  ],
  Square: [
    { id: 'q-12x12', dims: '12×12"', cmDims: '30×30 cm', w: 12, h: 12, tier: 'Large',  popular: true  },
  ],
};

/* Orientation icons – closed-album-cover style, currentColor strokes */
const OrzIcons = {
  Landscape: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round">
      <rect x="5" y="19" width="54" height="34" rx="4" strokeWidth="2"/>
      <line x1="14" y1="19" x2="14" y2="53" strokeWidth="1.5" opacity="0.45"/>
      <rect x="18" y="25" width="36" height="22" rx="2.5" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
  Portrait: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round">
      <rect x="19" y="5" width="26" height="54" rx="4" strokeWidth="2"/>
      <line x1="19" y1="14" x2="45" y2="14" strokeWidth="1.5" opacity="0.45"/>
      <rect x="24" y="18" width="16" height="34" rx="2.5" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
  Square: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round">
      <rect x="9" y="9" width="46" height="46" rx="4" strokeWidth="2"/>
      <line x1="18" y1="9" x2="18" y2="55" strokeWidth="1.5" opacity="0.45"/>
      <rect x="22" y="15" width="28" height="34" rx="2.5" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
};

/* Size icons – proportional rectangles, currentColor stroke */
const SizeIcons = {
  'l-12x18': <svg viewBox="0 0 64 64" fill="none"><rect x="6"  y="15" width="52" height="35" rx="3" stroke="currentColor" strokeWidth="2"/></svg>,
  'l-12x16': <svg viewBox="0 0 64 64" fill="none"><rect x="6"  y="13" width="52" height="39" rx="3" stroke="currentColor" strokeWidth="2"/></svg>,
  'l-12x15': <svg viewBox="0 0 64 64" fill="none"><rect x="6"  y="11" width="52" height="42" rx="3" stroke="currentColor" strokeWidth="2"/></svg>,
  'p-12x18': <svg viewBox="0 0 64 64" fill="none"><rect x="15" y="6"  width="35" height="52" rx="3" stroke="currentColor" strokeWidth="2"/></svg>,
  'p-12x15': <svg viewBox="0 0 64 64" fill="none"><rect x="11" y="6"  width="42" height="52" rx="3" stroke="currentColor" strokeWidth="2"/></svg>,
  'q-12x12': <svg viewBox="0 0 64 64" fill="none"><rect x="7"  y="7"  width="50" height="50" rx="3" stroke="currentColor" strokeWidth="2"/></svg>,
};

/* Shared checkmark badge for active state */
const CheckBadge = () => (
  <span className="pdp__sel-check" aria-hidden="true">
    <svg viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="8" fill="currentColor"/>
      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
);


const SPECS = {
  'Photobooks':     { Binding: 'Lay-flat / Flush Mount', Pages: '20–80 sheets', 'Cover Options': 'Leather, Suede, Fabric, Wood', Printing: '6-color Hexachrome', 'Paper Types': 'Matte, Glossy, Silk, Pearl, Metallic' },
  'Momentbooks':    { Binding: 'Soft-cover Lay-flat', Pages: '20–60 sheets', 'Cover Options': 'Leatherette, Suede', Printing: '4-color CMYK', 'Paper Types': 'Matte, Glossy, Silk' },
  'Superbooks':     { Binding: 'Extra-large Lay-flat', Pages: '20–80 sheets', 'Cover Options': 'Premium Leather, Suede', Printing: '6-color Hexachrome', 'Paper Types': 'All types available' },
  'Premium Magazine Books': { Binding: 'Saddle-stitch / Perfect-bound', Pages: '20–80 pages', 'Cover Options': 'Gloss / Matte laminate', Printing: '4-color CMYK', 'Paper Types': 'Art paper, Matte Art' },
  'Decor Products': { 'Frame Options': 'Canvas, Wood, Metal', Sizes: '16×20" to 24×36"', Printing: 'Archival inkjet', Coating: 'UV protective, Matte / Glossy', Mounting: 'Ready to hang' },
  'Gifting Kit':    { 'Kit Contents': 'Box, prints, mini album', 'Box Materials': 'Suede, Leather, Velvet', 'Print Sizes': '4×6", 5×7"', Finishing: 'Velvet lining', Customization: 'Name & date embossing' },
};


/* ── Help content ───────────────────────────────────────────────────────────── */
const HELP_CONTENT = {
  orientation: {
    title: 'Choosing Your Orientation',
    items: [
      {
        name: 'Portrait',
        icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>),
        desc: 'Vertical format — the classic choice for weddings and portrait sessions. Complements standard full-length shots and fits neatly on a bookshelf.',
        best: 'Weddings, Portraits, Graduations',
      },
      {
        name: 'Landscape',
        icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/></svg>),
        desc: 'Wide horizontal format — ideal for panoramic scenes, group photographs, and editorial-style albums. Immersive full-spread layouts look stunning.',
        best: 'Travel, Landscapes, Events, Journalism',
      },
      {
        name: 'Square',
        icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>),
        desc: 'Equal width and height — a modern, Instagram-inspired look. Highly versatile; works across all photography genres with a sleek, symmetric presentation.',
        best: 'Lifestyle, Fashion, Social Media, Gifting',
      },
    ],
    note: 'Orientation cannot be changed after your order is confirmed.',
  },
  binding: {
    title: 'Binding Types Explained',
    items: [
      {
        name: 'Lay-flat',
        icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 12h20M12 2v20"/></svg>),
        desc: 'Pages open completely flat with zero gutter gap — your full-spread photographs are uninterrupted from edge to edge.',
        best: 'Wedding albums, Full-spread layouts',
      },
      {
        name: 'Flush Mount',
        icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="1"/><path d="M12 4v16"/></svg>),
        desc: 'Photos printed directly onto thick album boards — no separate page and mount. Zero curl, ultra-rigid, and the most premium tactile experience.',
        best: 'Luxury weddings, Heirloom albums',
      },
      {
        name: 'Perfect Bound',
        icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M4 6h16M4 10h16"/></svg>),
        desc: 'Traditional flat-spine glue binding. Cost-effective option suitable for portfolios, magazines, and lookbooks with a small gutter.',
        best: 'Magazines, Portfolios, Corporate',
      },
      {
        name: 'Saddle Stitch',
        icon: (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 3v18M5 7l7-4 7 4M5 17l7 4 7-4"/></svg>),
        desc: 'Staple-bound through the centrefold. Best suited for thinner products (≤64 pages). Ideal for newsletters, event programs, and mini magazines.',
        best: 'Magazines (thin), Programs, Lookbooks',
      },
    ],
    note: 'Binding cannot be changed after production begins. Choose based on your page count and presentation needs.',
  },
};

/* ── Help Modal ─────────────────────────────────────────────────────────────── */
function HelpModal({ type, onClose }) {
  const content = HELP_CONTENT[type];
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!content) return null;

  return (
    <div
      className="pdp__help-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog" aria-modal="true" aria-label={content.title}
    >
      <div className="pdp__help-modal">
        <div className="pdp__help-header">
          <h3 className="pdp__help-title">{content.title}</h3>
          <button className="pdp__help-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="pdp__help-items">
          {content.items.map((item) => (
            <div key={item.name} className="pdp__help-item">
              {item.icon && <div className="pdp__help-item-icon">{item.icon}</div>}
              {!item.icon && type === 'size' && (
                <div className="pdp__help-item-size-badge">{item.name}</div>
              )}
              <div className="pdp__help-item-body">
                <p className="pdp__help-item-name">{item.name}</p>
                <p className="pdp__help-item-desc">{item.desc}</p>
                <p className="pdp__help-item-best">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {item.best}
                </p>
              </div>
            </div>
          ))}
        </div>
        {content.note && (
          <p className="pdp__help-note">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            {content.note}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Help Trigger Button ─────────────────────────────────────────────────────── */
function HelpBtn({ onClick }) {
  return (
    <button className="pdp__help-btn" onClick={onClick} aria-label="Learn more" type="button">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
      </svg>
    </button>
  );
}

/* ── Star icon ───────────────────────────────────────────────────────────────── */
function StarIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#F5A623' : 'none'} stroke={filled ? '#F5A623' : '#C8D1D8'} strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

/* ── PDP Carousel (Related / Occasions / Also Bought) ───────────────────────── */
function PdpCarousel({ title, items }) {
  const trackRef              = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd,   setAtEnd]   = useState(false);

  // hooks before early return
  const syncArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    syncArrows();
    el.addEventListener('scroll', syncArrows, { passive: true });
    return () => el.removeEventListener('scroll', syncArrows);
  }, [syncArrows]);

  const scroll = useCallback((dir) => {
    trackRef.current?.scrollBy({ left: dir * 480, behavior: 'smooth' });
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <div className="pdp__carousel">
      <h2 className="pdp__carousel-title">{title}</h2>

      {/* Frame: relative container for side arrows */}
      <div className="pdp__carousel-frame">

        {/* Prev arrow */}
        <button
          className={`pdp__carousel-arrow pdp__carousel-arrow--prev${atStart ? ' pdp__carousel-arrow--hidden' : ''}`}
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Track */}
        <div className="pdp__carousel-wrap">
          <div className="pdp__carousel-track" ref={trackRef}>
            {items.map((p, i) => (
              <div className="pdp__carousel-item" key={p.id}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Next arrow */}
        <button
          className={`pdp__carousel-arrow pdp__carousel-arrow--next${atEnd ? ' pdp__carousel-arrow--hidden' : ''}`}
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

      </div>
    </div>
  );
}

/* ── Get available print types for a product category ────────────────────── */
function getAvailablePrintTypes(category, price) {
  const printTypes = [];

  // Ink Jet – only for Superbooks
  if (category === 'Superbooks') {
    printTypes.push('Ink Jet');
  }

  // Indi Pro – for Premium, Standard, Momentbooks, and Premium Magazine Books
  if (['Premium Photobooks', 'Standard Photobooks', 'Momentbooks', 'Premium Magazine Books'].includes(category)) {
    printTypes.push('Indi Pro');
  }

  // SH Pro – for Premium, Momentbooks, and Premium Magazine Books (price-based thresholds apply, but always show both)
  if (['Premium Photobooks', 'Momentbooks', 'Premium Magazine Books'].includes(category)) {
    printTypes.push('SH Pro');
  }

  return printTypes.length > 0 ? printTypes : ['Indi Pro']; // fallback
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function ProductDetailPage() {
  const { slug }       = useParams();
  const navigate       = useNavigate();
  const { isLoggedIn } = useAuth();
  const { addItem }    = useCart();

  /* ── All data memos (before any early return) ── */
  const product = useMemo(() => products.find(p => p.slug === slug), [slug]);

  // Large gallery images (2000×2000) — used for main viewer + zoom
  const galleryImgs = useMemo(() => product?.images || [], [product]);
  // Small thumbnail images (400×400) — used for thumbnail strip
  const thumbImgs   = useMemo(() => product?.thumbs  || product?.images || [], [product]);

  const relatedProducts = useMemo(() =>
    product
      ? products.filter(p => p.collection === product.collection && p.id !== product.id).slice(0, 8)
      : [],
    [product]
  );

  const occasionProducts = useMemo(() => {
    if (!product?.occasions?.length) return [];
    return products
      .filter(p =>
        p.id !== product.id &&
        !relatedProducts.find(r => r.id === p.id) &&
        p.occasions?.some(o => product.occasions.includes(o))
      )
      .slice(0, 8);
  }, [product, relatedProducts]);

  const alsoBought = useMemo(() =>
    product
      ? products
          .filter(p =>
            p.id !== product.id &&
            !relatedProducts.find(r => r.id === p.id) &&
            !occasionProducts.find(r => r.id === p.id)
          )
          .slice(0, 8)
      : [],
    [product, relatedProducts, occasionProducts]
  );

  /* ── UI state ── */
  const [activeTab,           setActiveTab]           = useState(0);
  const [selectedOrientation, setSelectedOrientation] = useState('Landscape');
  const [selectedSize,        setSelectedSize]        = useState(ORIENTATION_SIZES.Landscape[0].id);
  const [useInches,           setUseInches]           = useState(true);

  const handleOrientationChange = (orient) => {
    setSelectedOrientation(orient);
    setSelectedSize(ORIENTATION_SIZES[orient][0].id);
  };
  const [activeImg,           setActiveImg]           = useState(0);
  const [cartToast,           setCartToast]           = useState(false);
  const [helpModal,           setHelpModal]           = useState(null);

  /* ── Zoom state ── */
  const [zoomActive, setZoomActive] = useState(false);
  const [lensPos,    setLensPos]    = useState({ x: 0, y: 0, W: 0, H: 0 });
  const galleryMainRef              = useRef(null);

  const handleGalleryMouseMove = useCallback((e) => {
    const el = galleryMainRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    const W    = rect.width;
    const H    = rect.height;
    const LW   = W / ZOOM_FACTOR;
    const LH   = H / ZOOM_FACTOR;
    setLensPos({
      x: Math.max(0, Math.min(mx - LW / 2, W - LW)),
      y: Math.max(0, Math.min(my - LH / 2, H - LH)),
      W,
      H,
    });
    setZoomActive(true);
  }, []);

  const handleGalleryMouseLeave = useCallback(() => setZoomActive(false), []);

  /* ── Derived zoom values ── */
  const currentImg    = galleryImgs[activeImg] ?? '';
  const lensW         = lensPos.W / ZOOM_FACTOR;
  const lensH         = lensPos.H / ZOOM_FACTOR;

  const lensStyle = {
    display:  zoomActive ? 'block' : 'none',
    left:     lensPos.x,
    top:      lensPos.y,
    width:    lensW,
    height:   lensH,
  };

  /* Zoom panel img style — offset so the lens region fills the panel.
     Using an <img objectFit="cover"> mirrors how the main image renders,
     preserving the photo's natural aspect ratio at every zoom position. */
  const zoomImgStyle = {
    width:  `${ZOOM_FACTOR * 100}%`,
    height: `${ZOOM_FACTOR * 100}%`,
    left:   `${-lensPos.x * ZOOM_FACTOR}px`,
    top:    `${-lensPos.y * ZOOM_FACTOR}px`,
  };

  /* ── 404 guard (after all hooks) ── */
  if (!product) {
    return (
      <div className="pdp-404">
        <div className="pdp-404__inner">
          <div className="pdp-404__icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <h1 className="pdp-404__title">Product Not Found</h1>
          <p className="pdp-404__sub">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop" className="pdp-404__cta">Browse Products</Link>
        </div>
      </div>
    );
  }

  /* ── Helpers ── */
  const selectedSizeData = ORIENTATION_SIZES[selectedOrientation]?.find(s => s.id === selectedSize);

  /* ── Handlers ── */
  const handleAddToCart = () => {
    if (!isLoggedIn) { navigate('/login?redirect=/products/' + product.slug); return; }
    addItem({
      productId:      product.id,
      productName:    product.name,
      productSlug:    product.slug,
      collectionName: product.collection,
      price:          product.price,
      isComplete:     false,
      configuration:  {
        orientation: selectedOrientation,
        size:        selectedSizeData?.dims || selectedSize,
      },
      image: product.image,
    });
    setCartToast(true);
    setTimeout(() => setCartToast(false), 3000);
  };

  const handleConfigureOrder = () => {
    if (!isLoggedIn) { navigate('/login?redirect=/order/' + product.slug); return; }
    const params = new URLSearchParams({
      orientation:  selectedOrientation,
      size:         selectedSize,
      sizeLabel:    selectedSizeData?.dims || '',
    });
    navigate(`/order/${product.slug}?${params.toString()}`);
  };

  const specs = SPECS[product.category] || {};

  const BADGE_MAP = {
    bestseller: { label: 'Bestseller',      cls: 'pdp__badge--bestseller' },
    new:        { label: 'New',             cls: 'pdp__badge--new' },
    popular:    { label: 'Popular',         cls: 'pdp__badge--popular' },
    limited:    { label: 'Limited Edition', cls: 'pdp__badge--limited' },
  };

  /* ── Product JSON-LD ── */
  const productSchema = product ? {
    '@type': 'Product',
    '@id': `https://canvera.com/products/${product.slug}`,
    name: product.name,
    description: product.description,
    image: product.image ? `https://canvera.com${product.image}` : 'https://canvera.com/images/og-cover.jpg',
    url: `https://canvera.com/products/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'Canvera',
    },
    category: product.category,
    material: product.material,
    offers: {
      '@type': 'Offer',
      url: `https://canvera.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2026-12-31',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Canvera',
      },
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  } : null;

  /* ── Render ── */
  return (
    <div className="pdp">

      {/* Per-page SEO meta + Product structured data */}
      {product && (
        <SEOMeta
          title={`${product.name} — Premium ${product.category} | Canvera`}
          description={`${product.description?.slice(0, 155)}…`}
          canonical={`https://canvera.com/products/${product.slug}`}
          og={{
            type: 'product',
            url: `https://canvera.com/products/${product.slug}`,
            image: product.image ? `https://canvera.com${product.image}` : undefined,
            title: `${product.name} | Canvera`,
          }}
          schema={productSchema ? [productSchema] : []}
          breadcrumb={[
            { name: 'Home',    url: 'https://canvera.com/' },
            { name: 'Shop',    url: 'https://canvera.com/shop' },
            { name: product.name, url: `https://canvera.com/products/${product.slug}` },
          ]}
        />
      )}

      {/* Help Modal */}
      {helpModal && <HelpModal type={helpModal} onClose={() => setHelpModal(null)} />}

      {/* Breadcrumb — dynamic trail from NavigationHistoryContext */}
      <Breadcrumb />

      {/* ── Main 2-col ── */}
      <div className="pdp__main">

        {/* LEFT — Sticky gallery + zoom */}
        <div className="pdp__gallery">

          {/* Primary image + lens */}
          <div
            className="pdp__gallery-main"
            ref={galleryMainRef}
            onMouseMove={handleGalleryMouseMove}
            onMouseLeave={handleGalleryMouseLeave}
          >
            <img
              src={currentImg}
              alt={product.name}
              className="pdp__gallery-img"
            />
            {product.badge && (
              <span className={`pdp__badge ${BADGE_MAP[product.badge]?.cls}`}>
                {BADGE_MAP[product.badge]?.label}
              </span>
            )}
            {/* Lens overlay — shows the area being magnified */}
            <div className="pdp__lens" style={lensStyle} aria-hidden="true" />
          </div>

          {/* Zoom result panel — absolutely positioned over the info column */}
          <div
            className={`pdp__zoom-panel${zoomActive ? ' pdp__zoom-panel--active' : ''}`}
            aria-hidden="true"
          >
            {zoomActive && (
              <img
                src={currentImg}
                alt=""
                className="pdp__zoom-img"
                style={zoomImgStyle}
              />
            )}
          </div>

          {/* Thumbnails — 400×400 strip; clicking loads 2000×2000 in main viewer */}
          <div className="pdp__thumbs">
            {thumbImgs.map((src, i) => (
              <button
                key={i}
                className={`pdp__thumb ${activeImg === i ? 'pdp__thumb--active' : ''}`}
                onClick={() => { setActiveImg(i); setZoomActive(false); }}
              >
                <img src={src} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Info panel */}
        <div className="pdp__info">
          <p className="pdp__collection">{product.collection} Collection</p>
          <h1 className="pdp__name">{product.name}</h1>
          <p className="pdp__tag">{product.tag}</p>

          {/* Occasions — Perfect for */}
          {product.occasions?.length > 0 && (
            <div className="pdp__occasions">
              <p className="pdp__selector-label">Perfect for</p>
              <div className="pdp__occ-tags">
                {product.occasions.map(o => <span key={o} className="pdp__occ-tag">{o}</span>)}
              </div>
            </div>
          )}

          {/* ── Orientation ── */}
          {product.category !== 'Decor Products' && (
            <div className="pdp__selector">
              <div className="pdp__selector-label-row">
                <p className="pdp__selector-label">Orientation</p>
                <HelpBtn onClick={() => setHelpModal('orientation')} />
              </div>
              <div className="pdp__sel-grid">
                {Object.keys(ORIENTATION_SIZES).map(orient => (
                  <button
                    key={orient}
                    className={`pdp__sel-card${selectedOrientation === orient ? ' pdp__sel-card--active' : ''}`}
                    onClick={() => handleOrientationChange(orient)}
                    aria-pressed={selectedOrientation === orient}
                  >
                    {selectedOrientation === orient && <CheckBadge />}
                    <div className="pdp__sel-icon">{OrzIcons[orient]}</div>
                    <span className="pdp__sel-name">{orient}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Size ── */}
          {product.category !== 'Decor Products' && (
            <div className="pdp__selector">
              <div className="pdp__selector-label-row">
                <p className="pdp__selector-label">Size</p>
                <div className="pdp__unit-toggle">
                  <span
                    className={`pdp__unit-opt${useInches ? ' pdp__unit-opt--active' : ''}`}
                    onClick={() => setUseInches(true)}
                    role="button" tabIndex={0}
                  >inch</span>
                  <button
                    className={`pdp__unit-track${useInches ? '' : ' pdp__unit-track--cm'}`}
                    onClick={() => setUseInches(v => !v)}
                    aria-label="Toggle unit"
                    role="switch"
                    aria-checked={!useInches}
                  >
                    <span className="pdp__unit-knob" />
                  </button>
                  <span
                    className={`pdp__unit-opt${!useInches ? ' pdp__unit-opt--active' : ''}`}
                    onClick={() => setUseInches(false)}
                    role="button" tabIndex={0}
                  >cm</span>
                </div>
              </div>
              <div className="pdp__sel-grid">
                {ORIENTATION_SIZES[selectedOrientation].map(sz => (
                  <button
                    key={sz.id}
                    className={`pdp__sel-card${selectedSize === sz.id ? ' pdp__sel-card--active' : ''}`}
                    onClick={() => setSelectedSize(sz.id)}
                    aria-pressed={selectedSize === sz.id}
                  >
                    {sz.popular && <span className="pdp__sel-popular">Popular</span>}
                    {selectedSize === sz.id && <CheckBadge />}
                    <div className="pdp__sel-icon">{SizeIcons[sz.id]}</div>
                    <span className="pdp__sel-name">{useInches ? sz.dims : sz.cmDims}</span>
                    <span className="pdp__sel-sub">{sz.tier}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="pdp__actions">
            {isLoggedIn ? (
              <>
                <button className="pdp__btn-primary" onClick={handleConfigureOrder}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  Configure &amp; Order
                </button>
                <button className="pdp__btn-secondary" onClick={handleAddToCart}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  Save to Cart
                </button>
              </>
            ) : (
              <>
                <button className="pdp__btn-primary" onClick={() => navigate('/login?redirect=/products/' + product.slug)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                  Sign In to Order
                </button>
                <Link to="/login" className="pdp__btn-secondary-link">View Pricing</Link>
              </>
            )}
          </div>

          {/* Trust row */}
          <div className="pdp__trust">
            <span className="pdp__trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Genuine product guarantee
            </span>
            <span className="pdp__trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
              10–14 day delivery
            </span>
            <span className="pdp__trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Quality checked
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="pdp__tabs-section">
        <div className="pdp__tabs-nav">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`pdp__tab-btn ${activeTab === i ? 'pdp__tab-btn--active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="pdp__tab-content">
          {(() => {
            const content = PRODUCT_CONTENT[product.name] || {};
            const desc     = content.description || product.description || '';
            const features = content.features?.length  ? content.features  : [];
            const benefits = content.benefits?.length  ? content.benefits  : [];

            return (
              <>
                {/* Tab 0 — Description */}
                {activeTab === 0 && (
                  <div className="pdp__overview">
                    {desc && <p className="pdp__overview-desc">{desc}</p>}
                    {!desc && <p className="pdp__overview-desc pdp__overview-desc--empty">Description coming soon.</p>}
                    {features.length > 0 && (
                      <>
                        <h3 className="pdp__overview-heading">Key Features</h3>
                        <ul className="pdp__features">
                          {features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </>
                    )}
                  </div>
                )}

                {/* Tab 1 — Benefits */}
                {activeTab === 1 && (
                  <div className="pdp__overview">
                    {benefits.length > 0 ? (
                      <ul className="pdp__features">
                        {benefits.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    ) : (
                      <p className="pdp__overview-desc pdp__overview-desc--empty">Benefits information coming soon.</p>
                    )}
                  </div>
                )}

                {/* Tab 2 — Care Instructions */}
                {activeTab === 2 && (
                  <div className="pdp__overview">
                    <ul className="pdp__features">
                      {CARE_TIPS.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* ── Three bottom carousels ── */}
      <PdpCarousel
        title={`More from ${product.collection}`}
        items={relatedProducts}
      />
      <PdpCarousel
        title="Perfect for Similar Occasions"
        items={occasionProducts}
      />
      <PdpCarousel
        title="Customers Who Viewed This Also Bought"
        items={alsoBought}
      />

      {/* Cart toast */}
      {cartToast && (
        <div className="pdp__toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          Added to cart
        </div>
      )}
    </div>
  );
}
