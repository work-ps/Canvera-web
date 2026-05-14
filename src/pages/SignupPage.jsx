import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

/* ── File upload zone ─────────────────────────────────────── */
function UploadZone({ docType, hint, fileName, onChange }) {
  return (
    <div className="auth-upload-zone">
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e => onChange(e.target.files[0])} />

      {/* Document type — prominent label at top */}
      <p className="auth-upload-zone__doc-type">{docType}</p>

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
          <p className="auth-upload-zone__label"><strong>Upload</strong> or drag &amp; drop</p>
          <p className="auth-upload-zone__hint">{hint || 'PDF, JPG, PNG up to 5 MB'}</p>
        </>
      )}
    </div>
  );
}

/* ── Submitted confirmation screen ───────────────────────── */
function ApplicationSubmitted({ name, isPhotographer }) {
  return (
    <div className="auth-submitted">
      <div className="auth-submitted__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <h2 className="auth-submitted__title">Application Submitted!</h2>
      <p className="auth-submitted__body">
        Thank you, <strong>{name}</strong>. Your registration application has been received.
        {isPhotographer
          ? ' Our team will review your documents and verify your account shortly. You will receive an email once approved.'
          : ' Our team will review your application and get back to you shortly.'}
      </p>
      <p className="auth-submitted__note">
        Once verified, you can <Link to="/login" className="auth-switch__link">sign in</Link> to your account.
      </p>
    </div>
  );
}

export default function SignupPage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate(); // eslint-disable-line no-unused-vars

  if (isLoggedIn) return <Navigate to="/profile" replace />;

  /* ── State ── */
  const [step,           setStep]     = useState(1);   // 1 | 2 | 'done'
  const [name,           setName]     = useState('');
  const [email,          setEmail]    = useState('');
  const [phone,          setPhone]    = useState('');
  const [isPhotographer, setIsP]      = useState(false);
  const [error,          setError]    = useState('');

  /* Step 2 fields */
  const [studio,    setStudio]    = useState('');
  const [city,      setCity]      = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [bizProof,  setBizProof]  = useState(null);
  const [govId,     setGovId]     = useState(null);

  /* ── Step 1: validate → continue or submit ── */
  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim())  return setError('Please enter your full name.');
    if (!email.trim()) return setError('Please enter your email address.');

    if (isPhotographer) {
      setStep(2);           // photographer: go to details step
    } else {
      setStep('done');      // non-photographer: application submitted
    }
  };

  /* ── Step 2: submit for verification ── */
  const handleStep2 = (e) => {
    e.preventDefault();
    setStep('done');
  };

  /* ── Submitted state ── */
  if (step === 'done') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <ApplicationSubmitted name={name} isPhotographer={isPhotographer} />
          <p className="auth-switch" style={{ marginTop: 'var(--space-6)' }}>
            Already verified?{' '}
            <Link to="/login" className="auth-switch__link">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="auth-card__title">Register Now</h1>
        <p className="auth-card__sub auth-card__sub--accent">
          Join India's leading photobook platform
        </p>

        {/* ══════════════════════════════════════════
            STEP 1 — Basic information
        ══════════════════════════════════════════ */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleStep1} noValidate>
            {error && <p className="auth-error">{error}</p>}

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-name">Full name</label>
              <input
                id="s-name" type="text" className="auth-input"
                placeholder="Your full name"
                value={name} onChange={e => setName(e.target.value)}
                autoComplete="name" autoFocus
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-email">Email</label>
              <input
                id="s-email" type="email" className="auth-input"
                placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-phone">Phone number</label>
              <input
                id="s-phone" type="tel" className="auth-input"
                placeholder="+91 98765 43210"
                value={phone} onChange={e => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            {/* Professional photographer checkbox */}
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
              {isPhotographer ? 'CONTINUE →' : 'SUBMIT APPLICATION'}
            </button>
          </form>
        )}

        {/* ══════════════════════════════════════════
            STEP 2 — Photographer details
        ══════════════════════════════════════════ */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleStep2} noValidate>

            {/* Back + step indicator */}
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
              <input
                id="s-studio" type="text" className="auth-input"
                placeholder="e.g. Pixel Studio Photography"
                value={studio} onChange={e => setStudio(e.target.value)} autoFocus
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="s-city">City</label>
              <input
                id="s-city" type="text" className="auth-input"
                placeholder="e.g. Mumbai"
                value={city} onChange={e => setCity(e.target.value)}
              />
            </div>

            {/* Social / portfolio link — replaces old "Instagram / Portfolio link" */}
            <div className="auth-field">
              <label className="auth-label auth-label--accent" htmlFor="s-portfolio">
                Social Media / Portfolio Link
              </label>
              <input
                id="s-portfolio" type="url" className="auth-input"
                placeholder="Instagram, YouTube, Facebook, LinkedIn or your website"
                value={portfolio} onChange={e => setPortfolio(e.target.value)}
              />
              <p className="auth-field-hint">
                Share any link that showcases your work — Instagram, YouTube, Facebook, LinkedIn, Twitter / X, or your personal website.
              </p>
            </div>

            {/* Document uploads — type label is prominent inside each zone */}
            <div className="auth-upload-row">
              <UploadZone
                docType="Business Proof"
                hint="GST, trade licence, studio registration"
                fileName={bizProof?.name}
                onChange={setBizProof}
              />
              <UploadZone
                docType="Government ID"
                hint="Aadhaar, PAN, Passport or Voter ID"
                fileName={govId?.name}
                onChange={setGovId}
              />
            </div>

            <button type="submit" className="auth-btn">SUBMIT FOR VERIFICATION</button>

          </form>
        )}

        <p className="auth-switch" style={{ marginTop: 'var(--space-6)' }}>
          Already verified?{' '}
          <Link to="/login" className="auth-switch__link">Sign in</Link>
        </p>

      </div>
    </div>
  );
}
