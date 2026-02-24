import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import products from '../../data/products'
import occasions from '../../data/occasions'
import '../../styles/categories.css'
import '../../styles/popular-products.css'

export default function ShopByOccasion() {
  const [selectedOccasion, setSelectedOccasion] = useState(occasions[0].id)
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

  const occasionData = occasions.find(o => o.id === selectedOccasion)
  const occasionProducts = occasionData
    ? occasionData.productIds
        .map(id => products.find(p => p.id === id))
        .filter(Boolean)
        .slice(0, 8)
    : []

  const getScrollStep = () => {
    const card = scrollRef.current?.querySelector('.product-card-link')
    if (!card) return 340
    const gap = parseFloat(getComputedStyle(scrollRef.current.querySelector('.products-scroll-track')).gap) || 24
    return card.offsetWidth + gap
  }

  const updateArrows = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 4)
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows)
    window.addEventListener('resize', updateArrows)
    updateArrows()
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  // Reset scroll when occasion changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0 })
    }
    // Small delay to let DOM update, then recalculate arrows
    const t = setTimeout(updateArrows, 50)
    return () => clearTimeout(t)
  }, [selectedOccasion, updateArrows])

  const doScrollLeft = () => scrollRef.current?.scrollBy({ left: -getScrollStep(), behavior: 'smooth' })
  const doScrollRight = () => scrollRef.current?.scrollBy({ left: getScrollStep(), behavior: 'smooth' })

  const wrapCls = `products-scroll-wrap${canScrollLeft ? ' can-scroll-left' : ''}${atEnd ? ' scrolled-end' : ''}`

  return (
    <section className="occasion-section">
      <div className="occasion-inner">
        <div className="occasion-header">
          <div>
            <div className="section-label">Explore Categories</div>
            <h2 className="section-title">Shop By Occasion</h2>
          </div>
          <div className="occasion-help">
            <span>Need help choosing?</span>
            <Link to="/contact" className="specialist-link">
              Connect with us
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>

        <div className="occasion-controls">
          <div className="occasion-tags">
            {occasions.map(occasion => (
              <button
                key={occasion.id}
                className={`occasion-tag${selectedOccasion === occasion.id ? ' active' : ''}`}
                onClick={() => setSelectedOccasion(occasion.id)}
              >
                {occasion.name}
              </button>
            ))}
          </div>
        </div>

        <div className={wrapCls}>
          <button className={`scroll-arrow scroll-left${!canScrollLeft ? ' hidden' : ''}`} onClick={doScrollLeft} aria-label="Scroll left">
            <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="products-scroll" ref={scrollRef}>
            <div className="products-scroll-track">
              {occasionProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <button className={`scroll-arrow scroll-right${atEnd ? ' hidden' : ''}`} onClick={doScrollRight} aria-label="Scroll right">
            <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}
