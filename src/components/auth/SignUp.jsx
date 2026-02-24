import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/auth.css'

const SLIDES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: 'Create Your Account',
    desc: 'Share your basic details to get started',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'We Verify Your Business',
    desc: 'Our team reviews your ID & business proof',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    title: 'Start Using Canvera',
    desc: 'Access the full platform once verified',
  },
]

export default function SignUp() {
  const { authState, register, logout } = useAuth()

  // Clear auth on every mount so reload always starts fresh for testing
  useEffect(() => {
    logout()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Registration form state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessProof: '',
    idFile: null,
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null
    setForm(prev => ({ ...prev, idFile: file }))
    if (errors.idFile) setErrors(prev => ({ ...prev, idFile: '' }))
  }

  const handleFileRemove = () => {
    setForm(prev => ({ ...prev, idFile: null }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email'
    }
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required'
    } else if (!/^[\d\s+()-]{7,15}$/.test(form.phone.trim())) {
      errs.phone = 'Please enter a valid phone number'
    }
    if (form.idFile) {
      const allowed = ['image/jpeg', 'image/png', 'application/pdf']
      if (!allowed.includes(form.idFile.type)) {
        errs.idFile = 'Please upload a JPG, PNG, or PDF file'
      } else if (form.idFile.size > 5 * 1024 * 1024) {
        errs.idFile = 'File must be under 5 MB'
      }
    }
    if (!form.terms) errs.terms = 'Please accept the Terms & Conditions'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    register(
      form.fullName.trim(),
      form.email.trim(),
      form.phone.trim(),
      form.businessProof.trim(),
      form.idFile ? form.idFile.name : ''
    )
    setSubmitted(true)
  }

  return (
    <div className="auth-page join-page">
      <div className="join-layout">
        {/* ===== LEFT PANEL ===== */}
        <div className="join-left">
          <div className="join-left-inner">
            {/* Stacked playing cards showing the 3-step flow */}
            <div className="join-visual-card">
              <div className="join-card-stack">
                {SLIDES.map((slide, i) => (
                  <div key={i} className={`join-stack-card join-stack-card--${i}`}>
                    <span className="join-stack-card-num">{i + 1}</span>
                    <div className={`join-stack-card-icon join-stack-card-icon--${i}`}>{slide.icon}</div>
                    <div className="join-stack-card-text">
                      <h3 className="join-stack-card-title">{slide.title}</h3>
                      <p className="join-stack-card-desc">{slide.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact support — outside the card, brand-colored buttons */}
            <div className="join-contact">
              <span className="join-contact-title">Need help with verification?</span>
              <div className="join-contact-links">
                <a href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20with%20Canvera%20verification." target="_blank" rel="noopener noreferrer" className="join-contact-btn join-contact-btn--whatsapp">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
                <a href="tel:18004190570" className="join-contact-btn join-contact-btn--phone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>1-800-419-0570</span>
                </a>
                <a href="mailto:support@canvera.com?subject=Verification%20Help" className="join-contact-btn join-contact-btn--email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL ===== */}
        <div className="join-right">
          <div className="join-right-inner">
            {/* Form header — microcopy for step 1 */}
            {!submitted && (
              <div className="join-form-header">
                <h2 className="join-form-title">Join Canvera</h2>
                <p className="join-form-subtitle">
                  Create your photographer account — it only takes a minute.
                </p>
              </div>
            )}

            {/* Content area — form fields or confirmation message */}
            <div className="join-form-compact">
              {!submitted ? (
                <form id="join-form" className="auth-form" onSubmit={handleSubmit} noValidate>
                  <div className="input-group">
                    <label className="input-label">Full Name *</label>
                    <input
                      className={`input-field${errors.fullName ? ' error' : ''}`}
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                    {errors.fullName && <span className="input-hint error-text">{errors.fullName}</span>}
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
                    {errors.email && <span className="input-hint error-text">{errors.email}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Phone / WhatsApp *</label>
                    <input
                      className={`input-field${errors.phone ? ' error' : ''}`}
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <span className="input-hint error-text">{errors.phone}</span>}
                  </div>

                  <div className="input-group">
                    <label className="input-label">Business or Social Proof</label>
                    <input
                      className={`input-field${errors.businessProof ? ' error' : ''}`}
                      type="url"
                      name="businessProof"
                      value={form.businessProof}
                      onChange={handleChange}
                      placeholder="Instagram, website, or business URL"
                    />
                    <span className="input-hint">Your website, Instagram, or any link that helps us verify</span>
                  </div>

                  <div className="input-group">
                    <label className="input-label">ID Proof</label>
                    <div
                      className={`file-upload-zone${errors.idFile ? ' error' : ''}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                      onDrop={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        const file = e.dataTransfer.files[0]
                        if (file) setForm(prev => ({ ...prev, idFile: file }))
                      }}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                      {!form.idFile ? (
                        <>
                          <svg className="file-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          <span className="file-upload-text">
                            Drag & drop or <strong>browse</strong>
                          </span>
                          <span className="file-upload-hint">JPG, PNG, or PDF (max 5 MB)</span>
                        </>
                      ) : (
                        <div className="file-upload-preview">
                          <svg className="file-upload-file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="file-upload-filename">{form.idFile.name}</span>
                          <button type="button" className="file-upload-remove" onClick={(e) => { e.stopPropagation(); handleFileRemove() }}>
                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                              <path d="M4 4l8 8M12 4l-8 8" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="input-hint">Government or official ID for verification</span>
                    {errors.idFile && <span className="input-hint error-text">{errors.idFile}</span>}
                  </div>

                </form>
              ) : (
                <div className="join-pending-section">
                  <div className="join-confirmation join-confirmation--expanded">
                    <div className="join-confirmation-hero">
                      <svg className="join-confirmation-hero-icon" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2.5"/>
                        <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    <h2 className="join-confirmation-headline">You're All Set!</h2>
                    <p className="join-confirmation-subtext">
                      We've received your details and our team is reviewing your profile.
                      You'll hear from us on WhatsApp and email within 24 hours.
                    </p>

                    <div className="join-confirmation-steps">
                      <h4 className="join-confirmation-steps-title">What happens next?</h4>
                      <ul className="join-confirmation-steps-list">
                        <li>
                          <span className="join-confirmation-step-num">1</span>
                          <span>Our team reviews your submitted details</span>
                        </li>
                        <li>
                          <span className="join-confirmation-step-num">2</span>
                          <span>You'll receive a confirmation on WhatsApp &amp; email</span>
                        </li>
                        <li>
                          <span className="join-confirmation-step-num">3</span>
                          <span>Access premium products once verified</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Button + footer — pinned to bottom, consistent position */}
            <div className="join-bottom-area">
              {!submitted ? (
                <>
                  <div className="join-terms-row">
                    <div className="terms-check">
                      <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} id="join-terms" />
                      <label htmlFor="join-terms">
                        I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.terms && <span className="input-hint error-text">{errors.terms}</span>}
                  </div>
                  <button type="submit" form="join-form" className="btn btn-primary btn-lg auth-submit">
                    Join Now — It's Free
                  </button>
                </>
              ) : (
                <Link to="/products" className="btn btn-accent btn-lg auth-submit">
                  Explore Premium Products &rarr;
                </Link>
              )}
              <div className="auth-footer" style={submitted ? { visibility: 'hidden' } : undefined}>
                Already have an account? <Link to="/login">Sign in</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
