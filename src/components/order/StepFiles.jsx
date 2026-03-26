import { useCallback } from 'react'
import TooltipIcon from '../pdp/TooltipIcon'

const EVENT_TYPES = ['Wedding', 'Pre-Wedding', 'Birthday', 'Corporate', 'Portrait', 'Other']

export default function StepFiles({ config, onChange }) {
  const set = useCallback((key, val) => onChange(key, val), [onChange])

  return (
    <div className="oc-step">
      {/* Order Type */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Order Type
          <TooltipIcon text="Choose whether you provide print-ready files, raw files, or want our design team to create the layout." />
        </h3>
        <div className="oc-card-row oc-card-row--3">
          <div
            className={`oc-type-card${config.orderType === 'print-ready' ? ' oc-type-card--selected' : ''}`}
            onClick={() => set('orderType', 'print-ready')}
          >
            {config.orderType === 'print-ready' && (
              <span className="oc-type-card-check">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <div className="oc-type-card-icon">
              <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                <rect x="6" y="4" width="20" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 10h10M11 14h10M11 18h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div className="oc-type-card-title">Print Ready</div>
            <div className="oc-type-card-desc">You provide fully designed, print-ready files</div>
          </div>

          <div
            className={`oc-type-card${config.orderType === 'raw-files' ? ' oc-type-card--selected' : ''}`}
            onClick={() => set('orderType', 'raw-files')}
          >
            {config.orderType === 'raw-files' && (
              <span className="oc-type-card-check">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <div className="oc-type-card-icon">
              <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                <path d="M6 8h20v16H6V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M10 16l4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="oc-type-card-title">Raw Files</div>
            <div className="oc-type-card-desc">You provide raw, unedited image files</div>
            <div className="oc-type-card-price-badge">+ &#x20B9;500</div>
          </div>

          <div
            className={`oc-type-card${config.orderType === 'design-service' ? ' oc-type-card--selected' : ''}`}
            onClick={() => set('orderType', 'design-service')}
          >
            {config.orderType === 'design-service' && (
              <span className="oc-type-card-check">
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
            <div className="oc-type-card-icon">
              <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 20l4-8 4 8M13 18h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="oc-type-card-title">Design Service</div>
            <div className="oc-type-card-desc">Our team designs your pages for you</div>
            <div className="oc-type-card-price-badge">+ &#x20B9;4,500</div>
          </div>
        </div>
      </section>

      {/* File Upload / Link */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          File Link
          <TooltipIcon text="Share a cloud link (Google Drive, Dropbox) containing your photos or design files." />
        </h3>

        {/* Drop zone */}
        <div className="oc-dropzone">
          <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
            <path d="M20 6v20M12 18l8-8 8 8" stroke="var(--neutral-400)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 28h28" stroke="var(--neutral-300)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="oc-dropzone-text">Drag & drop files here, or paste a link below</p>
          <p className="oc-dropzone-hint">Google Drive, Dropbox, or WeTransfer links</p>
        </div>

        <div className="oc-or-divider">
          <span>or paste link</span>
        </div>

        <input
          type="url"
          className="input-field"
          placeholder="https://drive.google.com/..."
          value={config.fileLink || ''}
          onChange={e => set('fileLink', e.target.value)}
        />
      </section>

      {/* Number of Sheets */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Number of Sheets
          <TooltipIcon text="Total sheets in your album. Each sheet = 2 printed pages." />
        </h3>
        <div className="oc-sheets-control">
          <button
            className="oc-sheets-btn"
            onClick={() => set('sheets', Math.max(20, (config.sheets || 20) - 2))}
            disabled={(config.sheets || 20) <= 20}
          >
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="oc-sheets-display">
            <span className="oc-sheets-number">{config.sheets || 20}</span>
            <span className="oc-sheets-label">sheets ({(config.sheets || 20) * 2} pages)</span>
          </div>
          <button
            className="oc-sheets-btn"
            onClick={() => set('sheets', Math.min(80, (config.sheets || 20) + 2))}
            disabled={(config.sheets || 20) >= 80}
          >
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <span className="oc-sheets-hint">Min: 20 / Max: 80 sheets</span>
      </section>

      {/* Event Details */}
      <section className="oc-section">
        <h3 className="oc-section-heading">
          Event Details
          <TooltipIcon text="Basic event info helps our team prepare and manage your order." />
        </h3>
        <div className="oc-field-row oc-field-row--3">
          <div className="input-group">
            <label className="input-label">Event Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Raj & Priya's Wedding"
              value={config.eventTitle || ''}
              onChange={e => set('eventTitle', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Event Type</label>
            <select
              className="input-field oc-select"
              value={config.eventType || ''}
              onChange={e => set('eventType', e.target.value)}
            >
              <option value="">Select type...</option>
              {EVENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">Event Date</label>
            <input
              type="date"
              className="input-field"
              value={config.eventDate || ''}
              onChange={e => set('eventDate', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Design Brief */}
      {config.orderType === 'design-service' && (
        <section className="oc-section">
          <h3 className="oc-section-heading">Design Brief</h3>
          <p className="oc-section-desc">Describe your vision, preferred style, colour palette, or any specific instructions for our design team.</p>
          <textarea
            className="input-field oc-textarea"
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
