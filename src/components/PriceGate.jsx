/**
 * PriceGate
 *
 * Shows the formatted price when the user is logged in.
 * Shows a tasteful "sign in" prompt when they are not — no price is exposed,
 * no order action is possible.
 *
 * Usage:
 *   <PriceGate price={product.price} />
 *   <PriceGate price={product.price} size="lg" />
 */
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDisplayPrice, formatINR } from '../utils/pricing';
import './PriceGate.css';

function LockIcon() {
  return (
    <svg
      className="price-gate__icon"
      width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export default function PriceGate({ price, size = 'md', className = '' }) {
  const { isLoggedIn, isVerified } = useAuth();
  const location = useLocation();

  if (isLoggedIn) {
    const displayPrice = getDisplayPrice(price, isVerified);
    return (
      <span className={`price-gate price-gate--visible price-gate--${size} ${className}`}>
        {formatINR(displayPrice)}
      </span>
    );
  }

  const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`;

  return (
    <Link
      to={loginUrl}
      className={`price-gate price-gate--locked price-gate--${size} ${className}`}
      title="Sign in to view pricing"
    >
      <LockIcon />
      <span>Sign in to view pricing</span>
    </Link>
  );
}
