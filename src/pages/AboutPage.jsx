import '../styles/about-page.css'

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero banner */}
      <section className="about-hero">
        <h1 className="about-hero-title">About Canvera</h1>
        <p className="about-hero-subtitle">
          India's most trusted partner for professional photographers, crafting
          premium photobooks and albums since 2010.
        </p>
      </section>

      {/* Our Story */}
      <section className="about-block">
        <div className="about-block-inner">
          <h2 className="about-block-title">Our Story</h2>
          <p className="about-block-text">
            Canvera was born from a simple belief: every photograph deserves to be preserved in a form that does
            justice to the moment it captures. What started as a small venture to bridge the gap between digital
            photography and tangible keepsakes has grown into India's leading B2B marketplace for premium
            photobooks and albums.
          </p>
          <p className="about-block-text">
            We partner with professional photographers across the country, providing them with museum-quality
            products, wholesale pricing, and the tools to elevate their business. Our commitment to quality extends
            from the Italian leathers on our covers to the archival-grade papers inside.
          </p>
          <p className="about-block-text">
            Today, Canvera offers 9 curated collections across photobooks, magazines, wall decor, and gifting
            products. Every item is handcrafted with precision, inspected through a multi-point quality check, and
            delivered with care. We are not just a printing company; we are custodians of your most precious
            memories.
          </p>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="about-values">
        <div className="about-values-inner">
          <h2 className="about-values-title">What We Stand For</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15l-2 5l9-13h-5l2-5l-9 13h5z"/>
                </svg>
              </div>
              <h3 className="about-value-name">Uncompromising Quality</h3>
              <p className="about-value-desc">
                Every product is handcrafted using museum-grade materials and undergoes rigorous quality
                checks before leaving our facility.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3 className="about-value-name">Passion for Craft</h3>
              <p className="about-value-desc">
                We treat each photobook as a work of art. Our artisans bring decades of experience and
                genuine care to every product.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="about-value-name">Trust & Reliability</h3>
              <p className="about-value-desc">
                Over 5,000 photographers trust us with their most important work. We honor that trust with
                consistent quality and on-time delivery.
              </p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <h3 className="about-value-name">Innovation</h3>
              <p className="about-value-desc">
                From 6-color printing technology to eco-friendly materials, we continuously invest
                in new techniques to improve our products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="about-stats-inner">
          <div className="about-stat">
            <div className="about-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <span className="about-stat-number">5,000+</span>
            <span className="about-stat-label">Professional Photographers</span>
          </div>
          <div className="about-stat">
            <div className="about-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 7V5a4 4 0 0 0-8 0v2"/>
              </svg>
            </div>
            <span className="about-stat-number">50,000+</span>
            <span className="about-stat-label">Products Shipped</span>
          </div>
          <div className="about-stat">
            <div className="about-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <span className="about-stat-number">9</span>
            <span className="about-stat-label">Curated Collections</span>
          </div>
          <div className="about-stat">
            <div className="about-stat-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span className="about-stat-number">15+</span>
            <span className="about-stat-label">Years of Excellence</span>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-block about-mission">
        <div className="about-block-inner">
          <h2 className="about-block-title">Our Mission</h2>
          <p className="about-block-text">
            To empower professional photographers with the finest products and services, enabling them to deliver
            unforgettable experiences to their clients. We believe that the art of photography extends beyond the lens,
            and it is our privilege to bring those captured moments to life in a form that families will cherish for
            generations.
          </p>
          <p className="about-block-text">
            As we look to the future, we remain committed to innovation, sustainability, and the relentless pursuit of
            perfection. Whether it is experimenting with eco-friendly materials or pushing the boundaries of print
            technology, Canvera will continue to set the standard for premium photobooks in India and beyond.
          </p>
        </div>
      </section>
    </div>
  )
}
