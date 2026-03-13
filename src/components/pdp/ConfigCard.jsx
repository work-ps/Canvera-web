/**
 * ConfigCard
 * ----------
 * A reusable selection card used across configuration sections (size, binding,
 * paper, cover material, etc.). Supports selected/disabled states, badge, specs
 * list, and three price display modes.
 *
 * Props:
 *   @param {boolean}  selected    - Whether this card is the active selection.
 *   @param {boolean}  disabled    - Grey-out card and prevent interaction.
 *   @param {function} onClick     - Click handler.
 *   @param {string}   title       - Primary label (e.g. "12 x 18"").
 *   @param {string}   subtitle    - Secondary description text.
 *   @param {number}   price       - Numeric price value (optional).
 *   @param {string}   priceType   - One of 'included' | 'addon' | 'from'.
 *   @param {string}   badge       - Optional badge text (e.g. "Popular").
 *   @param {string[]} specs       - Optional array of specification strings.
 *   @param {ReactNode} children   - Optional custom content below specs/price.
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-config-card, .pdp-config-card--selected, .pdp-config-card--disabled,
 *   .pdp-card-badge, .pdp-card-title, .pdp-card-desc, .pdp-card-specs,
 *   .pdp-card-spec, .pdp-card-price, .pdp-card-price--included,
 *   .pdp-card-price--from
 */

import { useCallback } from 'react'

/**
 * Formats a number as a comma-separated Indian-style currency string.
 * e.g. 12500 -> "12,500"
 */
function formatPrice(amount) {
  if (amount == null) return ''
  return amount.toLocaleString('en-IN')
}

export default function ConfigCard({
  selected = false,
  disabled = false,
  onClick,
  title,
  subtitle,
  price,
  priceType,
  badge,
  specs,
  children,
}) {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick()
  }, [disabled, onClick])

  const handleKeyDown = useCallback((e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && onClick) {
      e.preventDefault()
      onClick()
    }
  }, [disabled, onClick])

  /* ---- Build CSS class list ---- */
  const classNames = [
    'pdp-config-card',
    selected && 'pdp-config-card--selected',
    disabled && 'pdp-config-card--disabled',
  ].filter(Boolean).join(' ')

  /* ---- Render price label ---- */
  const renderPrice = () => {
    if (price == null && !priceType) return null

    switch (priceType) {
      case 'included':
        return (
          <div className="pdp-card-price pdp-card-price--included">
            Included
          </div>
        )
      case 'addon':
        return (
          <div className="pdp-card-price">
            + &#x20B9;{formatPrice(price)}
          </div>
        )
      case 'from':
        return (
          <div className="pdp-card-price pdp-card-price--from">
            From &#x20B9;{formatPrice(price)}
          </div>
        )
      default:
        if (price != null) {
          return (
            <div className="pdp-card-price">
              &#x20B9;{formatPrice(price)}
            </div>
          )
        }
        return null
    }
  }

  return (
    <div
      className={classNames}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled}
    >
      {/* Badge (top-right pill) */}
      {badge && <span className="pdp-card-badge">{badge}</span>}

      {/* Title */}
      {title && <div className="pdp-card-title">{title}</div>}

      {/* Subtitle / description */}
      {subtitle && <div className="pdp-card-desc">{subtitle}</div>}

      {/* Spec bullets */}
      {specs && specs.length > 0 && (
        <div className="pdp-card-specs">
          {specs.map((spec, i) => (
            <span key={i} className="pdp-card-spec">{spec}</span>
          ))}
        </div>
      )}

      {/* Price line */}
      {renderPrice()}

      {/* Passthrough children for any custom content */}
      {children}
    </div>
  )
}
