import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'

const timelineSteps = [
  { label: 'Order Placed', date: 'Mar 18, 2026', detail: 'Your order has been confirmed and payment received.' },
  { label: 'In Production', date: 'Mar 20, 2026', detail: 'Your album is being printed and assembled.' },
  { label: 'Quality Check', date: 'Mar 22, 2026', detail: 'Multi-stage quality inspection in progress.' },
  { label: 'Shipped', date: '', detail: 'Package handed to courier for delivery.' },
  { label: 'Delivered', date: '', detail: 'Delivered to your doorstep.' },
]

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState('')
  const [email, setEmail] = useState('')
  const [tracked, setTracked] = useState(false)
  const [error, setError] = useState('')
  const activeStep = 2 // 0-indexed, "Quality Check" is active in demo

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!orderNum.trim() || !email.trim()) {
      setError('Please enter both order number and email.')
      return
    }
    setError('')
    setTracked(true)
  }

  return (
    <div className="track-page">
      <div className="container">
        <div className="track-card">
          <h1 className="display-sm">Track Your Order</h1>
          <p className="track-subtitle">Enter your order details to see real-time status.</p>

          {!tracked ? (
            <form className="track-form" onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label className="input-label">Order Number</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="e.g. CNV-20260318-4521"
                  value={orderNum}
                  onChange={(e) => setOrderNum(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="track-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block">Track</button>
            </form>
          ) : (
            <div className="track-results">
              <div className="track-order-info">
                <span className="badge badge-accent">Order {orderNum || 'CNV-20260318-4521'}</span>
              </div>
              <div className="track-timeline">
                {timelineSteps.map((step, i) => {
                  const isDone = i < activeStep
                  const isActive = i === activeStep
                  const isFuture = i > activeStep
                  return (
                    <div key={step.label} className={`track-step${isDone ? ' done' : ''}${isActive ? ' active' : ''}${isFuture ? ' future' : ''}`}>
                      <div className="track-step-indicator">
                        <div className="track-step-circle">
                          {isDone && (
                            <svg viewBox="0 0 14 14" fill="none">
                              <path d="M3 7l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        {i < timelineSteps.length - 1 && <div className="track-step-line" />}
                      </div>
                      <div className="track-step-content">
                        <span className="track-step-label">{step.label}</span>
                        {step.date && <span className="track-step-date">{step.date}</span>}
                        <span className="track-step-detail">{step.detail}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button className="btn btn-ghost" onClick={() => { setTracked(false); setOrderNum(''); setEmail('') }}>
                Track Another Order
              </button>
            </div>
          )}

          <p className="track-help">
            Need help? <Link to="/contact">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
