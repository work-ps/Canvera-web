import { useParams, Link } from 'react-router-dom'
import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import StarRating from '../ui/StarRating'
import ProductCard from '../home/ProductCard'
import ProductShowcase from './ProductShowcase'
import { useCompare } from '../../context/CompareContext'
import products from '../../data/products'
import '../../styles/product-detail.css'
import '../../styles/product-showcase.css'
import '../../styles/popular-products.css'

const productSvgs = {
  petrol: <svg viewBox="0 0 120 90" fill="none"><rect x="5" y="5" width="110" height="80" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M5 65l30-22 20 12 25-20 30 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="35" cy="35" r="10" stroke="currentColor" strokeWidth="1.5"/></svg>,
  amber: <svg viewBox="0 0 120 90" fill="none"><rect x="5" y="5" width="110" height="80" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M60 25v40M40 45h40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  warm: <svg viewBox="0 0 120 90" fill="none"><path d="M60 12c-12 0-22 4-22 4v60s10-4 22-4 22 4 22 4V16s-10-4-22-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M60 12v60" stroke="currentColor" strokeWidth="1.5"/></svg>,
  dark: <svg viewBox="0 0 120 90" fill="none"><rect x="5" y="5" width="110" height="80" rx="8" stroke="currentColor" strokeWidth="2"/><path d="M35 30l12 12-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M55 60h30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  neutral: <svg viewBox="0 0 120 90" fill="none"><rect x="10" y="5" width="100" height="80" rx="6" stroke="currentColor" strokeWidth="2"/><rect x="20" y="15" width="80" height="45" rx="4" stroke="currentColor" strokeWidth="1.5"/><path d="M20 45l20-15 12 8 18-14 18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mixed: <svg viewBox="0 0 120 90" fill="none"><rect x="15" y="8" width="90" height="74" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M30 25h60M30 38h45M30 51h52M30 64h35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  leaf: <svg viewBox="0 0 120 90" fill="none"><path d="M60 80V38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M60 38c-24-16-42 0-42 20s28 12 42-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M60 50c16-20 38-8 38 8s-24 16-38 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  deep: <svg viewBox="0 0 120 90" fill="none"><rect x="8" y="10" width="104" height="70" rx="6" stroke="currentColor" strokeWidth="2"/><path d="M8 28h104" stroke="currentColor" strokeWidth="1.5"/><path d="M30 48l16 16 34-30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { isInCompare, addToCompare, removeFromCompare, isCompareFull } = useCompare()

  const product = useMemo(() => products.find(p => p.slug === slug), [slug])

  const related = useMemo(() => {
    if (!product) return []
    const sameCategory = products.filter(p => p.category === product.category && p.id !== product.id)
    const others = products.filter(p => p.category !== product.category && p.id !== product.id)
    return [...sameCategory, ...others].slice(0, 10)
  }, [product])

  const relScrollRef = useRef(null)
  const [relCanScrollLeft, setRelCanScrollLeft] = useState(false)
  const [relScrolledEnd, setRelScrolledEnd] = useState(false)

  const updateRelScroll = useCallback(() => {
    const el = relScrollRef.current
    if (!el) return
    setRelCanScrollLeft(el.scrollLeft > 10)
    setRelScrolledEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10)
  }, [])

  useEffect(() => {
    const el = relScrollRef.current
    if (!el) return
    updateRelScroll()
    el.addEventListener('scroll', updateRelScroll, { passive: true })
    return () => el.removeEventListener('scroll', updateRelScroll)
  }, [updateRelScroll, related])

  const scrollRelated = (dir) => {
    const el = relScrollRef.current
    if (!el) return
    const card = el.querySelector('.product-card-link')
    const cardW = card ? card.getBoundingClientRect().width + 20 : 300
    el.scrollBy({ left: dir === 'left' ? -cardW : cardW, behavior: 'smooth' })
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-detail-inner" style={{ textAlign: 'center', padding: '120px 0' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--petrol-800)', marginBottom: 16 }}>Product Not Found</h1>
          <p style={{ color: 'var(--neutral-500)', marginBottom: 24 }}>The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary btn-md">Browse All Products</Link>
        </div>
      </div>
    )
  }

  const inCompare = isInCompare(product.id)
  const compareFull = isCompareFull && !inCompare

  const handleCompare = () => {
    if (inCompare) removeFromCompare(product.id)
    else if (!compareFull) addToCompare(product)
  }

  const specsRows = [
    ['Category', product.category],
    ['Type', product.tag],
    ['Material', product.material],
    ['Specifications', product.specs],
    product.sizes?.length > 0 && ['Sizes Available', product.sizes.join(', ')],
    product.orientations?.length > 0 && ['Orientations', product.orientations.join(', ')],
    product.bindings?.length > 0 && ['Bindings', product.bindings.join(', ')],
    ['Rating', `${product.rating} / 5 (${product.reviewCount}+ reviews)`],
    ['Availability', 'In Stock'],
    ['Delivery', '5–7 business days'],
    ['Design Service', 'Free included'],
  ].filter(Boolean)

  const features = product.features || []

  return (
    <div className="product-detail">
      <div className="product-detail-inner">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="product-detail-layout">
          <div className={`product-image-wrap pc-img-${product.imageVariant}`}>
            {productSvgs[product.imageVariant] || productSvgs.petrol}
          </div>

          <div className="product-info">
            <div className="product-tag">{product.tag}</div>
            <h1>{product.name}</h1>
            <div className="product-rating-row">
              <StarRating rating={product.rating} />
              <span className="pc-rating-text">
                <strong>{product.rating}</strong> ({product.reviewCount}+ reviews)
              </span>
            </div>

            <p className="product-desc">{product.description}</p>

            {features.length > 0 && (
              <div className="product-features">
                {features.map((f, i) => (
                  <span key={i} className="feature-tag">
                    <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </span>
                ))}
              </div>
            )}

            <div className="product-price-box">
              <h3>Login to See Pricing</h3>
              <p>Exclusive pricing for registered photographers. Sign in or create a free account to view prices and place orders.</p>
              <div className="price-ctas">
                <Link to="/login" className="btn btn-primary btn-md">Sign In</Link>
                <Link to="/register" className="btn btn-outline btn-md">Create Free Account</Link>
              </div>
            </div>

            <button
              className={`btn btn-outline btn-md compare-detail-btn${inCompare ? ' compare-active' : ''}`}
              onClick={handleCompare}
              disabled={compareFull}
              title={compareFull ? 'Maximum 4 products can be compared' : ''}
            >
              {inCompare ? (
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                  <path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                  <rect x="1" y="4" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  <rect x="8" y="3" width="7" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              )}
              {inCompare ? 'Remove from Compare' : 'Add to Compare'}
            </button>

            <div className="product-specs">
              <h3>Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {specsRows.map(([label, value], i) => (
                    <tr key={i}>
                      <td>{label}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Interactive Product Showcase */}
        <ProductShowcase product={product} />

        {related.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className={`related-scroll-wrap${relCanScrollLeft ? ' can-scroll-left' : ''}${relScrolledEnd ? ' scrolled-end' : ''}`}>
              <div className="related-scroll" ref={relScrollRef}>
                <div className="related-scroll-track">
                  {related.map(p => (
                    <ProductCard key={p.id} product={p} showCompare listingMode />
                  ))}
                </div>
              </div>
              {related.length > 3 && (
                <>
                  <button
                    className={`scroll-arrow scroll-left${!relCanScrollLeft ? ' hidden' : ''}`}
                    onClick={() => scrollRelated('left')}
                    aria-label="Scroll left"
                  >
                    <svg viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button
                    className={`scroll-arrow scroll-right${relScrolledEnd ? ' hidden' : ''}`}
                    onClick={() => scrollRelated('right')}
                    aria-label="Scroll right"
                  >
                    <svg viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
