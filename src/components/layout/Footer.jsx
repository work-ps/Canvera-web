import { useState } from 'react'
import { Link } from 'react-router-dom'
import CanveraLogo from '../common/CanveraLogo'
import { footerColumns } from '../../data/navigation'
import '../../styles/footer.css'

/* ── Social icons ── */
const FacebookIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M8 1a7 7 0 00-1.1 13.9v-5H5.3V8h1.6V6.5a2.2 2.2 0 012.3-2.4 9.7 9.7 0 011.4.1v1.5h-.8a.9.9 0 00-1 1V8h1.7l-.3 1.9H8.8v5A7 7 0 008 1z" fill="currentColor" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="12" cy="4" r="0.8" fill="currentColor" />
  </svg>
)

const YouTubeIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M14.2 4.6a1.8 1.8 0 00-1.3-1.3A42 42 0 008 3a42 42 0 00-4.9.3A1.8 1.8 0 001.8 4.6 19 19 0 001.5 8c0 1.2.1 2.3.3 3.4a1.8 1.8 0 001.3 1.3 42 42 0 004.9.3 42 42 0 004.9-.3 1.8 1.8 0 001.3-1.3c.2-1.1.3-2.2.3-3.4s-.1-2.3-.3-3.4z" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6.5 10V6l3.5 2-3.5 2z" fill="currentColor" />
  </svg>
)

const PhoneIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M14 11.5v2a1 1 0 01-1.1 1 10.05 10.05 0 01-4.4-1.5A9.9 9.9 0 015 9.5a10 10 0 01-1.5-4.4A1 1 0 014.5 4h2a1 1 0 011 .8 6.5 6.5 0 00.35 1.4 1 1 0 01-.2 1L6.7 8.2a8 8 0 003.1 3.1l1-1a1 1 0 011-.2 6.5 6.5 0 001.4.35 1 1 0 01.8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M14 2H2l6 5 6-5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="1" y="2" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function Footer() {
  const [expandedCol, setExpandedCol] = useState(null)

  const toggleCol = (i) => {
    setExpandedCol(expandedCol === i ? null : i)
  }

  return (
    <footer className="ftr">
      <div className="ftr__inner">
        <div className="ftr__grid">

          {/* Brand column */}
          <div className="ftr__brand">
            <Link to="/" className="ftr__logo">
              <CanveraLogo height={24} />
            </Link>
            <p className="ftr__tagline">
              India's leading premium photo album platform.
            </p>
            <div className="ftr__contact">
              <a href="tel:18004190570" className="ftr__contact-item">
                <PhoneIcon />
                <span>1-800-419-0570</span>
              </a>
              <a href="mailto:support@canvera.com" className="ftr__contact-item">
                <EmailIcon />
                <span>support@canvera.com</span>
              </a>
            </div>
            <div className="ftr__social">
              <a href="#" aria-label="Facebook" className="ftr__social-link"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram" className="ftr__social-link"><InstagramIcon /></a>
              <a href="#" aria-label="YouTube" className="ftr__social-link"><YouTubeIcon /></a>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col, i) => (
            <div className="ftr__col" key={i}>
              <button
                className={`ftr__col-heading${expandedCol === i ? ' ftr__col-heading--open' : ''}`}
                onClick={() => toggleCol(i)}
              >
                {col.title}
                <ChevronDown />
              </button>
              <div className={`ftr__col-links${expandedCol === i ? ' ftr__col-links--open' : ''}`}>
                {col.links.map((link, j) => (
                  <Link to={link.href} key={j}>{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="ftr__bottom">
          <p>&copy; 2007&ndash;2026 Canvera Digital Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="ftr__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
