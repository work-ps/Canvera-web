import { usePDPConfig } from '../../context/PDPConfigContext'
import { basePrices } from '../../data/pdpPricing'
import { sizeLabels } from '../../data/pdpOptions'
import ConfigCard from './ConfigCard'
import SizeChartModal from '../shared/SizeChartModal'

/**
 * SectionSize
 * -----------
 * Renders a horizontal row of ConfigCards for each available product size.
 * Includes a unit badge and a "View Size Chart" link.
 * The first size receives a "Most Popular" badge.
 */
export default function SectionSize() {
  const { product, config, updateConfig } = usePDPConfig()

  if (!product || !product.sizes || product.sizes.length === 0) return null

  const productPrices = basePrices[product.id] || {}

  return (
    <>
      <div className="size-heading-row">
        <div className="size-heading-left">
        </div>
        <SizeChartModal sizes={product.sizes} />
      </div>

      <div className="pdp-config-cards">
        {product.sizes.map((sizeKey, idx) => {
          const info = sizeLabels[sizeKey]
          const basePrice = productPrices[sizeKey]

          if (!info) return null

          return (
            <ConfigCard
              key={sizeKey}
              selected={config.size === sizeKey}
              badge={idx === 0 ? 'Most Popular' : undefined}
              title={info.label}
              subtitle={info.format}
              specs={[`Print area ${info.printArea}`]}
              onClick={() => updateConfig('size', sizeKey)}
            />
          )
        })}
      </div>
    </>
  )
}
