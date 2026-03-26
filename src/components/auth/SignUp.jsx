import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CanveraLogo from '../common/CanveraLogo'
import '../../styles/auth.css'


/* Password strength levels */
function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  const levels = [
    { level: 1, label: 'Weak', color: 'error' },
    { level: 2, label: 'Fair', color: 'warning' },
    { level: 3, label: 'Good', color: 'teal' },
    { level: 4, label: 'Strong', color: 'success' },
  ]
  return levels[Math.min(score, 4) - 1] || { level: 0, label: '', color: '' }
}


export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    isPhotographer: false,
    studioName: '',
    city: '',
    instagram: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [businessProofFile, setBusinessProofFile] = useState(null)
  const [govIdFile, setGovIdFile] = useState(null)

  const businessProofRef = useRef(null)
  const govIdRef = useRef(null)

  const passwordStrength = getPasswordStrength(form.password)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const errs = { ...errors }

    switch (name) {
      case 'fullName':
        if (!value.trim()) errs.fullName = 'Full name is required'
        else delete errs.fullName
        break
      case 'email':
        if (!value.trim()) errs.email = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errs.email = 'Please enter a valid email'
        else delete errs.email
        break
      case 'phone':
        if (!value.trim()) errs.phone = 'Phone number is required'
        else if (!/^[\d\s+()-]{7,15}$/.test(value.trim())) errs.phone = 'Please enter a valid phone number'
        else delete errs.phone
        break
      case 'password':
        if (!value) errs.password = 'Password is required'
        else if (value.length < 8) errs.password = 'Password must be at least 8 characters'
        else delete errs.password
        break
      default:
        break
    }
    setErrors(errs)
  }

  const validateStep1 = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    else if (!/^[\d\s+()-]{7,15}$/.test(form.phone.trim())) errs.phone = 'Please enter a valid phone number'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }

  const handleStep1Submit = (e) => {
    e.preventDefault()
    const errs = validateStep1()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    if (form.isPhotographer) {
      setStep(2)
    } else {
      doRegister()
    }
  }

  const handleStep2Submit = (e) => {
    e.preventDefault()
    doRegister()
  }

  const doRegister = () => {
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

  const handleSkipStep2 = () => {
    doRegister()
  }

  // Auto-redirect after success
  useEffect(() => {
    if (submitted) {
      const target = form.isPhotographer ? '/profile' : '/'
      const timer = setTimeout(() => navigate(target), 3000)
      return () => clearTimeout(timer)
    }
  }, [submitted, navigate, form.isPhotographer])

  const handleFileSelect = (type) => {
    if (type === 'business') businessProofRef.current?.click()
    else govIdRef.current?.click()
  }

  const handleFileChange = (type, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (type === 'business') setBusinessProofFile(file)
    else setGovIdFile(file)
  }

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-card--success">
          <div className="auth-success-icon">
            <svg viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2.5"/>
              <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="auth-title">Welcome to Canvera!</h1>
          <p className="auth-subtitle">
            {form.isPhotographer
              ? 'Your account is pending verification. We\'ll review your details shortly.'
              : 'Your account has been created. Start exploring our premium products.'}
          </p>
          <Link to={form.isPhotographer ? '/profile' : '/'} className="btn btn-primary auth-submit">
            {form.isPhotographer ? 'Go to Profile' : 'Start Exploring'} &rarr;
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page signup-page">
      <div className="signup-layout">
        {/* LEFT — Form */}
        <div className="signup-form-panel">
          <div className="signup-form-inner">
            <Link to="/" className="signup-logo-link">
              <CanveraLogo height={28} />
            </Link>

            <div className="signup-form-header">
              <h1 className="auth-title" style={{ textAlign: 'left' }}>Create your account</h1>
              <p className="signup-subtitle">Join India's leading photobook platform</p>
            </div>

            {step === 1 && (
              <form className="auth-form" onSubmit={handleStep1Submit} noValidate>
                <div className="input-group">
                  <label className="input-label" htmlFor="signup-name">Full name</label>
                  <input
                    id="signup-name"
                    className={`input-field${errors.fullName ? ' error' : ''}`}
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                  {errors.fullName && <span className="input-hint error-text">{errors.fullName}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    className={`input-field${errors.email ? ' error' : ''}`}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="input-hint error-text">{errors.email}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="signup-phone">Phone number</label>
                  <input
                    id="signup-phone"
                    className={`input-field${errors.phone ? ' error' : ''}`}
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                  />
                  {errors.phone && <span className="input-hint error-text">{errors.phone}</span>}
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="signup-password">Password</label>
                  <div className="input-password-wrap">
                    <input
                      id="signup-password"
                      className={`input-field${errors.password ? ' error' : ''}`}
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
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
                  {form.password && (
                    <div className="password-strength">
                      <div className="password-strength-bar">
                        {[1, 2, 3, 4].map(level => (
                          <div
                            key={level}
                            className={`password-strength-segment${passwordStrength.level >= level ? ` active ${passwordStrength.color}` : ''}`}
                          />
                        ))}
                      </div>
                      {passwordStrength.label && (
                        <span className={`password-strength-label ${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <label className="auth-checkbox">
                  <input
                    type="checkbox"
                    name="isPhotographer"
                    checked={form.isPhotographer}
                    onChange={handleChange}
                  />
                  <span className="auth-checkbox-label">I am a professional photographer</span>
                </label>

                <button type="submit" className="btn btn-primary auth-submit">
                  {form.isPhotographer ? 'Continue' : 'Create Account'}{' '}
                  {form.isPhotographer && <span>&rarr;</span>}
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="auth-form" onSubmit={handleStep2Submit} noValidate>
                <div className="signup-step-header">
                  <button type="button" className="signup-back-btn" onClick={() => setStep(1)}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 3L5 8l5 5"/>
                    </svg>
                  </button>
                  <span className="signup-step-label">Step 2 of 2 &mdash; Photographer Details</span>
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="signup-studio">Studio name</label>
                  <input
                    id="signup-studio"
                    className="input-field"
                    type="text"
                    name="studioName"
                    value={form.studioName}
                    onChange={handleChange}
                    placeholder="e.g. Pixel Studio Photography"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="signup-city">City</label>
                  <input
                    id="signup-city"
                    className="input-field"
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="signup-instagram">Instagram / Portfolio link</label>
                  <input
                    id="signup-instagram"
                    className="input-field"
                    type="url"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourstudio"
                  />
                </div>

                {/* Upload zones */}
                <div className="signup-uploads">
                  <div className="input-group">
                    <label className="input-label">Business Proof</label>
                    <div
                      className="file-upload-zone"
                      onClick={() => handleFileSelect('business')}
                    >
                      <input
                        ref={businessProofRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange('business', e)}
                      />
                      {businessProofFile ? (
                        <div className="file-upload-preview">
                          <svg className="file-upload-file-icon" viewBox="0 0 20 20" fill="none">
                            <path d="M11 1H5a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V7l-6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="file-upload-filename">{businessProofFile.name}</span>
                          <button
                            type="button"
                            className="file-upload-remove"
                            onClick={(e) => { e.stopPropagation(); setBusinessProofFile(null) }}
                          >
                            <svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="file-upload-icon" viewBox="0 0 20 20" fill="none">
                            <path d="M10 14V6m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="file-upload-text"><strong>Upload</strong> or drag and drop</span>
                          <span className="file-upload-hint">PDF, JPG, PNG up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Government ID</label>
                    <div
                      className="file-upload-zone"
                      onClick={() => handleFileSelect('govId')}
                    >
                      <input
                        ref={govIdRef}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileChange('govId', e)}
                      />
                      {govIdFile ? (
                        <div className="file-upload-preview">
                          <svg className="file-upload-file-icon" viewBox="0 0 20 20" fill="none">
                            <path d="M11 1H5a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V7l-6-6z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="file-upload-filename">{govIdFile.name}</span>
                          <button
                            type="button"
                            className="file-upload-remove"
                            onClick={(e) => { e.stopPropagation(); setGovIdFile(null) }}
                          >
                            <svg viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="file-upload-icon" viewBox="0 0 20 20" fill="none">
                            <path d="M10 14V6m0 0l-3 3m3-3l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="file-upload-text"><strong>Upload</strong> or drag and drop</span>
                          <span className="file-upload-hint">PDF, JPG, PNG up to 5MB</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary auth-submit">
                  Submit for Verification
                </button>

                <button
                  type="button"
                  className="btn btn-ghost auth-skip-link"
                  onClick={handleSkipStep2}
                >
                  I'll complete this later &rarr;
                </button>
              </form>
            )}

            <div className="auth-footer" style={{ textAlign: 'left' }}>
              Already have an account?{' '}
              <Link to="/login" className="auth-footer-link">Sign in</Link>
            </div>
          </div>
        </div>

        {/* RIGHT — Image panel */}
        <div className="signup-image-panel">
          <img
            src="/images/products/premium-mesmera/1.jpg"
            alt="Premium Canvera Album"
            className="signup-image"
          />
          <div className="signup-image-overlay">
            <span className="signup-image-trust">Trusted by 91,000+ photographers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
