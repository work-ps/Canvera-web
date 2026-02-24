import { Link } from 'react-router-dom'
import { footerColumns } from '../../data/navigation'
import '../../styles/footer.css'

const CANVERA_LOGO = 'data:image/jpeg;base64,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'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/">
              <img src={CANVERA_LOGO} alt="Canvera" style={{ height: 26, filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p>India's largest premium photo album platform. Trusted by 75,000+ photographers across 500+ cities since 2007.</p>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <svg viewBox="0 0 16 16" fill="none"><path d="M14 11.5v2a1 1 0 01-1.1 1 10.05 10.05 0 01-4.4-1.5A9.9 9.9 0 015 9.5a10 10 0 01-1.5-4.4A1 1 0 014.5 4h2a1 1 0 011 .8 6.5 6.5 0 00.35 1.4 1 1 0 01-.2 1L6.7 8.2a8 8 0 003.1 3.1l1-1a1 1 0 011-.2 6.5 6.5 0 001.4.35 1 1 0 01.8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                1-800-419-0570
              </div>
              <div className="footer-contact-item">
                <svg viewBox="0 0 16 16" fill="none"><path d="M14 2H2l6 5 6-5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><rect x="1" y="2" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/></svg>
                support@canvera.com
              </div>
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><svg viewBox="0 0 16 16" fill="none"><path d="M8 1a7 7 0 00-1.1 13.9v-5H5.3V8h1.6V6.5a2.2 2.2 0 012.3-2.4 9.7 9.7 0 011.4.1v1.5h-.8a.9.9 0 00-1 1V8h1.7l-.3 1.9H8.8v5A7 7 0 008 1z" fill="currentColor"/></svg></a>
              <a href="#" aria-label="Instagram"><svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3"/><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.3"/><circle cx="12" cy="4" r="0.8" fill="currentColor"/></svg></a>
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 16 16" fill="none"><path d="M14.2 4.6a1.8 1.8 0 00-1.3-1.3A42 42 0 008 3a42 42 0 00-4.9.3A1.8 1.8 0 001.8 4.6 19 19 0 001.5 8c0 1.2.1 2.3.3 3.4a1.8 1.8 0 001.3 1.3 42 42 0 004.9.3 42 42 0 004.9-.3 1.8 1.8 0 001.3-1.3c.2-1.1.3-2.2.3-3.4s-.1-2.3-.3-3.4z" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 10V6l3.5 2-3.5 2z" fill="currentColor"/></svg></a>
            </div>
          </div>

          {footerColumns.map((col, i) => (
            <div className="footer-col" key={i}>
              <h4>{col.title}</h4>
              {col.links.map((link, j) => (
                <Link to={link.href} key={j}>{link.label}</Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>&copy; 2007&ndash;2026 Canvera Digital Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
