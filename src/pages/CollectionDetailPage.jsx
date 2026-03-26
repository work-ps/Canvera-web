import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import collections from '../data/collections'
import products from '../data/products'
import { getProductThumbnail, getProductImages } from '../data/productImages'
import ProductCard from '../components/home/ProductCard'
import '../styles/collections.css'
import '../styles/product-card.css'

export default function CollectionDetailPage() {
  const { slug } = useParams()
  const collection = useMemo(() => collections.find(c => c.slug === slug), [slug])

  const collectionProducts = useMemo(() => {
    if (!collection) return []
    return products.filter(p =>
      collection.productNames.some(n => n.toLowerCase() === p.name.toLowerCase())
    )
  }, [collection])

  // Get a hero image from the collection's first product with images
  const heroImage = useMemo(() => {
    for (const p of collectionProducts) {
      const images = getProductImages(p.slug)
      if (images.length > 1) return images[1] // Use second image for variety
      if (images.length > 0) return images[0]
    }
    return null
  }, [collectionProducts])

  if (!collection) {
    return (
      <div className="collections-page">
        <div className="container" style={{ textAlign: 'center', padding: '160px 0' }}>
          <h1 className="display-md">Collection Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '16px 0 32px' }}>The collection you're looking for doesn't exist.</p>
          <Link to="/collections" className="btn btn-primary">Browse All Collections</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="collections-page">
      {/* Hero Banner */}
      <div className="cd-hero">
        {heroImage ? (
          <img src={heroImage} alt={collection.name} className="cd-hero-img" />
        ) : (
          <div className={`cd-hero-gradient coll-grad-${collection.imageVariant}`} />
        )}
        <div className="cd-hero-overlay" />
        <div className="cd-hero-content container">
          <span className="cd-hero-label">{collection.fullName}</span>
          <h1 className="cd-hero-title">{collection.name}</h1>
        </div>
      </div>

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <Link to="/collections">Collections</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{collection.name}</span>
        </nav>

        {/* Description */}
        <div className="cd-intro">
          <p className="cd-description">{collection.description}</p>
          <span className="cd-count">{collectionProducts.length} product{collectionProducts.length !== 1 ? 's' : ''} in this collection</span>
        </div>

        {/* Product Grid */}
        {collectionProducts.length > 0 ? (
          <div className="cd-products-grid">
            {collectionProducts.map(p => (
              <ProductCard key={p.id} product={p} showCompare listingMode />
            ))}
          </div>
        ) : (
          <div className="cd-empty">
            <p>Products in this collection are coming soon.</p>
            <Link to="/collections" className="btn btn-secondary">Browse Collections</Link>
          </div>
        )}

        {/* Material Story Section */}
        <div className="cd-story">
          <div className="cd-story-content">
            <span className="section-label">About This Collection</span>
            <h2 className="display-sm">The {collection.name} Experience</h2>
            <p className="cd-story-text">
              Every album in the {collection.fullName} is a testament to exceptional craftsmanship.
              From the careful selection of materials to the precision of our printing technology,
              each detail is designed to preserve your most cherished memories with elegance that lasts generations.
            </p>
            <Link to="/about" className="link-arrow">
              Learn about our craft
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="cd-back">
          <Link to="/collections" className="link-arrow" style={{ flexDirection: 'row-reverse' }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ transform: 'rotate(180deg)' }}><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            All Collections
          </Link>
        </div>
      </div>
    </div>
  )
}
