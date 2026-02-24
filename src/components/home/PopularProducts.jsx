import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard'
import products from '../../data/products'
import '../../styles/popular-products.css'

const popularIds = [1, 2, 3, 4, 5, 6, 7, 8]

export default function PopularProducts() {
  const scrollRef = useRef(null)
  const wrapRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  const scrollStep = 364

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

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -scrollStep, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: scrollStep, behavior: 'smooth' })

  const popularProducts = popularIds.map(id => products.find(p => p.id === id)).filter(Boolean)

  const wrapCls = `products-scroll-wrap${canScrollLeft ? ' can-scroll-left' : ''}${atEnd ? ' scrolled-end' : ''}`

  return (
    <section className="popular-products">
      <div className="popular-inner">
        <div className="section-header">
          <div>
            <div className="section-label">Curated For You</div>
            <h2 className="section-title">Popular Products</h2>
            <p className="section-subtitle">Loved by photographers across India</p>
          </div>
          <Link to="/products" className="view-all-link">
            View All Products
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        <div className={wrapCls} ref={wrapRef}>
          <button className={`scroll-arrow scroll-left${!canScrollLeft ? ' hidden' : ''}`} onClick={scrollLeft} aria-label="Scroll left">
            <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div className="products-scroll" ref={scrollRef}>
            <div className="products-scroll-track">
              {popularProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          <button className={`scroll-arrow scroll-right${atEnd ? ' hidden' : ''}`} onClick={scrollRight} aria-label="Scroll right">
            <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  )
}
