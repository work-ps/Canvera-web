import { useReducer, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  materialRanges,
  getSizesForMaterial,
  getOrientationsForMaterial,
  getBindingsForSelection,
  getLaminations,
  getCoverDesigns,
  getCoverMaterials,
  getCoverColors,
  findSimilarProducts,
  sizeLabels,
} from '../data/builderOptions'
import { getProductThumbnail } from '../data/productImages'
import SizeChartModal from '../components/shared/SizeChartModal'
import '../styles/make-your-own.css'

/* ==========================================================================
   State management
   ========================================================================== */
const initialState = {
  step: 1,
  material: null,
  size: null,
  orientation: null,
  binding: null,
  lamination: null,
  coverDesign: null,
  coverMaterial: null,
  coverColor: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MATERIAL':
      return { ...initialState, step: 2, material: action.value }
    case 'SET_SIZE':
      return { ...state, size: action.value }
    case 'SET_ORIENTATION':
      return { ...state, step: 3, orientation: action.value }
    case 'SET_BINDING':
      return { ...state, step: 4, binding: action.value }
    case 'SET_LAMINATION':
      return { ...state, step: 5, lamination: action.value }
    case 'SET_COVER_DESIGN':
      return { ...state, step: 6, coverDesign: action.value, coverMaterial: null, coverColor: null }
    case 'SET_COVER_MATERIAL':
      return { ...state, step: 6, coverMaterial: action.value, coverColor: null }
    case 'SET_COVER_COLOR':
      return { ...state, step: 7, coverColor: action.value }
    case 'GO_TO_STEP': {
      const s = action.step
      const reset = { ...state, step: s }
      if (s <= 1) return { ...initialState }
      if (s <= 2) return { ...reset, size: null, orientation: null, binding: null, lamination: null, coverDesign: null, coverMaterial: null, coverColor: null }
      if (s <= 3) return { ...reset, binding: null, lamination: null, coverDesign: null, coverMaterial: null, coverColor: null }
      if (s <= 4) return { ...reset, lamination: null, coverDesign: null, coverMaterial: null, coverColor: null }
      if (s <= 5) return { ...reset, coverDesign: null, coverMaterial: null, coverColor: null }
      if (s <= 6) return { ...reset, coverMaterial: null, coverColor: null }
      return reset
    }
    default:
      return state
  }
}

/* ==========================================================================
   Step labels
   ========================================================================== */
const stepLabels = [
  null,
  'Choose a Range',
  'Size & Orientation',
  'Binding Style',
  'Lamination',
  'Cover Design',
  'Cover Material & Colour',
  'Your Photobook',
]

const stepSubtitles = [
  null,
  'Start with the material that defines your album\'s character.',
  'Select the dimensions and how your book is held.',
  'Choose how your pages open and lie flat.',
  'Pick the surface finish for your pages.',
  'Select a cover design pattern.',
  'Choose the material and colour for your cover.',
  'Here\u2019s your custom photobook. Share it or find matching products.',
]

/* ==========================================================================
   Color map for materials → visualizer tint
   ========================================================================== */
const materialColorMap = {
  'Leather':                   '#4A2C1A',
  'Suede':                     '#3B4D6B',
  'Fab Leather':               '#6B4F3A',
  'Plush Leather':             '#5C3A28',
  'Eco Leather':               '#7A8B6E',
  'Signature':                 '#1A2028',
  'Wood':                      '#8B6E4E',
  'Melange Fabric':            '#9B8F80',
  'Metallic Gala':             '#B8A88A',
  'Printed Paper with Foiling':'#C4A96A',
  'Printed Paper':             '#A09488',
  'Mixed Material':            '#7A7068',
}

const coverColorHex = {
  'Midnight Black': '#1a1a1a', 'Charcoal': '#36454f', 'Slate Gray': '#708090',
  'Ivory': '#fffff0', 'Cream': '#fffdd0', 'Pearl White': '#f5f5f0',
  'Midnight Blue': '#191970', 'Deep Navy': '#0a1747', 'Oxford Blue': '#002147',
  'Natural Tan': '#c2956b', 'Saddle Brown': '#8b4513', 'Honey': '#d4a843',
  'Burgundy': '#800020', 'Wine Red': '#722f37', 'Oxblood': '#4a0000',
  'Navy': '#001f3f', 'Royal Blue': '#4169e1', 'Denim Blue': '#1560bd',
  'Charcoal ': '#36454f', 'Stone Gray': '#928e85', 'Graphite': '#383838',
}

/* ==========================================================================
   SVG Illustrations
   ========================================================================== */
function BookIllustration({ color = '#005780', orientation = 'Landscape', coverDesign, coverColorHex: coverClr }) {
  const isPortrait = orientation === 'Portrait'
  const isSquare = orientation === 'Square'
  const w = isPortrait ? 140 : (isSquare ? 160 : 200)
  const h = isPortrait ? 200 : (isSquare ? 160 : 140)
  const ox = (200 - w) / 2
  const oy = (200 - h) / 2

  const coverFill = coverClr || color
  const spineX = ox + w / 2 - 2

  return (
    <svg viewBox="0 0 200 200" fill="none" className="myo-book-svg">
      {/* Cover */}
      <rect x={ox} y={oy} width={w} height={h} rx="5" fill={coverFill} opacity="0.15" stroke={coverFill} strokeWidth="1.5" />

      {/* Spine */}
      <rect x={spineX} y={oy} width="4" height={h} fill={coverFill} opacity="0.25" rx="1" />

      {/* Cover design pattern overlays */}
      {coverDesign === 'window-frame' && (
        <rect x={ox + w * 0.2} y={oy + h * 0.2} width={w * 0.25} height={h * 0.4} rx="3" fill={coverFill} opacity="0.12" stroke={coverFill} strokeWidth="0.8" strokeDasharray="3 2" />
      )}
      {coverDesign === 'split-duo' && (
        <line x1={ox + w * 0.35} y1={oy} x2={ox + w * 0.35} y2={oy + h} stroke={coverFill} strokeWidth="1.5" opacity="0.3" />
      )}
      {coverDesign === 'nameplate-classic' && (
        <rect x={ox + w * 0.15} y={oy + h * 0.65} width={w * 0.3} height={h * 0.15} rx="2" fill={coverFill} opacity="0.18" stroke={coverFill} strokeWidth="0.6" />
      )}

      {/* Left page */}
      <rect x={ox + 8} y={oy + 8} width={w / 2 - 14} height={h - 16} rx="2" fill="#fff" stroke={coverFill} strokeWidth="0.6" opacity="0.5" />

      {/* Right page */}
      <rect x={spineX + 6} y={oy + 8} width={w / 2 - 14} height={h - 16} rx="2" fill="#fff" stroke={coverFill} strokeWidth="0.6" opacity="0.5" />

      {/* Page content hints */}
      <rect x={ox + 14} y={oy + 16} width={w / 2 - 26} height={h * 0.25} rx="1.5" fill={coverFill} opacity="0.08" />
      <line x1={ox + 14} y1={oy + h * 0.55} x2={ox + w / 2 - 18} y2={oy + h * 0.55} stroke={coverFill} strokeWidth="1" opacity="0.12" strokeLinecap="round" />
      <line x1={ox + 14} y1={oy + h * 0.62} x2={ox + w / 2 - 24} y2={oy + h * 0.62} stroke={coverFill} strokeWidth="1" opacity="0.08" strokeLinecap="round" />

      <rect x={spineX + 12} y={oy + 16} width={w / 2 - 26} height={h * 0.4} rx="1.5" fill={coverFill} opacity="0.08" />
      <line x1={spineX + 12} y1={oy + h * 0.68} x2={spineX + w / 2 - 18} y2={oy + h * 0.68} stroke={coverFill} strokeWidth="1" opacity="0.12" strokeLinecap="round" />
    </svg>
  )
}

function LaminationIcon({ type }) {
  if (type === 'Glossy') return (
    <svg viewBox="0 0 40 40" className="myo-lam-icon">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#f5f5f5" stroke="#ddd" strokeWidth="1" />
      <path d="M8 28 L16 12 L20 20 L24 8 L32 28" stroke="#bbb" strokeWidth="1.2" fill="none" opacity="0.6" />
      <circle cx="28" cy="10" r="3" fill="#fff" stroke="#ddd" strokeWidth="0.8" />
    </svg>
  )
  if (type === 'Soft Touch') return (
    <svg viewBox="0 0 40 40" className="myo-lam-icon">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#ece8e0" stroke="#d4cfc6" strokeWidth="1" />
      <path d="M10 30 Q20 18 30 30" stroke="#c4beb4" strokeWidth="1.5" fill="none" />
      <path d="M12 26 Q20 16 28 26" stroke="#d4cfc6" strokeWidth="1" fill="none" />
    </svg>
  )
  if (type === 'No Lamination') return (
    <svg viewBox="0 0 40 40" className="myo-lam-icon">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#f8f4ee" stroke="#e0dbd4" strokeWidth="1" />
      <line x1="10" y1="10" x2="30" y2="30" stroke="#ccc" strokeWidth="1.2" opacity="0.5" />
      <line x1="30" y1="10" x2="10" y2="30" stroke="#ccc" strokeWidth="1.2" opacity="0.5" />
    </svg>
  )
  // Matte (default)
  return (
    <svg viewBox="0 0 40 40" className="myo-lam-icon">
      <rect x="4" y="4" width="32" height="32" rx="4" fill="#e8e4de" stroke="#d4d0ca" strokeWidth="1" />
      <line x1="10" y1="14" x2="30" y2="14" stroke="#d0ccc6" strokeWidth="1" />
      <line x1="10" y1="20" x2="30" y2="20" stroke="#d0ccc6" strokeWidth="1" />
      <line x1="10" y1="26" x2="30" y2="26" stroke="#d0ccc6" strokeWidth="1" />
    </svg>
  )
}

function CoverPatternIcon({ pattern, color }) {
  const c = color || '#005780'
  if (pattern === 'split-duo') return (
    <svg viewBox="0 0 60 48" className="myo-pattern-icon">
      <rect x="2" y="2" width="56" height="44" rx="3" fill={c} opacity="0.1" stroke={c} strokeWidth="1" />
      <line x1="30" y1="2" x2="30" y2="46" stroke={c} strokeWidth="1.5" opacity="0.4" />
      <rect x="4" y="4" width="24" height="40" rx="1" fill={c} opacity="0.06" />
    </svg>
  )
  if (pattern === 'window-frame') return (
    <svg viewBox="0 0 60 48" className="myo-pattern-icon">
      <rect x="2" y="2" width="56" height="44" rx="3" fill={c} opacity="0.1" stroke={c} strokeWidth="1" />
      <rect x="16" y="10" width="20" height="16" rx="2" fill={c} opacity="0.15" stroke={c} strokeWidth="0.8" strokeDasharray="3 2" />
      <rect x="18" y="12" width="16" height="12" rx="1" fill="#fff" opacity="0.6" />
    </svg>
  )
  if (pattern === 'nameplate-classic') return (
    <svg viewBox="0 0 60 48" className="myo-pattern-icon">
      <rect x="2" y="2" width="56" height="44" rx="3" fill={c} opacity="0.1" stroke={c} strokeWidth="1" />
      <rect x="12" y="30" width="28" height="10" rx="2" fill={c} opacity="0.15" stroke={c} strokeWidth="0.6" />
      <line x1="18" y1="35" x2="34" y2="35" stroke={c} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
    </svg>
  )
  // clean-minimal
  return (
    <svg viewBox="0 0 60 48" className="myo-pattern-icon">
      <rect x="2" y="2" width="56" height="44" rx="3" fill={c} opacity="0.1" stroke={c} strokeWidth="1" />
    </svg>
  )
}

/* ==========================================================================
   Main Component
   ========================================================================== */
export default function MakeYourOwnPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const navigate = useNavigate()
  const contentRef = useRef(null)
  const totalSteps = 7

  /* Auto-scroll right panel to top on step change */
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [state.step])

  /* ---- Derived options ---- */
  const sizes = useMemo(() => state.material ? getSizesForMaterial(state.material) : [], [state.material])
  const orientations = useMemo(() => state.material ? getOrientationsForMaterial(state.material) : [], [state.material])
  const bindings = useMemo(() =>
    state.material && state.size && state.orientation
      ? getBindingsForSelection(state.material, state.size, state.orientation)
      : [],
    [state.material, state.size, state.orientation]
  )
  const laminationList = useMemo(() => getLaminations(), [])
  const coverDesigns = useMemo(() => getCoverDesigns(), [])
  const coverMats = useMemo(() => getCoverMaterials(), [])
  const coverColors = useMemo(() => state.coverMaterial ? getCoverColors(state.coverMaterial) : [], [state.coverMaterial])
  const similarProducts = useMemo(() => state.step === 7 ? findSimilarProducts(state) : [], [state.step, state.material, state.size, state.orientation, state.binding])

  /* ---- Visualizer color ---- */
  const vizColor = useMemo(() => {
    if (state.coverColor && coverColorHex[state.coverColor]) return coverColorHex[state.coverColor]
    if (state.material) return materialColorMap[state.material] || '#005780'
    return '#005780'
  }, [state.material, state.coverColor])

  /* ---- Breadcrumb trail ---- */
  const breadcrumbs = useMemo(() => {
    const crumbs = []
    if (state.material) crumbs.push({ step: 1, label: state.material })
    if (state.size) crumbs.push({ step: 2, label: sizeLabels[state.size]?.label || state.size })
    if (state.orientation) crumbs.push({ step: 2, label: state.orientation })
    if (state.binding) crumbs.push({ step: 3, label: state.binding })
    if (state.lamination) crumbs.push({ step: 4, label: state.lamination })
    if (state.coverDesign) {
      const cd = coverDesigns.find(d => d.id === state.coverDesign)
      crumbs.push({ step: 5, label: cd?.name || state.coverDesign })
    }
    if (state.coverMaterial) crumbs.push({ step: 6, label: state.coverMaterial })
    if (state.coverColor) crumbs.push({ step: 6, label: state.coverColor })
    return crumbs
  }, [state, coverDesigns])

  const handleBreadcrumbClick = useCallback((step) => {
    dispatch({ type: 'GO_TO_STEP', step })
  }, [])

  /* ---- Share handler ---- */
  const handleShare = useCallback(() => {
    const params = new URLSearchParams()
    Object.entries(state).forEach(([k, v]) => { if (v && k !== 'step') params.set(k, v) })
    const url = `${window.location.origin}/custom?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!')
    }).catch(() => {
      prompt('Copy this link:', url)
    })
  }, [state])

  /* ==================================================================
     Render steps
     ================================================================== */
  function renderStep() {
    switch (state.step) {
      /* ---- Step 1: Material / Range ---- */
      case 1:
        return (
          <div className="myo-options-grid">
            {materialRanges.map(m => (
              <button
                key={m.id}
                className="myo-option-card"
                onClick={() => dispatch({ type: 'SET_MATERIAL', value: m.id })}
              >
                <div className="myo-option-swatch" style={{ background: m.swatch }} />
                <div className="myo-option-info">
                  <div className="myo-option-name">{m.name}</div>
                  <div className="myo-option-desc">{m.description}</div>
                </div>
              </button>
            ))}
          </div>
        )

      /* ---- Step 2: Size & Orientation ---- */
      case 2:
        return (
          <>
            {/* Size sub-step */}
            <div className="myo-substep">
              <div className="size-heading-row">
                <div className="size-heading-left">
                  <h4 className="myo-substep-title" style={{ margin: 0 }}>Size</h4>
                </div>
                <SizeChartModal sizes={sizes.map(s => s.id)} />
              </div>
              <div className="myo-options-row" style={{ marginTop: 'var(--space-3, 12px)' }}>
                {sizes.map(s => (
                  <button
                    key={s.id}
                    className={`myo-option-card myo-option-card--compact${state.size === s.id ? ' myo-option-card--selected' : ''}`}
                    onClick={() => dispatch({ type: 'SET_SIZE', value: s.id })}
                  >
                    <div className="myo-option-name">{s.label}</div>
                    <div className="myo-option-desc">{s.format}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation sub-step — shown after size */}
            {state.size && (
              <div className="myo-substep myo-fade-in">
                <h4 className="myo-substep-title">Orientation</h4>
                <div className="myo-options-row">
                  {orientations.map(o => (
                    <button
                      key={o.id}
                      className={`myo-option-card myo-option-card--compact${state.orientation === o.id ? ' myo-option-card--selected' : ''}`}
                      onClick={() => dispatch({ type: 'SET_ORIENTATION', value: o.id })}
                    >
                      <div className="myo-ori-glyph" data-orientation={o.id.toLowerCase()} />
                      <div className="myo-option-name">{o.name}</div>
                      <div className="myo-option-desc">{o.bestFor}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )

      /* ---- Step 3: Binding ---- */
      case 3:
        return (
          <div className="myo-options-grid myo-options-grid--wide">
            {bindings.map(b => (
              <button
                key={b.id}
                className="myo-option-card"
                onClick={() => dispatch({ type: 'SET_BINDING', value: b.id })}
              >
                <div className="myo-option-name">{b.name}</div>
                <div className="myo-option-desc">{b.description}</div>
                {b.specs && (
                  <ul className="myo-option-specs">
                    {b.specs.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                )}
              </button>
            ))}
          </div>
        )

      /* ---- Step 4: Lamination ---- */
      case 4:
        return (
          <div className="myo-options-row">
            {laminationList.map(l => (
              <button
                key={l.id}
                className="myo-option-card myo-option-card--swatch"
                onClick={() => dispatch({ type: 'SET_LAMINATION', value: l.id })}
              >
                <LaminationIcon type={l.id} />
                <div className="myo-option-name">{l.name}</div>
                <div className="myo-option-desc">{l.description}</div>
              </button>
            ))}
          </div>
        )

      /* ---- Step 5: Cover Design ---- */
      case 5:
        return (
          <div className="myo-options-row">
            {coverDesigns.map(d => (
              <button
                key={d.id}
                className="myo-option-card myo-option-card--pattern"
                onClick={() => dispatch({ type: 'SET_COVER_DESIGN', value: d.id })}
              >
                <CoverPatternIcon pattern={d.id} color={vizColor} />
                <div className="myo-option-name">{d.name}</div>
                <div className="myo-option-desc">{d.description}</div>
              </button>
            ))}
          </div>
        )

      /* ---- Step 6: Cover Material & Color ---- */
      case 6:
        return (
          <>
            <div className="myo-substep">
              <h4 className="myo-substep-title">Cover Material</h4>
              <div className="myo-options-row">
                {coverMats.map(m => (
                  <button
                    key={m.id}
                    className={`myo-option-card myo-option-card--compact${state.coverMaterial === m.id ? ' myo-option-card--selected' : ''}`}
                    onClick={() => dispatch({ type: 'SET_COVER_MATERIAL', value: m.id })}
                  >
                    <div className="myo-option-name">{m.name}</div>
                    <div className="myo-option-desc">{m.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {state.coverMaterial && coverColors.length > 0 && (
              <div className="myo-substep myo-fade-in">
                <h4 className="myo-substep-title">Colour</h4>
                <div className="myo-color-swatches">
                  {coverColors.map(c => (
                    <button
                      key={c}
                      className={`myo-color-swatch${state.coverColor === c ? ' myo-color-swatch--selected' : ''}`}
                      style={{ background: coverColorHex[c] || '#999' }}
                      onClick={() => dispatch({ type: 'SET_COVER_COLOR', value: c })}
                      title={c}
                    >
                      <span className="myo-color-swatch-label">{c}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )

      /* ---- Step 7: Final Result ---- */
      case 7:
        return (
          <div className="myo-result">
            <div className="myo-result-summary">
              <h3 className="myo-result-heading">Your Selections</h3>
              <div className="myo-result-grid">
                <div className="myo-result-item"><span className="myo-result-label">Range</span><span className="myo-result-value">{state.material}</span></div>
                <div className="myo-result-item"><span className="myo-result-label">Size</span><span className="myo-result-value">{sizeLabels[state.size]?.label}</span></div>
                <div className="myo-result-item"><span className="myo-result-label">Orientation</span><span className="myo-result-value">{state.orientation}</span></div>
                <div className="myo-result-item"><span className="myo-result-label">Binding</span><span className="myo-result-value">{state.binding}</span></div>
                <div className="myo-result-item"><span className="myo-result-label">Lamination</span><span className="myo-result-value">{state.lamination}</span></div>
                <div className="myo-result-item"><span className="myo-result-label">Cover Design</span><span className="myo-result-value">{coverDesigns.find(d => d.id === state.coverDesign)?.name}</span></div>
                <div className="myo-result-item"><span className="myo-result-label">Cover Material</span><span className="myo-result-value">{state.coverMaterial}</span></div>
                <div className="myo-result-item"><span className="myo-result-label">Cover Colour</span><span className="myo-result-value">{state.coverColor}</span></div>
              </div>
            </div>

            <div className="myo-result-actions">
              <button className="myo-btn myo-btn--primary" onClick={handleShare}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share Configuration
              </button>
              <button className="myo-btn myo-btn--secondary" onClick={() => {
                const topMatch = similarProducts[0]
                if (topMatch) navigate(`/product/${topMatch.slug}`)
                else navigate('/shop')
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Find Similar Products
              </button>
            </div>

            {/* Similar products */}
            {similarProducts.length > 0 && (
              <div className="myo-similar">
                <h4 className="myo-similar-title">Products matching your selections</h4>
                <div className="myo-similar-grid">
                  {similarProducts.map(p => {
                    const thumb = getProductThumbnail(p.slug)
                    return (
                      <button key={p.id} className="myo-similar-card" onClick={() => navigate(`/product/${p.slug}`)}>
                        {thumb
                          ? <img src={thumb} alt={p.name} className="myo-similar-img" loading="lazy" />
                          : <div className="myo-similar-placeholder" style={{ background: materialColorMap[p.material] || '#ccc' }} />
                        }
                        <div className="myo-similar-name">{p.name}</div>
                        <div className="myo-similar-tag">{p.tag}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  /* ==================================================================
     Render
     ================================================================== */
  return (
    <div className="myo-page">
      {/* ---- Left: Visualizer ---- */}
      <div className="myo-viz-panel">
        <div className="myo-viz-inner">
          <div className="myo-viz-book-wrap">
            <BookIllustration
              color={vizColor}
              orientation={state.orientation || 'Landscape'}
              coverDesign={state.coverDesign}
              coverColorHex={state.coverColor ? (coverColorHex[state.coverColor] || vizColor) : null}
            />
          </div>

          {/* Caption */}
          <div className="myo-viz-caption">
            {state.step < 7
              ? (state.material
                  ? [state.material, sizeLabels[state.size]?.label, state.orientation, state.binding, state.lamination].filter(Boolean).join(' \u00B7 ')
                  : 'Your photobook will take shape here')
              : 'Your custom photobook'
            }
          </div>
        </div>
      </div>

      {/* ---- Right: Steps ---- */}
      <div className="myo-content-panel" ref={contentRef}>
        {/* Progress */}
        <div className="myo-progress">
          <div className="myo-progress-bar">
            <div className="myo-progress-fill" style={{ width: `${((state.step - 1) / (totalSteps - 1)) * 100}%` }} />
          </div>
          <span className="myo-progress-label">Step {state.step} of {totalSteps}</span>
        </div>

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="myo-breadcrumbs">
            {breadcrumbs.map((bc, i) => (
              <button
                key={i}
                className="myo-breadcrumb"
                onClick={() => handleBreadcrumbClick(bc.step)}
              >
                {bc.label}
              </button>
            ))}
          </div>
        )}

        {/* Step header */}
        <div className="myo-step-header myo-fade-in" key={`header-${state.step}`}>
          <h2 className="myo-step-title">{stepLabels[state.step]}</h2>
          <p className="myo-step-subtitle">{stepSubtitles[state.step]}</p>
        </div>

        {/* Step content */}
        <div className="myo-step-content myo-fade-in" key={`content-${state.step}`}>
          {renderStep()}
        </div>
      </div>
    </div>
  )
}
