import { Link } from 'react-router-dom'
import '../../styles/action-cards.css'

export default function ActionCards() {
  return (
    <section className="action-cards">
      <div className="action-cards-inner">

        {/* Card 1 — Join Now (left, primary button) */}
        <div className="action-card action-card--join">
          <div className="action-card-content">
            <p className="action-card-desc">
              Sign up for free and unlock <strong>exclusive wholesale pricing</strong>, professional design tools, dedicated support, and member-only benefits — everything a photographer needs to deliver stunning albums.
            </p>
          </div>
          <Link to="/register" className="action-card-cta action-card-cta--primary">
            Join Now
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

        {/* Card 2 — Explore Products (right, outline button) */}
        <div className="action-card action-card--explore">
          <div className="action-card-content">
            <p className="action-card-desc">
              Discover <strong>150+ premium flushmount albums</strong>, lay-flat photobooks, calendars, and personalized gifts — handcrafted with precision printing and archival-quality materials for every occasion.
            </p>
          </div>
          <Link to="/products" className="action-card-cta action-card-cta--outline">
            Explore Products
            <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
