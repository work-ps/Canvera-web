import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute with two levels:
 *   level="login"    -- any logged-in user (registered or verified)
 *   level="verified" -- only verified photographers (default)
 */
export default function ProtectedRoute({ children, level = 'verified' }) {
  const { isRegistered, isVerified } = useAuth()
  const location = useLocation()
  const redirectTo = `/login?redirect=${encodeURIComponent(location.pathname)}`

  if (level === 'login' && !isRegistered) {
    return <Navigate to={redirectTo} replace />
  }

  if (level === 'verified' && !isVerified) {
    // If registered but not verified, send to profile to complete verification
    if (isRegistered) {
      return <Navigate to="/profile" replace />
    }
    return <Navigate to={redirectTo} replace />
  }

  return children
}
