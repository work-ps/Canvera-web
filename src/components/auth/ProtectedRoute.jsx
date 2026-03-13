import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isVerified } = useAuth()

  if (!isVerified) {
    return <Navigate to="/login" replace />
  }

  return children
}
