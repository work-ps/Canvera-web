import { useMemo } from 'react'
import { calculatePrice } from '../../data/pdpPricing'

function formatPrice(amount) {
  if (amount == null) return '0'
  return amount.toLocaleString('en-IN')
}

export default function PriceSidebar({ config, productId }) {
  const pricing = useMemo(
    () => calculatePrice(config, productId),
    [config, productId]
  )

  return (
    <div className="oc-price-sidebar">
      <h3 className="oc-price-heading">Price Breakdown</h3>

      <div className="oc-price-lines">
        {pricing.lineItems.map(item => (
          <div key={item.key} className="oc-price-line">
            <span className="oc-price-line-label">{item.label}</span>
            <span className="oc-price-line-amount">
              {item.type === 'base' ? '' : '+ '}&#x20B9;{formatPrice(item.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="oc-price-divider" />

      <div className="oc-price-total">
        <span>Total</span>
        <span className="oc-price-total-amount">&#x20B9;{formatPrice(pricing.total)}</span>
      </div>

      <div className="oc-price-pro-badge">
        <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
          <circle cx="7" cy="7" r="6" fill="var(--leaf-500)" />
          <path d="M4.5 7l2 2 3.5-3.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        PRO pricing applied
      </div>
    </div>
  )
}
