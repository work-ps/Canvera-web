/**
 * ProductDetailsTabs
 * ------------------
 * Horizontal tab bar with tabs: Overview, Materials, Sizes, Binding, Print, Customisation.
 * Each tab renders relevant product information from the product data object.
 *
 * CSS classes consumed (from pdp-review.css):
 *   .pdp-tabs, .pdp-tabs-bar, .pdp-tab-btn, .pdp-tab-btn--active,
 *   .pdp-tab-content
 */

import { useState, useCallback } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import { sizeLabels, bindingDescriptions } from '../../data/pdpOptions'

const TAB_IDS = ['overview', 'materials', 'sizes', 'binding', 'print', 'customisation']
const TAB_LABELS = {
  overview: 'Overview',
  materials: 'Materials',
  sizes: 'Sizes',
  binding: 'Binding',
  print: 'Print',
  customisation: 'Customisation',
}

export default function ProductDetailsTabs() {
  const { product } = usePDPConfig()
  const [activeTab, setActiveTab] = useState('overview')

  const handleTab = useCallback((tabId) => {
    setActiveTab(tabId)
  }, [])

  if (!product) return null

  return (
    <div className="pdp-tabs" id="pdp-details-tabs">
      {/* Tab bar */}
      <div className="pdp-tabs-bar" role="tablist">
        {TAB_IDS.map((tabId) => (
          <button
            key={tabId}
            type="button"
            role="tab"
            className={`pdp-tab-btn${activeTab === tabId ? ' pdp-tab-btn--active' : ''}`}
            aria-selected={activeTab === tabId}
            onClick={() => handleTab(tabId)}
          >
            {TAB_LABELS[tabId]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pdp-tab-content" role="tabpanel">
        {activeTab === 'overview' && <OverviewTab product={product} />}
        {activeTab === 'materials' && <MaterialsTab product={product} />}
        {activeTab === 'sizes' && <SizesTab product={product} />}
        {activeTab === 'binding' && <BindingTab product={product} />}
        {activeTab === 'print' && <PrintTab product={product} />}
        {activeTab === 'customisation' && <CustomisationTab product={product} />}
      </div>
    </div>
  )
}

/* ---- Individual Tab Content Components ---- */

function OverviewTab({ product }) {
  return (
    <div>
      <p style={{ marginBottom: 16 }}>{product.description}</p>
      {product.features && product.features.length > 0 && (
        <>
          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-semibold)',
            fontSize: 'var(--text-body-lg)',
            marginBottom: 8,
            color: 'var(--neutral-900)',
          }}>
            Key Features
          </h4>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {product.features.map((feature, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{feature}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function MaterialsTab({ product }) {
  return (
    <div>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-body-lg)',
        marginBottom: 8,
        color: 'var(--neutral-900)',
      }}>
        Material
      </h4>
      <p>{product.material || 'Standard material finish'}</p>

      {product.colorOptions && product.colorOptions.length > 0 && (
        <>
          <h4 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--weight-semibold)',
            fontSize: 'var(--text-body-lg)',
            marginTop: 16,
            marginBottom: 8,
            color: 'var(--neutral-900)',
          }}>
            Available Colours
          </h4>
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            {product.colorOptions.map((color, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{color}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function SizesTab({ product }) {
  const sizes = product.sizes || []
  return (
    <div>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-body-lg)',
        marginBottom: 12,
        color: 'var(--neutral-900)',
      }}>
        Available Sizes
      </h4>
      {sizes.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--neutral-200)' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-body-sm)', color: 'var(--neutral-600)' }}>Size</th>
              <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-body-sm)', color: 'var(--neutral-600)' }}>Format</th>
              <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-body-sm)', color: 'var(--neutral-600)' }}>Print Area</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((sizeKey) => {
              const info = sizeLabels[sizeKey]
              return (
                <tr key={sizeKey} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                  <td style={{ padding: '8px 0', fontWeight: 'var(--weight-medium)' }}>{info?.label || sizeKey}</td>
                  <td style={{ padding: '8px 0', color: 'var(--neutral-600)' }}>{info?.format || '\u2014'}</td>
                  <td style={{ padding: '8px 0', color: 'var(--neutral-600)' }}>{info?.printArea || '\u2014'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      ) : (
        <p>Size information not available for this product.</p>
      )}
    </div>
  )
}

function BindingTab({ product }) {
  const bindings = product.bindings || []
  return (
    <div>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-body-lg)',
        marginBottom: 12,
        color: 'var(--neutral-900)',
      }}>
        Available Bindings
      </h4>
      {bindings.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bindings.map((bindingName) => {
            const info = bindingDescriptions[bindingName]
            return (
              <div key={bindingName} style={{ paddingBottom: 12, borderBottom: '1px solid var(--neutral-100)' }}>
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--neutral-900)', marginBottom: 4 }}>
                  {bindingName}
                </div>
                <div style={{ color: 'var(--neutral-600)', fontSize: 'var(--text-body-sm)' }}>
                  {info?.description || 'No description available.'}
                </div>
                {info?.specs && (
                  <ul style={{ paddingLeft: 20, margin: '8px 0 0', fontSize: 'var(--text-body-sm)', color: 'var(--neutral-600)' }}>
                    {info.specs.map((spec, idx) => (
                      <li key={idx} style={{ marginBottom: 2 }}>{spec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p>Binding information not available for this product.</p>
      )}
    </div>
  )
}

function PrintTab({ product }) {
  const printTypes = product.printTypes || []
  return (
    <div>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-body-lg)',
        marginBottom: 12,
        color: 'var(--neutral-900)',
      }}>
        Print Technology
      </h4>
      {printTypes.length > 0 ? (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {printTypes.map((pt, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>{pt}</li>
          ))}
        </ul>
      ) : (
        <p>Print technology details not available for this product.</p>
      )}
    </div>
  )
}

function CustomisationTab({ product }) {
  const customizations = product.customization || []
  return (
    <div>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-semibold)',
        fontSize: 'var(--text-body-lg)',
        marginBottom: 12,
        color: 'var(--neutral-900)',
      }}>
        Customisation Options
      </h4>
      {customizations.length > 0 ? (
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {customizations.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>Customisation options not available for this product.</p>
      )}
    </div>
  )
}
