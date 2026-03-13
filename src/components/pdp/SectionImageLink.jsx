/**
 * SectionImageLink
 * ----------------
 * Image link upload section for the PDP config flow.
 * URL input with inline validation, platform labels, optional access password,
 * and a persistent amber info bar about file privacy.
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-url-input-wrap, .pdp-url-input, .pdp-url-input--valid,
 *   .pdp-url-input--invalid, .pdp-url-status, .pdp-url-status--valid,
 *   .pdp-url-status--invalid, .pdp-platforms, .pdp-info-bar, .pdp-info-bar--amber
 */

import { useState, useCallback } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'

/**
 * Checks whether a string looks like a valid image-sharing URL.
 */
function isValidLink(value) {
  if (!value || !value.trim()) return null // empty = no state
  const v = value.trim().toLowerCase()
  if (v.startsWith('http://') || v.startsWith('https://')) return true
  if (v.includes('drive.google') || v.includes('dropbox') || v.includes('wetransfer')) return true
  return false
}

export default function SectionImageLink() {
  const { config, updateConfig } = usePDPConfig()

  const [touched, setTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [accessPassword, setAccessPassword] = useState('')

  const value = config.imageLink || ''
  const validity = touched ? isValidLink(value) : null

  const handleChange = useCallback((e) => {
    updateConfig('imageLink', e.target.value)
  }, [updateConfig])

  const handleBlur = useCallback(() => {
    setTouched(true)
  }, [])

  /* ---- Build input class ---- */
  const inputClass = [
    'pdp-url-input',
    validity === true && 'pdp-url-input--valid',
    validity === false && 'pdp-url-input--invalid',
  ].filter(Boolean).join(' ')

  return (
    <div>
      {/* URL Input */}
      <div className="pdp-url-input-wrap">
        <input
          type="url"
          className={inputClass}
          placeholder="Google Drive, Dropbox, WeTransfer, or direct URL"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="off"
        />

        {/* Inline validation status */}
        {validity === true && (
          <span className="pdp-url-status pdp-url-status--valid">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Link accepted
          </span>
        )}
        {validity === false && (
          <span className="pdp-url-status pdp-url-status--invalid">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            We couldn't verify this link
          </span>
        )}
      </div>

      {/* Platform labels */}
      <div className="pdp-platforms">
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          Google Drive
        </span>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Dropbox
        </span>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          WeTransfer
        </span>
        <span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          Direct URL
        </span>
      </div>

      {/* Access password toggle */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <button
          type="button"
          className="pdp-faq-toggle"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? 'Hide access notes' : 'Add access notes'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points={showPassword ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
          </svg>
        </button>

        {showPassword && (
          <div style={{ marginTop: 12 }}>
            <input
              type="text"
              className="pdp-url-input"
              placeholder="Access password or notes for our team"
              value={accessPassword}
              onChange={(e) => setAccessPassword(e.target.value)}
              autoComplete="off"
              style={{ fontSize: 'var(--text-body-sm)' }}
            />
          </div>
        )}
      </div>

      {/* Persistent amber info bar */}
      <div className="pdp-info-bar pdp-info-bar--amber" style={{ marginTop: 'var(--space-4)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span>Your files are never shared outside our production team.</span>
      </div>
    </div>
  )
}
