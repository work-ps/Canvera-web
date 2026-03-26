import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { usePDPConfig } from '../../context/PDPConfigContext'
import PriceBreakdownPanel from './PriceBreakdownPanel'
import '../../styles/pdp-header.css'

export default function PDPHeader() {
  const {
    product, config,
    allRequiredComplete, setAttemptedProceed, saveDraft,
    setExpandedSection,
  } = usePDPConfig()

  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const hasSelections = config.size !== null

  const handleSaveDraft = useCallback(() => {
    saveDraft()
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }, [saveDraft])

  const handleProceed = useCallback(() => {
    if (!allRequiredComplete) {
      setAttemptedProceed(true)
    }
  }, [allRequiredComplete, setAttemptedProceed])

  if (!product) return null

  return (
    <>
      <div className="pdp-header">
        <div className="pdp-header-inner">
          {/* Left: breadcrumb + name */}
          <div className="pdp-header-left">
            <div className="pdp-header-breadcrumb">
              <Link to="/shop">
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/shop">All Products</Link>
            </div>
            <span className="pdp-header-product-name">{product.name}</span>
          </div>

          {/* Center spacer */}
          <div className="pdp-header-center" />

          {/* Right: actions */}
          <div className="pdp-header-right">
            <button className="pdp-header-save" onClick={handleSaveDraft}>
              Save Draft
            </button>
            <button
              className="pdp-header-cta"
              disabled={!allRequiredComplete}
              onClick={handleProceed}
            >
              {allRequiredComplete ? 'Proceed to Order' : 'Complete required fields'}
              <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Breakdown panel removed — pricing only in ordering flow */}

      {/* Toast */}
      {showToast && (
        <div className="pdp-toast">Draft saved — find it in My Orders.</div>
      )}

      {/* Mobile bottom bar */}
      <div className="pdp-mobile-bar">
        <div></div>
        <button
          className="pdp-header-cta"
          disabled={!allRequiredComplete}
          onClick={handleProceed}
        >
          Proceed
          <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </>
  )
}
