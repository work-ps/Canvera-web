import { useMemo } from 'react'
import { calculatePrice } from '../../data/pdpPricing'

function formatPrice(n) { return n?.toLocaleString('en-IN') || '0' }

export default function StepReview({ config, product, onChange, onGoToStep, onSaveToCart, onProceedCheckout }) {
  const pricing = useMemo(() => calculatePrice(config, product.id), [config, product.id])

  const editBtn = (stepIdx) => (
    <button className="oc-review-edit" onClick={() => onGoToStep(stepIdx)}>
      <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
        <path d="M10.5 1.5l2 2-7.5 7.5H3V9L10.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Edit
    </button>
  )

  const rows = (items) => items.filter(([, v]) => v).map(([label, value]) => (
    <div key={label} className="oc-review-row">
      <span className="oc-review-row-label">{label}</span>
      <span className="oc-review-row-value">{value}</span>
    </div>
  ))

  return (
    <div className="oc-step">
      {/* Files */}
      <div className="oc-review-card">
        <div className="oc-review-card-header">
          <h4 className="heading-sm">Files &amp; Event Details</h4>
          {editBtn(0)}
        </div>
        {rows([
          ['Event Date', config.eventDate],
          ['Event Type', config.eventType],
          ['Event Title', config.eventTitle],
          ['Pages', config.sheets ? `${config.sheets} sheets` : null],
          ['Order Type', config.orderType === 'design-service' ? 'Design Service' : config.orderType === 'raw-files' ? 'Raw Files' : 'Print-Ready Files'],
          ['File Link', config.fileLink],
        ])}
      </div>

      {/* Paper & Printing */}
      <div className="oc-review-card">
        <div className="oc-review-card-header">
          <h4 className="heading-sm">Paper &amp; Printing</h4>
          {editBtn(1)}
        </div>
        {rows([
          ['Lamination', config.lamination],
          ['Paper Type', config.paper],
          ['Color Printing', config.colorPrinting],
          ['Special Papers', config.specialPaperEnabled ? `${(config.specialPaperEntries || []).length} type(s)` : 'None'],
        ])}
      </div>

      {/* Cover */}
      <div className="oc-review-card">
        <div className="oc-review-card-header">
          <h4 className="heading-sm">Cover Configuration</h4>
          {editBtn(2)}
        </div>
        {rows([
          ['Size', config.size],
          ['Cover Style', config.coverDesign],
          ['Material', config.coverMaterial],
          ['Color', config.coverColor],
          ['Naming Treatment', config.namingTreatment],
          ['Text', [config.coverName1, config.coverName2].filter(Boolean).join(' / ')],
        ])}
      </div>

      {/* Accessories */}
      <div className="oc-review-card">
        <div className="oc-review-card-header">
          <h4 className="heading-sm">Accessories</h4>
          {editBtn(3)}
        </div>
        {rows([
          ['Presentation Box', config.boxEnabled ? `Yes (${config.boxMaterial || ''} \u2014 ${config.boxColor || ''})` : 'No'],
          ['Bag', config.bagType === 'none' ? 'No Bag' : config.bagType === 'Premium' ? 'Premium Bag' : 'Standard Bag'],
        ])}
      </div>

      {/* Special Instructions */}
      <div className="oc-review-card">
        <h4 className="heading-sm">Special Instructions</h4>
        <textarea
          className="input-field oc-textarea"
          placeholder="Any additional notes or requests..."
          rows={4}
          value={config.specialInstructions || ''}
          onChange={e => onChange('specialInstructions', e.target.value)}
        />
      </div>

      {/* Price Breakdown */}
      <div className="oc-review-card">
        <h4 className="heading-sm">Price Breakdown</h4>
        <div className="oc-review-price-lines">
          {pricing.lineItems.map(item => (
            <div key={item.key} className="oc-review-price-row">
              <span>{item.label}</span>
              <span>{item.type === 'base' ? '' : '+ '}&#x20B9;{formatPrice(item.amount)}</span>
            </div>
          ))}
          <div className="oc-review-price-total">
            <span>Total</span>
            <span>&#x20B9;{formatPrice(pricing.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions — only Back + Add to Cart */}
      <div className="oc-review-actions">
        <button className="btn btn-secondary" onClick={() => onGoToStep(3)}>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <button className="btn btn-primary" onClick={onSaveToCart}>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path d="M1 1h2l2 9h8l2-6H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="13" r="1" fill="currentColor" /><circle cx="12" cy="13" r="1" fill="currentColor" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
