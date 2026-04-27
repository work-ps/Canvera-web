import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../data/dummyUsers';
import './LoginPage.css';

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [mode, setMode]         = useState('password'); // 'password' | 'otp'
  const [otpSent, setOtpSent]   = useState(false);
  const [identifier, setId]     = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp]           = useState('');
  const [error, setError]       = useState('');

  const switchMode = (next) => { setMode(next); setError(''); setOtpSent(false); setOtp(''); };

  const doLogin = (user) => {
    login(user);
    navigate(decodeURIComponent(redirectTo), { replace: true });
  };

  const userFromId = () => {
    const id = identifier.toLowerCase().trim();
    const name = id.includes('@')
      ? id.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      : `User ${id.slice(-4)}`;
    return { id: `u_${Date.now()}`, email: id, name, status: 'registered' };
  };

  const handlePassword = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return setError('Please enter your email or phone number.');
    if (!password)          return setError('Please enter your password.');

    // Check if identifier matches any demo user email
    const normalizedId = identifier.toLowerCase().trim();
    const demoUser = Object.values(DEMO_USERS).find(u => u.email.toLowerCase() === normalizedId);

    if (demoUser) {
      // Validate demo user password
      if (password !== demoUser.password) {
        return setError('Invalid password. Please try again.');
      }
      // Login with demo user (exclude password from stored user object)
      const { password: _, ...userWithoutPassword } = demoUser;
      setError('');
      doLogin(userWithoutPassword);
    } else {
      // Create new user for non-demo credentials
      setError('');
      doLogin(userFromId());
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return setError('Please enter your email or phone number.');
    setError('');
    setOtpSent(true);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp.trim().length < 4) return setError('Please enter the OTP.');
    setError('');
    doLogin(userFromId());
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__sub">Sign in to your account</p>

        {/* ── Password form ─────────────────────────────── */}
        {mode === 'password' && (
          <form className="auth-form" onSubmit={handlePassword} noValidate>
            {error && <p className="auth-error">{error}</p>}
            <div className="auth-field">
              <label className="auth-label" htmlFor="l-id">Email or Phone</label>
              <input id="l-id" type="text" className="auth-input" placeholder="Email or phone number"
                value={identifier} onChange={e => setId(e.target.value)} autoComplete="username" autoFocus />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="l-pw">Password</label>
              <div className="auth-input-wrap">
                <input id="l-pw" type={showPass ? 'text' : 'password'} className="auth-input"
                  placeholder="Enter your password" value={password}
                  onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                <button type="button" className="auth-eye" onClick={() => setShowPass(v => !v)}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
              <button type="button" className="auth-forgot">Forgot password?</button>
            </div>
            <button type="submit" className="auth-btn">SIGN IN</button>
          </form>
        )}

        {/* ── OTP: request ──────────────────────────────── */}
        {mode === 'otp' && !otpSent && (
          <form className="auth-form" onSubmit={handleSendOTP} noValidate>
            {error && <p className="auth-error">{error}</p>}
            <div className="auth-field">
              <label className="auth-label" htmlFor="l-otp-id">Email or Phone</label>
              <input id="l-otp-id" type="text" className="auth-input" placeholder="Email or phone number"
                value={identifier} onChange={e => setId(e.target.value)} autoComplete="username" autoFocus />
            </div>
            <button type="submit" className="auth-btn">SEND OTP</button>
          </form>
        )}

        {/* ── OTP: verify ───────────────────────────────── */}
        {mode === 'otp' && otpSent && (
          <form className="auth-form" onSubmit={handleVerifyOTP} noValidate>
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-otp-notice">OTP sent to <strong>{identifier}</strong></p>
            <div className="auth-field">
              <label className="auth-label" htmlFor="l-otp">Enter OTP</label>
              <input id="l-otp" type="text" inputMode="numeric" className="auth-input auth-input--otp"
                placeholder="· · · · · ·" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} autoFocus />
            </div>
            <button type="submit" className="auth-btn">VERIFY OTP</button>
            <button type="button" className="auth-resend" onClick={() => setOtpSent(false)}>Resend OTP</button>
          </form>
        )}

        <div className="auth-or"><span>OR</span></div>

        {mode === 'password'
          ? <button className="auth-mode-toggle" onClick={() => switchMode('otp')}>Sign in with OTP →</button>
          : <button className="auth-mode-toggle" onClick={() => switchMode('password')}>Sign in with Password →</button>
        }

        <p className="auth-switch">
          New to Canvera?{' '}
          <Link to="/signup" className="auth-switch__link">Create an account</Link>
        </p>

        {import.meta.env.DEV && (
          <div className="auth-demo">
            <p className="auth-demo__label">Demo quick-access</p>
            <div className="auth-demo__row">
              <button className="auth-demo__btn" onClick={() => doLogin(DEMO_USERS.nonPhotographer)}>Customer</button>
              <button className="auth-demo__btn" onClick={() => doLogin(DEMO_USERS.registered)}>Photographer</button>
              <button className="auth-demo__btn auth-demo__btn--verified" onClick={() => doLogin(DEMO_USERS.verified)}>✓ Verified</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
