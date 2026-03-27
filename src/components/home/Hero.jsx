import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/hero.css'

export default function Hero() {
  const { isRegistered, isVerified } = useAuth()
  const heroImage = '/images/hero/1.png'

  // CTAs change based on user state (Fix 10, 11)
  let primaryCta = { label: 'Explore Collection', to: '/collections' }
  let secondaryCta = { label: 'Join Now', to: '/signup' }

  if (isRegistered && !isVerified) {
    primaryCta = { label: 'Explore Collection', to: '/collections' }
    secondaryCta = { label: 'Get Verified', to: '/profile' }
  } else if (isVerified) {
    primaryCta = { label: 'Shop All', to: '/shop' }
    secondaryCta = null // No secondary for verified users
  }

  return (
    <section className="hero">
      {/* Full-bleed background image */}
      <div className="hero-bg">
        <img
          src={heroImage}
          alt="Premium Canvera photobook album"
          className="hero-bg-img"
        />
        <div className="hero-bg-overlay" />
      </div>

      {/* Content overlay */}
      <div className="hero-content container">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Trusted by 91,000+ photographers
        </div>

        <h1 className="hero-headline">
          Premium Albums,{'\n'}Crafted to Perfection
        </h1>

        <p className="hero-subtitle">
          Award-winning photobooks built with state-of-the-art precision,
          delivered across 2,800+ cities.
        </p>

        <div className="hero-ctas">
          <Link to={primaryCta.to} className="btn btn-primary btn-lg hero-btn-primary">
            {primaryCta.label}
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          {secondaryCta && (
            <Link to={secondaryCta.to} className="btn hero-btn-secondary">
              {secondaryCta.label}
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          )}
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">1.75M+</span>
            <span className="hero-stat-label">Albums</span>
          </div>
          <span className="hero-stat-dot" />
          <div className="hero-stat">
            <span className="hero-stat-value">2,800+</span>
            <span className="hero-stat-label">Cities</span>
          </div>
          <span className="hero-stat-dot" />
          <div className="hero-stat">
            <span className="hero-stat-value">Since 2007</span>
            <span className="hero-stat-label">Serving India</span>
          </div>
        </div>
      </div>
    </section>
  )
}
