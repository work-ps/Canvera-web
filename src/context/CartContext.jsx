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
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = useCallback((msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2500)
  }, [])

  /**
   * addToCart(product, config, configStatus)
   * configStatus: 'complete' | 'draft' | 'new'
   */
  const addToCart = useCallback((product, config = {}, configStatus = 'new') => {
    setCartItems(prev => {
      const item = {
        id: nextId++,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image || product.images?.[0],
        configStatus,
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

  /**
   * updateCartItemConfig(itemId, config, configStatus)
   * Updates an existing cart item's config and status.
   */
  const updateCartItemConfig = useCallback((itemId, config, configStatus) => {
    setCartItems(prev => {
      const next = prev.map(i => {
        if (i.id !== itemId) return i
        return {
          ...i,
          config: { ...i.config, ...config },
          configStatus,
          price: config.price || i.price,
        }
      })
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    saveCart([])
    setCartItems([])
  }, [])

  const cartCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems])

  // Only complete items count toward total
  const cartTotal = useMemo(() =>
    cartItems
      .filter(i => i.configStatus === 'complete')
      .reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cartItems]
  )

  // Items grouped by status
  const completeItems = useMemo(() => cartItems.filter(i => i.configStatus === 'complete'), [cartItems])
  const draftItems = useMemo(() => cartItems.filter(i => i.configStatus === 'draft'), [cartItems])
  const newItems = useMemo(() => cartItems.filter(i => i.configStatus === 'new'), [cartItems])

  const getCartItemsByStatus = useCallback((status) => {
    return cartItems.filter(i => i.configStatus === status)
  }, [cartItems])

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartItemConfig,
    clearCart,
    cartCount,
    cartTotal,
    completeItems,
    draftItems,
    newItems,
    getCartItemsByStatus,
    toastMessage,
    showToast,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, updateCartItemConfig, clearCart, cartCount, cartTotal, completeItems, draftItems, newItems, getCartItemsByStatus, toastMessage, showToast])

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
