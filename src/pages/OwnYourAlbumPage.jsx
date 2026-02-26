import { useState, useCallback, useMemo } from 'react'
import products from '../data/products'
import StepProgress from '../components/album-builder/StepProgress'
import StepChooseProduct from '../components/album-builder/StepChooseProduct'
import StepSpecifications from '../components/album-builder/StepSpecifications'
import StepPersonalize from '../components/album-builder/StepPersonalize'
import StepAccessories from '../components/album-builder/StepAccessories'
import StepReview from '../components/album-builder/StepReview'
import '../styles/album-builder.css'

const emptySpecs = { size: null, orientation: null, binding: null, printType: null }
const emptyPersonalize = { color: null, designStyle: null, customizations: [] }
const emptyAccessories = { boxType: null, bagType: null }

export default function OwnYourAlbumPage() {
  const [step, setStep] = useState(1)
  const [maxReached, setMaxReached] = useState(1)
  const [productId, setProductId] = useState(null)
  const [specs, setSpecs] = useState(emptySpecs)
  const [personalize, setPersonalize] = useState(emptyPersonalize)
  const [accessories, setAccessories] = useState(emptyAccessories)

  const product = useMemo(
    () => products.find(p => p.id === productId) || null,
    [productId]
  )

  const goTo = useCallback((s) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goNext = useCallback(() => {
    const next = step + 1
    setStep(next)
    setMaxReached(prev => Math.max(prev, next))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const goBack = useCallback(() => {
    setStep(s => Math.max(1, s - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSelectProduct = useCallback((id) => {
    if (id !== productId) {
      setProductId(id)
      setSpecs(emptySpecs)
      setPersonalize(emptyPersonalize)
      setAccessories(emptyAccessories)
    }
  }, [productId])

  // Can proceed to next step?
  const canNext = useMemo(() => {
    switch (step) {
      case 1: return !!productId
      case 2: return true // specs optional
      case 3: return true // personalization optional
      case 4: return true // accessories optional
      default: return false
    }
  }, [step, productId])

  const backSvg = (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  const nextSvg = (
    <svg viewBox="0 0 16 16" fill="none">
      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <div className="album-builder">
      <StepProgress current={step} onGoTo={goTo} maxReached={maxReached} />

      <div className="ab-content">
        {step === 1 && (
          <StepChooseProduct selectedId={productId} onSelect={handleSelectProduct} />
        )}
        {step === 2 && (
          <StepSpecifications product={product} specs={specs} onChange={setSpecs} />
        )}
        {step === 3 && (
          <StepPersonalize product={product} personalize={personalize} onChange={setPersonalize} />
        )}
        {step === 4 && (
          <StepAccessories product={product} accessories={accessories} onChange={setAccessories} />
        )}
        {step === 5 && (
          <StepReview
            product={product}
            specs={specs}
            personalize={personalize}
            accessories={accessories}
          />
        )}

        {/* Navigation */}
        {step < 5 && (
          <div className="ab-nav">
            {step > 1 ? (
              <button className="ab-btn-back" onClick={goBack}>
                {backSvg} Back
              </button>
            ) : <span />}
            <button
              className="ab-btn-next"
              disabled={!canNext}
              onClick={goNext}
            >
              {step === 4 ? 'Review' : 'Continue'} {nextSvg}
            </button>
          </div>
        )}
        {step === 5 && (
          <div className="ab-nav">
            <button className="ab-btn-back" onClick={goBack}>
              {backSvg} Back to Accessories
            </button>
            <span />
          </div>
        )}
      </div>
    </div>
  )
}
