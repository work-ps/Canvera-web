import { useCallback } from 'react'
import TooltipIcon from '../pdp/TooltipIcon'

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Portrait', 'Other']

export default function StepFiles({ config, onChange }) {
  const set = useCallback((key, val) => onChange(key, val), [onChange])

  return (
    <div className="oc-step">
      {/* Event Details */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Event Details
          <TooltipIcon text="Basic event info helps our team prepare and manage your order." />
        </h3>
        <div className="oc-field-row oc-field-row--3">
          <div className="oc-field">
            <label className="oc-label">Event Date</label>
            <input
              type="date"
              className="oc-input"
              value={config.eventDate || ''}
              onChange={e => set('eventDate', e.target.value)}
            />
          </div>
          <div className="oc-field">
            <label className="oc-label">Event Type</label>
            <select
              className="oc-input oc-select"
              value={config.eventType || ''}
              onChange={e => set('eventType', e.target.value)}
            >
              <option value="">Select type...</option>
              {EVENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="oc-field">
            <label className="oc-label">Event Title</label>
            <input
              type="text"
              className="oc-input"
              placeholder="e.g., Raj & Priya's Wedding"
              value={config.eventTitle || ''}
              onChange={e => set('eventTitle', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* File Link */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          File Link
          <TooltipIcon text="Share a cloud link (Google Drive, Dropbox) containing your photos or design files." />
        </h3>
        <p className="oc-section-desc">Provide a Google Drive or Dropbox link to your files.</p>
        <input
          type="url"
          className="oc-input"
          placeholder="https://drive.google.com/..."
          value={config.fileLink || ''}
          onChange={e => set('fileLink', e.target.value)}
        />
      </section>

      {/* Number of Pages */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Number of Pages
          <TooltipIcon text="Total sheets in your album. Each sheet = 2 printed pages." />
        </h3>
        <div className="oc-pages-input-wrap">
          <input
            type="number"
            className="oc-input oc-pages-input"
            min={20}
            max={80}
            value={config.sheets || 20}
            onChange={e => {
              const v = Math.max(20, Math.min(80, parseInt(e.target.value) || 20))
              set('sheets', v)
            }}
          />
          <span className="oc-pages-hint">Min: 20 / Max: 80 sheets</span>
        </div>
      </section>

      {/* Order Type */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Order Type
          <TooltipIcon text="Choose whether you provide print-ready files or want our design team to create the layout." />
        </h3>
        <div className="oc-card-row oc-card-row--2">
          <div
            className={`oc-type-card${config.orderType === 'print-ready' ? ' oc-type-card--selected' : ''}`}
            onClick={() => set('orderType', 'print-ready')}
          >
            <div className="oc-type-card-icon">
              <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 10h10M11 14h10M11 18h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="oc-type-card-title">Print-Ready Files</div>
            <div className="oc-type-card-desc">You provide fully designed, print-ready files</div>
          </div>
          <div
            className={`oc-type-card${config.orderType === 'design-service' ? ' oc-type-card--selected' : ''}`}
            onClick={() => set('orderType', 'design-service')}
          >
            <div className="oc-type-card-icon">
              <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 20l4-8 4 8M13 18h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="oc-type-card-title">Design Service</div>
            <div className="oc-type-card-desc">Our team designs your pages for you</div>
            <div className="oc-type-card-price">+ &#x20B9;4,500</div>
          </div>
        </div>
      </section>

      {/* Design Brief — shown when Design Service selected */}
      {config.orderType === 'design-service' && (
        <section className="oc-section">
          <h3 className="oc-section-heading">Design Brief</h3>
          <p className="oc-section-desc">Describe your vision, preferred style, colour palette, or any specific instructions for our design team.</p>
          <textarea
            className="oc-textarea"
            rows={4}
            placeholder="e.g., Modern minimalist style, warm tones, candid-focused layout with full-bleed spreads..."
            value={config.designBrief || ''}
            onChange={e => set('designBrief', e.target.value)}
          />
        </section>
      )}

    </div>
  )
}
