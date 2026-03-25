import { useState, useReducer, useMemo, useCallback, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Navigate, Link } from 'react-router-dom'
import products from '../data/products'
import { calculatePrice } from '../data/pdpPricing'
import { useCart } from '../context/CartContext'
import OrderStepper from '../components/order/OrderStepper'
import PriceSidebar from '../components/order/PriceSidebar'
import StepFiles from '../components/order/StepFiles'
import StepPaper from '../components/order/StepPaper'
import StepCover from '../components/order/StepCover'
import StepAccessories from '../components/order/StepAccessories'
import StepReview from '../components/order/StepReview'
import '../styles/order-config.css'

const initialConfig = {
  // From PDP
  size: null,
  orientation: null,
  binding: null,
  // Step 1 — Files
  eventDate: '',
  eventType: '',
  eventTitle: '',
  sheets: 20,
  orderType: 'print-ready',
  fileLink: '',
  // Step 2 — Paper
  lamination: null,
  paper: null,
  colorPrinting: '4-Color CMYK',
  specialPaperEnabled: false,
  specialPaperEntries: [],
  // Step 3 — Cover
  coverDesign: null,
  coverMaterial: null,
  coverColor: null,
  coverName1: '',
  coverName2: '',
  namingTreatment: null,
  // Step 4 — Accessories
  boxEnabled: false,
  boxMaterial: null,
  boxColor: null,
  boxType: 'none',
  bagType: 'Standard',
  // Step 5 — Review
  specialInstructions: '',
}

function configReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.key]: action.value }
    case 'SET_MULTIPLE':
      return { ...state, ...action.fields }
    case 'RESET':
      return { ...initialConfig, ...action.overrides }
    default:
      return state
  }
}

function isStepValid(step, config) {
  switch (step) {
    case 0: return true // Files — orderType has default
    case 1: return !!(config.lamination && config.paper)
    case 2: return !!(config.coverName1?.trim())
    case 3: return true // Accessories — all have defaults
    case 4: return true // Review
    default: return false
  }
}

export default function OrderConfigPage() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const product = useMemo(() => products.find(p => p.slug === slug), [slug])

  // Initialize config with PDP selections
  const pdpState = location.state || {}
  const [config, dispatch] = useReducer(configReducer, {
    ...initialConfig,
    size: pdpState.size || product?.sizes?.[0] || null,
    orientation: pdpState.orientation || product?.orientations?.[0] || null,
    binding: pdpState.binding || product?.bindings?.[0] || null,
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!product) return <Navigate to="/shop" replace />

  const onChange = useCallback((key, value) => {
    dispatch({ type: 'SET_FIELD', key, value })
  }, [])

  const goToStep = useCallback((step) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const goNext = useCallback(() => {
    if (isStepValid(currentStep, config)) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])])
      setCurrentStep(prev => Math.min(4, prev + 1))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep, config])

  const goBack = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleSaveToCart = useCallback(() => {
    const pricing = calculatePrice(config, product.id)
    addToCart(product, {
      ...config,
      complete: true,
      price: pricing.total,
    })
    navigate('/cart')
  }, [config, product, addToCart, navigate])

  const handleProceedCheckout = useCallback(() => {
    const pricing = calculatePrice(config, product.id)
    addToCart(product, {
      ...config,
      complete: true,
      price: pricing.total,
    })
    navigate('/checkout')
  }, [config, product, addToCart, navigate])

  const canNext = isStepValid(currentStep, config)
  const isReview = currentStep === 4

  return (
    <div className="oc-page">
      {/* Page Header */}
      <div className="oc-page-header">
        <div className="oc-page-header-inner">
          <Link to={`/product/${product.slug}`} className="oc-back-link">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <div>
            <h1 className="oc-page-title">
              {isReview ? 'Order Review' : `Configure ${product.name}`}
            </h1>
            <div className="oc-page-subtitle">{product.tag}</div>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="oc-stepper-wrap">
        <OrderStepper
          current={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      {/* Content */}
      <div className="oc-content">
        <div className="oc-content-inner">
          {/* Left: Step content */}
          <div className="oc-main">
            {currentStep === 0 && <StepFiles config={config} onChange={onChange} />}
            {currentStep === 1 && <StepPaper config={config} onChange={onChange} />}
            {currentStep === 2 && <StepCover config={config} onChange={onChange} product={product} />}
            {currentStep === 3 && <StepAccessories config={config} onChange={onChange} />}
            {currentStep === 4 && (
              <StepReview
                config={config}
                product={product}
                onChange={onChange}
                onGoToStep={goToStep}
                onSaveToCart={handleSaveToCart}
                onProceedCheckout={handleProceedCheckout}
              />
            )}

            {/* Navigation (not on review step — review has its own) */}
            {!isReview && (
              <div className="oc-step-nav">
                {currentStep > 0 ? (
                  <button className="oc-btn oc-btn--outline" onClick={goBack}>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                  </button>
                ) : <span />}
                <button
                  className={`oc-btn oc-btn--primary${!canNext ? ' oc-btn--muted' : ''}`}
                  disabled={!canNext}
                  onClick={goNext}
                >
                  {currentStep === 3 ? 'Review' : 'Next'}
                  <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right: Price Sidebar */}
          <div className="oc-sidebar">
            <PriceSidebar config={config} productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
