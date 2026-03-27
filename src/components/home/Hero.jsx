import { Link } from 'react-router-dom'
import Orbit3DCarousel from './Orbit3DCarousel'
import '../../styles/hero.css'

export default function Hero() {
  return (
    <section className="hero">
      {/* Layer 1: full-width background + left copy */}
      <div className="hero-layer">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Trusted by 91,000+ Partners
            </div>
            <h1 className="hero-headline">
              Your Craft Deserves <em>Premium Albums</em>
            </h1>
            <p className="hero-sub">
              Photographs deserve more than storage — they deserve to be experienced. Award-winning photobooks crafted with state-of-the-art precision and delivered across 2,800+ cities. You bring the vision, we'll bring it to life.
            </p>
            <div className="hero-ctas">
              <Link to="/collections" className="hero-cta-primary">
                Explore Collection
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/signup" className="hero-cta-secondary">
                Join Now
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
            <div className="hero-proof">
              <div className="hero-stat">
                <div className="hero-stat-num">Since 2007</div>
                <div className="hero-stat-label">Serving India</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <div className="hero-stat-num">91,000+</div>
                <div className="hero-stat-label">Partners</div>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <div className="hero-stat-num">1.75M+</div>
                <div className="hero-stat-label">Albums Sold</div>
              </div>
            </div>
          </div>

          {/* Layer 2: Orbit carousel overlaid on the right */}
          <div className="hero-orbit">
            <Orbit3DCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
