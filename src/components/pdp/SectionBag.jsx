/**
 * SectionBag
 * ----------
 * Bag selection section for the PDP config flow.
 * Renders horizontal ConfigCard components for bag options.
 * First card is "No Bag" (default selected). Simple selection, no sub-sections.
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-config-cards
 */

import { usePDPConfig } from '../../context/PDPConfigContext'
import { bagOptions } from '../../data/pdpOptions'
import { surcharges } from '../../data/pdpPricing'
import ConfigCard from './ConfigCard'

export default function SectionBag() {
  const { config, updateConfig } = usePDPConfig()

  const selected = config.bagType || 'none'

  return (
    <div>
      <div className="pdp-config-cards">
        {bagOptions.map((opt) => {
          const price = surcharges.bags[opt.id] || 0
          const isNone = opt.id === 'none'

          return (
            <ConfigCard
              key={opt.id}
              selected={selected === opt.id}
              onClick={() => updateConfig('bagType', opt.id)}
              title={opt.name}
              subtitle={opt.description}
            />
          )
        })}
      </div>
    </div>
  )
}
