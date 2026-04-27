import { useState, useCallback } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PHOTOGRAPHER_REFERRALS } from '../data/referralCodes';
import Breadcrumb from '../components/Breadcrumb';
import './CheckoutPage.css';

/* ── constants ──────────────────────────────────────────────── */
const VALID_COUPONS = {
  CANVERA10: { discount: 0.10, label: 'CANVERA10 — 10% off' },
};

const PAYMENT_METHODS = [
  { id: 'upi',     label: 'UPI',                 icon: 'upi'    },
  { id: 'card',    label: 'Credit / Debit Card',  icon: 'card'   },
  { id: 'netbank', label: 'Net Banking',           icon: 'bank'   },
  { id: 'wallet',  label: 'Wallet',                icon: 'wallet' },
];

const STATES = ['Andhra Pradesh','Assam','Bihar','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

/* ── helpers ────────────────────────────────────────────────── */
function fmt(n) { return '₹' + n.toLocaleString('en-IN'); }
function genOrderNo() { return 'CNV-' + Math.random().toString(36).toUpperCase().substr(2, 8); }

function loadSavedAddresses() {
  try { return JSON.parse(localStorage.getItem('canvera_saved_addresses')) || []; }
  catch { return []; }
}

function findReferral(code) {
  const upper = code.trim().toUpperCase();
  if (PHOTOGRAPHER_REFERRALS[upper]) return PHOTOGRAPHER_REFERRALS[upper];
  try {
    const dynamic = JSON.parse(localStorage.getItem('canvera_photographer_codes')) || {};
    if (dynamic[upper]) return dynamic[upper];
  } catch {}
  return null;
}

const EMPTY_ADDR = { name:'', phone:'', line1:'', line2:'', city:'', state:'', pin:'' };

/* ── AddressCard ────────────────────────────────────────────── */
function AddressCard({ addr, selected, onSelect }) {
  return (
    <div
      className={`checkout__addr-card ${selected ? 'checkout__addr-card--active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={e => e.key === 'Enter' && onSelect()}
    >
      <div className="checkout__addr-card__radio">
        <div className={`checkout__addr-radio ${selected ? 'checkout__addr-radio--active' : ''}`} />
      </div>
      <div className="checkout__addr-card__body">
        <div className="checkout__addr-card__header">
          <span className="checkout__addr-card__name">{addr.name}</span>
          {addr.label && <span className="checkout__addr-tag">{addr.label}</span>}
          {addr.isDefault && <span className="checkout__addr-tag checkout__addr-tag--default">Default</span>}
        </div>
        <p className="checkout__addr-card__line">
          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pin}
        </p>
        <p className="checkout__addr-card__phone">{addr.phone}</p>
      </div>
    </div>
  );
}

/* ── AddressForm ────────────────────────────────────────────── */
function FormField({ label, required, error, children, className = '' }) {
  return (
    <div className={`checkout__form-field ${className}`}>
      <label className="checkout__label">
        {label} {required && <span className="checkout__req">*</span>}
      </label>
      {children}
      {error && <p className="checkout__field-error">{error}</p>}
    </div>
  );
}

function AddressForm({ values, onChange, errors }) {
  const setField = (key) => (e) => onChange(key, e.target.value);
  return (
    <div className="checkout__form-grid">
      <FormField label="Full Name" required error={errors?.name}>
        <input className={`checkout__input ${errors?.name ? 'checkout__input--error' : ''}`}
          value={values.name} onChange={setField('name')} placeholder="Full name" />
      </FormField>
      <FormField label="Phone Number" required error={errors?.phone}>
        <input className={`checkout__input ${errors?.phone ? 'checkout__input--error' : ''}`}
          value={values.phone} onChange={setField('phone')} placeholder="+91 98765 43210" type="tel" />
      </FormField>
      <FormField label="Address Line 1" required error={errors?.line1} className="checkout__form-field--full">
        <input className={`checkout__input ${errors?.line1 ? 'checkout__input--error' : ''}`}
          value={values.line1} onChange={setField('line1')} placeholder="House / Flat no., Street" />
      </FormField>
      <FormField label="Address Line 2" className="checkout__form-field--full">
        <input className="checkout__input" value={values.line2} onChange={setField('line2')}
          placeholder="Area, Landmark (optional)" />
      </FormField>
      <FormField label="City" required error={errors?.city}>
        <input className={`checkout__input ${errors?.city ? 'checkout__input--error' : ''}`}
          value={values.city} onChange={setField('city')} placeholder="City" />
      </FormField>
      <FormField label="State" required error={errors?.state}>
        <select className={`checkout__input checkout__select ${errors?.state ? 'checkout__input--error' : ''}`}
          value={values.state} onChange={setField('state')}>
          <option value="">Select state</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </FormField>
      <FormField label="PIN Code" required error={errors?.pin}>
        <input className={`checkout__input ${errors?.pin ? 'checkout__input--error' : ''}`}
          value={values.pin} onChange={setField('pin')} placeholder="6-digit PIN" maxLength={6} />
      </FormField>
    </div>
  );
}

/* ── PaymentIcon ────────────────────────────────────────────── */
function PaymentIcon({ type }) {
  const icons = {
    upi:    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
    card:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M7 15h.01M11 15h2"/></svg>,
    bank:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 22V12M21 22V12M5 22V12M19 22V12M9 22V12M15 22V12"/><path d="M1 12l11-9 11 9"/><path d="M1 22h22"/></svg>,
    wallet: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 3H8L4 7h16l-4-4z"/><circle cx="17" cy="13" r="1"/></svg>,
  };
  return <span className="checkout__payment-icon">{icons[type]}</span>;
}

/* ================================================================
   CheckoutPage
   Step 1 → Delivery Address
   Step 2 → Billing Address (same as delivery or separate)
   Step 3 → Payment
   ================================================================ */
export default function CheckoutPage() {
  const { isLoggedIn, isVerified } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  /* ── Saved addresses — loaded once ─────────────────────────── */
  const [savedAddresses] = useState(loadSavedAddresses);
  const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || null;

  /* ── DELIVERY (Step 1) ─────────────────────────────────────── */
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(defaultAddr?.id || null);
  const [useNewDelivery,     setUseNewDelivery]     = useState(savedAddresses.length === 0);
  const [newDelivery,        setNewDelivery]        = useState(EMPTY_ADDR);
  const [deliveryErrors,     setDeliveryErrors]     = useState({});

  /* ── BILLING (Step 2) ──────────────────────────────────────── */
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [selectedBillingId,     setSelectedBillingId]     = useState(defaultAddr?.id || null);
  const [useNewBilling,         setUseNewBilling]         = useState(false);
  const [newBilling,            setNewBilling]            = useState(EMPTY_ADDR);
  const [billingErrors,         setBillingErrors]         = useState({});

  /* ── PAYMENT (Step 3) ──────────────────────────────────────── */
  const [payment, setPayment] = useState('upi');

  /* ── COUPONS & REFERRAL ────────────────────────────────────── */
  const [coupon,          setCoupon]          = useState('');
  const [appliedCoupon,   setAppliedCoupon]   = useState(null);
  const [couponError,     setCouponError]     = useState('');
  const [referral,        setReferral]        = useState('');
  const [appliedReferral, setAppliedReferral] = useState(null);
  const [referralError,   setReferralError]   = useState('');

  /* ── ORDER SUCCESS ─────────────────────────────────────────── */
  const [orderSuccess, setOrderSuccess] = useState(null);

  /* ── Guards ────────────────────────────────────────────────── */
  if (!isLoggedIn) return <Navigate to="/login?redirect=/checkout" replace />;
  if (items.length === 0 && !orderSuccess) return <Navigate to="/cart" replace />;

  /* ── Price calc ────────────────────────────────────────────── */
  const couponDiscount   = appliedCoupon   ? Math.round(subtotal * VALID_COUPONS[appliedCoupon].discount) : 0;
  const referralDiscount = appliedReferral ? Math.round(subtotal * appliedReferral.discount) : 0;
  const totalDiscount    = couponDiscount + referralDiscount;
  const discSub          = subtotal - totalDiscount;
  const tax              = Math.round(discSub * 0.18);
  const total            = discSub + tax;

  /* ── Address resolution helpers ────────────────────────────── */
  const getEffectiveDelivery = () => {
    if (!useNewDelivery && selectedDeliveryId) {
      return savedAddresses.find(a => a.id === selectedDeliveryId) || EMPTY_ADDR;
    }
    return newDelivery;
  };

  const getEffectiveBilling = () => {
    if (billingSameAsDelivery) return getEffectiveDelivery();
    if (!useNewBilling && selectedBillingId) {
      return savedAddresses.find(a => a.id === selectedBillingId) || EMPTY_ADDR;
    }
    return newBilling;
  };

  /* ── Field change handlers ─────────────────────────────────── */
  const setDeliveryField = (key, val) => {
    setNewDelivery(p => ({ ...p, [key]: val }));
    setDeliveryErrors(p => ({ ...p, [key]: '' }));
  };
  const setBillingField = (key, val) => {
    setNewBilling(p => ({ ...p, [key]: val }));
    setBillingErrors(p => ({ ...p, [key]: '' }));
  };

  /* ── Validation ────────────────────────────────────────────── */
  const validateAddr = (addr, setErrors) => {
    const errs = {};
    ['name','phone','line1','city','state','pin'].forEach(k => {
      if (!addr[k]?.trim()) errs[k] = 'Required';
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validate = () => {
    let ok = true;
    // Delivery must be set
    if (useNewDelivery || savedAddresses.length === 0) {
      if (!validateAddr(newDelivery, setDeliveryErrors)) ok = false;
    } else if (!selectedDeliveryId) {
      ok = false;
    }
    // Billing — only validate separately when not same as delivery
    if (!billingSameAsDelivery) {
      if (useNewBilling || savedAddresses.length === 0) {
        if (!validateAddr(newBilling, setBillingErrors)) ok = false;
      } else if (!selectedBillingId) {
        ok = false;
      }
    }
    return ok;
  };

  /* ── Place order ───────────────────────────────────────────── */
  const handlePlaceOrder = () => {
    if (!validate()) return;
    const orderNum = genOrderNo();
    clearCart();
    setOrderSuccess({ orderNumber: orderNum, total });
  };

  /* ── Coupon / referral ─────────────────────────────────────── */
  const handleApplyCoupon = useCallback(() => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) { setAppliedCoupon(code); setCouponError(''); }
    else setCouponError('Invalid coupon code.');
  }, [coupon]);

  const handleApplyReferral = useCallback(() => {
    const result = findReferral(referral);
    if (result) { setAppliedReferral(result); setReferralError(''); }
    else setReferralError('Invalid referral code. Ask your photographer for their code.');
  }, [referral]);

  /* ================================================================
     ORDER SUCCESS
     ================================================================ */
  if (orderSuccess) {
    return (
      <div className="checkout-success">
        <div className="checkout-success__card">
          <div className="checkout-success__icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 className="checkout-success__title">Order Placed!</h1>
          <p className="checkout-success__order">Order #{orderSuccess.orderNumber}</p>
          <p className="checkout-success__msg">
            Thank you! Your order has been confirmed. Estimated delivery: <strong>10–14 business days</strong>.
          </p>
          <p className="checkout-success__total">Total paid: <strong>{fmt(orderSuccess.total)}</strong></p>
          <div className="checkout-success__actions">
            <Link to="/track" className="checkout-success__btn-primary">Track Your Order</Link>
            <Link to="/shop" className="checkout-success__btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================
     CHECKOUT FORM
     ================================================================ */
  const effectiveDelivery = getEffectiveDelivery();
  const effectiveBilling  = getEffectiveBilling();

  return (
    <div className="checkout">
      <Breadcrumb />
      <div className="checkout__inner">
        <h1 className="checkout__title">Checkout</h1>

        <div className="checkout__layout">

          {/* ════════════════════════════════════════════════════
              LEFT — Forms
              ════════════════════════════════════════════════════ */}
          <div className="checkout__forms">

            {/* ── STEP 1: DELIVERY ADDRESS ─────────────────── */}
            <div className="checkout__card">
              <h2 className="checkout__card-title">
                <span className="checkout__step-num">1</span>
                Delivery Address
              </h2>

              {savedAddresses.length > 0 ? (
                <>
                  {/* Saved address cards */}
                  <div className="checkout__addr-cards">
                    {savedAddresses.map(addr => (
                      <AddressCard
                        key={addr.id}
                        addr={addr}
                        selected={selectedDeliveryId === addr.id && !useNewDelivery}
                        onSelect={() => { setSelectedDeliveryId(addr.id); setUseNewDelivery(false); }}
                      />
                    ))}

                    {/* Enter a different address */}
                    <div
                      className={`checkout__addr-card checkout__addr-card--new ${useNewDelivery ? 'checkout__addr-card--active' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => { setUseNewDelivery(true); setSelectedDeliveryId(null); }}
                      onKeyDown={e => e.key === 'Enter' && (setUseNewDelivery(true), setSelectedDeliveryId(null))}
                    >
                      <div className="checkout__addr-card__radio">
                        <div className={`checkout__addr-radio ${useNewDelivery ? 'checkout__addr-radio--active' : ''}`} />
                      </div>
                      <span className="checkout__addr-card__new-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Deliver to a different address
                      </span>
                    </div>
                  </div>

                  {/* New delivery form — shown when "different address" is selected */}
                  {useNewDelivery && (
                    <div className="checkout__new-addr-form">
                      <AddressForm values={newDelivery} onChange={setDeliveryField} errors={deliveryErrors} />
                    </div>
                  )}
                </>
              ) : (
                /* No saved addresses — show form directly */
                <AddressForm values={newDelivery} onChange={setDeliveryField} errors={deliveryErrors} />
              )}
            </div>

            {/* ── STEP 2: BILLING ADDRESS ──────────────────── */}
            <div className="checkout__card">
              <h2 className="checkout__card-title">
                <span className="checkout__step-num">2</span>
                Billing Address
              </h2>

              {/* Same as delivery toggle */}
              <label className="checkout__checkbox-row">
                <input
                  type="checkbox"
                  checked={billingSameAsDelivery}
                  onChange={e => setBillingSameAsDelivery(e.target.checked)}
                />
                <span>Same as delivery address</span>
              </label>

              {billingSameAsDelivery ? (
                /* Preview the effective delivery address */
                effectiveDelivery.line1 ? (
                  <div className="checkout__addr-preview">
                    <p className="checkout__addr-preview__name">{effectiveDelivery.name}</p>
                    <p className="checkout__addr-preview__text">
                      {effectiveDelivery.line1}{effectiveDelivery.line2 ? `, ${effectiveDelivery.line2}` : ''}
                    </p>
                    <p className="checkout__addr-preview__text">
                      {effectiveDelivery.city}, {effectiveDelivery.state} – {effectiveDelivery.pin}
                    </p>
                    <p className="checkout__addr-preview__phone">{effectiveDelivery.phone}</p>
                  </div>
                ) : (
                  <p className="checkout__addr-preview__empty">
                    Complete your delivery address above to auto-fill billing.
                  </p>
                )
              ) : (
                /* Separate billing address */
                <div className="checkout__billing-sep">
                  {savedAddresses.length > 0 && (
                    <>
                      <div className="checkout__addr-cards">
                        {savedAddresses.map(addr => (
                          <AddressCard
                            key={addr.id}
                            addr={addr}
                            selected={selectedBillingId === addr.id && !useNewBilling}
                            onSelect={() => { setSelectedBillingId(addr.id); setUseNewBilling(false); }}
                          />
                        ))}
                        <div
                          className={`checkout__addr-card checkout__addr-card--new ${useNewBilling ? 'checkout__addr-card--active' : ''}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => { setUseNewBilling(true); setSelectedBillingId(null); }}
                          onKeyDown={e => e.key === 'Enter' && (setUseNewBilling(true), setSelectedBillingId(null))}
                        >
                          <div className="checkout__addr-card__radio">
                            <div className={`checkout__addr-radio ${useNewBilling ? 'checkout__addr-radio--active' : ''}`} />
                          </div>
                          <span className="checkout__addr-card__new-label">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Use a different billing address
                          </span>
                        </div>
                      </div>
                      {useNewBilling && (
                        <div className="checkout__new-addr-form">
                          <AddressForm values={newBilling} onChange={setBillingField} errors={billingErrors} />
                        </div>
                      )}
                    </>
                  )}
                  {savedAddresses.length === 0 && (
                    <AddressForm values={newBilling} onChange={setBillingField} errors={billingErrors} />
                  )}
                </div>
              )}
            </div>

            {/* ── STEP 3: PAYMENT ──────────────────────────── */}
            <div className="checkout__card">
              <h2 className="checkout__card-title">
                <span className="checkout__step-num">3</span>
                Payment Method
              </h2>
              <div className="checkout__payments">
                {PAYMENT_METHODS.map(pm => (
                  <label
                    key={pm.id}
                    className={`checkout__payment-option ${payment === pm.id ? 'checkout__payment-option--active' : ''}`}
                  >
                    <input type="radio" name="payment" value={pm.id} checked={payment === pm.id} onChange={() => setPayment(pm.id)} />
                    <PaymentIcon type={pm.icon} />
                    <span>{pm.label}</span>
                  </label>
                ))}
              </div>
              <p className="checkout__payment-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                All payments are secured and encrypted.
              </p>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════
              RIGHT — Order summary
              ════════════════════════════════════════════════════ */}
          <div className="checkout__summary">
            <h2 className="checkout__summary-title">Order Summary</h2>

            {/* Items */}
            <div className="checkout__summary-items">
              {items.map(item => (
                <div key={item.id} className="checkout__summary-item">
                  <div className="checkout__summary-thumb">
                    <img src={item.image || '/images/products/luxury-celestial.jpg'} alt={item.productName} />
                  </div>
                  <div className="checkout__summary-item-info">
                    <p className="checkout__summary-item-name">{item.productName}</p>
                    <p className="checkout__summary-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="checkout__summary-item-price">{fmt(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="checkout__discount-section">
              <p className="checkout__discount-section__label">Coupon Code</p>
              <div className="checkout__coupon">
                {appliedCoupon ? (
                  <div className="checkout__coupon-applied">
                    <span>✓ {VALID_COUPONS[appliedCoupon].label} applied</span>
                    <button onClick={() => { setAppliedCoupon(null); setCoupon(''); }}>Remove</button>
                  </div>
                ) : (
                  <div className="checkout__coupon-row">
                    <input className="checkout__coupon-input" placeholder="Enter coupon code"
                      value={coupon} onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()} />
                    <button className="checkout__coupon-btn" onClick={handleApplyCoupon}>Apply</button>
                  </div>
                )}
                {couponError && <p className="checkout__coupon-error">{couponError}</p>}
              </div>
            </div>

            {/* Referral — non-verified users only */}
            {!isVerified && (
              <div className="checkout__discount-section">
                <p className="checkout__discount-section__label">
                  Photographer Referral Code
                  <span className="checkout__discount-section__hint">Ask your photographer</span>
                </p>
                <div className="checkout__coupon">
                  {appliedReferral ? (
                    <div className="checkout__coupon-applied checkout__coupon-applied--referral">
                      <span>✓ {appliedReferral.label}</span>
                      <button onClick={() => { setAppliedReferral(null); setReferral(''); }}>Remove</button>
                    </div>
                  ) : (
                    <div className="checkout__coupon-row">
                      <input className="checkout__coupon-input" placeholder="Referral code"
                        value={referral} onChange={e => { setReferral(e.target.value); setReferralError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyReferral()} />
                      <button className="checkout__coupon-btn checkout__coupon-btn--referral" onClick={handleApplyReferral}>Apply</button>
                    </div>
                  )}
                  {referralError && <p className="checkout__coupon-error">{referralError}</p>}
                </div>
              </div>
            )}

            {/* Price breakdown */}
            <div className="checkout__price-lines">
              <div className="checkout__price-line">
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="checkout__price-line checkout__price-line--discount">
                  <span>Coupon ({appliedCoupon})</span><span>−{fmt(couponDiscount)}</span>
                </div>
              )}
              {referralDiscount > 0 && (
                <div className="checkout__price-line checkout__price-line--discount">
                  <span>Referral ({appliedReferral?.photographerName})</span><span>−{fmt(referralDiscount)}</span>
                </div>
              )}
              <div className="checkout__price-line">
                <span>GST (18%)</span><span>{fmt(tax)}</span>
              </div>
              <div className="checkout__price-line checkout__price-line--total">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>

            <button className="checkout__place-order" onClick={handlePlaceOrder}>
              Place Order · {fmt(total)}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <p className="checkout__place-note">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
