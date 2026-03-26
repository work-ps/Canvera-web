/**
 * SectionBox
 * ----------
 * Box selection section for the PDP config flow.
 * Renders horizontal ConfigCard components for box options.
 * First card is "No Box" (default selected).
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-config-cards, .pdp-subsection, .pdp-pairing-note
 */

import { usePDPConfig } from '../../context/PDPConfigContext'
import { boxOptions } from '../../data/pdpOptions'
import { surcharges } from '../../data/pdpPricing'
import ConfigCard from './ConfigCard'

export default function SectionBox() {
  const { config, updateConfig } = usePDPConfig()

  const selected = config.boxType || 'none'

  return (
    <div>
      <div className="pdp-config-cards">
        {boxOptions.map((opt) => {
          const price = surcharges.boxes[opt.id] || 0
          const isNone = opt.id === 'none'

          return (
            <ConfigCard
              key={opt.id}
              selected={selected === opt.id}
              onClick={() => updateConfig('boxType', opt.id)}
              title={opt.name}
              subtitle={opt.description}
            />
          )
        })}
      </div>

      {/* Sub-section note when a box (not "none") is selected */}
      {selected !== 'none' && (
        <div className="pdp-subsection">
          <div className="pdp-pairing-note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Box comes in matching material — coordinated with your selected cover material and colour for a unified presentation.
          </div>
        </div>
      )}
    </div>
  )
}
