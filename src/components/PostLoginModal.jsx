/**
 * PostLoginModal — post-login engagement prompts (two variants)
 *
 * Variant A — isPhotographer && !isVerified:
 *   "Get verified to unlock PRO benefits"
 *   → links to /genuine (verification page)
 *
 * Variant B — !isPhotographer:
 *   "Connect with photographers for better pricing"
 *   → explains referral codes, links to finder / contact
 *
 * Session guard: sessionStorage.canvera_post_login_modal_shown
 * Delay: 1200 ms after mount so it doesn't clash with page render
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PostLoginModal.css';

const SS_SHOWN = 'canvera_post_login_modal_shown';

/* ── Variant A content ───────────────────────────────────────── */
function VerifyPromptContent({ onClose }) {
  const PRO_BENEFITS = [
    'PRO-exclusive pricing on all albums',
    'Priority dispatch & free shipping',
    'Early access to new collections',
    'Bulk order discounts up to 15%',
    'Dedicated account manager',
  ];

  return (
    <>
      <div className="plm-icon plm-icon--verify">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      </div>

      <div className="plm-header">
        <p className="plm-eyebrow">Photographer account detected</p>
        <h2 className="plm-title">Unlock your PRO benefits</h2>
        <p className="plm-sub">
          Verify your photographer status to access exclusive PRO pricing, free shipping, and priority production — used by 10,000+ photographers on Canvera.
        </p>
      </div>

      <ul className="plm-benefits">
        {PRO_BENEFITS.map((b, i) => (
          <li key={i} className="plm-benefit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {b}
          </li>
        ))}
      </ul>

      <div className="plm-actions">
        <Link to="/genuine" className="plm-cta plm-cta--primary" onClick={onClose}>
          Get Verified Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <button className="plm-cta plm-cta--ghost" onClick={onClose}>
          Maybe later
        </button>
      </div>

      <p className="plm-footnote">Verification is free and typically takes 24–48 hours.</p>
    </>
  );
}

/* ── Variant B content ───────────────────────────────────────── */
function ConnectPromptContent({ onClose }) {
  return (
    <>
      <div className="plm-icon plm-icon--connect">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>

      <div className="plm-header">
        <p className="plm-eyebrow">Tip for better savings</p>
        <h2 className="plm-title">Get better pricing through your photographer</h2>
        <p className="plm-sub">
          Verified Canvera photographers share exclusive referral codes with their clients. Enter a code at checkout for instant discounts — up to 12% off.
        </p>
      </div>

      <div className="plm-how">
        <p className="plm-how__title">How it works</p>
        <ol className="plm-steps">
          <li className="plm-step">
            <span className="plm-step__num">1</span>
            <span>Ask your photographer for their Canvera referral code</span>
          </li>
          <li className="plm-step">
            <span className="plm-step__num">2</span>
            <span>Add items to your cart and proceed to checkout</span>
          </li>
          <li className="plm-step">
            <span className="plm-step__num">3</span>
            <span>Enter the referral code to unlock your discount</span>
          </li>
        </ol>
      </div>

      <div className="plm-actions">
        <Link to="/finder" className="plm-cta plm-cta--primary" onClick={onClose}>
          Find Photographers Near You
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
        <button className="plm-cta plm-cta--ghost" onClick={onClose}>
          I have a code — go to cart
        </button>
      </div>

      <p className="plm-footnote">Referral codes stack with regular coupon codes at checkout.</p>
    </>
  );
}

/* ── Main component ──────────────────────────────────────────── */
export default function PostLoginModal() {
  const { isLoggedIn, isPhotographer, isVerified } = useAuth();

  const [open, setOpen] = useState(false);

  /* Determine which variant to show (if any) */
  const variant = (() => {
    if (!isLoggedIn) return null;
    if (sessionStorage.getItem(SS_SHOWN) === 'true') return null;
    if (isPhotographer && !isVerified) return 'verify';
    if (!isPhotographer) return 'connect';
    return null; // verified photographer — no modal needed
  })();

  /* Delay to avoid clashing with page render */
  useEffect(() => {
    if (!variant) return;
    const t = setTimeout(() => {
      sessionStorage.setItem(SS_SHOWN, 'true');
      setOpen(true);
    }, 1200);
    return () => clearTimeout(t);
  }, [variant]);

  /* Reset when user logs out */
  useEffect(() => {
    if (!isLoggedIn) {
      setOpen(false);
    }
  }, [isLoggedIn]);

  /* Lock body scroll */
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else       document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleClose = useCallback(() => setOpen(false), []);

  if (!open || !variant) return null;

  return (
    <div
      className="plm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plm-title"
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className={`plm-modal plm-modal--${variant}`}>
        <button className="plm-close" onClick={handleClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {variant === 'verify'  && <VerifyPromptContent  onClose={handleClose} />}
        {variant === 'connect' && <ConnectPromptContent onClose={handleClose} />}
      </div>
    </div>
  );
}
