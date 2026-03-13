import { useEffect } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import { orientationOptions } from '../../data/pdpOptions'
import ConfigCard from './ConfigCard'

/* Simple inline SVG glyphs for orientation */
function OrientationGlyph({ type }) {
  const base = {
    stroke: 'currentColor',
    strokeWidth: 2,
    fill: 'none',
    rx: 2,
  }

  if (type === 'Landscape') {
    return (
      <svg width="48" height="36" viewBox="0 0 48 36" aria-hidden="true">
        <rect x="1" y="1" width="46" height="34" {...base} />
      </svg>
    )
  }

  if (type === 'Portrait') {
    return (
      <svg width="36" height="48" viewBox="0 0 36 48" aria-hidden="true">
        <rect x="1" y="1" width="34" height="46" {...base} />
      </svg>
    )
  }

  // Square
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" {...base} />
    </svg>
  )
}

/**
 * SectionOrientation
 * ------------------
 * Renders stacked ConfigCards for each available product orientation.
 * If the product has only one orientation, it is auto-selected and an info note is shown.
 */
export default function SectionOrientation() {
  const { product, config, updateConfig } = usePDPConfig()

  // Auto-select when only 1 orientation is available
  useEffect(() => {
    if (
      product &&
      product.orientations &&
      product.orientations.length === 1 &&
      config.orientation !== product.orientations[0]
    ) {
      updateConfig('orientation', product.orientations[0])
    }
  }, [product, config.orientation, updateConfig])

  if (!product || !product.orientations || product.orientations.length === 0) return null

  const available = orientationOptions.filter(opt =>
    product.orientations.includes(opt.id)
  )

  if (available.length === 0) return null

  const singleOrientation = available.length === 1

  return (
    <div>
      {singleOrientation && (
        <div className="pdp-info-bar pdp-info-bar--gray">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="4.5" r="0.75" fill="currentColor" />
          </svg>
          <span>
            This product is available in <strong>{available[0].name}</strong> orientation only.
          </span>
        </div>
      )}

      <div className="pdp-config-cards pdp-config-cards--stack">
        {available.map(opt => (
          <ConfigCard
            key={opt.id}
            selected={config.orientation === opt.id}
            title={opt.name}
            subtitle={opt.description}
            specs={[`Best for: ${opt.bestFor}`]}
            price={null}
            priceType="included"
            onClick={() => updateConfig('orientation', opt.id)}
          >
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <OrientationGlyph type={opt.id} />
            </div>
          </ConfigCard>
        ))}
      </div>
    </div>
  )
}
