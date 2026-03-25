import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import '../styles/order-config.css'

export default function OrderConfirmationPage() {
  const orderId = useMemo(() => {
    const ts = Date.now().toString(36).toUpperCase()
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `CNV-${ts}-${rand}`
  }, [])

  return (
    <div className="order-confirm">
      <div className="order-confirm-icon">
        <svg viewBox="0 0 32 32" fill="none" width="40" height="40">
          <path d="M9 16l5 5 9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your order. Your order number is:</p>

      <div className="order-confirm-id">{orderId}</div>

      <p className="order-confirm-estimate">
        Estimated delivery: 5–7 business days. We will send you email updates.
      </p>

      <div className="order-confirm-actions">
        <Link to="/track" className="oc-btn oc-btn--primary">Track Order</Link>
        <Link to="/shop" className="oc-btn oc-btn--outline">Continue Shopping</Link>
      </div>
    </div>
  )
}
