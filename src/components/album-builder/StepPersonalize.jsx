const colorMap = {
  'Sienna': '#A0522D',
  'Warm Ivory': '#F5F0E1',
  'Fern Green': '#4F7942',
  'Marigold': '#EAA221',
  'Mulberry Red': '#C0392B',
  'Umber Brown': '#6B4226',
  'Stone Blue': '#5B7C99',
  'Saddle Brown': '#8B4513',
  'Espresso': '#3C2415',
  'Cool Grey': '#8E9AAF',
  'Berry Red': '#8E2451',
}

const checkSvg = (
  <svg viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function StepPersonalize({ product, personalize, onChange }) {
  if (!product) return null

  const { colorOptions, designCount, customization } = product
  const hasColors = colorOptions?.length > 0
  const hasDesigns = designCount > 0
  const hasCustom = customization?.length > 0

  const set = (key, value) => onChange({ ...personalize, [key]: value })

  const toggleCustom = (opt) => {
    const current = personalize.customizations || []
    const next = current.includes(opt)
      ? current.filter(c => c !== opt)
      : [...current, opt]
    set('customizations', next)
  }

  if (!hasColors && !hasDesigns && !hasCustom) {
    return (
      <div>
        <h2 className="ab-step-title">Personalize</h2>
        <p className="ab-step-subtitle">Personalization options for {product.name}</p>
        <div className="ab-empty-msg">
          <svg viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>This product has standard configuration. Continue to the next step.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="ab-step-title">Personalize</h2>
      <p className="ab-step-subtitle">Make your {product.name} uniquely yours</p>

      {/* Colour Selection */}
      {hasColors && (
        <div className="ab-spec-section">
          <div className="ab-spec-label">Colour</div>
          <div className="ab-color-grid">
            {colorOptions.map(c => (
              <button
                key={c}
                className={`ab-color-swatch${personalize.color === c ? ' selected' : ''}`}
                onClick={() => set('color', c)}
              >
                <span
                  className="ab-swatch-circle"
                  style={{ background: colorMap[c] || '#ccc' }}
                />
                <span className="ab-swatch-name">{c}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Design Styles */}
      {hasDesigns && (
        <div className="ab-spec-section">
          <div className="ab-spec-label">Cover Design ({designCount} styles)</div>
          <div className="ab-design-scroll">
            {Array.from({ length: designCount }, (_, i) => i + 1).map(num => (
              <div
                key={num}
                className={`ab-design-card${personalize.designStyle === num ? ' selected' : ''}`}
                onClick={() => set('designStyle', num)}
              >
                Design {String(num).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customization Toggles */}
      {hasCustom && (
        <div className="ab-spec-section">
          <div className="ab-spec-label">Customization Options</div>
          <div className="ab-custom-toggles">
            {customization.map(opt => {
              const isSelected = (personalize.customizations || []).includes(opt)
              return (
                <button
                  key={opt}
                  className={`ab-custom-toggle${isSelected ? ' selected' : ''}`}
                  onClick={() => toggleCustom(opt)}
                >
                  <span className="ab-custom-check">
                    {isSelected && checkSvg}
                  </span>
                  <span className="ab-custom-label">{opt}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
