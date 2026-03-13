/**
 * CTABlock
 * --------
 * Final call-to-action block for the PDP config flow.
 * Large price display, primary "Proceed to Payment" CTA, secondary actions
 * (Save Draft, Share Configuration), and trust indicators.
 *
 * CSS classes consumed (from pdp-review.css):
 *   .pdp-cta-block, .pdp-cta-heading, .pdp-cta-price, .pdp-cta-price-note,
 *   .pdp-cta-main, .pdp-cta-main--active, .pdp-cta-main--disabled,
 *   .pdp-cta-secondary, .pdp-cta-secondary-btn, .pdp-trust, .pdp-trust-item
 */

import { useState, useCallback } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'

export default function CTABlock() {
  const {
    pricing,
    allRequiredComplete,
    setAttemptedProceed,
    saveDraft,
  } = usePDPConfig()

  const [toastMessage, setToastMessage] = useState(null)
  const [shareTooltip, setShareTooltip] = useState(false)

  const showToast = useCallback((msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }, [])

  const handleProceed = useCallback(() => {
    if (!allRequiredComplete) {
      setAttemptedProceed(true)
      return
    }
    // Navigate to payment (placeholder)
    showToast('Proceeding to payment...')
  }, [allRequiredComplete, setAttemptedProceed, showToast])

  const handleSaveDraft = useCallback(() => {
    saveDraft()
    showToast('Draft saved successfully')
  }, [saveDraft, showToast])

  const handleShare = useCallback(() => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setShareTooltip(true)
        setTimeout(() => setShareTooltip(false), 2000)
      })
    } else {
      setShareTooltip(true)
      setTimeout(() => setShareTooltip(false), 2000)
    }
  }, [])

  const totalFormatted = pricing.total
    ? `\u20B9${pricing.total.toLocaleString('en-IN')}`
    : '\u20B90'

  return (
    <div className="pdp-cta-block">
      {/* Heading */}
      <div className="pdp-cta-heading">
        Your photobook is configured. <em>Make it real.</em>
      </div>

      {/* Price */}
      <div className="pdp-cta-price">{totalFormatted}</div>
      <div className="pdp-cta-price-note">Inclusive of all selected options</div>

      {/* Primary CTA */}
      <button
        type="button"
        className={`pdp-cta-main ${allRequiredComplete ? 'pdp-cta-main--active' : 'pdp-cta-main--disabled'}`}
        onClick={handleProceed}
        disabled={false}
      >
        Proceed to Payment
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>

      {/* Secondary actions */}
      <div className="pdp-cta-secondary">
        <button
          type="button"
          className="pdp-cta-secondary-btn"
          onClick={handleSaveDraft}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save Draft
        </button>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="pdp-cta-secondary-btn"
            onClick={handleShare}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share Configuration
          </button>
          {shareTooltip && (
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--neutral-900)',
              color: '#fff',
              fontSize: 'var(--text-body-xs)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              whiteSpace: 'nowrap',
              marginBottom: 4,
            }}>
              Link copied!
            </div>
          )}
        </div>
      </div>

      {/* Trust indicators */}
      <div className="pdp-trust">
        <div className="pdp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
            <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </svg>
          <span>Express production available — 5-7 business day turnaround</span>
        </div>
        <div className="pdp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Quality guaranteed — reprint or full refund if not satisfied</span>
        </div>
        <div className="pdp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span>Secure payment — SSL encrypted, PCI-DSS compliant</span>
        </div>
        <div className="pdp-trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <span>Dedicated support — your personal production manager on every order</span>
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--neutral-900)',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-body-sm)',
          fontWeight: 'var(--weight-medium)',
          zIndex: 1000,
          boxShadow: 'var(--shadow-lg)',
          animation: 'pdpFadeIn 0.15s ease',
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  )
}
