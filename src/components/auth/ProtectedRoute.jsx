import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute with two levels:
 *   level="login"    — any logged-in user (registered or verified)
 *   level="verified" — only verified photographers (default, backwards-compat)
 */
export default function ProtectedRoute({ children, level = 'verified' }) {
  const { isRegistered, isVerified } = useAuth()
  const location = useLocation()

  if (level === 'login' && !isRegistered) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (level === 'verified' && !isVerified) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  return children
}
