import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const navItems = [
  {
    label: 'Shop',
    href: '/shop',
    mega: true,
    columns: [
      { title: 'Categories', links: ['Photobooks', 'Momentbooks', 'Magazines', 'Canvas & Frames', 'Decor & Gifts', 'Calendars'] },
      { title: 'Quick Links', links: ['New Arrivals', 'Bestsellers', 'Limited Edition'] },
      { title: 'Services', links: ['Design Services', 'Product Finder', 'Custom Builder'] },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    dropdown: ['Celestial', 'Luxury', 'Suede', 'Foiling', 'Leatherette', 'Signature', 'Fabric', 'Wood', 'Custom Cover'],
  },
  {
    label: 'Create',
    href: '/custom',
    dropdown: ['Make Your Own', 'Design Services', 'Product Finder'],
  },
  {
    label: 'About',
    href: '/about',
  },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <a href="/" className="header__logo">
          <span className="header__logo-text">CANVERA</span>
        </a>

        <nav className="header__nav" onMouseLeave={() => setActiveNav(null)}>
          {navItems.map((item) => (
            <div
              key={item.label}
              className="header__nav-item"
              onMouseEnter={() => setActiveNav(item.label)}
            >
              <a href={item.href} className="header__nav-link">
                {item.label}
              </a>
              <AnimatePresence>
                {activeNav === item.label && item.mega && (
                  <motion.div
                    className="header__mega"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.columns.map((col) => (
                      <div key={col.title} className="header__mega-col">
                        <span className="header__mega-title">{col.title}</span>
                        {col.links.map((link) => (
                          <a key={link} href="#" className="header__mega-link">{link}</a>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeNav === item.label && item.dropdown && (
                  <motion.div
                    className="header__dropdown"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.dropdown.map((link) => (
                      <a key={link} href="#" className="header__dropdown-link">{link}</a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="header__actions">
          <button className="header__icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button className="header__icon-btn" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
          <button className="header__icon-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
          <button
            className="header__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`header__hamburger-line ${mobileOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="header__mobile-link">
                {item.label}
              </a>
            ))}
            <div className="header__mobile-ctas">
              <a href="/login" className="btn btn--secondary btn--sm">Sign In</a>
              <a href="/signup" className="btn btn--primary btn--sm">Join Now</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
