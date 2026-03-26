import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { shopMenu, supportMenu } from '../../data/navigation'
import collections from '../../data/collections'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import CanveraLogo from '../common/CanveraLogo'
import '../../styles/header.css'

/* ── SVG Icons ── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 12L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M1 1.5h2.8l1.4 8.3a1.1 1.1 0 001.1.9h7.1a1.1 1.1 0 001.1-.8L16.2 4.5H4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="15" r="1.2" fill="currentColor" />
    <circle cx="13.5" cy="15" r="1.2" fill="currentColor" />
  </svg>
)

const AccountIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 16.5c0-3.3 3-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ChevronIcon = () => (
  <svg className="nav-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const SignOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M6 14H3.5a1 1 0 01-1-1V3a1 1 0 011-1H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 11.5L14 8l-3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

/* ── Nav configuration ── */
const NAV_ITEMS = [
  { id: 'shop', label: 'Shop', href: '/shop', hasMega: true },
  { id: 'collections', label: 'Collections', href: '/collections', hasMega: true },
  { id: 'create', label: 'Create', href: null, hasDropdown: true },
  { id: 'support', label: 'Support', href: '/contact', hasDropdown: true },
]

const CREATE_LINKS = [
  { label: 'Make Your Own', href: '/custom', desc: 'Design your album from scratch' },
  { label: 'Design Services', href: '/design-services', desc: 'Let our experts design for you' },
  { label: 'Product Finder', href: '/find', desc: 'Find the perfect product' },
]


export default function Header() {
  const { authState, isRegistered, isVerified, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [activeMenu, setActiveMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const hoverTimer = useRef(null)
  const searchInputRef = useRef(null)
  const collectionScrollRef = useRef(null)

  /* Close everything on route change */
  useEffect(() => {
    setActiveMenu(null)
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location])

  /* Focus search input when opened */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 80)
    }
  }, [searchOpen])

  /* Escape key */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(null)
        setSearchOpen(false)
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  /* Lock body scroll when mobile drawer open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* Hover handlers for desktop mega-menus */
  const handleNavEnter = useCallback((id) => {
    clearTimeout(hoverTimer.current)
    setActiveMenu(id)
    setSearchOpen(false)
  }, [])

  const handleNavLeave = useCallback(() => {
    hoverTimer.current = setTimeout(() => setActiveMenu(null), 180)
  }, [])

  const handlePanelEnter = useCallback(() => {
    clearTimeout(hoverTimer.current)
  }, [])

  const handlePanelLeave = useCallback(() => {
    hoverTimer.current = setTimeout(() => setActiveMenu(null), 180)
  }, [])

  const closeAll = useCallback(() => {
    setActiveMenu(null)
    setSearchOpen(false)
  }, [])

  /* Collection scroll */
  const scrollCollection = useCallback((dir) => {
    const el = collectionScrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
  }, [])

  /* User initials for avatar */
  const userInitials = authState?.name
    ? authState.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const hasMega = activeMenu === 'shop' || activeMenu === 'collections'

  return (
    <>
      {/* ── Header Bar ── */}
      <header className={`hdr${hasMega ? ' hdr--mega-open' : ''}`}>
        <div className="hdr__inner">

          {/* Logo */}
          <Link to="/" className="hdr__logo" onClick={closeAll}>
            <CanveraLogo height={24} />
          </Link>

          {/* Center Nav (desktop) */}
          <nav className="hdr__nav">
            {NAV_ITEMS.map(item => (
              <div
                key={item.id}
                className="hdr__nav-item"
                onMouseEnter={() => (item.hasMega || item.hasDropdown) ? handleNavEnter(item.id) : undefined}
                onMouseLeave={handleNavLeave}
              >
                {item.href ? (
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `hdr__nav-link${activeMenu === item.id ? ' hdr__nav-link--open' : ''}${isActive ? ' hdr__nav-link--active' : ''}`
                    }
                  >
                    {item.label}
                    {(item.hasMega || item.hasDropdown) && <ChevronIcon />}
                  </NavLink>
                ) : (
                  <button
                    className={`hdr__nav-link${activeMenu === item.id ? ' hdr__nav-link--open' : ''}`}
                    onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                  >
                    {item.label}
                    {(item.hasMega || item.hasDropdown) && <ChevronIcon />}
                  </button>
                )}

                {/* Simple dropdown: Create */}
                {item.id === 'create' && activeMenu === 'create' && (
                  <div
                    className="hdr__dropdown"
                    onMouseEnter={handlePanelEnter}
                    onMouseLeave={handlePanelLeave}
                  >
                    {CREATE_LINKS.map(link => (
                      <Link key={link.href} to={link.href} className="hdr__dropdown-link" onClick={closeAll}>
                        <span className="hdr__dropdown-link-label">{link.label}</span>
                        <span className="hdr__dropdown-link-desc">{link.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Simple dropdown: Support */}
                {item.id === 'support' && activeMenu === 'support' && (
                  <div
                    className="hdr__dropdown"
                    onMouseEnter={handlePanelEnter}
                    onMouseLeave={handlePanelLeave}
                  >
                    {supportMenu.columns.map(col => (
                      col.links.map(link => (
                        <Link key={link.href + link.label} to={link.href} className="hdr__dropdown-link" onClick={closeAll}>
                          <span className="hdr__dropdown-link-label">{link.label}</span>
                        </Link>
                      ))
                    )).flat()}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hdr__actions">
            {/* Search */}
            <button
              className={`hdr__icon-btn${searchOpen ? ' hdr__icon-btn--active' : ''}`}
              onClick={() => { setSearchOpen(!searchOpen); setActiveMenu(null) }}
              aria-label="Search"
            >
              <SearchIcon />
            </button>

            {/* Account */}
            {isRegistered ? (
              <div
                className="hdr__account-wrap"
                onMouseEnter={() => handleNavEnter('account')}
                onMouseLeave={handleNavLeave}
              >
                <button className="hdr__avatar" aria-label="Account">
                  {userInitials}
                </button>

                {activeMenu === 'account' && (
                  <div
                    className="hdr__dropdown hdr__dropdown--account"
                    onMouseEnter={handlePanelEnter}
                    onMouseLeave={handlePanelLeave}
                  >
                    <div className="hdr__dropdown-user">
                      <div className="hdr__dropdown-user-avatar">{userInitials}</div>
                      <div className="hdr__dropdown-user-info">
                        <span className="hdr__dropdown-user-name">
                          {authState?.name || 'Photographer'}
                          {isVerified && (
                            <svg className="hdr__verified" viewBox="0 0 14 14" width="13" height="13" fill="none">
                              <circle cx="7" cy="7" r="6" fill="var(--brand-petrol)" />
                              <path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="hdr__dropdown-user-detail">{authState.studio || authState.email}</span>
                      </div>
                    </div>
                    <div className="hdr__dropdown-divider" />
                    <nav className="hdr__dropdown-nav">
                      {isVerified && <Link to="/profile" onClick={closeAll}>Dashboard</Link>}
                      <Link to="/shop" onClick={closeAll}>Shop Products</Link>
                      <Link to={isVerified ? '/profile' : '/login'} onClick={closeAll}>My Orders</Link>
                    </nav>
                    <div className="hdr__dropdown-divider" />
                    <nav className="hdr__dropdown-nav">
                      <Link to={isVerified ? '/profile' : '/login'} onClick={closeAll}>Profile</Link>
                      <Link to={isVerified ? '/profile' : '/login'} onClick={closeAll}>Club Canvera</Link>
                    </nav>
                    <div className="hdr__dropdown-divider" />
                    <button
                      className="hdr__dropdown-signout"
                      onClick={() => { closeAll(); navigate('/'); setTimeout(logout, 50) }}
                    >
                      <SignOutIcon /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="hdr__icon-btn"
                onClick={() => navigate('/login')}
                aria-label="Sign in"
              >
                <AccountIcon />
              </button>
            )}

            {/* Cart */}
            <button
              className="hdr__icon-btn hdr__cart-btn"
              onClick={() => navigate(isRegistered ? '/cart' : '/login?redirect=%2Fcart')}
              aria-label="Cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="hdr__cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="hdr__hamburger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Backdrop (for mega-menus) ── */}
      <div
        className={`hdr__backdrop${hasMega ? ' hdr__backdrop--visible' : ''}`}
        onClick={closeAll}
      />

      {/* ── Shop Mega Menu ── */}
      <div
        className={`hdr__mega${activeMenu === 'shop' ? ' hdr__mega--open' : ''}`}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
      >
        <div className="hdr__mega-inner">
          <div className="hdr__mega-grid">
            {/* Left: categories */}
            <div className="hdr__mega-col">
              <h3 className="hdr__mega-heading">Categories</h3>
              <div className="hdr__mega-links hdr__mega-links--primary">
                {shopMenu.columns[0].links.map(link => (
                  <Link key={link.href} to={link.href} onClick={closeAll}>{link.label}</Link>
                ))}
              </div>
            </div>
            {/* Right: quick links + featured */}
            <div className="hdr__mega-col">
              {shopMenu.columns.slice(1).map((col, i) => (
                <div key={i} className="hdr__mega-section">
                  <h3 className="hdr__mega-heading">{col.title}</h3>
                  <div className="hdr__mega-links">
                    {col.links.map(link => (
                      <Link key={link.href + link.label} to={link.href} onClick={closeAll}>{link.label}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Collections Mega Menu ── */}
      <div
        className={`hdr__mega${activeMenu === 'collections' ? ' hdr__mega--open' : ''}`}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
      >
        <div className="hdr__mega-inner">
          <div className="hdr__collections">
            <div className="hdr__collections-scroll" ref={collectionScrollRef}>
              {collections.map(col => (
                <Link
                  to={`/collections/${col.slug}`}
                  className="hdr__collection-card"
                  key={col.id}
                  onClick={closeAll}
                >
                  <div className={`hdr__collection-img cc-${col.imageVariant}`}>
                    <span className="hdr__collection-name">{col.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="hdr__collections-footer">
              <p className="hdr__collections-desc">
                Explore our curated album collections, each crafted from distinct materials and finishes.
              </p>
              <div className="hdr__collections-nav">
                <button className="hdr__collections-arrow" onClick={() => scrollCollection('left')} aria-label="Scroll left">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button className="hdr__collections-arrow" onClick={() => scrollCollection('right')} aria-label="Scroll right">
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search Panel ── */}
      <div className={`hdr__search-panel${searchOpen ? ' hdr__search-panel--open' : ''}`}>
        <div className="hdr__search-inner">
          <div className="hdr__search-bar">
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="text"
              className="hdr__search-input"
              placeholder="Search products, collections..."
            />
            <button className="hdr__search-close" onClick={() => setSearchOpen(false)} aria-label="Close search">
              <CloseIcon />
            </button>
          </div>
          <div className="hdr__search-quick">
            <h4>Quick Links</h4>
            <div className="hdr__search-quick-links">
              <Link to="/shop?category=photobooks" onClick={closeAll}>Photobooks</Link>
              <Link to="/shop?category=momentbooks" onClick={closeAll}>Momentbooks</Link>
              <Link to="/shop?category=magazines" onClick={closeAll}>Magazines</Link>
              <Link to="/collections" onClick={closeAll}>Collections</Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div className={`hdr__mobile-overlay${mobileOpen ? ' hdr__mobile-overlay--open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`hdr__mobile${mobileOpen ? ' hdr__mobile--open' : ''}`}>
        <div className="hdr__mobile-top">
          <CanveraLogo height={22} />
          <button className="hdr__mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>

        {/* Mobile search */}
        <div className="hdr__mobile-search">
          <SearchIcon />
          <input type="text" placeholder="Search..." className="hdr__mobile-search-input" />
        </div>

        {/* Mobile nav */}
        <nav className="hdr__mobile-nav">
          {NAV_ITEMS.map(item => (
            <div key={item.id} className="hdr__mobile-section">
              <button
                className={`hdr__mobile-link${mobileExpanded === item.id ? ' hdr__mobile-link--expanded' : ''}`}
                onClick={() => {
                  if (item.hasMega || item.hasDropdown) {
                    setMobileExpanded(mobileExpanded === item.id ? null : item.id)
                  } else if (item.href) {
                    navigate(item.href)
                    setMobileOpen(false)
                  }
                }}
              >
                {item.label}
                {(item.hasMega || item.hasDropdown) && <ChevronIcon />}
              </button>

              {/* Expanded sub-items */}
              {mobileExpanded === item.id && item.id === 'shop' && (
                <div className="hdr__mobile-sub">
                  {shopMenu.columns[0].links.map(link => (
                    <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                  ))}
                </div>
              )}
              {mobileExpanded === item.id && item.id === 'collections' && (
                <div className="hdr__mobile-sub">
                  {collections.map(col => (
                    <Link key={col.slug} to={`/collections/${col.slug}`} onClick={() => setMobileOpen(false)}>{col.name}</Link>
                  ))}
                </div>
              )}
              {mobileExpanded === item.id && item.id === 'create' && (
                <div className="hdr__mobile-sub">
                  {CREATE_LINKS.map(link => (
                    <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                  ))}
                </div>
              )}
              {mobileExpanded === item.id && item.id === 'support' && (
                <div className="hdr__mobile-sub">
                  {supportMenu.columns.flatMap(col => col.links).map(link => (
                    <Link key={link.href + link.label} to={link.href} onClick={() => setMobileOpen(false)}>{link.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile bottom */}
        <div className="hdr__mobile-bottom">
          {isRegistered ? (
            <>
              <div className="hdr__mobile-user">
                <div className="hdr__avatar hdr__avatar--sm">{userInitials}</div>
                <span>{authState?.name || 'Account'}</span>
              </div>
              <Link to="/cart" className="hdr__mobile-cart-link" onClick={() => setMobileOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
              <button className="hdr__mobile-signout" onClick={() => { setMobileOpen(false); navigate('/'); setTimeout(logout, 50) }}>
                <SignOutIcon /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hdr__mobile-login" onClick={() => setMobileOpen(false)}>
                Sign In / Sign Up
              </Link>
              <Link to="/cart" className="hdr__mobile-cart-link" onClick={() => setMobileOpen(false)}>
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
