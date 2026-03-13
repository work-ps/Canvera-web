/**
 * SectionProgressDots
 * -------------------
 * A fixed vertical stack of dots anchored to the right edge of the viewport.
 * Each dot represents a configuration section and reflects its current state
 * (pending, active, complete, error). Hovering a dot reveals the section label.
 * Clicking a dot scrolls the page to that section.
 *
 * Props:
 *   @param {Array<{id: string, title: string}>} sections       - Ordered list of sections.
 *   @param {Object}                             sectionStates  - Map of sectionId -> status string.
 *   @param {string}                             expandedSection - Currently expanded section id.
 *   @param {function}                           onDotClick      - Callback(sectionId) when a dot is clicked.
 *
 * CSS classes consumed (from pdp-shared.css):
 *   .pdp-progress-dots, .pdp-progress-dot, .pdp-progress-dot--active,
 *   .pdp-progress-dot--complete, .pdp-progress-dot--error,
 *   .pdp-progress-dot-label
 */

import { useCallback } from 'react'

/**
 * Maps a section state string to the appropriate CSS modifier class.
 * If the section is the currently expanded one, it is always "active".
 */
function getDotModifier(sectionId, sectionStates, expandedSection) {
  if (expandedSection === sectionId) {
    return 'pdp-progress-dot--active'
  }

  const state = sectionStates[sectionId]
  switch (state) {
    case 'complete':
      return 'pdp-progress-dot--complete'
    case 'error':
      return 'pdp-progress-dot--error'
    case 'hidden':
      return null // will be filtered out
    default:
      return ''
  }
}

export default function SectionProgressDots({
  sections = [],
  sectionStates = {},
  expandedSection,
  onDotClick,
}) {
  const handleClick = useCallback((sectionId) => {
    // Scroll the target section into view
    const el = document.getElementById(`section-${sectionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Notify parent so it can expand the section
    if (onDotClick) onDotClick(sectionId)
  }, [onDotClick])

  // Filter out hidden sections
  const visibleSections = sections.filter(
    (sec) => sectionStates[sec.id] !== 'hidden'
  )

  if (visibleSections.length === 0) return null

  return (
    <nav className="pdp-progress-dots" aria-label="Configuration progress">
      {visibleSections.map((sec) => {
        const modifier = getDotModifier(sec.id, sectionStates, expandedSection)

        return (
          <button
            key={sec.id}
            type="button"
            className={`pdp-progress-dot${modifier ? ` ${modifier}` : ''}`}
            onClick={() => handleClick(sec.id)}
            aria-label={`Go to ${sec.title} section`}
            title={sec.title}
          >
            {/* Label shown on hover via CSS */}
            <span className="pdp-progress-dot-label">{sec.title}</span>
          </button>
        )
      })}
    </nav>
  )
}
