/**
 * AuthContext — three-tier auth state for Canvera
 *
 * States (per IA doc):
 *   Anonymous  — not logged in; prices hidden, public pages only
 *   Registered — logged in, status='registered'; prices visible, cart/checkout
 *   Verified   — logged in, status='verified'; full access incl. Order Config
 *
 * Backward-compat: `isLoggedIn` = isRegistered (any logged-in state)
 */
import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

function loadUser() {
  try { return JSON.parse(localStorage.getItem('canvera_user')) || null; }
  catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);

  // Derived states
  const isLoggedIn      = !!user;
  const isRegistered    = !!user;
  const isVerified      = user?.status === 'verified';
  const isPhotographer  = user?.isPhotographer ?? false;

  const login = useCallback((userData) => {
    localStorage.setItem('canvera_auth', 'true');
    localStorage.setItem('canvera_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('canvera_auth');
    localStorage.removeItem('canvera_user');
    setUser(null);
  }, []);

  // For demo: toggle verified state on existing logged-in user
  const setVerified = useCallback(() => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, status: 'verified' };
      localStorage.setItem('canvera_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isRegistered, isVerified, isPhotographer, login, logout, setVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
