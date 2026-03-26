import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getProductThumbnail } from '../data/productImages'
import '../styles/pages.css'

function formatPrice(n) { return n?.toLocaleString('en-IN') || '0' }

const CHECKOUT_STEPS = ['Cart', 'Shipping', 'Payment', 'Confirmation']

const PAYMENT_METHODS = [
  {
    id: 'upi',
    title: 'UPI',
    desc: 'Google Pay, PhonePe, Paytm',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
        <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 12h4M15 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, RuPay',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
        <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 9h20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    desc: 'All major banks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
        <path d="M3 10l9-6 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M5 10v8M9 10v8M15 10v8M19 10v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'cod',
    title: 'Cash on Delivery',
    desc: 'Pay when you receive',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
]

const PIN_SUGGESTIONS = {
  '560001': { city: 'Bangalore', state: 'Karnataka' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, completeItems } = useCart()
  // Only checkout complete items
  const checkoutItems = completeItems
  const { authState } = useAuth()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('shipping')
  const [shippingComplete, setShippingComplete] = useState(false)

  /* ---- Saved addresses from localStorage ---- */
  const savedAddresses = useMemo(() => {
    try {
      const saved = localStorage.getItem('canvera_addresses')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  }, [])

  const defaultBilling = savedAddresses.find(a => a.isDefault) || savedAddresses[0] || null
  const [selectedBilling, setSelectedBilling] = useState(defaultBilling?.id || '')
  const [showBillingForm, setShowBillingForm] = useState(!defaultBilling)
  const [sameAsDelivery, setSameAsDelivery] = useState(true)
  const [selectedDelivery, setSelectedDelivery] = useState('')
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)

  const [shipping, setShipping] = useState({
    name: authState?.name || '',
    phone: authState?.phone || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pin: '',
  })
  const [deliveryForm, setDeliveryForm] = useState({
    name: '', phone: '', address1: '', address2: '', city: '', state: '', pin: '',
  })
  const [saveDefault, setSaveDefault] = useState(false)
  const [payment, setPayment] = useState('upi')
  const [promoOpen, setPromoOpen] = useState(false)
  const [promo, setPromo] = useState('')

  const shippingFree = cartTotal >= 5000
  const tax = Math.round(cartTotal * 0.18)
  const total = cartTotal + tax

  const activeStepIndex = useMemo(() => {
    if (!shippingComplete) return 1
    return 2
  }, [shippingComplete])

  const handlePinChange = (val, formSetter) => {
    formSetter(prev => ({ ...prev, pin: val }))
    if (val.length === 6 && PIN_SUGGESTIONS[val]) {
      const suggestion = PIN_SUGGESTIONS[val]
      formSetter(prev => ({
        ...prev,
        pin: val,
        city: suggestion.city,
        state: suggestion.state,
      }))
    }
  }

  const billingAddr = useMemo(() => {
    if (selectedBilling && !showBillingForm) {
      return savedAddresses.find(a => a.id === selectedBilling) || null
    }
    return shipping.name ? shipping : null
  }, [selectedBilling, showBillingForm, savedAddresses, shipping])

  const deliveryAddr = useMemo(() => {
    if (sameAsDelivery) return billingAddr
    if (selectedDelivery && !showDeliveryForm) {
      return savedAddresses.find(a => a.id === selectedDelivery) || null
    }
    return deliveryForm.name ? deliveryForm : null
  }, [sameAsDelivery, billingAddr, selectedDelivery, showDeliveryForm, savedAddresses, deliveryForm])

  const handleShippingContinue = () => {
    setShippingComplete(true)
    setActiveSection('payment')
  }

  const handlePlaceOrder = () => {
    clearCart()
    navigate('/order-confirmation')
  }

  const billingValid = showBillingForm
    ? (shipping.name && shipping.phone && shipping.address1 && shipping.city && shipping.state && shipping.pin)
    : !!selectedBilling
  const deliveryValid = sameAsDelivery
    ? billingValid
    : showDeliveryForm
      ? (deliveryForm.name && deliveryForm.phone && deliveryForm.address1 && deliveryForm.city && deliveryForm.state && deliveryForm.pin)
      : !!selectedDelivery
  const shippingValid = billingValid && deliveryValid

  return (
    <div className="checkout-page-wrap">
      {/* Progress Indicator */}
      <div className="checkout-progress">
        <div className="checkout-progress-inner">
          {CHECKOUT_STEPS.map((step, i) => (
            <div key={step} className="checkout-progress-step">
              {i > 0 && (
                <div className={`checkout-progress-line${i <= activeStepIndex ? ' checkout-progress-line--active' : ''}`} />
              )}
              <div className={`checkout-progress-dot${i <= activeStepIndex ? ' checkout-progress-dot--active' : ''}${i < activeStepIndex ? ' checkout-progress-dot--done' : ''}`}>
                {i < activeStepIndex ? (
                  <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </div>
              <span className={`checkout-progress-label${i <= activeStepIndex ? ' checkout-progress-label--active' : ''}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-container">
        <div className="checkout-form-col">
          {/* Shipping Section */}
          <div className={`checkout-section${activeSection === 'shipping' ? ' checkout-section--open' : ''}`}>
            <button
              className="checkout-section-header"
              onClick={() => setActiveSection('shipping')}
            >
              <div className="checkout-section-header-left">
                <span className={`checkout-section-number${shippingComplete ? ' checkout-section-number--done' : ''}`}>
                  {shippingComplete ? (
                    <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                      <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : '1'}
                </span>
                <span className="checkout-section-title heading-md">Shipping Address</span>
              </div>
              {shippingComplete && activeSection !== 'shipping' && billingAddr && (
                <span className="checkout-section-summary">{billingAddr.name}, {billingAddr.city}</span>
              )}
              <svg className={`checkout-section-chevron${activeSection === 'shipping' ? ' checkout-section-chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {activeSection === 'shipping' && (
              <div className="checkout-section-body">
                {/* ---- Billing Address ---- */}
                <h4 className="checkout-addr-section-title">Billing Address</h4>

                {savedAddresses.length > 0 && !showBillingForm ? (
                  <div className="checkout-addr-select-wrap">
                    <select className="input-field" value={selectedBilling} onChange={e => setSelectedBilling(e.target.value)}>
                      <option value="">Select a saved address</option>
                      {savedAddresses.map(a => (
                        <option key={a.id} value={a.id}>{a.label || 'Address'} — {a.address1}, {a.city}</option>
                      ))}
                    </select>
                    {selectedBilling && (() => {
                      const addr = savedAddresses.find(a => a.id === selectedBilling)
                      return addr ? (
                        <div className="checkout-addr-preview">
                          <strong>{addr.name}</strong> &middot; {addr.phone}<br />
                          {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
                          {addr.city}, {addr.state} - {addr.pin}
                        </div>
                      ) : null
                    })()}
                    <button className="checkout-addr-change" onClick={() => setShowBillingForm(true)}>
                      {selectedBilling ? 'Change' : 'Enter a new address'}
                    </button>
                  </div>
                ) : (
                  <>
                    {savedAddresses.length > 0 && (
                      <button className="checkout-addr-change" onClick={() => setShowBillingForm(false)}>Select from saved addresses</button>
                    )}
                    <div className="checkout-form-grid checkout-form-grid--2">
                      <div className="input-group">
                        <label className="input-label">Full Name *</label>
                        <input className="input-field" type="text" placeholder="Full Name" value={shipping.name} onChange={e => setShipping(p => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Phone *</label>
                        <input className="input-field" type="tel" placeholder="Phone Number" value={shipping.phone} onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Address Line 1 *</label>
                      <input className="input-field" type="text" placeholder="Street address, building name" value={shipping.address1} onChange={e => setShipping(p => ({ ...p, address1: e.target.value }))} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Address Line 2</label>
                      <input className="input-field" type="text" placeholder="Apartment, suite, floor (optional)" value={shipping.address2} onChange={e => setShipping(p => ({ ...p, address2: e.target.value }))} />
                    </div>
                    <div className="checkout-form-grid checkout-form-grid--3">
                      <div className="input-group">
                        <label className="input-label">PIN Code *</label>
                        <input className="input-field" type="text" placeholder="6-digit PIN" maxLength={6} value={shipping.pin} onChange={e => handlePinChange(e.target.value.replace(/\D/g, ''), setShipping)} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">City *</label>
                        <input className="input-field" type="text" placeholder="City" value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">State *</label>
                        <input className="input-field" type="text" placeholder="State" value={shipping.state} onChange={e => setShipping(p => ({ ...p, state: e.target.value }))} />
                      </div>
                    </div>
                  </>
                )}

                {/* ---- Delivery Address ---- */}
                <div className="checkout-addr-divider" />
                <h4 className="checkout-addr-section-title">Delivery Address</h4>
                <label className="checkout-save-default">
                  <input type="checkbox" checked={sameAsDelivery} onChange={e => setSameAsDelivery(e.target.checked)} />
                  <span>Same as billing address</span>
                </label>

                {!sameAsDelivery && (
                  <>
                    {savedAddresses.length > 0 && !showDeliveryForm ? (
                      <div className="checkout-addr-select-wrap">
                        <select className="input-field" value={selectedDelivery} onChange={e => setSelectedDelivery(e.target.value)}>
                          <option value="">Select a saved address</option>
                          {savedAddresses.map(a => (
                            <option key={a.id} value={a.id}>{a.label || 'Address'} — {a.address1}, {a.city}</option>
                          ))}
                        </select>
                        {selectedDelivery && (() => {
                          const addr = savedAddresses.find(a => a.id === selectedDelivery)
                          return addr ? (
                            <div className="checkout-addr-preview">
                              <strong>{addr.name}</strong> &middot; {addr.phone}<br />
                              {addr.address1}{addr.address2 ? `, ${addr.address2}` : ''}<br />
                              {addr.city}, {addr.state} - {addr.pin}
                            </div>
                          ) : null
                        })()}
                        <button className="checkout-addr-change" onClick={() => setShowDeliveryForm(true)}>
                          {selectedDelivery ? 'Change' : 'Enter a new address'}
                        </button>
                      </div>
                    ) : (
                      <>
                        {savedAddresses.length > 0 && (
                          <button className="checkout-addr-change" onClick={() => setShowDeliveryForm(false)}>Select from saved addresses</button>
                        )}
                        <div className="checkout-form-grid checkout-form-grid--2">
                          <div className="input-group">
                            <label className="input-label">Full Name *</label>
                            <input className="input-field" type="text" placeholder="Full Name" value={deliveryForm.name} onChange={e => setDeliveryForm(p => ({ ...p, name: e.target.value }))} />
                          </div>
                          <div className="input-group">
                            <label className="input-label">Phone *</label>
                            <input className="input-field" type="tel" placeholder="Phone Number" value={deliveryForm.phone} onChange={e => setDeliveryForm(p => ({ ...p, phone: e.target.value }))} />
                          </div>
                        </div>
                        <div className="input-group">
                          <label className="input-label">Address Line 1 *</label>
                          <input className="input-field" type="text" placeholder="Street address, building name" value={deliveryForm.address1} onChange={e => setDeliveryForm(p => ({ ...p, address1: e.target.value }))} />
                        </div>
                        <div className="input-group">
                          <label className="input-label">Address Line 2</label>
                          <input className="input-field" type="text" placeholder="Apartment, suite, floor (optional)" value={deliveryForm.address2} onChange={e => setDeliveryForm(p => ({ ...p, address2: e.target.value }))} />
                        </div>
                        <div className="checkout-form-grid checkout-form-grid--3">
                          <div className="input-group">
                            <label className="input-label">PIN Code *</label>
                            <input className="input-field" type="text" placeholder="6-digit PIN" maxLength={6} value={deliveryForm.pin} onChange={e => handlePinChange(e.target.value.replace(/\D/g, ''), setDeliveryForm)} />
                          </div>
                          <div className="input-group">
                            <label className="input-label">City *</label>
                            <input className="input-field" type="text" placeholder="City" value={deliveryForm.city} onChange={e => setDeliveryForm(p => ({ ...p, city: e.target.value }))} />
                          </div>
                          <div className="input-group">
                            <label className="input-label">State *</label>
                            <input className="input-field" type="text" placeholder="State" value={deliveryForm.state} onChange={e => setDeliveryForm(p => ({ ...p, state: e.target.value }))} />
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                <label className="checkout-save-default">
                  <input type="checkbox" checked={saveDefault} onChange={e => setSaveDefault(e.target.checked)} />
                  <span>Save as default address</span>
                </label>

                <button
                  className="btn btn-primary checkout-continue-btn"
                  disabled={!shippingValid}
                  onClick={handleShippingContinue}
                >
                  Continue
                  <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Payment Section */}
          <div className={`checkout-section${activeSection === 'payment' ? ' checkout-section--open' : ''}${!shippingComplete ? ' checkout-section--disabled' : ''}`}>
            <button
              className="checkout-section-header"
              onClick={() => shippingComplete && setActiveSection('payment')}
              disabled={!shippingComplete}
            >
              <div className="checkout-section-header-left">
                <span className="checkout-section-number">2</span>
                <span className="checkout-section-title heading-md">Payment</span>
              </div>
              <svg className={`checkout-section-chevron${activeSection === 'payment' ? ' checkout-section-chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {activeSection === 'payment' && shippingComplete && (
              <div className="checkout-section-body">
                <div className="checkout-payment-options">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      className={`checkout-payment-option${payment === m.id ? ' checkout-payment-option--selected' : ''}`}
                      onClick={() => setPayment(m.id)}
                    >
                      <span className="checkout-payment-icon">{m.icon}</span>
                      <div className="checkout-payment-info">
                        <span className="checkout-payment-name">{m.title}</span>
                        <span className="checkout-payment-desc">{m.desc}</span>
                      </div>
                      <span className={`checkout-payment-radio${payment === m.id ? ' checkout-payment-radio--selected' : ''}`} />
                    </button>
                  ))}
                </div>

                <p className="checkout-payment-note">
                  You'll be redirected to complete payment securely
                </p>

                <button
                  className="btn btn-primary btn-block checkout-place-order-btn"
                  onClick={handlePlaceOrder}
                >
                  Place Order &mdash; &#x20B9;{formatPrice(total)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <aside className="checkout-summary-col">
          <div className="checkout-summary-card">
            <h3 className="heading-md">Order Summary</h3>

            <div className="checkout-summary-items">
              {checkoutItems.map(item => {
                const thumb = getProductThumbnail(item.slug)
                return (
                  <div key={item.id} className="checkout-summary-item">
                    <div className="checkout-summary-thumb">
                      {thumb ? (
                        <img src={thumb} alt={item.name} />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                          <rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--neutral-300)" strokeWidth="1.2" />
                        </svg>
                      )}
                    </div>
                    <div className="checkout-summary-item-info">
                      <span className="checkout-summary-item-name">{item.name}</span>
                      <span className="checkout-summary-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="checkout-summary-item-price">&#x20B9;{formatPrice(item.price * item.quantity)}</span>
                  </div>
                )
              })}
            </div>

            {/* Shipping address preview */}
            {shippingComplete && deliveryAddr && (
              <div className="checkout-summary-address">
                <span className="checkout-summary-address-label">Ship to</span>
                <span className="checkout-summary-address-text">
                  {deliveryAddr.name}, {deliveryAddr.address1}{deliveryAddr.address2 ? `, ${deliveryAddr.address2}` : ''}, {deliveryAddr.city} - {deliveryAddr.pin}
                </span>
              </div>
            )}

            {/* Promo code */}
            <div className="checkout-promo">
              <button
                className="checkout-promo-toggle"
                onClick={() => setPromoOpen(!promoOpen)}
              >
                Have a promo code?
                <svg className={`checkout-promo-chevron${promoOpen ? ' checkout-promo-chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {promoOpen && (
                <div className="checkout-promo-input-row">
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Enter code"
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                  />
                  <button className="btn btn-secondary btn-sm">Apply</button>
                </div>
              )}
            </div>

            <div className="checkout-summary-lines">
              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <span>&#x20B9;{formatPrice(cartTotal)}</span>
              </div>
              <div className="checkout-summary-row">
                <span>Shipping</span>
                <span className={shippingFree ? 'checkout-shipping-free' : ''}>
                  {shippingFree ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>
              <div className="checkout-summary-row">
                <span>Tax (18% GST)</span>
                <span>&#x20B9;{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-total">
              <span>Total</span>
              <span className="checkout-summary-total-amount">&#x20B9;{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
