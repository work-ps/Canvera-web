/**
 * ProtectedRoute — guards routes based on auth level.
 *
 * level="login"    → requires isRegistered  → else redirect /login?redirect=...
 * level="verified" → requires isVerified    → else redirect /profile
 */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, level = 'login' }) {
  const { isRegistered, isVerified } = useAuth();
  const location = useLocation();

  if (level === 'login' && !isRegistered) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (level === 'verified' && !isVerified) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
