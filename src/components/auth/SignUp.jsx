import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
    title: 'Set Up Your Profile',
    desc: 'Tell us about yourself and your business',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4L12 14.01l-3-3" />
      </svg>
    ),
    title: 'Start Using Canvera',
    desc: 'Access the full platform and start ordering',
  },
]

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isPhotographer: false,
    studioName: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleTogglePhotographer = () => {
    setForm(prev => ({
      ...prev,
      isPhotographer: !prev.isPhotographer,
      studioName: !prev.isPhotographer ? prev.studioName : '',
    }))
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

    if (!form.password) {
      errs.password = 'Password is required'
    } else if (form.password.length < 8) {
      errs.password = 'Password must be at least 8 characters'
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
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
      {
        password: form.password,
        isPhotographer: form.isPhotographer,
        studioName: form.studioName.trim(),
      }
    )
    setSubmitted(true)
  }

  // Auto-redirect after success
  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => navigate('/'), 4000)
      return () => clearTimeout(timer)
    }
  }, [submitted, navigate])

  return (
    <div className="auth-page join-page">
      <div className="join-layout">
        {/* ===== LEFT PANEL ===== */}
        <div className="join-left">
          <div className="join-left-inner">
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

            <div className="join-contact">
              <span className="join-contact-title">Need help signing up?</span>
              <div className="join-contact-links">
                <a href="https://wa.me/919876543210?text=Hi%2C%20I%20need%20help%20signing%20up%20on%20Canvera." target="_blank" rel="noopener noreferrer" className="join-contact-btn join-contact-btn--whatsapp">
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
                <a href="mailto:support@canvera.com?subject=Signup%20Help" className="join-contact-btn join-contact-btn--email">
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
            {!submitted && (
              <div className="join-form-header">
                <h2 className="join-form-title">Create Your Account</h2>
                <p className="join-form-subtitle">
                  Sign up to start ordering premium albums and products.
                </p>
              </div>
            )}

            <div className="join-form-compact">
              {!submitted ? (
                <form id="join-form" className="auth-form" onSubmit={handleSubmit} noValidate>
                  {/* 1. Full Name */}
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
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

                  {/* 2. Email */}
                  <div className="input-group">
                    <label className="input-label">Email</label>
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

                  {/* 3. Phone Number */}
                  <div className="input-group">
                    <label className="input-label">Phone Number</label>
                    <input
                      className={`input-field${errors.phone ? ' error' : ''}`}
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                    <span className="input-hint">WhatsApp preferred</span>
                    {errors.phone && <span className="input-hint error-text">{errors.phone}</span>}
                  </div>

                  {/* 4. Create Password */}
                  <div className="input-group">
                    <label className="input-label">Create Password</label>
                    <div className="input-password-wrap">
                      <input
                        className={`input-field${errors.password ? ' error' : ''}`}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                      />
                      <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 2.5l15 15"/>
                            <path d="M8.8 8.8a1.7 1.7 0 0 0 2.4 2.4"/>
                            <path d="M4.2 4.2C2.7 5.5 1.5 7.3 1 10c1.2 5.5 5 8 9 8 1.8 0 3.4-.5 4.8-1.4"/>
                            <path d="M17 14.2c1-1.2 1.8-2.7 2-4.2-1.2-5.5-5-8-9-8-.6 0-1.2.1-1.8.2"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z"/>
                            <circle cx="10" cy="10" r="2.5"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <span className="input-hint error-text">{errors.password}</span>}
                  </div>

                  {/* 5. Confirm Password */}
                  <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <div className="input-password-wrap">
                      <input
                        className={`input-field${errors.confirmPassword ? ' error' : ''}`}
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                      />
                      <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2.5 2.5l15 15"/>
                            <path d="M8.8 8.8a1.7 1.7 0 0 0 2.4 2.4"/>
                            <path d="M4.2 4.2C2.7 5.5 1.5 7.3 1 10c1.2 5.5 5 8 9 8 1.8 0 3.4-.5 4.8-1.4"/>
                            <path d="M17 14.2c1-1.2 1.8-2.7 2-4.2-1.2-5.5-5-8-9-8-.6 0-1.2.1-1.8.2"/>
                          </svg>
                        ) : (
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z"/>
                            <circle cx="10" cy="10" r="2.5"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="input-hint error-text">{errors.confirmPassword}</span>}
                  </div>

                  {/* 6. Photographer toggle */}
                  <div className="auth-toggle-row">
                    <span className="auth-toggle-label">I am a professional photographer</span>
                    <button
                      type="button"
                      className={`auth-toggle${form.isPhotographer ? ' active' : ''}`}
                      onClick={handleTogglePhotographer}
                      role="switch"
                      aria-checked={form.isPhotographer}
                    >
                      <span className="auth-toggle-thumb" />
                    </button>
                  </div>

                  {/* 7. Studio name (conditional) */}
                  {form.isPhotographer && (
                    <div className="input-group">
                      <label className="input-label">Business / Studio Name <span className="input-optional">(Optional)</span></label>
                      <input
                        className="input-field"
                        type="text"
                        name="studioName"
                        value={form.studioName}
                        onChange={handleChange}
                        placeholder="e.g. Pixel Studio Photography"
                      />
                    </div>
                  )}
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

                    <h2 className="join-confirmation-headline">Welcome to Canvera!</h2>
                    <p className="join-confirmation-subtext">
                      Your account has been created successfully. You can now sign in and start exploring our products.
                    </p>

                    <div className="join-confirmation-steps">
                      <h4 className="join-confirmation-steps-title">What happens next?</h4>
                      <ul className="join-confirmation-steps-list">
                        <li>
                          <span className="join-confirmation-step-num">1</span>
                          <span>Browse our catalog and find what you love</span>
                        </li>
                        <li>
                          <span className="join-confirmation-step-num">2</span>
                          <span>Customize and order your products</span>
                        </li>
                        <li>
                          <span className="join-confirmation-step-num">3</span>
                          <span>Get premium albums delivered to your doorstep</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom area — terms, submit, sign in link */}
            <div className="join-bottom-area">
              {!submitted ? (
                <>
                  {/* 8. Terms checkbox */}
                  <div className="join-terms-row">
                    <div className="terms-check">
                      <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} id="join-terms" />
                      <label htmlFor="join-terms">
                        I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                      </label>
                    </div>
                    {errors.terms && <span className="input-hint error-text">{errors.terms}</span>}
                  </div>

                  {/* 9. Sign Up button */}
                  <button type="submit" form="join-form" className="btn btn-primary btn-lg auth-submit">
                    Sign Up
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary btn-lg auth-submit">
                  Sign In to Your Account &rarr;
                </Link>
              )}

              {/* 10. Sign in option */}
              <div className="auth-footer" style={submitted ? { visibility: 'hidden' } : undefined}>
                Already have an account? <Link to="/login">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
