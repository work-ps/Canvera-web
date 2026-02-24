import { useState } from 'react'
import '../../styles/contact.css'

export default function ContactPage() {
  const [isPhotographer, setIsPhotographer] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
    studioName: '', city: '',
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>We're here to help. Reach out to us via phone, WhatsApp, or the form below.</p>
      </div>

      <div className="contact-inner">
        {/* Contact cards */}
        <div className="contact-cards">
          <div className="contact-card">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M34 27v4a2 2 0 01-2.2 2 20 20 0 01-8.7-3.1A19.8 19.8 0 0113 20a20 20 0 01-3.1-8.7A2 2 0 0112 9h4a2 2 0 012 1.7 13 13 0 00.7 2.9 2 2 0 01-.5 2.1l-1.7 1.7a16 16 0 006.2 6.2l1.7-1.7a2 2 0 012.1-.5 13 13 0 002.9.7A2 2 0 0134 23z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Call Us</h3>
            <p>Available Mon–Sat, 9AM–7PM IST</p>
            <div className="contact-number">1-800-419-0570</div>
            <a href="tel:18004190570" className="btn btn-primary btn-md">Call Now (Toll-Free)</a>
          </div>

          <div className="contact-card">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M33 19.2a14.3 14.3 0 01-1.5 6.4 14.5 14.5 0 01-13 8.1 14.3 14.3 0 01-6.4-1.5L5 35l2.8-7.1A14.3 14.3 0 016.3 21.5a14.5 14.5 0 018.1-13A14.3 14.3 0 0120.8 7h.8A14.5 14.5 0 0133 19.4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>WhatsApp</h3>
            <p>Quick responses, share images directly</p>
            <div className="contact-number">+91 98765 43210</div>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md" style={{ background: '#25D366' }}>Chat on WhatsApp</a>
          </div>
        </div>

        {/* Success alert */}
        {submitted && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--space-6)' }}>
            <svg className="alert-icon" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</span>
          </div>
        )}

        {/* Form + aside */}
        <div className="contact-form-section">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send Us a Message</h2>
            <p style={{ fontSize: 14, color: 'var(--neutral-500)', marginBottom: 'var(--space-2)' }}>
              Fill in the form below and we'll respond within 24 hours.
            </p>

            <div className="contact-form-row">
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input className="input-field" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
              <div className="input-group">
                <label className="input-label">Email *</label>
                <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>
            </div>

            <div className="contact-form-row">
              <div className="input-group">
                <label className="input-label">Phone</label>
                <input className="input-field" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
              </div>
              <div className="input-group">
                <label className="input-label">Subject *</label>
                <select className="input-field" name="subject" value={form.subject} onChange={handleChange} required>
                  <option value="">Select a topic</option>
                  <option value="order">Order Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="design">Design Service</option>
                  <option value="bulk">Bulk Order</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Photographer toggle */}
            <div className="photographer-toggle">
              <label>I am a photographer</label>
              <div
                className={`toggle-switch${isPhotographer ? ' active' : ''}`}
                onClick={() => setIsPhotographer(!isPhotographer)}
                role="switch"
                aria-checked={isPhotographer}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsPhotographer(!isPhotographer) }}
              />
            </div>

            {isPhotographer && (
              <div className="contact-form-row">
                <div className="input-group">
                  <label className="input-label">Studio Name</label>
                  <input className="input-field" type="text" name="studioName" value={form.studioName} onChange={handleChange} placeholder="Your studio name" />
                </div>
                <div className="input-group">
                  <label className="input-label">City</label>
                  <input className="input-field" type="text" name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
                </div>
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Message *</label>
              <textarea className="input-field" name="message" value={form.message} onChange={handleChange} rows="5" placeholder="How can we help you?" required style={{ resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }}>
              Send Message
              <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16 }}>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>

          <div className="contact-aside">
            <div className="contact-aside-card">
              <h3>Office Address</h3>
              <p>Canvera Digital Technologies Pvt. Ltd.<br />
              HSR Layout, Sector 7<br />
              Bangalore, Karnataka 560102<br />
              India</p>
            </div>
            <div className="contact-aside-card">
              <h3>Support Hours</h3>
              <p>Monday – Saturday: 9:00 AM – 7:00 PM IST<br />
              Sunday: Closed<br /><br />
              Email support: 24-hour response time<br />
              WhatsApp: Typically within 2 hours</p>
            </div>
            <div className="contact-aside-card">
              <h3>For Photographers</h3>
              <p>Are you a professional photographer? Join our community of 75,000+ photographers across India. Get exclusive pricing, free design service, and priority support.</p>
              <a href="/register" className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-3)' }}>Join for Free</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
