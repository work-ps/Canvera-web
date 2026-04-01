import './Footer.css';

const footerLinks = {
  'Quick Links': [
    { label: 'Shop All', href: '/shop' },
    { label: 'Collections', href: '/collections' },
    { label: 'New Arrivals', href: '/shop?badge=new' },
    { label: 'Bestsellers', href: '/shop?badge=bestseller' },
    { label: 'Product Finder', href: '/find' },
  ],
  'Customer Service': [
    { label: 'Track Order', href: '/track' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Check Genuineness', href: '/genuine' },
    { label: 'Design Services', href: '/design-services' },
  ],
  'For Photographers': [
    { label: 'Join as Photographer', href: '/signup' },
    { label: 'About Canvera', href: '/about' },
    { label: 'Custom Builder', href: '/custom' },
    { label: 'Make Your Own', href: '/custom' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__bounded">
        <div className="footer__main">
          {/* Brand column */}
          <div className="footer__brand">
            <img src="/images/logo.png" alt="Canvera" className="footer__logo-img" />
            <p className="footer__desc">
              India&rsquo;s #1 premium photobook platform, trusted by 91,000+ professional
              photographers across 2,800+ cities.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="footer__social-link" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="footer__col">
              <h4 className="footer__col-title">{title}</h4>
              <ul className="footer__col-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__col-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; 2026 Canvera. All rights reserved.
          </p>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
