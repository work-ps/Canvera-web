import { useState, useCallback, useMemo } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import { coverDesignPatterns, coverMaterials, namingTreatments } from '../../data/pdpOptions'
import { surcharges } from '../../data/pdpPricing'

function formatINR(amount) {
  if (amount == null) return ''
  return amount.toLocaleString('en-IN')
}

/* ------------------------------------------------------------------ */
/*  Pattern thumbnail SVGs                                             */
/* ------------------------------------------------------------------ */
function PatternThumb({ patternId }) {
  const c1 = 'var(--neutral-300)'
  const c2 = 'var(--neutral-200)'

  switch (patternId) {
    case 'clean-minimal':
      return (
        <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="72" height="52" rx="3" fill={c2} stroke={c1} strokeWidth="1.5" />
        </svg>
      )
    case 'split-duo':
      return (
        <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="34" height="52" rx="3" fill={c2} stroke={c1} strokeWidth="1.5" />
          <rect x="42" y="4" width="34" height="52" rx="3" fill={c1} stroke={c1} strokeWidth="1.5" />
        </svg>
      )
    case 'window-frame':
      return (
        <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="72" height="52" rx="3" fill={c2} stroke={c1} strokeWidth="1.5" />
          <rect x="20" y="14" width="40" height="32" rx="2" fill="white" stroke={c1} strokeWidth="1.5" />
        </svg>
      )
    case 'nameplate-classic':
      return (
        <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="72" height="52" rx="3" fill={c2} stroke={c1} strokeWidth="1.5" />
          <rect x="16" y="38" width="48" height="12" rx="2" fill="white" stroke={c1} strokeWidth="1.5" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 80 60" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="72" height="52" rx="3" fill={c2} stroke={c1} strokeWidth="1.5" />
        </svg>
      )
  }
}

/* ------------------------------------------------------------------ */
/*  Mini Progress Strip                                                */
/* ------------------------------------------------------------------ */
function CoverProgress({ config }) {
  const hasPattern = !!config.coverDesign
  const hasMaterial = !!config.coverMaterial && !!config.coverColor
  const hasNaming = !!config.coverName1 || !!config.coverName2

  const steps = [
    { label: 'Pattern', done: hasPattern, active: !hasPattern },
    { label: 'Material & Colour', done: hasMaterial, active: hasPattern && !hasMaterial },
    { label: 'Naming', done: hasNaming, active: hasPattern && hasMaterial && !hasNaming },
  ]

  return (
    <div className="pdp-cover-progress">
      {steps.map((step, idx) => {
        const cls = [
          'pdp-cover-progress-step',
          step.done && 'pdp-cover-progress-step--complete',
          step.active && 'pdp-cover-progress-step--active',
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <div key={idx} className={cls}>
            <span className="pdp-cover-progress-dot" />
            {step.label}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  6a  Pattern sub-section                                            */
/* ------------------------------------------------------------------ */
function PatternPicker() {
  const { config, updateConfig, updateMultiple } = usePDPConfig()
  const [resetAlert, setResetAlert] = useState(false)

  const selectPattern = useCallback(
    (patternId) => {
      // If changing pattern and material/color already set, warn and reset
      if (config.coverDesign && config.coverDesign !== patternId && (config.coverMaterial || config.coverColor)) {
        updateMultiple({
          coverDesign: patternId,
          coverMaterial: null,
          coverColor: null,
        })
        setResetAlert(true)
        setTimeout(() => setResetAlert(false), 4000)
      } else {
        updateConfig('coverDesign', patternId)
      }
    },
    [config, updateConfig, updateMultiple]
  )

  return (
    <div className="pdp-subsection">
      <div className="pdp-subsection-header">Pattern</div>

      {resetAlert && (
        <div className="pdp-amber-alert">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: 16, height: 16, flexShrink: 0 }}>
            <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="12" r="0.75" fill="currentColor" />
          </svg>
          <span>Pattern changed. Material and colour selections have been reset.</span>
          <button
            type="button"
            className="pdp-amber-alert-close"
            onClick={() => setResetAlert(false)}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      <div className="pdp-pattern-grid">
        {coverDesignPatterns.map(pattern => (
          <div
            key={pattern.id}
            className={`pdp-pattern-card${config.coverDesign === pattern.id ? ' pdp-pattern-card--selected' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={config.coverDesign === pattern.id}
            onClick={() => selectPattern(pattern.id)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                selectPattern(pattern.id)
              }
            }}
          >
            <div className="pdp-pattern-thumb">
              <PatternThumb patternId={pattern.id} />
            </div>
            <div className="pdp-pattern-info">
              <div className="pdp-pattern-name">{pattern.name}</div>
              <div className="pdp-pattern-desc">{pattern.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  6b  Material & Colour sub-section                                  */
/* ------------------------------------------------------------------ */

/* Simple color string -> hex mapping for swatch display */
const colorHexMap = {
  'Midnight Black': '#1a1a1a',
  'Charcoal': '#4a4a4a',
  'Slate Gray': '#708090',
  'Ivory': '#FFFFF0',
  'Cream': '#FFFDD0',
  'Pearl White': '#F5F5F0',
  'Midnight Blue': '#191970',
  'Deep Navy': '#1C2951',
  'Oxford Blue': '#002147',
  'Natural Tan': '#D2B48C',
  'Saddle Brown': '#8B4513',
  'Honey': '#EB9605',
  'Burgundy': '#800020',
  'Wine Red': '#722F37',
  'Oxblood': '#4A0000',
  'Navy': '#000080',
  'Royal Blue': '#4169E1',
  'Denim Blue': '#1560BD',
  'Stone Gray': '#928E85',
  'Graphite': '#383838',
}

function MaterialColourPicker() {
  const { config, updateConfig } = usePDPConfig()

  if (!config.coverDesign) {
    return (
      <div className="pdp-subsection">
        <div className="pdp-subsection-header">Material & Colour</div>
        <div className="pdp-info-bar pdp-info-bar--gray">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="4.5" r="0.75" fill="currentColor" />
          </svg>
          <span>Select a cover pattern first to see available materials.</span>
        </div>
      </div>
    )
  }

  const selectedMaterial = coverMaterials.find(m => m.id === config.coverMaterial)

  return (
    <div className="pdp-subsection">
      <div className="pdp-subsection-header">Material & Colour</div>

      {/* Material radio cards */}
      <div className="pdp-config-cards pdp-config-cards--stack">
        {coverMaterials.map(mat => {
          const cost = surcharges.coverMaterials[mat.id] ?? 0

          return (
            <div
              key={mat.id}
              className={`pdp-config-card${config.coverMaterial === mat.id ? ' pdp-config-card--selected' : ''}`}
              role="radio"
              tabIndex={0}
              aria-checked={config.coverMaterial === mat.id}
              onClick={() => {
                updateConfig('coverMaterial', mat.id)
                // Reset colour when material changes
                if (config.coverMaterial !== mat.id) {
                  updateConfig('coverColor', null)
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  updateConfig('coverMaterial', mat.id)
                  if (config.coverMaterial !== mat.id) {
                    updateConfig('coverColor', null)
                  }
                }
              }}
            >
              <div className="pdp-card-title">{mat.name}</div>
              <div className="pdp-card-desc">{mat.description}</div>
            </div>
          )
        })}
      </div>

      {/* Colour swatches (after material selected) */}
      {selectedMaterial && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--text-body-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--neutral-700)', marginBottom: 'var(--space-2)' }}>
            Choose a colour for {selectedMaterial.name}
          </div>
          <div className="pdp-swatches">
            {selectedMaterial.colors.map(color => {
              const isSelected = config.coverColor === color
              const hex = colorHexMap[color] || '#ccc'

              return (
                <button
                  key={color}
                  type="button"
                  className={`pdp-swatch${isSelected ? ' pdp-swatch--selected' : ''}`}
                  onClick={() => updateConfig('coverColor', color)}
                  aria-pressed={isSelected}
                  title={color}
                >
                  <div className="pdp-swatch-circle">
                    <div className="pdp-swatch-inner" style={{ background: hex }} />
                  </div>
                  <span className="pdp-swatch-label">{color}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  6c  Naming sub-section                                             */
/* ------------------------------------------------------------------ */
function NamingSection() {
  const { config, updateConfig } = usePDPConfig()

  const MAX_CHARS = 32

  const treatmentStyles = useMemo(
    () => ({
      'Gold Foil': { color: '#C5A03F', textShadow: '0 1px 2px rgba(197,160,63,0.3)', background: '#2c2c2c' },
      'Silver Foil': { color: '#C0C0C0', textShadow: '0 1px 2px rgba(192,192,192,0.3)', background: '#2c2c2c' },
      'Rose Gold Foil': { color: '#B76E79', textShadow: '0 1px 2px rgba(183,110,121,0.3)', background: '#2c2c2c' },
      'Deboss': { color: 'transparent', textShadow: 'none', WebkitTextStroke: '1px var(--neutral-400)', background: 'var(--neutral-100)' },
      'Printed': { color: 'var(--neutral-800)', textShadow: 'none', background: 'var(--neutral-50)' },
    }),
    []
  )

  const currentStyle = treatmentStyles[config.namingTreatment] || treatmentStyles['Printed']
  const treatmentCost = config.namingTreatment ? (surcharges.namingTreatments[config.namingTreatment] ?? 0) : 0
  const lineCount = [config.coverName1, config.coverName2].filter(Boolean).length || 1
  const namingTotal = treatmentCost * lineCount

  return (
    <div className="pdp-subsection">
      <div className="pdp-subsection-header">
        Naming
        <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--neutral-500)', fontWeight: 'var(--weight-regular)' }}>
          (Optional)
        </span>
      </div>

      {/* Line 1 */}
      <div className="pdp-naming-row">
        <label className="pdp-naming-label">Line 1</label>
        <div className="pdp-naming-fields">
          <input
            type="text"
            className="pdp-naming-input"
            maxLength={MAX_CHARS}
            placeholder="e.g. Priya & Rahul"
            value={config.coverName1}
            onChange={e => updateConfig('coverName1', e.target.value)}
            aria-label="Cover name line 1"
          />
          <span className="pdp-naming-char-count">
            {config.coverName1.length}/{MAX_CHARS}
          </span>
          <select
            className="pdp-range-select"
            value={config.namingTreatment || ''}
            onChange={e => updateConfig('namingTreatment', e.target.value || null)}
            aria-label="Naming treatment"
            style={{ maxWidth: 180 }}
          >
            <option value="">Select treatment</option>
            {namingTreatments.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Line 2 */}
      <div className="pdp-naming-row">
        <label className="pdp-naming-label">Line 2</label>
        <div className="pdp-naming-fields">
          <input
            type="text"
            className="pdp-naming-input"
            maxLength={MAX_CHARS}
            placeholder="e.g. 15 December 2025"
            value={config.coverName2}
            onChange={e => updateConfig('coverName2', e.target.value)}
            aria-label="Cover name line 2"
          />
          <span className="pdp-naming-char-count">
            {config.coverName2.length}/{MAX_CHARS}
          </span>
        </div>
      </div>

      {/* Live preview */}
      {(config.coverName1 || config.coverName2) && (
        <div
          className="pdp-name-preview"
          style={{ background: currentStyle.background }}
        >
          {config.coverName1 && (
            <div
              className="pdp-name-preview-text"
              style={{
                color: currentStyle.color,
                textShadow: currentStyle.textShadow,
                WebkitTextStroke: currentStyle.WebkitTextStroke || 'unset',
              }}
            >
              {config.coverName1}
            </div>
          )}
          {config.coverName2 && (
            <div
              className="pdp-name-preview-text"
              style={{
                color: currentStyle.color,
                textShadow: currentStyle.textShadow,
                WebkitTextStroke: currentStyle.WebkitTextStroke || 'unset',
                fontSize: 'var(--text-body-lg)',
                fontWeight: 'var(--weight-medium)',
                letterSpacing: '0.06em',
              }}
            >
              {config.coverName2}
            </div>
          )}
          <span className="pdp-name-preview-label">
            {config.namingTreatment || 'Preview'} &mdash; approximate appearance
          </span>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */
export default function SectionCover() {
  const { config } = usePDPConfig()

  return (
    <div>
      <CoverProgress config={config} />
      <PatternPicker />
      <MaterialColourPicker />
      <NamingSection />
    </div>
  )
}
