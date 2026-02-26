import { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import VideoOverlay from './VideoOverlay'
import '../../styles/hero.css'

const carouselCards = [
  { theme: '', visual: 'cc-visual-light', chip: { cls: 'cc-chip-new', text: 'New Launch' }, tag: 'Product', name: 'Flushmount Album', desc: '12 × 18 · Matte · Leather cover' },
  { theme: 'cc-accent', visual: 'cc-visual-accent', chip: null, tag: 'Limited Offer', name: 'Monsoon Sale', desc: 'Up to 30% off on premium albums this season' },
  { theme: '', visual: 'cc-visual-warm', chip: null, tag: 'Category', name: 'Wedding Albums', desc: 'Curated collection for every celebration' },
  { theme: 'cc-dark', visual: 'cc-visual-dark', chip: { cls: 'cc-chip-premium', text: 'Premium' }, tag: 'Design Service', name: 'We Design For You', desc: 'Upload photos, our designers create your album' },
  { theme: 'cc-leaf', visual: 'cc-visual-leaf', chip: null, tag: 'New Category', name: 'Calendars & Gifts', desc: 'Photo calendars, mugs, canvases & more' },
]

const carouselSvgs = [
  <svg viewBox="0 0 44 34" fill="none"><rect x="2" y="2" width="40" height="30" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 24l12-9 8 5 10-8 10 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="13" r="4" stroke="currentColor" strokeWidth="1.2"/></svg>,
  <svg viewBox="0 0 44 44" fill="none"><path d="M22 6l4 8 9 1.3-6.5 6.3 1.5 9L22 26l-8 4.6 1.5-9L9 15.3l9-1.3 4-8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  <svg viewBox="0 0 44 34" fill="none"><rect x="2" y="2" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><rect x="24" y="2" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="20" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/><rect x="24" y="20" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>,
  <svg viewBox="0 0 44 44" fill="none"><rect x="6" y="10" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M14 22l4 4 10-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg viewBox="0 0 44 44" fill="none"><rect x="8" y="4" width="28" height="36" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M14 14h16M14 20h12M14 26h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [videoOpen, setVideoOpen] = useState(false)
  const autoTimerRef = useRef(null)
  const total = carouselCards.length

  const layout = useCallback((idx) => {
    return carouselCards.map((_, i) => {
      let offset = i - idx
      if (offset > Math.floor(total / 2)) offset -= total
      if (offset < -Math.floor(total / 2)) offset += total
      const absOff = Math.abs(offset)
      const tx = offset * 160
      const tz = -absOff * 120
      const scale = Math.max(1 - absOff * 0.12, 0.7)
      const opacity = Math.max(absOff > 2 ? 0 : 1 - absOff * 0.25, 0)
      return {
        transform: `translateX(${tx}px) translateZ(${tz}px) scale(${scale})`,
        opacity,
        zIndex: 10 - absOff,
        pointerEvents: absOff > 2 ? 'none' : 'auto',
      }
    })
  }, [total])

  const goTo = useCallback((idx) => {
    setCurrent(((idx % total) + total) % total)
  }, [total])

  const resetAuto = useCallback(() => {
    clearInterval(autoTimerRef.current)
    autoTimerRef.current = setInterval(() => {
      setCurrent(prev => ((prev + 1) % total + total) % total)
    }, 3500)
  }, [total])

  useEffect(() => {
    resetAuto()
    return () => clearInterval(autoTimerRef.current)
  }, [resetAuto])

  const styles = layout(current)

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Trusted by 75,000+ Photographers
          </div>
          <h1 className="hero-headline">
            Your Craft Deserves <em>Premium Albums</em>
          </h1>
          <p className="hero-sub">
            India's largest photobook platform — design, order, and deliver stunning albums your clients will treasure. Professional tools, exclusive member benefits, white-glove support.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="hero-cta-primary">
              Join for Free
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <button className="hero-cta-secondary" onClick={() => setVideoOpen(true)}>
              <span className="hero-cta-play-icon">
                <svg viewBox="0 0 16 16" fill="none"><polygon points="6,3.5 6,12.5 13,8" fill="currentColor"/></svg>
              </span>
              Explore Canvera Experience
            </button>
          </div>
          <div className="hero-proof">
            <div className="hero-stat">
              <div className="hero-stat-num">150+</div>
              <div className="hero-stat-label">Album Products</div>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <div className="hero-stat-num">Since 2007</div>
              <div className="hero-stat-label">Serving India</div>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <div className="hero-stat-num">500+</div>
              <div className="hero-stat-label">Cities Delivered</div>
            </div>
          </div>
        </div>

        <div className="hero-visual"
          onMouseEnter={() => clearInterval(autoTimerRef.current)}
          onMouseLeave={resetAuto}
        >
          <div className="carousel-wrap">
            <div className="carousel-track">
              {carouselCards.map((card, i) => (
                <div
                  key={i}
                  className={`carousel-card${i === current ? ' active' : ''}`}
                  style={styles[i]}
                  onClick={() => { if (i !== current) { goTo(i); resetAuto(); } }}
                >
                  <div className={`carousel-card-inner ${card.theme}`}>
                    <div className={`cc-visual ${card.visual}`}>
                      {card.chip && <span className={`cc-chip ${card.chip.cls}`}>{card.chip.text}</span>}
                      {carouselSvgs[i]}
                    </div>
                    <div className="cc-meta">
                      <div className="cc-tag">{card.tag}</div>
                      <div className="cc-name">{card.name}</div>
                      <div className="cc-desc">{card.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-dots">
            {carouselCards.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? ' active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => { goTo(i); resetAuto(); }}
              />
            ))}
          </div>
        </div>
      </div>

      <VideoOverlay open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  )
}
