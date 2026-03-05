import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import collections from '../data/collections'
import products from '../data/products'
import ProductCard from '../components/home/ProductCard'
import '../styles/collections.css'

export default function CollectionDetailPage() {
  const { slug } = useParams()

  const collection = useMemo(() => collections.find(c => c.slug === slug), [slug])

  const collectionProducts = useMemo(() => {
    if (!collection) return []
    return products.filter(p =>
      collection.productNames.some(n => n.toLowerCase() === p.name.toLowerCase())
    )
  }, [collection])

  if (!collection) {
    return (
      <div className="collections-page">
        <div className="collections-inner" style={{ textAlign: 'center', padding: '120px 0' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--petrol-800)', marginBottom: 16 }}>Collection Not Found</h1>
          <p style={{ color: 'var(--neutral-500)', marginBottom: 24 }}>The collection you're looking for doesn't exist.</p>
          <Link to="/collections" className="btn btn-primary btn-md">Browse All Collections</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="collections-page">
      <div className="collections-inner">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/collections">Collections</Link>
          <span>/</span>
          <span className="current">{collection.name}</span>
        </div>

        <div className="collection-detail-hero">
          <div className="collection-detail-label">{collection.fullName}</div>
          <h1>{collection.name}</h1>
          <p>{collection.description}</p>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="collection-products-grid">
            {collectionProducts.map(p => (
              <ProductCard key={p.id} product={p} showCompare listingMode />
            ))}
          </div>
        ) : (
          <div className="collection-empty">
            <p>Products in this collection are coming soon.</p>
            <Link to="/collections" className="btn btn-outline btn-md">Back to Collections</Link>
          </div>
        )}

        <div className="collection-back">
          <Link to="/collections">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M10 12l-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Collections
          </Link>
        </div>
      </div>
    </div>
  )
}
