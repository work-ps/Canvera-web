/**
 * ProOfferStrip — verified-photographer exclusive offer bar
 *
 * Sits above the fixed header (position: fixed; top: 0; z-index: 1001).
 * Sets --strip-height: 36px on :root when visible so Header and all
 * page wrappers using --header-height auto-shift down without any
 * individual page-CSS edits.
 *
 * Dismissed state lives in sessionStorage (cleared on tab close).
 * Rotates 4 PRO offers every 5 s with click-to-copy coupon codes.
 *
 * Only renders when isVerified === true.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProOfferStrip.css';

const OFFERS = [
  {
    code:    'PRO10',
    label:   '10% off your next order',
    detail:  'Exclusive PRO member discount',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
  {
    code:    'PROSHIP',
    label:   'Free shipping on all orders',
    detail:  'No minimum order value',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    code:    'PROEARLY',
    label:   'Early access to new collections',
    detail:  'Shop new arrivals 48 h early',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    code:    'PROBULK5',
    label:   'Extra 5% off on bulk orders',
    detail:  'For orders of 5+ albums',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
];

const STRIP_HEIGHT = '36px';
const SESSION_KEY  = 'canvera_strip_dismissed';

export default function ProOfferStrip() {
  const { isVerified, isPhotographer } = useAuth();

  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );
  const [activeIdx, setActiveIdx]   = useState(0);
  const [copied,    setCopied]      = useState(false);
  const timerRef = useRef(null);

  /* ── Set / clear CSS variable ──────────────────────────────── */
  useEffect(() => {
    const visible = isVerified && isPhotographer && !dismissed;
    document.documentElement.style.setProperty(
      '--strip-height',
      visible ? STRIP_HEIGHT : '0px'
    );
    return () => {
      document.documentElement.style.setProperty('--strip-height', '0px');
    };
  }, [isVerified, isPhotographer, dismissed]);

  /* ── Auto-rotate every 5 s ─────────────────────────────────── */
  useEffect(() => {
    if (!isVerified || !isPhotographer || dismissed) return;
    timerRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % OFFERS.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [isVerified, dismissed]);

  const handleDotClick = useCallback((idx) => {
    setActiveIdx(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % OFFERS.length);
    }, 5000);
  }, []);

  const handleCopyCode = useCallback(() => {
    const code = OFFERS[activeIdx].code;
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [activeIdx]);

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setDismissed(true);
  }, []);

  if (!isVerified || !isPhotographer || dismissed) return null;

  const offer = OFFERS[activeIdx];

  return (
    <div className="pro-strip" role="banner" aria-label="Exclusive PRO member offers">
      <div className="pro-strip__inner">

        {/* Left: PRO badge */}
        <span className="pro-strip__badge">PRO</span>

        {/* Center: offer text */}
        <div className="pro-strip__content">
          <span className="pro-strip__icon">{offer.icon}</span>
          <span className="pro-strip__label">{offer.label}</span>
          <span className="pro-strip__sep">·</span>
          <span className="pro-strip__detail">{offer.detail}</span>
          <button
            className={`pro-strip__code-pill ${copied ? 'pro-strip__code-pill--copied' : ''}`}
            onClick={handleCopyCode}
            aria-label={`Copy code ${offer.code}`}
          >
            {copied ? (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                {offer.code}
              </>
            )}
          </button>
        </div>

        {/* Right: dots + dismiss */}
        <div className="pro-strip__controls">
          <div className="pro-strip__dots" role="tablist" aria-label="Offer navigation">
            {OFFERS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={`Offer ${i + 1}`}
                className={`pro-strip__dot ${i === activeIdx ? 'pro-strip__dot--active' : ''}`}
                onClick={() => handleDotClick(i)}
              />
            ))}
          </div>
          <button
            className="pro-strip__dismiss"
            onClick={handleDismiss}
            aria-label="Dismiss offer strip"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
}
