import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import collections from '../data/collections'
import products from '../data/products'
import { getProductThumbnail } from '../data/productImages'
import '../styles/collections.css'

function getCollectionData(collection) {
  const matched = products.filter(p =>
    collection.productNames.some(n => n.toLowerCase() === p.name.toLowerCase())
  )
  const count = matched.length
  // Get first product with a real image as the collection hero
  const heroProduct = matched.find(p => getProductThumbnail(p.slug))
  const heroImage = heroProduct ? getProductThumbnail(heroProduct.slug) : null
  return { count, heroImage, heroProduct }
}

// Staggered grid sizes for visual rhythm — avoids gaps in 3-col grid
const gridPatterns = ['wide', 'normal', 'normal', 'normal', 'wide', 'normal', 'normal', 'normal', 'wide']

export default function CollectionsPage() {
  const collectionsData = useMemo(() =>
    collections.map((col, i) => ({
      ...col,
      ...getCollectionData(col),
      gridSize: gridPatterns[i % gridPatterns.length],
    }))
  , [])

  return (
    <div className="collections-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">Collections</span>
        </nav>

        {/* Page Header */}
        <header className="coll-header">
          <span className="section-label">Our Collections</span>
          <h1 className="display-lg">Curated Ranges for Every Vision</h1>
          <p className="coll-header-sub">Each collection is crafted around a distinct material, style, and finish — designed to match your creative intent.</p>
        </header>

        {/* Staggered Grid */}
        <div className="coll-grid">
          {collectionsData.map(col => (
            <Link
              to={`/collections/${col.slug}`}
              className={`coll-card coll-card-${col.gridSize}`}
              key={col.id}
            >
              {/* Background Image */}
              {col.heroImage ? (
                <img src={col.heroImage} alt={col.name} className="coll-card-img" loading="lazy" />
              ) : (
                <div className={`coll-card-gradient coll-grad-${col.imageVariant}`} />
              )}

              {/* Overlay */}
              <div className="coll-card-overlay" />

              {/* Content */}
              <div className="coll-card-content">
                <h3 className="coll-card-name">{col.fullName}</h3>
                <p className="coll-card-desc">{col.description}</p>
                <span className="coll-card-meta">
                  {col.count > 0 ? `${col.count} product${col.count !== 1 ? 's' : ''}` : 'Coming soon'}
                  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
