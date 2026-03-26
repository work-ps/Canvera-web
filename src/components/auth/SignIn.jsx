import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CanveraLogo from '../common/CanveraLogo'
import '../../styles/auth.css'


export default function SignIn() {
  const { authState, login, isRegistered, isVerified } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || null

  const [loginMethod, setLoginMethod] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ identity: '', password: '' })
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const timerRef = useRef(null)
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

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

  // Redirect if already logged in
  useEffect(() => {
    if (isRegistered) {
      navigate(redirectTo || (isVerified ? '/profile' : '/'), { replace: true })
    }
  }, [isRegistered, isVerified, navigate, redirectTo])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    if (name === 'identity' && !value.trim()) {
      setFieldErrors(prev => ({ ...prev, identity: 'Email or phone number is required' }))
    }
    if (name === 'password' && loginMethod === 'password' && !value) {
      setFieldErrors(prev => ({ ...prev, password: 'Password is required' }))
    }
  }

  const switchMethod = useCallback((method) => {
    if (method === loginMethod) return
    setLoginMethod(method)
    setOtpSent(false)
    setOtpCountdown(0)
    setOtpDigits(['', '', '', ''])
    clearInterval(timerRef.current)
    setForm(prev => ({ ...prev, password: '' }))
    setFieldErrors({})
  }, [loginMethod])

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...otpDigits]
    newDigits[index] = value.slice(-1)
    setOtpDigits(newDigits)
    if (fieldErrors.otp) setFieldErrors(prev => ({ ...prev, otp: '' }))

    // Auto-focus next
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs[index - 1].current?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (paste.length > 0) {
      const newDigits = [...otpDigits]
      for (let i = 0; i < 4; i++) {
        newDigits[i] = paste[i] || ''
      }
      setOtpDigits(newDigits)
      const focusIdx = Math.min(paste.length, 3)
      otpRefs[focusIdx].current?.focus()
    }
  }

  const handleSendOtp = () => {
    if (!form.identity.trim()) {
      setFieldErrors({ identity: 'Please enter your phone number first' })
      return
    }
    setFieldErrors({})
    setOtpSent(true)
    setOtpCountdown(30)
    setTimeout(() => otpRefs[0].current?.focus(), 100)
  }

  const handleResendOtp = () => {
    setOtpDigits(['', '', '', ''])
    setOtpCountdown(30)
    setTimeout(() => otpRefs[0].current?.focus(), 100)
  }

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

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
      } else {
        const otpValue = otpDigits.join('')
        if (otpValue.length < 4) {
          errors.otp = 'Please enter the 4-digit OTP'
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const password = loginMethod === 'password' ? form.password : 'password123'
      const result = login(form.identity.trim(), password)

      if (!result.success) {
        setFieldErrors({ identity: result.error })
        setLoading(false)
        return
      }

      setSubmitted(true)
      setLoading(false)
      setTimeout(() => {
        navigate(redirectTo || (result.user.status === 'verified' ? '/profile' : '/'))
      }, 1000)
    }, 800)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <CanveraLogo height={28} />
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        {submitted && (
          <div className="auth-alert auth-alert--success">
            <svg viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Signed in successfully! Redirecting...</span>
          </div>
        )}

        {authState?.status === 'registered' && !submitted && (
          <div className="auth-alert auth-alert--info">
            <svg viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="12.5" r="0.75" fill="currentColor"/>
            </svg>
            <span>
              Your account is under verification. You'll get full access once verified.{' '}
              <Link to="/signup">Check status</Link>
            </span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Email / Phone */}
          <div className="input-group">
            <label className="input-label" htmlFor="signin-identity">Email or Phone</label>
            <input
              id="signin-identity"
              className={`input-field${fieldErrors.identity ? ' error' : ''}`}
              type="text"
              name="identity"
              value={form.identity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email or phone number"
              autoComplete="username"
            />
            {fieldErrors.identity && <span className="input-hint error-text">{fieldErrors.identity}</span>}
          </div>

          {/* PASSWORD MODE */}
          {loginMethod === 'password' && (
            <>
              <div className="input-group">
                <label className="input-label" htmlFor="signin-password">Password</label>
                <div className="input-password-wrap">
                  <input
                    id="signin-password"
                    className={`input-field${fieldErrors.password ? ' error' : ''}`}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                {fieldErrors.password && <span className="input-hint error-text">{fieldErrors.password}</span>}
              </div>

              <div className="auth-forgot-row">
                <a href="#" className="auth-forgot-link">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="btn btn-ghost auth-otp-toggle"
                onClick={() => switchMethod('otp')}
              >
                Sign in with OTP &rarr;
              </button>
            </>
          )}

          {/* OTP MODE */}
          {loginMethod === 'otp' && (
            <>
              {!otpSent ? (
                <button
                  type="button"
                  className="btn btn-primary auth-submit"
                  onClick={handleSendOtp}
                >
                  Send OTP
                </button>
              ) : (
                <div className="auth-otp-section">
                  <label className="input-label">Enter OTP</label>
                  <div className="auth-otp-boxes" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        className={`auth-otp-digit${fieldErrors.otp ? ' error' : ''}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>
                  {fieldErrors.otp && <span className="input-hint error-text" style={{ textAlign: 'center' }}>{fieldErrors.otp}</span>}
                  <div className="auth-otp-resend">
                    {otpCountdown > 0 ? (
                      <span className="auth-otp-timer">Resend in {formatCountdown(otpCountdown)}</span>
                    ) : (
                      <button type="button" className="auth-otp-resend-btn" onClick={handleResendOtp}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {otpSent && (
                <button
                  type="submit"
                  className="btn btn-primary auth-submit"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              )}

              <div className="auth-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="btn btn-ghost auth-otp-toggle"
                onClick={() => switchMethod('password')}
              >
                Sign in with Password &rarr;
              </button>
            </>
          )}
        </form>

        <div className="auth-footer">
          New to Canvera?{' '}
          <Link to="/signup" className="auth-footer-link">Create an account</Link>
        </div>
      </div>
    </div>
  )
}
