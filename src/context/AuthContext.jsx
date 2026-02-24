import { createContext, useContext, useState, useMemo, useCallback } from 'react'

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

  const register = useCallback((name, email, phone, businessProof, idFileName) => {
    const data = { status: 'registered', name, email, phone, businessProof, idFileName, registeredAt: Date.now() }
    saveAuth(data)
    setAuthState(data)
  }, [])

  const logout = useCallback(() => {
    saveAuth(null)
    setAuthState(null)
  }, [])

  const value = useMemo(() => ({
    authState,
    register,
    logout,
    isRegistered: authState !== null,
  }), [authState, register, logout])

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
