import { useState, useRef, useEffect, useCallback } from 'react'
import { sizeLabels, bindingDescriptions } from '../../data/pdpOptions'

/* ── Chevron icon that rotates ── */
function ChevronDown({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      className={`pdp-accordion__chevron${open ? ' pdp-accordion__chevron--open' : ''}`}
    >
      <path d="M4.5 6.75L9 11.25l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Occasion display names ── */
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

/* ── Individual accordion panel ── */
function AccordionPanel({ id, title, open, onToggle, children }) {
  const contentRef = useRef(null)
  const [maxHeight, setMaxHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setMaxHeight(open ? contentRef.current.scrollHeight : 0)
    }
  }, [open])

  // Recalc on content change
  useEffect(() => {
    if (!open || !contentRef.current) return
    const ro = new ResizeObserver(() => {
      if (contentRef.current) setMaxHeight(contentRef.current.scrollHeight)
    })
    ro.observe(contentRef.current)
    return () => ro.disconnect()
  }, [open])

  return (
    <div className={`pdp-accordion__item${open ? ' pdp-accordion__item--open' : ''}`}>
      <button
        className="pdp-accordion__header"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        aria-controls={`accordion-panel-${id}`}
      >
        <span className="pdp-accordion__title">{title}</span>
        <ChevronDown open={open} />
      </button>
      <div
        id={`accordion-panel-${id}`}
        className="pdp-accordion__body"
        style={{ maxHeight: `${maxHeight}px` }}
        role="region"
        aria-labelledby={`accordion-header-${id}`}
      >
        <div className="pdp-accordion__content" ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ── Section: Features & Details ── */
function FeaturesContent({ product }) {
  if (!product.features?.length) return <p className="pdp-accordion__empty">No feature details available.</p>
  return (
    <ul className="pdp-accordion__list">
      {product.features.map((f, i) => (
        <li key={i}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pdp-accordion__check">
            <path d="M13 4L6.125 11L3 7.818" stroke="var(--brand-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {f}
        </li>
      ))}
    </ul>
  )
}

/* ── Section: Available Sizes ── */
function SizesContent({ product }) {
  if (!product.sizes?.length) return <p className="pdp-accordion__empty">No size information available.</p>
  return (
    <div className="pdp-accordion__sizes-grid">
      {product.sizes.map(s => {
        const info = sizeLabels[s]
        return (
          <div key={s} className="pdp-accordion__size-card">
            <span className="pdp-accordion__size-label">{info?.label || s}</span>
            <span className="pdp-accordion__size-format">{info?.format || ''}</span>
            {info?.printArea && (
              <span className="pdp-accordion__size-detail">Print area: {info.printArea}</span>
            )}
            {info?.cm && (
              <span className="pdp-accordion__size-detail">{info.cm}</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Section: Materials & Finishing ── */
function MaterialsContent({ product }) {
  const materialDescriptions = {
    'Leather': 'Full-grain leather cover with a rich, timeless finish. Durable and elegant, leather ages beautifully over time.',
    'Suede': 'Soft, velvety suede surface with a luxurious tactile feel. Offers a sophisticated matte texture.',
    'Linen': 'Woven linen textile cover with a natural, organic texture. Professional and understated.',
    'Canvas': 'Durable canvas material with a textured surface. Provides a contemporary, artistic feel.',
    'Printed Paper': 'High-quality printed paper cover with vibrant, full-color reproduction. Cost-effective and versatile.',
    'Signature': "Canvera's proprietary material blend combining durability with a premium hand-feel.",
    'Fabric': 'Premium fabric-wrapped cover with refined textile texture. Elegant and refined.',
    'Acrylic': 'Crystal-clear acrylic front panel showcasing your photo with stunning clarity and depth.',
    'Wood': 'Natural wood veneer cover with unique grain patterns. Each album is one-of-a-kind.',
  }

  return (
    <div className="pdp-accordion__material">
      {product.material && (
        <div className="pdp-accordion__material-block">
          <h4 className="pdp-accordion__subtitle">{product.material}</h4>
          {materialDescriptions[product.material] && (
            <p className="pdp-accordion__text">{materialDescriptions[product.material]}</p>
          )}
        </div>
      )}
      {product.printTypes?.length > 0 && (
        <div className="pdp-accordion__material-block">
          <h4 className="pdp-accordion__subtitle">Print Technology</h4>
          <p className="pdp-accordion__text">{product.printTypes.join(', ')}</p>
        </div>
      )}
      {product.colorOptions?.length > 0 && (
        <div className="pdp-accordion__material-block">
          <h4 className="pdp-accordion__subtitle">Available Colors</h4>
          <div className="pdp-accordion__color-list">
            {product.colorOptions.map((c, i) => (
              <span key={i} className="pdp-accordion__color-tag">{c}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Section: Packaging ── */
function PackagingContent({ product }) {
  const hasBox = product.boxType && product.boxType !== 'Not included'
  const hasBag = product.bagType && product.bagType !== 'Not included'

  if (!hasBox && !hasBag) {
    return <p className="pdp-accordion__text">Standard packaging included with every order.</p>
  }

  return (
    <div className="pdp-accordion__packaging">
      {hasBox && (
        <div className="pdp-accordion__pack-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="7" width="16" height="11" rx="2" stroke="var(--brand-teal)" strokeWidth="1.3" />
            <path d="M2 7l8-5 8 5" stroke="var(--brand-teal)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 2v16" stroke="var(--brand-teal)" strokeWidth="1.3" />
          </svg>
          <div>
            <span className="pdp-accordion__pack-label">Box</span>
            <span className="pdp-accordion__pack-value">{product.boxType}</span>
          </div>
        </div>
      )}
      {hasBag && (
        <div className="pdp-accordion__pack-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="7" width="14" height="11" rx="2" stroke="var(--brand-teal)" strokeWidth="1.3" />
            <path d="M7 7V5a3 3 0 016 0v2" stroke="var(--brand-teal)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <div>
            <span className="pdp-accordion__pack-label">Bag</span>
            <span className="pdp-accordion__pack-value">{product.bagType}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Section: Customization ── */
function CustomizationContent({ product }) {
  if (!product.customization?.length) {
    return <p className="pdp-accordion__text">Contact us for custom options available for this product.</p>
  }
  return (
    <ul className="pdp-accordion__list">
      {product.customization.map((item, i) => (
        <li key={i}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="pdp-accordion__check">
            <path d="M13 4L6.125 11L3 7.818" stroke="var(--brand-teal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  )
}

/* ── Main Accordion Export ── */
const SECTIONS = [
  { id: 'features', title: 'Features & Details' },
  { id: 'sizes', title: 'Available Sizes' },
  { id: 'materials', title: 'Materials & Finishing' },
  { id: 'packaging', title: 'Packaging' },
  { id: 'customization', title: 'Customization' },
]

export default function ProductDetailTabs({ product }) {
  const [openId, setOpenId] = useState(null)

  const handleToggle = useCallback((id) => {
    setOpenId(prev => prev === id ? null : id)
  }, [])

  const renderContent = (id) => {
    switch (id) {
      case 'features': return <FeaturesContent product={product} />
      case 'sizes': return <SizesContent product={product} />
      case 'materials': return <MaterialsContent product={product} />
      case 'packaging': return <PackagingContent product={product} />
      case 'customization': return <CustomizationContent product={product} />
      default: return null
    }
  }

  return (
    <div className="pdp-accordion">
      {SECTIONS.map(section => (
        <AccordionPanel
          key={section.id}
          id={section.id}
          title={section.title}
          open={openId === section.id}
          onToggle={handleToggle}
        >
          {renderContent(section.id)}
        </AccordionPanel>
      ))}
    </div>
  )
}
