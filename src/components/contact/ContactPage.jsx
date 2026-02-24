import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/contact.css'

const countryCodes = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
]

export default function ContactPage() {
  const [isPhotographer, setIsPhotographer] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [countryCode, setCountryCode] = useState('+91')
  const [codeOpen, setCodeOpen] = useState(false)
  const codeRef = useRef(null)
  const [form, setForm] = useState({
    email: '', name: '', phone: '', message: '',
    studioName: '', city: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    const onClickOutside = (e) => {
      if (codeRef.current && !codeRef.current.contains(e.target)) setCodeOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = {}

    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!form.name.trim()) {
      errors.name = 'Full name is required'
    }

    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required'
    }

    if (!form.message.trim()) {
      errors.message = 'Message is required'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="contact-page">
      <div className="contact-page-inner">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span className="current">Contact Us</span>
        </div>

        <div className="contact-layout">
          {/* Left — Contact info */}
          <div className="contact-info">
            <h1>Get in Touch</h1>
            <p className="contact-subtitle">
              Have questions about our products or services? We'd love to hear from you.
            </p>

            <div className="contact-info-card">
              <div className="card-header">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.7-5.3a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6A8.4 8.4 0 0112.3 3h.5A8.5 8.5 0 0121 11.3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="card-label">WhatsApp</span>
              </div>
              <div className="card-number">+91 98765 43210</div>
              <p className="card-desc">Quick responses, share images directly</p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="card-btn card-btn-whatsapp">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M13.6 2.3A7.4 7.4 0 002.1 12.1L1 15l3-1.1A7.4 7.4 0 0013.6 2.3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            <div className="contact-info-card">
              <div className="card-header">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014 2h3a2 2 0 012 1.7 12.8 12.8 0 00.7 2.8 2 2 0 01-.5 2.1L7.5 10.3a16 16 0 006.2 6.2l1.7-1.7a2 2 0 012.1-.5 12.8 12.8 0 002.8.7A2 2 0 0122 17z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="card-label">Toll-Free</span>
              </div>
              <div className="card-number">1-800-419-0570</div>
              <p className="card-desc">Available Mon–Sat, 9 AM – 7 PM IST</p>
              <a href="tel:18004190570" className="card-btn card-btn-phone">
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M14.7 11.3v2a1.3 1.3 0 01-1.4 1.3A13.2 13.2 0 017.5 12.5a13 13 0 01-4-4A13.2 13.2 0 011.4 2.7 1.3 1.3 0 012.7 1.3h2A1.3 1.3 0 016 2.5a8.5 8.5 0 00.5 1.9 1.3 1.3 0 01-.3 1.4l-.9.9a10.7 10.7 0 004.2 4.2l.9-.9a1.3 1.3 0 011.4-.3 8.5 8.5 0 001.9.5 1.3 1.3 0 011 1.1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Call Now (Toll-Free)
              </a>
            </div>

            <p className="contact-hours">
              Email support: 24-hour response time · WhatsApp: typically within 2 hours
            </p>
          </div>

          {/* Right — Form */}
          <div className="contact-form-wrap">
            {submitted && (
              <div className="alert alert-success" style={{ marginBottom: 'var(--space-5)' }}>
                <svg className="alert-icon" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Thank you! Your message has been sent. We'll get back to you within 24 hours.</span>
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div>
                <h2>Send us a message</h2>
                <p className="form-subtitle">Fill in the details below and we'll get back to you within 24 hours.</p>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input className={`input-field${fieldErrors.email ? ' error' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                {fieldErrors.email && <span className="input-hint error-text">{fieldErrors.email}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input className={`input-field${fieldErrors.name ? ' error' : ''}`} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                {fieldErrors.name && <span className="input-hint error-text">{fieldErrors.name}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number *</label>
                <div className="phone-input-row">
                  <div className="phone-code-wrap" ref={codeRef}>
                    <button
                      type="button"
                      className="phone-code-trigger"
                      onClick={() => setCodeOpen(!codeOpen)}
                      aria-expanded={codeOpen}
                    >
                      <span className="phone-code-flag">{countryCodes.find(c => c.code === countryCode)?.flag}</span>
                      <span>{countryCode}</span>
                      <svg className={`phone-code-chev${codeOpen ? ' open' : ''}`} viewBox="0 0 10 10" fill="none">
                        <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {codeOpen && (
                      <ul className="phone-code-dropdown">
                        {countryCodes.map(c => (
                          <li
                            key={c.code}
                            className={`phone-code-option${c.code === countryCode ? ' selected' : ''}`}
                            onClick={() => { setCountryCode(c.code); setCodeOpen(false) }}
                          >
                            <span className="phone-code-flag">{c.flag}</span>
                            <span className="phone-code-name">{c.name}</span>
                            <span className="phone-code-val">{c.code}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input className={`input-field phone-number${fieldErrors.phone ? ' error' : ''}`} type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="98765 43210" />
                </div>
                {fieldErrors.phone && <span className="input-hint error-text">{fieldErrors.phone}</span>}
                <span className="input-helper">Preferably your WhatsApp number</span>
              </div>

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
                <>
                  <div className="input-group">
                    <label className="input-label">Business / Studio Name</label>
                    <input className="input-field" type="text" name="studioName" value={form.studioName} onChange={handleChange} placeholder="Your studio or business name" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">City / Place</label>
                    <input className="input-field" type="text" name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
                  </div>
                </>
              )}

              <div className="input-group">
                <label className="input-label">Message *</label>
                <textarea className={`input-field${fieldErrors.message ? ' error' : ''}`} name="message" value={form.message} onChange={handleChange} rows="5" placeholder="Tell us how we can help you — whether it's about an order, a product question, or anything else." style={{ resize: 'vertical' }} />
                {fieldErrors.message && <span className="input-hint error-text">{fieldErrors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg contact-submit">
                Send Message
                <svg viewBox="0 0 16 16" fill="none" style={{ width: 16, height: 16 }}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
