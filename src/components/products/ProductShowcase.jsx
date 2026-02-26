import { useState } from 'react'

const materialIcons = {
  Leather: <svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 12c4-2 12-2 16 0M8 4v16M16 4v16" stroke="currentColor" strokeWidth="1" opacity="0.4"/></svg>,
  Suede: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M6 9c3 1 9 1 12 0M6 15c3-1 9-1 12 0" stroke="currentColor" strokeWidth="1" opacity="0.4"/></svg>,
  Signature: <svg viewBox="0 0 24 24" fill="none"><path d="M3 17l4-4c2-2 4 0 6-2s2-4 4-4 3 2 4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  'Printed Paper with Foiling': <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M14 15l3-3 2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  'Printed Paper': <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Canvas: <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 15l5-4 3 2 5-4 5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

const orientationIcons = {
  Landscape: <svg viewBox="0 0 32 24" fill="none"><rect x="1" y="3" width="30" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
  Portrait: <svg viewBox="0 0 20 28" fill="none"><rect x="1" y="1" width="18" height="26" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
  Square: <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
}

const colorMap = {
  Sienna: '#A0522D',
  'Warm Ivory': '#F5F0E1',
  'Fern Green': '#4F7942',
  Marigold: '#EAA221',
  'Mulberry Red': '#C0392B',
  'Umber Brown': '#6B4226',
  'Stone Blue': '#5B7C99',
  'Saddle Brown': '#8B4513',
  Espresso: '#3C2415',
  'Cool Grey': '#8E9AAF',
  'Berry Red': '#8E2451',
}

export default function ProductShowcase({ product }) {
  const [activeTab, setActiveTab] = useState('material')

  const hasMaterial = !!product.material
  const hasColors = product.colorOptions?.length > 0
  const hasSizes = product.sizes?.length > 0
  const hasAccessories = product.boxType || product.bagType
  const hasOrientations = product.orientations?.length > 0
  const hasBindings = product.bindings?.length > 0

  const tabs = [
    hasMaterial && { id: 'material', label: 'Material' },
    hasColors && { id: 'colors', label: 'Colours' },
    hasSizes && { id: 'sizes', label: 'Sizes' },
    hasOrientations && { id: 'orientations', label: 'Orientation' },
    hasBindings && { id: 'bindings', label: 'Binding' },
    hasAccessories && { id: 'accessories', label: 'Accessories' },
  ].filter(Boolean)

  if (tabs.length === 0) return null

  // Ensure activeTab is valid
  const currentTab = tabs.find(t => t.id === activeTab) ? activeTab : tabs[0]?.id

  return (
    <div className="product-showcase">
      <h3 className="showcase-title">Product Details</h3>
      <div className="showcase-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`showcase-tab${currentTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="showcase-content">
        {currentTab === 'material' && (
          <div className="showcase-material">
            <div className="material-card">
              <div className="material-icon">
                {materialIcons[product.material] || materialIcons.Leather}
              </div>
              <div className="material-info">
                <span className="material-name">{product.material}</span>
                <span className="material-desc">
                  {product.material === 'Leather' && 'Premium leather with a rich, tactile feel and natural grain texture that ages beautifully over time.'}
                  {product.material === 'Suede' && 'Soft, velvety suede finish with a warm, tactile surface that adds understated luxury.'}
                  {product.material === 'Signature' && 'Canvera\'s exclusive Signature material — available in 13 rich colours with a distinctive texture.'}
                  {product.material === 'Printed Paper with Foiling' && 'High-quality printed paper enhanced with metallic foiling accents for added sophistication.'}
                  {product.material === 'Printed Paper' && 'Professional-grade printed paper with vibrant colour reproduction and sharp detail.'}
                  {product.material === 'Canvas' && 'Premium cotton-blend canvas with archival-grade inks for museum-quality prints.'}
                  {!['Leather', 'Suede', 'Signature', 'Printed Paper with Foiling', 'Printed Paper', 'Canvas'].includes(product.material) && `High-quality ${product.material} construction.`}
                </span>
              </div>
            </div>
            {product.printTypes?.length > 0 && (
              <div className="showcase-print-types">
                <span className="showcase-label">Print Technology</span>
                <div className="showcase-chips">
                  {product.printTypes.map(pt => (
                    <span key={pt} className="showcase-chip">{pt}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentTab === 'colors' && (
          <div className="showcase-colors">
            <div className="color-grid">
              {product.colorOptions.map(color => (
                <div key={color} className="color-swatch-item">
                  <span
                    className="color-swatch"
                    style={{
                      background: colorMap[color] || '#ccc',
                      border: color === 'Warm Ivory' ? '1.5px solid var(--neutral-200)' : 'none',
                    }}
                  />
                  <span className="color-name">{color}</span>
                </div>
              ))}
            </div>
            <p className="showcase-note">Colours may slightly vary from the images shown</p>
          </div>
        )}

        {currentTab === 'sizes' && (
          <div className="showcase-sizes">
            <div className="size-grid">
              {product.sizes.map(size => (
                <div key={size} className="size-card">
                  <span className="size-value">{size}</span>
                  <span className="size-unit">{size.includes('oz') ? '' : size.includes('x') ? 'inches' : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'orientations' && (
          <div className="showcase-orientations">
            <div className="orientation-grid">
              {product.orientations.map(ori => (
                <div key={ori} className="orientation-card">
                  <div className="orientation-icon">
                    {orientationIcons[ori] || orientationIcons.Landscape}
                  </div>
                  <span className="orientation-name">{ori}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'bindings' && (
          <div className="showcase-bindings">
            <div className="binding-list">
              {product.bindings.map(bind => (
                <div key={bind} className="binding-item">
                  <svg viewBox="0 0 16 16" fill="none" className="binding-check">
                    <path d="M3.5 8.5L6.5 11L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{bind}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'accessories' && (
          <div className="showcase-accessories">
            {product.boxType && (
              <div className="accessory-card">
                <svg viewBox="0 0 24 24" fill="none" className="accessory-icon">
                  <path d="M3 8l9-4 9 4v8l-9 4-9-4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M12 12V20M3 8l9 4 9-4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <div>
                  <span className="accessory-label">Box</span>
                  <span className="accessory-value">{product.boxType}</span>
                </div>
              </div>
            )}
            {product.bagType && (
              <div className="accessory-card">
                <svg viewBox="0 0 24 24" fill="none" className="accessory-icon">
                  <path d="M6 6h12l2 14H4L6 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div>
                  <span className="accessory-label">Bag</span>
                  <span className="accessory-value">{product.bagType}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Design Styles */}
      {product.designCount > 0 && (
        <div className="showcase-designs">
          <span className="showcase-label">Design Styles</span>
          <div className="design-count-badge">
            <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
            {product.designCount} design {product.designCount === 1 ? 'style' : 'styles'} available
          </div>
        </div>
      )}

      {/* Customization Options */}
      {product.customization?.length > 0 && (
        <div className="showcase-custom">
          <span className="showcase-label">Customization</span>
          <div className="custom-list">
            {product.customization.map((c, i) => (
              <span key={i} className="custom-chip">
                <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
