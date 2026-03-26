import { Link } from 'react-router-dom'
import '../styles/about-page.css'

const stats = [
  { number: '91,000+', label: 'Partners' },
  { number: '1.75M+', label: 'Albums' },
  { number: '2,800+', label: 'Cities' },
  { number: 'Since 2007', label: 'Established' },
]

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-overlay">
          <h1 className="about-hero-title">Our Story</h1>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="section">
        <div className="container">
          <div className="section-header-center">
            <p className="section-label">By the Numbers</p>
            <h2 className="section-title">Trusted Across India</h2>
          </div>
          <div className="about-stats-grid">
            {stats.map((s) => (
              <div key={s.label} className="about-stat-card">
                <span className="about-stat-number">{s.number}</span>
                <span className="about-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-alt">
        <div className="container">
          <div className="about-story">
            <div className="about-story-text">
              <p className="section-label">Our Journey</p>
              <h2 className="display-md">Founded on a Simple Belief</h2>
              <p className="about-body">
                With a vision to help individuals record and preserve their happiest memories, we started our journey in 2007. Today, Canvera is India's leading online photography company, fulfilling every professional photography need across 2,800+ cities.
              </p>
              <p className="about-body">
                Canvera began with a simple belief: photographs deserve more than storage -- they deserve to be experienced. Since then, photographers across India have trusted Canvera to turn moments into lasting memories.
              </p>
              <p className="about-body">
                This milestone belongs to our community -- and it's why Canvera continues to be the preferred choice for professional photographers nationwide.
              </p>
            </div>
            <div className="about-story-image">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80"
                alt="Canvera albums crafted with care"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="section">
        <div className="container">
          <div className="about-tech">
            <div className="about-tech-image">
              <img
                src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=80"
                alt="Precision printing technology"
              />
            </div>
            <div className="about-tech-text">
              <p className="section-label">Technology</p>
              <h2 className="display-md">State-of-the-Art Precision</h2>
              <p className="about-body">
                Our production facility uses 6-color printing technology for a wider colour gamut and richer tonal range than standard 4-color presses. Every album passes through rigorous multi-stage quality control before it reaches you.
              </p>
              <p className="about-body">
                From calibrated monitors and ICC profiles to hawk-eyed manual inspection, we obsess over every detail so that the final product matches your creative vision with pinpoint accuracy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <div className="about-cta-inner">
            <h2 className="display-md">Experience the Canvera Difference</h2>
            <p className="about-cta-sub">
              Discover premium photobooks, albums, and prints crafted with care.
            </p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              Browse Products
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
