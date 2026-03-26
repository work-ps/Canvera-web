import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard.css'


/* ---- Helper: time-based greeting ---- */
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ---- Sidebar nav items ---- */
const NAV_ITEMS = [
  {
    id: 'overview',
    name: 'Overview',
    icon: <svg viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>,
  },
  {
    id: 'my-orders',
    name: 'My Orders',
    icon: <svg viewBox="0 0 16 16" fill="none"><path d="M9.5 1.5H3.5a1 1 0 00-1 1v11a1 1 0 001 1h9a1 1 0 001-1V5L9.5 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.5 1.5V5h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  },
  {
    id: 'saved-drafts',
    name: 'Saved Drafts',
    icon: <svg viewBox="0 0 16 16" fill="none"><path d="M14.5 10v3.5a1 1 0 01-1 1h-11a1 1 0 01-1-1V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 1.5v9M4.5 7L8 10.5 11.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'account-settings',
    name: 'Account Settings',
    icon: <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M13.3 10.2a1.1 1.1 0 00.2 1.2l.04.04a1.33 1.33 0 11-1.89 1.89l-.03-.04a1.1 1.1 0 00-1.22-.22 1.1 1.1 0 00-.67 1.01v.12a1.33 1.33 0 01-2.66 0v-.06a1.1 1.1 0 00-.72-1.01 1.1 1.1 0 00-1.22.22l-.03.04a1.33 1.33 0 11-1.89-1.89l.04-.04a1.1 1.1 0 00.22-1.22 1.1 1.1 0 00-1.01-.67h-.12a1.33 1.33 0 010-2.66h.06a1.1 1.1 0 001.01-.72 1.1 1.1 0 00-.22-1.22l-.04-.03A1.33 1.33 0 115 3.68l.04.04a1.1 1.1 0 001.22.22h.05a1.1 1.1 0 00.67-1.01v-.12a1.33 1.33 0 012.66 0v.06a1.1 1.1 0 00.67 1.01 1.1 1.1 0 001.22-.22l.03-.04a1.33 1.33 0 111.89 1.89l-.04.04a1.1 1.1 0 00-.22 1.22v.05a1.1 1.1 0 001.01.67h.12a1.33 1.33 0 010 2.66h-.06a1.1 1.1 0 00-1.01.67z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'help-support',
    name: 'Help & Support',
    icon: <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M6 6.2a2 2 0 013.9.6c0 1.3-2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.5" fill="currentColor"/></svg>,
  },
]

/* ---- Filter pills for orders ---- */
const ORDER_FILTERS = ['All', 'Processing', 'Shipped', 'Delivered']

/* ---- Dummy data ---- */
const DUMMY_ORDERS = [
  {
    id: 'ORD-20241',
    date: '2025-03-15',
    product: 'Premium Mesmera Album',
    thumbnail: '/images/products/premium-mesmera/1.jpg',
    config: '12x12 in, 40 pages, Leather cover',
    status: 'Delivered',
    total: '8,499',
  },
  {
    id: 'ORD-20232',
    date: '2025-02-28',
    product: 'Regal Collection Album',
    thumbnail: '/images/products/regal/1.png',
    config: '10x10 in, 30 pages, Custom cover',
    status: 'Shipped',
    total: '6,299',
  },
  {
    id: 'ORD-20223',
    date: '2025-01-10',
    product: 'Encanto Flush Mount',
    thumbnail: '/images/products/encanto/1.jpg',
    config: '14x11 in, 50 pages, Fabric binding',
    status: 'Processing',
    total: '12,999',
  },
]

const DUMMY_DRAFTS = [
  {
    id: 'DRF-001',
    product: 'Luxury Album',
    thumbnail: '/images/products/luxury/2.jpg',
    lastModified: '2025-03-20',
    completion: 65,
  },
  {
    id: 'DRF-002',
    product: 'Moment Book',
    thumbnail: '/images/products/moment-book/1.jpg',
    lastModified: '2025-03-10',
    completion: 30,
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

  const firstName = authState?.name?.split(' ')[0] || 'User'
  const initials = (authState?.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const isVerified = authState?.status === 'verified'

  const memberSince = useMemo(() => {
    if (!authState?.registeredAt) return '--'
    const d = new Date(authState.registeredAt)
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
  }, [authState?.registeredAt])

  return (
    <div className="dashboard">
      <div className="dashboard-body">
        {/* ---- Sidebar ---- */}
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-user">
            <div className="dashboard-user-avatar">{initials}</div>
            <div className="dashboard-user-info">
              <span className="dashboard-user-name">{authState?.name || 'User'}</span>
              <span className="dashboard-user-email">{authState?.email || ''}</span>
              {isVerified ? (
                <span className="badge badge-success">Verified</span>
              ) : (
                <span className="badge badge-warning">Pending Verification</span>
              )}
            </div>
          </div>

          <nav className="dashboard-nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`dashboard-nav-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>

          <button className="dashboard-signout" onClick={handleLogout}>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3.5a1 1 0 01-1-1V3a1 1 0 011-1H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 11.5L14 8l-3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            Sign Out
          </button>
        </aside>

        {/* ---- Mobile tab bar ---- */}
        <div className="dashboard-mobile-tabs">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`dashboard-mobile-tab${activeTab === item.id ? ' active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* ---- Main Content ---- */}
        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <OverviewTab
              firstName={firstName}
              authState={authState}
              memberSince={memberSince}
            />
          )}
          {activeTab === 'my-orders' && <OrdersTab />}
          {activeTab === 'saved-drafts' && <DraftsTab />}
          {activeTab === 'account-settings' && <SettingsTab authState={authState} />}
          {activeTab === 'help-support' && <EmptyState title="Help & Support" message="Get in touch with our support team." ctaText="Contact Us" ctaLink="/contact" />}
        </main>
      </div>
    </div>
  )
}


/* ===========================================================================
   OVERVIEW TAB
   =========================================================================== */
function OverviewTab({ firstName, authState, memberSince }) {
  return (
    <div className="dashboard-overview">
      <h1 className="dashboard-greeting">{getGreeting()}, {firstName}</h1>
      {authState?.studio && (
        <p className="dashboard-studio">{authState.studio}</p>
      )}

      {/* Stats row */}
      <div className="dashboard-stats-row">
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">{DUMMY_ORDERS.length}</span>
          <span className="dashboard-stat-label">Orders</span>
        </div>
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">{DUMMY_DRAFTS.length}</span>
          <span className="dashboard-stat-label">Drafts</span>
        </div>
        <div className="dashboard-stat-card">
          <span className="dashboard-stat-value">{memberSince}</span>
          <span className="dashboard-stat-label">Member Since</span>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Recent Orders</h2>
        <div className="dashboard-recent-orders">
          {DUMMY_ORDERS.slice(0, 3).map(order => (
            <div key={order.id} className="dashboard-order-compact">
              <img src={order.thumbnail} alt={order.product} className="dashboard-order-thumb" />
              <div className="dashboard-order-info">
                <span className="dashboard-order-name">{order.product}</span>
                <span className="dashboard-order-date">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <StatusBadge status={order.status} />
              <span className="dashboard-order-price">&#8377;{order.total}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title">Quick Actions</h2>
        <div className="dashboard-quick-actions">
          <Link to="/shop" className="dashboard-action-card">
            <div className="dashboard-action-icon dashboard-action-icon--primary">
              <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </div>
            <span className="dashboard-action-label">New Order</span>
          </Link>
          <Link to="/profile" className="dashboard-action-card">
            <div className="dashboard-action-icon dashboard-action-icon--teal">
              <svg viewBox="0 0 20 20" fill="none"><path d="M14.5 3.5L18.5 7.5L7 19H3v-4L14.5 3.5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="dashboard-action-label">Resume Draft</span>
          </Link>
          <Link to="/contact" className="dashboard-action-card">
            <div className="dashboard-action-icon dashboard-action-icon--neutral">
              <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M7.5 7.7a2.5 2.5 0 014.88.75c0 1.67-2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="14" r="0.5" fill="currentColor"/></svg>
            </div>
            <span className="dashboard-action-label">Get Support</span>
          </Link>
        </div>
      </div>
    </div>
  )
}


/* ===========================================================================
   ORDERS TAB
   =========================================================================== */
function OrdersTab() {
  const [filter, setFilter] = useState('All')

  const filteredOrders = filter === 'All'
    ? DUMMY_ORDERS
    : DUMMY_ORDERS.filter(o => o.status === filter)

  return (
    <div className="dashboard-tab-content">
      <h1 className="dashboard-tab-title">My Orders</h1>

      <div className="dashboard-filter-pills">
        {ORDER_FILTERS.map(f => (
          <button
            key={f}
            className={`dashboard-pill${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState title="No orders yet" message="Browse our premium collection and place your first order." ctaText="Browse Products" ctaLink="/shop" />
      ) : (
        <div className="dashboard-orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="dashboard-order-card">
              <img src={order.thumbnail} alt={order.product} className="dashboard-order-card-thumb" />
              <div className="dashboard-order-card-body">
                <div className="dashboard-order-card-top">
                  <span className="dashboard-order-card-id">{order.id}</span>
                  <span className="dashboard-order-card-date">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <h3 className="dashboard-order-card-name">{order.product}</h3>
                <p className="dashboard-order-card-config">{order.config}</p>
                <div className="dashboard-order-card-bottom">
                  <StatusBadge status={order.status} />
                  <span className="dashboard-order-card-total">&#8377;{order.total}</span>
                  <div className="dashboard-order-card-actions">
                    <button className="btn btn-ghost btn-sm">Track</button>
                    <button className="btn btn-ghost btn-sm">Reorder</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


/* ===========================================================================
   DRAFTS TAB
   =========================================================================== */
function DraftsTab() {
  if (DUMMY_DRAFTS.length === 0) {
    return <EmptyState title="No saved configurations" message="Start building a custom product and save your progress." ctaText="Start Building" ctaLink="/shop" />
  }

  return (
    <div className="dashboard-tab-content">
      <h1 className="dashboard-tab-title">Saved Drafts</h1>
      <div className="dashboard-drafts-list">
        {DUMMY_DRAFTS.map(draft => (
          <div key={draft.id} className="dashboard-draft-card">
            <img src={draft.thumbnail} alt={draft.product} className="dashboard-draft-thumb" />
            <div className="dashboard-draft-body">
              <h3 className="dashboard-draft-name">{draft.product}</h3>
              <span className="dashboard-draft-date">
                Last modified {new Date(draft.lastModified).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <div className="dashboard-draft-progress">
                <div className="dashboard-draft-progress-bar">
                  <div
                    className="dashboard-draft-progress-fill"
                    style={{ width: `${draft.completion}%` }}
                  />
                </div>
                <span className="dashboard-draft-progress-label">{draft.completion}%</span>
              </div>
            </div>
            <div className="dashboard-draft-actions">
              <button className="btn btn-primary btn-sm">Resume &rarr;</button>
              <button className="btn btn-ghost btn-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


/* ===========================================================================
   SETTINGS TAB
   =========================================================================== */
function SettingsTab({ authState }) {
  const [personalForm, setPersonalForm] = useState({
    name: authState?.name || '',
    phone: authState?.phone || '',
  })
  const [studioForm, setStudioForm] = useState({
    studioName: authState?.studio || '',
    city: authState?.city || '',
    instagram: authState?.businessProof || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  })

  const isPhotographer = authState?.isPhotographer || authState?.studio

  /* ---- Saved Addresses ---- */
  const DEFAULT_ADDRESSES = [
    { id: 'addr-1', label: 'Home', name: 'Rajesh Kumar', phone: '9876543210', address1: '42, MG Road', address2: 'Near City Mall', city: 'Bangalore', state: 'Karnataka', pin: '560001', type: 'billing', isDefault: true },
    { id: 'addr-2', label: 'Studio', name: 'Rajesh Kumar', phone: '9876543211', address1: '15, Koramangala 1st Block', address2: '2nd Floor', city: 'Bangalore', state: 'Karnataka', pin: '560034', type: 'delivery', isDefault: false },
  ]

  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('canvera_addresses')
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES
    } catch { return DEFAULT_ADDRESSES }
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState({
    label: '', name: '', phone: '', address1: '', address2: '', city: '', state: '', pin: '', isDefault: false,
  })

  const saveAddresses = (updated) => {
    setAddresses(updated)
    try { localStorage.setItem('canvera_addresses', JSON.stringify(updated)) } catch {}
  }

  const handleAddressEdit = (addr) => {
    setEditingAddress(addr.id)
    setAddressForm({ ...addr })
    setShowAddressForm(true)
  }

  const handleAddressDelete = (id) => {
    saveAddresses(addresses.filter(a => a.id !== id))
  }

  const handleAddressSave = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.address1 || !addressForm.city || !addressForm.state || !addressForm.pin) return
    let updated
    if (editingAddress) {
      updated = addresses.map(a => a.id === editingAddress ? { ...addressForm, id: editingAddress } : a)
    } else {
      const newAddr = { ...addressForm, id: `addr-${Date.now()}` }
      updated = [...addresses, newAddr]
    }
    if (addressForm.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: a.id === (editingAddress || updated[updated.length - 1].id) }))
    }
    saveAddresses(updated)
    setShowAddressForm(false)
    setEditingAddress(null)
    setAddressForm({ label: '', name: '', phone: '', address1: '', address2: '', city: '', state: '', pin: '', isDefault: false })
  }

  const handleAddressCancel = () => {
    setShowAddressForm(false)
    setEditingAddress(null)
    setAddressForm({ label: '', name: '', phone: '', address1: '', address2: '', city: '', state: '', pin: '', isDefault: false })
  }

  return (
    <div className="dashboard-tab-content">
      <h1 className="dashboard-tab-title">Account Settings</h1>

      <div className="dashboard-settings-sections">
        {/* Personal Info */}
        <div className="dashboard-settings-card">
          <h3 className="dashboard-settings-card-title">Personal Information</h3>
          <div className="dashboard-settings-form">
            <div className="input-group">
              <label className="input-label">Full name</label>
              <input
                className="input-field"
                type="text"
                value={personalForm.name}
                onChange={e => setPersonalForm(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Email <span className="input-hint" style={{ display: 'inline' }}>(read-only)</span></label>
              <input className="input-field" type="email" value={authState?.email || ''} readOnly disabled />
            </div>
            <div className="input-group">
              <label className="input-label">Phone</label>
              <input
                className="input-field"
                type="tel"
                value={personalForm.phone}
                onChange={e => setPersonalForm(p => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <button className="btn btn-primary btn-sm">Save Changes</button>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="dashboard-settings-card">
          <div className="dashboard-address-header">
            <h3 className="dashboard-settings-card-title">Saved Addresses</h3>
            {!showAddressForm && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setEditingAddress(null); setAddressForm({ label: '', name: '', phone: '', address1: '', address2: '', city: '', state: '', pin: '', isDefault: false }); setShowAddressForm(true) }}
              >
                + Add New Address
              </button>
            )}
          </div>

          {/* Address List */}
          {!showAddressForm && addresses.length > 0 && (
            <div className="dashboard-address-list">
              {addresses.map(addr => (
                <div key={addr.id} className="dashboard-address-card">
                  <div className="dashboard-address-card-top">
                    <span className="dashboard-address-label">{addr.label || 'Address'}</span>
                    {addr.isDefault && <span className="badge badge-accent">Default</span>}
                    <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>{addr.type || 'billing'}</span>
                  </div>
                  <p className="dashboard-address-text">
                    <strong>{addr.name}</strong><br />
                    {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
                    {addr.city}, {addr.state} - {addr.pin}
                  </p>
                  <span className="dashboard-address-phone">{addr.phone}</span>
                  <div className="dashboard-address-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleAddressEdit(addr)}>Edit</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleAddressDelete(addr.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!showAddressForm && addresses.length === 0 && (
            <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-body-base)' }}>No saved addresses yet. Add one to speed up checkout.</p>
          )}

          {/* Address Form */}
          {showAddressForm && (
            <div className="dashboard-address-form">
              <div className="input-group">
                <label className="input-label">Label (e.g., Home, Studio)</label>
                <input className="input-field" type="text" placeholder="Home" value={addressForm.label} onChange={e => setAddressForm(p => ({ ...p, label: e.target.value }))} />
              </div>
              <div className="dashboard-address-form-row">
                <div className="input-group">
                  <label className="input-label">Full Name *</label>
                  <input className="input-field" type="text" value={addressForm.name} onChange={e => setAddressForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone *</label>
                  <input className="input-field" type="tel" value={addressForm.phone} onChange={e => setAddressForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Address Line 1 *</label>
                <input className="input-field" type="text" placeholder="Street address, building" value={addressForm.address1} onChange={e => setAddressForm(p => ({ ...p, address1: e.target.value }))} />
              </div>
              <div className="input-group">
                <label className="input-label">Address Line 2</label>
                <input className="input-field" type="text" placeholder="Apartment, floor (optional)" value={addressForm.address2} onChange={e => setAddressForm(p => ({ ...p, address2: e.target.value }))} />
              </div>
              <div className="dashboard-address-form-row dashboard-address-form-row--3">
                <div className="input-group">
                  <label className="input-label">City *</label>
                  <input className="input-field" type="text" value={addressForm.city} onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">State *</label>
                  <input className="input-field" type="text" value={addressForm.state} onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))} />
                </div>
                <div className="input-group">
                  <label className="input-label">PIN Code *</label>
                  <input className="input-field" type="text" maxLength={6} value={addressForm.pin} onChange={e => setAddressForm(p => ({ ...p, pin: e.target.value.replace(/\D/g, '') }))} />
                </div>
              </div>
              <label className="auth-checkbox">
                <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm(p => ({ ...p, isDefault: e.target.checked }))} />
                <span className="auth-checkbox-label">Set as default address</span>
              </label>
              <div className="dashboard-address-form-actions">
                <button className="btn btn-primary btn-sm" onClick={handleAddressSave}>
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleAddressCancel}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Studio Info */}
        {isPhotographer && (
          <div className="dashboard-settings-card">
            <h3 className="dashboard-settings-card-title">Studio Information</h3>
            <div className="dashboard-settings-form">
              <div className="input-group">
                <label className="input-label">Studio name</label>
                <input
                  className="input-field"
                  type="text"
                  value={studioForm.studioName}
                  onChange={e => setStudioForm(p => ({ ...p, studioName: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">City</label>
                <input
                  className="input-field"
                  type="text"
                  value={studioForm.city}
                  onChange={e => setStudioForm(p => ({ ...p, city: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Instagram / Portfolio</label>
                <input
                  className="input-field"
                  type="url"
                  value={studioForm.instagram}
                  onChange={e => setStudioForm(p => ({ ...p, instagram: e.target.value }))}
                />
              </div>
              <button className="btn btn-primary btn-sm">Save Changes</button>
            </div>
          </div>
        )}

        {/* Verification */}
        <div className="dashboard-settings-card">
          <h3 className="dashboard-settings-card-title">Verification Status</h3>
          <div className="dashboard-settings-verification">
            <div className="dashboard-verification-row">
              <span>Account status</span>
              {authState?.status === 'verified' ? (
                <span className="badge badge-success">Verified</span>
              ) : (
                <span className="badge badge-warning">Pending Verification</span>
              )}
            </div>
            {authState?.idFileName && (
              <div className="dashboard-verification-row">
                <span>Government ID</span>
                <span className="dashboard-verification-file">{authState.idFileName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="dashboard-settings-card">
          <h3 className="dashboard-settings-card-title">Change Password</h3>
          <div className="dashboard-settings-form">
            <div className="input-group">
              <label className="input-label">Current password</label>
              <input
                className="input-field"
                type="password"
                value={passwordForm.current}
                onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label className="input-label">New password</label>
              <input
                className="input-field"
                type="password"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Confirm new password</label>
              <input
                className="input-field"
                type="password"
                value={passwordForm.confirm}
                onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))}
              />
            </div>
            <button className="btn btn-primary btn-sm">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}


/* ===========================================================================
   SHARED COMPONENTS
   =========================================================================== */
function StatusBadge({ status }) {
  const cls = {
    'Delivered': 'badge-success',
    'Shipped': 'badge-brand',
    'Processing': 'badge-warning',
  }[status] || 'badge-neutral'

  return <span className={`badge ${cls}`}>{status}</span>
}

function EmptyState({ title, message, ctaText, ctaLink }) {
  return (
    <div className="dashboard-empty">
      <div className="dashboard-empty-icon">
        <svg viewBox="0 0 48 48" fill="none">
          <rect x="6" y="12" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M6 22h36" stroke="currentColor" strokeWidth="1.5"/>
          <circle cx="14" cy="17" r="1.5" fill="currentColor" opacity="0.4"/>
          <circle cx="20" cy="17" r="1.5" fill="currentColor" opacity="0.4"/>
          <path d="M16 32h16M20 36h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        </svg>
      </div>
      <h3 className="dashboard-empty-title">{title}</h3>
      <p className="dashboard-empty-message">{message}</p>
      {ctaLink && (
        <Link to={ctaLink} className="btn btn-primary btn-sm">{ctaText}</Link>
      )}
    </div>
  )
}
