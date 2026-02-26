const boxIcon = (
  <svg viewBox="0 0 36 36" fill="none">
    <rect x="4" y="12" width="28" height="18" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M4 12l14-6 14 6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M18 6v24" stroke="currentColor" strokeWidth="1"/>
    <path d="M4 12h28" stroke="currentColor" strokeWidth="1"/>
  </svg>
)

const bagIcon = (
  <svg viewBox="0 0 36 36" fill="none">
    <rect x="6" y="14" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M12 14V10a6 6 0 0112 0v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M14 22h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const noIcon = (
  <svg viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="12" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M12 12l12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const boxOptions = [
  { id: 'matching-box', label: 'Matching Box', desc: 'Coordinated box matching your album' },
  { id: 'sleeve-box', label: 'Sleeve Box', desc: 'Elegant sleeve-style packaging' },
  { id: 'wood-box', label: 'Wood Box', desc: 'Premium wooden presentation box' },
  { id: 'standard-box', label: 'Standard Box', desc: 'Classic protective box' },
  { id: 'none', label: 'No Box', desc: 'Skip the box' },
]

const bagOptions = [
  { id: 'matching-bag', label: 'Matching Bag', desc: 'Coordinated carry bag' },
  { id: 'jute-bag', label: 'Jute Bag', desc: 'Eco-friendly jute carry bag' },
  { id: 'acroluxe-bag', label: 'Acroluxe Bag', desc: 'Premium branded carry bag' },
  { id: 'none', label: 'No Bag', desc: 'Skip the bag' },
]

export default function StepAccessories({ product, accessories, onChange }) {
  if (!product) return null

  const set = (key, value) => onChange({ ...accessories, [key]: value })

  return (
    <div>
      <h2 className="ab-step-title">Add Accessories</h2>
      <p className="ab-step-subtitle">Complete your {product.name} package with boxes and bags</p>

      {/* Box Type */}
      <div className="ab-accessory-section">
        <div className="ab-spec-label">Box Type</div>
        <div className="ab-accessory-grid">
          {boxOptions.map(opt => (
            <div
              key={opt.id}
              className={`ab-accessory-card${accessories.boxType === opt.id ? ' selected' : ''}`}
              onClick={() => set('boxType', opt.id)}
            >
              <div className="ab-accessory-icon">
                {opt.id === 'none' ? noIcon : boxIcon}
              </div>
              <div className="ab-accessory-name">{opt.label}</div>
              <div className="ab-accessory-desc">{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bag Type */}
      <div className="ab-accessory-section">
        <div className="ab-spec-label">Bag Type</div>
        <div className="ab-accessory-grid">
          {bagOptions.map(opt => (
            <div
              key={opt.id}
              className={`ab-accessory-card${accessories.bagType === opt.id ? ' selected' : ''}`}
              onClick={() => set('bagType', opt.id)}
            >
              <div className="ab-accessory-icon">
                {opt.id === 'none' ? noIcon : bagIcon}
              </div>
              <div className="ab-accessory-name">{opt.label}</div>
              <div className="ab-accessory-desc">{opt.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
