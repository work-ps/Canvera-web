import { Link } from 'react-router-dom'
import StarRating from '../ui/StarRating'

const badgeMap = {
  bestseller: { cls: 'pc-badge-bestseller', text: 'Best Seller' },
  new: { cls: 'pc-badge-new', text: 'New Launch' },
  popular: { cls: 'pc-badge-popular', text: 'Popular' },
  eco: { cls: 'pc-badge-eco', text: 'Eco Friendly' },
}

const productSvgs = {
  petrol: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="3" y="3" width="50" height="36" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 30l15-11 10 6 12-10 13 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="17" cy="16" r="5" stroke="currentColor" strokeWidth="1.2"/>
    </svg>
  ),
  amber: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="3" y="3" width="50" height="36" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M28 12v18M19 21h18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <rect x="13" y="8" width="30" height="26" rx="2" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2"/>
    </svg>
  ),
  warm: (
    <svg viewBox="0 0 56 42" fill="none">
      <path d="M28 6c-6 0-10 2-10 2v28s4-2 10-2 10 2 10 2V8s-4-2-10-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M28 6v28" stroke="currentColor" strokeWidth="1"/>
      <path d="M8 10c4-2 10-3 20-3M8 10v26s6-2 20-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M48 10c-4-2-10-3-20-3M48 10v26s-6-2-20-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="3" y="3" width="50" height="36" rx="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 14l6 6-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M26 28h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  neutral: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="6" y="3" width="44" height="36" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="12" y="9" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M12 22l10-7 6 4 8-6 8 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 34h20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  mixed: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="8" y="4" width="40" height="34" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 12h28M14 18h20M14 24h24M14 30h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <rect x="36" y="16" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 56 42" fill="none">
      <path d="M28 38V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M28 18c-12-8-20 0-20 10s14 6 20-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 24c8-10 18-4 18 4s-12 8-18 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  deep: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="4" y="5" width="48" height="32" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 14h48" stroke="currentColor" strokeWidth="1"/>
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="16" cy="10" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="22" cy="10" r="2" fill="currentColor" opacity="0.4"/>
      <path d="M14 22l8 8 16-14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

export default function ProductCard({ product }) {
  const badge = product.badge ? badgeMap[product.badge] : null

  return (
    <div className="product-card">
      <div className={`pc-image pc-img-${product.imageVariant}`}>
        {badge && <span className={`pc-badge ${badge.cls}`}>{badge.text}</span>}
        {productSvgs[product.imageVariant] || productSvgs.petrol}
      </div>
      <div className="pc-body">
        <div className="pc-tag">{product.tag}</div>
        <div className="pc-name">{product.name}</div>
        <div className="pc-rating">
          <StarRating rating={product.rating} />
          <span className="pc-rating-text">
            <strong>{product.rating}</strong> ({product.reviewCount}+ reviews)
          </span>
        </div>
        <Link to={`/products/${product.slug}`} className="pc-cta">
          Learn More
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </div>
  )
}
