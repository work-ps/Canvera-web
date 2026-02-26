const sizeIcon = (
  <svg viewBox="0 0 28 28" fill="none">
    <rect x="3" y="6" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 18l5-4 4 2 5-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const orientationIcons = {
  Landscape: (
    <svg viewBox="0 0 28 28" fill="none">
      <rect x="3" y="7" width="22" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  Portrait: (
    <svg viewBox="0 0 28 28" fill="none">
      <rect x="7" y="3" width="14" height="22" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  Square: (
    <svg viewBox="0 0 28 28" fill="none">
      <rect x="4" y="4" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
}

const bindingIcon = (
  <svg viewBox="0 0 28 28" fill="none">
    <path d="M14 4v20" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M6 4c0 0 0 4 8 4s8-4 8-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <rect x="4" y="6" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)

export default function StepSpecifications({ product, specs, onChange }) {
  if (!product) return null

  const { sizes, orientations, bindings, printTypes } = product

  const setSpec = (key, value) => {
    onChange({ ...specs, [key]: value })
  }

  return (
    <div>
      <h2 className="ab-step-title">Select Specifications</h2>
      <p className="ab-step-subtitle">Configure your {product.name} to match your vision</p>

      {/* Size */}
      {sizes?.length > 0 && (
        <div className="ab-spec-section">
          <div className="ab-spec-label">Size</div>
          <div className="ab-spec-grid">
            {sizes.map(s => (
              <button
                key={s}
                className={`ab-spec-option${specs.size === s ? ' selected' : ''}`}
                onClick={() => setSpec('size', s)}
              >
                <span className="ab-spec-option-icon">{sizeIcon}</span>
                <span className="ab-spec-option-label">{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Orientation */}
      {orientations?.length > 0 && (
        <div className="ab-spec-section">
          <div className="ab-spec-label">Orientation</div>
          <div className="ab-spec-grid">
            {orientations.map(o => (
              <button
                key={o}
                className={`ab-spec-option${specs.orientation === o ? ' selected' : ''}`}
                onClick={() => setSpec('orientation', o)}
              >
                <span className="ab-spec-option-icon">{orientationIcons[o] || sizeIcon}</span>
                <span className="ab-spec-option-label">{o}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Binding */}
      {bindings?.length > 0 && (
        <div className="ab-spec-section">
          <div className="ab-spec-label">Binding Type</div>
          <div className="ab-spec-grid">
            {bindings.map(b => (
              <button
                key={b}
                className={`ab-spec-option${specs.binding === b ? ' selected' : ''}`}
                onClick={() => setSpec('binding', b)}
              >
                <span className="ab-spec-option-icon">{bindingIcon}</span>
                <span className="ab-spec-option-label">{b}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Print Type */}
      {printTypes?.length > 0 && (
        <div className="ab-spec-section">
          <div className="ab-spec-label">Print Type</div>
          <div className="ab-spec-grid">
            {printTypes.map(pt => (
              <button
                key={pt}
                className={`ab-spec-option${specs.printType === pt ? ' selected' : ''}`}
                onClick={() => setSpec('printType', pt)}
              >
                <span className="ab-spec-option-label">{pt}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
