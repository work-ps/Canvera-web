/**
 * CartContext — persistent shopping cart for Canvera
 * Stores cart items in localStorage; provides add/remove/update/clear actions.
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

function loadCart() {
  try { return JSON.parse(localStorage.getItem('canvera_cart')) || []; }
  catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  // Sync to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('canvera_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item) => {
    const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setItems(prev => [...prev, { ...item, id, quantity: item.quantity || 1 }]);
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('canvera_cart');
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, updateItem, clearCart,
      count, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
