import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { shopMenu, supportMenu } from '../../data/navigation'
import collections from '../../data/collections'
import { useAuth } from '../../context/AuthContext'
import CanveraLogo from '../common/CanveraLogo'
import ProductFinder from '../finder/ProductFinder'
import '../../styles/header.css'
import '../../styles/collection-panel.css'


const panelLabels = { shop: 'Shop', collection: 'Collection', support: 'Support' }
const panelRoutes = { shop: '/products', collection: '/collections', support: '/contact' }
const panelData = { shop: shopMenu, support: supportMenu }

// SVGs for collection cards in the dropdown
const collectionCardSvgs = {
  petrol: <svg viewBox="0 0 80 60" fill="none"><rect x="3" y="3" width="74" height="54" rx="6" stroke="currentColor" strokeWidth="1.5"/><path d="M3 42l20-15 14 8 17-14 20 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  amber: <svg viewBox="0 0 80 60" fill="none"><rect x="3" y="3" width="74" height="54" rx="6" stroke="currentColor" strokeWidth="1.5"/><path d="M40 17v26M27 30h26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  warm: <svg viewBox="0 0 80 60" fill="none"><path d="M40 8c-8 0-15 3-15 3v40s7-3 15-3 15 3 15 3V11s-7-3-15-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M40 8v40" stroke="currentColor" strokeWidth="1"/></svg>,
  dark: <svg viewBox="0 0 80 60" fill="none"><rect x="3" y="3" width="74" height="54" rx="6" stroke="currentColor" strokeWidth="1.5"/><path d="M24 20l8 8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M38 40h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  neutral: <svg viewBox="0 0 80 60" fill="none"><rect x="6" y="3" width="68" height="54" rx="5" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="10" width="52" height="30" rx="3" stroke="currentColor" strokeWidth="1"/></svg>,
  mixed: <svg viewBox="0 0 80 60" fill="none"><rect x="10" y="5" width="60" height="50" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M20 17h40M20 26h30M20 35h34M20 44h24" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>,
  leaf: <svg viewBox="0 0 80 60" fill="none"><path d="M40 54V26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M40 26c-16-11-28 0-28 14s19 8 28-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  deep: <svg viewBox="0 0 80 60" fill="none"><rect x="5" y="7" width="70" height="46" rx="5" stroke="currentColor" strokeWidth="1.5"/><path d="M5 19h70" stroke="currentColor" strokeWidth="1"/><path d="M20 33l11 11 23-20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}


export default function Header() {
  const { authState, isRegistered, isVerified, logout } = useAuth()
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [showFinder, setShowFinder] = useState(false)
  const hoverTimeoutRef = useRef(null)
  const searchInputRef = useRef(null)
  const collectionScrollRef = useRef(null)
  const location = useLocation()

  const scrollCollection = useCallback((direction) => {
    const container = collectionScrollRef.current
    if (!container) return
    const scrollAmount = 270
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }, [])

  // Close panels on route change
  useEffect(() => {
    closePanel()
  }, [location])

  const openPanel = useCallback((panelId) => {
    clearTimeout(hoverTimeoutRef.current)
    setActivePanel(panelId)
    // Only show backdrop for full-width nav panels, not profile/account dropdowns
    if (panelId !== 'profile' && panelId !== 'account') {
      setIsPanelOpen(true)
    }
  }, [])

  const closePanel = useCallback(() => {
    setActivePanel(null)
    setIsPanelOpen(false)
  }, [])

  const handleNavEnter = useCallback((panelId) => {
    clearTimeout(hoverTimeoutRef.current)
    openPanel(panelId)
  }, [openPanel])

  const handleNavLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(closePanel, 200)
  }, [closePanel])

  const handlePanelEnter = useCallback(() => {
    clearTimeout(hoverTimeoutRef.current)
  }, [])

  const handlePanelLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(closePanel, 200)
  }, [closePanel])

  const toggleSearch = useCallback(() => {
    if (activePanel === 'search') closePanel()
    else openPanel('search')
  }, [activePanel, openPanel, closePanel])

  // Focus search input when search panel opens
  useEffect(() => {
    if (activePanel === 'search' && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 50)
    }
  }, [activePanel])

  // Close on escape
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') closePanel() }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closePanel])

  // Close on scroll
  useEffect(() => {
    let lastY = 0
    const handleScroll = () => {
      if (Math.abs(window.scrollY - lastY) > 50) { closePanel(); lastY = window.scrollY }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [closePanel])

  const chevSvg = (
    <svg className="chev" viewBox="0 0 10 10" fill="none">
      <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  /* ---- Panel renderers ---- */

  const renderMenuPanel = (menuData) => (
    <div className={`products-grid${menuData.columns.length === 2 ? ' two-col' : ''}`}>
      {menuData.columns.map((col, i) => (
        <div className="products-col" key={i}>
          <h3>{col.title}</h3>
          <div className={i === 0 && activePanel === 'shop' ? 'products-list' : 'sec-links'}>
            {col.links.map((link, j) => (
              <Link to={link.href} key={j} onClick={closePanel}>{link.label}</Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const renderCollectionPanel = () => (
    <div className="collection-panel-wrap">
      <div className="collection-panel-inner" ref={collectionScrollRef}>
        {collections.map(col => (
          <Link
            to={`/collections/${col.slug}`}
            className="collection-card"
            key={col.id}
            onClick={closePanel}
          >
            <div className={`collection-card-image cc-${col.imageVariant}`}>
              {collectionCardSvgs[col.imageVariant] || collectionCardSvgs.petrol}
              <span className="collection-card-name">{col.name}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="collection-panel-footer">
        <p className="collection-panel-desc">
          Our albums are organized into nine distinct collections, each deriving from a unique material foundation and realized through distinct textures, finishes, and artisan craftsmanship.
        </p>
        <div className="collection-panel-nav">
          <button className="collection-nav-btn" onClick={() => scrollCollection('left')} aria-label="Previous collections">
            <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="collection-nav-btn" onClick={() => scrollCollection('right')} aria-label="Next collections">
            <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <header className={`site-header${isPanelOpen ? ' panel-open' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <CanveraLogo height={26} />
          </Link>

          <nav className="header-nav">
            {/* Dropdown tabs: Shop, Collection, Support */}
            {['shop', 'collection', 'support'].map(panel => (
              <button
                key={panel}
                className={`nav-link${activePanel === panel ? ' active' : ''}`}
                onMouseEnter={() => handleNavEnter(panel)}
                onMouseLeave={handleNavLeave}
                onClick={() => { closePanel(); navigate(panelRoutes[panel]) }}
              >
                {panelLabels[panel]}
                {chevSvg}
              </button>
            ))}

            {/* Find Your Product */}
            <button className="nav-link" onClick={() => { closePanel(); setShowFinder(true) }}>
              Find Your Product
            </button>

            {/* Make Your Own */}
            <Link className="nav-link" to="/own-your-album">Make Your Own</Link>
          </nav>

          <div className="header-auth">
            {/* Search */}
            <button
              className={`nav-search${activePanel === 'search' ? ' active' : ''}`}
              onClick={toggleSearch}
              aria-label="Search"
            >
              <svg viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M10.5 10.5L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Profile / Account dropdown */}
            {isRegistered ? (
              <div
                className="profile-trigger-wrap"
                onMouseEnter={() => handleNavEnter('account')}
                onMouseLeave={handleNavLeave}
              >
                <button className="profile-link profile-link--active">
                  <svg viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M2 14.5c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {authState.name?.split(' ')[0]}
                  {isVerified && (
                    <svg className="header-verified-badge" viewBox="0 0 14 14" fill="none" width="12" height="12">
                      <circle cx="7" cy="7" r="6" fill="var(--petrol-600, #00778B)" />
                      <path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>

                {activePanel === 'account' && (
                  <div
                    className="profile-dropdown profile-dropdown--account"
                    onMouseEnter={handlePanelEnter}
                    onMouseLeave={handlePanelLeave}
                  >
                    <div className="profile-dropdown-user">
                      <div className="profile-dropdown-avatar">
                        {authState.name?.charAt(0) || 'P'}
                      </div>
                      <div className="profile-dropdown-user-info">
                        <span className="profile-dropdown-user-name">
                          {authState.name || 'Photographer'}
                          {isVerified && (
                            <svg className="header-verified-badge" viewBox="0 0 14 14" fill="none" width="13" height="13">
                              <circle cx="7" cy="7" r="6" fill="var(--petrol-600, #00778B)" />
                              <path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <span className="profile-dropdown-user-detail">
                          {authState.studio || authState.email}
                        </span>
                      </div>
                    </div>

                    <div className="profile-dropdown-divider" />

                    <nav className="profile-dropdown-links">
                      {isVerified && <Link to="/dashboard" onClick={closePanel}>Dashboard</Link>}
                      <Link to="/products" onClick={closePanel}>Shop Products</Link>
                      <Link to={isVerified ? '/dashboard' : '/login'} onClick={() => closePanel()}>My Orders</Link>
                    </nav>

                    <div className="profile-dropdown-divider" />

                    <nav className="profile-dropdown-links">
                      <Link to={isVerified ? '/dashboard' : '/login'} onClick={closePanel}>Profile</Link>
                      <Link to={isVerified ? '/dashboard' : '/login'} onClick={closePanel}>Club Canvera</Link>
                    </nav>

                    <div className="profile-dropdown-divider" />

                    <button
                      className="profile-dropdown-signout"
                      onClick={() => { closePanel(); navigate('/'); setTimeout(logout, 50) }}
                    >
                      <svg viewBox="0 0 16 16" fill="none">
                        <path d="M6 14H3.5a1 1 0 01-1-1V3a1 1 0 011-1H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.5 11.5L14 8l-3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="profile-trigger-wrap"
                onMouseEnter={() => handleNavEnter('profile')}
                onMouseLeave={handleNavLeave}
              >
                <button className="profile-link" onClick={() => navigate('/login')}>
                  <svg viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M2 14.5c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  Profile
                </button>

                {activePanel === 'profile' && (
                  <div
                    className="profile-dropdown"
                    onMouseEnter={handlePanelEnter}
                    onMouseLeave={handlePanelLeave}
                  >
                    <div className="profile-dropdown-header">
                      <span className="profile-dropdown-welcome">Welcome</span>
                      <span className="profile-dropdown-subtitle">To access account and manage orders</span>
                    </div>
                    <Link to="/login" className="profile-dropdown-cta" onClick={closePanel}>
                      LOGIN / SIGNUP
                    </Link>
                    <div className="profile-dropdown-divider" />
                    <nav className="profile-dropdown-links">
                      <Link to="/login" onClick={closePanel}>Orders</Link>
                      <Link to="/contact" onClick={closePanel}>Contact Us</Link>
                    </nav>
                  </div>
                )}
              </div>
            )}

            {/* Contact Us */}
            <Link className="auth-cta" to="/contact">Contact Us</Link>
          </div>

          <button className="mobile-toggle" aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`dropdown-backdrop${isPanelOpen ? ' visible' : ''}`}
        onClick={closePanel}
      />

      {/* Shop Panel — fixed height */}
      <div
        className={`dropdown-panel panel-fixed${activePanel === 'shop' ? ' open' : ''}`}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
      >
        <div className="panel-inner">
          {renderMenuPanel(panelData.shop)}
        </div>
      </div>

      {/* Support Panel — content-driven height */}
      <div
        className={`dropdown-panel${activePanel === 'support' ? ' open' : ''}`}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
      >
        <div className="panel-inner">
          {renderMenuPanel(panelData.support)}
        </div>
      </div>

      {/* Collection Panel — same fixed height as Shop */}
      <div
        className={`dropdown-panel panel-fixed${activePanel === 'collection' ? ' open' : ''}`}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
      >
        <div className="panel-inner">
          {renderCollectionPanel()}
        </div>
      </div>

      {/* Search Panel */}
      <div
        className={`dropdown-panel${activePanel === 'search' ? ' open' : ''}`}
        onMouseEnter={handlePanelEnter}
        onMouseLeave={handlePanelLeave}
      >
        <div className="panel-inner">
          <div className="search-wrap">
            <svg viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M10.5 10.5L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input ref={searchInputRef} className="search-input" type="text" placeholder="Search canvera.com" />
          </div>
          <div className="quick-links">
            <h4>Quick Links</h4>
            <Link to="/products?category=premium-albums" onClick={closePanel}><span className="arrow">&rarr;</span> Premium Flushmount Albums</Link>
            <Link to="/products?category=standard-albums" onClick={closePanel}><span className="arrow">&rarr;</span> Standard Albums</Link>
            <Link to="/products?category=photobooks" onClick={closePanel}><span className="arrow">&rarr;</span> Photobooks &amp; Magazines</Link>
            <Link to="/contact" onClick={closePanel}><span className="arrow">&rarr;</span> Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Product Finder Overlay */}
      {showFinder && <ProductFinder onClose={() => setShowFinder(false)} />}
    </>
  )
}
