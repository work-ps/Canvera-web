import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import collections from '../../data/collections'
import products from '../../data/products'
import { getProductThumbnail } from '../../data/productImages'
import '../../styles/explore-collections.css'

/* Get a representative image for each collection by finding the first product that has a real photo */
function getCollectionImage(collection) {
  for (const pName of collection.productNames) {
    const product = products.find(p =>
      p.name === pName ||
      p.name.toLowerCase().includes(pName.toLowerCase().split(' ')[0])
    )
    if (product) {
      const img = getProductThumbnail(product.slug)
      if (img) return img
    }
  }
  return null
}

/* Gradient fallbacks per imageVariant */
const gradientFallbacks = {
  petrol: 'linear-gradient(145deg, #005780, #003A54)',
  warm: 'linear-gradient(145deg, #8B6914, #5A4410)',
  amber: 'linear-gradient(145deg, #B07D1A, #6B4D10)',
  neutral: 'linear-gradient(145deg, #56687A, #2D3E4F)',
  deep: 'linear-gradient(145deg, #5E3F8A, #3A2660)',
  dark: 'linear-gradient(145deg, #1a2a3a, #0a1520)',
  leaf: 'linear-gradient(145deg, #2a9d8f, #1A6B61)',
  mixed: 'linear-gradient(145deg, #6E8091, #415264)',
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

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section className="section-alt">
      <div className="container">
        <div className="section-header">
          <div>
            <div className="section-label">Collections</div>
            <h2 className="section-title">Explore Our Ranges</h2>
          </div>
          <Link to="/collections" className="link-arrow">
            View All
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className="ec-scroll-container">
          <button
            className={`scroll-arrow scroll-left${!canScrollLeft ? ' hidden' : ''}`}
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="ec-scroll" ref={scrollRef}>
            <div className="ec-track">
              {collections.map((col) => {
                const img = getCollectionImage(col)
                const fallback = gradientFallbacks[col.imageVariant] || gradientFallbacks.neutral
                return (
                  <Link
                    key={col.id}
                    to={`/collections/${col.slug}`}
                    className="ec-card"
                  >
                    <div
                      className="ec-card-bg"
                      style={img ? { backgroundImage: `url(${img})` } : { background: fallback }}
                    >
                      <div className="ec-card-gradient" />
                      <div className="ec-card-info">
                        <h3 className="ec-card-name">{col.fullName}</h3>
                        <span className="ec-card-count">
                          {col.productNames.length} product{col.productNames.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          <button
            className={`scroll-arrow scroll-right${atEnd ? ' hidden' : ''}`}
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}
