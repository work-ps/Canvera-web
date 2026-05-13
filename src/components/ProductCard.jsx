import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const BADGE_LABELS = {
  bestseller: 'Bestseller',
  new:        'New Launch',
  popular:    'Popular',
  limited:    'Limited',
};

export default function ProductCard({ product, index = 0 }) {
  const [loaded, setLoaded] = useState(false);
  const occasions = (product.occasions || []).slice(0, 2);

  return (
    <Link
      to={`/products/${product.slug}`}
      className="pcard"
      style={{ '--i': index }}
      draggable={false}
    >
      {/* ── Image ─────────────────────────────────── */}
      <div className="pcard__image">
        <img
          src={product.image}
          alt={product.name}
          className={`pcard__img${loaded ? ' loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          draggable={false}
        />

        {/* Badge — top-left */}
        {product.badge && (
          <span className={`pcard__badge pcard__badge--${product.badge}`}>
            {BADGE_LABELS[product.badge]}
          </span>
        )}

        {/* Rating pill — bottom-left */}
        {product.rating && (
          <div className="pcard__rating" aria-label={`Rated ${product.rating}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#F5A623" stroke="none" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="pcard__rating-val">{product.rating}</span>
            {product.reviewCount && (
              <span className="pcard__rating-count">({product.reviewCount.toLocaleString()})</span>
            )}
          </div>
        )}
      </div>

      {/* ── Body ──────────────────────────────────── */}
      <div className="pcard__body">
        {product.collection && (
          <p className="pcard__collection">{product.collection}</p>
        )}
        <h3 className="pcard__name">{product.name}</h3>

        {occasions.length > 0 && (
          <div className="pcard__occasions">
            {occasions.map(occ => (
              <span key={occ} className="pcard__occ-tag">{occ}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
