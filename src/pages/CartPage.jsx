import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { getProductThumbnail } from '../data/productImages'
import '../styles/pages.css'

function formatPrice(n) { return n?.toLocaleString('en-IN') || '0' }

/* ── Shared cart item renderer ── */
function CartItemRow({ item, onRemove, onUpdateQty, children }) {
  const thumb = getProductThumbnail(item.slug)
  const configParts = [
    item.config?.size,
    item.config?.orientation,
    item.config?.binding,
    item.config?.coverMaterial,
    item.config?.sheets ? `${item.config.sheets} sheets` : null,
  ].filter(Boolean)
  const configSummary = configParts.length > 0 ? configParts.join(' \u00B7 ') : null

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {thumb ? (
          <img src={thumb} alt={item.name} />
        ) : (
          <div className="cart-item-image-placeholder">
            <svg viewBox="0 0 40 50" fill="none" width="40" height="50">
              <rect x="2" y="2" width="36" height="46" rx="4" stroke="var(--neutral-300)" strokeWidth="1.2" />
              <path d="M10 20h20M10 26h14" stroke="var(--neutral-200)" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="cart-item-details">
        <div className="cart-item-top">
          <div>
            <h3 className="heading-sm">{item.name}</h3>
            {item.config?.tag && (
              <span className="cart-item-collection">{item.config.tag}</span>
            )}
          </div>
          {item.configStatus === 'complete' && item.price > 0 && (
            <div className="cart-item-price heading-md">
              &#x20B9;{formatPrice(item.price * item.quantity)}
            </div>
          )}
        </div>

        {configSummary && (
          <p className="cart-item-config">{configSummary}</p>
        )}

        {/* Section-specific CTAs */}
        {children}

        <div className="cart-item-bottom">
          {item.configStatus === 'complete' && onUpdateQty && (
            <div className="cart-qty">
              <button
                className="cart-qty-btn"
                onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <span className="cart-qty-value">{item.quantity}</span>
              <button
                className="cart-qty-btn"
                onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                disabled={item.quantity >= 10}
                aria-label="Increase quantity"
              >
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                  <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          <button
            className="cart-item-remove"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Progress indicator for draft items ── */
function ConfigProgress({ config }) {
  const fields = [
    config?.lamination,
    config?.paper,
    config?.coverDesign,
    config?.coverMaterial,
    config?.coverColor,
    config?.coverName1,
  ]
  const filled = fields.filter(Boolean).length
  const pct = Math.round((filled / fields.length) * 100)

  return (
    <div className="cart-progress">
      <div className="cart-progress-bar">
        <div className="cart-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="cart-progress-label">{pct}% configured</span>
    </div>
  )
}

/* ── Section Header ── */
function SectionHeader({ title, count, badge }) {
  return (
    <div className="cart-section-header">
      <h2 className="heading-md">{title}</h2>
      <span className={`cart-section-badge ${badge || ''}`}>{count}</span>
    </div>
  )
}

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    completeItems,
    draftItems,
    newItems,
  } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-wrap">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
              <rect x="12" y="8" width="56" height="64" rx="6" stroke="var(--neutral-300)" strokeWidth="1.5" />
              <rect x="20" y="16" width="40" height="48" rx="3" stroke="var(--neutral-300)" strokeWidth="1" />
              <path d="M30 36h20M30 42h14" stroke="var(--neutral-200)" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="display-sm">Your cart is empty</h1>
          <p className="cart-empty-text">Explore our collection and find your perfect album</p>
          <Link to="/shop" className="btn btn-primary">
            Browse Products
            <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  const shippingFree = cartTotal >= 5000
  const hasComplete = completeItems.length > 0
  const incompleteCount = draftItems.length + newItems.length

  return (
    <div className="cart-page-wrap">
      <div className="cart-container">
        <div className="cart-items-col">
          <h1 className="cart-title display-sm">
            Your Cart
            <span className="cart-count-badge">{cartCount}</span>
          </h1>

          {/* ── Section 1: Ready to Order (complete) ── */}
          {completeItems.length > 0 && (
            <div className="cart-section">
              <SectionHeader title="Ready to Order" count={completeItems.length} badge="cart-badge-complete" />
              <div className="cart-items-list">
                {completeItems.map((item, idx) => (
                  <div key={item.id}>
                    <CartItemRow item={item} onRemove={removeFromCart} onUpdateQty={updateQuantity}>
                      <Link to={`/order/${item.slug}`} className="cart-item-edit-link">
                        Edit Configuration
                        <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </CartItemRow>
                    {idx < completeItems.length - 1 && <div className="cart-item-divider" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Section 2: Continue Configuration (draft) ── */}
          {draftItems.length > 0 && (
            <div className="cart-section">
              <SectionHeader title="Continue Configuration" count={draftItems.length} badge="cart-badge-draft" />
              <div className="cart-items-list">
                {draftItems.map((item, idx) => (
                  <div key={item.id}>
                    <CartItemRow item={item} onRemove={removeFromCart}>
                      <ConfigProgress config={item.config} />
                      <Link
                        to={`/order/${item.slug}`}
                        state={{ cartItemId: item.id, config: item.config }}
                        className="btn btn-secondary btn-sm cart-item-cta"
                      >
                        Continue
                        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </CartItemRow>
                    {idx < draftItems.length - 1 && <div className="cart-item-divider" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Section 3: Newly Added (new, needs configuration) ── */}
          {newItems.length > 0 && (
            <div className="cart-section">
              <SectionHeader title="Newly Added" count={newItems.length} badge="cart-badge-new" />
              <div className="cart-items-list">
                {newItems.map((item, idx) => (
                  <div key={item.id}>
                    <CartItemRow item={item} onRemove={removeFromCart}>
                      <Link
                        to={`/order/${item.slug}`}
                        state={{ cartItemId: item.id, config: item.config }}
                        className="btn btn-primary btn-sm cart-item-cta"
                      >
                        Start Configuration
                        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </CartItemRow>
                    {idx < newItems.length - 1 && <div className="cart-item-divider" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Order Summary Sidebar ── */}
        <aside className="cart-summary-col">
          <div className="cart-summary-card">
            <h3 className="heading-md">Order Summary</h3>

            <div className="cart-summary-lines">
              <div className="cart-summary-row">
                <span>Subtotal ({completeItems.length} item{completeItems.length !== 1 ? 's' : ''})</span>
                <span>&#x20B9;{formatPrice(cartTotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className={shippingFree ? 'cart-shipping-free' : ''}>
                  {shippingFree ? 'Free' : 'Calculated at checkout'}
                </span>
              </div>
            </div>

            <div className="cart-summary-divider" />

            <div className="cart-summary-total">
              <span>Total</span>
              <span className="cart-summary-total-amount">&#x20B9;{formatPrice(cartTotal)}</span>
            </div>

            {/* Checkout button — only enabled when complete items exist */}
            {hasComplete ? (
              <Link to="/checkout" className="btn btn-primary btn-block cart-checkout-btn">
                Checkout All Complete Items
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : (
              <button className="btn btn-primary btn-block cart-checkout-btn" disabled>
                Proceed to Checkout
              </button>
            )}

            {!hasComplete && (
              <p className="cart-summary-note">
                Complete configuration on your items to enable checkout.
              </p>
            )}

            {incompleteCount > 0 && hasComplete && (
              <p className="cart-summary-note">
                {incompleteCount} item{incompleteCount !== 1 ? 's' : ''} still need{incompleteCount === 1 ? 's' : ''} configuration before checkout.
              </p>
            )}

            <div className="cart-trust-signals">
              <div className="cart-trust-item">
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                  <path d="M8 1L2 4v4c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V4L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="cart-trust-item">
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Quality Guaranteed</span>
              </div>
              <div className="cart-trust-item">
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                  <path d="M2 6h12l-1.5 7H3.5L2 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <path d="M5 6V4a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span>Free Shipping 5K+</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="cart-mobile-bar">
        <div className="cart-mobile-bar-inner">
          <div className="cart-mobile-total">
            <span className="cart-mobile-total-label">Total</span>
            <span className="cart-mobile-total-amount">&#x20B9;{formatPrice(cartTotal)}</span>
          </div>
          {hasComplete ? (
            <Link to="/checkout" className="btn btn-primary cart-mobile-checkout-btn">
              Checkout
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <button className="btn btn-primary cart-mobile-checkout-btn" disabled>
              Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
