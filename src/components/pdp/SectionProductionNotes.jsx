/**
 * SectionProductionNotes
 * ----------------------
 * Optional production notes textarea for the PDP config flow.
 * Simple textarea with live character counter and a note about production contact.
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-textarea, .pdp-char-count, .pdp-info-bar, .pdp-info-bar--gray
 */

import { useCallback } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'

const MAX_CHARS = 1000

export default function SectionProductionNotes() {
  const { config, updateConfig } = usePDPConfig()

  const value = config.productionNotes || ''
  const charCount = value.length

  const handleChange = useCallback((e) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      updateConfig('productionNotes', text)
    }
  }, [updateConfig])

  return (
    <div>
      {/* Note about production contact */}
      <div className="pdp-info-bar pdp-info-bar--gray">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <span>
          A dedicated production manager will contact you within 24 hours of placing your order to confirm all specifications. Use this space for anything we should know.
        </span>
      </div>

      {/* Label */}
      <label
        htmlFor="pdp-production-notes"
        style={{
          display: 'block',
          fontWeight: 'var(--weight-semibold)',
          fontSize: 'var(--text-body-md)',
          color: 'var(--neutral-800)',
          marginBottom: 8,
        }}
      >
        Additional Instructions — Optional
      </label>

      {/* Textarea */}
      <textarea
        id="pdp-production-notes"
        className="pdp-textarea"
        placeholder={"e.g. Please use a specific layout for pages 4-5. Keep warm tones throughout. The album is a surprise gift — please package discreetly."}
        value={value}
        onChange={handleChange}
        maxLength={MAX_CHARS}
      />

      {/* Character counter */}
      <div className="pdp-char-count">
        {charCount} / {MAX_CHARS}
      </div>
    </div>
  )
}
