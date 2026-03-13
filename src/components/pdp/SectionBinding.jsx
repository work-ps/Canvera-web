import { useState } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import { bindingDescriptions } from '../../data/pdpOptions'
import { surcharges } from '../../data/pdpPricing'
import ConfigCard from './ConfigCard'

function formatINR(amount) {
  if (amount == null) return ''
  return amount.toLocaleString('en-IN')
}

/**
 * SectionBinding
 * --------------
 * Renders stacked ConfigCards for each binding type available on the product.
 * Includes a helper block that opens a comparison drawer.
 */
export default function SectionBinding() {
  const { product, config, updateConfig } = usePDPConfig()
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (!product || !product.bindings || product.bindings.length === 0) return null

  const bindings = product.bindings

  return (
    <div>
      <div className="pdp-config-cards pdp-config-cards--stack">
        {bindings.map(name => {
          const info = bindingDescriptions[name] || {}
          const cost = surcharges.bindings[name] ?? 0

          return (
            <ConfigCard
              key={name}
              selected={config.binding === name}
              title={name}
              subtitle={info.description}
              specs={info.specs}
              price={cost > 0 ? cost : null}
              priceType={cost > 0 ? 'addon' : 'included'}
              onClick={() => updateConfig('binding', name)}
            />
          )
        })}
      </div>

      {/* Helper block */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <button
          className="pdp-faq-toggle"
          type="button"
          onClick={() => setDrawerOpen(prev => !prev)}
          aria-expanded={drawerOpen}
        >
          Not sure which binding?
          <span style={{ marginLeft: 4 }}>{drawerOpen ? '\u2191' : '\u2192'}</span>
          {' '}See comparison
        </button>
      </div>

      {/* Comparison Drawer */}
      {drawerOpen && (
        <div
          className="pdp-drawer-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) setDrawerOpen(false)
          }}
        >
          <div className="pdp-drawer" role="dialog" aria-label="Binding comparison">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-display-xs)', fontWeight: 'var(--weight-bold)' }}>
                Binding Comparison
              </h3>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--neutral-500)', padding: 4 }}
                aria-label="Close comparison"
              >
                &times;
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-body-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--neutral-200)' }}>
                  <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--neutral-600)' }}>Binding</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--neutral-600)' }}>Opening</th>
                  <th style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', color: 'var(--neutral-600)' }}>Best For</th>
                  <th style={{ textAlign: 'right', padding: 'var(--space-2) var(--space-3)', color: 'var(--neutral-600)' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {bindings.map(name => {
                  const info = bindingDescriptions[name] || {}
                  const cost = surcharges.bindings[name] ?? 0
                  const opening = name.includes('Layflat')
                    ? '180\u00B0 flat'
                    : name === 'Continuous'
                      ? 'Seamless flow'
                      : name === 'Splicing'
                        ? 'Traditional spine'
                        : name === 'Spiral'
                          ? '360\u00B0 flip'
                          : '\u2014'
                  const bestFor = info.specs
                    ? info.specs.find(s => s.toLowerCase().includes('recommended'))
                    : '\u2014'

                  return (
                    <tr key={name} style={{ borderBottom: '1px solid var(--neutral-100)' }}>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 'var(--weight-semibold)', color: 'var(--neutral-900)' }}>
                        {name}
                      </td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--neutral-600)' }}>
                        {opening}
                      </td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--neutral-600)' }}>
                        {bestFor || '\u2014'}
                      </td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', textAlign: 'right', fontWeight: 'var(--weight-medium)' }}>
                        {cost > 0 ? `+ \u20B9${formatINR(cost)}` : 'Included'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
