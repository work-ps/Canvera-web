import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/pages.css'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  if (cartItems.length === 0) {
    return (
      <section className="cart-empty">
        <h1>Your Cart is Empty</h1>
        <p>Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link to="/shop" className="placeholder-link">Browse Products</Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <h1 className="cart-page-title">
        Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-thumb" />
              <div className="cart-item-info">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-status">
                  Config: {item.configStatus === 'complete' ? 'Complete' : 'Incomplete'}
                </p>
                <div className="cart-item-actions">
                  <select
                    className="cart-item-qty"
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, Number(e.target.value))}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-price">
                {item.price > 0 ? `₹${(item.price * item.quantity).toLocaleString()}` : '—'}
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3 className="cart-summary-title">Order Summary</h3>
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <strong>{cartTotal > 0 ? `₹${cartTotal.toLocaleString()}` : '—'}</strong>
          </div>
          <Link to="/checkout" className="cart-summary-cta">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </section>
  )
}
