import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCompare } from '../../context/CompareContext'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { getStartingPrice } from '../../data/pdpPricing'
import productSlides from '../../data/productSlides'
import { getProductImages, getProductThumbnail } from '../../data/productImages'

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

export { productSvgs, badgeMap }

export default function ProductCard({ product, showCompare = false, listingMode = false }) {
  const { isInCompare, addToCompare, removeFromCompare, isCompareFull, compareList } = useCompare()
  const { isRegistered, isVerified } = useAuth()
  const { addToCart } = useCart()
  const badge = product.badge ? badgeMap[product.badge] : null
  const startingPrice = isRegistered ? getStartingPrice(product.id) : null
  const inCompare = showCompare && isInCompare(product.id)
  const compareFull = showCompare && isCompareFull && !inCompare
  const compareMode = listingMode && compareList.length > 0

  /* ---- Carousel state (listing mode only) ---- */
  const [slideIndex, setSlideIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!listingMode) return
    if (isHovered) {
      intervalRef.current = setInterval(() => {
        setSlideIndex(prev => (prev + 1) % productSlides.length)
      }, 1500)
    } else {
      clearInterval(intervalRef.current)
      setSlideIndex(0)
    }
    return () => clearInterval(intervalRef.current)
  }, [isHovered, listingMode])

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  const navigate = useNavigate()

  /* ---- Login / Add-to-cart CTA click (listing mode) ---- */
  const [addedToCart, setAddedToCart] = useState(false)
  const handleCTAClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isVerified) {
      addToCart(product, { size: product.sizes?.[0] || null, orientation: product.orientations?.[0] || null, binding: product.bindings?.[0] || null, complete: false, price: startingPrice || 0 })
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 1500)
    } else {
      navigate('/login')
    }
  }

  /* ---- Compare click ---- */
  const handleCompareClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (inCompare) {
      removeFromCompare(product.id)
    } else if (!compareFull) {
      addToCompare(product)
    }
  }

  /* ---- Resolve images for this product ---- */
  const defaultSvg = productSvgs[product.imageVariant] || productSvgs.petrol
  const realImages = getProductImages(product.slug)
  const thumbnail = getProductThumbnail(product.slug)
  const hasRealImages = realImages.length > 0

  /* ---- Listing-mode carousel: use real images if available ---- */
  const listingSlides = hasRealImages ? realImages.slice(0, 5) : productSlides

  return (
    <Link to={`/product/${product.slug}`} className="product-card-link">
      <div
        className={`product-card${listingMode ? ' pc-listing-mode' : ''}${compareMode ? ' pc-compare-mode' : ''}`}
        onMouseEnter={listingMode ? handleMouseEnter : undefined}
        onMouseLeave={listingMode ? handleMouseLeave : undefined}
      >
        {/* ==================== IMAGE AREA ==================== */}
        <div className={`pc-image${hasRealImages ? ' pc-has-photo' : ` pc-img-${product.imageVariant}`}`}>
          {/* Badge (top-left) */}
          {badge && <span className={`pc-badge ${badge.cls}`}>{badge.text}</span>}

          {/* Compare toggle */}
          {showCompare && (
            <button
              className={`pc-compare-toggle${listingMode ? ' pc-compare-square' : ''}${inCompare ? ' pc-compare-active' : ''}${compareFull ? ' pc-compare-disabled' : ''}`}
              onClick={handleCompareClick}
              aria-label={inCompare ? 'Remove from compare' : 'Add to compare'}
              title={compareFull ? 'Maximum 4 products' : inCompare ? 'Remove from compare' : 'Compare'}
            >
              {inCompare ? (
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M4.5 8L7 10.5L11.5 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              )}
            </button>
          )}

          {/* Carousel slides (listing mode) OR static image/SVG (default) */}
          {listingMode ? (
            <div className="pc-carousel-wrap">
              {listingSlides.map((slide, i) => (
                <div
                  key={i}
                  className={`pc-slide${i === slideIndex ? ' pc-slide-active' : ''}`}
                >
                  {typeof slide === 'string' ? (
                    <img src={slide} alt={`${product.name} ${i + 1}`} className="pc-slide-img" loading="lazy" />
                  ) : (
                    slide === null ? defaultSvg : slide
                  )}
                </div>
              ))}
            </div>
          ) : hasRealImages ? (
            <img
              src={thumbnail}
              alt={product.name}
              className="pc-product-photo"
              loading="lazy"
            />
          ) : (
            defaultSvg
          )}

          {/* Hover overlay with product name (default mode only) */}
          {!listingMode && (
            <div className="pc-image-overlay">
              <span className="pc-overlay-name">{product.name}</span>
              <span className="pc-overlay-cta">View Details
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          )}

          {/* Dot indicators (listing mode, on hover) */}
          {listingMode && isHovered && (
            <div className="pc-dots">
              {listingSlides.map((_, i) => (
                <span key={i} className={`pc-dot${i === slideIndex ? ' pc-dot-active' : ''}`} />
              ))}
            </div>
          )}

          {/* Rating pill (listing mode, bottom-left) */}
          {listingMode && product.rating && (
            <div className="pc-rating-pill">
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 .5l1.76 3.57 3.94.57-2.85 2.78.67 3.93L6 9.52 2.48 11.35l.67-3.93L.3 4.64l3.94-.57z"/>
              </svg>
              <span>{product.rating}</span>
              <span className="pc-rating-count">({product.reviewCount})</span>
            </div>
          )}
        </div>

        {/* ==================== BODY AREA ==================== */}
        {listingMode ? (
          <div className="pc-body pc-body-listing">
            {/* Default: tag + clamped name + price */}
            <div className="pc-body-default">
              <div className="pc-tag">{product.tag}</div>
              <div className="pc-name pc-name-clamped">{product.name}</div>
              {startingPrice && (
                <div className="pc-price">Starting from &#x20B9;{startingPrice.toLocaleString('en-IN')}</div>
              )}
            </div>
            {/* Hover: cart / login CTA */}
            <div className={`pc-body-hover${isVerified ? ' pc-body-hover--authed' : ''}`} onClick={handleCTAClick}>
              {isVerified ? (
                <>
                  <svg className="pc-cart-icon" viewBox="0 0 16 16" fill="none">
                    <path d="M1 1h2l2 9h8l2-6H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="6" cy="13" r="1" fill="currentColor"/>
                    <circle cx="12" cy="13" r="1" fill="currentColor"/>
                  </svg>
                  <span className="pc-login-cta">{addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}</span>
                </>
              ) : (
                <>
                  <svg className="pc-lock-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <span className="pc-login-cta">Login to add to cart</span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="pc-body">
            <div className="pc-tag">{product.tag}</div>
            <div className="pc-name">{product.name}</div>
            <div className="pc-specs">{product.specs}</div>
            {startingPrice && (
              <div className="pc-price">Starting from &#x20B9;{startingPrice.toLocaleString('en-IN')}</div>
            )}
            <span className="pc-arrow">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        )}
      </div>
    </Link>
  )
}
