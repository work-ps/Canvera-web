/**
 * OrderReviewBlock
 * ----------------
 * Full review section that displays a configuration summary table and
 * an itemised price breakdown. Each row has an "Edit" button to jump
 * back to the relevant section.
 *
 * CSS classes consumed (from pdp-review.css):
 *   .pdp-review, .pdp-review-heading, .pdp-review-subtitle,
 *   .pdp-review-table, .pdp-review-edit, .pdp-review-edit--error,
 *   .pdp-review-required, .pdp-price-breakdown, .pdp-price-breakdown-title,
 *   .pdp-price-table, .pdp-price-total-row, .pdp-price-note
 */

import { usePDPConfig } from '../../context/PDPConfigContext'
import { sizeLabels } from '../../data/pdpOptions'

/**
 * Format price for display.
 */
function fmt(amount) {
  if (amount == null || amount === 0) return null
  return `\u20B9${amount.toLocaleString('en-IN')}`
}

/**
 * Mapping from config keys to human-readable labels and section IDs.
 */
const configRows = [
  { key: 'size', label: 'Size', sectionId: 'size', required: true, format: (v) => sizeLabels[v]?.label || v },
  { key: 'orientation', label: 'Orientation', sectionId: 'orientation', required: true },
  { key: 'binding', label: 'Binding', sectionId: 'binding', required: true },
  { key: 'sheets', label: 'Pages', sectionId: 'pages', required: true, format: (v) => `${v} sheets (${v * 2} pages)` },
  { key: 'lamination', label: 'Lamination', sectionId: 'paper', required: true },
  { key: 'paper', label: 'Paper', sectionId: 'paper', required: true },
  { key: 'coverDesign', label: 'Cover Design', sectionId: 'cover', required: true },
  { key: 'coverMaterial', label: 'Cover Material', sectionId: 'cover', required: true },
  { key: 'coverColor', label: 'Cover Colour', sectionId: 'cover', required: true },
  { key: 'namingTreatment', label: 'Naming Treatment', sectionId: 'cover', required: false },
  { key: 'coverName1', label: 'Cover Name Line 1', sectionId: 'cover', required: false },
  { key: 'coverName2', label: 'Cover Name Line 2', sectionId: 'cover', required: false },
  { key: 'boxType', label: 'Box', sectionId: 'box', required: false, format: (v) => v === 'none' ? 'No Box' : v },
  { key: 'bagType', label: 'Bag', sectionId: 'bag', required: false, format: (v) => v === 'none' ? 'No Bag' : v },
  { key: 'imageLink', label: 'Image Link', sectionId: 'imageLink', required: true, format: (v) => v ? (v.length > 50 ? v.slice(0, 50) + '...' : v) : null },
  { key: 'orderType', label: 'Order Type', sectionId: 'orderType', required: true, format: (v) => v === 'raw' ? 'Raw / Unedited' : v === 'print-ready' ? 'Edited & Print-Ready' : v },
  { key: 'productionNotes', label: 'Production Notes', sectionId: 'notes', required: false, format: (v) => v ? (v.length > 60 ? v.slice(0, 60) + '...' : v) : null },
]

export default function OrderReviewBlock() {
  const { config, pricing, setExpandedSection, sectionStates } = usePDPConfig()

  return (
    <div className="pdp-review">
      {/* Heading */}
      <div className="pdp-review-heading">Review</div>
      <div className="pdp-review-subtitle">Confirm your configuration before ordering.</div>

      {/* Configuration summary table */}
      <table className="pdp-review-table">
        <tbody>
          {configRows.map((row) => {
            const rawValue = config[row.key]
            const displayValue = row.format ? row.format(rawValue) : rawValue
            const isEmpty = !rawValue || rawValue === 'none' || (row.key === 'sheets' && rawValue < 10)
            const isRequired = row.required
            const sectionState = sectionStates[row.sectionId]
            const isError = sectionState === 'error'

            // Skip empty optional fields
            if (!isRequired && isEmpty && row.key !== 'boxType' && row.key !== 'bagType') return null

            return (
              <tr key={row.key}>
                <td>{row.label}</td>
                <td>
                  {isEmpty && isRequired ? (
                    <span className="pdp-review-required">&mdash; Required</span>
                  ) : (
                    displayValue || '\u2014'
                  )}
                </td>
                <td>
                  <button
                    type="button"
                    className={`pdp-review-edit${isError ? ' pdp-review-edit--error' : ''}`}
                    onClick={() => setExpandedSection(row.sectionId)}
                  >
                    Edit &rarr;
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Itemised Price Breakdown */}
      <div className="pdp-price-breakdown">
        <div className="pdp-price-breakdown-title">Price Breakdown</div>
        <table className="pdp-price-table">
          <tbody>
            {pricing.lineItems.map((item) => (
              <tr key={item.key}>
                <td>{item.label}</td>
                <td>{fmt(item.amount)}</td>
              </tr>
            ))}
            <tr className="pdp-price-total-row">
              <td>Total</td>
              <td>{fmt(pricing.total) || '\u20B90'}</td>
            </tr>
          </tbody>
        </table>
        <div className="pdp-price-note">
          Final price confirmed at checkout.
        </div>
      </div>
    </div>
  )
}
