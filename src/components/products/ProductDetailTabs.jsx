import { useState } from 'react'
import { sizeLabels, orientationOptions, bindingDescriptions } from '../../data/pdpOptions'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specs', label: 'Specifications' },
  { id: 'features', label: 'Features & Benefits' },
  { id: 'material', label: 'Material & Care' },
]

const occasionNames = {
  'weddings': 'Weddings',
  'pre-wedding': 'Pre-Wedding Shoots',
  'portraits-family': 'Family Portraits',
  'baby-kids': 'Baby & Kids',
  'maternity': 'Maternity',
  'corporate': 'Corporate Events',
  'travel': 'Travel',
  'graduation': 'Graduation',
  'housewarming': 'Housewarming',
  'fashion': 'Fashion & Portfolio',
}

const materialDescriptions = {
  'Leather': 'Full-grain leather cover with a rich, timeless finish. Durable and elegant, leather ages beautifully over time.',
  'Suede': 'Soft, velvety suede surface with a luxurious tactile feel. Offers a sophisticated matte texture.',
  'Linen': 'Woven linen textile cover with a natural, organic texture. Professional and understated.',
  'Canvas': 'Durable canvas material with a textured surface. Provides a contemporary, artistic feel.',
  'Printed Paper': 'High-quality printed paper cover with vibrant, full-color reproduction. Cost-effective and versatile.',
  'Signature': 'Canvera\'s proprietary material blend combining durability with a premium hand-feel.',
  'Fabric': 'Premium fabric-wrapped cover with refined textile texture. Elegant and refined.',
  'Acrylic': 'Crystal-clear acrylic front panel showcasing your photo with stunning clarity and depth.',
  'Wood': 'Natural wood veneer cover with unique grain patterns. Each album is one-of-a-kind.',
}

const careInstructions = {
  'Leather': ['Store flat in a cool, dry place', 'Avoid direct sunlight to prevent fading', 'Clean gently with a soft dry cloth', 'Use leather conditioner annually for longevity'],
  'Suede': ['Store flat away from moisture', 'Use a soft brush to remove dust', 'Avoid contact with liquids', 'Keep away from direct heat sources'],
  'Linen': ['Store flat in a dust-free environment', 'Spot clean with a damp cloth if needed', 'Avoid prolonged sunlight exposure', 'Handle with clean, dry hands'],
  'Canvas': ['Store flat in a clean, dry area', 'Wipe with a slightly damp cloth', 'Allow to air dry completely', 'Avoid sharp objects near the surface'],
  'Printed Paper': ['Store flat away from humidity', 'Avoid touching printed surfaces with oily hands', 'Keep out of direct sunlight', 'Handle by edges when possible'],
  'default': ['Store flat in a cool, dry environment', 'Keep away from direct sunlight', 'Handle with clean hands', 'Avoid exposure to moisture'],
}

const colorHex = {
  'Midnight Black': '#1a1a2e', 'Charcoal': '#36454f', 'Slate Gray': '#708090',
  'Ivory': '#fffff0', 'Cream': '#fffdd0', 'Pearl White': '#f0efe9',
  'Midnight Blue': '#191970', 'Deep Navy': '#000080', 'Oxford Blue': '#002147',
  'Natural Tan': '#d2b48c', 'Saddle Brown': '#8b4513', 'Honey': '#eb9605',
  'Burgundy': '#800020', 'Wine Red': '#722f37', 'Oxblood': '#4a0000',
  'Navy': '#000080', 'Royal Blue': '#4169e1', 'Denim Blue': '#1560bd',
  'Stone Gray': '#928e85', 'Graphite': '#383838',
  'Marigold': '#EAA221', 'Mulberry Red': '#7B2D4B', 'Umber Brown': '#6D4C3D',
  'Stone Blue': '#6B8BA4', 'Sienna': '#A0522D', 'Warm Ivory': '#F5E6CC',
  'Forest Green': '#228B22', 'Dusty Rose': '#DCAE96', 'Sage': '#87AE73',
  'Teal': '#008080', 'Copper': '#B87333',
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 4.5L6.75 12.75L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OverviewTab({ product }) {
  return (
    <div className="pdp-tab-panel">
      {product.description && (
        <div className="pdp-tab-section">
          <p className="pdp-tab-description">{product.description}</p>
        </div>
      )}

      {product.features?.length > 0 && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Key Features</h3>
          <div className="pdp-tab-grid">
            {product.features.map((feature, i) => (
              <div key={i} className="pdp-tab-grid-item">
                <span className="pdp-tab-check-icon"><CheckIcon /></span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.customization?.length > 0 && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Customization</h3>
          <ul className="pdp-tab-list">
            {product.customization.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {product.occasions?.length > 0 && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Ideal For</h3>
          <div className="pdp-tab-pill-row">
            {product.occasions.map((occ, i) => (
              <span key={i} className="pdp-tab-pill">
                {occasionNames[occ] || occ}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SpecificationsTab({ product }) {
  const sizeDisplay = product.sizes
    ?.map((s) => sizeLabels[s]?.label || s)
    .join(', ')

  const rows = [
    { label: 'Category', value: product.category },
    { label: 'Type', value: product.tag },
    { label: 'Material', value: product.material },
    { label: 'Print Technology', value: product.printTypes?.join(', ') || '\u2014' },
    { label: 'Available Sizes', value: sizeDisplay || '\u2014' },
    { label: 'Orientations', value: product.orientations?.join(', ') || '\u2014' },
    { label: 'Bindings', value: product.bindings?.join(', ') || '\u2014' },
    { label: 'Design Styles', value: product.designCount || '\u2014' },
    { label: 'Box', value: product.boxType || 'Not included' },
    { label: 'Bag', value: product.bagType || 'Not included' },
    { label: 'Rating', value: product.rating ? `${product.rating} / 5 (${product.reviewCount}+ reviews)` : '\u2014' },
    { label: 'Delivery', value: '5\u20137 business days' },
    { label: 'Design Service', value: 'Free included' },
  ]

  return (
    <div className="pdp-tab-panel">
      <div className="pdp-tab-section">
        <table className="pdp-tab-spec-table">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td className="pdp-tab-spec-label">{row.label}</td>
                <td className="pdp-tab-spec-value">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FeaturesTab({ product }) {
  return (
    <div className="pdp-tab-panel">
      {product.features?.length > 0 && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Features</h3>
          <div className="pdp-tab-feature-list">
            {product.features.map((feature, i) => (
              <div key={i} className="pdp-tab-feature-card">
                <span className="pdp-tab-check-icon"><CheckIcon /></span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {product.bindings?.length > 0 && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Binding Options</h3>
          {product.bindings.map((binding, i) => {
            const info = bindingDescriptions[binding]
            if (!info) return null
            return (
              <div key={i} className="pdp-tab-binding-block">
                <h4 className="pdp-tab-binding-name">{binding}</h4>
                <p className="pdp-tab-binding-desc">{info.description}</p>
                <ul className="pdp-tab-list">
                  {info.specs.map((spec, j) => (
                    <li key={j}>{spec}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      {(product.designCount || product.customization?.length > 0) && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Design Flexibility</h3>
          {product.designCount && (
            <p className="pdp-tab-text">
              {product.designCount} professionally designed templates available to choose from.
            </p>
          )}
          {product.customization?.length > 0 && (
            <ul className="pdp-tab-list">
              {product.customization.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {product.occasions?.length > 0 && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Perfect For</h3>
          <div className="pdp-tab-pill-row">
            {product.occasions.map((occ, i) => (
              <span key={i} className="pdp-tab-pill">
                {occasionNames[occ] || occ}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function MaterialCareTab({ product }) {
  const materialDesc = materialDescriptions[product.material]
  const care = careInstructions[product.material] || careInstructions['default']

  return (
    <div className="pdp-tab-panel">
      {product.material && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">{product.material}</h3>
          {materialDesc && (
            <p className="pdp-tab-text">{materialDesc}</p>
          )}
        </div>
      )}

      {product.colorOptions?.length > 0 && (
        <div className="pdp-tab-section">
          <h3 className="pdp-tab-section-title">Available Colors</h3>
          <div className="pdp-tab-swatch-row">
            {product.colorOptions.map((color, i) => (
              <div key={i} className="pdp-tab-swatch">
                <span
                  className="pdp-tab-swatch-circle"
                  style={{ backgroundColor: colorHex[color] || '#ccc' }}
                  title={color}
                />
                <span className="pdp-tab-swatch-name">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pdp-tab-section">
        <h3 className="pdp-tab-section-title">Care Instructions</h3>
        <ul className="pdp-tab-list">
          {care.map((instruction, i) => (
            <li key={i}>{instruction}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function ProductDetailTabs({ product }) {
  const [activeTab, setActiveTab] = useState('overview')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab product={product} />
      case 'specs':
        return <SpecificationsTab product={product} />
      case 'features':
        return <FeaturesTab product={product} />
      case 'material':
        return <MaterialCareTab product={product} />
      default:
        return null
    }
  }

  return (
    <div className="pdp-detail-tabs">
      <div className="pdp-tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`pdp-tab-btn${activeTab === tab.id ? ' pdp-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}
    </div>
  )
}
