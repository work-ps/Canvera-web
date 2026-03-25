import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import '../styles/order-config.css'

function formatPrice(n) { return n?.toLocaleString('en-IN') || '0' }

const PAYMENT_METHODS = [
  { id: 'upi', title: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '₹' },
  { id: 'card', title: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
  { id: 'netbanking', title: 'Net Banking', desc: 'All major banks', icon: '🏦' },
  { id: 'wallet', title: 'Wallet', desc: 'Paytm, Amazon Pay', icon: '👛' },
]

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { authState } = useAuth()
  const navigate = useNavigate()

  const [delivery, setDelivery] = useState({
    name: authState?.name || '',
    phone: authState?.phone || '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postal: '',
  })

  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [billing, setBilling] = useState({ name: '', phone: '', address1: '', address2: '', city: '', state: '', postal: '' })
  const [payment, setPayment] = useState('upi')
  const [promo, setPromo] = useState('')

  const tax = Math.round(cartTotal * 0.18)
  const total = cartTotal + tax

  const handlePlaceOrder = () => {
    clearCart()
    navigate('/order-confirmation')
  }

  const deliveryField = (key, label, required = true, row = false) => (
    <div className="checkout-field">
      <label>{label}{required ? ' *' : ''}</label>
      <input
        type="text"
        value={delivery[key]}
        onChange={e => setDelivery(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={label}
      />
    </div>
  )

  const billingField = (key, label, required = true) => (
    <div className="checkout-field">
      <label>{label}{required ? ' *' : ''}</label>
      <input
        type="text"
        value={billing[key]}
        onChange={e => setBilling(prev => ({ ...prev, [key]: e.target.value }))}
        placeholder={label}
      />
    </div>
  )

  return (
    <div className="checkout-page">
      <Link to="/cart" className="checkout-back">
        <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to Cart
      </Link>

      <h1 className="checkout-heading">Checkout</h1>

      <div className="checkout-grid">
        {/* Left: Forms */}
        <div>
          {/* Delivery Address */}
          <div className="checkout-card">
            <h3>Delivery Address</h3>
            <div className="checkout-form-row checkout-form-row--2">
              {deliveryField('name', 'Full Name')}
              {deliveryField('phone', 'Phone')}
            </div>
            <div className="checkout-form-row">
              {deliveryField('address1', 'Address Line 1')}
            </div>
            <div className="checkout-form-row">
              {deliveryField('address2', 'Address Line 2', false)}
            </div>
            <div className="checkout-form-row checkout-form-row--3">
              {deliveryField('city', 'City')}
              {deliveryField('state', 'State')}
              {deliveryField('postal', 'Postal Code')}
            </div>
          </div>

          {/* Billing Address */}
          <div className="checkout-card">
            <h3>Billing Address</h3>
            <label className="oc-checkbox-row" style={{ marginBottom: sameAsBilling ? 0 : 20 }}>
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={e => setSameAsBilling(e.target.checked)}
              />
              <span>Same as delivery address</span>
            </label>
            {!sameAsBilling && (
              <>
                <div className="checkout-form-row checkout-form-row--2">
                  {billingField('name', 'Full Name')}
                  {billingField('phone', 'Phone')}
                </div>
                <div className="checkout-form-row">
                  {billingField('address1', 'Address Line 1')}
                </div>
                <div className="checkout-form-row">
                  {billingField('address2', 'Address Line 2', false)}
                </div>
                <div className="checkout-form-row checkout-form-row--3">
                  {billingField('city', 'City')}
                  {billingField('state', 'State')}
                  {billingField('postal', 'Postal Code')}
                </div>
              </>
            )}
          </div>

          {/* Payment Method */}
          <div className="checkout-card">
            <h3>Payment Method</h3>
            <div className="checkout-payment-grid">
              {PAYMENT_METHODS.map(m => (
                <div
                  key={m.id}
                  className={`checkout-payment-card${payment === m.id ? ' checkout-payment-card--selected' : ''}`}
                  onClick={() => setPayment(m.id)}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <div>
                    <div className="checkout-payment-card-title">{m.title}</div>
                    <div className="checkout-payment-card-desc">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          {cartItems.map(item => (
            <div key={item.id} className="checkout-summary-item">
              <div className="checkout-summary-thumb">
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--petrol-400)" strokeWidth="1.2"/>
                </svg>
              </div>
              <div className="checkout-summary-info">
                <div className="checkout-summary-name">{item.name}</div>
                <div className="checkout-summary-variant">{item.config?.size || ''} × {item.quantity}</div>
              </div>
              <div className="checkout-summary-price">&#x20B9;{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}

          <div className="checkout-promo">
            <input
              className="oc-input"
              type="text"
              placeholder="Promo code"
              value={promo}
              onChange={e => setPromo(e.target.value)}
            />
            <button>Apply</button>
          </div>

          <div className="checkout-line">
            <span className="checkout-line-label">Subtotal</span>
            <span>&#x20B9;{formatPrice(cartTotal)}</span>
          </div>
          <div className="checkout-line">
            <span className="checkout-line-label">Tax (18%)</span>
            <span>&#x20B9;{formatPrice(tax)}</span>
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <span className="checkout-total-amount">&#x20B9;{formatPrice(total)}</span>
          </div>

          <button className="checkout-place-btn" onClick={handlePlaceOrder}>
            Place Order — &#x20B9;{formatPrice(total)}
          </button>
        </div>
      </div>
    </div>
  )
}
