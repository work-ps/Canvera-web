import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompare } from '../../context/CompareContext'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getStartingPrice } from '../../data/pdpPricing'
import { getProductImages, getProductThumbnail } from '../../data/productImages'

const badgeMap = {
  bestseller: { text: 'Best Seller' },
  new: { text: 'New' },
  popular: { text: 'Popular' },
  eco: { text: 'Eco' },
}

export default function ProductCard({ product, showCompare = false, listingMode = false }) {
  const { isInCompare, addToCompare, removeFromCompare, isCompareFull } = useCompare()
  const { isRegistered, isVerified } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const badge = product.badge ? badgeMap[product.badge] : null
  const startingPrice = isRegistered ? getStartingPrice(product.id) : null
  const inCompare = showCompare && isInCompare(product.id)
  const compareFull = showCompare && isCompareFull && !inCompare

  const [isHovered, setIsHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const intervalRef = useRef(null)

  const realImages = getProductImages(product.slug)
  const thumbnail = getProductThumbnail(product.slug)
  const hasImages = realImages.length > 0

  // Carousel on hover for listing mode
  useEffect(() => {
    if (!listingMode || !hasImages) return
    if (isHovered && realImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % realImages.length)
      }, 1800)
    } else {
      clearInterval(intervalRef.current)
      setSlideIndex(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [isHovered, listingMode, hasImages, realImages.length])

  const handleCTAClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isVerified) {
      addToCart(product, { size: product.sizes?.[0], orientation: product.orientations?.[0], binding: product.bindings?.[0], price: startingPrice || 0 }, 'new')
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    } else {
      navigate('/login')
    }
  }

  const handleCompareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    inCompare ? removeFromCompare(product.id) : !compareFull && addToCompare(product)
  }

  // Gradient fallback colors based on imageVariant
  const gradients = {
    petrol: 'linear-gradient(135deg, #EBF5FA 0%, #CCE9F5 100%)',
    amber: 'linear-gradient(135deg, #FDF8ED 0%, #F5DBA6 100%)',
    warm: 'linear-gradient(135deg, #F7F4F0 0%, #EDE5DA 100%)',
    dark: 'linear-gradient(135deg, #F0F3F5 0%, #E2E8EC 100%)',
    neutral: 'linear-gradient(135deg, #F7F8F9 0%, #E2E8EC 100%)',
    mixed: 'linear-gradient(135deg, #F2FBFA 0%, #EBF5FA 100%)',
    leaf: 'linear-gradient(135deg, #F2FBFA 0%, #CCF0EC 100%)',
    deep: 'linear-gradient(135deg, #F0F3F5 0%, #CCE9F5 100%)',
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="pc"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <div className="pc-image-wrap">
        {/* Skeleton */}
        {!imgLoaded && hasImages && <div className="pc-skeleton skeleton" />}

        {/* Real image(s) */}
        {hasImages ? (
          listingMode && realImages.length > 1 ? (
            realImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${product.name} ${i + 1}`}
                className={`pc-img ${i === slideIndex ? 'pc-img-active' : ''}`}
                loading="lazy"
                onLoad={i === 0 ? () => setImgLoaded(true) : undefined}
              />
            ))
          ) : (
            <img
              src={thumbnail}
              alt={product.name}
              className="pc-img pc-img-active"
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
            />
          )
        ) : (
          <div className="pc-placeholder" style={{ background: gradients[product.imageVariant] || gradients.neutral }} />
        )}

        {/* Image zoom on hover */}
        <div className={`pc-img-zoom ${isHovered ? 'pc-img-zoomed' : ''}`} />

        {/* Badge */}
        {badge && <span className="pc-badge badge-glass">{badge.text}</span>}

        {/* Compare toggle */}
        {showCompare && (
          <button
            className={`pc-compare ${inCompare ? 'pc-compare-on' : ''} ${compareFull ? 'pc-compare-full' : ''}`}
            onClick={handleCompareClick}
            aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            {inCompare ? (
              <svg viewBox="0 0 16 16" fill="none"><path d="M4.5 8L7 10.5L11.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="none"><path d="M2.5 5h11M5 2.5v11M2.5 8h11M5 5.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0"/><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.3"/></svg>
            )}
          </button>
        )}

        {/* Dot indicators for listing carousel */}
        {listingMode && isHovered && realImages.length > 1 && (
          <div className="pc-dots">
            {realImages.slice(0, 5).map((_, i) => (
              <span key={i} className={`pc-dot ${i === slideIndex % 5 ? 'pc-dot-on' : ''}`} />
            ))}
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="pc-info">
        <span className="pc-collection">{product.tag}</span>
        <h3 className="pc-name">{product.name}</h3>

        {listingMode && product.rating && (
          <div className="pc-rating">
            <svg viewBox="0 0 12 12" fill="var(--brand-teal)" width="12" height="12">
              <path d="M6 .5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L6 9.52 2.48 11.35l.67-3.93L.3 4.64l3.94-.57z"/>
            </svg>
            <span>{product.rating}</span>
            <span className="pc-review-count">({product.reviewCount})</span>
          </div>
        )}

        {startingPrice ? (
          <div className="pc-price">From &#x20B9;{startingPrice.toLocaleString('en-IN')}</div>
        ) : (
          <div className="pc-price pc-price-login">Sign in for pricing</div>
        )}

        {/* Listing mode: hover CTA */}
        {listingMode && (
          <button
            className={`pc-cta ${isHovered ? 'pc-cta-visible' : ''}`}
            onClick={handleCTAClick}
          >
            {addedToCart ? 'Added ✓' : isVerified ? 'Add to Cart' : 'Sign in to Order'}
          </button>
        )}
      </div>
    </Link>
  )
}

/* SVG placeholders exported for other components (CompareBar, Finder, etc.) */
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
    </svg>
  ),
  warm: (
    <svg viewBox="0 0 56 42" fill="none">
      <path d="M28 6c-6 0-10 2-10 2v28s4-2 10-2 10 2 10 2V8s-4-2-10-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M28 6v28" stroke="currentColor" strokeWidth="1"/>
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
    </svg>
  ),
  mixed: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="8" y="4" width="40" height="34" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 12h28M14 18h20M14 24h24M14 30h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  leaf: (
    <svg viewBox="0 0 56 42" fill="none">
      <path d="M28 38V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M28 18c-12-8-20 0-20 10s14 6 20-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  deep: (
    <svg viewBox="0 0 56 42" fill="none">
      <rect x="4" y="5" width="48" height="32" rx="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 22l8 8 16-14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

export { badgeMap, productSvgs }
