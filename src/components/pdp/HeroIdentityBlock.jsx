/**
 * HeroIdentityBlock
 * -----------------
 * Top-of-page hero block for the PDP. Displays the product badge, name,
 * subtitle, feature highlights (pills), starting price, and a "view details" link.
 *
 * CSS classes consumed (from pdp-review.css):
 *   .pdp-hero, .pdp-hero-badge, .pdp-hero-name, .pdp-hero-subtitle,
 *   .pdp-hero-highlights, .pdp-hero-pill, .pdp-hero-price,
 *   .pdp-hero-details-link
 */

import { usePDPConfig } from '../../context/PDPConfigContext'

/**
 * Extracts the first sentence from a text string.
 */
function firstSentence(text) {
  if (!text) return ''
  const match = text.match(/^[^.!?]+[.!?]/)
  return match ? match[0] : text
}

export default function HeroIdentityBlock() {
  const { product, setExpandedSection } = usePDPConfig()

  if (!product) return null

  const badge = product.tag || 'Professional Edition'
  const name = product.name
  const subtitle = firstSentence(product.description)
  const highlights = (product.features || []).slice(0, 4)
  /* Price removed — shown only on product cards and ordering flow */

  const handleDetailsClick = () => {
    // Scroll to details tabs or first config section
    const el = document.getElementById('pdp-details-tabs')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="pdp-hero">
      {/* Badge */}
      <span className="pdp-hero-badge">{badge}</span>

      {/* Product name */}
      <h1 className="pdp-hero-name">{name}</h1>

      {/* Subtitle */}
      <p className="pdp-hero-subtitle">{subtitle}</p>

      {/* Key highlights */}
      {highlights.length > 0 && (
        <div className="pdp-hero-highlights">
          {highlights.map((feature, idx) => (
            <span key={idx} className="pdp-hero-pill">{feature}</span>
          ))}
        </div>
      )}

      {/* Price removed — shown on product cards and ordering flow only */}

      {/* View full product details link */}
      <button
        type="button"
        className="pdp-hero-details-link"
        onClick={handleDetailsClick}
      >
        View full product details
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </button>
    </div>
  )
}
