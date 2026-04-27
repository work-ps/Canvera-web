import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const staticLinks = {
  'Quick Links': [
    { label: 'Shop All', to: '/shop' },
    { label: 'Collections', to: '/collections' },
    { label: 'New Arrivals', to: '/shop?filter=new' },
    { label: 'Bestsellers', to: '/shop?filter=bestsellers' },
    { label: 'Product Finder', to: '/finder' },
  ],
  'Customer Service': [
    { label: 'Track Order', to: '/track' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Check Genuineness', to: '/genuine' },
  ],
};

const photographerLinksGuest = [
  { label: 'Join as Photographer', to: '/signup' },
  { label: 'About Canvera', to: '/about' },
  { label: 'Make Your Own', to: '/custom' },
];

const photographerLinksAuth = [
  { label: 'My Account', to: '/profile' },
  { label: 'About Canvera', to: '/about' },
  { label: 'Make Your Own', to: '/custom' },
];

export default function Footer() {
  const { isLoggedIn } = useAuth();
  const photographerLinks = isLoggedIn ? photographerLinksAuth : photographerLinksGuest;

  return (
    <footer className="footer">
      <div className="footer__bounded">
        <div className="footer__main">
          {/* Brand column */}
          <div className="footer__brand">
            <img src="/images/logo.png" alt="Canvera" className="footer__logo-img" />
            <p className="footer__desc">
              India&rsquo;s leading online photography company — fulfilling every professional
              photography need across 2,800+ cities since 2007.
            </p>
            <div className="footer__social">
              <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://facebook.com" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://youtube.com" className="footer__social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(staticLinks).map(([title, links]) => (
            <div key={title} className="footer__col">
              <h4 className="footer__col-title">{title}</h4>
              <ul className="footer__col-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer__col-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* For Photographers — auth-aware */}
          <div className="footer__col">
            <h4 className="footer__col-title">For Photographers</h4>
            <ul className="footer__col-list">
              {photographerLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="footer__col-link">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; 2026 Canvera. All rights reserved.
          </p>
          <div className="footer__legal">
            <Link to="/legal/privacy" className="footer__col-link">Privacy Policy</Link>
            <Link to="/legal/terms" className="footer__col-link">Terms of Service</Link>
            <Link to="/support/shipping" className="footer__col-link">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
