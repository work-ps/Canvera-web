import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/contact.css'

const subjects = [
  'General Inquiry',
  'Order Support',
  'Product Question',
  'Pricing & Quotation',
  'Partnership',
  'Other',
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email'
    }
    if (!form.subject) errs.subject = 'Please select a subject'
    if (!form.message.trim()) errs.message = 'Message is required'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-layout">
          {/* Left -- Form */}
          <div className="contact-form-wrap">
            <h1 className="display-sm">Get in Touch</h1>
            <p className="contact-form-sub">
              Fill in the details below and we'll get back to you within 24 hours.
            </p>

            {submitted && (
              <div className="alert alert-success contact-alert">
                <svg viewBox="0 0 18 18" fill="none" style={{ width: 18, height: 18, flexShrink: 0 }}>
                  <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Thank you! Your message has been sent. We'll respond within 24 hours.</span>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label className="input-label">Name *</label>
                <input
                  className={`input-field${errors.name ? ' error' : ''}`}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
                {errors.name && <span className="input-error">{errors.name}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Email *</label>
                <input
                  className={`input-field${errors.email ? ' error' : ''}`}
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                {errors.email && <span className="input-error">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Subject *</label>
                <select
                  className={`input-field${errors.subject ? ' error' : ''}`}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.subject && <span className="input-error">{errors.subject}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Message *</label>
                <textarea
                  className={`input-field${errors.message ? ' error' : ''}`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us how we can help..."
                />
                {errors.message && <span className="input-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Send Message
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16 }}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>

          {/* Right -- Contact info */}
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-card-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014 2h3a2 2 0 012 1.7 12.8 12.8 0 00.7 2.8 2 2 0 01-.5 2.1L7.5 10.3a16 16 0 006.2 6.2l1.7-1.7a2 2 0 012.1-.5 12.8 12.8 0 002.8.7A2 2 0 0122 17z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="heading-sm">Phone</h3>
              <p className="contact-card-value">1-800-419-0570</p>
              <p className="contact-card-note">Toll-free, India</p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="heading-sm">Email</h3>
              <p className="contact-card-value">support@canvera.com</p>
              <p className="contact-card-note">24-hour response time</p>
            </div>

            <div className="contact-card">
              <div className="contact-card-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="heading-sm">Hours</h3>
              <p className="contact-card-value">Mon -- Sat, 9 AM -- 6 PM</p>
              <p className="contact-card-note">IST (Indian Standard Time)</p>
            </div>

            <div className="contact-quick-links">
              <p className="contact-quick-title">Quick Links</p>
              <div className="contact-quick-row">
                <Link to="/track" className="link-arrow">
                  Track Order
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <Link to="/faq" className="link-arrow">
                  FAQ
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <Link to="/genuine" className="link-arrow">
                  Check Genuineness
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
