import { useCallback, useMemo, useState } from 'react'
import { laminations, papers, specialPapers } from '../../data/pdpOptions'
import { surcharges } from '../../data/pdpPricing'
import ConfigCard from '../pdp/ConfigCard'
import TooltipIcon from '../pdp/TooltipIcon'

function formatPrice(n) { return n?.toLocaleString('en-IN') || '0' }

function makeSpecialEntry() {
  return { type: '', sheets: 2, fromPage: '', toPage: '', selectedPages: [] }
}

const PAPER_FAQS = [
  {
    q: 'What\u2019s the difference between paper types?',
    a: 'Standard Silk is versatile and affordable. Fine Art Matte has a textured, cotton-like feel ideal for B&W work. Lustre Satin balances vibrancy with reduced glare. Archival Cotton is museum-grade for heirloom albums.',
  },
  {
    q: 'Which paper works best for wedding albums?',
    a: 'Lustre Satin or Standard Silk are the most popular choices for weddings. Lustre Satin offers richer tones with less glare, while Standard Silk is a reliable all-rounder.',
  },
  {
    q: 'Does my paper choice affect lamination?',
    a: 'Yes. Some papers are only compatible with certain laminations. For example, Archival Cotton must be used without lamination, while Fine Art Matte works best with Matte or No Lamination.',
  },
]

export default function StepPaper({ config, onChange }) {
  const set = useCallback((k, v) => onChange(k, v), [onChange])
  const [faqOpen, setFaqOpen] = useState(false)
  const [openFaqIdx, setOpenFaqIdx] = useState(null)

  // Filter papers by selected lamination compatibility
  const compatiblePapers = useMemo(() => {
    if (!config.lamination) return []
    return papers.filter(p => p.compatibleLaminations.includes(config.lamination))
  }, [config.lamination])

  // Premium papers (top 2 by surcharge)
  const premiumPaperIds = useMemo(() => {
    const sorted = [...papers]
      .map(p => ({ id: p.id, price: surcharges.papers[p.id] || 0 }))
      .sort((a, b) => b.price - a.price)
    return new Set(sorted.slice(0, 2).filter(p => p.price > 0).map(p => p.id))
  }, [])

  // Special paper entries
  const entries = config.specialPaperEntries || []
  const totalPages = (config.sheets || 20) * 2

  const addEntry = () => set('specialPaperEntries', [...entries, makeSpecialEntry()])
  const removeEntry = (idx) => set('specialPaperEntries', entries.filter((_, i) => i !== idx))

  const updateEntry = (idx, key, val) => {
    const updated = entries.map((e, i) => {
      if (i !== idx) return e
      const next = { ...e, [key]: val }

      // Auto-fill toPage = fromPage when fromPage is set
      if (key === 'fromPage' && val) {
        const from = parseInt(val)
        if (!next.toPage) next.toPage = val
        // Auto-calculate sheets and generate selected pages from range
        const to = parseInt(next.toPage) || from
        const pages = []
        for (let p = from; p <= to; p++) pages.push(p)
        next.selectedPages = pages
        next.sheets = pages.length
      }
      if (key === 'toPage' && val) {
        const from = parseInt(next.fromPage) || 1
        const to = parseInt(val)
        const pages = []
        for (let p = from; p <= to; p++) pages.push(p)
        next.selectedPages = pages
        next.sheets = pages.length
      }
      return next
    })
    set('specialPaperEntries', updated)
  }

  const togglePage = (idx, pageNum) => {
    const updated = entries.map((e, i) => {
      if (i !== idx) return e
      const pages = e.selectedPages.includes(pageNum)
        ? e.selectedPages.filter(p => p !== pageNum)
        : [...e.selectedPages, pageNum].sort((a, b) => a - b)
      return { ...e, selectedPages: pages, sheets: pages.length }
    })
    set('specialPaperEntries', updated)
  }

  const addPageToEntry = (idx) => {
    const entry = entries[idx]
    const maxSelected = Math.max(0, ...entry.selectedPages)
    const nextPage = maxSelected + 1
    if (nextPage <= totalPages) {
      togglePage(idx, nextPage)
    }
  }

  return (
    <div className="oc-step">
      {/* Read-only page count */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Number of Pages
          <TooltipIcon text="Total sheets in your album. Each sheet = 2 printed pages. Set in the Files step." />
        </h3>
        <div className="oc-readonly-box">
          <strong>{config.sheets || 20} sheets</strong> ({(config.sheets || 20) * 2} pages)
        </div>
      </section>

      {/* Lamination Type — ConfigCards */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Lamination Type
          <TooltipIcon text="A protective coating applied to each page. Affects sheen, texture, and durability." />
        </h3>
        <div className="pdp-config-cards">
          {laminations.map(lam => {
            const cost = surcharges.laminations[lam.id] || 0
            return (
              <ConfigCard
                key={lam.id}
                selected={config.lamination === lam.id}
                title={lam.name}
                subtitle={lam.description}
                price={cost > 0 ? cost : null}
                priceType={cost > 0 ? 'addon' : 'included'}
                onClick={() => {
                  set('lamination', lam.id)
                  if (config.paper) {
                    const pData = papers.find(p => p.id === config.paper)
                    if (pData && !pData.compatibleLaminations.includes(lam.id)) {
                      set('paper', null)
                    }
                  }
                }}
              />
            )
          })}
        </div>
      </section>

      {/* Paper Type — dropdown, shown after lamination */}
      {config.lamination && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Paper Type
            <TooltipIcon text="The paper stock your album pages are printed on. Affects colour, texture, and weight." />
          </h3>
          <select
            className="oc-input oc-select"
            value={config.paper || ''}
            onChange={e => set('paper', e.target.value || null)}
          >
            <option value="">Select paper type...</option>
            {compatiblePapers.map(paper => {
              const price = surcharges.papers[paper.id] || 0
              const isSpecial = premiumPaperIds.has(paper.id)
              return (
                <option key={paper.id} value={paper.id}>
                  {paper.name} {paper.weight}{isSpecial ? ' ★' : ''}{price > 0 ? ` (+₹${formatPrice(price)})` : ' (Included)'}
                </option>
              )
            })}
          </select>
          {compatiblePapers.length === 0 && (
            <p className="oc-section-desc">No papers compatible with {config.lamination} lamination.</p>
          )}

          {/* Selected paper details */}
          {config.paper && (() => {
            const sel = compatiblePapers.find(p => p.id === config.paper)
            if (!sel) return null
            const price = surcharges.papers[sel.id] || 0
            return (
              <div className="oc-paper-detail">
                <div className="oc-paper-detail-name">
                  {sel.name} {sel.weight}
                  {premiumPaperIds.has(sel.id) && <span className="oc-badge-special">SPECIAL</span>}
                </div>
                <div className="oc-paper-detail-desc">{sel.description}</div>
                <div className="oc-paper-detail-specs">
                  <span>{sel.surface}</span>
                  <span>Recommended: {sel.recommended}</span>
                </div>
                <div className="oc-paper-detail-price">
                  {price > 0 ? `+₹${formatPrice(price)}` : 'Included in base price'}
                </div>
              </div>
            )
          })()}

          {/* FAQ helper */}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <button
              className="pdp-faq-toggle"
              type="button"
              onClick={() => setFaqOpen(prev => !prev)}
              aria-expanded={faqOpen}
            >
              Not sure which paper?
              <span style={{ marginLeft: 4 }}>{faqOpen ? '\u2191' : '\u2192'}</span>
              {' '}Learn more
            </button>
          </div>

          {faqOpen && (
            <div className="pdp-faq-drawer">
              {PAPER_FAQS.map((faq, i) => (
                <div key={i} className="pdp-faq-item">
                  <button
                    className="pdp-faq-question"
                    type="button"
                    onClick={() => setOpenFaqIdx(openFaqIdx === i ? null : i)}
                    aria-expanded={openFaqIdx === i}
                  >
                    {faq.q}
                    <svg viewBox="0 0 16 16" fill="none" width="14" height="14" style={{ transform: openFaqIdx === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {openFaqIdx === i && (
                    <div className="pdp-faq-answer">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Special Paper for Select Pages */}
      {config.paper && (
        <section className="oc-section">
          <div className="oc-toggle-header">
            <div className="oc-toggle-header-left">
              <svg viewBox="0 0 20 20" fill="none" width="20" height="20">
                <rect x="2" y="3" width="16" height="14" rx="2" stroke="var(--petrol-500)" strokeWidth="1.3"/>
                <path d="M6 8h8M6 11h5" stroke="var(--petrol-500)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="oc-toggle-title">Special Paper for Select Pages</div>
                <div className="oc-toggle-subtitle">Embossing, foiling, or different stock</div>
              </div>
            </div>
            <button
              className={`oc-switch${config.specialPaperEnabled ? ' oc-switch--on' : ''}`}
              role="switch"
              aria-checked={config.specialPaperEnabled || false}
              onClick={() => {
                const next = !config.specialPaperEnabled
                set('specialPaperEnabled', next)
                if (next && entries.length === 0) {
                  set('specialPaperEntries', [makeSpecialEntry()])
                }
              }}
            >
              <span className="oc-switch-knob" />
            </button>
          </div>

          {config.specialPaperEnabled && (
            <div className="oc-special-papers">
              {entries.map((entry, idx) => (
                <div key={idx} className="oc-special-entry">
                  <div className="oc-special-entry-header">
                    <span className="oc-special-entry-num">Special Paper #{idx + 1}</span>
                    <button className="oc-special-remove" onClick={() => removeEntry(idx)}>
                      Remove
                    </button>
                  </div>

                  {/* Row 1: Paper Type + No. of Sheets */}
                  <div className="oc-field-row oc-field-row--2">
                    <div className="oc-field">
                      <label className="oc-label">Paper Type</label>
                      <select
                        className="oc-input oc-select"
                        value={entry.type}
                        onChange={e => updateEntry(idx, 'type', e.target.value)}
                      >
                        <option value="">Select...</option>
                        {specialPapers.map(sp => (
                          <option key={sp.id} value={sp.id}>{sp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="oc-field">
                      <label className="oc-label">No. of Sheets</label>
                      <input
                        type="number"
                        className="oc-input"
                        min={1}
                        max={config.sheets || 80}
                        value={entry.sheets}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Row 2: From Page + To Page */}
                  <div className="oc-field-row oc-field-row--2" style={{ marginTop: 'var(--space-4)' }}>
                    <div className="oc-field">
                      <label className="oc-label">From Page</label>
                      <input
                        type="number"
                        className="oc-input"
                        min={1}
                        max={totalPages}
                        value={entry.fromPage}
                        onChange={e => updateEntry(idx, 'fromPage', e.target.value)}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="oc-field">
                      <label className="oc-label">To Page</label>
                      <input
                        type="number"
                        className="oc-input"
                        min={entry.fromPage || 1}
                        max={totalPages}
                        value={entry.toPage}
                        onChange={e => updateEntry(idx, 'toPage', e.target.value)}
                        placeholder="e.g. 6"
                      />
                    </div>
                  </div>

                  {/* Page pills — generated from range, toggleable */}
                  {entry.selectedPages.length > 0 && (
                    <div className="oc-page-pills-section">
                      <label className="oc-label">Apply Special Paper To</label>
                      <div className="oc-page-pills">
                        {entry.selectedPages.map(p => (
                          <button
                            key={p}
                            className="oc-page-pill oc-page-pill--active"
                            onClick={() => togglePage(idx, p)}
                          >
                            Page {p}
                          </button>
                        ))}
                        <button
                          className="oc-page-pill oc-page-pill--add"
                          onClick={() => addPageToEntry(idx)}
                        >
                          + Add page
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="oc-special-price-hint">
                    &#x20B9;{formatPrice(surcharges.specialPaperPerSheet)}/sheet &middot; {entry.sheets} sheet{entry.sheets !== 1 ? 's' : ''} = &#x20B9;{formatPrice(entry.sheets * surcharges.specialPaperPerSheet)}
                  </div>
                </div>
              ))}

              <button className="oc-add-btn" onClick={addEntry}>
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Add another special paper
              </button>
            </div>
          )}
        </section>
      )}

      {/* Color Printing — ConfigCards */}
      {config.paper && (
        <section className="oc-section">
          <h3 className="oc-section-heading">
            Color Printing
            <TooltipIcon text="CMYK is standard high-quality printing. Hexachrome expands the colour range for vivid results." />
          </h3>
          <div className="pdp-config-cards">
            <ConfigCard
              selected={config.colorPrinting === '4-Color CMYK'}
              title="4-Color CMYK"
              subtitle="Standard high-quality colour printing process"
              priceType="included"
              onClick={() => set('colorPrinting', '4-Color CMYK')}
            />
            <ConfigCard
              selected={config.colorPrinting === 'Hexachrome'}
              title="Hexachrome"
              subtitle="Extended gamut for vivid, true-to-life colours"
              price={15}
              priceType="addon"
              onClick={() => set('colorPrinting', 'Hexachrome')}
            >
              <div style={{ fontSize: 'var(--text-body-xs)', color: 'var(--amber-600)', fontWeight: 'var(--weight-semibold)', marginTop: 'var(--space-1)' }}>+15% surcharge</div>
            </ConfigCard>
          </div>
        </section>
      )}
    </div>
  )
}
