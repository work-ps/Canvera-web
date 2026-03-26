import { useMemo, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import products from '../data/products'
import { PDPConfigProvider } from '../context/PDPConfigContext'
import PDPLayout from '../components/pdp/PDPLayout'
import '../styles/album-builder.css'

const defaultProduct = products[0]

export default function ProductConfigPage() {
  const { slug } = useParams()

  const product = useMemo(
    () => (slug ? products.find(p => p.slug === slug) : defaultProduct),
    [slug]
  )

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Invalid slug — redirect to /custom (which loads default product)
  if (slug && !product) {
    return <Navigate to="/custom" replace />
  }

  return (
    <PDPConfigProvider product={product}>
      <PDPLayout />
    </PDPConfigProvider>
  )
}
