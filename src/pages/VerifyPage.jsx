import { useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import './VerifyPage.css';

/* Demo: valid codes for testing */
const VALID_CODES = {
  'CANVERA-2024-WXYZ': {
    product: 'Luxury Celestial Album',
    collection: 'Celestial',
    material: 'Premium Leatherette',
    manufacturingDate: 'January 2024',
    status: 'genuine',
    orderId: 'ORD-2024-18473',
    studio: 'Pixel Studio, Mumbai',
  },
  'CVR-SUEDE-9021': {
    product: 'Mesmera Suede Album',
    collection: 'Suede',
    material: 'Premium Suede',
    manufacturingDate: 'March 2024',
    status: 'genuine',
    orderId: 'ORD-2024-29104',
    studio: 'Honda Photography, Pune',
  },
};

function VerifyResult({ result, code }) {
  const isGenuine = result.status === 'genuine';
  return (
    <div className={`verify-result ${isGenuine ? 'verify-result--genuine' : 'verify-result--fake'}`}>
      <div className="verify-result__icon">
        {isGenuine ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        )}
      </div>
      <div className="verify-result__content">
        <h2 className="verify-result__title">
          {isGenuine ? 'Genuine Canvera Product' : 'Product Not Found'}
        </h2>
        <p className="verify-result__subtitle">
          {isGenuine
            ? 'This product has been verified as authentic.'
            : 'We could not verify this product code. It may be counterfeit or the code may be incorrect.'}
        </p>

        {isGenuine && (
          <div className="verify-result__details">
            <div className="verify-detail">
              <span className="verify-detail__label">Product</span>
              <span className="verify-detail__value">{result.product}</span>
            </div>
            <div className="verify-detail">
              <span className="verify-detail__label">Collection</span>
              <span className="verify-detail__value">{result.collection}</span>
            </div>
            <div className="verify-detail">
              <span className="verify-detail__label">Material</span>
              <span className="verify-detail__value">{result.material}</span>
            </div>
            <div className="verify-detail">
              <span className="verify-detail__label">Manufactured</span>
              <span className="verify-detail__value">{result.manufacturingDate}</span>
            </div>
            <div className="verify-detail">
              <span className="verify-detail__label">Order ID</span>
              <span className="verify-detail__value verify-detail__value--mono">{result.orderId}</span>
            </div>
            <div className="verify-detail">
              <span className="verify-detail__label">Fulfilled by</span>
              <span className="verify-detail__value">{result.studio}</span>
            </div>
          </div>
        )}

        {!isGenuine && (
          <div className="verify-result__warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p>If you believe this is an error, please <Link to="/contact">contact our support team</Link> with your purchase details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [attempted, setAttempted] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    const found = VALID_CODES[code.trim().toUpperCase()];
    setResult(found || { status: 'notfound' });
    setAttempted(true);
  };

  const handleReset = () => {
    setCode('');
    setResult(null);
    setAttempted(false);
  };

  return (
    <div className="verify-page">
      <Breadcrumb />
      <div className="verify-hero">
        <div className="verify-hero__inner">
          <div className="verify-hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Authenticity Verification
          </div>
          <h1 className="verify-hero__title">
            <span className="verify-hero__line1">Verify Your</span>
            <span className="verify-hero__line2">Canvera Product</span>
          </h1>
          <p className="verify-hero__sub">
            Every Canvera album carries a unique verification code. Enter it below
            to confirm your product's authenticity and manufacturing details.
          </p>
        </div>
      </div>

      <div className="verify-content">
        <div className="verify-card">
          {!attempted ? (
            <>
              <div className="verify-card__header">
                <h2 className="verify-card__title">Enter Product Code</h2>
                <p className="verify-card__hint">
                  Find the code on the certificate card inside your album box, or on the back cover label.
                </p>
              </div>

              <form className="verify-form" onSubmit={handleVerify}>
                <div className="verify-form__field">
                  <div className="verify-form__input-wrap">
                    <svg className="verify-form__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      type="text"
                      className="verify-form__input"
                      placeholder="e.g. CANVERA-2024-WXYZ"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="verify-form__submit"
                  disabled={!code.trim()}
                >
                  Verify Product
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </form>

              {import.meta.env.DEV && (
                <div className="verify-demo-hint">
                  <p className="verify-demo-hint__label">Try a demo code:</p>
                  <div className="verify-demo-hint__codes">
                    {Object.keys(VALID_CODES).map((c) => (
                      <button
                        key={c}
                        className="verify-demo-hint__chip"
                        onClick={() => setCode(c)}
                        type="button"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <VerifyResult result={result} code={code} />
              <button className="verify-reset" onClick={handleReset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-3.96"/>
                </svg>
                Verify another product
              </button>
            </>
          )}
        </div>

        {/* How it works */}
        <div className="verify-how">
          <h3 className="verify-how__title">How to find your product code</h3>
          <div className="verify-how__steps">
            <div className="verify-how__step">
              <div className="verify-how__step-num">1</div>
              <div className="verify-how__step-text">
                <strong>Certificate Card</strong>
                <p>Look for the printed certificate card inside the album packaging box.</p>
              </div>
            </div>
            <div className="verify-how__step">
              <div className="verify-how__step-num">2</div>
              <div className="verify-how__step-text">
                <strong>Back Cover Label</strong>
                <p>A QR code sticker on the inside back cover contains your product code.</p>
              </div>
            </div>
            <div className="verify-how__step">
              <div className="verify-how__step-num">3</div>
              <div className="verify-how__step-text">
                <strong>Order Confirmation</strong>
                <p>Your product code is also included in your order confirmation email.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
