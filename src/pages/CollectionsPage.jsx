import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collections, products } from '../data/products';
import Breadcrumb from '../components/Breadcrumb';
import SEOMeta from '../components/SEOMeta';
import './CollectionsPage.css';

const BADGE_LABELS = { bestseller: 'Bestseller', popular: 'Popular', new: 'New', limited: 'Limited' };

/* ── 3D Parallax product card ────────────────────────────────────────────── */
function ProductCard({ product }) {
  const [loaded, setLoaded] = useState(false);
  const cardRef  = useRef(null);
  const rafRef   = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50, active: false });
  const canTilt  = useRef(typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches);
  const occasions = (product.occasions || []).slice(0, 2);

  const handleMouseMove = useCallback((e) => {
    if (!canTilt.current || !cardRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const rotY  = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * 10;
      const rotX  = -((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * 10;
      const glowX = ((e.clientX - rect.left) / rect.width)  * 100;
      const glowY = ((e.clientY - rect.top)  / rect.height) * 100;
      setTilt({ x: rotX, y: rotY, glowX, glowY, active: true });
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setTilt({ x: 0, y: 0, glowX: 50, glowY: 50, active: false });
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const cardStyle = canTilt.current ? {
    transform: tilt.active
      ? `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02,1.02,1.02)`
      : 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)',
    transition: tilt.active ? 'transform 0.08s ease-out' : 'transform 0.45s cubic-bezier(0.23,1,0.32,1)',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  } : {};

  const glowStyle = canTilt.current ? {
    background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 55%, transparent 75%)`,
    opacity: tilt.active ? 1 : 0,
    transition: tilt.active ? 'opacity 0.08s ease' : 'opacity 0.4s ease',
  } : {};

  return (
    <Link
      ref={cardRef}
      to={`/products/${product.slug}`}
      className="col-card"
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="col-card__image">
        <img
          src={product.image}
          alt={product.name}
          className={`col-card__img ${loaded ? 'loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          draggable={false}
        />
        {product.badge && (
          <span className={`col-card__badge col-card__badge--${product.badge}`}>
            {BADGE_LABELS[product.badge]}
          </span>
        )}
        {/* Rating — bottom of image */}
        <div className="col-card__rating">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#F5A623" stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="col-card__rating-val">{product.rating}</span>
          <span className="col-card__rating-count">({product.reviewCount?.toLocaleString()})</span>
        </div>
        {/* Gloss sheen */}
        <div className="col-card__gloss" style={glowStyle} aria-hidden="true" />
      </div>

      {/* Body */}
      <div className="col-card__body">
        <p className="col-card__collection">{product.collection}</p>
        <h3 className="col-card__name">{product.name}</h3>
        {occasions.length > 0 && (
          <div className="col-card__occasions">
            {occasions.map(occ => (
              <span key={occ} className="col-card__occ-tag">{occ}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function CollectionsPage() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const [activeSlug, setActiveSlug] = useState(slug || null);

  useEffect(() => { setActiveSlug(slug || null); }, [slug]);

  const handleSelect = (collectionSlug) => {
    setActiveSlug(collectionSlug);
    navigate(collectionSlug ? `/collections/${collectionSlug}` : '/collections', { replace: true });
  };

  const activeCollection = activeSlug ? collections.find(c => c.slug === activeSlug) : null;
  const filteredProducts = activeCollection
    ? products.filter(p => p.collection === activeCollection.name)
    : products;

  /* ── Dynamic SEO meta based on active collection ─────────────── */
  const collectionTitle = activeCollection
    ? `${activeCollection.name} Collection — Premium Photobooks | Canvera`
    : 'Collections — Premium Photobook Collections | Canvera';
  const collectionDesc = activeCollection
    ? `Explore the Canvera ${activeCollection.name} collection. ${activeCollection.description || 'Premium wedding albums and photobooks for professional photographers.'}`
    : 'Browse all Canvera premium photobook collections — Celestial, Luxury, Suede, Foiling, Leatherette, Fabric, Wood, Signature, and Custom Cover.';
  const collectionUrl = activeSlug
    ? `https://canvera.com/collections/${activeSlug}`
    : 'https://canvera.com/collections';

  const collectionSchema = {
    '@type': 'CollectionPage',
    name: collectionTitle,
    description: collectionDesc,
    url: collectionUrl,
    ...(filteredProducts.length > 0 && {
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: filteredProducts.length,
        itemListElement: filteredProducts.slice(0, 8).map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://canvera.com/products/${p.slug}`,
          name: p.name,
        })),
      },
    }),
  };

  return (
    <div className="collections-page">
      <SEOMeta
        title={collectionTitle}
        description={collectionDesc}
        canonical={collectionUrl}
        og={{ url: collectionUrl }}
        schema={[collectionSchema]}
        breadcrumb={[
          { name: 'Home',        url: 'https://canvera.com/' },
          { name: 'Collections', url: 'https://canvera.com/collections' },
          ...(activeCollection ? [{ name: activeCollection.name, url: collectionUrl }] : []),
        ]}
      />
      <Breadcrumb />

      {/* Hero */}
      <section className="collections-hero">
        <div className="collections-hero__inner">
          <p className="collections-hero__eyebrow">Our Collections</p>
          <h1 className="collections-hero__headline">
            <span className="collections-hero__line1">Crafted with intention,</span>
            <span className="collections-hero__line2">designed to endure.</span>
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeSlug || 'all'}
              className="collections-hero__sub"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {activeCollection
                ? activeCollection.description
                : `${collections.length} collections. Every material. One standard.`}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* Collection chip filters */}
      <div className="collections-chips">
        <div className="collections-chips__inner">
          <button
            className={`collections-chip ${!activeSlug ? 'collections-chip--active' : ''}`}
            onClick={() => handleSelect(null)}
          >
            All
            <span className="collections-chip__count">{products.length}</span>
          </button>
          {collections.map(col => (
            <button
              key={col.slug}
              className={`collections-chip ${activeSlug === col.slug ? 'collections-chip--active' : ''}`}
              onClick={() => handleSelect(col.slug)}
            >
              {col.name}
              <span className="collections-chip__count">{col.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Product grid — full width */}
      <div className="collections-content">
        <div className="collections-content__meta">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeSlug || 'all'}
              className="collections-content__title"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.18 }}
            >
              {activeCollection ? activeCollection.name : 'All Collections'}
            </motion.span>
          </AnimatePresence>
          <span className="collections-content__count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlug || 'all'}
            className="collections-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="collections-empty">
                <p>No products in this collection yet.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
