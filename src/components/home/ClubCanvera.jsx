import { Link } from 'react-router-dom'
import '../../styles/club-canvera.css'

export default function ClubCanvera() {
  return (
    <section className="club-section">
      <div className="club-inner">
        <span className="club-badge">Club Partners</span>
        <h2 className="club-title">Become a Club Partner</h2>
        <p className="club-desc">
          Every month, 1,000+ photographers join our partner community. Unlock exclusive wholesale pricing, priority support, and extended customization options.
        </p>
        <Link to="/signup" className="club-cta">
          Sign Up & Get Verified
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
    </section>
  )
}
