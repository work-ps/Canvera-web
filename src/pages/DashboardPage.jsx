import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard.css'


/* ---- Sidebar nav definition ---- */
const NAV_SECTIONS = [
  {
    label: 'Main',
    items: [
      {
        id: 'overview',
        name: 'Overview',
        icon: <svg viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>,
      },
      {
        id: 'shop-products',
        name: 'Shop Products',
        icon: <svg viewBox="0 0 16 16" fill="none"><path d="M4 1.5L2 4.5v9a1 1 0 001 1h10a1 1 0 001-1v-9L12 1.5H4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 4.5h12" stroke="currentColor" strokeWidth="1.4"/><path d="M10.5 7a2.5 2.5 0 01-5 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      },
      {
        id: 'my-orders',
        name: 'My Orders',
        icon: <svg viewBox="0 0 16 16" fill="none"><path d="M9.5 1.5H3.5a1 1 0 00-1 1v11a1 1 0 001 1h9a1 1 0 001-1V5L9.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 1.5V5h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        id: 'profile',
        name: 'Profile',
        icon: <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M2.5 14c0-2.8 2.5-5 5.5-5s5.5 2.2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      },
      {
        id: 'club-canvera',
        name: 'Club Canvera',
        icon: <svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.85 3.75L14 5.85l-3 2.92.7 4.13L8 10.95 4.3 12.9l.7-4.13-3-2.92 4.15-.6L8 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      },
    ],
  },
  {
    label: 'Support',
    items: [
      {
        id: 'help-faqs',
        name: 'Help & FAQs',
        icon: <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M6 6.2a2 2 0 013.9.6c0 1.3-2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>,
      },
      {
        id: 'sales-support',
        name: 'Sales Support',
        icon: <svg viewBox="0 0 16 16" fill="none"><path d="M2.5 8V6a5.5 5.5 0 0111 0v2" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 8.5a1 1 0 011-1h1v4h-1a1 1 0 01-1-1v-2zM12.5 7.5h1a1 1 0 011 1v2a1 1 0 01-1 1h-1v-4z" stroke="currentColor" strokeWidth="1.4"/><path d="M13.5 11.5v1a2 2 0 01-2 2H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      },
    ],
  },
]


export default function DashboardPage() {
  const { authState, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    navigate('/', { replace: true })
    setTimeout(logout, 50)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        {/* ---- Sidebar ---- */}
        <aside className="dashboard-sidebar">
          {/* User profile */}
          <div className="dashboard-sidebar-user">
            <div className="dashboard-user-avatar">
              {authState?.name?.charAt(0) || 'P'}
            </div>
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">
                {authState?.name || 'Photographer'}
              </span>
              <span className="dashboard-user-badge">
                <svg viewBox="0 0 10 10" fill="none">
                  <path d="M2.5 5l2 2 3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Verified
              </span>
            </div>
          </div>

          {/* Nav sections */}
          <nav className="dashboard-nav">
            {NAV_SECTIONS.map((section) => (
              <div className="dashboard-nav-section" key={section.label}>
                <span className="dashboard-nav-label">{section.label}</span>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className={`dashboard-nav-item${activeTab === item.id ? ' active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          {/* Sign out */}
          <button className="dashboard-signout" onClick={handleLogout}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3.5a1 1 0 01-1-1V3a1 1 0 011-1H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 11.5L14 8l-3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Sign Out
          </button>
        </aside>

        {/* ---- Main Content ---- */}
        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <DashboardOverview authState={authState} />
          )}
          {activeTab !== 'overview' && (
            <DashboardPlaceholder
              title={
                NAV_SECTIONS
                  .flatMap(s => s.items)
                  .find(i => i.id === activeTab)?.name || activeTab
              }
            />
          )}
        </main>
      </div>
    </div>
  )
}


/* ---- Overview sub-component ---- */
function DashboardOverview({ authState }) {
  return (
    <div className="dashboard-overview">
      <h1 className="dashboard-welcome">
        Welcome back, {authState?.name?.split(' ')[0] || 'Photographer'}
      </h1>
      <p className="dashboard-welcome-sub">
        Here's your dashboard overview. Manage orders, explore products, and grow your business.
      </p>

      {/* CTA Cards */}
      <div className="dashboard-cta-grid">
        {/* Place New Order */}
        <div className="dashboard-cta-card dashboard-cta-card--primary">
          <div className="dashboard-cta-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Place New Order</h3>
          <p>Start a new album or product order from our premium catalog.</p>
          <button className="btn btn-primary btn-md">Place Order</button>
        </div>

        {/* Create Order */}
        <div className="dashboard-cta-card dashboard-cta-card--accent">
          <div className="dashboard-cta-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M14.5 3.5L18.5 7.5L7 19H3v-4L14.5 3.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6l4 4" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
          </div>
          <h3>Create Order</h3>
          <p>Design a custom album using our intuitive builder tools.</p>
          <button className="btn btn-outline btn-md">Start Creating</button>
        </div>

        {/* View All Orders */}
        <div className="dashboard-cta-card dashboard-cta-card--neutral">
          <div className="dashboard-cta-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 10h16M4 14h12M4 18h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>View All Orders</h3>
          <p>Track status and manage all your existing orders.</p>
          <button className="btn btn-ghost btn-md">View Orders</button>
        </div>
      </div>

      {/* Quick Stats */}
      <h3 className="dashboard-stats-title">Quick Stats</h3>
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">0</span>
          <span className="dashboard-stat-label">Active Orders</span>
        </div>
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">0</span>
          <span className="dashboard-stat-label">Completed</span>
        </div>
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">{authState?.plan === 'pro' ? 'Pro' : 'Free'}</span>
          <span className="dashboard-stat-label">Current Plan</span>
        </div>
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">{authState?.city || '—'}</span>
          <span className="dashboard-stat-label">Location</span>
        </div>
      </div>
    </div>
  )
}


/* ---- Placeholder sub-component ---- */
function DashboardPlaceholder({ title }) {
  return (
    <div className="dashboard-placeholder">
      <div className="dashboard-placeholder-icon">
        <svg viewBox="0 0 64 64" fill="none">
          <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2.5"/>
          <path d="M8 28h48" stroke="currentColor" strokeWidth="2"/>
          <circle cx="20" cy="22" r="2" fill="currentColor" opacity="0.5"/>
          <circle cx="28" cy="22" r="2" fill="currentColor" opacity="0.5"/>
          <circle cx="36" cy="22" r="2" fill="currentColor" opacity="0.5"/>
          <path d="M22 38h20M26 44h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </div>
      <h2>{title}</h2>
      <p>This section is coming soon. Stay tuned!</p>
    </div>
  )
}
