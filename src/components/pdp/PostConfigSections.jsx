/**
 * PostConfigSections
 * ------------------
 * Below-the-fold sections shown after the CTA block:
 *   1. Production Timeline (5 steps)
 *   2. "What's Included" grid (4 tiles)
 *   3. Bulk Orders CTA
 *
 * CSS classes consumed (from pdp-review.css):
 *   .pdp-post-section, .pdp-post-title,
 *   .pdp-timeline, .pdp-timeline-step, .pdp-timeline-dot,
 *   .pdp-timeline-label, .pdp-timeline-desc,
 *   .pdp-included-grid, .pdp-included-tile, .pdp-included-tile-label,
 *   .pdp-bulk-cta, .pdp-bulk-text
 */

const timelineSteps = [
  {
    label: 'Order Confirmed',
    description: 'Payment received, production queue assigned',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    label: 'Pre-press',
    description: 'File review, colour profiling, soft proof approval',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    label: 'Print & Bind',
    description: 'High-resolution printing, precision cutting, binding assembly',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
    ),
  },
  {
    label: 'Quality Inspection',
    description: 'Multi-point QC check, colour accuracy verification',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: 'Dispatch',
    description: 'Archival packaging, tracked shipping, delivery notification',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
]

const includedItems = [
  {
    label: 'Dedicated Contact',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Quality Report',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: 'Archival Packaging',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
  {
    label: 'Reprint Guarantee',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
]

export default function PostConfigSections() {
  return (
    <div>
      {/* --- Production Timeline --- */}
      <div className="pdp-post-section">
        <div className="pdp-post-title">Production Timeline</div>
        <div className="pdp-timeline">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="pdp-timeline-step">
              <div className="pdp-timeline-dot">
                {step.icon}
              </div>
              <div className="pdp-timeline-label">{step.label}</div>
              <div className="pdp-timeline-desc">{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- What's Included --- */}
      <div className="pdp-post-section">
        <div className="pdp-post-title">What's Included</div>
        <div className="pdp-included-grid">
          {includedItems.map((item, idx) => (
            <div key={idx} className="pdp-included-tile">
              {item.icon}
              <div className="pdp-included-tile-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Bulk Orders CTA --- */}
      <div className="pdp-post-section">
        <div className="pdp-bulk-cta">
          <div className="pdp-bulk-text">
            <strong>Need multiple copies or bulk orders?</strong>
            We offer volume pricing for studios, event planners, and corporate clients. Get a custom quote with dedicated account support and priority production.
          </div>
          <a
            href="/contact"
            className="btn-outline"
            style={{
              flexShrink: 0,
              padding: '10px 24px',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--petrol-600)',
              color: 'var(--petrol-600)',
              fontWeight: 'var(--weight-semibold)',
              fontSize: 'var(--text-body-sm)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Get Bulk Quote
          </a>
        </div>
      </div>
    </div>
  )
}
