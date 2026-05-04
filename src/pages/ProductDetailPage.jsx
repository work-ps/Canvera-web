import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { products, bindingImages } from '../data/products';
import { SIZES } from '../data/productConfig';
import PriceGate from '../components/PriceGate';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import SEOMeta from '../components/SEOMeta';
import './ProductDetailPage.css';

/* ── Constants ──────────────────────────────────────────────────────────────── */
const ZOOM_FACTOR  = 2.5;
const TABS         = ['Overview', 'Specifications', 'Design Styles', 'Material & Care'];
const ORIENTATIONS = ['Portrait', 'Landscape', 'Square'];

const SPECS = {
  'Photobooks':     { Binding: 'Lay-flat / Flush Mount', Pages: '20–80 sheets', 'Cover Options': 'Leather, Suede, Fabric, Wood', Printing: '6-color Hexachrome', 'Paper Types': 'Matte, Glossy, Silk, Pearl, Metallic' },
  'Momentbooks':    { Binding: 'Soft-cover Lay-flat', Pages: '20–60 sheets', 'Cover Options': 'Leatherette, Suede', Printing: '4-color CMYK', 'Paper Types': 'Matte, Glossy, Silk' },
  'Superbooks':     { Binding: 'Extra-large Lay-flat', Pages: '20–80 sheets', 'Cover Options': 'Premium Leather, Suede', Printing: '6-color Hexachrome', 'Paper Types': 'All types available' },
  'Magazines':      { Binding: 'Saddle-stitch / Perfect-bound', Pages: '20–80 pages', 'Cover Options': 'Gloss / Matte laminate', Printing: '4-color CMYK', 'Paper Types': 'Art paper, Matte Art' },
  'Decor Products': { 'Frame Options': 'Canvas, Wood, Metal', Sizes: '16×20" to 24×36"', Printing: 'Archival inkjet', Coating: 'UV protective, Matte / Glossy', Mounting: 'Ready to hang' },
  'Gifting Kit':    { 'Kit Contents': 'Box, prints, mini album', 'Box Materials': 'Suede, Leather, Velvet', 'Print Sizes': '4×6", 5×7"', Finishing: 'Velvet lining', Customization: 'Name & date embossing' },
};

const CARE_TIPS = [
  'Keep away from direct sunlight to prevent fading.',
  'Store in the provided dust bag or presentation box when not on display.',
  'Wipe covers gently with a soft, dry cloth — avoid water or solvents.',
  'Handle pages with dry, clean hands for lasting print quality.',
  'For leather covers, occasional application of a leather conditioner extends life.',
];

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
  size: {
    title: 'Album Sizes Explained',
    items: SIZES.map(sz => ({
      name: sz.label,
      icon: null,
      desc: {
        'sz-1': 'Compact 8×10" — popular for gifting, intimate albums, and coffee-table display. Fits in most bags.',
        'sz-2': 'Standard 10×12" — our most popular size for wedding albums. Perfect balance of presence and portability.',
        'sz-3': 'Large 12×15" — makes a strong visual impact; suits premium wedding and event coverage.',
        'sz-4': 'Wide 12×18" — panoramic landscape format; stunning for full-spread cityscape and travel photography.',
        'sz-5': 'Statement 14×20" — our largest size. A true showpiece for the living room or studio wall.',
      }[sz.id] || '',
      best: {
        'sz-1': `${sz.widthIn}″ × ${sz.heightIn}″ · Best for gifting`,
        'sz-2': `${sz.widthIn}″ × ${sz.heightIn}″ · Most popular`,
        'sz-3': `${sz.widthIn}″ × ${sz.heightIn}″ · Premium events`,
        'sz-4': `${sz.widthIn}″ × ${sz.heightIn}″ · Wide panoramic`,
        'sz-5': `${sz.widthIn}″ × ${sz.heightIn}″ · Statement piece`,
      }[sz.id] || `${sz.widthIn}″ × ${sz.heightIn}″`,
    })),
    note: 'All sizes use the same paper and cover materials. Final pricing is calculated in the order summary.',
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
  const [selectedOrientation, setSelectedOrientation] = useState('Portrait');
  const [selectedSize,        setSelectedSize]        = useState(SIZES[0].id);
  const [selectedBinding,     setSelectedBinding]     = useState(Object.keys(bindingImages)[0]);
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
        size:        SIZES.find(s => s.id === selectedSize)?.label,
        binding:     bindingImages[selectedBinding]?.label || selectedBinding,
      },
      image: product.image,
    });
    setCartToast(true);
    setTimeout(() => setCartToast(false), 3000);
  };

  const handleConfigureOrder = () => {
    if (!isLoggedIn) { navigate('/login?redirect=/order/' + product.slug); return; }
    const params = new URLSearchParams({
      orientation: selectedOrientation,
      size:        selectedSize,
      binding:     bindingImages[selectedBinding]?.label || selectedBinding,
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

          {/* Rating */}
          <div className="pdp__rating-row">
            <div className="pdp__stars">
              {[1,2,3,4,5].map(s => <StarIcon key={s} filled={s <= Math.round(product.rating)} />)}
            </div>
            <span className="pdp__rating-val">{product.rating}</span>
            <span className="pdp__rating-count">({product.reviewCount?.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="pdp__price-block">
            <span className="pdp__price-label">Starting from</span>
            <PriceGate price={product.price} size="lg" />
            {isLoggedIn && <span className="pdp__price-note">+ GST &amp; configuration</span>}
          </div>

          {/* Orientation */}
          {product.category !== 'Decor Products' && (
            <div className="pdp__selector">
              <div className="pdp__selector-label-row">
                <p className="pdp__selector-label">Orientation</p>
                <HelpBtn onClick={() => setHelpModal('orientation')} />
              </div>
              <div className="pdp__chips">
                {ORIENTATIONS.map(o => (
                  <button
                    key={o}
                    className={`pdp__chip ${selectedOrientation === o ? 'pdp__chip--active' : ''}`}
                    onClick={() => setSelectedOrientation(o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div className="pdp__selector">
            <div className="pdp__selector-label-row">
              <p className="pdp__selector-label">Size</p>
              <HelpBtn onClick={() => setHelpModal('size')} />
            </div>
            <div className="pdp__chips">
              {SIZES.map(sz => (
                <button
                  key={sz.id}
                  className={`pdp__chip ${selectedSize === sz.id ? 'pdp__chip--active' : ''}`}
                  onClick={() => setSelectedSize(sz.id)}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>

          {/* Binding — visual selector with real binding thumbnails */}
          {!['Decor Products', 'Gifting Kit', 'Magazines'].includes(product.category) && (
            <div className="pdp__selector">
              <div className="pdp__selector-label-row">
                <p className="pdp__selector-label">Binding Type</p>
                <HelpBtn onClick={() => setHelpModal('binding')} />
              </div>
              <div className="pdp__binding-options">
                {Object.entries(bindingImages).map(([key, b]) => (
                  <button
                    key={key}
                    className={`pdp__binding-opt ${selectedBinding === key ? 'pdp__binding-opt--active' : ''}`}
                    onClick={() => setSelectedBinding(key)}
                  >
                    <img src={b.thumb} alt={b.label} className="pdp__binding-opt-img" />
                    <span className="pdp__binding-opt-label">{b.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material */}
          <div className="pdp__material-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2l9 4-9 4-9-4 9-4z"/><path d="M3 12l9 4 9-4"/></svg>
            <span>{product.material}</span>
          </div>

          {/* Occasions */}
          {product.occasions?.length > 0 && (
            <div className="pdp__occasions">
              <p className="pdp__selector-label">Perfect for</p>
              <div className="pdp__occ-tags">
                {product.occasions.map(o => <span key={o} className="pdp__occ-tag">{o}</span>)}
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
          {activeTab === 0 && (
            <div className="pdp__overview">
              <p className="pdp__overview-desc">{product.description}</p>
              <p className="pdp__overview-specs-line">{product.specs}</p>
              <h3 className="pdp__overview-heading">Key Features</h3>
              <ul className="pdp__features">
                <li>Museum-quality {product.material} cover with precision stitching</li>
                <li>6-color Hexachrome printing for true-to-life colour reproduction</li>
                <li>Archival-grade inks — protected for generations</li>
                <li>Multi-point quality inspection before dispatch</li>
                <li>Unique genuineness code included with every product</li>
                <li>Personalised cover text available (name, date, message)</li>
              </ul>
            </div>
          )}

          {activeTab === 1 && (
            <div className="pdp__specs">
              <table className="pdp__specs-table">
                <tbody>
                  {Object.entries(specs).map(([k, v]) => (
                    <tr key={k}>
                      <td className="pdp__spec-key">{k}</td>
                      <td className="pdp__spec-val">{v}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pdp__spec-key">Rating</td>
                    <td className="pdp__spec-val">{product.rating} / 5 ({product.reviewCount?.toLocaleString()} reviews)</td>
                  </tr>
                  <tr>
                    <td className="pdp__spec-key">Material</td>
                    <td className="pdp__spec-val">{product.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 2 && (
            <div className="pdp__styles">
              <p className="pdp__styles-intro">Choose from four cover styles when you configure your order. Each style supports multiple material and colour options.</p>
              <div className="pdp__styles-grid">
                {[
                  { name: 'Padded Leather', color: '#4a3728', materials: 'Italian Leather, Vegan Leather', textLines: 2 },
                  { name: 'Fabric Wrap',    color: '#8b7d6b', materials: 'Linen, Silk',                   textLines: 3 },
                  { name: 'Photo Cover',    color: '#607080', materials: 'Matte Laminate, Glossy Laminate', textLines: 1 },
                  { name: 'Wooden Cover',   color: '#a0845c', materials: 'Walnut, Maple',                  textLines: 2 },
                ].map(style => (
                  <div key={style.name} className="pdp__style-card">
                    <div className="pdp__style-swatch" style={{ background: style.color }} />
                    <div className="pdp__style-info">
                      <p className="pdp__style-name">{style.name}</p>
                      <p className="pdp__style-materials">{style.materials}</p>
                      <p className="pdp__style-lines">Up to {style.textLines} text line{style.textLines > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="pdp__care">
              <div className="pdp__papers">
                <h3 className="pdp__care-heading">Paper Types</h3>
                <div className="pdp__paper-list">
                  {['Matte — smooth, non-reflective, classic', 'Glossy — vibrant, high-shine', 'Silk — semi-gloss hybrid', 'Pearl — subtle shimmer, premium ✦', 'Metallic — dramatic metallic sheen ✦'].map(p => (
                    <div key={p} className="pdp__paper-item">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--brand-petrol)" strokeWidth="2.2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <p className="pdp__paper-note">✦ Premium specialty papers — limited page ranges</p>
              </div>
              <div className="pdp__care-tips">
                <h3 className="pdp__care-heading">Care Instructions</h3>
                <ul className="pdp__care-list">
                  {CARE_TIPS.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>
            </div>
          )}
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
