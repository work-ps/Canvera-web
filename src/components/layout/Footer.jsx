import { Link } from 'react-router-dom'
import CanveraLogo from '../common/CanveraLogo'
import { footerColumns } from '../../data/navigation'
import '../../styles/footer.css'

const benefits = [
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/><path d="M16 24l4 4 12-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: 'Free Design Service',
    desc: 'Upload your photos, our expert designers create your album at no extra cost',
  },
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2"/><path d="M24 14v10l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    title: '10% Off First Order',
    desc: 'New photographers get an exclusive 10% discount on their first album order',
  },
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><path d="M8 32h10l4-20h16l2 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="16" cy="38" r="3" stroke="currentColor" strokeWidth="2"/><circle cx="34" cy="38" r="3" stroke="currentColor" strokeWidth="2"/></svg>,
    title: 'Fast Delivery',
    desc: '5-7 day turnaround with real-time tracking across 500+ cities in India',
  },
  {
    icon: <svg viewBox="0 0 48 48" fill="none"><path d="M12 36V16a4 4 0 014-4h16a4 4 0 014 4v20" stroke="currentColor" strokeWidth="2"/><path d="M8 36h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M20 24h8M24 20v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    title: 'Free Shipping',
    desc: 'Complimentary shipping on all orders — no minimum order value required',
  },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Benefits strip — merged at the top of footer */}
        <div className="footer-benefits">
          {benefits.map((item, i) => (
            <div className="footer-benefit" key={i}>
              <div className="footer-benefit-icon">{item.icon}</div>
              <div className="footer-benefit-text">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer columns */}
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/">
              <CanveraLogo height={26} style={{ filter: 'brightness(0) invert(1)' }} />
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
              <a href="#" aria-label="YouTube"><svg viewBox="0 0 16 16" fill="none"><path d="M14.2 4.6a1.8 1.8 0 00-1.3-1.3A42 42 0 008 3a42 42 0 00-4.9.3A1.8 1.8 0 001.8 4.6A19 19 0 001.5 8c0 1.2.1 2.3.3 3.4a1.8 1.8 0 001.3 1.3 42 42 0 004.9.3 42 42 0 004.9-.3 1.8 1.8 0 001.3-1.3c.2-1.1.3-2.2.3-3.4s-.1-2.3-.3-3.4z" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 10V6l3.5 2-3.5 2z" fill="currentColor"/></svg></a>
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
