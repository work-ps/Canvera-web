import { useState, useCallback, useMemo } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import { laminations, papers, specialPapers } from '../../data/pdpOptions'
import { surcharges } from '../../data/pdpPricing'
import ConfigCard from './ConfigCard'

function formatINR(amount) {
  if (amount == null) return ''
  return amount.toLocaleString('en-IN')
}

/* ------------------------------------------------------------------ */
/*  Lamination sub-section                                            */
/* ------------------------------------------------------------------ */
function LaminationPicker() {
  const { config, updateConfig } = usePDPConfig()

  const pairingNotes = {
    Matte: 'Matte lamination pairs best with silk and lustre papers for a clean, professional look.',
    Glossy: 'Glossy lamination enhances vibrancy. Pairs well with silk and lustre papers.',
    'Soft Touch': 'Soft Touch creates a velvety, premium feel. Best with standard silk paper for maximum impact.',
    'No Lamination': 'No lamination is required for pre-finished fine art and archival cotton papers.',
  }

  return (
    <div className="pdp-subsection">
      <div className="pdp-subsection-header">Lamination</div>

      <div className="pdp-swatches">
        {laminations.map(lam => {
          const isSelected = config.lamination === lam.id

          return (
            <button
              key={lam.id}
              type="button"
              className={`pdp-swatch${isSelected ? ' pdp-swatch--selected' : ''}`}
              onClick={() => updateConfig('lamination', lam.id)}
              title={lam.tooltip}
              aria-pressed={isSelected}
            >
              <div className="pdp-swatch-circle">
                <div
                  className="pdp-swatch-inner"
                  style={{ background: lam.swatch }}
                />
              </div>
              <span className="pdp-swatch-label">{lam.name}</span>
            </button>
          )
        })}
      </div>

      {config.lamination && pairingNotes[config.lamination] && (
        <div className="pdp-pairing-note">{pairingNotes[config.lamination]}</div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Paper sub-section                                            */
/* ------------------------------------------------------------------ */
const paperFAQ = [
  {
    q: 'What is the difference between gsm weights?',
    a: 'GSM (grams per square metre) measures paper thickness. Higher GSM means thicker, more substantial pages. 200gsm is standard; 310gsm feels luxuriously heavy.',
  },
  {
    q: 'Can I mix paper types within one book?',
    a: 'The main paper type applies to all regular pages. For select pages with a different finish, use the Special Paper option below to assign alternate paper to specific page ranges.',
  },
  {
    q: 'Why are some papers incompatible with my lamination?',
    a: 'Certain papers have pre-finished surfaces that conflict with lamination coatings. For example, Archival Cotton must remain unlaminated to preserve its texture.',
  },
  {
    q: 'Which paper is best for wedding albums?',
    a: 'Standard Silk 200gsm is our most popular choice for weddings. For a premium feel, Lustre Satin 280gsm offers a semi-gloss finish that balances vibrancy with elegance.',
  },
]

function MainPaperPicker() {
  const { config, updateConfig } = usePDPConfig()
  const [faqOpen, setFaqOpen] = useState(false)
  const [openFaqIdx, setOpenFaqIdx] = useState(null)

  const isCompatible = useCallback(
    (paper) => {
      if (!config.lamination) return true
      return paper.compatibleLaminations.includes(config.lamination)
    },
    [config.lamination]
  )

  return (
    <div className="pdp-subsection">
      <div className="pdp-subsection-header">
        Main Paper
        <button
          type="button"
          className="pdp-faq-toggle"
          onClick={() => setFaqOpen(prev => !prev)}
          aria-expanded={faqOpen}
        >
          {faqOpen ? 'Hide' : 'Paper'} FAQ {faqOpen ? '\u2191' : '\u2193'}
        </button>
      </div>

      {/* FAQ Drawer */}
      {faqOpen && (
        <div className="pdp-faq-drawer">
          {paperFAQ.map((item, idx) => (
            <div key={idx} className="pdp-faq-item">
              <button
                type="button"
                className="pdp-faq-question"
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                aria-expanded={openFaqIdx === idx}
              >
                {item.q}
                <span style={{ fontSize: 14, transform: openFaqIdx === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                  &#x25BE;
                </span>
              </button>
              {openFaqIdx === idx && (
                <div className="pdp-faq-answer">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pdp-config-cards pdp-config-cards--stack" style={{ marginTop: faqOpen ? 'var(--space-4)' : 0 }}>
        {papers.map(paper => {
          const compatible = isCompatible(paper)
          const cost = surcharges.papers[paper.id] ?? 0

          return (
            <ConfigCard
              key={paper.id}
              selected={config.paper === paper.id}
              disabled={!compatible}
              title={`${paper.name} ${paper.weight}`}
              subtitle={paper.description}
              specs={[
                paper.surface,
                `Recommended: ${paper.recommended}`,
                !compatible ? `Incompatible with ${config.lamination} lamination` : '',
              ].filter(Boolean)}
              onClick={() => updateConfig('paper', paper.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Special Paper sub-section                                         */
/* ------------------------------------------------------------------ */
function SpecialPaperSection() {
  const { config, updateConfig, updateMultiple } = usePDPConfig()

  const enabled = config.specialPaperEnabled
  const ranges = config.specialPaperRanges || []

  const totalPages = (config.sheets || 10) * 2
  const perSheet = surcharges.specialPaperPerSheet

  const toggleEnabled = useCallback(() => {
    const next = !enabled
    if (!next) {
      updateMultiple({ specialPaperEnabled: false, specialPaperRanges: [] })
    } else {
      updateMultiple({
        specialPaperEnabled: true,
        specialPaperRanges: ranges.length > 0
          ? ranges
          : [{ from: 1, to: 2, paperType: specialPapers[0]?.id || '' }],
      })
    }
  }, [enabled, ranges, updateMultiple])

  const updateRange = useCallback(
    (idx, field, value) => {
      const next = ranges.map((r, i) =>
        i === idx ? { ...r, [field]: value } : r
      )
      updateConfig('specialPaperRanges', next)
    },
    [ranges, updateConfig]
  )

  const addRange = useCallback(() => {
    const lastTo = ranges.length > 0 ? ranges[ranges.length - 1].to : 0
    const newFrom = Math.min(lastTo + 1, totalPages)
    const newTo = Math.min(newFrom + 1, totalPages)
    updateConfig('specialPaperRanges', [
      ...ranges,
      { from: newFrom, to: newTo, paperType: specialPapers[0]?.id || '' },
    ])
  }, [ranges, totalPages, updateConfig])

  const removeRange = useCallback(
    (idx) => {
      const next = ranges.filter((_, i) => i !== idx)
      updateConfig('specialPaperRanges', next)
      if (next.length === 0) {
        updateConfig('specialPaperEnabled', false)
      }
    },
    [ranges, updateConfig]
  )

  /** Detect overlapping ranges */
  const overlapWarning = useMemo(() => {
    for (let i = 0; i < ranges.length; i++) {
      for (let j = i + 1; j < ranges.length; j++) {
        const a = ranges[i]
        const b = ranges[j]
        if (a.from <= b.to && b.from <= a.to) {
          return `Ranges ${i + 1} and ${j + 1} overlap. Please adjust the page numbers.`
        }
      }
    }
    return null
  }, [ranges])

  /** Detect out-of-bounds */
  const boundsWarning = useMemo(() => {
    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i]
      if (r.from < 1 || r.to > totalPages || r.from > r.to) {
        return `Range ${i + 1} has invalid page numbers (valid: 1\u2013${totalPages}).`
      }
    }
    return null
  }, [ranges, totalPages])

  return (
    <div className="pdp-subsection">
      <div className="pdp-toggle-row">
        <span className="pdp-toggle-label">Add premium paper to specific pages</span>
        <button
          type="button"
          className={`pdp-toggle${enabled ? ' pdp-toggle--on' : ''}`}
          onClick={toggleEnabled}
          role="switch"
          aria-checked={enabled}
        >
          <span className="pdp-toggle-knob" />
        </button>
      </div>

      {enabled && (
        <div style={{ marginTop: 'var(--space-3)' }}>
          {(overlapWarning || boundsWarning) && (
            <div className="pdp-amber-alert">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ width: 16, height: 16, flexShrink: 0 }}>
                <path d="M8 1L1 14h14L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="12" r="0.75" fill="currentColor" />
              </svg>
              <span>{overlapWarning || boundsWarning}</span>
            </div>
          )}

          <div className="pdp-range-rows">
            {ranges.map((range, idx) => {
              const rangeSheets = Math.max(0, Math.ceil((range.to - range.from + 1) / 2))
              const rangeCost = rangeSheets * perSheet

              return (
                <div key={idx} className="pdp-range-row">
                  <span style={{ fontSize: 'var(--text-body-xs)', color: 'var(--neutral-500)', whiteSpace: 'nowrap' }}>
                    Pages
                  </span>
                  <input
                    type="number"
                    className="pdp-range-input"
                    min={1}
                    max={totalPages}
                    value={range.from}
                    onChange={e => updateRange(idx, 'from', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    aria-label={`Range ${idx + 1} start page`}
                  />
                  <span className="pdp-range-to">to</span>
                  <input
                    type="number"
                    className="pdp-range-input"
                    min={1}
                    max={totalPages}
                    value={range.to}
                    onChange={e => updateRange(idx, 'to', Math.min(totalPages, parseInt(e.target.value, 10) || 1))}
                    aria-label={`Range ${idx + 1} end page`}
                  />
                  <select
                    className="pdp-range-select"
                    value={range.paperType}
                    onChange={e => updateRange(idx, 'paperType', e.target.value)}
                    aria-label={`Range ${idx + 1} paper type`}
                  >
                    {specialPapers.map(sp => (
                      <option key={sp.id} value={sp.id}>{sp.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="pdp-range-remove"
                    onClick={() => removeRange(idx)}
                    aria-label={`Remove range ${idx + 1}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            className="pdp-add-range"
            onClick={addRange}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add another range
          </button>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main export                                                       */
/* ------------------------------------------------------------------ */
export default function SectionPaper() {
  return (
    <div>
      <LaminationPicker />
      <MainPaperPicker />
      <SpecialPaperSection />
    </div>
  )
}
