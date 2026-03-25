import { useCallback } from 'react'

export default function StepReview({ config, product, onChange, onGoToStep, onSaveToCart, onProceedCheckout }) {
  const editSvg = (
    <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
      <path d="M10.5 1.5l2 2-7.5 7.5H3V9L10.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  const backSvg = (
    <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
      <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
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
          <h4>Files &amp; Event Details</h4>
          <button className="oc-review-edit" onClick={() => onGoToStep(0)}>{editSvg} Edit</button>
        </div>
        {rows([
          ['Event Date', config.eventDate],
          ['Event Type', config.eventType],
          ['Event Title', config.eventTitle],
          ['Pages', config.sheets ? `${config.sheets} sheets` : null],
          ['Order Type', config.orderType === 'design-service' ? 'Design Service' : 'Print-Ready Files'],
          ['File Link', config.fileLink],
        ])}
      </div>

      {/* Paper & Printing */}
      <div className="oc-review-card">
        <div className="oc-review-card-header">
          <h4>Paper &amp; Printing</h4>
          <button className="oc-review-edit" onClick={() => onGoToStep(1)}>{editSvg} Edit</button>
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
          <h4>Cover Configuration</h4>
          <button className="oc-review-edit" onClick={() => onGoToStep(2)}>{editSvg} Edit</button>
        </div>
        {rows([
          ['Size', config.size],
          ['Cover Style', config.coverDesign],
          ['Material', config.coverMaterial],
          ['Color', config.coverColor],
          ['Text', [config.coverName1, config.coverName2].filter(Boolean).join(' / ')],
        ])}
      </div>

      {/* Accessories */}
      <div className="oc-review-card">
        <div className="oc-review-card-header">
          <h4>Accessories</h4>
          <button className="oc-review-edit" onClick={() => onGoToStep(3)}>{editSvg} Edit</button>
        </div>
        {rows([
          ['Presentation Box', config.boxEnabled ? `Yes (${config.boxMaterial || ''} — ${config.boxColor || ''})` : 'No'],
          ['Bag', config.bagType === 'none' ? 'No Bag' : config.bagType === 'Premium' ? 'Premium Bag' : 'Standard Bag'],
        ])}
      </div>

      {/* Special Instructions */}
      <div className="oc-review-card">
        <h4>Special Instructions</h4>
        <textarea
          className="oc-textarea"
          placeholder="Any additional notes or requests..."
          rows={4}
          value={config.specialInstructions || ''}
          onChange={e => onChange('specialInstructions', e.target.value)}
        />
      </div>

      {/* Three-button nav */}
      <div className="oc-review-actions">
        <button className="oc-btn oc-btn--outline" onClick={() => onGoToStep(3)}>
          {backSvg} Back
        </button>
        <button className="oc-btn oc-btn--outline" onClick={onSaveToCart}>
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path d="M1 1h2l2 9h8l2-6H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="13" r="1" fill="currentColor"/><circle cx="12" cy="13" r="1" fill="currentColor"/>
          </svg>
          Save to Cart
        </button>
        <button className="oc-btn oc-btn--primary" onClick={onProceedCheckout}>
          Proceed to Checkout
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
