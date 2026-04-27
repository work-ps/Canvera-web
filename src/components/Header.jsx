import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { collections } from '../data/products';
import './Header.css';

/* ── Nav data — all three use the same `columns` structure ───────────────── */
const navItems = [
  {
    label: 'Shop',
    href: '/shop',
    columns: [
      {
        title: 'Categories',
        links: [
          { label: 'Photobooks',     href: '/shop?category=photobooks' },
          { label: 'Momentbooks',    href: '/shop?category=momentbooks' },
          { label: 'Superbooks',     href: '/shop?category=superbooks' },
          { label: 'Magazines',      href: '/shop?category=magazines' },
          { label: 'Decor Products', href: '/shop?category=decor-products' },
          { label: 'Gifting Kit',    href: '/shop?category=gifting-kit' },
        ],
      },
      {
        title: 'Quick Links',
        links: [
          { label: 'New Arrivals',    href: '/shop?filter=new' },
          { label: 'Bestsellers',     href: '/shop?filter=bestsellers' },
          { label: 'Popular',         href: '/shop?filter=popular' },
          { label: 'Limited Edition', href: '/shop?filter=limited' },
        ],
      },
      {
        title: 'Explore With',
        links: [
          { label: 'Product Finder',  href: '/finder' },
          { label: 'Make Your Own',   href: '/custom' },
        ],
      },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    columns: [
      {
        title: '',
        links: [
          { label: 'Celestial',   href: '/collections/celestial' },
          { label: 'Luxury',      href: '/collections/luxury' },
          { label: 'Suede',       href: '/collections/suede' },
        ],
      },
      {
        title: '',
        links: [
          { label: 'Foiling',     href: '/collections/foiling' },
          { label: 'Leatherette', href: '/collections/leatherette' },
          { label: 'Signature',   href: '/collections/signature' },
        ],
      },
      {
        title: '',
        links: [
          { label: 'Fabric',       href: '/collections/fabric' },
          { label: 'Wood',         href: '/collections/wood' },
          { label: 'Custom Cover', href: '/collections/custom-cover' },
        ],
      },
    ],
  },
  {
    label: 'Support',
    href: '/faq',
    columns: [
      {
        title: 'Your Orders',
        links: [
          { label: 'Track Order',         href: '/track' },
          { label: 'Check Genuineness',   href: '/genuine' },
          { label: 'Report an Issue',     href: '/contact?subject=report' },
          { label: 'Raise a Request',     href: '/contact?subject=request' },
          { label: 'Bulk Enquiry',        href: '/contact?subject=bulk' },
        ],
      },
      {
        title: 'Help & Policies',
        links: [
          { label: 'FAQ',                 href: '/faq' },
          { label: 'Contact Us',          href: '/contact' },
          { label: 'Shipping Policy',     href: '/faq#shipping' },
          { label: 'Returns & Refunds',   href: '/faq#returns' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy',      href: '/faq#privacy' },
          { label: 'Terms of Service',    href: '/faq#terms' },
        ],
      },
    ],
  },
];

const tertiaryLinks = [
  { label: 'Contact Us',        href: '/contact' },
  { label: 'Check Genuineness', href: '/genuine' },
];

/* ── Shared panel animation — identical for all three dropdowns ───────────── */
const PANEL_VARIANTS = {
  hidden:  { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)' },
};
const PANEL_TRANSITION  = { duration: 0.26, ease: [0.22, 1, 0.36, 1] };
const OVERLAY_TRANSITION = { duration: 0.2, ease: 'easeOut' };

/* ── Chevron ─────────────────────────────────────────────────────────────── */
function ChevronDown({ open }) {
  return (
    <svg
      className={`header__nav-chevron ${open ? 'header__nav-chevron--open' : ''}`}
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

/* ── Header ──────────────────────────────────────────────────────────────── */
export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const navigate = useNavigate();

  const [scrolled,       setScrolled]       = useState(false);
  const [activeNav,      setActiveNav]      = useState(null);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');

  const closeTimer    = useRef(null);
  const userMenuTimer = useRef(null);
  const searchInputRef = useRef(null);
  const navRef        = useRef(null);
  const innerRef      = useRef(null);
  const [panelLeft,   setPanelLeft]   = useState(0);

  /* Measure exact gap from panel-inner's left edge to where the nav starts.
     Both header__inner and header__panel-inner share the same max-width / margin:auto
     bounds, so their left edges are identical — subtracting them cancels that offset. */
  const measurePanelLeft = () => {
    if (!navRef.current || !innerRef.current) return;
    const navRect   = navRef.current.getBoundingClientRect();
    const innerRect = innerRef.current.getBoundingClientRect();
    const val = Math.round(navRect.left - innerRect.left);
    if (val > 0) setPanelLeft(val);
  };

  useEffect(() => {
    measurePanelLeft();

    /* Re-measure once the logo image finishes loading — before load the
       image has width: 0, which pulls the nav left and skews the offset. */
    const img = innerRef.current?.querySelector('.header__logo-img');
    if (img && !img.complete) img.addEventListener('load', measurePanelLeft);

    window.addEventListener('resize', measurePanelLeft);
    return () => {
      window.removeEventListener('resize', measurePanelLeft);
      if (img) img.removeEventListener('load', measurePanelLeft);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavEnter = (label) => {
    clearTimeout(closeTimer.current);
    if (searchOpen) { setSearchOpen(false); setSearchQuery(''); }
    measurePanelLeft(); // guaranteed-stable layout by the time user hovers
    setActiveNav(label);
  };
  const handleNavLeave = () => {
    closeTimer.current = setTimeout(() => setActiveNav(null), 120);
  };

  const activeItem = navItems.find(n => n.label === activeNav) ?? null;

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <div ref={innerRef} className="header__inner">

        <Link to="/" className="header__logo">
          <img src="/images/logo.png" alt="Canvera" className="header__logo-img" />
        </Link>

        {/* Nav triggers only — no panels rendered here */}
        <nav
          ref={navRef}
          className="header__nav"
          onMouseLeave={handleNavLeave}
          onMouseEnter={() => clearTimeout(closeTimer.current)}
        >
          {navItems.map((item) => (
            <div
              key={item.label}
              className="header__nav-item"
              onMouseEnter={() => handleNavEnter(item.label)}
            >
              <Link
                to={item.href}
                className={`header__nav-link ${activeNav === item.label ? 'header__nav-link--active' : ''}`}
              >
                {item.label}
                <ChevronDown open={activeNav === item.label} />
              </Link>
            </div>
          ))}
        </nav>

        <div className="header__tertiary">
          {tertiaryLinks.map((link) => (
            <Link key={link.label} to={link.href} className="header__tertiary-link">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="header__actions">

          {/* Search */}
          <button
            className="header__icon-btn"
            aria-label="Search"
            onClick={() => {
              setActiveNav(null);
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 60);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Account */}
          {isLoggedIn ? (
            <div
              className="header__user-menu-wrap"
              onMouseEnter={() => { clearTimeout(userMenuTimer.current); setUserMenuOpen(true); }}
              onMouseLeave={() => { userMenuTimer.current = setTimeout(() => setUserMenuOpen(false), 120); }}
            >
              <button className="header__icon-btn header__icon-btn--user" aria-label="Account">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {user?.status === 'verified' && <span className="header__verified-dot" />}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    className="header__user-dropdown"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    onMouseEnter={() => clearTimeout(userMenuTimer.current)}
                    onMouseLeave={() => { userMenuTimer.current = setTimeout(() => setUserMenuOpen(false), 120); }}
                  >
                    <div className="header__user-info">
                      <p className="header__user-name">{user?.name || 'My Account'}</p>
                      <p className="header__user-status">
                        {user?.status === 'verified' ? '✓ Verified' : 'Registered'}
                      </p>
                    </div>
                    <div className="header__user-links">
                      <Link to="/profile" className="header__user-link">Profile</Link>
                      <Link to="/orders" className="header__user-link">My Orders</Link>
                    </div>
                    <button
                      className="header__user-logout"
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="header__icon-btn" aria-label="Sign in">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="header__icon-btn header__cart-btn" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && <span className="header__cart-count">{cartCount}</span>}
          </Link>

          {/* Hamburger */}
          <button
            className="header__hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`header__hamburger-line ${mobileOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Unified nav panel — same clip-path animation for all dropdowns ── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            key={activeItem.label}
            className="header__panel"
            variants={PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={PANEL_TRANSITION}
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={handleNavLeave}
          >
            {/* Collections: visual image carousel */}
            {activeItem.label === 'Collections' ? (
              <div className="header__panel-collections" style={{ paddingLeft: panelLeft + 'px' }}>
                {collections.map((col) => (
                  <Link
                    key={col.id}
                    to={`/collections/${col.slug}`}
                    className="header__panel-col-card"
                    onClick={() => setActiveNav(null)}
                  >
                    <img src={col.image} alt={col.name} />
                    <span className="header__panel-col-card-overlay">
                      <span className="header__panel-col-card-name">{col.name}</span>
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              /* Shop & Support: text column grid */
              <div
                className="header__panel-inner"
                style={{ paddingLeft: panelLeft + 'px', '--cols': activeItem.columns.length }}
              >
                {activeItem.columns.map((col, i) => (
                  <div key={i} className="header__panel-col">
                    {col.title && (
                      <span className="header__panel-title">{col.title}</span>
                    )}
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="header__panel-link"
                        onClick={() => setActiveNav(null)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search panel ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="header__search-bar"
            variants={PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={PANEL_TRANSITION}
          >
            <div className="header__search-inner">
              <svg className="header__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="header__search-input"
                placeholder="Search albums, collections, occasions…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchOpen(false); setSearchQuery('');
                  }
                }}
              />
              {searchQuery && (
                <button className="header__search-clear" onClick={() => setSearchQuery('')} aria-label="Clear">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
              <button className="header__search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                Esc
              </button>
            </div>

            {!searchQuery && (
              <div className="header__search-hints">
                <span className="header__search-hint-label">Quick links</span>
                {[
                  { label: 'Celestial Collection', href: '/collections/celestial' },
                  { label: 'Suede Albums',         href: '/collections/suede' },
                  { label: 'Bestsellers',           href: '/shop?filter=bestseller' },
                  { label: 'New Arrivals',          href: '/shop?filter=new' },
                  { label: 'Verify Product',        href: '/genuine' },
                ].map(link => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="header__search-hint-link"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Shared backdrop — nav panels + search ──────────────────────── */}
      <AnimatePresence>
        {(activeNav || searchOpen) && (
          <motion.div
            className="header__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_TRANSITION}
            onClick={() => {
              setActiveNav(null);
              setSearchOpen(false);
              setSearchQuery('');
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile menu ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {navItems.map((item) => (
              <div key={item.label} className="header__mobile-nav-item">
                <button
                  className="header__mobile-link header__mobile-link--toggle"
                  onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                >
                  <span className="header__mobile-link-inner">
                    <Link to={item.href} onClick={e => e.stopPropagation()} className="header__mobile-link-label">
                      {item.label}
                    </Link>
                  </span>
                  <ChevronDown open={mobileExpanded === item.label} />
                </button>

                <AnimatePresence>
                  {mobileExpanded === item.label && (
                    <motion.div
                      className="header__mobile-submenu"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22 }}
                    >
                      {item.columns.flatMap(col => col.links).map(link => (
                        <Link key={link.label} to={link.href} className="header__mobile-sublink" onClick={() => setMobileOpen(false)}>
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="header__mobile-tertiary">
              {tertiaryLinks.map(link => (
                <Link key={link.label} to={link.href} className="header__mobile-tertiary-link">{link.label}</Link>
              ))}
            </div>

            <div className="header__mobile-ctas">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="btn btn--secondary btn--sm">My Account</Link>
                  <Link to="/shop" className="btn btn--primary btn--sm">Browse Albums</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn--secondary btn--sm">Sign In</Link>
                  <Link to="/signup" className="btn btn--primary btn--sm">Join Now</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
