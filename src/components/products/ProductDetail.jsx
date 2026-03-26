import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import ProductCard from '../home/ProductCard'
import ProductDetailTabs from './ProductDetailTabs'
import { useCompare } from '../../context/CompareContext'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import products from '../../data/products'
import { getProductImages, getProductThumbnail } from '../../data/productImages'
import { getStartingPrice } from '../../data/pdpPricing'
import { sizeLabels, bindingDescriptions } from '../../data/pdpOptions'
import '../../styles/product-detail.css'

/* ── SVG Icons (inline, no deps) ── */
function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="var(--brand-teal)">
      <path d="M7 1l1.76 3.57 3.94.57-2.85 2.78.67 3.93L7 10.07l-3.52 1.78.67-3.93L1.3 5.14l3.94-.57L7 1z" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CompareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2v12M12 2v12M1 5h6M9 11h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L2 3v4c0 3.3 2.1 5.4 5 6 2.9-.6 5-2.7 5-6V3L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 7l1.5 1.5L9 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 3h8v6H1zM9 5h2.5L13 7.5V9h-4V5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="3.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3" y="6" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 6V4a2 2 0 114 0v2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 1h2l2 9h8l2-6H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="13" r="1" fill="currentColor" /><circle cx="12" cy="13" r="1" fill="currentColor" />
    </svg>
  )
}

/* ── Image Gallery ── */
function ProductImageGallery({ product }) {
  const images = getProductImages(product.slug)
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const hasImages = images.length > 0

  // Reset when product changes
  useEffect(() => {
    setActiveIdx(0)
    setImgLoaded(false)
  }, [product.slug])

  const goTo = useCallback((idx) => {
    setImgLoaded(false)
    setActiveIdx(idx)
  }, [])

  const goPrev = useCallback(() => {
    setImgLoaded(false)
    setActiveIdx(i => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    setImgLoaded(false)
    setActiveIdx(i => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  // Keyboard nav in lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, goPrev, goNext])

  if (!hasImages) {
    return (
      <div className="pdp-gallery">
        <div className="pdp-gallery__main pdp-gallery__placeholder">
          <div className="pdp-gallery__placeholder-inner">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="4" y="8" width="56" height="48" rx="6" stroke="var(--text-tertiary)" strokeWidth="2" />
              <circle cx="22" cy="26" r="6" stroke="var(--text-tertiary)" strokeWidth="2" />
              <path d="M4 42l16-12 10 8 14-14 16 12" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>No images available</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pdp-gallery">
      {/* Main image */}
      <div className="pdp-gallery__main" onClick={() => setLightboxOpen(true)} role="button" tabIndex={0} aria-label="Open fullscreen image">
        <div className="pdp-gallery__img-wrap">
          <img
            key={images[activeIdx]}
            src={images[activeIdx]}
            alt={`${product.name} - image ${activeIdx + 1}`}
            className={`pdp-gallery__hero${imgLoaded ? ' pdp-gallery__hero--loaded' : ''}`}
            onLoad={() => setImgLoaded(true)}
            draggable={false}
          />
        </div>
        {images.length > 1 && (
          <div className="pdp-gallery__counter badge-glass">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="pdp-gallery__thumbs">
          {images.map((src, i) => (
            <button
              key={i}
              className={`pdp-gallery__thumb${i === activeIdx ? ' pdp-gallery__thumb--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" draggable={false} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="pdp-lightbox" onClick={() => setLightboxOpen(false)}>
          <div className="pdp-lightbox__inner" onClick={(e) => e.stopPropagation()}>
            <button className="pdp-lightbox__close" onClick={() => setLightboxOpen(false)} aria-label="Close lightbox">
              <CloseIcon />
            </button>
            {images.length > 1 && (
              <button className="pdp-lightbox__arrow pdp-lightbox__arrow--prev" onClick={goPrev} aria-label="Previous image">
                <ChevronLeft />
              </button>
            )}
            <img
              src={images[activeIdx]}
              alt={`${product.name} - image ${activeIdx + 1}`}
              className="pdp-lightbox__img"
            />
            {images.length > 1 && (
              <button className="pdp-lightbox__arrow pdp-lightbox__arrow--next" onClick={goNext} aria-label="Next image">
                <ChevronRight />
              </button>
            )}
            <div className="pdp-lightbox__counter">
              {activeIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main PDP Component ── */
export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isInCompare, addToCompare, removeFromCompare, isCompareFull } = useCompare()
  const { isRegistered, isVerified } = useAuth()
  const { addToCart, showToast } = useCart()

  const product = useMemo(() => products.find(p => p.slug === slug), [slug])

  // PDP local selection state
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedOrientation, setSelectedOrientation] = useState(null)
  const [selectedBinding, setSelectedBinding] = useState(null)
  const [addedToCart, setAddedToCart] = useState(false)

  // Initialize selectors when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null)
      setSelectedOrientation(product.orientations?.[0] || null)
      setSelectedBinding(product.bindings?.[0] || null)
      setAddedToCart(false)
    }
  }, [product])

  const startingPrice = useMemo(() => {
    if (!product) return null
    return getStartingPrice(product.id)
  }, [product])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [product])

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  const buildInitialConfig = useCallback(() => ({
    size: selectedSize,
    orientation: selectedOrientation,
    binding: selectedBinding,
    price: startingPrice || 0,
  }), [selectedSize, selectedOrientation, selectedBinding, startingPrice])

  const handleOrderNow = () => {
    if (!isRegistered) {
      navigate('/login')
      return
    }
    const config = buildInitialConfig()
    addToCart(product, config, 'new')
    navigate(`/order/${slug}`, { state: { size: selectedSize, orientation: selectedOrientation, binding: selectedBinding } })
  }

  const handleAddToCart = () => {
    if (!isRegistered) {
      navigate('/login')
      return
    }
    const config = buildInitialConfig()
    addToCart(product, config, 'new')
    showToast('Added to cart')
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleCompareToggle = () => {
    if (!product) return
    if (isInCompare(product.id)) {
      removeFromCompare(product.id)
    } else if (!isCompareFull) {
      addToCompare(product)
    }
  }

  // Spec mini-cards data
  const specCards = useMemo(() => {
    if (!product) return []
    const cards = []
    if (product.sizes?.length) {
      cards.push({
        label: 'Sizes',
        value: product.sizes.map(s => sizeLabels[s]?.label || s).join(', ')
      })
    }
    if (product.bindings?.length) {
      cards.push({
        label: 'Binding',
        value: product.bindings.join(', ')
      })
    }
    if (product.material) {
      cards.push({ label: 'Material', value: product.material })
    }
    if (product.occasions?.length) {
      cards.push({
        label: 'Occasions',
        value: product.occasions.slice(0, 2).map(o => o.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')
      })
    }
    return cards.slice(0, 4)
  }, [product])

  /* ── 404 state ── */
  if (!product) {
    return (
      <div className="pdp">
        <div className="container">
          <div className="pdp__not-found">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="var(--border-default)" strokeWidth="2" />
              <path d="M18 18l12 12M30 18L18 30" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h1>Product Not Found</h1>
            <p>The product you are looking for does not exist or has been removed.</p>
            <Link to="/shop" className="btn btn-primary">Browse All Products</Link>
          </div>
        </div>
      </div>
    )
  }

  const comparing = isInCompare(product.id)
  const hasSizes = product.sizes?.length > 0
  const hasOrientations = product.orientations?.length > 0
  const hasBindings = product.bindings?.length > 0

  return (
    <div className="pdp">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pdp__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="pdp__breadcrumb-sep">/</span>
          <Link to="/shop">Shop</Link>
          <span className="pdp__breadcrumb-sep">/</span>
          <span className="pdp__breadcrumb-current">{product.name}</span>
        </nav>

        {/* Two-column layout */}
        <div className="pdp__layout">
          {/* Left: Gallery */}
          <div className="pdp__gallery-col">
            <ProductImageGallery product={product} />
          </div>

          {/* Right: Product info (sticky) */}
          <div className="pdp__info-col">
            <div className="pdp__info">
              {/* Collection tag */}
              {product.tag && (
                <span className="pdp__collection-tag">{product.tag}</span>
              )}

              {/* Product name */}
              <h1 className="pdp__name">{product.name}</h1>

              {/* Rating */}
              {product.rating && (
                <div className="pdp__rating">
                  <StarIcon />
                  <span className="pdp__rating-num">{product.rating}</span>
                  <span className="pdp__rating-count">({product.reviewCount} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="pdp__price-section">
                {isRegistered && startingPrice ? (
                  <span className="pdp__price">
                    From &#x20B9;{startingPrice.toLocaleString('en-IN')}
                  </span>
                ) : (
                  <Link to="/login" className="pdp__price-login">
                    Sign in to see pricing
                  </Link>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="pdp__description">{product.description}</p>
              )}

              {/* Divider */}
              <hr className="pdp__divider" />

              {/* ── Size Selector ── */}
              {hasSizes && (
                <div className="pdp__selector">
                  <span className="pdp__selector-label">Size</span>
                  <div className="pdp__selector-pills">
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        className={`pdp__pill${selectedSize === s ? ' pdp__pill--active' : ''}`}
                        onClick={() => setSelectedSize(s)}
                      >
                        {sizeLabels[s]?.label || s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Orientation Selector ── */}
              {hasOrientations && (
                <div className="pdp__selector">
                  <span className="pdp__selector-label">Orientation</span>
                  <div className="pdp__selector-cards">
                    {product.orientations.map(o => (
                      <button
                        key={o}
                        className={`pdp__option-card${selectedOrientation === o ? ' pdp__option-card--active' : ''}`}
                        onClick={() => setSelectedOrientation(o)}
                      >
                        <span className="pdp__option-card-name">{o}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Binding Selector ── */}
              {hasBindings && (
                <div className="pdp__selector">
                  <span className="pdp__selector-label">Binding</span>
                  <div className="pdp__selector-cards">
                    {product.bindings.map(b => (
                      <button
                        key={b}
                        className={`pdp__option-card${selectedBinding === b ? ' pdp__option-card--active' : ''}`}
                        onClick={() => setSelectedBinding(b)}
                      >
                        <span className="pdp__option-card-name">{b}</span>
                        {bindingDescriptions[b]?.description && (
                          <span className="pdp__option-card-desc">
                            {bindingDescriptions[b].description.slice(0, 60)}...
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider before CTAs */}
              <hr className="pdp__divider" />

              {/* ── 3 CTAs ── */}
              {isRegistered ? (
                <>
                  {/* Order Now */}
                  <button className="btn btn-primary btn-lg pdp__cta-primary" onClick={handleOrderNow}>
                    Order Now <ArrowRightIcon />
                  </button>

                  {/* Add to Cart */}
                  <button className="btn btn-secondary pdp__cta-add-cart" onClick={handleAddToCart}>
                    <CartIcon />
                    {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-lg pdp__cta-primary" onClick={() => navigate('/login')}>
                    Sign In to Order <ArrowRightIcon />
                  </button>
                  <p className="pdp__signin-note">Sign in to see pricing and place orders</p>
                </>
              )}

              {/* Add to Compare */}
              <button
                className={`btn btn-ghost pdp__cta-compare${comparing ? ' pdp__cta-compare--active' : ''}`}
                onClick={handleCompareToggle}
                disabled={!comparing && isCompareFull}
              >
                <CompareIcon />
                {comparing ? 'Remove from Compare' : 'Add to Compare'}
              </button>

              {/* Spec mini-cards */}
              {specCards.length > 0 && (
                <div className="pdp__specs-grid">
                  {specCards.map((spec, i) => (
                    <div key={i} className="pdp__spec-card">
                      <span className="pdp__spec-label">{spec.label}</span>
                      <span className="pdp__spec-value">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Trust signals */}
              <div className="pdp__trust">
                <span className="pdp__trust-item">
                  <ShieldIcon />
                  Quality Guaranteed
                </span>
                <span className="pdp__trust-sep">|</span>
                <span className="pdp__trust-item">
                  <TruckIcon />
                  Pan-India Delivery
                </span>
                <span className="pdp__trust-sep">|</span>
                <span className="pdp__trust-item">
                  <LockIcon />
                  Secure Checkout
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Below fold: Accordion details */}
        <hr className="pdp__divider pdp__divider--section" />
        <ProductDetailTabs product={product} />

        {/* You May Also Like */}
        {related.length > 0 && (
          <section className="pdp__related">
            <div className="pdp__related-header">
              <h2 className="heading-lg">You May Also Like</h2>
              <Link to="/shop" className="link-arrow">
                View All
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="pdp__related-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} showCompare listingMode />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
