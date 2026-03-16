import { Link } from 'react-router-dom'
import '../../styles/crafted-quality.css'

export default function CraftedQuality() {
  return (
    <section className="cq-section">
      <div className="cq-inner">
        <div className="cq-visual">
          <div className="cq-visual-card">
            {/* Printing process illustration */}
            <svg className="cq-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="24" width="40" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M18 24V12h28v12" stroke="currentColor" strokeWidth="2"/>
              <rect x="18" y="36" width="28" height="16" rx="1" stroke="currentColor" strokeWidth="2"/>
              <circle cx="44" cy="31" r="2" fill="currentColor"/>
              <line x1="22" y1="42" x2="42" y2="42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="22" y1="46" x2="36" y2="46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="cq-visual-label">Printing Process</span>
          </div>
        </div>

        <div className="cq-content">
          <h2 className="cq-title">Crafted with Uncompromising Quality</h2>
          <p className="cq-desc">
            Every Canvera photobook is a testament to meticulous craftsmanship. From
            selecting premium papers and archival-grade inks to hand-finishing each cover,
            our process ensures your memories are preserved with the quality they deserve.
          </p>
          <p className="cq-desc">
            With 6-color printing technology and museum-grade materials, we deliver
            products that look stunning for generations.
          </p>
          <Link to="/about" className="cq-link">
            Learn About Our Process
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
