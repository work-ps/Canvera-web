import { useCallback, useMemo } from 'react'
import { surcharges } from '../../data/pdpPricing'
import { coverDesignPatterns, coverMaterials } from '../../data/pdpOptions'
import ConfigCard from '../pdp/ConfigCard'
import TooltipIcon from '../pdp/TooltipIcon'

// Color hex map for swatches
const COLOR_HEX = {
  'Midnight Black': '#1a1a2e', 'Charcoal': '#36454f', 'Slate Gray': '#708090',
  'Ivory': '#fffff0', 'Cream': '#fffdd0', 'Pearl White': '#f0efe9',
  'Midnight Blue': '#191970', 'Deep Navy': '#000080', 'Oxford Blue': '#002147',
  'Natural Tan': '#d2b48c', 'Saddle Brown': '#8b4513', 'Honey': '#eb9605',
  'Burgundy': '#800020', 'Wine Red': '#722f37', 'Oxblood': '#4a0000',
  'Navy': '#000080', 'Royal Blue': '#4169e1', 'Denim Blue': '#1560bd',
  'Stone Gray': '#928e85', 'Graphite': '#383838',
}

export default function StepCover({ config, onChange, product }) {
  const set = useCallback((k, v) => onChange(k, v), [onChange])

  // Text line count for selected design pattern
  const textLineCount = useMemo(() => {
    const p = coverDesignPatterns.find(p => p.id === config.coverDesign)
    if (!p) return 2
    return p.id === 'clean-minimal' ? 1 : p.id === 'nameplate-classic' ? 3 : 2
  }, [config.coverDesign])

  // Selected material's colors
  const selectedMaterial = coverMaterials.find(m => m.id === config.coverMaterial)
  const materialColors = selectedMaterial?.colors || []

  return (
    <div className="oc-step">
      {/* Cover Design Style */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Cover Design Style
          <TooltipIcon text="The visual layout pattern for your album's front cover." />
        </h3>
        <div className="oc-card-row oc-card-row--4">
          {coverDesignPatterns.map(pattern => {
            const lines = pattern.id === 'clean-minimal' ? 1 : pattern.id === 'nameplate-classic' ? 3 : 2
            return (
              <div
                key={pattern.id}
                className={`oc-design-card${config.coverDesign === pattern.id ? ' oc-design-card--selected' : ''}`}
                onClick={() => {
                  set('coverDesign', pattern.id)
                  set('coverMaterial', null)
                  set('coverColor', null)
                  set('coverName1', '')
                  set('coverName2', '')
                }}
              >
                <div className="oc-design-card-swatch">
                  <svg viewBox="0 0 60 40" fill="none" width="60" height="40">
                    <rect x="2" y="2" width="56" height="36" rx="4" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M10 28h40" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
                    {lines >= 2 && <path d="M14 32h32" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>}
                  </svg>
                </div>
                <div className="oc-design-card-name">{pattern.name}</div>
                <div className="oc-design-card-hint">{lines} text line{lines > 1 ? 's' : ''}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Material — stacked ConfigCards, progressive after design style */}
      {config.coverDesign && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Material
            <TooltipIcon text="The material wrapped around your album cover. Affects look, feel, and cost." />
          </h3>
          <div className="pdp-config-cards pdp-config-cards--stack">
            {coverMaterials.map(mat => {
              const delta = surcharges.coverMaterials[mat.id] || 0
              return (
                <ConfigCard
                  key={mat.id}
                  selected={config.coverMaterial === mat.id}
                  title={mat.name}
                  subtitle={mat.description}
                  price={delta > 0 ? delta : null}
                  priceType={delta > 0 ? 'addon' : 'included'}
                  onClick={() => {
                    set('coverMaterial', mat.id)
                    set('coverColor', null)
                    set('coverName1', '')
                    set('coverName2', '')
                  }}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* Color — progressive after material */}
      {config.coverMaterial && materialColors.length > 0 && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Color
            <TooltipIcon text="Choose a colour for your selected cover material." />
          </h3>
          <div className="oc-swatch-row">
            {materialColors.map(color => (
              <button
                key={color}
                className={`oc-swatch${config.coverColor === color ? ' oc-swatch--selected' : ''}`}
                onClick={() => set('coverColor', color)}
                title={color}
              >
                <span className="oc-swatch-circle" style={{ background: COLOR_HEX[color] || '#999' }} />
                <span className="oc-swatch-label">{color}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Cover Text — progressive after color */}
      {config.coverColor && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Cover Text
            <TooltipIcon text="Text printed or foiled onto the cover. Line 1 is always required." />
          </h3>
          <div className="oc-cover-text-fields">
            <input
              type="text"
              className="oc-input"
              placeholder="Line 1 (required)"
              value={config.coverName1 || ''}
              onChange={e => set('coverName1', e.target.value)}
            />
            {textLineCount >= 2 && (
              <input
                type="text"
                className="oc-input"
                placeholder="Line 2 (optional)"
                value={config.coverName2 || ''}
                onChange={e => set('coverName2', e.target.value)}
              />
            )}
          </div>
        </section>
      )}
    </div>
  )
}
