/**
 * TooltipIcon
 * -----------
 * A small circular "?" button that displays a tooltip with contextual help text.
 *
 * Behaviour:
 *   - Desktop: tooltip appears on hover (mouseenter/mouseleave).
 *   - Mobile:  tooltip toggles on click/tap.
 *   - Clicking outside the tooltip dismisses it.
 *
 * Props:
 *   @param {string} text  -  The help text shown inside the tooltip.
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-tooltip-trigger, .pdp-tooltip
 */

import { useState, useRef, useEffect, useCallback } from 'react'

export default function TooltipIcon({ text }) {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef(null)
  const tooltipRef = useRef(null)

  /* ---- Toggle on click (mobile-friendly) ---- */
  const handleClick = useCallback((e) => {
    e.stopPropagation()
    setIsVisible(prev => !prev)
  }, [])

  /* ---- Show on hover (desktop) ---- */
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  /* ---- Dismiss on outside click ---- */
  useEffect(() => {
    if (!isVisible) return

    const handleOutsideClick = (e) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target)
      ) {
        setIsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [isVisible])

  if (!text) return null

  return (
    <button
      ref={triggerRef}
      type="button"
      className="pdp-tooltip-trigger"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="More information"
      aria-expanded={isVisible}
    >
      ?
      {isVisible && (
        <div ref={tooltipRef} className="pdp-tooltip" role="tooltip">
          {text}
        </div>
      )}
    </button>
  )
}
