import { useState, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_ORDERS } from '../data/productConfig';
import Breadcrumb from '../components/Breadcrumb';
import './ProfilePage.css';

/* ── helpers ───────────────────────────────────────────────────── */
const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

const STATUS_COLORS = { DELIVERED:'delivered', SHIPPED:'shipped', PROCESSING:'processing', CANCELLED:'cancelled' };
const STATUS_LABELS = { DELIVERED:'Delivered', SHIPPED:'Shipped', PROCESSING:'Processing', CANCELLED:'Cancelled' };

function fmt(n)     { return '₹' + n.toLocaleString('en-IN'); }
function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}

function generateMyReferralCode(user) {
  const base = (user?.name || 'PRO')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, 'X');
  return base + '10';
}

function registerPhotographerCode(user) {
  const code = generateMyReferralCode(user);
  try {
    const existing = JSON.parse(localStorage.getItem('canvera_photographer_codes')) || {};
    existing[code] = {
      photographerName: user?.name || 'Photographer',
      city: user?.city || '',
      discount: 0.10,
      label: `10% off referred by ${user?.name || 'Photographer'}`,
    };
    localStorage.setItem('canvera_photographer_codes', JSON.stringify(existing));
  } catch {}
  return code;
}

function loadSavedAddresses() {
  try { return JSON.parse(localStorage.getItem('canvera_saved_addresses')) || []; }
  catch { return []; }
}
function persistAddresses(addrs) {
  localStorage.setItem('canvera_saved_addresses', JSON.stringify(addrs));
}

const EMPTY_ADDR = { label:'', name:'', phone:'', line1:'', line2:'', city:'', state:'', pin:'', isDefault: false };

/* ── Mock coupons available to user ───────────────────────────── */
const MOCK_COUPONS = [
  { code: 'CANVERA10', label: '10% off on all orders', type: 'coupon',   valid: true,  expires: '31 Dec 2026' },
  { code: 'NEWUSER15', label: '15% off your first order', type: 'coupon', valid: false, expires: 'Expired' },
];
const PRO_COUPONS = [
  { code: 'PRO10',    label: '10% PRO member discount',  type: 'pro',    valid: true,  expires: '31 Dec 2026' },
  { code: 'PROSHIP',  label: 'Free shipping on orders',  type: 'pro',    valid: true,  expires: '31 Dec 2026' },
  { code: 'PROEARLY', label: 'Early access to new drops', type: 'pro',   valid: true,  expires: '31 Dec 2026' },
  { code: 'PROBULK5', label: '5% off bulk orders (5+)',  type: 'pro',    valid: true,  expires: '31 Dec 2026' },
];

/* ============================================================
   ProfilePage
   ============================================================ */
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isVerified, isPhotographer, logout, setVerified } = useAuth();

  const [view, setView] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [statusFilter, setStatusFilter]   = useState('ALL');
  const [searchQ, setSearchQ]             = useState('');

  // Account form
  const [accountForm, setAccountForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [accountSaved, setAccountSaved]   = useState(false);

  // PRO verification form
  const [proForm, setProForm]             = useState({ gst: '', portfolio: '', note: '' });
  const [proSubmitted, setProSubmitted]   = useState(false);

  // Password form
  const [pwForm, setPwForm]               = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved]             = useState(false);
  const [pwError, setPwError]             = useState('');

  // Notifications
  const [notifs, setNotifs]               = useState({ orderUpdates: true, promos: false, newsletter: true });

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState(loadSavedAddresses);
  const [addingAddress, setAddingAddress]   = useState(false);
  const [addrForm, setAddrForm]             = useState(EMPTY_ADDR);
  const [addrErrors, setAddrErrors]         = useState({});
  const [addrSaved, setAddrSaved]           = useState(false);

  // Referral code copy
  const [refCopied, setRefCopied]           = useState(false);

  // Coupon code copy
  const [copiedCode, setCopiedCode]         = useState('');

  if (!isLoggedIn) return <Navigate to="/login?redirect=/profile" replace />;

  const totalOrders  = MOCK_ORDERS.length;
  const totalSpent   = MOCK_ORDERS.reduce((s, o) => s + o.amount, 0);
  const memberSince  = '2025';

  const filteredOrders = MOCK_ORDERS.filter(o => {
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const q = searchQ.toLowerCase();
    const matchSearch = !q || o.orderNumber.toLowerCase().includes(q) || o.productName.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const selectedOrder = MOCK_ORDERS.find(o => o.id === selectedOrderId);

  /* ── handlers ─────────────────────────────────────────────── */
  const handleOrderClick = (id) => { setSelectedOrderId(id); setView('order-detail'); };
  const handleBackToOrders = () => { setView('orders'); setSelectedOrderId(null); };

  const handleSaveAccount = () => {
    setAccountSaved(true);
    setTimeout(() => setAccountSaved(false), 2500);
  };

  const handleSavePassword = () => {
    setPwError('');
    if (!pwForm.current)            return setPwError('Enter your current password.');
    if (pwForm.next.length < 6)     return setPwError('New password must be at least 6 characters.');
    if (pwForm.next !== pwForm.confirm) return setPwError('Passwords do not match.');
    setPwSaved(true);
    setPwForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 2500);
  };

  const handleProSubmit = () => {
    if (!proForm.gst.trim()) return;
    setProSubmitted(true);
    setTimeout(() => setVerified(), 3000);
  };

  // Address CRUD
  const validateAddr = () => {
    const errs = {};
    ['name','phone','line1','city','state','pin'].forEach(k => {
      if (!addrForm[k].trim()) errs[k] = 'Required';
    });
    setAddrErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleAddAddress = () => {
    if (!validateAddr()) return;
    const id = Date.now().toString();
    const isFirst = savedAddresses.length === 0;
    const updated = [...savedAddresses, { ...addrForm, id, isDefault: isFirst || addrForm.isDefault }];
    setSavedAddresses(updated);
    persistAddresses(updated);
    setAddingAddress(false);
    setAddrForm(EMPTY_ADDR);
    setAddrErrors({});
    setAddrSaved(true);
    setTimeout(() => setAddrSaved(false), 2500);
  };
  const handleRemoveAddress = useCallback((id) => {
    const updated = savedAddresses.filter(a => a.id !== id);
    setSavedAddresses(updated);
    persistAddresses(updated);
  }, [savedAddresses]);
  const handleSetDefault = useCallback((id) => {
    const updated = savedAddresses.map(a => ({ ...a, isDefault: a.id === id }));
    setSavedAddresses(updated);
    persistAddresses(updated);
  }, [savedAddresses]);

  const handleCopyCode = useCallback((code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  }, []);

  const handleCopyReferral = useCallback(() => {
    if (!user) return;
    const code = registerPhotographerCode(user);
    navigator.clipboard.writeText(code).catch(() => {});
    setRefCopied(true);
    setTimeout(() => setRefCopied(false), 2000);
  }, [user]);

  /* ── referral code (computed once per render when verified) ── */
  const myReferralCode = isVerified && isPhotographer
    ? registerPhotographerCode(user)
    : null;

  /* ================================================================
     RENDER DASHBOARD
     ================================================================ */
  const renderDashboard = () => (
    <div className="profile-dashboard">

      {/* ── Quick Actions — top of dashboard ──────────────────── */}
      <div className="profile-section" style={{ marginBottom: 'var(--space-4)' }}>
        <h3 className="profile-section__title" style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
        <div className="profile-actions">
          <Link to="/shop" className="profile-action-card">
            <span className="profile-action-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
            <span>Browse Products</span>
          </Link>
          <Link to="/finder" className="profile-action-card">
            <span className="profile-action-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <span>Product Finder</span>
          </Link>
          <Link to="/track" className="profile-action-card">
            <span className="profile-action-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </span>
            <span>Track Order</span>
          </Link>
          <button className="profile-action-card" onClick={() => setView('account')}>
            <span className="profile-action-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
            <span>Account Settings</span>
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <div className="profile-stats">
        <div className="profile-stats__card">
          <span className="profile-stats__val">{totalOrders}</span>
          <span className="profile-stats__label">Total Orders</span>
        </div>
        <div className="profile-stats__card">
          <span className="profile-stats__val">{fmt(totalSpent)}</span>
          <span className="profile-stats__label">Total Spent</span>
        </div>
        <div className="profile-stats__card">
          <span className="profile-stats__val">{memberSince}</span>
          <span className="profile-stats__label">Member Since</span>
        </div>
      </div>

      {/* ── Verified photographer: Referral code banner ────────── */}
      {isVerified && isPhotographer && myReferralCode && (
        <div className="profile-referral-banner">
          <div className="profile-referral-banner__left">
            <div className="profile-referral-banner__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <div>
              <p className="profile-referral-banner__label">Your Referral Code</p>
              <p className="profile-referral-banner__sub">Share with clients for 10% off their orders</p>
            </div>
          </div>
          <div className="profile-referral-banner__right">
            <span className="profile-referral-banner__code">{myReferralCode}</span>
            <button
              className={`profile-referral-banner__copy ${refCopied ? 'profile-referral-banner__copy--done' : ''}`}
              onClick={handleCopyReferral}
            >
              {refCopied ? (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
              ) : (
                <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Code</>
              )}
            </button>
            <button className="profile-referral-banner__details" onClick={() => setView('rewards')}>
              View details →
            </button>
          </div>
        </div>
      )}

      {/* ── Non-verified photographer: Get Verified CTA ────────── */}
      {isPhotographer && !isVerified && (
        <div className="profile-verify-cta">
          <div className="profile-verify-cta__icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="profile-verify-cta__body">
            <p className="profile-verify-cta__title">Unlock PRO Benefits — Get Verified</p>
            <p className="profile-verify-cta__sub">Verified photographers get wholesale pricing, free shipping, early access, and their own referral code to share with clients.</p>
          </div>
          <button className="profile-verify-cta__btn" onClick={() => setView('account')}>
            Get Verified
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}

      {/* ── Recent Orders ─────────────────────────────────────── */}
      <div className="profile-section">
        <div className="profile-section__header">
          <h3 className="profile-section__title">Recent Orders</h3>
          <button className="profile-section__link" onClick={() => setView('orders')}>View all →</button>
        </div>
        {MOCK_ORDERS.length === 0 ? (
          <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }}>No orders placed yet.</p>
        ) : (
          <div className="profile-orders-table">
            {MOCK_ORDERS.slice(0, 3).map(order => (
              <div key={order.id} className="profile-order-row" onClick={() => handleOrderClick(order.id)} role="button" tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleOrderClick(order.id)}>
                <div className="profile-order-row__left">
                  <span className="profile-order-row__num">{order.orderNumber}</span>
                  <span className="profile-order-row__product">{order.productName}</span>
                </div>
                <div className="profile-order-row__right">
                  <span className="profile-order-row__date">{fmtDate(order.placedAt)}</span>
                  <span className={`profile-status profile-status--${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                  <span className="profile-order-row__amount">{fmt(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* ================================================================
     RENDER ORDERS
     ================================================================ */
  const renderOrders = () => (
    <div className="profile-orders">
      <h2 className="profile-view-title">My Orders</h2>
      <div className="profile-orders__controls">
        <div className="profile-filter-tabs">
          {['ALL','PROCESSING','SHIPPED','DELIVERED'].map(s => (
            <button key={s} className={`profile-filter-tab ${statusFilter === s ? 'profile-filter-tab--active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'ALL' ? 'All Orders' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="profile-orders__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search orders…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
        </div>
      </div>
      {filteredOrders.length === 0 ? (
        <div className="profile-empty"><p>No orders found{searchQ ? ` for "${searchQ}"` : ''}.</p></div>
      ) : (
        <div className="profile-orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="profile-order-card" onClick={() => handleOrderClick(order.id)} role="button" tabIndex={0} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleOrderClick(order.id)}>
              <div className="profile-order-card__top">
                <div>
                  <span className="profile-order-card__num">{order.orderNumber}</span>
                  <span className="profile-order-card__date">{fmtDate(order.placedAt)}</span>
                </div>
                <span className={`profile-status profile-status--${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
              </div>
              <div className="profile-order-card__product">
                <strong>{order.productName}</strong>
                <span>{order.collectionName} Collection</span>
              </div>
              <div className="profile-order-card__footer">
                <span className="profile-order-card__amount">{fmt(order.amount)}</span>
                <span className="profile-order-card__cta">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ================================================================
     RENDER ORDER DETAIL
     ================================================================ */
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;
    return (
      <div className="profile-order-detail">
        <button className="profile-back-btn" onClick={handleBackToOrders}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Orders
        </button>
        <div className="profile-detail-header">
          <div>
            <h2 className="profile-view-title" style={{ marginBottom: 4 }}>{selectedOrder.orderNumber}</h2>
            <p className="profile-detail-meta">Placed on {fmtDate(selectedOrder.placedAt)}</p>
          </div>
          <span className={`profile-status profile-status--${STATUS_COLORS[selectedOrder.status]}`}>{STATUS_LABELS[selectedOrder.status]}</span>
        </div>
        <div className="profile-section">
          <h3 className="profile-section__title">Order Timeline</h3>
          <div className="profile-timeline">
            {selectedOrder.timeline.map((step, i) => (
              <div key={i} className={`profile-timeline__step ${step.done ? 'profile-timeline__step--done' : ''}`}>
                <div className="profile-timeline__circle">
                  {step.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                {i < selectedOrder.timeline.length - 1 && <div className={`profile-timeline__line ${step.done ? 'profile-timeline__line--done' : ''}`} />}
                <div className="profile-timeline__info">
                  <span className="profile-timeline__label">{step.label}</span>
                  {step.date && <span className="profile-timeline__date">{step.date}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section__title">Configuration Summary</h3>
          <div className="profile-config-grid">
            <div className="profile-config-item"><span>Product</span><strong>{selectedOrder.productName}</strong></div>
            <div className="profile-config-item"><span>Size</span><strong>{selectedOrder.config.size}</strong></div>
            <div className="profile-config-item"><span>Cover</span><strong>{selectedOrder.config.cover}</strong></div>
            <div className="profile-config-item"><span>Paper</span><strong>{selectedOrder.config.paper}</strong></div>
            <div className="profile-config-item"><span>File Type</span><strong>{selectedOrder.config.fileType}</strong></div>
            <div className="profile-config-item"><span>Bag</span><strong>{selectedOrder.config.bag}</strong></div>
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section__title">Payment</h3>
          <div className="profile-price-row">
            <span>Order Total</span>
            <span className="profile-price-total">{fmt(selectedOrder.amount)}</span>
          </div>
        </div>
        <div className="profile-detail-actions">
          <Link to="/track" className="profile-btn profile-btn--primary">Track This Order</Link>
          <Link to="/contact" className="profile-btn profile-btn--secondary">Need Help?</Link>
        </div>
      </div>
    );
  };

  /* ================================================================
     RENDER REWARDS & OFFERS
     ================================================================ */
  const renderRewards = () => {
    const coupons = isVerified ? [...MOCK_COUPONS, ...PRO_COUPONS] : MOCK_COUPONS;

    return (
      <div className="profile-rewards">
        <h2 className="profile-view-title">Rewards &amp; Offers</h2>

        {/* ── Verified photographer: referral code ─────────────── */}
        {isVerified && isPhotographer && myReferralCode && (
          <div className="profile-card profile-referral-card">
            <div className="profile-referral-card__header">
              <div className="profile-referral-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div>
                <h3 className="profile-card__title" style={{ margin: 0 }}>Your Referral Code</h3>
                <p className="profile-card__sub" style={{ margin: 0 }}>Share this code with clients — they get 10% off, you earn credits on next orders.</p>
              </div>
            </div>

            <div className="profile-referral-code-display">
              <span className="profile-referral-code-display__code">{myReferralCode}</span>
              <button
                className={`profile-referral-code-display__copy ${refCopied ? 'profile-referral-code-display__copy--done' : ''}`}
                onClick={handleCopyReferral}
              >
                {refCopied ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy Code</>
                )}
              </button>
            </div>

            <div className="profile-referral-how">
              <p className="profile-referral-how__title">How it works</p>
              <div className="profile-referral-steps">
                <div className="profile-referral-step">
                  <span className="profile-referral-step__num">1</span>
                  <span>Share your code <strong>{myReferralCode}</strong> with your photography clients</span>
                </div>
                <div className="profile-referral-step">
                  <span className="profile-referral-step__num">2</span>
                  <span>Client enters your code at checkout — they get <strong>10% off</strong> their order</span>
                </div>
                <div className="profile-referral-step">
                  <span className="profile-referral-step__num">3</span>
                  <span>You earn <strong>credits</strong> added to your next PRO order automatically</span>
                </div>
              </div>
            </div>

            <div className="profile-referral-stats">
              <div className="profile-referral-stat">
                <span className="profile-referral-stat__val">0</span>
                <span className="profile-referral-stat__label">Times Used</span>
              </div>
              <div className="profile-referral-stat">
                <span className="profile-referral-stat__val">₹0</span>
                <span className="profile-referral-stat__label">Credits Earned</span>
              </div>
              <div className="profile-referral-stat">
                <span className="profile-referral-stat__val">10%</span>
                <span className="profile-referral-stat__label">Client Discount</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Non-photographer: how to get a referral code ─────── */}
        {!isPhotographer && (
          <div className="profile-card profile-howto-card">
            <div className="profile-howto-card__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="profile-card__title" style={{ marginBottom: 'var(--space-2)' }}>Save more with a photographer referral</h3>
            <p className="profile-card__sub">Ask your Canvera photographer for their referral code. Enter it at checkout to unlock an exclusive discount — up to 12% off.</p>
            <Link to="/finder" className="profile-btn profile-btn--primary" style={{ display: 'inline-flex', marginTop: 'var(--space-2)' }}>Find Photographers Near You</Link>
          </div>
        )}

        {/* ── Non-verified photographer: get verified prompt ────── */}
        {isPhotographer && !isVerified && (
          <div className="profile-verify-cta profile-verify-cta--card">
            <div className="profile-verify-cta__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div className="profile-verify-cta__body">
              <p className="profile-verify-cta__title">Get Verified to unlock your referral code</p>
              <p className="profile-verify-cta__sub">Verified photographers get their own referral code to share with clients and earn credits on every use.</p>
            </div>
            <button className="profile-verify-cta__btn" onClick={() => setView('account')}>
              Get Verified
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}

        {/* ── Available coupons ─────────────────────────────────── */}
        <div className="profile-card">
          <h3 className="profile-card__title">Available Coupons</h3>
          {coupons.length === 0 ? (
            <p className="profile-card__sub">No coupons available right now.</p>
          ) : (
            <div className="profile-coupon-grid">
              {coupons.map(c => (
                <div key={c.code} className={`profile-coupon-item ${!c.valid ? 'profile-coupon-item--expired' : ''} ${c.type === 'pro' ? 'profile-coupon-item--pro' : ''}`}>
                  <div className="profile-coupon-item__top">
                    <span className="profile-coupon-item__code">{c.code}</span>
                    {c.type === 'pro' && <span className="profile-coupon-item__pro-tag">PRO</span>}
                    {!c.valid && <span className="profile-coupon-item__expired-tag">Expired</span>}
                  </div>
                  <p className="profile-coupon-item__label">{c.label}</p>
                  <div className="profile-coupon-item__footer">
                    <span className="profile-coupon-item__expiry">
                      {c.valid ? `Valid until ${c.expires}` : c.expires}
                    </span>
                    {c.valid && (
                      <button
                        className={`profile-coupon-item__copy ${copiedCode === c.code ? 'profile-coupon-item__copy--done' : ''}`}
                        onClick={() => handleCopyCode(c.code)}
                      >
                        {copiedCode === c.code ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ================================================================
     RENDER ACCOUNT SETTINGS
     ================================================================ */
  const renderAccount = () => (
    <div className="profile-account">
      <h2 className="profile-view-title">Account Settings</h2>

      {/* ── Personal Details ─────────────────────────────────── */}
      <div className="profile-card">
        <h3 className="profile-card__title">Personal Details</h3>
        <div className="profile-form-grid">
          <div className="profile-form-field">
            <label>Full Name</label>
            <input value={accountForm.name} onChange={e => setAccountForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" />
          </div>
          <div className="profile-form-field">
            <label>Email Address</label>
            <input value={accountForm.email} onChange={e => setAccountForm(p => ({ ...p, email: e.target.value }))} type="email" placeholder="you@email.com" />
          </div>
          <div className="profile-form-field">
            <label>Phone Number</label>
            <input value={accountForm.phone} onChange={e => setAccountForm(p => ({ ...p, phone: e.target.value }))} type="tel" placeholder="+91 98765 43210" />
          </div>
        </div>
        <div className="profile-card__footer">
          {accountSaved && <span className="profile-save-msg">✓ Changes saved</span>}
          <button className="profile-btn profile-btn--primary" onClick={handleSaveAccount}>Save Changes</button>
        </div>
      </div>

      {/* ── Saved Addresses ──────────────────────────────────── */}
      <div className="profile-card">
        <div className="profile-card-header-row">
          <h3 className="profile-card__title" style={{ margin: 0 }}>Saved Addresses</h3>
          {!addingAddress && savedAddresses.length < 5 && (
            <button className="profile-add-addr-btn" onClick={() => setAddingAddress(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Address
            </button>
          )}
        </div>
        <p className="profile-card__sub">These addresses will be available at checkout for fast order placement.</p>

        {/* Address list */}
        {savedAddresses.length > 0 && (
          <div className="profile-addr-list">
            {savedAddresses.map(addr => (
              <div key={addr.id} className={`profile-addr-item ${addr.isDefault ? 'profile-addr-item--default' : ''}`}>
                <div className="profile-addr-item__top">
                  <div className="profile-addr-item__label-row">
                    {addr.label && <span className="profile-addr-item__label">{addr.label}</span>}
                    {addr.isDefault && <span className="profile-addr-item__default-tag">Default</span>}
                  </div>
                  <div className="profile-addr-item__actions">
                    {!addr.isDefault && (
                      <button className="profile-addr-item__action" onClick={() => handleSetDefault(addr.id)}>Set default</button>
                    )}
                    <button className="profile-addr-item__action profile-addr-item__action--remove" onClick={() => handleRemoveAddress(addr.id)}>Remove</button>
                  </div>
                </div>
                <p className="profile-addr-item__name">{addr.name}</p>
                <p className="profile-addr-item__text">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                <p className="profile-addr-item__text">{addr.city}, {addr.state} – {addr.pin}</p>
                <p className="profile-addr-item__phone">{addr.phone}</p>
              </div>
            ))}
          </div>
        )}

        {savedAddresses.length === 0 && !addingAddress && (
          <div className="profile-addr-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <p>No saved addresses yet. Add one to speed up checkout.</p>
          </div>
        )}

        {/* Add address form */}
        {addingAddress && (
          <div className="profile-addr-form">
            <div className="profile-form-grid" style={{ marginTop: 'var(--space-4)' }}>
              <div className="profile-form-field">
                <label>Address Label <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(e.g. Home, Office)</span></label>
                <input value={addrForm.label} onChange={e => setAddrForm(p => ({ ...p, label: e.target.value }))} placeholder="Home" />
              </div>
              <div className="profile-form-field">
                <label>Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
                <input value={addrForm.name} onChange={e => { setAddrForm(p => ({ ...p, name: e.target.value })); setAddrErrors(p => ({ ...p, name: '' })); }} placeholder="Recipient name" className={addrErrors.name ? 'profile-input--error' : ''} />
                {addrErrors.name && <p className="profile-field-error">{addrErrors.name}</p>}
              </div>
              <div className="profile-form-field">
                <label>Phone Number <span style={{ color: 'var(--error)' }}>*</span></label>
                <input value={addrForm.phone} onChange={e => { setAddrForm(p => ({ ...p, phone: e.target.value })); setAddrErrors(p => ({ ...p, phone: '' })); }} placeholder="+91 98765 43210" type="tel" className={addrErrors.phone ? 'profile-input--error' : ''} />
                {addrErrors.phone && <p className="profile-field-error">{addrErrors.phone}</p>}
              </div>
              <div className="profile-form-field profile-form-field--full">
                <label>Address Line 1 <span style={{ color: 'var(--error)' }}>*</span></label>
                <input value={addrForm.line1} onChange={e => { setAddrForm(p => ({ ...p, line1: e.target.value })); setAddrErrors(p => ({ ...p, line1: '' })); }} placeholder="House / Flat no., Street" className={addrErrors.line1 ? 'profile-input--error' : ''} />
                {addrErrors.line1 && <p className="profile-field-error">{addrErrors.line1}</p>}
              </div>
              <div className="profile-form-field profile-form-field--full">
                <label>Address Line 2</label>
                <input value={addrForm.line2} onChange={e => setAddrForm(p => ({ ...p, line2: e.target.value }))} placeholder="Area, Landmark (optional)" />
              </div>
              <div className="profile-form-field">
                <label>City <span style={{ color: 'var(--error)' }}>*</span></label>
                <input value={addrForm.city} onChange={e => { setAddrForm(p => ({ ...p, city: e.target.value })); setAddrErrors(p => ({ ...p, city: '' })); }} placeholder="City" className={addrErrors.city ? 'profile-input--error' : ''} />
                {addrErrors.city && <p className="profile-field-error">{addrErrors.city}</p>}
              </div>
              <div className="profile-form-field">
                <label>State <span style={{ color: 'var(--error)' }}>*</span></label>
                <select value={addrForm.state} onChange={e => { setAddrForm(p => ({ ...p, state: e.target.value })); setAddrErrors(p => ({ ...p, state: '' })); }} className={`profile-select ${addrErrors.state ? 'profile-input--error' : ''}`}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {addrErrors.state && <p className="profile-field-error">{addrErrors.state}</p>}
              </div>
              <div className="profile-form-field">
                <label>PIN Code <span style={{ color: 'var(--error)' }}>*</span></label>
                <input value={addrForm.pin} onChange={e => { setAddrForm(p => ({ ...p, pin: e.target.value })); setAddrErrors(p => ({ ...p, pin: '' })); }} placeholder="6-digit PIN" maxLength={6} className={addrErrors.pin ? 'profile-input--error' : ''} />
                {addrErrors.pin && <p className="profile-field-error">{addrErrors.pin}</p>}
              </div>
              <div className="profile-form-field profile-form-field--full">
                <label className="profile-checkbox-row">
                  <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))} />
                  <span>Set as default address</span>
                </label>
              </div>
            </div>
            <div className="profile-addr-form__actions">
              <button className="profile-btn profile-btn--primary" onClick={handleAddAddress}>Save Address</button>
              <button className="profile-btn profile-btn--secondary" onClick={() => { setAddingAddress(false); setAddrForm(EMPTY_ADDR); setAddrErrors({}); }}>Cancel</button>
            </div>
          </div>
        )}

        {addrSaved && (
          <p className="profile-save-msg" style={{ marginTop: 'var(--space-3)' }}>✓ Address saved</p>
        )}
      </div>

      {/* ── PRO Verification — photographers only ────────────── */}
      {isPhotographer && <div className="profile-card">
        <h3 className="profile-card__title">
          PRO Verification
          {isVerified
            ? <span className="profile-badge profile-badge--pro" style={{ marginLeft: 8 }}>Verified</span>
            : <span className="profile-badge profile-badge--unverified" style={{ marginLeft: 8 }}>Not Verified</span>}
        </h3>
        {isVerified ? (
          <div className="profile-pro-verified">
            <div className="profile-pro-verified__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="profile-pro-verified__title">You're a Verified PRO Photographer</p>
              <p className="profile-pro-verified__sub">You have access to wholesale pricing, PRO exclusive coupons, your referral code, and priority support.</p>
            </div>
          </div>
        ) : proSubmitted ? (
          <div className="profile-pro-pending">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>Your application is under review. We'll notify you within 2–3 business days.</p>
          </div>
        ) : (
          <>
            <p className="profile-card__sub">Submit your details to unlock wholesale pricing, PRO coupons, and your unique referral code.</p>
            <div className="profile-form-grid">
              <div className="profile-form-field">
                <label>GST Certificate Number <span style={{ color: 'var(--error)' }}>*</span></label>
                <input value={proForm.gst} onChange={e => setProForm(p => ({ ...p, gst: e.target.value }))} placeholder="22ABCDE1234F1Z5" />
              </div>
              <div className="profile-form-field">
                <label>Portfolio Link</label>
                <input value={proForm.portfolio} onChange={e => setProForm(p => ({ ...p, portfolio: e.target.value }))} placeholder="https://yourportfolio.com" type="url" />
              </div>
              <div className="profile-form-field profile-form-field--full">
                <label>Additional Notes</label>
                <textarea value={proForm.note} onChange={e => setProForm(p => ({ ...p, note: e.target.value }))} placeholder="Any additional information…" rows={3} />
              </div>
            </div>
            <div className="profile-card__footer">
              <button className="profile-btn profile-btn--primary" onClick={handleProSubmit} disabled={!proForm.gst.trim()}>Submit Application</button>
            </div>
          </>
        )}
      </div>}

      {/* ── Change Password ───────────────────────────────────── */}
      <div className="profile-card">
        <h3 className="profile-card__title">Change Password</h3>
        <div className="profile-form-grid">
          <div className="profile-form-field profile-form-field--full">
            <label>Current Password</label>
            <input type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
          </div>
          <div className="profile-form-field">
            <label>New Password</label>
            <input type="password" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} placeholder="••••••••" />
          </div>
          <div className="profile-form-field">
            <label>Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
          </div>
        </div>
        {pwError && <p className="profile-error">{pwError}</p>}
        <div className="profile-card__footer">
          {pwSaved && <span className="profile-save-msg">✓ Password updated</span>}
          <button className="profile-btn profile-btn--primary" onClick={handleSavePassword}>Update Password</button>
        </div>
      </div>

      {/* ── Notifications ─────────────────────────────────────── */}
      <div className="profile-card">
        <h3 className="profile-card__title">Notification Preferences</h3>
        <div className="profile-toggles">
          {[
            { key: 'orderUpdates', label: 'Order Updates', desc: 'Status changes, shipping notifications' },
            { key: 'promos', label: 'Promotions & Offers', desc: 'Discounts, seasonal sales' },
            { key: 'newsletter', label: 'Newsletter', desc: 'Product launches, photography tips' },
          ].map(({ key, label, desc }) => (
            <label key={key} className="profile-toggle-row">
              <div className="profile-toggle-row__info">
                <span className="profile-toggle-row__label">{label}</span>
                <span className="profile-toggle-row__desc">{desc}</span>
              </div>
              <div className={`profile-toggle ${notifs[key] ? 'profile-toggle--on' : ''}`} onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}>
                <div className="profile-toggle__thumb" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ── Sign out ──────────────────────────────────────────── */}
      <div className="profile-signout-row">
        <button className="profile-btn profile-btn--danger" onClick={() => { logout(); navigate('/'); }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  /* ================================================================
     LAYOUT
     ================================================================ */
  const NAV_ITEMS = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    },
    {
      key: 'orders',
      label: 'My Orders',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>,
    },
    {
      key: 'rewards',
      label: 'Rewards & Offers',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    },
    {
      key: 'account',
      label: 'Account Settings',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ];

  return (
    <div className="profile-page">
      <Breadcrumb />
      <div className="profile-page__inner">
        <div className="profile-layout">

          {/* ── Sidebar nav ─────────────────────────────────── */}
          <nav className="profile-nav">
            <div className="profile-nav__user">
              <div className="profile-nav__avatar">{(user?.name || 'U')[0].toUpperCase()}</div>
              <div className="profile-nav__user-info">
                <p className="profile-nav__name">{user?.name || 'My Account'}</p>
                <p className="profile-nav__email">{user?.email}</p>
                {isVerified && <span className="profile-badge profile-badge--pro" style={{ marginTop: 4 }}>PRO Verified</span>}
              </div>
            </div>
            <div className="profile-nav__links">
              {NAV_ITEMS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  className={`profile-nav__link ${view === key || (view === 'order-detail' && key === 'orders') ? 'profile-nav__link--active' : ''}`}
                  onClick={() => { setView(key); if (key !== 'orders') setSelectedOrderId(null); }}
                >
                  {icon}{label}
                </button>
              ))}
            </div>
            <button className="profile-nav__logout" onClick={() => { logout(); navigate('/'); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </nav>

          {/* ── Main content ─────────────────────────────────── */}
          <div className="profile-main">
            {view === 'dashboard'    && renderDashboard()}
            {view === 'orders'       && renderOrders()}
            {view === 'order-detail' && renderOrderDetail()}
            {view === 'rewards'      && renderRewards()}
            {view === 'account'      && renderAccount()}
          </div>
        </div>
      </div>
    </div>
  );
}
