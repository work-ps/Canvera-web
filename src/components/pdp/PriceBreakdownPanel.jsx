/**
 * PriceBreakdownPanel
 * -------------------
 * A floating overlay panel that displays an itemised price breakdown. Appears
 * when the user clicks the "View breakdown" link in the sticky PDP header.
 *
 * The panel renders on top of a semi-transparent overlay. Both fade/slide into
 * view via CSS keyframe animations defined in pdp-header.css.
 *
 * Props:
 *   @param {Array<{label: string, amount: number, type: string}>} lineItems
 *          Each line item in the breakdown. `type` can be:
 *            'base'  - the base price row (rendered with medium weight)
 *            'addon' - an add-on line item (rendered with normal weight)
 *            'total' - the total row (rendered bold with top border)
 *   @param {number}   total   - The total price value.
 *   @param {boolean}  isOpen  - Controls visibility.
 *   @param {function} onClose - Callback to dismiss the panel.
 *
 * CSS classes consumed (from pdp-header.css):
 *   .pdp-breakdown-overlay, .pdp-breakdown-panel, .pdp-breakdown-title,
 *   .pdp-breakdown-close, .pdp-breakdown-items, .pdp-breakdown-row,
 *   .pdp-breakdown-row--base, .pdp-breakdown-row--total,
 *   .pdp-breakdown-amount
 */

import { useCallback, useEffect } from 'react'

/**
 * Formats a number as comma-separated Indian-style currency.
 */
function formatCurrency(amount) {
  if (amount == null) return '--'
  return '\u20B9' + amount.toLocaleString('en-IN')
}

export default function PriceBreakdownPanel({
  lineItems = [],
  total,
  isOpen = false,
  onClose,
}) {
  /* ---- Close on Escape key ---- */
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  /* ---- Overlay click dismisses panel ---- */
  const handleOverlayClick = useCallback(() => {
    if (onClose) onClose()
  }, [onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Semi-transparent overlay */}
      <div
        className="pdp-breakdown-overlay"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Floating panel */}
      <div
        className="pdp-breakdown-panel"
        role="dialog"
        aria-label="Price breakdown"
        aria-modal="true"
      >
        {/* Panel title + close button */}
        <div className="pdp-breakdown-title">
          <span>Price Breakdown</span>
          <button
            type="button"
            className="pdp-breakdown-close"
            onClick={onClose}
            aria-label="Close price breakdown"
          >
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Line items */}
        <div className="pdp-breakdown-items">
          {lineItems.map((item, i) => {
            const rowClass = [
              'pdp-breakdown-row',
              item.type === 'base' && 'pdp-breakdown-row--base',
            ].filter(Boolean).join(' ')

            return (
              <div key={i} className={rowClass}>
                <span>{item.label}</span>
                <span className="pdp-breakdown-amount">
                  {item.amount === 0
                    ? 'Included'
                    : formatCurrency(item.amount)
                  }
                </span>
              </div>
            )
          })}

          {/* Total row */}
          {total != null && (
            <div className="pdp-breakdown-row pdp-breakdown-row--total">
              <span>Total</span>
              <span className="pdp-breakdown-amount">
                {formatCurrency(total)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
