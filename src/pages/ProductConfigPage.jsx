import { useMemo, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import products from '../data/products'
import { PDPConfigProvider } from '../context/PDPConfigContext'
import PDPLayout from '../components/pdp/PDPLayout'

export default function ProductConfigPage() {
  const { slug } = useParams()

  const product = useMemo(
    () => products.find(p => p.slug === slug) || null,
    [slug]
  )

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!product) {
    return <Navigate to="/products" replace />
  }

  return (
    <PDPConfigProvider product={product}>
      <PDPLayout />
    </PDPConfigProvider>
  )
}
