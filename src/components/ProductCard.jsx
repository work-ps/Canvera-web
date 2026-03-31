import { useState } from 'react';
import { motion } from 'framer-motion';
import './ProductCard.css';

const badgeLabels = {
  bestseller: 'Bestseller',
  new: 'New',
  popular: 'Popular',
  limited: 'Limited',
};

export default function ProductCard({ product, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0, 0, 0.2, 1] }}
      whileHover={{ y: -2 }}
    >
      <a href={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__image-container">
          {product.badge && (
            <span className={`product-card__badge product-card__badge--${product.badge}`}>
              {badgeLabels[product.badge]}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`product-card__image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>

        <div className="product-card__info">
          <span className="product-card__tag">{product.tag}</span>
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__meta">
            <div className="product-card__rating">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--warning)" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>{product.rating}</span>
              <span className="product-card__reviews">({product.reviewCount})</span>
            </div>
          </div>
          <p className="product-card__specs">{product.specs}</p>
          <p className="product-card__price-hint">Sign in to unlock pricing</p>
        </div>
      </a>
    </motion.div>
  );
}
