import { useEffect } from 'react'
import { useCompare } from '../../context/CompareContext'
import { productSvgs } from '../home/ProductCard'
import StarRating from '../ui/StarRating'
import '../../styles/compare.css'

const comparisonRows = [
  { label: 'Category', key: 'category' },
  { label: 'Type', key: 'tag' },
  { label: 'Rating', key: 'rating', type: 'rating' },
  { label: 'Reviews', key: 'reviewCount', type: 'reviews' },
  { label: 'Specifications', key: 'specs' },
  { label: 'Availability', key: null, type: 'availability' },
  { label: 'Delivery', key: null, type: 'delivery' },
]

export default function CompareDrawer() {
  const { compareList, removeFromCompare, isDrawerOpen, closeDrawer } = useCompare()

  // Close on Escape
  useEffect(() => {
    if (!isDrawerOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') closeDrawer()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isDrawerOpen, closeDrawer])

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isDrawerOpen])

  const cols = compareList.length
  const gridCols = `140px repeat(${cols}, 1fr)`

  const renderValue = (row, product) => {
    if (row.type === 'rating') {
      return (
        <div className="compare-rating-group">
          <StarRating rating={product.rating} />
          <span className="compare-rating-num">{product.rating}</span>
        </div>
      )
    }
    if (row.type === 'reviews') {
      return `${product.reviewCount}+ reviews`
    }
    if (row.type === 'availability') {
      return (
        <span className="compare-badge-instock">
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          In Stock
        </span>
      )
    }
    if (row.type === 'delivery') {
      return '5-7 business days'
    }
    return product[row.key] || '—'
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`compare-drawer-backdrop${isDrawerOpen ? ' open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`compare-drawer-panel${isDrawerOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Compare products"
      >
        <div className="compare-drawer-header">
          <h2>Compare Products</h2>
          <button
            className="compare-drawer-close"
            onClick={closeDrawer}
            aria-label="Close comparison"
          >
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="compare-drawer-body">
          {cols < 2 ? (
            <div className="compare-drawer-empty">
              Select at least 2 products to compare.
            </div>
          ) : (
            <div className="compare-grid" style={{ gridTemplateColumns: gridCols }}>
              {/* Product Header Row */}
              <div className="compare-header-row">
                <div className="compare-header-label" />
                {compareList.map(product => (
                  <div className="compare-header-cell" key={product.id}>
                    <div className={`compare-header-img pc-img-${product.imageVariant}`}>
                      {productSvgs[product.imageVariant] || productSvgs.petrol}
                    </div>
                    <div className="compare-header-name">{product.name}</div>
                    <div className="compare-header-tag">{product.tag}</div>
                    <button
                      className="compare-remove-btn"
                      onClick={() => removeFromCompare(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {comparisonRows.map(row => (
                <div className="compare-data-row" key={row.label}>
                  <div className="compare-row-label">{row.label}</div>
                  {compareList.map(product => (
                    <div className="compare-row-value" key={product.id}>
                      {renderValue(row, product)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
