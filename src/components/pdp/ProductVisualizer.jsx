/**
 * ProductVisualizer
 * -----------------
 * The left-panel sticky visualizer on the PDP. Displays a generic book/album
 * SVG illustration whose colour adapts to the product's `imageVariant`, a
 * caption line showing the current configuration summary, and a clickable
 * config summary strip at the bottom that lets users jump to specific sections.
 *
 * Reads all configuration state from the `usePDPConfig` context hook.
 *
 * SVG illustrations follow the same `productSvgs` pattern used in
 * `ProductCard.jsx` but are simplified generic book shapes. The primary
 * colour is resolved from the `imageVariant` using the `variantColorMap`.
 *
 * CSS classes consumed (from pdp-visualizer.css):
 *   .pdp-visualizer, .pdp-viz-image-area, .pdp-viz-svg-wrap,
 *   .pdp-viz-caption, .pdp-viz-summary, .pdp-viz-summary-row,
 *   .pdp-viz-summary-label, .pdp-viz-summary-value,
 *   .pdp-viz-summary-value--unset, .pdp-viz-zoom
 */

import { useMemo, useCallback } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import '../../styles/pdp-visualizer.css'

/* ==========================================================================
   Colour Map  (imageVariant -> primary fill colour)
   ========================================================================== */
const variantColorMap = {
  petrol:  '#005780',
  amber:   '#F47E13',
  warm:    '#C46200',
  dark:    '#1A2028',
  neutral: '#7A8490',
  mixed:   '#5C6775',
  leaf:    '#2BBF8E',
  deep:    '#003A54',
}

/* ==========================================================================
   Generic Book SVG Illustration
   A simplified open-book shape that takes a `color` prop to tint itself.
   ========================================================================== */
function BookIllustration({ color = '#005780' }) {
  return (
    <svg viewBox="0 0 200 160" fill="none">
      {/* Outer cover (closed book shape) */}
      <rect
        x="20" y="20"
        width="160" height="120"
        rx="6"
        fill={color}
        opacity="0.08"
        stroke={color}
        strokeWidth="1.5"
      />

      {/* Spine shadow */}
      <rect
        x="98" y="20"
        width="4" height="120"
        fill={color}
        opacity="0.15"
        rx="1"
      />

      {/* Left page */}
      <rect
        x="28" y="28"
        width="68" height="104"
        rx="3"
        fill="#fff"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Right page */}
      <rect
        x="104" y="28"
        width="68" height="104"
        rx="3"
        fill="#fff"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Left page image placeholder */}
      <rect
        x="36" y="38"
        width="52" height="36"
        rx="2"
        fill={color}
        opacity="0.12"
      />

      {/* Left page text lines */}
      <line x1="36" y1="84" x2="80" y2="84" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />
      <line x1="36" y1="92" x2="72" y2="92" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />
      <line x1="36" y1="100" x2="76" y2="100" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.1" />

      {/* Right page image placeholder */}
      <rect
        x="112" y="38"
        width="52" height="60"
        rx="2"
        fill={color}
        opacity="0.12"
      />

      {/* Right page text lines */}
      <line x1="112" y1="108" x2="156" y2="108" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.2" />
      <line x1="112" y1="116" x2="148" y2="116" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.15" />

      {/* Decorative corner accents */}
      <path
        d="M24 26 L32 20 M176 20 L168 26"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  )
}

/* ==========================================================================
   Config summary row definitions
   Maps config keys to human-readable labels. These drive the summary strip
   at the bottom of the visualizer panel.
   ========================================================================== */
const summaryFields = [
  { key: 'size',           label: 'Size',       sectionId: 'size' },
  { key: 'orientation',    label: 'Orientation', sectionId: 'orientation' },
  { key: 'binding',        label: 'Binding',     sectionId: 'binding' },
  { key: 'sheets',         label: 'Sheets',      sectionId: 'pages',  format: (v) => v ? `${v} sheets` : null },
  { key: 'lamination',     label: 'Lamination',  sectionId: 'paper' },
  { key: 'paper',          label: 'Paper',       sectionId: 'paper' },
  { key: 'coverDesign',    label: 'Cover Style', sectionId: 'cover' },
  { key: 'coverMaterial',  label: 'Material',    sectionId: 'cover' },
  { key: 'coverColor',     label: 'Colour',      sectionId: 'cover' },
  { key: 'boxType',        label: 'Box',         sectionId: 'box',   format: (v) => v === 'none' ? null : v },
  { key: 'bagType',        label: 'Bag',         sectionId: 'bag',   format: (v) => v === 'none' ? null : v },
]

export default function ProductVisualizer() {
  const {
    product,
    config,
    visibleSections,
    setExpandedSection,
  } = usePDPConfig()

  /* ---- Resolve colour from product variant ---- */
  const primaryColor = useMemo(() => {
    if (!product) return variantColorMap.petrol
    return variantColorMap[product.imageVariant] || variantColorMap.petrol
  }, [product])

  /* ---- Build the caption line from current config ---- */
  const captionLine = useMemo(() => {
    const parts = []
    if (config.size)        parts.push(config.size)
    if (config.orientation) parts.push(config.orientation)
    if (config.binding)     parts.push(config.binding)
    if (config.paper)       parts.push(config.paper)

    return parts.length > 0
      ? parts.join(' \u00B7 ')
      : 'Configure your product below'
  }, [config.size, config.orientation, config.binding, config.paper])

  /* ---- Jump to section on summary row click ---- */
  const handleSummaryClick = useCallback((sectionId) => {
    setExpandedSection(sectionId)
    const el = document.getElementById(`section-${sectionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [setExpandedSection])

  /* ---- Filter summary rows to only visible sections ---- */
  const visibleSectionIds = useMemo(() => {
    return new Set(visibleSections.map(s => s.id))
  }, [visibleSections])

  const activeSummaryFields = useMemo(() => {
    return summaryFields.filter(field => visibleSectionIds.has(field.sectionId))
  }, [visibleSectionIds])

  return (
    <div className="pdp-visualizer">
      {/* ---- Image area ---- */}
      <div className="pdp-viz-image-area">
        <div className="pdp-viz-svg-wrap">
          <BookIllustration color={primaryColor} />
        </div>
      </div>

      {/* ---- Caption ---- */}
      <div className="pdp-viz-caption">
        {captionLine}
      </div>

      {/* ---- Config Summary Strip ---- */}
      <div className="pdp-viz-summary">
        {activeSummaryFields.map((field) => {
          const rawValue = config[field.key]
          const displayValue = field.format ? field.format(rawValue) : rawValue
          const isUnset = !displayValue

          return (
            <div
              key={field.key}
              className="pdp-viz-summary-row"
              onClick={() => handleSummaryClick(field.sectionId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSummaryClick(field.sectionId)
                }
              }}
              aria-label={`${field.label}: ${isUnset ? 'not set' : displayValue}. Click to edit.`}
            >
              <span className="pdp-viz-summary-label">{field.label}</span>
              <span className={`pdp-viz-summary-value${isUnset ? ' pdp-viz-summary-value--unset' : ''}`}>
                {isUnset ? 'Not set' : displayValue}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
