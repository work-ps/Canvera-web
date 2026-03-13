import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/auth.css'


export default function SignIn() {
  const { authState, login, isRegistered, isVerified } = useAuth()
  const navigate = useNavigate()
  const [loginMethod, setLoginMethod] = useState('password')
  const [form, setForm] = useState({
    identity: '', password: '', otp: '', rememberMe: false,
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const timerRef = useRef(null)

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      timerRef.current = setInterval(() => {
        setOtpCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [otpCountdown])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const switchMethod = useCallback((method) => {
    if (method === loginMethod) return
    setLoginMethod(method)
    setOtpSent(false)
    setOtpCountdown(0)
    clearInterval(timerRef.current)
    setForm(prev => ({ ...prev, password: '', otp: '' }))
    setFieldErrors({})
  }, [loginMethod])

  const handleSendOtp = () => {
    if (!form.identity.trim()) {
      setFieldErrors({ identity: 'Please enter your email or phone number first' })
      return
    }
    setFieldErrors({})
    setOtpSent(true)
    setOtpCountdown(30)
  }

  const handleResendOtp = () => {
    setOtpCountdown(30)
  }

  // Redirect if already logged in
  useEffect(() => {
    if (isRegistered) {
      navigate(isVerified ? '/dashboard' : '/', { replace: true })
    }
  }, [isRegistered, isVerified, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = {}

    if (!form.identity.trim()) {
      errors.identity = 'Email or phone number is required'
    }

    if (loginMethod === 'password') {
      if (!form.password) {
        errors.password = 'Password is required'
      }
    }

    if (loginMethod === 'otp') {
      if (!otpSent) {
        errors.identity = errors.identity || 'Please send an OTP first'
      } else if (!form.otp || form.otp.length < 6) {
        errors.otp = 'Please enter the 6-digit OTP'
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})

    // Authenticate against dummy users (password mode uses real check, OTP mode auto-succeeds)
    const password = loginMethod === 'password' ? form.password : 'password123'
    const result = login(form.identity.trim(), password)

    if (!result.success) {
      setFieldErrors({ identity: result.error })
      return
    }

    setSubmitted(true)
    setTimeout(() => {
      navigate(result.user.status === 'verified' ? '/dashboard' : '/')
    }, 1200)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Canvera account</p>

        {submitted && (
          <div className="alert alert-success" style={{ marginBottom: 'var(--space-5)' }}>
            <svg className="alert-icon" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Signed in successfully! Redirecting...</span>
          </div>
        )}

        {/* Verification pending notice for registered but unverified users */}
        {authState?.status === 'registered' && (
          <div className="alert alert-info" style={{ marginBottom: 'var(--space-5)', background: 'var(--petrol-25, #f0f7fa)', border: '1px solid var(--petrol-100, #d0e8f0)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--petrol-700, #005780)' }}>
            <svg style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1 }} viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="12.5" r="0.75" fill="currentColor"/>
            </svg>
            <span>
              Your account is under verification. You'll get full access once verified.{' '}
              <Link to="/register" style={{ fontWeight: 600, textDecoration: 'underline' }}>Check status or provide details</Link>
            </span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label className="input-label">Email or Phone Number *</label>
            <input
              className={`input-field${fieldErrors.identity ? ' error' : ''}`}
              type="text"
              name="identity"
              value={form.identity}
              onChange={handleChange}
              placeholder="you@example.com or 98765 43210"
            />
            {fieldErrors.identity && <span className="input-hint error-text">{fieldErrors.identity}</span>}
          </div>

          {/* Method tabs */}
          <div className="auth-method-tabs">
            <button
              type="button"
              className={`auth-method-tab${loginMethod === 'password' ? ' active' : ''}`}
              onClick={() => switchMethod('password')}
            >
              Password
            </button>
            <button
              type="button"
              className={`auth-method-tab${loginMethod === 'otp' ? ' active' : ''}`}
              onClick={() => switchMethod('otp')}
            >
              Login with OTP
            </button>
          </div>

          {/* Password mode */}
          {loginMethod === 'password' && (
            <div className="input-group">
              <label className="input-label">Password *</label>
              <input
                className={`input-field${fieldErrors.password ? ' error' : ''}`}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {fieldErrors.password && <span className="input-hint error-text">{fieldErrors.password}</span>}
            </div>
          )}

          {/* OTP mode */}
          {loginMethod === 'otp' && (
            <>
              {!otpSent ? (
                <button
                  type="button"
                  className="btn btn-outline btn-md auth-send-otp"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              ) : (
                <div className="auth-otp-section">
                  <div className="input-group">
                    <label className="input-label">Enter OTP *</label>
                    <input
                      className={`input-field${fieldErrors.otp ? ' error' : ''}`}
                      type="text"
                      name="otp"
                      value={form.otp}
                      onChange={handleChange}
                      maxLength="6"
                      placeholder="6-digit OTP"
                      inputMode="numeric"
                    />
                    {fieldErrors.otp && <span className="input-hint error-text">{fieldErrors.otp}</span>}
                  </div>
                  <div className="auth-otp-resend">
                    {otpCountdown > 0 ? (
                      <span className="auth-otp-timer">Resend OTP in {otpCountdown}s</span>
                    ) : (
                      <button
                        type="button"
                        className="auth-otp-resend-btn"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="auth-options">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                style={{ accentColor: 'var(--petrol-600)' }}
              />
              {' '}Remember me
            </label>
            {loginMethod === 'password' && (
              <a href="#">Forgot Password?</a>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          New to Canvera? <Link to="/register">Join for Free</Link>
        </div>
      </div>
    </div>
  )
}
