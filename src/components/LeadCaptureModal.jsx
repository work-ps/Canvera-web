/**
 * LeadCaptureModal — pre-login lead capture popup
 *
 * Triggers: whichever fires first —
 *   • 10 s page dwell time
 *   • 45% scroll depth
 *
 * Show conditions (ALL must pass):
 *   • User is NOT logged in
 *   • localStorage.canvera_lead_captured !== 'true'  (permanent — never show again after submit)
 *   • sessionStorage.canvera_lead_seen !== 'true'    (per-session — don't re-show on same tab)
 *
 * On submit: marks both flags, shows success state.
 * On dismiss: marks sessionStorage flag only.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LeadCaptureModal.css';

const LS_CAPTURED  = 'canvera_lead_captured';
const SS_SEEN      = 'canvera_lead_seen';
const DWELL_MS     = 10_000;
const SCROLL_DEPTH = 0.45;

const PERKS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
    text: 'Unlock pricing on 200+ premium photo products',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    text: 'Track orders in real-time, all in one place',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    text: 'Connect with verified photographers near you',
  },
];

export default function LeadCaptureModal() {
  const { isLoggedIn } = useAuth();

  const [open,    setOpen]    = useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const triggered = useRef(false);

  const shouldShow = useCallback(() => {
    if (isLoggedIn) return false;
    if (localStorage.getItem(LS_CAPTURED) === 'true') return false;
    if (sessionStorage.getItem(SS_SEEN)   === 'true') return false;
    return true;
  }, [isLoggedIn]);

  const trigger = useCallback(() => {
    if (triggered.current) return;
    if (!shouldShow()) return;
    triggered.current = true;
    sessionStorage.setItem(SS_SEEN, 'true');
    setOpen(true);
  }, [shouldShow]);

  /* ── Dwell timer ──────────────────────────────────────────── */
  useEffect(() => {
    if (!shouldShow()) return;
    const t = setTimeout(trigger, DWELL_MS);
    return () => clearTimeout(t);
  }, [shouldShow, trigger]);

  /* ── Scroll depth ─────────────────────────────────────────── */
  useEffect(() => {
    if (!shouldShow()) return;
    const onScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (scrolled >= SCROLL_DEPTH) trigger();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [shouldShow, trigger]);

  /* ── Lock body scroll ─────────────────────────────────────── */
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else       document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!name.trim())                    { setError('Please enter your name.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.'); return;
    }
    setError('');
    localStorage.setItem(LS_CAPTURED, 'true');
    setSuccess(true);
  }, [name, email]);

  if (!open) return null;

  return (
    <div className="lcm-overlay" role="dialog" aria-modal="true" aria-labelledby="lcm-title" onClick={e => { if (e.target === e.currentTarget) handleDismiss(); }}>
      <div className="lcm-modal">

        {/* ── Left: brand panel ───────────────────────────────── */}
        <div className="lcm-panel">
          <div className="lcm-panel__logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.15)"/>
              <path d="M8 16C8 11.58 11.58 8 16 8s8 3.58 8 8-3.58 8-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="3" fill="#fff"/>
            </svg>
            <span>Canvera</span>
          </div>
          <h2 className="lcm-panel__headline">Your story,<br />beautifully preserved.</h2>
          <p className="lcm-panel__sub">Join thousands of photographers and families who trust Canvera for premium photo albums.</p>
          <ul className="lcm-panel__perks">
            {PERKS.map((p, i) => (
              <li key={i} className="lcm-panel__perk">
                <span className="lcm-panel__perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: form ─────────────────────────────────────── */}
        <div className="lcm-form-side">
          <button className="lcm-close" onClick={handleDismiss} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {success ? (
            <div className="lcm-success">
              <div className="lcm-success__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="lcm-success__title">You're in!</h3>
              <p className="lcm-success__msg">Welcome to Canvera. Create your account to start exploring.</p>
              <Link to="/signup" className="lcm-submit" onClick={handleDismiss}>
                Create Your Account
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          ) : (
            <>
              <div className="lcm-form-header">
                <p className="lcm-eyebrow">Free to join</p>
                <h3 id="lcm-title" className="lcm-form-title">Get started with Canvera</h3>
                <p className="lcm-form-sub">Enter your details to unlock pricing, place orders, and more.</p>
              </div>

              <form className="lcm-form" onSubmit={handleSubmit} noValidate>
                <div className="lcm-field">
                  <label className="lcm-label" htmlFor="lcm-name">Your name</label>
                  <input
                    id="lcm-name"
                    className={`lcm-input ${error && !name.trim() ? 'lcm-input--error' : ''}`}
                    type="text"
                    placeholder="Rohan Mehta"
                    value={name}
                    onChange={e => { setName(e.target.value); setError(''); }}
                    autoComplete="name"
                  />
                </div>
                <div className="lcm-field">
                  <label className="lcm-label" htmlFor="lcm-email">Email address</label>
                  <input
                    id="lcm-email"
                    className={`lcm-input ${error && name.trim() ? 'lcm-input--error' : ''}`}
                    type="email"
                    placeholder="rohan@example.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    autoComplete="email"
                  />
                </div>
                {error && <p className="lcm-error">{error}</p>}
                <button type="submit" className="lcm-submit">
                  Get Started — It's Free
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </form>

              <p className="lcm-signin-prompt">
                Already have an account?{' '}
                <Link to="/login" className="lcm-signin-link" onClick={handleDismiss}>Sign in</Link>
              </p>
              <p className="lcm-privacy">We respect your privacy. No spam, ever.</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
