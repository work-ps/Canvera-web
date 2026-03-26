import { Link } from 'react-router-dom'
import '../styles/pages.css'

const steps = [
  { num: '1', title: 'Upload', desc: 'Send us your photos in JPEG format through our secure uploader.' },
  { num: '2', title: 'We Design', desc: 'Our professional designers craft a stunning album layout tailored to your style.' },
  { num: '3', title: 'Approve & Print', desc: 'Review the digital proof, request revisions if needed, then we print and ship.' },
]

const galleryImages = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&q=80',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&q=80',
  'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&q=80',
]

export default function DesignServicesPage() {
  return (
    <div className="design-page">
      {/* Hero */}
      <section className="design-hero">
        <div className="container">
          <div className="design-hero-layout">
            <div className="design-hero-text">
              <p className="section-label">Design Services</p>
              <h1 className="display-lg">Let Our Designers Bring Your Vision to Life</h1>
              <p className="design-hero-sub">
                Not a designer? No problem. Our team of professionals will create beautiful album layouts from your photos, so you can focus on what you do best.
              </p>
              <Link to="/custom?service=design" className="btn btn-primary btn-lg">
                Get Started
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
            <div className="design-hero-image">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"
                alt="Album design in progress"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header-center">
            <p className="section-label">How It Works</p>
            <h2 className="section-title">Three Simple Steps</h2>
          </div>
          <div className="design-steps">
            {steps.map((step) => (
              <div key={step.num} className="design-step">
                <div className="design-step-num">{step.num}</div>
                <h3 className="heading-lg">{step.title}</h3>
                <p className="design-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section">
        <div className="container">
          <div className="design-pricing">
            <div className="design-pricing-card">
              <p className="section-label">Transparent Pricing</p>
              <div className="design-price">
                <span className="design-price-from">Starting from</span>
                <span className="design-price-amount">Rs 4,500</span>
              </div>
              <ul className="design-pricing-list">
                <li>Professional album layout design</li>
                <li>Up to 2 rounds of revisions</li>
                <li>Digital proof for approval</li>
                <li>Multiple design styles available</li>
              </ul>
              <Link to="/custom?service=design" className="btn btn-primary btn-block">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Style Gallery */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header-center">
            <p className="section-label">Our Work</p>
            <h2 className="section-title">Design Style Gallery</h2>
            <p className="section-subtitle">A glimpse of album spreads designed by our team.</p>
          </div>
          <div className="design-gallery">
            {galleryImages.map((src, i) => (
              <div key={i} className="design-gallery-item">
                <img src={src} alt={`Design example ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="design-cta">
            <h2 className="display-md">Ready to Get Started?</h2>
            <p>Upload your photos and let our designers create something beautiful.</p>
            <Link to="/custom?service=design" className="btn btn-primary btn-lg">
              Start Your Design
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
