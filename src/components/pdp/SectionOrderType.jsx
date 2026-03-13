/**
 * SectionOrderType
 * ----------------
 * Order type selection section for the PDP config flow.
 * Two equal-width toggle ConfigCards: Raw/Unedited vs Edited/Print-Ready.
 * Includes an FAQ toggle that reveals 4 Q&A items about print-readiness.
 *
 * CSS classes consumed (from pdp-sections.css):
 *   .pdp-config-cards, .pdp-faq-toggle, .pdp-faq-drawer,
 *   .pdp-faq-item, .pdp-faq-question, .pdp-faq-answer
 */

import { useState, useCallback } from 'react'
import { usePDPConfig } from '../../context/PDPConfigContext'
import { surcharges } from '../../data/pdpPricing'
import ConfigCard from './ConfigCard'

const faqItems = [
  {
    q: 'What counts as "print-ready" files?',
    a: 'Print-ready files are fully edited images exported at 300 DPI in sRGB colour space, with correct crop margins applied. They should be free of watermarks, have final colour corrections, and meet our minimum resolution requirements for the selected size.',
  },
  {
    q: 'What ICC profiles do you support?',
    a: 'We support sRGB IEC61966-2.1 as the standard colour profile. For fine art papers, Adobe RGB (1998) is also accepted. We do not recommend CMYK submissions as our RIP handles the conversion internally for optimal results.',
  },
  {
    q: 'What happens during the pre-press review?',
    a: 'Our pre-press team reviews your raw files for resolution, colour accuracy, and crop alignment. We make basic adjustments where needed and send you a soft proof for approval before production. This typically adds 2-3 business days to the timeline.',
  },
  {
    q: 'Can I mix raw and edited files in one order?',
    a: 'Yes, select "Raw or Unedited Files" and mention in the production notes which pages are print-ready and which need review. Our team will handle them accordingly. The pre-press review fee still applies for the entire order.',
  },
]

export default function SectionOrderType() {
  const { config, updateConfig } = usePDPConfig()

  const [showFAQ, setShowFAQ] = useState(false)
  const [openFAQ, setOpenFAQ] = useState(null)

  const selected = config.orderType

  const toggleFAQ = useCallback((idx) => {
    setOpenFAQ(prev => prev === idx ? null : idx)
  }, [])

  const prepressPrice = surcharges.prepressReview

  return (
    <div>
      <div className="pdp-config-cards">
        {/* Card A: Raw / Unedited */}
        <ConfigCard
          selected={selected === 'raw'}
          onClick={() => updateConfig('orderType', 'raw')}
          title="Raw or Unedited Files"
          subtitle="Your images need colour correction, cropping, or layout adjustments before printing. Our pre-press team will review and prepare your files."
        >
          <div className="pdp-card-price" style={{ marginTop: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pre-press review — adds &#x20B9;{prepressPrice.toLocaleString('en-IN')}
          </div>
        </ConfigCard>

        {/* Card B: Edited / Print-Ready */}
        <ConfigCard
          selected={selected === 'print-ready'}
          onClick={() => updateConfig('orderType', 'print-ready')}
          title="Edited & Print-Ready"
          subtitle="Your images are fully edited, colour-corrected, and exported at the correct resolution. They go directly into production without additional review."
        >
          <div className="pdp-card-price pdp-card-price--included" style={{ marginTop: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Direct to production — no additional fee
          </div>
        </ConfigCard>
      </div>

      {/* FAQ Toggle */}
      <div style={{ marginTop: 'var(--space-4)' }}>
        <button
          type="button"
          className="pdp-faq-toggle"
          onClick={() => setShowFAQ(prev => !prev)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {showFAQ ? 'Hide FAQ' : 'Print-readiness FAQ'}
        </button>

        {showFAQ && (
          <div className="pdp-faq-drawer">
            {faqItems.map((item, idx) => (
              <div key={idx} className="pdp-faq-item">
                <button
                  type="button"
                  className="pdp-faq-question"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={openFAQ === idx}
                >
                  {item.q}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: openFAQ === idx ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {openFAQ === idx && (
                  <div className="pdp-faq-answer">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
