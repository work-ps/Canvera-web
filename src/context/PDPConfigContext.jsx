import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import { calculatePrice, getStartingPrice } from '../data/pdpPricing'
import { configSections } from '../data/pdpOptions'

const PDPConfigContext = createContext(null)

const initialConfig = {
  size: null,
  orientation: null,
  binding: null,
  sheets: 10,
  customSheets: false,
  lamination: null,
  paper: null,
  specialPaperEnabled: false,
  specialPaperRanges: [],
  coverDesign: null,
  coverMaterial: null,
  coverColor: null,
  coverName1: '',
  coverName2: '',
  namingTreatment: null,
  boxType: 'none',
  bagType: 'none',
  imageLink: '',
  orderType: null,
  productionNotes: '',
}

export function PDPConfigProvider({ product, children }) {
  const [config, setConfig] = useState(initialConfig)
  const [expandedSection, setExpandedSection] = useState('size')
  const [attemptedProceed, setAttemptedProceed] = useState(false)

  const updateConfig = useCallback((key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateMultiple = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(initialConfig)
    setExpandedSection('size')
    setAttemptedProceed(false)
  }, [])

  // Save/Load draft
  const saveDraft = useCallback(() => {
    if (product) {
      localStorage.setItem(`pdp-draft-${product.id}`, JSON.stringify(config))
    }
  }, [config, product])

  const loadDraft = useCallback(() => {
    if (product) {
      const saved = localStorage.getItem(`pdp-draft-${product.id}`)
      if (saved) {
        try {
          setConfig(JSON.parse(saved))
          return true
        } catch { /* ignore */ }
      }
    }
    return false
  }, [product])

  const clearDraft = useCallback(() => {
    if (product) localStorage.removeItem(`pdp-draft-${product.id}`)
  }, [product])

  // Pricing
  const pricing = useMemo(() => {
    if (!product) return { basePrice: 0, lineItems: [], total: 0 }
    return calculatePrice(config, product.id)
  }, [config, product])

  const startingPrice = useMemo(() => {
    if (!product) return null
    return getStartingPrice(product.id)
  }, [product])

  // Section completion states
  const sectionStates = useMemo(() => {
    const states = {}
    const hasPaperSections = product && product.bindings?.length > 0
    const hasCoverSections = product && product.material

    configSections.forEach(sec => {
      // Skip sections that don't apply to this product
      if (sec.id === 'binding' && (!product || product.bindings?.length === 0)) {
        states[sec.id] = 'hidden'
        return
      }
      if (sec.id === 'orientation' && (!product || product.orientations?.length <= 1)) {
        // Auto-set if only one orientation
        states[sec.id] = 'complete'
        return
      }

      if (!sec.required) {
        // Optional sections
        switch (sec.id) {
          case 'box':
            states[sec.id] = config.boxType ? 'complete' : 'not-visited'
            break
          case 'bag':
            states[sec.id] = config.bagType ? 'complete' : 'not-visited'
            break
          case 'notes':
            states[sec.id] = config.productionNotes ? 'complete' : 'not-visited'
            break
          default:
            states[sec.id] = 'not-visited'
        }
        return
      }

      // Required sections
      switch (sec.id) {
        case 'size':
          states[sec.id] = config.size ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        case 'orientation':
          states[sec.id] = config.orientation ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        case 'binding':
          states[sec.id] = config.binding ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        case 'pages':
          states[sec.id] = config.sheets >= 10 ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        case 'paper':
          states[sec.id] = (config.lamination && config.paper) ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        case 'cover':
          states[sec.id] = (config.coverDesign && config.coverMaterial && config.coverColor) ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        case 'imageLink':
          states[sec.id] = config.imageLink ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        case 'orderType':
          states[sec.id] = config.orderType ? 'complete' : (attemptedProceed ? 'error' : 'not-visited')
          break
        default:
          states[sec.id] = 'not-visited'
      }
    })

    return states
  }, [config, product, attemptedProceed])

  // Check if all required complete
  const allRequiredComplete = useMemo(() => {
    return configSections
      .filter(s => s.required)
      .every(s => sectionStates[s.id] === 'complete' || sectionStates[s.id] === 'hidden')
  }, [sectionStates])

  // Get visible sections for this product
  const visibleSections = useMemo(() => {
    if (!product) return configSections
    return configSections.filter(sec => {
      if (sec.id === 'binding' && product.bindings?.length === 0) return false
      if (sec.id === 'orientation' && product.orientations?.length === 0) return false
      return true
    })
  }, [product])

  // Auto-advance: find next incomplete required section
  const getNextSection = useCallback((currentId) => {
    const idx = visibleSections.findIndex(s => s.id === currentId)
    for (let i = idx + 1; i < visibleSections.length; i++) {
      const sec = visibleSections[i]
      if (sec.required && sectionStates[sec.id] !== 'complete') return sec.id
      if (!sec.required) continue // skip optional
    }
    // All complete? go to review area
    return null
  }, [visibleSections, sectionStates])

  const value = {
    product,
    config,
    updateConfig,
    updateMultiple,
    resetConfig,
    pricing,
    startingPrice,
    sectionStates,
    allRequiredComplete,
    visibleSections,
    expandedSection,
    setExpandedSection,
    getNextSection,
    attemptedProceed,
    setAttemptedProceed,
    saveDraft,
    loadDraft,
    clearDraft,
  }

  return (
    <PDPConfigContext.Provider value={value}>
      {children}
    </PDPConfigContext.Provider>
  )
}

export function usePDPConfig() {
  const ctx = useContext(PDPConfigContext)
  if (!ctx) throw new Error('usePDPConfig must be used inside PDPConfigProvider')
  return ctx
}

export default PDPConfigContext
