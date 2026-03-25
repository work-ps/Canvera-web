import { createContext, useContext, useState, useMemo, useCallback } from 'react'
import dummyUsers from '../data/dummyUsers'

const AuthContext = createContext(null)

const STORAGE_KEY = 'canvera_auth'

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveAuth(data) {
  if (data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => loadAuth())

  const register = useCallback((name, email, phone, { password, isPhotographer, studioName } = {}) => {
    const data = {
      status: 'registered',
      name,
      email,
      phone,
      isPhotographer: !!isPhotographer,
      studioName: studioName || '',
      registeredAt: Date.now(),
    }
    saveAuth(data)
    setAuthState(data)
  }, [])

  const login = useCallback((identity, password) => {
    const user = dummyUsers.find(
      u => (u.email === identity || u.phone === identity) && u.password === password
    )
    if (!user) return { success: false, error: 'Invalid email/phone or password' }

    const { password: _, ...profile } = user
    saveAuth(profile)
    setAuthState(profile)
    return { success: true, user: profile }
  }, [])

  const logout = useCallback(() => {
    saveAuth(null)
    setAuthState(null)
  }, [])

  const isVerified = authState?.status === 'verified'

  const value = useMemo(() => ({
    authState,
    register,
    login,
    logout,
    isRegistered: authState !== null,
    isVerified,
  }), [authState, register, login, logout, isVerified])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
