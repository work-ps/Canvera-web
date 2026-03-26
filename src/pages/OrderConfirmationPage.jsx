import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'

export default function OrderConfirmationPage() {
  const orderNumber = useMemo(() => {
    const digits = Math.floor(100000 + Math.random() * 900000)
    return `CNV-${digits}`
  }, [])

  return (
    <div className="confirm-page-wrap">
      {/* CSS-only confetti */}
      <div className="confirm-confetti" aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="confirm-confetti-dot" style={{
            '--x': `${Math.random() * 100}%`,
            '--delay': `${Math.random() * 2}s`,
            '--color': ['var(--brand-teal)', 'var(--brand-petrol)', 'var(--teal-300)', 'var(--petrol-300)', 'var(--teal-500)'][i % 5],
          }} />
        ))}
      </div>

      <div className="confirm-content">
        {/* Checkmark */}
        <div className="confirm-check-circle">
          <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
            <path d="M9 16l5 5 9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="display-md confirm-heading">Order Placed Successfully!</h1>

        <div className="confirm-order-id">{orderNumber}</div>

        <p className="confirm-delivery">
          Expected delivery: 7&ndash;10 business days
        </p>

        <div className="confirm-divider" />

        {/* Order summary card */}
        <div className="confirm-summary-card">
          <h3 className="heading-sm">Order Details</h3>
          <p className="confirm-summary-note">
            A confirmation email has been sent to your registered email address with all the details.
          </p>
        </div>

        {/* Shipping */}
        <div className="confirm-shipping">
          <h4 className="confirm-shipping-label">Shipping Address</h4>
          <p className="confirm-shipping-text">
            Your saved shipping address will be used for delivery.
          </p>
        </div>

        {/* CTAs */}
        <div className="confirm-actions">
          <Link to="/track" className="btn btn-primary">
            Track Your Order
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link to="/shop" className="btn btn-secondary">
            Continue Shopping
          </Link>
          <button className="btn btn-ghost">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M4 2v12l4-3 4 3V2H4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
            </svg>
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  )
}
