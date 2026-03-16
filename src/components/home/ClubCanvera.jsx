import { Link } from 'react-router-dom'
import '../../styles/club-canvera.css'

export default function ClubCanvera() {
  return (
    <section className="club-section">
      <div className="club-inner">
        <span className="club-badge">Exclusive Offer</span>
        <h2 className="club-title">Become a Pro Partner</h2>
        <p className="club-desc">
          Unlock exclusive wholesale pricing, priority support, and extended customization
          options. Verified photographers and businesses save up to 40% on every order.
        </p>
        <Link to="/register" className="club-cta">
          Sign Up & Get Verified
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
    </section>
  )
}
