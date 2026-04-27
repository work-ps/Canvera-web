import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import './CustomBuilderPage.css';

const CATEGORIES = [
  {
    id: 'Photobooks',
    label: 'Photobooks',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    desc: 'Premium lay-flat albums, leatherette, suede, wood and more',
    count: null,
  },
  {
    id: 'Frames',
    label: 'Photo Frames',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="10" height="10"/></svg>,
    desc: 'Tabletop and wall frames in wood, metal and acrylic',
    count: null,
  },
  {
    id: 'Prints',
    label: 'Fine Art Prints',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    desc: 'Archival-quality prints on matte, fine-art and metallic paper',
    count: null,
  },
  {
    id: 'Calendars',
    label: 'Photo Calendars',
    icon: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    desc: 'Desk and wall calendars with personalised photography',
    count: null,
  },
];

const STEPS = ['Category', 'Product', 'Customise'];

export default function CustomBuilderPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categoryProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : [];

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat !== 'Photobooks') {
      // Only photobooks have real products; for others show a coming-soon notice
      setStep(1);
    } else {
      setStep(1);
    }
  };

  const handleProduct = (product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleStartOrder = () => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=/order/${selectedProduct.slug}`);
      return;
    }
    navigate(`/order/${selectedProduct.slug}`);
  };

  return (
    <div className="builder">
      <div className="builder__inner">
        {/* Header */}
        <div className="builder__hero">
          <p className="builder__eyebrow">Custom Builder</p>
          <h1 className="builder__title">Build Your Custom Product</h1>
          <p className="builder__sub">Choose your product type, select a model, then configure every detail to perfection.</p>
        </div>

        {/* Progress */}
        <div className="builder__progress">
          {STEPS.map((label, i) => (
            <div key={label} className={`builder__progress-step ${i < step ? 'builder__progress-step--done' : ''} ${i === step ? 'builder__progress-step--active' : ''}`}>
              <button
                className="builder__progress-circle"
                disabled={i >= step}
                onClick={() => { if (i < step) setStep(i); }}
              >
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>
              {i < STEPS.length - 1 && <div className={`builder__progress-line ${i < step ? 'builder__progress-line--done' : ''}`} />}
              <p className="builder__progress-label">{label}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="builder__card">

          {/* Step 0: Choose category */}
          {step === 0 && (
            <div className="builder__step">
              <h2 className="builder__step-title">What would you like to create?</h2>
              <p className="builder__step-sub">Select the product type you want to customise.</p>
              <div className="builder__category-grid">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    className="builder__category-card"
                    onClick={() => handleCategory(cat.id)}
                    title={cat.id !== 'Photobooks' ? 'Coming Soon' : undefined}
                    style={cat.id !== 'Photobooks' ? { opacity: 0.6 } : undefined}
                  >
                    <span className="builder__category-icon">{cat.icon}</span>
                    <span className="builder__category-label">{cat.label}</span>
                    <span className="builder__category-desc">{cat.desc}</span>
                    {cat.id !== 'Photobooks' && (
                      <span className="builder__coming-soon" style={{ marginTop: '4px', fontSize: '10px', fontWeight: 600, background: 'var(--warning-light)', color: 'var(--warning-text)', padding: '2px 8px', borderRadius: '999px' }}>Soon</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Choose product */}
          {step === 1 && (
            <div className="builder__step">
              <div className="builder__step-header">
                <button className="builder__back-btn" onClick={() => setStep(0)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                  Back
                </button>
                <div>
                  <h2 className="builder__step-title">Choose your {selectedCategory} model</h2>
                  <p className="builder__step-sub">Select a base product to start configuring.</p>
                </div>
              </div>

              {categoryProducts.length === 0 ? (
                <div className="builder__coming-soon-block">
                  <span className="builder__coming-soon-icon">🚧</span>
                  <h3>Coming Soon</h3>
                  <p>This product category is launching soon. In the meantime, explore our photobook range.</p>
                  <button className="builder__cta-btn" onClick={() => { setSelectedCategory('Photobooks'); }}>Browse Photobooks</button>
                </div>
              ) : (
                <div className="builder__product-grid">
                  {categoryProducts.map(product => (
                    <button
                      key={product.id}
                      className="builder__product-card"
                      onClick={() => handleProduct(product)}
                    >
                      <div className="builder__product-thumb">
                        <img src={product.image || '/images/products/luxury-celestial.jpg'} alt={product.name} />
                        {product.badge && (
                          <span className={`builder__product-badge builder__product-badge--${product.badge}`}>
                            {product.badge === 'bestseller' ? 'Bestseller' : product.badge === 'new' ? 'New' : product.badge === 'popular' ? 'Popular' : product.badge}
                          </span>
                        )}
                      </div>
                      <div className="builder__product-info">
                        <span className="builder__product-collection">{product.collection}</span>
                        <span className="builder__product-name">{product.name}</span>
                        <span className="builder__product-price">from ₹{product.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="builder__product-select">
                        Select <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Preview + start order */}
          {step === 2 && selectedProduct && (
            <div className="builder__step">
              <div className="builder__step-header">
                <button className="builder__back-btn" onClick={() => setStep(1)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                  Back
                </button>
                <div>
                  <h2 className="builder__step-title">Ready to configure</h2>
                  <p className="builder__step-sub">You've selected your base product. Click below to start the full configuration wizard.</p>
                </div>
              </div>

              <div className="builder__preview">
                <div className="builder__preview-thumb">
                  <img src={selectedProduct.image || '/images/products/luxury-celestial.jpg'} alt={selectedProduct.name} />
                </div>
                <div className="builder__preview-info">
                  <p className="builder__preview-collection">{selectedProduct.collection} Collection</p>
                  <h3 className="builder__preview-name">{selectedProduct.name}</h3>
                  <p className="builder__preview-desc">{selectedProduct.description}</p>

                  <div className="builder__preview-specs">
                    <div className="builder__preview-spec">
                      <span className="builder__preview-spec-key">Material</span>
                      <span className="builder__preview-spec-val">{selectedProduct.material}</span>
                    </div>
                    <div className="builder__preview-spec">
                      <span className="builder__preview-spec-key">Specs</span>
                      <span className="builder__preview-spec-val">{selectedProduct.specs}</span>
                    </div>
                    <div className="builder__preview-spec">
                      <span className="builder__preview-spec-key">Starting at</span>
                      <span className="builder__preview-spec-val builder__preview-price">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="builder__preview-wizard-note">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    The full order wizard lets you customise size, cover, paper, files and accessories with live pricing.
                  </div>

                  <div className="builder__preview-actions">
                    <button className="builder__cta-btn builder__cta-btn--primary" onClick={handleStartOrder}>
                      Start Customising
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                    <Link to={`/products/${selectedProduct.slug}`} className="builder__cta-btn builder__cta-btn--secondary">View Full Details</Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature strip */}
        {step === 0 && (
          <div className="builder__features">
            {[
              { icon: '🎨', title: 'Fully Customisable', desc: 'Every detail from cover to paper is yours to choose.' },
              { icon: '💰', title: 'Live Pricing', desc: 'See your total update in real time as you configure.' },
              { icon: '📦', title: 'Save & Return', desc: 'Save your configuration to cart and order when ready.' },
              { icon: '⚡', title: '10-Day Delivery', desc: 'Fast turnaround from order confirmation to your door.' },
            ].map(f => (
              <div key={f.title} className="builder__feature">
                <span className="builder__feature-icon">{f.icon}</span>
                <h4 className="builder__feature-title">{f.title}</h4>
                <p className="builder__feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
