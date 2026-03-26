import { useCallback, useMemo } from 'react'
import { surcharges } from '../../data/pdpPricing'
import { coverDesignPatterns, coverMaterials } from '../../data/pdpOptions'
import ConfigCard from '../pdp/ConfigCard'
import TooltipIcon from '../pdp/TooltipIcon'

const COLOR_HEX = {
  'Midnight Black': '#1a1a2e', 'Charcoal': '#36454f', 'Slate Gray': '#708090',
  'Ivory': '#fffff0', 'Cream': '#fffdd0', 'Pearl White': '#f0efe9',
  'Midnight Blue': '#191970', 'Deep Navy': '#000080', 'Oxford Blue': '#002147',
  'Natural Tan': '#d2b48c', 'Saddle Brown': '#8b4513', 'Honey': '#eb9605',
  'Burgundy': '#800020', 'Wine Red': '#722f37', 'Oxblood': '#4a0000',
  'Navy': '#000080', 'Royal Blue': '#4169e1', 'Denim Blue': '#1560bd',
  'Stone Gray': '#928e85', 'Graphite': '#383838',
}

const NAMING_TREATMENTS = [
  { id: 'gold-foil', name: 'Gold Foil', desc: 'Classic gold metallic foil' },
  { id: 'silver-foil', name: 'Silver', desc: 'Elegant silver foil' },
  { id: 'rose-gold', name: 'Rose Gold', desc: 'Modern rose gold foil' },
  { id: 'deboss', name: 'Deboss', desc: 'Pressed into the material' },
  { id: 'printed', name: 'Printed', desc: 'Full-color UV print' },
]

export default function StepCover({ config, onChange, product }) {
  const set = useCallback((k, v) => onChange(k, v), [onChange])

  const textLineCount = useMemo(() => {
    const p = coverDesignPatterns.find(p => p.id === config.coverDesign)
    if (!p) return 2
    return p.id === 'clean-minimal' ? 1 : p.id === 'nameplate-classic' ? 3 : 2
  }, [config.coverDesign])

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
                    <rect x="2" y="2" width="56" height="36" rx="4" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M10 28h40" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
                    {lines >= 2 && <path d="M14 32h32" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />}
                  </svg>
                </div>
                <div className="oc-design-card-name">{pattern.name}</div>
                <div className="oc-design-card-hint">{lines} text line{lines > 1 ? 's' : ''}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Material */}
      {config.coverDesign && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Material
            <TooltipIcon text="The material wrapped around your album cover. Affects look, feel, and cost." />
          </h3>
          <div className="oc-swatch-row oc-swatch-row--materials">
            {coverMaterials.map(mat => {
              const delta = surcharges.coverMaterials[mat.id] || 0
              return (
                <button
                  key={mat.id}
                  className={`oc-material-swatch${config.coverMaterial === mat.id ? ' oc-material-swatch--selected' : ''}`}
                  onClick={() => {
                    set('coverMaterial', mat.id)
                    set('coverColor', null)
                    set('coverName1', '')
                    set('coverName2', '')
                  }}
                >
                  <span className="oc-material-swatch-circle">
                    <svg viewBox="0 0 32 32" fill="none" width="24" height="24">
                      <rect x="4" y="4" width="24" height="24" rx="4" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M8 20l4-4 3 2 5-6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="oc-material-swatch-name">{mat.name}</span>
                  {delta > 0 && <span className="oc-material-swatch-price">+\u20B9{delta.toLocaleString('en-IN')}</span>}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Color */}
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

      {/* Naming Treatment */}
      {config.coverColor && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Naming Treatment
            <TooltipIcon text="How the text on your cover will be applied." />
          </h3>
          <div className="oc-card-row oc-card-row--5">
            {NAMING_TREATMENTS.map(t => (
              <div
                key={t.id}
                className={`oc-type-card oc-type-card--sm${config.namingTreatment === t.id ? ' oc-type-card--selected' : ''}`}
                onClick={() => set('namingTreatment', t.id)}
              >
                <div className="oc-type-card-title">{t.name}</div>
                <div className="oc-type-card-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cover Text */}
      {config.coverColor && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Cover Text
            <TooltipIcon text="Text printed or foiled onto the cover. Line 1 is always required." />
          </h3>
          <div className="oc-cover-text-fields">
            <div className="input-group">
              <label className="input-label">Line 1 (required)</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Raj & Priya"
                value={config.coverName1 || ''}
                onChange={e => set('coverName1', e.target.value)}
              />
            </div>
            {textLineCount >= 2 && (
              <div className="input-group">
                <label className="input-label">Line 2 (optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., 24.12.2024"
                  value={config.coverName2 || ''}
                  onChange={e => set('coverName2', e.target.value)}
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
