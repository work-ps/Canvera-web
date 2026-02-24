import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/auth.css'

const CANVERA_LOGO = 'data:image/jpeg;base64,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'

export default function SignUp() {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '',
    studioName: '', city: '', specialization: '', terms: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = {}

    if (!form.fullName.trim()) {
      errors.fullName = 'Full name is required'
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!form.password) {
      errors.password = 'Password is required'
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    if (!form.studioName.trim()) {
      errors.studioName = 'Studio name is required'
    }

    if (!form.terms) {
      errors.terms = 'Please accept the Terms & Conditions'
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
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 520 }}>
        <div className="auth-logo">
          <img src={CANVERA_LOGO} alt="Canvera" />
        </div>
        <h1>Create Your Account</h1>
        <p className="auth-subtitle">Join 75,000+ photographers on Canvera</p>

        {submitted && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--space-5)' }}>
            <svg className="alert-icon" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Account created successfully! Welcome to Canvera.</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form-row">
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input className={`input-field${fieldErrors.fullName ? ' error' : ''}`} type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Your full name" />
              {fieldErrors.fullName && <span className="input-hint error-text">{fieldErrors.fullName}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">Email *</label>
              <input className={`input-field${fieldErrors.email ? ' error' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              {fieldErrors.email && <span className="input-hint error-text">{fieldErrors.email}</span>}
            </div>
          </div>

          <div className="auth-form-row">
            <div className="input-group">
              <label className="input-label">Phone</label>
              <input className="input-field" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
            </div>
            <div className="input-group">
              <label className="input-label">Password *</label>
              <input className={`input-field${fieldErrors.password ? ' error' : ''}`} type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" />
              {fieldErrors.password && <span className="input-hint error-text">{fieldErrors.password}</span>}
            </div>
          </div>

          <div className="auth-form-row">
            <div className="input-group">
              <label className="input-label">Studio Name *</label>
              <input className={`input-field${fieldErrors.studioName ? ' error' : ''}`} type="text" name="studioName" value={form.studioName} onChange={handleChange} placeholder="Your studio name" />
              {fieldErrors.studioName && <span className="input-hint error-text">{fieldErrors.studioName}</span>}
            </div>
            <div className="input-group">
              <label className="input-label">City</label>
              <input className="input-field" type="text" name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Specialization</label>
            <select className="input-field" name="specialization" value={form.specialization} onChange={handleChange}>
              <option value="">Select your specialization</option>
              <option value="wedding">Wedding Photography</option>
              <option value="portrait">Portrait Photography</option>
              <option value="commercial">Commercial Photography</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <div className="terms-check">
              <input type="checkbox" name="terms" checked={form.terms} onChange={handleChange} id="terms" />
              <label htmlFor="terms">
                I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
              </label>
            </div>
            {fieldErrors.terms && <span className="input-hint error-text">{fieldErrors.terms}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
