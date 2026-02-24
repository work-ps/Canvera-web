import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { productsMenu, communityMenu, supportMenu } from '../../data/navigation'
import '../../styles/header.css'

const CANVERA_LOGO = 'data:image/jpeg;base64,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'

export default function Header() {
  const [activePanel, setActivePanel] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const hoverTimeoutRef = useRef(null)
  const searchInputRef = useRef(null)
  const location = useLocation()

  // Close panels on route change
  useEffect(() => {
    closePanel()
  }, [location])

  const openPanel = useCallback((panelId) => {
    clearTimeout(hoverTimeoutRef.current)
    setActivePanel(panelId)
    setIsPanelOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setActivePanel(null)
    setIsPanelOpen(false)
  }, [])

  const handleNavEnter = useCallback((panelId) => {
    clearTimeout(hoverTimeoutRef.current)
    openPanel(panelId)
  }, [openPanel])

  const handleNavLeave = useCallback((panelId) => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActivePanel(prev => prev === panelId ? null : prev)
      setIsPanelOpen(prev => activePanel === panelId ? false : prev)
    }, 200)
  }, [activePanel])

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

  const panelData = { products: productsMenu, community: communityMenu, support: supportMenu }

  const chevSvg = (
    <svg className="chev" viewBox="0 0 10 10" fill="none">
      <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const renderMenuPanel = (menuData) => (
    <div className="products-grid">
      {menuData.columns.map((col, i) => (
        <div className="products-col" key={i}>
          <h3>{col.title}</h3>
          <div className={i === 0 && activePanel === 'products' ? 'products-list' : 'sec-links'}>
            {col.links.map((link, j) => (
              <Link to={link.href} key={j} onClick={closePanel}>{link.label}</Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <header className={`site-header${isPanelOpen ? ' panel-open' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <img src={CANVERA_LOGO} alt="Canvera" />
          </Link>

          <nav className="header-nav">
            {['products', 'community', 'support'].map(panel => (
              <button
                key={panel}
                className={`nav-link${activePanel === panel ? ' active' : ''}`}
                onMouseEnter={() => handleNavEnter(panel)}
                onMouseLeave={() => handleNavLeave(panel)}
              >
                {panel.charAt(0).toUpperCase() + panel.slice(1)}
                {chevSvg}
              </button>
            ))}
            <Link className="nav-link" to="/products">Own Your Album</Link>
          </nav>

          <div className="header-auth">
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
            <Link className="auth-contact" to="/login">
              <svg viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M2 14.5c0-3 2.7-5.5 6-5.5s6 2.5 6 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              Profile
            </Link>
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

      {/* Menu Panels */}
      {['products', 'community', 'support'].map(panel => (
        <div
          key={panel}
          className={`dropdown-panel${activePanel === panel ? ' open' : ''}`}
          onMouseEnter={handlePanelEnter}
          onMouseLeave={handlePanelLeave}
        >
          <div className="panel-inner">
            {renderMenuPanel(panelData[panel])}
          </div>
        </div>
      ))}

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
    </>
  )
}
