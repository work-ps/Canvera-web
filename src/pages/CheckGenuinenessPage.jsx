import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages.css'

export default function CheckGenuinenessPage() {
  const [serial, setSerial] = useState('')
  const [result, setResult] = useState(null) // null | 'genuine' | 'not-found' | 'already-verified'
  const [error, setError] = useState('')

  const handleVerify = (e) => {
    e.preventDefault()
    if (!serial.trim()) {
      setError('Please enter a serial number.')
      return
    }
    setError('')

    // Demo logic: codes starting with "CNV" are genuine, "VER" already verified, else not found
    const s = serial.trim().toUpperCase()
    if (s.startsWith('CNV')) {
      setResult('genuine')
    } else if (s.startsWith('VER')) {
      setResult('already-verified')
    } else {
      setResult('not-found')
    }
  }

  const handleReset = () => {
    setSerial('')
    setResult(null)
    setError('')
  }

  return (
    <div className="genuine-page">
      <div className="container">
        <div className="genuine-card">
          <h1 className="display-sm">Verify Your Album</h1>
          <p className="genuine-subtitle">Enter your album's unique code to verify authenticity.</p>

          {!result ? (
            <form className="genuine-form" onSubmit={handleVerify} noValidate>
              <div className="input-group">
                <input
                  className="input-field genuine-input"
                  type="text"
                  placeholder="Enter serial number (e.g. CNV-XXXX-XXXX)"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                />
              </div>
              {error && <p className="genuine-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block">Verify</button>
            </form>
          ) : (
            <div className="genuine-result">
              {result === 'genuine' && (
                <div className="genuine-result-card genuine-result--success">
                  <div className="genuine-result-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="heading-lg">Genuine Canvera Product</h3>
                  <p>This album has been verified as an authentic Canvera product.</p>
                  <div className="genuine-details">
                    <div className="genuine-detail-row">
                      <span>Product</span><span>Luxury Celestial Photobook</span>
                    </div>
                    <div className="genuine-detail-row">
                      <span>Material</span><span>Premium Leather</span>
                    </div>
                    <div className="genuine-detail-row">
                      <span>Manufactured</span><span>February 2026</span>
                    </div>
                  </div>
                </div>
              )}

              {result === 'not-found' && (
                <div className="genuine-result-card genuine-result--error">
                  <div className="genuine-result-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3 className="heading-lg">Not Found</h3>
                  <p>We could not find a product matching this serial number. Please double-check the code and try again.</p>
                  <Link to="/contact" className="link-arrow">
                    Contact Support
                    <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
              )}

              {result === 'already-verified' && (
                <div className="genuine-result-card genuine-result--warning">
                  <div className="genuine-result-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="heading-lg">Previously Verified</h3>
                  <p>This album was already verified on March 10, 2026. If you did not verify it, please contact support.</p>
                  <Link to="/contact" className="link-arrow">
                    Contact Support
                    <svg viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
              )}

              <button className="btn btn-ghost" onClick={handleReset}>Verify Another</button>
            </div>
          )}
        </div>

        {/* Why verify */}
        <div className="genuine-why">
          <h2 className="heading-xl">Why Verify?</h2>
          <div className="genuine-why-grid">
            <div className="genuine-why-item">
              <h3 className="heading-sm">Authenticity Assurance</h3>
              <p>Ensure your album was manufactured using Canvera's premium materials and quality processes.</p>
            </div>
            <div className="genuine-why-item">
              <h3 className="heading-sm">Warranty Protection</h3>
              <p>Only verified genuine products are covered under Canvera's quality warranty programme.</p>
            </div>
            <div className="genuine-why-item">
              <h3 className="heading-sm">Quality Guarantee</h3>
              <p>Every genuine Canvera product has passed our rigorous multi-stage quality inspection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
