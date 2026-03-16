import { useRef, useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import collections from '../../data/collections'
import '../../styles/explore-collections.css'

const variantGradients = {
  petrol:  'linear-gradient(155deg, #0A6E7E 0%, #003A54 100%)',
  amber:   'linear-gradient(155deg, #9B7418 0%, #5C3A0A 100%)',
  warm:    'linear-gradient(155deg, #8A6C4A 0%, #4A3520 100%)',
  dark:    'linear-gradient(155deg, #4A4A4A 0%, #1A1A1A 100%)',
  neutral: 'linear-gradient(155deg, #7B8290 0%, #374151 100%)',
  deep:    'linear-gradient(155deg, #6B4F9C 0%, #2D1B4E 100%)',
  leaf:    'linear-gradient(155deg, #1B7B5A 0%, #0A4030 100%)',
  mixed:   'linear-gradient(155deg, #7B6038 0%, #3A2D18 100%)',
}

export default function ExploreCollections() {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [atEnd, setAtEnd] = useState(false)

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

  const getScrollStep = () => {
    const card = scrollRef.current?.querySelector('.ec-card')
    if (!card) return 280
    return card.offsetWidth + 20
  }

  const doScrollLeft = () => scrollRef.current?.scrollBy({ left: -getScrollStep(), behavior: 'smooth' })
  const doScrollRight = () => scrollRef.current?.scrollBy({ left: getScrollStep(), behavior: 'smooth' })

  return (
    <section className="ec-section">
      <div className="ec-inner">
        <div className="ec-header">
          <div>
            <div className="section-label">Our Ranges</div>
            <h2 className="section-title">Explore Collections</h2>
          </div>
          <Link to="/collections" className="ec-view-all">
            View All Collections
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className={`ec-scroll-wrap${canScrollLeft ? ' can-scroll-left' : ''}${atEnd ? ' scrolled-end' : ''}`}>
          <button className={`scroll-arrow scroll-left${!canScrollLeft ? ' hidden' : ''}`} onClick={doScrollLeft} aria-label="Scroll left">
            <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="ec-scroll" ref={scrollRef}>
            <div className="ec-track">
              {collections.map(col => (
                <Link key={col.id} to={`/collections/${col.slug}`} className="ec-card">
                  <div className="ec-card-image" style={{ background: variantGradients[col.imageVariant] || variantGradients.petrol }}>
                    <span className="ec-card-name">{col.name}</span>
                    <span className="ec-card-count">{col.productNames.length} {col.productNames.length === 1 ? 'product' : 'products'}</span>
                    <div className="ec-card-overlay">
                      <span className="ec-overlay-name">{col.fullName || col.name}</span>
                      <span className="ec-overlay-cta">View Collection
                        <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </div>
                  <div className="ec-card-body">
                    <div className="ec-card-tag">{col.productNames.length} {col.productNames.length === 1 ? 'Product' : 'Products'} in Collection</div>
                    <p className="ec-card-desc">{col.description}</p>
                  </div>
                </Link>
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
