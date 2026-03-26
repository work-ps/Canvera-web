import { useState, useReducer, useMemo, useCallback, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate, Navigate, Link } from 'react-router-dom'
import products from '../data/products'
import { calculatePrice } from '../data/pdpPricing'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getProductThumbnail } from '../data/productImages'
import OrderStepper from '../components/order/OrderStepper'
import PriceSidebar from '../components/order/PriceSidebar'
import StepFiles from '../components/order/StepFiles'
import StepPaper from '../components/order/StepPaper'
import StepCover from '../components/order/StepCover'
import StepAccessories from '../components/order/StepAccessories'
import StepReview from '../components/order/StepReview'
import '../styles/order-config.css'

const initialConfig = {
  size: null,
  orientation: null,
  binding: null,
  eventDate: '',
  eventType: '',
  eventTitle: '',
  sheets: 20,
  orderType: 'print-ready',
  fileLink: '',
  lamination: null,
  paper: null,
  colorPrinting: '4-Color CMYK',
  specialPaperEnabled: false,
  specialPaperEntries: [],
  coverDesign: null,
  coverMaterial: null,
  coverColor: null,
  coverName1: '',
  coverName2: '',
  namingTreatment: null,
  boxEnabled: false,
  boxMaterial: null,
  boxColor: null,
  boxType: 'none',
  bagType: 'Standard',
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
    case 0: return true
    case 1: return !!(config.lamination && config.paper)
    case 2: return !!(config.coverName1?.trim())
    case 3: return true
    case 4: return true
    default: return false
  }
}

export default function OrderConfigPage() {
  const { slug } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart, updateCartItemConfig, showToast } = useCart()
  const { isVerified } = useAuth()

  const product = useMemo(() => products.find(p => p.slug === slug), [slug])
  const thumbnail = product ? getProductThumbnail(product.slug) : null

  // Check if we're editing an existing cart item
  const cartItemId = location.state?.cartItemId || null
  const preloadedConfig = location.state?.config || null

  const pdpState = location.state || {}
  const [config, dispatch] = useReducer(configReducer, {
    ...initialConfig,
    ...(preloadedConfig || {}),
    size: preloadedConfig?.size || pdpState.size || product?.sizes?.[0] || null,
    orientation: preloadedConfig?.orientation || pdpState.orientation || product?.orientations?.[0] || null,
    binding: preloadedConfig?.binding || pdpState.binding || product?.bindings?.[0] || null,
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [mobilePriceOpen, setMobilePriceOpen] = useState(false)
  const savedAsDraftRef = useRef(false)
  const configRef = useRef(config)
  configRef.current = config

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

  // Save as draft — to cart
  const handleSaveDraft = useCallback(() => {
    const pricing = calculatePrice(configRef.current, product.id)
    if (cartItemId) {
      updateCartItemConfig(cartItemId, { ...configRef.current, price: pricing.total }, 'draft')
    } else {
      addToCart(product, { ...configRef.current, price: pricing.total }, 'draft')
    }
    savedAsDraftRef.current = true
    showToast('Draft saved')
  }, [product, cartItemId, updateCartItemConfig, addToCart, showToast])

  // Save as complete — add to cart
  const handleSaveToCart = useCallback(() => {
    const pricing = calculatePrice(config, product.id)
    if (cartItemId) {
      updateCartItemConfig(cartItemId, { ...config, price: pricing.total }, 'complete')
    } else {
      addToCart(product, { ...config, price: pricing.total }, 'complete')
    }
    savedAsDraftRef.current = true // prevent auto-save on unmount
    navigate('/cart')
  }, [config, product, cartItemId, updateCartItemConfig, addToCart, navigate])

  const handleProceedCheckout = useCallback(() => {
    const pricing = calculatePrice(config, product.id)
    if (cartItemId) {
      updateCartItemConfig(cartItemId, { ...config, price: pricing.total }, 'complete')
    } else {
      addToCart(product, { ...config, price: pricing.total }, 'complete')
    }
    savedAsDraftRef.current = true
    navigate('/checkout')
  }, [config, product, cartItemId, updateCartItemConfig, addToCart, navigate])

  // Auto-save as draft on unmount (leaving flow without saving)
  useEffect(() => {
    return () => {
      if (!savedAsDraftRef.current) {
        // Auto-save as draft when navigating away
        const pricing = calculatePrice(configRef.current, product.id)
        if (cartItemId) {
          updateCartItemConfig(cartItemId, { ...configRef.current, price: pricing.total }, 'draft')
        } else {
          // Only auto-save if user has made some config beyond defaults
          const c = configRef.current
          const hasProgress = c.lamination || c.paper || c.coverDesign || c.coverMaterial || c.coverName1
          if (hasProgress) {
            addToCart(product, { ...configRef.current, price: pricing.total }, 'draft')
          }
        }
      }
    }
  }, []) // intentionally empty deps — only run on unmount

  const canNext = isStepValid(currentStep, config)
  const isReview = currentStep === 4

  return (
    <div className="oc-page">
      {/* Page Header */}
      <div className="oc-page-header">
        <div className="oc-page-header-inner">
          <Link to={`/product/${product.slug}`} className="oc-back-link" aria-label="Back to product">
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

            {/* Navigation — max 2 buttons */}
            {!isReview && (
              <div className="oc-step-nav">
                {currentStep > 0 ? (
                  <button className="btn btn-secondary oc-nav-btn" onClick={goBack}>
                    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                  </button>
                ) : <span />}
                <button
                  className={`btn btn-primary oc-nav-btn${!canNext ? ' oc-nav-btn--disabled' : ''}`}
                  disabled={!canNext}
                  onClick={goNext}
                >
                  {currentStep === 3 ? 'Review Order' : 'Continue'}
                  <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right: Price Sidebar */}
          <div className="oc-sidebar">
            <PriceSidebar
              config={config}
              productId={product.id}
              productName={product.name}
              thumbnail={thumbnail}
              onSaveDraft={handleSaveDraft}
            />
          </div>
        </div>
      </div>

      {/* Mobile: Collapsible price panel */}
      <div className="oc-mobile-price-bar">
        <button
          className="oc-mobile-price-toggle"
          onClick={() => setMobilePriceOpen(!mobilePriceOpen)}
        >
          <span className="oc-mobile-price-label">Estimated Total</span>
          <span className="oc-mobile-price-amount">
            &#x20B9;{calculatePrice(config, product.id).total?.toLocaleString('en-IN') || '0'}
          </span>
          <svg className={`oc-mobile-price-chevron${mobilePriceOpen ? ' oc-mobile-price-chevron--open' : ''}`} viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {mobilePriceOpen && (
          <div className="oc-mobile-price-panel">
            <PriceSidebar
              config={config}
              productId={product.id}
              productName={product.name}
              thumbnail={thumbnail}
              onSaveDraft={handleSaveDraft}
            />
          </div>
        )}
      </div>
    </div>
  )
}
