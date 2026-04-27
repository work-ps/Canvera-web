import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';
import './CartPage.css';

const VALID_COUPONS = {
  CANVERA10: { discount: 0.10, label: 'CANVERA10 — 10% off' },
};

function formatPrice(n) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function CartPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Auth guard
  if (!isLoggedIn) return <Navigate to="/login?redirect=/cart" replace />;

  const discount = appliedCoupon ? Math.round(subtotal * VALID_COUPONS[appliedCoupon].discount) : 0;
  const discountedSubtotal = subtotal - discount;
  const tax = Math.round(discountedSubtotal * 0.18);
  const total = discountedSubtotal + tax;

  const hasIncomplete = items.some(i => !i.isComplete);

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Please try again.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCoupon('');
    setCouponError('');
  };

  const BADGE = { bestseller: 'Bestseller', new: 'New', popular: 'Popular', limited: 'Limited' };

  return (
    <div className="cart-page">
      <Breadcrumb />
      <div className="cart-page__inner">

        {/* Header */}
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shopping Cart</h1>
          {items.length > 0 && (
            <button className="cart-page__clear" onClick={clearCart}>
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="cart-empty">
            <div className="cart-empty__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h2 className="cart-empty__title">Your cart is empty</h2>
            <p className="cart-empty__sub">Explore our collections and find the perfect album for your next project.</p>
            <Link to="/shop" className="cart-empty__cta">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-layout">

            {/* Items */}
            <div className="cart-items">
              {/* Incomplete warning */}
              {hasIncomplete && (
                <div className="cart-warning">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Some items need configuration before checkout.
                </div>
              )}

              {items.map(item => (
                <div key={item.id} className="cart-item">
                  {/* Thumbnail */}
                  <div className="cart-item__thumb">
                    <img src={item.image || '/images/products/luxury-celestial.jpg'} alt={item.productName} />
                  </div>

                  {/* Info */}
                  <div className="cart-item__info">
                    <p className="cart-item__collection">{item.collectionName}</p>
                    <p className="cart-item__name">{item.productName}</p>

                    {/* Config summary */}
                    {item.configuration && (
                      <div className="cart-item__config">
                        {item.configuration.size && <span>{item.configuration.size}</span>}
                        {item.configuration.orientation && <span>{item.configuration.orientation}</span>}
                        {item.configuration.binding && <span>{item.configuration.binding}</span>}
                        {item.configuration.cover && <span>{item.configuration.cover}</span>}
                        {item.configuration.paper && <span>{item.configuration.paper}</span>}
                      </div>
                    )}

                    {/* Status badge */}
                    {item.isComplete ? (
                      <span className="cart-item__status cart-item__status--complete">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Configured
                      </span>
                    ) : (
                      <div className="cart-item__incomplete">
                        <span className="cart-item__status cart-item__status--incomplete">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Incomplete
                        </span>
                        <Link
                          to={`/order/${item.productSlug || item.productId}?resume=${item.id}`}
                          className="cart-item__configure-link"
                        >
                          Resume configuration →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Price + quantity */}
                  <div className="cart-item__controls">
                    <p className="cart-item__price">{formatPrice(item.price * item.quantity)}</p>
                    <p className="cart-item__unit-price">{formatPrice(item.price)} each</p>
                    <div className="cart-item__qty">
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <span className="cart-item__qty-val">{item.quantity}</span>
                      <button
                        className="cart-item__qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >+</button>
                    </div>
                    <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary sidebar */}
            <div className="cart-summary">
              <h2 className="cart-summary__title">Order Summary</h2>

              <div className="cart-summary__lines">
                <div className="cart-summary__line">
                  <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-summary__line cart-summary__line--discount">
                    <span>{VALID_COUPONS[appliedCoupon].label}</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="cart-summary__line">
                  <span>GST (18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="cart-summary__line cart-summary__line--total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="cart-summary__coupon">
                {appliedCoupon ? (
                  <div className="cart-summary__coupon-applied">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {VALID_COUPONS[appliedCoupon].label} applied
                    </span>
                    <button onClick={handleRemoveCoupon} className="cart-summary__coupon-remove">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="cart-summary__coupon-row">
                      <input
                        className="cart-summary__coupon-input"
                        placeholder="Coupon code"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      />
                      <button className="cart-summary__coupon-btn" onClick={handleApplyCoupon}>Apply</button>
                    </div>
                    {couponError && <p className="cart-summary__coupon-error">{couponError}</p>}
                  </>
                )}
              </div>

              {/* CTA */}
              <button
                className="cart-summary__checkout"
                disabled={hasIncomplete}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              {hasIncomplete && (
                <p className="cart-summary__checkout-note">Complete all item configurations to proceed.</p>
              )}

              <Link to="/shop" className="cart-summary__continue">← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
