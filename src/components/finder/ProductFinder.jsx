import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import products from '../../data/products'
import occasions from '../../data/occasions'
import { materialRanges } from '../../data/builderOptions'
import { sizeLabels } from '../../data/pdpOptions'
import { productSvgs } from '../home/ProductCard'
import '../../styles/product-finder.css'

const occasionCards = [
  { id: 'weddings', label: 'Weddings', gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)' },
  { id: 'pre-wedding', label: 'Pre-Wedding', gradient: 'linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)' },
  { id: 'baby-kids', label: 'Baby & Kids', gradient: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' },
  { id: 'maternity', label: 'Maternity', gradient: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)' },
  { id: 'birthdays', label: 'Birthdays', gradient: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)' },
  { id: 'corporate', label: 'Corporate', gradient: 'linear-gradient(135deg, #eceff1 0%, #cfd8dc 100%)' },
  { id: 'portraits-family', label: 'Family', gradient: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' },
]

const materialCards = materialRanges.slice(0, 8).map((m) => ({
  id: m.id,
  label: m.name,
  desc: m.description,
  swatch: m.swatch,
}))

const sizeCards = Object.entries(sizeLabels).slice(0, 6).map(([id, info]) => ({
  id,
  label: info.label || id,
  dims: info.dims || id,
}))

const budgetOptions = [
  { id: 'under3k', label: 'Under Rs 3K', max: 3000 },
  { id: '3k-5k', label: 'Rs 3K -- 5K', min: 3000, max: 5000 },
  { id: '5k-8k', label: 'Rs 5K -- 8K', min: 5000, max: 8000 },
  { id: '8k+', label: 'Rs 8K+', min: 8000 },
]

const TOTAL_STEPS = 4

export default function ProductFinder({ onClose }) {
  const [step, setStep] = useState(1)
  const [selectedOccasion, setSelectedOccasion] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedBudget, setSelectedBudget] = useState(null)

  // Lock body scroll when used as overlay
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape to close
  useEffect(() => {
    if (!onClose) return
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  const results = useMemo(() => {
    let pool = [...products]

    if (selectedOccasion) {
      const occ = occasions.find((o) => o.id === selectedOccasion)
      if (occ) pool = pool.filter((p) => occ.productIds.includes(p.id))
    }

    if (selectedMaterial) {
      pool = pool.filter((p) => p.material === selectedMaterial)
    }

    if (selectedSize) {
      pool = pool.filter((p) => p.sizes?.includes(selectedSize))
    }

    // Simple match scoring
    return pool.slice(0, 6).map((p) => {
      let score = 0
      if (selectedOccasion) score += 30
      if (selectedMaterial && p.material === selectedMaterial) score += 25
      if (selectedSize && p.sizes?.includes(selectedSize)) score += 20
      score += Math.floor(Math.random() * 15) + 10 // add some variation
      return { ...p, matchPercent: Math.min(score, 98) }
    })
  }, [selectedOccasion, selectedMaterial, selectedSize, selectedBudget])

  const handleReset = useCallback(() => {
    setStep(1)
    setSelectedOccasion(null)
    setSelectedMaterial(null)
    setSelectedSize(null)
    setSelectedBudget(null)
  }, [])

  const goBack = () => setStep((s) => Math.max(1, s - 1))
  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS + 1, s + 1))

  return (
    <div className="finder-overlay">
      {onClose && <div className="finder-backdrop" onClick={onClose} />}
      <div className="finder-container">
        {/* Close button */}
        {onClose && (
          <button className="finder-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        )}

        {/* Progress dots */}
        {step <= TOTAL_STEPS && (
          <div className="finder-progress">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`finder-dot${step > i + 1 ? ' done' : ''}${step === i + 1 ? ' active' : ''}`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Occasion */}
        {step === 1 && (
          <div className="finder-step">
            <h2 className="display-md">What's the occasion?</h2>
            <div className="finder-occasion-grid">
              {occasionCards.map((occ) => (
                <button
                  key={occ.id}
                  className={`finder-occ-card${selectedOccasion === occ.id ? ' selected' : ''}`}
                  onClick={() => { setSelectedOccasion(occ.id); setStep(2) }}
                  style={{ background: occ.gradient }}
                >
                  <span className="finder-occ-label">{occ.label}</span>
                </button>
              ))}
            </div>
            <div className="finder-nav">
              <div />
              <button className="btn btn-ghost" onClick={() => { setSelectedOccasion(null); setStep(2) }}>Skip</button>
            </div>
          </div>
        )}

        {/* Step 2: Material */}
        {step === 2 && (
          <div className="finder-step">
            <h2 className="display-md">Choose your material</h2>
            <div className="finder-material-grid">
              {materialCards.map((mat) => (
                <button
                  key={mat.id}
                  className={`finder-mat-card${selectedMaterial === mat.id ? ' selected' : ''}`}
                  onClick={() => setSelectedMaterial(mat.id)}
                >
                  <div className="finder-mat-swatch" style={{ background: mat.swatch }} />
                  <span className="finder-mat-label">{mat.label}</span>
                  <span className="finder-mat-desc">{mat.desc}</span>
                </button>
              ))}
            </div>
            <div className="finder-nav">
              <button className="btn btn-ghost" onClick={goBack}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
              <button className="btn btn-ghost" onClick={() => { setSelectedMaterial(null); goNext() }}>Skip</button>
              {selectedMaterial && (
                <button className="btn btn-primary" onClick={goNext}>
                  Continue
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Size */}
        {step === 3 && (
          <div className="finder-step">
            <h2 className="display-md">What size works best?</h2>
            <div className="finder-size-grid">
              {sizeCards.map((size) => (
                <button
                  key={size.id}
                  className={`finder-size-card${selectedSize === size.id ? ' selected' : ''}`}
                  onClick={() => setSelectedSize(size.id)}
                >
                  <div className="finder-size-visual">
                    <div className="finder-size-rect" />
                  </div>
                  <span className="finder-size-label">{size.label}</span>
                  <span className="finder-size-dims">{size.dims}</span>
                </button>
              ))}
            </div>
            <div className="finder-nav">
              <button className="btn btn-ghost" onClick={goBack}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
              <button className="btn btn-ghost" onClick={() => { setSelectedSize(null); goNext() }}>Skip</button>
              {selectedSize && (
                <button className="btn btn-primary" onClick={goNext}>
                  Continue
                  <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Budget */}
        {step === 4 && (
          <div className="finder-step">
            <h2 className="display-md">Your budget range?</h2>
            <div className="finder-budget-pills">
              {budgetOptions.map((b) => (
                <button
                  key={b.id}
                  className={`finder-budget-pill${selectedBudget === b.id ? ' selected' : ''}`}
                  onClick={() => setSelectedBudget(b.id)}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="finder-nav">
              <button className="btn btn-ghost" onClick={goBack}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
              <button className="btn btn-primary" onClick={goNext}>
                See Results ({results.length})
                <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === TOTAL_STEPS + 1 && (
          <div className="finder-step">
            <div className="finder-results-header">
              <h2 className="display-sm">Products matching your preferences</h2>
              <button className="btn btn-ghost" onClick={handleReset}>Start Over</button>
            </div>
            {results.length > 0 ? (
              <div className="finder-results-grid">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="finder-result-card"
                    onClick={onClose}
                  >
                    <div className={`finder-result-image pc-img-${product.imageVariant}`}>
                      {productSvgs[product.imageVariant] || productSvgs.petrol}
                      <span className="badge badge-accent finder-match-badge">{product.matchPercent}% match</span>
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
              </div>
            )}
            <div className="finder-nav">
              <button className="btn btn-ghost" onClick={() => setStep(4)}>
                <svg viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Back
              </button>
              <Link to="/shop" className="btn btn-secondary" onClick={onClose}>
                View All Products
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
