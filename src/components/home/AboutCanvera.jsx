import { Link } from 'react-router-dom'
import '../../styles/about-canvera.css'

export default function AboutCanvera() {
  return (
    <section className="about-canvera">
      <div className="about-canvera-inner">
        <div className="about-panel">

          {/* Top row — headline left, description right */}
          <div className="about-top">
            <div className="about-top-left">
              <h2 className="about-brand-name">We're Canvera.</h2>
              <p className="about-tagline">India's premium photobook platform.</p>
            </div>
            <div className="about-top-right">
              <p className="about-desc">
                Since 2007, we've partnered with 75,000+ photographers to craft world-class albums — combining precision printing, handpicked materials, and white-glove support to turn precious moments into heirloom keepsakes, delivered across 500+ cities.
              </p>
              <Link to="/products" className="about-learn-more">
                Learn More
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>

          {/* Showcase visual area */}
          <div className="about-showcase">
            <div className="about-showcase-grid">
              <div className="asc-card asc-card--1">
                <svg viewBox="0 0 48 48" fill="none"><rect x="4" y="4" width="40" height="40" rx="6" stroke="currentColor" strokeWidth="1.5"/><path d="M4 32l12-10 8 6 12-10 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="18" r="4" stroke="currentColor" strokeWidth="1.5"/></svg>
                <span>Premium Albums</span>
              </div>
              <div className="asc-card asc-card--2">
                <svg viewBox="0 0 48 48" fill="none"><path d="M24 4l6 12 13 1.9-9.4 9.2L35.8 40 24 34l-11.8 6 2.2-12.9L5 18l13-1.9L24 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                <span>Craftsmanship</span>
              </div>
              <div className="asc-card asc-card--3">
                <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5"/><path d="M16 24l5 5 11-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span>Quality Assurance</span>
              </div>
              <div className="asc-card asc-card--4">
                <svg viewBox="0 0 48 48" fill="none"><path d="M8 40V16a4 4 0 014-4h24a4 4 0 014 4v24" stroke="currentColor" strokeWidth="1.5"/><path d="M4 40h40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M18 24h12M18 30h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span>B2B Platform</span>
              </div>
            </div>
            <div className="about-showcase-caption">
              Serving India since 2007 · 10M+ albums delivered · 500+ cities
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
