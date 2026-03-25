import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import products from '../../data/products'
import occasions from '../../data/occasions'
import { productSvgs } from '../home/ProductCard'
import '../../styles/product-finder.css'

const occasionCards = [
  { id: 'weddings', label: 'Weddings', icon: <svg viewBox="0 0 32 32" fill="none"><path d="M16 4c-3 0-5 3-5 7 0 5 5 9 5 9s5-4 5-9c0-4-2-7-5-7z" stroke="currentColor" strokeWidth="1.5"/><path d="M8 28c0-4 3.5-8 8-8s8 4 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { id: 'pre-wedding', label: 'Pre-Wedding', icon: <svg viewBox="0 0 32 32" fill="none"><circle cx="11" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><circle cx="21" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M6 28c0-3 2.5-6 5-6 1.5 0 3 1 5 1s3.5-1 5-1c2.5 0 5 3 5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { id: 'baby-kids', label: 'Baby & Kids', icon: <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="14" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M12 14c0 2 1.8 4 4 4s4-2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="13" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><path d="M11 6c-1-2 0-4 2-3M21 6c1-2 0-4-2-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: 'maternity', label: 'Maternity', icon: <svg viewBox="0 0 32 32" fill="none"><path d="M16 6a3 3 0 100 6 3 3 0 000-6z" stroke="currentColor" strokeWidth="1.5"/><path d="M12 14c0 0 0 6 1 10h6c1-4 1-10 1-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 19h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: 'birthdays', label: 'Birthdays', icon: <svg viewBox="0 0 32 32" fill="none"><rect x="6" y="16" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 20h20" stroke="currentColor" strokeWidth="1.2"/><path d="M12 16v-3M16 16v-5M20 16v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="11" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="16" cy="9" r="1.5" fill="currentColor" opacity="0.5"/><circle cx="20" cy="11" r="1.5" fill="currentColor" opacity="0.5"/></svg> },
  { id: 'corporate', label: 'Corporate', icon: <svg viewBox="0 0 32 32" fill="none"><rect x="6" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 14h20M12 8V6M20 8V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  { id: 'portraits-family', label: 'Family', icon: <svg viewBox="0 0 32 32" fill="none"><circle cx="10" cy="11" r="3" stroke="currentColor" strokeWidth="1.4"/><circle cx="22" cy="11" r="3" stroke="currentColor" strokeWidth="1.4"/><circle cx="16" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 28c0-3 2-5.5 5-5.5s5 2.5 5 5.5M17 28c0-3 2-5.5 5-5.5s5 2.5 5 5.5M11 28c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
]

const attributeCards = [
  { id: 'premium', label: 'Premium Quality', desc: 'Top-tier materials & craftsmanship', icon: <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 6.5 1-4.7 4.6 1.1 6.5L12 17l-5.9 3.1 1.1-6.5L2.5 9l6.5-1L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
  { id: 'value', label: 'Best Value', desc: 'Quality at accessible price', icon: <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M9 10c0-1.5 1.3-2.5 3-2.5s3 1 3 2.5-1.3 2-3 2.5v2M12 18v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  { id: 'customizable', label: 'Customizable', desc: 'Personalize your album', icon: <svg viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10-4-4L4 16v4zM14 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { id: 'gift', label: 'Gift-Ready', desc: 'Perfect for gifting', icon: <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="10" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 14h18M12 10v11" stroke="currentColor" strokeWidth="1.3"/><path d="M12 10c-3-4-7-3-5 0h5zM12 10c3-4 7-3 5 0h-5z" stroke="currentColor" strokeWidth="1.3"/></svg> },
]

export default function ProductFinder({ onClose }) {
  const [step, setStep] = useState(1)
  const [selectedOccasion, setSelectedOccasion] = useState(null)
  const [selectedAttrs, setSelectedAttrs] = useState([])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape to close
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  const toggleAttr = (id) => {
    setSelectedAttrs(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const results = useMemo(() => {
    let pool = [...products]

    // Filter by occasion
    if (selectedOccasion) {
      const occ = occasions.find(o => o.id === selectedOccasion)
      if (occ) pool = pool.filter(p => occ.productIds.includes(p.id))
    }

    // Filter by attributes
    selectedAttrs.forEach(attr => {
      switch (attr) {
        case 'premium':
          pool = pool.filter(p => p.badge === 'bestseller' || p.category === 'Photobooks')
          break
        case 'value':
          pool = pool.filter(p => p.category === 'Momentbooks' || p.category === 'Magazines')
          break
        case 'customizable':
          pool = pool.filter(p => p.customization?.length > 0)
          break
        case 'gift':
          pool = pool.filter(p => p.category === 'Decor & Gifts' || p.category === 'Calendars')
          break
        default:
          break
      }
    })

    return pool
  }, [selectedOccasion, selectedAttrs])

  const handleReset = useCallback(() => {
    setStep(1)
    setSelectedOccasion(null)
    setSelectedAttrs([])
  }, [])

  return (
    <div className="finder-overlay">
      <div className="finder-backdrop" onClick={onClose} />
      <div className="finder-container">
        {/* Header */}
        <div className="finder-header">
          <div>
            <h2>Product Finder</h2>
            <p className="finder-subtitle">Let us help you find the perfect product</p>
          </div>
          <button className="finder-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="finder-steps">
          {[1, 2, 3].map(s => (
            <div key={s} className={`finder-step-dot${step >= s ? ' active' : ''}${step === s ? ' current' : ''}`}>
              {step > s ? (
                <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : s}
            </div>
          ))}
          <div className="finder-step-line" style={{ width: `${(step - 1) * 50}%` }} />
        </div>

        {/* Step Content */}
        <div className="finder-body">
          {step === 1 && (
            <div className="finder-step-content">
              <h3>What's the occasion?</h3>
              <p className="finder-step-desc">Choose the type of event or occasion for your album</p>
              <div className="finder-occasion-grid">
                {occasionCards.map(occ => (
                  <button
                    key={occ.id}
                    className={`finder-card${selectedOccasion === occ.id ? ' selected' : ''}`}
                    onClick={() => { setSelectedOccasion(occ.id); setStep(2) }}
                  >
                    <div className="finder-card-icon">{occ.icon}</div>
                    <span className="finder-card-label">{occ.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="finder-step-content">
              <h3>What matters most to you?</h3>
              <p className="finder-step-desc">Select up to 3 preferences to refine your results</p>
              <div className="finder-attr-grid">
                {attributeCards.map(attr => (
                  <button
                    key={attr.id}
                    className={`finder-attr-card${selectedAttrs.includes(attr.id) ? ' selected' : ''}`}
                    onClick={() => toggleAttr(attr.id)}
                  >
                    <div className="finder-attr-icon">{attr.icon}</div>
                    <span className="finder-attr-label">{attr.label}</span>
                    <span className="finder-attr-desc">{attr.desc}</span>
                  </button>
                ))}
              </div>
              <div className="finder-actions">
                <button className="finder-back" onClick={() => setStep(1)}>
                  <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back
                </button>
                <button className="finder-next" onClick={() => setStep(3)}>
                  See Results ({results.length})
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="finder-step-content">
              <div className="finder-results-header">
                <h3>Your Matches ({results.length})</h3>
                <button className="finder-reset" onClick={handleReset}>Start Over</button>
              </div>
              {results.length > 0 ? (
                <div className="finder-results-grid">
                  {results.map(product => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="finder-result-card"
                      onClick={onClose}
                    >
                      <div className={`finder-result-image pc-img-${product.imageVariant}`}>
                        {productSvgs[product.imageVariant] || productSvgs.petrol}
                      </div>
                      <div className="finder-result-body">
                        <span className="finder-result-tag">{product.tag}</span>
                        <span className="finder-result-name">{product.name}</span>
                        <span className="finder-result-specs">{product.specs}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="finder-no-results">
                  <p>No products match your criteria. Try different preferences.</p>
                  <button className="finder-back" onClick={() => setStep(2)}>
                    <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Adjust Preferences
                  </button>
                </div>
              )}
              <div className="finder-actions">
                <button className="finder-back" onClick={() => setStep(2)}>
                  <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Back
                </button>
                <Link to="/shop" className="finder-browse-all" onClick={onClose}>
                  View All Products
                  <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
