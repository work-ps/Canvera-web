import { useCallback } from 'react'
import { surcharges } from '../../data/pdpPricing'
import { bagOptions } from '../../data/pdpOptions'
import ConfigCard from '../pdp/ConfigCard'
import TooltipIcon from '../pdp/TooltipIcon'

const BOX_MATERIALS = [
  { id: 'Leather', name: 'Leather', description: 'Full-grain leather with a rich, durable finish' },
  { id: 'Linen', name: 'Linen', description: 'Woven linen texture, classic and professional' },
  { id: 'Velvet', name: 'Velvet', description: 'Soft velvet with a luxurious, premium feel' },
]

const BOX_COLORS_MAP = {
  Leather: [
    { name: 'Black', hex: '#1a1a2e' },
    { name: 'Tan', hex: '#d2b48c' },
    { name: 'Burgundy', hex: '#800020' },
  ],
  Linen: [
    { name: 'Ivory', hex: '#fffff0' },
    { name: 'Charcoal', hex: '#36454f' },
    { name: 'Navy', hex: '#000080' },
  ],
  Velvet: [
    { name: 'Deep Red', hex: '#8b0000' },
    { name: 'Royal Blue', hex: '#4169e1' },
    { name: 'Forest Green', hex: '#228b22' },
  ],
}

// Map bag config values to bagOptions ids
const BAG_MAP = {
  'Standard': 'Jute Bag',
  'Premium': 'Royal Jute Bag',
  'none': 'none',
}

export default function StepAccessories({ config, onChange }) {
  const set = useCallback((k, v) => onChange(k, v), [onChange])
  const boxColors = BOX_COLORS_MAP[config.boxMaterial] || []

  return (
    <div className="oc-step">
      {/* Presentation Box */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Presentation Box
          <TooltipIcon text="A protective box to store and present your album." />
        </h3>
        <label className={`oc-checkbox-row oc-checkbox-row--card${config.boxEnabled ? ' oc-checkbox-row--active' : ''}`}>
          <input
            type="checkbox"
            checked={config.boxEnabled || false}
            onChange={e => {
              set('boxEnabled', e.target.checked)
              if (!e.target.checked) {
                set('boxMaterial', null)
                set('boxColor', null)
                set('boxType', 'none')
              }
            }}
          />
          <div>
            <div className="oc-checkbox-label">Add Presentation Box</div>
            <div className="oc-checkbox-desc">Elegant packaging for your album</div>
          </div>
        </label>

        {/* Box Material — ConfigCards, progressive after checkbox */}
        {config.boxEnabled && (
          <div className="oc-progressive-section">
            <h4 className="oc-subsection-heading">Box Material</h4>
            <div className="pdp-config-cards">
              {BOX_MATERIALS.map(mat => (
                <ConfigCard
                  key={mat.id}
                  selected={config.boxMaterial === mat.id}
                  title={mat.name}
                  subtitle={mat.description}
                  onClick={() => {
                    set('boxMaterial', mat.id)
                    set('boxColor', null)
                    set('boxType', 'Matching Box')
                  }}
                />
              ))}
            </div>

            {/* Box Color — progressive after material */}
            {config.boxMaterial && (
              <>
                <h4 className="oc-subsection-heading">Box Color</h4>
                <div className="oc-swatch-row">
                  {boxColors.map(c => (
                    <button
                      key={c.name}
                      className={`oc-swatch${config.boxColor === c.name ? ' oc-swatch--selected' : ''}`}
                      onClick={() => set('boxColor', c.name)}
                      title={c.name}
                    >
                      <span className="oc-swatch-circle" style={{ background: c.hex }} />
                      <span className="oc-swatch-label">{c.name}</span>
                    </button>
                  ))}
                </div>
                <div className="oc-box-price-hint">
                  Matching Box: +&#x20B9;{surcharges.boxes['Matching Box']?.toLocaleString('en-IN')}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Bag — ConfigCards */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Bag
          <TooltipIcon text="Choose a carry bag for delivery and gifting." />
        </h3>
        <div className="pdp-config-cards">
          {bagOptions.slice(0, 3).map(bag => {
            const cost = surcharges.bags[bag.id] || 0
            const configVal = bag.id === 'Jute Bag' ? 'Standard' : bag.id === 'Royal Jute Bag' ? 'Premium' : 'none'
            return (
              <ConfigCard
                key={bag.id}
                selected={config.bagType === configVal}
                title={bag.name}
                subtitle={bag.description}
                price={cost > 0 ? cost : null}
                priceType={cost > 0 ? 'addon' : undefined}
                onClick={() => set('bagType', configVal)}
              />
            )
          })}
        </div>
      </section>
    </div>
  )
}
