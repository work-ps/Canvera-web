import { useMemo, useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import products from '../data/products'
import { PDPConfigProvider } from '../context/PDPConfigContext'
import PDPLayout from '../components/pdp/PDPLayout'
import { productSvgs } from '../components/home/ProductCard'
import { getProductThumbnail } from '../data/productImages'
import '../styles/album-builder.css'

const categories = [...new Set(products.map(p => p.category))]

function ProductPicker() {
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const navigate = useNavigate()

  const filtered = useMemo(
    () => products.filter(p => p.category === activeCategory),
    [activeCategory]
  )

  return (
    <div className="album-builder">
      <div className="ab-content">
        <h2 className="ab-step-title">Make Your Own</h2>
        <p className="ab-step-subtitle">Select a product to configure and order</p>

        <div className="ab-category-tabs">
          {categories.map(cat => (
            <button
              key={cat}
              className={`ab-cat-tab${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ab-product-grid">
          {filtered.map(product => {
            const svg = productSvgs[product.imageVariant] || productSvgs.petrol
            const thumb = getProductThumbnail(product.slug)
            return (
              <div
                key={product.id}
                className="ab-product-card"
                onClick={() => navigate(`/custom/${product.slug}`)}
              >
                <div className={`ab-product-card-img${thumb ? '' : ` pc-img-${product.imageVariant}`}`}>
                  {thumb ? <img src={thumb} alt={product.name} className="ab-product-card-photo" loading="lazy" /> : svg}
                </div>
                <div className="ab-product-card-body">
                  <div className="ab-product-card-tag">{product.tag}</div>
                  <div className="ab-product-card-name">{product.name}</div>
                  <div className="ab-product-card-specs">{product.specs}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ProductConfigPage() {
  const { slug } = useParams()

  const product = useMemo(
    () => (slug ? products.find(p => p.slug === slug) : null),
    [slug]
  )

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // No slug — show product picker
  if (!slug) {
    return <ProductPicker />
  }

  // Invalid slug — redirect to product picker
  if (!product) {
    return <Navigate to="/custom" replace />
  }

  return (
    <PDPConfigProvider product={product}>
      <PDPLayout />
    </PDPConfigProvider>
  )
}
