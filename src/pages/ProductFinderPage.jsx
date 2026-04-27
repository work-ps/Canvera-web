import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import { getDisplayPrice, formatINR } from '../utils/pricing';
import Breadcrumb from '../components/Breadcrumb';
import './ProductFinderPage.css';

const OCCASIONS = [
  { id: 'Weddings', label: 'Wedding', icon: '💍', desc: 'Bridal & wedding photography albums' },
  { id: 'Pre-Wedding', label: 'Pre-Wedding', icon: '🌸', desc: 'Engagement & pre-wedding shoots' },
  { id: 'Portraits & Family', label: 'Portrait / Family', icon: '👨‍👩‍👧', desc: 'Family portraits & lifestyle shoots' },
  { id: 'Corporate', label: 'Corporate', icon: '🏢', desc: 'Brand, event & corporate photography' },
  { id: 'Newborn', label: 'Newborn / Baby', icon: '👶', desc: 'Newborn and milestone photography' },
  { id: 'Travel', label: 'Travel', icon: '✈️', desc: 'Travel and landscape photography' },
];

const BUDGETS = [
  { id: 'budget', label: 'Up to ₹5,000', max: 5000, icon: '💰' },
  { id: 'mid', label: '₹5,000 – ₹8,000', min: 5000, max: 8000, icon: '💳' },
  { id: 'premium', label: '₹8,000 – ₹12,000', min: 8000, max: 12000, icon: '✨' },
  { id: 'luxury', label: '₹12,000+', min: 12000, icon: '👑' },
];

const STYLES = [
  { id: 'classic', label: 'Classic & Timeless', desc: 'Clean layouts, understated elegance' },
  { id: 'modern', label: 'Modern & Editorial', desc: 'Bold design, magazine-style spreads' },
  { id: 'rustic', label: 'Rustic & Natural', desc: 'Earthy tones, organic textures' },
  { id: 'luxury', label: 'Luxury & Opulent', desc: 'Premium materials, statement pieces' },
];

// Simple style → product matching hint
const STYLE_COLLECTIONS = {
  classic: ['Leatherette', 'Celestial'],
  modern: ['Suede', 'Folio'],
  rustic: ['Wood', 'Canvas'],
  luxury: ['Celestial', 'Wood', 'Suede'],
};

function filterProducts({ occasion, budget, style }) {
  let result = [...products];

  if (occasion) {
    const hasOccasion = result.filter(p => p.occasions && p.occasions.includes(occasion));
    if (hasOccasion.length > 0) result = hasOccasion;
  }

  if (budget) {
    const b = BUDGETS.find(b => b.id === budget);
    if (b) {
      const inBudget = result.filter(p => {
        const min = b.min || 0;
        const max = b.max || Infinity;
        return p.price >= min && p.price <= max;
      });
      if (inBudget.length > 0) result = inBudget;
    }
  }

  if (style) {
    const collections = STYLE_COLLECTIONS[style] || [];
    const byCollection = result.filter(p => collections.includes(p.collection));
    if (byCollection.length > 0) result = byCollection;
  }

  return result.slice(0, 6);
}

const STEPS = ['Occasion', 'Budget', 'Style', 'Results'];

export default function ProductFinderPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isVerified } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ occasion: null, budget: null, style: null });

  const handleOccasion = (id) => { setAnswers(p => ({ ...p, occasion: id })); setStep(1); };
  const handleBudget = (id) => { setAnswers(p => ({ ...p, budget: id })); setStep(2); };
  const handleStyle = (id) => { setAnswers(p => ({ ...p, style: id })); setStep(3); };
  const restart = () => { setStep(0); setAnswers({ occasion: null, budget: null, style: null }); };

  const results = step === 3 ? filterProducts(answers) : [];

  return (
    <div className="finder">
      <Breadcrumb />
      <div className="finder__inner">
        {/* Hero */}
        <div className="finder__hero">
          <p className="finder__eyebrow">Product Finder</p>
          <h1 className="finder__title">Find Your Perfect Album</h1>
          <p className="finder__sub">Answer 3 quick questions and we'll match you with the ideal Canvera product.</p>
        </div>

        {/* Progress */}
        <div className="finder__progress">
          {STEPS.map((label, i) => (
            <div key={label} className={`finder__progress-step ${i < step ? 'finder__progress-step--done' : ''} ${i === step ? 'finder__progress-step--active' : ''}`}>
              <div className="finder__progress-circle">
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              {i < STEPS.length - 1 && <div className={`finder__progress-line ${i < step ? 'finder__progress-line--done' : ''}`} />}
              <p className="finder__progress-label">{label}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="finder__card">
          {/* Step 0: Occasion */}
          {step === 0 && (
            <div className="finder__step">
              <h2 className="finder__step-title">What occasion are you shooting for?</h2>
              <p className="finder__step-sub">We'll recommend albums that work best for your niche.</p>
              <div className="finder__occasion-grid">
                {OCCASIONS.map(occ => (
                  <button key={occ.id} className="finder__option-card" onClick={() => handleOccasion(occ.id)}>
                    <span className="finder__option-icon">{occ.icon}</span>
                    <span className="finder__option-label">{occ.label}</span>
                    <span className="finder__option-desc">{occ.desc}</span>
                  </button>
                ))}
              </div>
              <button className="finder__skip" onClick={() => handleOccasion(null)}>Skip this question →</button>
            </div>
          )}

          {/* Step 1: Budget */}
          {step === 1 && (
            <div className="finder__step">
              <h2 className="finder__step-title">What is your budget per album?</h2>
              <p className="finder__step-sub">Base price — final price depends on your configuration.</p>
              <div className="finder__budget-grid">
                {BUDGETS.map(b => (
                  <button key={b.id} className="finder__budget-card" onClick={() => handleBudget(b.id)}>
                    <span className="finder__budget-icon">{b.icon}</span>
                    <span className="finder__budget-label">{b.label}</span>
                  </button>
                ))}
              </div>
              <div className="finder__step-nav">
                <button className="finder__back-btn" onClick={() => setStep(0)}>← Back</button>
                <button className="finder__skip" onClick={() => handleBudget(null)}>Skip →</button>
              </div>
            </div>
          )}

          {/* Step 2: Style */}
          {step === 2 && (
            <div className="finder__step">
              <h2 className="finder__step-title">What style best describes your work?</h2>
              <p className="finder__step-sub">This helps us match you with the right cover materials and collections.</p>
              <div className="finder__style-grid">
                {STYLES.map(s => (
                  <button key={s.id} className="finder__style-card" onClick={() => handleStyle(s.id)}>
                    <span className="finder__style-label">{s.label}</span>
                    <span className="finder__style-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
              <div className="finder__step-nav">
                <button className="finder__back-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="finder__skip" onClick={() => handleStyle(null)}>Skip →</button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <div className="finder__step">
              <div className="finder__results-header">
                <div>
                  <h2 className="finder__step-title" style={{ marginBottom: 4 }}>We found {results.length} match{results.length !== 1 ? 'es' : ''} for you</h2>
                  <p className="finder__step-sub" style={{ marginBottom: 0 }}>
                    Based on: {[answers.occasion, BUDGETS.find(b => b.id === answers.budget)?.label, STYLES.find(s => s.id === answers.style)?.label].filter(Boolean).join(' · ') || 'all products'}
                  </p>
                </div>
                <button className="finder__restart-btn" onClick={restart}>Start Over</button>
              </div>

              {results.length === 0 ? (
                <div className="finder__no-results">
                  <p>No exact matches found. Showing all products instead.</p>
                  <Link to="/shop" className="finder__cta-btn">Browse All Products</Link>
                </div>
              ) : (
                <div className="finder__results-grid">
                  {results.map(product => (
                    <div key={product.id} className="finder__result-card">
                      <div className="finder__result-thumb">
                        <img src={product.image || '/images/products/luxury-celestial.jpg'} alt={product.name} />
                        {product.badge && (
                          <span className={`finder__result-badge finder__result-badge--${product.badge}`}>
                            {product.badge === 'bestseller' ? 'Bestseller' : product.badge === 'new' ? 'New' : 'Popular'}
                          </span>
                        )}
                      </div>
                      <div className="finder__result-info">
                        <p className="finder__result-collection">{product.collection}</p>
                        <h3 className="finder__result-name">{product.name}</h3>
                        <p className="finder__result-desc">{product.description}</p>
                        <div className="finder__result-footer">
                          {isLoggedIn
                            ? <span className="finder__result-price">from {formatINR(getDisplayPrice(product.price, isVerified))}</span>
                            : <span className="finder__result-price finder__result-price--locked">Login to see price</span>
                          }
                          <div className="finder__result-actions">
                            <Link to={`/products/${product.slug}`} className="finder__result-btn finder__result-btn--secondary">View</Link>
                            <Link to={isLoggedIn ? `/order/${product.slug}` : `/login?redirect=/order/${product.slug}`} className="finder__result-btn finder__result-btn--primary">Order</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="finder__results-footer">
                <p>Not seeing what you want?</p>
                <Link to="/shop" className="finder__all-link">Browse all products →</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
