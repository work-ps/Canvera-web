import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

/* ── File upload zone ─────────────────────────────────────── */
function UploadZone({ label, fileName, onChange }) {
  return (
    <div className="auth-upload-zone">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => onChange(e.target.files[0])} />
      <div className="auth-upload-zone__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      {fileName ? (
        <p className="auth-upload-zone__filename">{fileName}</p>
      ) : (
        <>
          <p className="auth-upload-zone__label"><strong>Upload</strong> or drag and drop</p>
          <p className="auth-upload-zone__hint">PDF, JPG, PNG up to 5MB</p>
        </>
      )}
      <p className="auth-upload-zone__label" style={{ marginTop: fileName ? 0 : 4, color: 'var(--text-secondary)', fontSize: 10 }}>{label}</p>
    </div>
  );
}

export default function SignupPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate  = useNavigate();

  if (isLoggedIn) return <Navigate to="/profile" replace />;

  /* Step 1 fields */
  const [step, setStep]           = useState(1);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [isPhotographer, setIsP]  = useState(false);
  const [error, setError]         = useState('');

  /* Step 2 fields (photographer only) */
  const [studio, setStudio]           = useState('');
  const [city, setCity]               = useState('');
  const [portfolio, setPortfolio]     = useState('');
  const [bizProof, setBizProof]       = useState(null);
  const [govId, setGovId]             = useState(null);

  const doLogin = (user) => {
    login(user);
    navigate('/', { replace: true });
  };

  /* Step 1 submit */
  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim())           return setError('Please enter your full name.');
    if (!email.trim())          return setError('Please enter your email address.');
    if (password.length < 6)    return setError('Password must be at least 6 characters.');

    if (!isPhotographer) {
      // Non-photographer: create account immediately
      doLogin({
        id: `u_${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        isPhotographer: false,
        status: 'registered',
      });
    } else {
      // Photographer: go to step 2
      setStep(2);
    }
  };

  /* Step 2: submit for verification */
  const handleStep2 = (e) => {
    e.preventDefault();
    doLogin({
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      isPhotographer: true,
      studioName: studio.trim(),
      city: city.trim(),
      portfolio: portfolio.trim(),
      status: 'registered', // becomes 'verified' after admin review
    });
  };

  /* Step 2: skip */
  const handleSkip = () => {
    doLogin({
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      isPhotographer: true,
      status: 'registered',
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="auth-card__title">Create your account</h1>
        <p className="auth-card__sub auth-card__sub--accent">Join India's leading photobook platform</p>

        {/* ── Step 1: Basic info ─────────────────────────── */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleStep1} noValidate>
            {error && <p className="auth-error">{error}</p>}

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-name">Full name</label>
              <input id="s-name" type="text" className="auth-input" placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)} autoComplete="name" autoFocus />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-email">Email</label>
              <input id="s-email" type="email" className="auth-input" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-phone">Phone number</label>
              <input id="s-phone" type="tel" className="auth-input" placeholder="+91 98765 43210"
                value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-pass">Password</label>
              <div className="auth-input-wrap">
                <input id="s-pass" type={showPass ? 'text' : 'password'} className="auth-input"
                  placeholder="Minimum 6 characters" value={password}
                  onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                <button type="button" className="auth-eye" onClick={() => setShowPass(v => !v)}>
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            {/* Photographer checkbox */}
            <div
              className="auth-check-row"
              onClick={() => setIsP(v => !v)}
              role="checkbox"
              aria-checked={isPhotographer}
              tabIndex={0}
              onKeyDown={e => e.key === ' ' && setIsP(v => !v)}
            >
              <div className={`auth-check-box ${isPhotographer ? 'auth-check-box--checked' : ''}`}>
                {isPhotographer && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <span className="auth-check-label">I am a professional photographer</span>
            </div>

            <button type="submit" className="auth-btn">
              {isPhotographer ? 'CONTINUE →' : 'CREATE ACCOUNT'}
            </button>
          </form>
        )}

        {/* ── Step 2: Photographer details ───────────────── */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleStep2} noValidate>

            {/* Back + step label */}
            <button type="button" className="auth-step-back" onClick={() => setStep(1)}>
              <span className="auth-step-back__arrow">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </span>
              <span>Step 2 of 2 — <span className="auth-step-label">Photographer Details</span></span>
            </button>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-studio">Studio name</label>
              <input id="s-studio" type="text" className="auth-input" placeholder="e.g. Pixel Studio Photography"
                value={studio} onChange={e => setStudio(e.target.value)} autoFocus />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-city">City</label>
              <input id="s-city" type="text" className="auth-input" placeholder="e.g. Mumbai"
                value={city} onChange={e => setCity(e.target.value)} />
            </div>

            <div className="auth-field">
              <label className="auth-label auth-label--accent" htmlFor="s-portfolio">
                Instagram / Portfolio link
              </label>
              <input id="s-portfolio" type="url" className="auth-input"
                placeholder="https://instagram.com/yourstudio"
                value={portfolio} onChange={e => setPortfolio(e.target.value)} />
            </div>

            <div className="auth-upload-row">
              <UploadZone
                label="Business Proof"
                fileName={bizProof?.name}
                onChange={setBizProof}
              />
              <UploadZone
                label="Government ID"
                fileName={govId?.name}
                onChange={setGovId}
              />
            </div>

            <button type="submit" className="auth-btn">SUBMIT FOR VERIFICATION</button>

            <button type="button" className="auth-skip" onClick={handleSkip}>
              I'll complete this later →
            </button>

          </form>
        )}

        <p className="auth-switch" style={{ marginTop: 'var(--space-6)' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-switch__link">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
