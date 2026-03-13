import { usePDPConfig } from '../../context/PDPConfigContext'
import { basePrices } from '../../data/pdpPricing'
import { sizeLabels } from '../../data/pdpOptions'
import ConfigCard from './ConfigCard'

/**
 * SectionSize
 * -----------
 * Renders a horizontal row of ConfigCards for each available product size.
 * Each card displays: size label, format name, print area note, and base price.
 * The first size receives a "Most Popular" badge.
 */
export default function SectionSize() {
  const { product, config, updateConfig } = usePDPConfig()

  if (!product || !product.sizes || product.sizes.length === 0) return null

  const productPrices = basePrices[product.id] || {}

  return (
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
            price={basePrice}
            priceType="from"
            onClick={() => updateConfig('size', sizeKey)}
          />
        )
      })}
    </div>
  )
}
