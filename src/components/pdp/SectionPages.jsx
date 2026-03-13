import { useState, useCallback } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import { pageTiers } from '../../data/pdpOptions'
import { surcharges } from '../../data/pdpPricing'
import ConfigCard from './ConfigCard'

function formatINR(amount) {
  if (amount == null) return ''
  return amount.toLocaleString('en-IN')
}

/**
 * SectionPages
 * ------------
 * Shows preset sheet-tier ConfigCards plus a Custom option with a stepper.
 * Displays an amber info bar explaining sheets vs. pages.
 */
export default function SectionPages() {
  const { config, updateConfig } = usePDPConfig()
  const [customMode, setCustomMode] = useState(config.customSheets || false)

  const baseSheets = surcharges.baseSheets
  const perSheet = surcharges.sheetsPerUnit

  /** Calculate surcharge for a given sheet count */
  const sheetCost = useCallback(
    (sheets) => {
      if (sheets <= baseSheets) return 0
      return (sheets - baseSheets) * perSheet
    },
    [baseSheets, perSheet]
  )

  /** Handle preset tier selection */
  const selectTier = useCallback(
    (sheets) => {
      setCustomMode(false)
      updateConfig('sheets', sheets)
      updateConfig('customSheets', false)
    },
    [updateConfig]
  )

  /** Switch to custom mode */
  const enableCustom = useCallback(() => {
    setCustomMode(true)
    updateConfig('customSheets', true)
    // Keep the current sheets value, or default to base
    if (!config.sheets || config.sheets < baseSheets) {
      updateConfig('sheets', baseSheets)
    }
  }, [updateConfig, config.sheets, baseSheets])

  /** Stepper change */
  const stepSheets = useCallback(
    (delta) => {
      const next = Math.min(100, Math.max(baseSheets, (config.sheets || baseSheets) + delta))
      updateConfig('sheets', next)
    },
    [updateConfig, config.sheets, baseSheets]
  )

  const isPresetSelected = (sheets) =>
    !customMode && config.sheets === sheets && !config.customSheets

  const currentSheets = config.sheets || baseSheets
  const extraSheets = Math.max(0, currentSheets - baseSheets)
  const extraCost = extraSheets * perSheet

  return (
    <div>
      {/* Info bar: sheets vs pages */}
      <div className="pdp-info-bar pdp-info-bar--amber">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 1L1 14h14L8 1z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M8 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="12" r="0.75" fill="currentColor" />
        </svg>
        <span>
          <strong>Sheets vs. Pages:</strong> Each sheet has 2 printable sides (pages).
          10 sheets = 20 pages. The base price includes 10 sheets (20 pages).
        </span>
      </div>

      {/* Preset tiers */}
      <div className="pdp-config-cards pdp-config-cards--stack">
        {pageTiers.map(tier => {
          const cost = sheetCost(tier.sheets)

          return (
            <ConfigCard
              key={tier.sheets}
              selected={isPresetSelected(tier.sheets)}
              title={tier.label}
              subtitle={`${tier.pages} pages across ${tier.sheets} sheets`}
              price={cost > 0 ? cost : null}
              priceType={tier.isBase ? 'included' : 'addon'}
              onClick={() => selectTier(tier.sheets)}
            />
          )
        })}

        {/* Custom option */}
        <ConfigCard
          selected={customMode}
          title="Custom"
          subtitle="Choose an exact sheet count between 10 and 100"
          price={null}
          priceType={undefined}
          onClick={enableCustom}
        />
      </div>

      {/* Stepper (visible when custom mode active) */}
      {customMode && (
        <div>
          <div className="pdp-stepper">
            <button
              type="button"
              className="pdp-stepper-btn"
              disabled={currentSheets <= baseSheets}
              onClick={() => stepSheets(-1)}
              aria-label="Decrease sheets"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <span className="pdp-stepper-value">{currentSheets}</span>

            <button
              type="button"
              className="pdp-stepper-btn"
              disabled={currentSheets >= 100}
              onClick={() => stepSheets(1)}
              aria-label="Increase sheets"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M8 3v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--neutral-600)', marginLeft: 'var(--space-2)' }}>
              sheets ({currentSheets * 2} pages)
            </span>
          </div>

          <div className="pdp-stepper-calc">
            {extraSheets > 0 ? (
              <>
                {extraSheets} extra sheet{extraSheets !== 1 ? 's' : ''} &times; {'\u20B9'}{perSheet}/sheet ={' '}
                <strong>+ {'\u20B9'}{formatINR(extraCost)}</strong>
              </>
            ) : (
              'Included in base price (10 sheets / 20 pages)'
            )}
          </div>
        </div>
      )}
    </div>
  )
}
