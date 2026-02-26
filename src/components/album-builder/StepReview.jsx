import { useCallback } from 'react'
import { Link } from 'react-router-dom'

const downloadSvg = (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M8 2v9M4.5 7.5L8 11l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const shareSvg = (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M2 10v3a1 1 0 001 1h10a1 1 0 001-1v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 2v8M4.5 5.5L8 2l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function StepReview({ product, specs, personalize, accessories }) {
  if (!product) return null

  const handleDownloadSummary = useCallback(() => {
    const lines = [
      `CANVERA — Album Configuration Summary`,
      `${'='.repeat(44)}`,
      ``,
      `Product: ${product.name}`,
      `Category: ${product.category}`,
      ``,
      `--- Specifications ---`,
      specs.size ? `Size: ${specs.size}` : null,
      specs.orientation ? `Orientation: ${specs.orientation}` : null,
      specs.binding ? `Binding: ${specs.binding}` : null,
      specs.printType ? `Print Type: ${specs.printType}` : null,
      ``,
      `--- Personalization ---`,
      personalize.color ? `Colour: ${personalize.color}` : null,
      personalize.designStyle ? `Cover Design: Design ${String(personalize.designStyle).padStart(2, '0')}` : null,
      personalize.customizations?.length > 0 ? `Customizations: ${personalize.customizations.join(', ')}` : null,
      ``,
      `--- Accessories ---`,
      accessories.boxType && accessories.boxType !== 'none' ? `Box: ${accessories.boxType.replace(/-/g, ' ')}` : 'Box: None',
      accessories.bagType && accessories.bagType !== 'none' ? `Bag: ${accessories.bagType.replace(/-/g, ' ')}` : 'Bag: None',
      ``,
      `${'='.repeat(44)}`,
      `Generated on canvera.com`,
    ].filter(Boolean).join('\n')

    const w = window.open('', '_blank', 'width=600,height=700')
    w.document.write(`<!DOCTYPE html><html><head><title>Album Summary — ${product.name}</title>
      <style>body{font-family:'Inter',system-ui,sans-serif;padding:48px;color:#003A54;line-height:1.7;max-width:520px;margin:0 auto}
      h1{font-size:22px;margin-bottom:8px}h2{font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#7A8490;margin-top:28px;margin-bottom:8px;border-bottom:1px solid #ECEEF0;padding-bottom:6px}
      .row{display:flex;justify-content:space-between;padding:4px 0;font-size:14px}.row .k{color:#7A8490}.row .v{font-weight:500}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #ECEEF0;font-size:12px;color:#9AA3AD;text-align:center}
      @media print{body{padding:24px}}</style></head><body>`)
    w.document.write(`<h1>${product.name}</h1><p style="color:#7A8490;font-size:14px">${product.category}</p>`)

    w.document.write(`<h2>Specifications</h2>`)
    if (specs.size) w.document.write(`<div class="row"><span class="k">Size</span><span class="v">${specs.size}</span></div>`)
    if (specs.orientation) w.document.write(`<div class="row"><span class="k">Orientation</span><span class="v">${specs.orientation}</span></div>`)
    if (specs.binding) w.document.write(`<div class="row"><span class="k">Binding</span><span class="v">${specs.binding}</span></div>`)
    if (specs.printType) w.document.write(`<div class="row"><span class="k">Print Type</span><span class="v">${specs.printType}</span></div>`)

    w.document.write(`<h2>Personalization</h2>`)
    if (personalize.color) w.document.write(`<div class="row"><span class="k">Colour</span><span class="v">${personalize.color}</span></div>`)
    if (personalize.designStyle) w.document.write(`<div class="row"><span class="k">Cover Design</span><span class="v">Design ${String(personalize.designStyle).padStart(2, '0')}</span></div>`)
    if (personalize.customizations?.length > 0) w.document.write(`<div class="row"><span class="k">Customizations</span><span class="v">${personalize.customizations.join(', ')}</span></div>`)

    w.document.write(`<h2>Accessories</h2>`)
    const boxLabel = accessories.boxType && accessories.boxType !== 'none' ? accessories.boxType.split('-').map(w2 => w2[0].toUpperCase() + w2.slice(1)).join(' ') : 'None'
    const bagLabel = accessories.bagType && accessories.bagType !== 'none' ? accessories.bagType.split('-').map(w2 => w2[0].toUpperCase() + w2.slice(1)).join(' ') : 'None'
    w.document.write(`<div class="row"><span class="k">Box</span><span class="v">${boxLabel}</span></div>`)
    w.document.write(`<div class="row"><span class="k">Bag</span><span class="v">${bagLabel}</span></div>`)

    w.document.write(`<div class="footer">Canvera — India's Premier Photobook Platform<br/>canvera.com</div>`)
    w.document.write(`</body></html>`)
    w.document.close()
    setTimeout(() => w.print(), 300)
  }, [product, specs, personalize, accessories])

  const formatLabel = (str) => {
    if (!str || str === 'none') return '—'
    return str.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  }

  return (
    <div>
      <h2 className="ab-step-title">Review Your Album</h2>
      <p className="ab-step-subtitle">Here's a summary of your {product.name} configuration</p>

      <div className="ab-review-layout">
        {/* Left: Summary */}
        <div className="ab-review-summary">
          <div className="ab-review-product-name">{product.name}</div>

          <div className="ab-review-section">
            <div className="ab-review-section-title">Specifications</div>
            {specs.size && (
              <div className="ab-review-row">
                <span className="ab-review-key">Size</span>
                <span className="ab-review-value">{specs.size}</span>
              </div>
            )}
            {specs.orientation && (
              <div className="ab-review-row">
                <span className="ab-review-key">Orientation</span>
                <span className="ab-review-value">{specs.orientation}</span>
              </div>
            )}
            {specs.binding && (
              <div className="ab-review-row">
                <span className="ab-review-key">Binding</span>
                <span className="ab-review-value">{specs.binding}</span>
              </div>
            )}
            {specs.printType && (
              <div className="ab-review-row">
                <span className="ab-review-key">Print Type</span>
                <span className="ab-review-value">{specs.printType}</span>
              </div>
            )}
            <div className="ab-review-row">
              <span className="ab-review-key">Material</span>
              <span className="ab-review-value">{product.material}</span>
            </div>
          </div>

          <div className="ab-review-section">
            <div className="ab-review-section-title">Personalization</div>
            {personalize.color && (
              <div className="ab-review-row">
                <span className="ab-review-key">Colour</span>
                <span className="ab-review-value">{personalize.color}</span>
              </div>
            )}
            {personalize.designStyle && (
              <div className="ab-review-row">
                <span className="ab-review-key">Cover Design</span>
                <span className="ab-review-value">Design {String(personalize.designStyle).padStart(2, '0')}</span>
              </div>
            )}
            {personalize.customizations?.length > 0 && (
              <div style={{ paddingTop: 4 }}>
                <span className="ab-review-key" style={{ display: 'block', marginBottom: 6 }}>Customizations</span>
                <div className="ab-review-tags">
                  {personalize.customizations.map(c => (
                    <span key={c} className="ab-review-tag">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {!personalize.color && !personalize.designStyle && (!personalize.customizations || personalize.customizations.length === 0) && (
              <div className="ab-review-row">
                <span className="ab-review-key">Standard configuration</span>
                <span className="ab-review-value">—</span>
              </div>
            )}
          </div>

          <div className="ab-review-section">
            <div className="ab-review-section-title">Accessories</div>
            <div className="ab-review-row">
              <span className="ab-review-key">Box</span>
              <span className="ab-review-value">{formatLabel(accessories.boxType)}</span>
            </div>
            <div className="ab-review-row">
              <span className="ab-review-key">Bag</span>
              <span className="ab-review-value">{formatLabel(accessories.bagType)}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="ab-review-actions">
          <div className="ab-review-card">
            <h3>Your album is ready</h3>
            <p>Download a summary of your album configuration to share with your client, or sign in to place your order directly.</p>
            <button className="ab-review-cta ab-review-cta-primary" onClick={handleDownloadSummary}>
              {downloadSvg}
              Download Summary (PDF)
            </button>
            <button className="ab-review-cta ab-review-cta-secondary" onClick={handleDownloadSummary}>
              {shareSvg}
              Share via Email
            </button>
          </div>

          <div className="ab-review-login-note">
            <p>Sign in to place your order and access exclusive member pricing.</p>
            <Link to="/login" className="ab-review-login-link">Sign in to Order &rarr;</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
