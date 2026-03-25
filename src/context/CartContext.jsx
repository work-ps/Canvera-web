import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'canvera_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

let nextId = Date.now()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => loadCart())

  const addToCart = useCallback((product, config = {}) => {
    setCartItems(prev => {
      const item = {
        id: nextId++,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image || product.images?.[0],
        configStatus: config.complete ? 'complete' : 'incomplete',
        quantity: 1,
        price: config.price || product.startingPrice || 0,
        config,
        addedAt: Date.now(),
      }
      const next = [...prev, item]
      saveCart(next)
      return next
    })
  }, [])

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => {
      const next = prev.filter(i => i.id !== itemId)
      saveCart(next)
      return next
    })
  }, [])

  const updateQuantity = useCallback((itemId, qty) => {
    setCartItems(prev => {
      const next = prev.map(i => i.id === itemId ? { ...i, quantity: Math.max(1, qty) } : i)
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    saveCart([])
    setCartItems([])
  }, [])

  const cartCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems])
  const cartTotal = useMemo(() => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0), [cartItems])

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
