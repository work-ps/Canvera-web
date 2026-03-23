import { Link } from 'react-router-dom'
import '../../styles/action-cards.css'

export default function ActionCards() {
  return (
    <section className="action-cards">
      <div className="action-cards-inner">

        {/* Card 1 — Explore Products (left, outline button) */}
        <div className="action-card action-card--explore">
          <div className="action-card-content">
            <p className="action-card-desc">
              From premium photobooks and coffee table books to gorgeous prints, canvases, calendars, and décor — <strong>150+ products</strong> crafted for weddings, portraits, and every moment worth preserving.
            </p>
          </div>
          <Link to="/shop" className="action-card-cta action-card-cta--outline">
            Explore Products
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* Card 2 — Join Now (right, primary button) */}
        <div className="action-card action-card--join">
          <div className="action-card-content">
            <p className="action-card-desc">
              Join <strong>1,000+ photographers who sign up every month</strong>. Get wholesale pricing, access to Fundy and Pixellu, and a partner community that's been empowering photographers since 2007.
            </p>
          </div>
          <Link to="/signup" className="action-card-cta action-card-cta--primary">
            Join Now
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
