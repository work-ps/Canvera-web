import { createContext, useContext, useState, useMemo, useCallback } from 'react'

const CompareContext = createContext(null)

const MAX_COMPARE = 4

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const addToCompare = useCallback((product) => {
    setCompareList(prev => {
      if (prev.length >= MAX_COMPARE) return prev
      if (prev.some(p => p.id === product.id)) return prev
      return [...prev, product]
    })
  }, [])

  const removeFromCompare = useCallback((productId) => {
    setCompareList(prev => prev.filter(p => p.id !== productId))
  }, [])

  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  const isInCompare = useCallback((productId) => {
    return compareList.some(p => p.id === productId)
  }, [compareList])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const value = useMemo(() => ({
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    isCompareFull: compareList.length >= MAX_COMPARE,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  }), [compareList, isDrawerOpen, addToCompare, removeFromCompare, clearCompare, isInCompare, openDrawer, closeDrawer])

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within a CompareProvider')
  return ctx
}
