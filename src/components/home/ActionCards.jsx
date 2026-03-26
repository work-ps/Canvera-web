import { Link } from 'react-router-dom'
import '../../styles/action-cards.css'

export default function ActionCards() {
  return (
    <section className="section cta-final">
      <div className="container">
        <div className="cta-final-inner">
          <h2 className="display-lg cta-final-headline">
            Ready to Create Something Beautiful?
          </h2>
          <div className="cta-final-buttons">
            <Link to="/shop" className="btn btn-primary btn-lg">
              Explore Products
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-lg">
              Join as Photographer
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
