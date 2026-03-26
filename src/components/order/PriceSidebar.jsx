import { useMemo } from 'react'
import { calculatePrice } from '../../data/pdpPricing'

function formatPrice(amount) {
  if (amount == null) return '0'
  return amount.toLocaleString('en-IN')
}

export default function PriceSidebar({ config, productId, productName, thumbnail, onSaveDraft }) {
  const pricing = useMemo(
    () => calculatePrice(config, productId),
    [config, productId]
  )

  return (
    <div className="oc-price-sidebar">
      {/* Product identity */}
      {(productName || thumbnail) && (
        <div className="oc-price-product">
          {thumbnail && (
            <img className="oc-price-thumb" src={thumbnail} alt={productName || 'Product'} />
          )}
          {productName && (
            <span className="oc-price-product-name">{productName}</span>
          )}
        </div>
      )}

      {/* Running total */}
      <div className="oc-price-running-total">
        <span className="oc-price-running-label">Estimated Total</span>
        <span className="oc-price-running-amount">&#x20B9;{formatPrice(pricing.total)}</span>
      </div>

      <div className="oc-price-divider" />

      {/* Line items */}
      <div className="oc-price-lines">
        {pricing.lineItems.map(item => (
          <div key={item.key} className={`oc-price-line${item.type === 'base' ? ' oc-price-line--base' : ''}`}>
            <span className="oc-price-line-label">{item.label}</span>
            <span className="oc-price-line-amount">
              {item.type === 'base' ? '' : '+ '}&#x20B9;{formatPrice(item.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="oc-price-divider" />

      {/* Total */}
      <div className="oc-price-total">
        <span>Estimated Total</span>
        <span className="oc-price-total-amount">&#x20B9;{formatPrice(pricing.total)}</span>
      </div>

      <div className="oc-price-pro-badge">
        <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
          <circle cx="7" cy="7" r="6" fill="var(--brand-teal)" />
          <path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        PRO pricing applied
      </div>

      {/* Save as Draft link */}
      {onSaveDraft && (
        <>
          <div className="oc-price-divider" />
          <button className="oc-price-save-draft" onClick={onSaveDraft}>
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M13 5L6.125 11.5 3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Save as Draft
          </button>
        </>
      )}
    </div>
  )
}
