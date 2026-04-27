import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDisplayPrice, formatINR } from '../utils/pricing';
import './ProductCard.css';

const BADGE_LABELS = {
  bestseller: 'Bestseller',
  new:        'New Launch',
  popular:    'Popular',
  limited:    'Limited',
};

export default function ProductCard({ product, index = 0 }) {
  const { isLoggedIn, isVerified } = useAuth();
  const [loaded, setLoaded]   = useState(false);

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

        {isLoggedIn ? (
          <p className="pcard__price">
            From{' '}
            <strong>{formatINR(getDisplayPrice(product.price, isVerified))}</strong>
          </p>
        ) : (
          <p className="pcard__price pcard__price--locked">
            <svg
              width="11" height="11" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Sign in to view price
          </p>
        )}
      </div>
    </Link>
  );
}
