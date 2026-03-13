/**
 * SectionWrapper
 * --------------
 * A collapsible accordion section used in the PDP configuration flow. Each
 * section shows a header with a status icon, title, optional subtitle, tooltip,
 * and chevron toggle. The body animates open/closed via max-height transition.
 *
 * Props:
 *   @param {string}    sectionId   - Unique section identifier (for scroll targets).
 *   @param {string}    title       - Bold section heading.
 *   @param {string}    subtitle    - Gray secondary text below the title.
 *   @param {string}    tooltip     - Optional tooltip text (renders TooltipIcon).
 *   @param {boolean}   required    - If false, shows "(Optional)" tag.
 *   @param {boolean}   isExpanded  - Whether the section body is visible.
 *   @param {function}  onToggle    - Callback when the header is clicked.
 *   @param {string}    status      - 'not-visited' | 'complete' | 'error'.
 *   @param {ReactNode} children    - Section body content.
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-section, .pdp-section--expanded, .pdp-section-header,
 *   .pdp-section-status, .pdp-section-status--pending/--complete/--error,
 *   .pdp-section-titles, .pdp-section-title, .pdp-section-subtitle,
 *   .pdp-section-optional-tag, .pdp-section-chevron, .pdp-section-body,
 *   .pdp-section-content, .pdp-section-error
 */

import { useCallback, useRef, useEffect } from 'react'
import TooltipIcon from './TooltipIcon'

/* ---- Status icon SVGs ---- */

/** Down-arrow icon for pending/not-visited state */
const ArrowIcon = () => (
  <svg viewBox="0 0 14 14" fill="none">
    <path
      d="M7 2.5v9M3.5 8l3.5 3.5L10.5 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Checkmark icon for complete state */
const CheckIcon = () => (
  <svg viewBox="0 0 14 14" fill="none">
    <path
      d="M3 7.5l3 3 5-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** Exclamation icon for error state */
const ExclamationIcon = () => (
  <svg viewBox="0 0 14 14" fill="none">
    <path
      d="M7 4v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="7" cy="10.5" r="0.75" fill="currentColor" />
  </svg>
)

/** Chevron icon for expand/collapse */
const ChevronIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" className="pdp-section-chevron">
    <path
      d="M5 7.5l5 5 5-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Maps a status string to the corresponding CSS modifier and icon component.
 */
function getStatusConfig(status) {
  switch (status) {
    case 'complete':
      return { modifier: 'pdp-section-status--complete', Icon: CheckIcon }
    case 'error':
      return { modifier: 'pdp-section-status--error', Icon: ExclamationIcon }
    case 'not-visited':
    default:
      return { modifier: 'pdp-section-status--pending', Icon: ArrowIcon }
  }
}

export default function SectionWrapper({
  sectionId,
  title,
  subtitle,
  tooltip,
  required = true,
  isExpanded = false,
  onToggle,
  status = 'not-visited',
  children,
}) {
  const sectionRef = useRef(null)
  const { modifier: statusModifier, Icon: StatusIcon } = getStatusConfig(status)

  /* ---- Scroll into view when section expands ---- */
  useEffect(() => {
    if (isExpanded && sectionRef.current) {
      const timer = setTimeout(() => {
        sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [isExpanded])

  /* ---- Header click handler ---- */
  const handleToggle = useCallback(() => {
    if (onToggle) onToggle(sectionId)
  }, [onToggle, sectionId])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggle()
    }
  }, [handleToggle])

  const sectionClass = [
    'pdp-section',
    isExpanded && 'pdp-section--expanded',
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={sectionRef}
      id={`section-${sectionId}`}
      className={sectionClass}
    >
      {/* ---- Header ---- */}
      <div
        className="pdp-section-header"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`section-body-${sectionId}`}
      >
        {/* Status indicator circle */}
        <div className={`pdp-section-status ${statusModifier}`}>
          <StatusIcon />
        </div>

        {/* Title block */}
        <div className="pdp-section-titles">
          <div className="pdp-section-title">
            {title}
            {!required && (
              <span className="pdp-section-optional-tag">(Optional)</span>
            )}
            {tooltip && <TooltipIcon text={tooltip} />}
          </div>
          {subtitle && (
            <div className="pdp-section-subtitle">{subtitle}</div>
          )}
        </div>

        {/* Chevron */}
        <ChevronIcon />
      </div>

      {/* ---- Collapsible body ---- */}
      <div
        id={`section-body-${sectionId}`}
        className="pdp-section-body"
        role="region"
        aria-labelledby={`section-${sectionId}`}
      >
        <div className="pdp-section-content">
          {/* Error message banner */}
          {status === 'error' && isExpanded && (
            <div className="pdp-section-error" role="alert">
              Please complete this section before proceeding.
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
