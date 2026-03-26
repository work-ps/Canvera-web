import { useState } from 'react'
import { sizeLabels } from '../../data/pdpOptions'

/**
 * SizeChartModal
 * ---------------
 * Renders a "View Size Chart" link and an overlay modal with a full comparison table.
 * Pass `sizes` (array of size keys) to limit which sizes are shown.
 * If omitted, all album-type sizes are displayed.
 */
export default function SizeChartModal({ sizes }) {
  const [open, setOpen] = useState(false)
  const [unit, setUnit] = useState('in') // 'in' | 'cm'

  // Filter to only album sizes (exclude mugs)
  const albumSizeKeys = (sizes || Object.keys(sizeLabels)).filter(k => {
    const info = sizeLabels[k]
    return info && info.cm // only entries with cm data (albums/calendars)
  })

  return (
    <>
      <button
        type="button"
        className="size-chart-trigger"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true) }}
      >
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
          <path d="M1 4h14M1 4v8h14V4M4 4v3M7 4v2M10 4v3M13 4v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        View Size Chart
      </button>

      {open && (
        <div className="size-chart-overlay" onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="size-chart-modal" role="dialog" aria-label="Size Chart">
            {/* Header */}
            <div className="size-chart-header">
              <h3 className="size-chart-title">Size Chart</h3>
              <button
                type="button"
                className="size-chart-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >&times;</button>
            </div>

            {/* Unit toggle */}
            <div className="size-chart-unit-toggle">
              <button
                className={`size-chart-unit-btn${unit === 'in' ? ' size-chart-unit-btn--active' : ''}`}
                onClick={() => setUnit('in')}
              >Inches</button>
              <button
                className={`size-chart-unit-btn${unit === 'cm' ? ' size-chart-unit-btn--active' : ''}`}
                onClick={() => setUnit('cm')}
              >Centimeters</button>
            </div>

            {/* Table */}
            <div className="size-chart-table-wrap">
              <table className="size-chart-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Format</th>
                    <th>Dimensions</th>
                    <th>Print Area</th>
                  </tr>
                </thead>
                <tbody>
                  {albumSizeKeys.map(key => {
                    const info = sizeLabels[key]
                    if (!info) return null

                    // Convert print area to cm if needed
                    let printAreaDisplay = info.printArea
                    if (unit === 'cm' && info.printArea !== 'Wrap-around') {
                      // Parse the print area dimensions and convert
                      const match = info.printArea.match(/([\d.]+)\s*\u00d7\s*([\d.]+)/)
                      if (match) {
                        const w = (parseFloat(match[1]) * 2.54).toFixed(1)
                        const h = (parseFloat(match[2]) * 2.54).toFixed(1)
                        printAreaDisplay = `${w} \u00d7 ${h} cm`
                      }
                    }

                    return (
                      <tr key={key}>
                        <td className="size-chart-cell-size">{info.label}</td>
                        <td>{info.format}</td>
                        <td className="size-chart-cell-dim">{unit === 'cm' ? info.cm : info.label}</td>
                        <td className="size-chart-cell-dim">{printAreaDisplay}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="size-chart-footer">
              All measurements are approximate. Print area accounts for safe margins.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * SizeUnitBadge
 * Small inline badge showing the unit system next to the section heading.
 */
export function SizeUnitBadge() {
  return (
    <span className="size-unit-badge">in inches</span>
  )
}
