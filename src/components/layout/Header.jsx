import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { productsMenu, communityMenu, supportMenu } from '../../data/navigation'
import CanveraLogo from '../common/CanveraLogo'
import '../../styles/header.css'


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
            <CanveraLogo height={26} />
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
